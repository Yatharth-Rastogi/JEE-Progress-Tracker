import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, Bookmark, Clock, CheckCircle2, 
  ExternalLink, Sparkles, BookOpen, Volume2, FastForward,
  Info, AlertCircle, Save, Sliders, ChevronRight, ChevronLeft
} from 'lucide-react';
import { Chapter, VideoBookmark, Subject } from '../types/jee';
import { extractYouTubeVideoId, formatSeconds } from '../utils/calculations';
import { getCuratedVideo, getValidVideoUrlForChapter, isKnownInvalidUrl } from '../data/curatedVideos';

// Declaration for YouTube Iframe API
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YouTubeTrackerProps {
  chapters: Chapter[];
  activeChapterId: string;
  onSelectChapter: (id: string) => void;
  onUpdateChapter: (chapterId: string, updates: Partial<Chapter>) => void;
}

export const YouTubeTracker: React.FC<YouTubeTrackerProps> = ({
  chapters,
  activeChapterId,
  onSelectChapter,
  onUpdateChapter,
}) => {
  const currentChapter = chapters.find((c) => c.id === activeChapterId) || chapters[0];

  const [inputUrl, setInputUrl] = useState(currentChapter?.videoUrl || '');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(currentChapter?.videoCurrentTime || 0);
  const [duration, setDuration] = useState<number>(currentChapter?.videoDuration || 0);
  const [manualPercent, setManualPercent] = useState<number>(currentChapter?.theoryPercent || 0);
  const [bookmarkNote, setBookmarkNote] = useState('');
  const [theoryNotes, setTheoryNotes] = useState(currentChapter?.theoryNotes || '');
  const [apiReady, setApiReady] = useState(false);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<Subject | 'All'>('All');

  const playerRef = useRef<any>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);

  // Sync inputs when active chapter changes
  useEffect(() => {
    if (currentChapter) {
      const validUrl = getValidVideoUrlForChapter(currentChapter.id, currentChapter.videoUrl);
      setInputUrl(validUrl);
      if (validUrl !== currentChapter.videoUrl) {
        onUpdateChapter(currentChapter.id, { videoUrl: validUrl });
      }
      setCurrentTime(currentChapter.videoCurrentTime || 0);
      setDuration(currentChapter.videoDuration || 0);
      setManualPercent(currentChapter.theoryPercent || 0);
      setTheoryNotes(currentChapter.theoryNotes || '');
      setPlayerError(null);
    }
  }, [currentChapter?.id]);

  // Load YouTube IFrame API script once
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setApiReady(true);
      return;
    }

    const existingScript = document.getElementById('youtube-iframe-api');
    if (!existingScript) {
      const tag = document.createElement('script');
      tag.id = 'youtube-iframe-api';
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const previousOnReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (previousOnReady) previousOnReady();
      setApiReady(true);
    };

    // Fallback check if already loaded
    const checkInterval = setInterval(() => {
      if (window.YT && window.YT.Player) {
        setApiReady(true);
        clearInterval(checkInterval);
      }
    }, 400);

    return () => clearInterval(checkInterval);
  }, []);

  const videoId = extractYouTubeVideoId(inputUrl);

  // Initialize or update YouTube Player safely
  useEffect(() => {
    if (!apiReady || !videoId || !playerContainerRef.current) return;

    let destroyed = false;

    // Clean any prior player instance
    if (playerRef.current) {
      try {
        if (typeof playerRef.current.destroy === 'function') {
          playerRef.current.destroy();
        }
      } catch (_) {
        // safely ignore
      }
      playerRef.current = null;
    }

    // Insert an unmanaged mount node so React's virtual DOM is completely decoupled from YouTube's iframe replacement
    playerContainerRef.current.innerHTML = '<div id="yt-player-embed-target" style="width:100%;height:100%;"></div>';

    try {
      playerRef.current = new window.YT.Player('yt-player-embed-target', {
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
          start: Math.floor(currentChapter.videoCurrentTime || 0),
        },
        events: {
          onReady: (event: any) => {
            if (destroyed) return;
            try {
              const dur = event.target?.getDuration?.();
              if (typeof dur === 'number' && dur > 0) {
                setDuration(Math.round(dur));
                onUpdateChapter(currentChapter.id, { videoDuration: Math.round(dur) });
              }
              if (currentChapter.videoCurrentTime && currentChapter.videoCurrentTime > 0) {
                event.target?.seekTo?.(currentChapter.videoCurrentTime, false);
              }
            } catch (_) {
              // ignore
            }
          },
          onStateChange: (event: any) => {
            if (destroyed) return;
            // YT.PlayerState: -1 unstarted, 0 ended, 1 playing, 2 paused, 3 buffering, 5 video cued
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
              startTracking();
            } else {
              setIsPlaying(false);
              stopTracking();
              // Save final state on pause or finish
              if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
                try {
                  const currentSec = Math.round(playerRef.current.getCurrentTime() || 0);
                  const dur = Math.round(playerRef.current.getDuration() || duration || 0);
                  savePlaybackState(currentSec, dur);
                } catch (_) {}
              }
            }

            if (event.data === window.YT.PlayerState.ENDED) {
              onUpdateChapter(currentChapter.id, {
                theoryPercent: 100,
                theoryStatus: 'Completed',
              });
              setManualPercent(100);
            }
          },
          onError: (e: any) => {
            // Note: Never log raw event object 'e' to console.error, as it contains circular DOM node references
            const errCode = e && typeof e.data === 'number' ? e.data : undefined;
            if (errCode === 100 || errCode === 2) {
              setPlayerError(
                'This video link is unavailable or removed on YouTube. Click "Load Verified Lecture" below to immediately switch to our tested community one-shot.'
              );
            } else if (errCode === 101 || errCode === 150) {
              setPlayerError(
                'This video publisher restricts direct embedded playback. You can open it on YouTube using the button above or load our verified community one-shot.'
              );
            } else {
              setPlayerError(
                'Video playback notice: You can load our tested community one-shot below or watch on YouTube directly.'
              );
            }
          },
        },
      });
    } catch (_) {
      // safely handled
    }

    return () => {
      destroyed = true;
      stopTracking();
      if (playerRef.current) {
        try {
          if (typeof playerRef.current.destroy === 'function') {
            playerRef.current.destroy();
          }
        } catch (_) {}
        playerRef.current = null;
      }
      if (playerContainerRef.current) {
        playerContainerRef.current.innerHTML = '';
      }
    };
  }, [apiReady, videoId, currentChapter.id]);

  const startTracking = () => {
    stopTracking();
    intervalRef.current = window.setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        const sec = Math.round(playerRef.current.getCurrentTime());
        const dur = Math.round(playerRef.current.getDuration() || 0);

        setCurrentTime(sec);
        if (dur > 0 && dur !== duration) {
          setDuration(dur);
        }

        if (dur > 0) {
          // Auto Progress Formula: Theory Completion % = min(100, (Current Time Logged / Total Duration) * 100)
          const autoPercent = Math.min(100, Math.round((sec / dur) * 100));
          setManualPercent(autoPercent);

          const status = autoPercent >= 98 ? 'Completed' : autoPercent > 0 ? 'In Progress' : 'Not Started';

          onUpdateChapter(currentChapter.id, {
            videoCurrentTime: sec,
            videoDuration: dur,
            theoryPercent: autoPercent,
            theoryStatus: status,
          });
        }
      }
    }, 1000);
  };

  const stopTracking = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const savePlaybackState = (sec: number, dur: number) => {
    if (dur > 0) {
      const autoPercent = Math.min(100, Math.round((sec / dur) * 100));
      const status = autoPercent >= 98 ? 'Completed' : autoPercent > 0 ? 'In Progress' : 'Not Started';
      onUpdateChapter(currentChapter.id, {
        videoCurrentTime: sec,
        videoDuration: dur,
        theoryPercent: autoPercent,
        theoryStatus: status,
      });
    } else {
      onUpdateChapter(currentChapter.id, {
        videoCurrentTime: sec,
      });
    }
  };

  const handleSeek = (seconds: number) => {
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      playerRef.current.seekTo(seconds, true);
      setCurrentTime(seconds);
    }
  };

  const handleManualPercentChange = (val: number) => {
    setManualPercent(val);
    const status = val >= 98 ? 'Completed' : val > 0 ? 'In Progress' : 'Not Started';
    onUpdateChapter(currentChapter.id, {
      theoryPercent: val,
      theoryStatus: status,
    });
  };

  const handleSaveUrl = () => {
    onUpdateChapter(currentChapter.id, {
      videoUrl: inputUrl,
    });
  };

  const handleAddBookmark = () => {
    if (!bookmarkNote.trim() && currentTime === 0) return;
    const newBookmark: VideoBookmark = {
      id: 'bm-' + Date.now(),
      timeSeconds: currentTime,
      label: bookmarkNote.trim() || `Bookmark at ${formatSeconds(currentTime)}`,
      timestampFormatted: formatSeconds(currentTime),
      createdAt: new Date().toISOString(),
    };

    const existingBookmarks = currentChapter.bookmarks || [];
    onUpdateChapter(currentChapter.id, {
      bookmarks: [...existingBookmarks, newBookmark],
    });
    setBookmarkNote('');
  };

  const handleDeleteBookmark = (bmId: string) => {
    const updated = (currentChapter.bookmarks || []).filter((b) => b.id !== bmId);
    onUpdateChapter(currentChapter.id, { bookmarks: updated });
  };

  const handleSaveNotes = () => {
    onUpdateChapter(currentChapter.id, { theoryNotes });
  };

  const filteredChapters = chapters.filter(
    (c) => selectedSubjectFilter === 'All' || c.subject === selectedSubjectFilter
  );

  const curatedVideo = getCuratedVideo(currentChapter.id);

  const handlePrevChapter = () => {
    const list = filteredChapters.length > 0 ? filteredChapters : chapters;
    const currentIndex = list.findIndex((c) => c.id === currentChapter.id);
    if (currentIndex > 0) {
      onSelectChapter(list[currentIndex - 1].id);
    } else {
      onSelectChapter(list[list.length - 1].id);
    }
  };

  const handleNextChapter = () => {
    const list = filteredChapters.length > 0 ? filteredChapters : chapters;
    const currentIndex = list.findIndex((c) => c.id === currentChapter.id);
    if (currentIndex >= 0 && currentIndex < list.length - 1) {
      onSelectChapter(list[currentIndex + 1].id);
    } else {
      onSelectChapter(list[0].id);
    }
  };

  // Helper to cleanly separate main title and parenthetical subtopic metadata
  const splitChapterTitle = (fullName: string) => {
    const match = fullName.match(/^(.*?)\s*\((.*?)\)$/);
    if (match) {
      return {
        mainTitle: match[1].trim(),
        subtitle: match[2].trim(),
      };
    }
    return {
      mainTitle: fullName,
      subtitle: null,
    };
  };

  const { mainTitle, subtitle } = splitChapterTitle(currentChapter.name);

  return (
    <div className="space-y-6">
      {/* Header Bar with Chapter Selector */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-5">
          {/* Chapter Title & Hierarchical Badges */}
          <div className="space-y-2 flex-1 min-w-0">
            {/* Top Structured Badge Row */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 text-cyan-400 text-[11px] font-bold uppercase tracking-wider bg-cyan-950/70 border border-cyan-800/60 px-2.5 py-0.5 rounded-lg">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Theory Mastery</span>
              </div>

              <span className={`text-[11px] px-2.5 py-0.5 rounded-lg font-bold border ${
                currentChapter.subject === 'Physics' ? 'bg-indigo-950/90 text-indigo-300 border-indigo-700/60' :
                currentChapter.subject === 'Chemistry' ? 'bg-emerald-950/90 text-emerald-300 border-emerald-700/60' :
                'bg-cyan-950/90 text-cyan-300 border-cyan-700/60'
              }`}>
                {currentChapter.subject}
              </span>

              <span className="text-[11px] px-2.5 py-0.5 rounded-lg font-medium bg-slate-800/80 text-slate-300 border border-slate-700">
                {currentChapter.unit}
              </span>

              <span className={`text-[11px] px-2.5 py-0.5 rounded-lg font-bold border ${
                currentChapter.priority === 'Critical' ? 'bg-rose-950/90 text-rose-300 border-rose-700/60' :
                currentChapter.priority === 'High' ? 'bg-amber-950/90 text-amber-300 border-amber-700/60' :
                'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {currentChapter.priority} Priority
              </span>

              <span className="text-[11px] px-2.5 py-0.5 rounded-lg font-mono text-cyan-300 bg-slate-950/90 border border-slate-800">
                Ch #{currentChapter.id.split('-')[1]}
              </span>
            </div>

            {/* Main Headline & Subtitle */}
            <div className="pt-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-snug break-words">
                {mainTitle}
              </h1>
              {subtitle && (
                <div className="mt-1.5 flex items-start gap-1.5 text-xs text-slate-300">
                  <span className="text-cyan-400 font-semibold shrink-0">Key Topics:</span>
                  <span className="text-slate-300 bg-slate-950/80 border border-slate-800 px-2 py-0.5 rounded-md font-mono text-[11px] leading-relaxed">
                    {subtitle}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Subject Filter + Quick Jump Navigation */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 xl:self-start shrink-0 pt-1">
            {/* Subject Filter Pills */}
            <div className="flex rounded-xl bg-slate-950/90 p-1 border border-slate-800 self-start sm:self-auto">
              {(['All', 'Physics', 'Chemistry', 'Mathematics'] as const).map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubjectFilter(sub)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    selectedSubjectFilter === sub
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {sub === 'Mathematics' ? 'Maths' : sub}
                </button>
              ))}
            </div>

            {/* Prev / Dropdown / Next Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevChapter}
                title="Previous Chapter"
                className="p-2 rounded-xl bg-slate-950/90 border border-slate-700/80 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/50 transition-colors shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="relative flex-1 sm:flex-initial">
                <select
                  value={currentChapter.id}
                  onChange={(e) => onSelectChapter(e.target.value)}
                  className="w-full sm:w-72 lg:w-80 bg-slate-950/90 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 truncate cursor-pointer shadow-sm"
                >
                  {filteredChapters.map((c) => (
                    <option key={c.id} value={c.id}>
                      [{c.subject.slice(0, 1)}] {c.name} ({c.theoryPercent}%)
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleNextChapter}
                title="Next Chapter"
                className="p-2 rounded-xl bg-slate-950/90 border border-slate-700/80 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/50 transition-colors shadow-sm"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Video URL Input & Preset Controls */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col md:flex-row gap-2.5 items-stretch">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Paste YouTube Lecture / One-Shot URL (e.g. https://www.youtube.com/watch?v=...)"
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-xl pl-3 pr-24 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
            />
            {inputUrl && (
              <a
                href={inputUrl}
                target="_blank"
                rel="noreferrer"
                className="absolute right-2 top-1.5 text-slate-400 hover:text-cyan-400 text-xs flex items-center gap-1 bg-slate-800/90 hover:bg-slate-700 px-2 py-1 rounded-lg border border-slate-700 transition-colors"
              >
                Open <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveUrl}
              className="flex-1 sm:flex-initial px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-colors border border-slate-700 flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Save className="w-3.5 h-3.5 text-cyan-400" />
              Set Video
            </button>

            <button
              onClick={() => {
                setInputUrl(curatedVideo.url);
                setPlayerError(null);
                onUpdateChapter(currentChapter.id, { videoUrl: curatedVideo.url });
              }}
              title="Load curated high-yield PW Manzil / community lecture"
              className="px-3.5 py-2 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-700/60 text-cyan-300 hover:text-cyan-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Load</span> Verified Preset
            </button>
          </div>
        </div>
      </div>

      {/* Main Study Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: YouTube Player & Video Stats */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl overflow-hidden">
            {/* Player Container */}
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-slate-800 shadow-inner flex items-center justify-center">
              <div
                ref={playerContainerRef}
                className={`w-full h-full ${!videoId ? 'hidden' : 'block'}`}
              />
              {!videoId && (
                <div className="text-center p-6 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-slate-800/80 flex items-center justify-center mx-auto text-cyan-400 border border-slate-700">
                    <Play className="w-8 h-8 ml-1" />
                  </div>
                  <h3 className="text-white font-semibold">No YouTube Video Configured</h3>
                  <p className="text-slate-400 text-xs max-w-md mx-auto">
                    Paste a YouTube link above or select one of the high-yield curated presets below to start studying and tracking auto-progress.
                  </p>
                </div>
              )}
            </div>

            {playerError && (
              <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300 text-xs space-y-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                  <span className="leading-relaxed">{playerError}</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1 border-t border-amber-500/20">
                  <button
                    onClick={() => {
                      setInputUrl(curatedVideo.url);
                      setPlayerError(null);
                      onUpdateChapter(currentChapter.id, { videoUrl: curatedVideo.url });
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    Load Verified {curatedVideo.channel} Lecture
                  </button>
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(curatedVideo.searchQuery)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs transition-colors"
                  >
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                    Search on YouTube
                  </a>
                </div>
              </div>
            )}

            {/* Playback Progress Indicator & Fast Action Controls */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono text-cyan-300">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{formatSeconds(currentTime)}</span>
                  <span className="text-slate-500">/</span>
                  <span className="text-slate-400">{formatSeconds(duration)}</span>
                </div>

                {currentChapter.videoCurrentTime && currentChapter.videoCurrentTime > 0 && (
                  <button
                    onClick={() => handleSeek(currentChapter.videoCurrentTime || 0)}
                    className="px-3 py-1.5 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-700/50 text-cyan-300 text-xs rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Resume from {formatSeconds(currentChapter.videoCurrentTime)}
                  </button>
                )}
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Theory Status:</span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                  currentChapter.theoryStatus === 'Completed'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                    : currentChapter.theoryStatus === 'In Progress'
                    ? 'bg-amber-950 text-amber-300 border-amber-700'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {currentChapter.theoryStatus} ({currentChapter.theoryPercent}%)
                </span>
              </div>
            </div>

            {/* Manual Override Slider */}
            <div className="mt-4 p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                  Manual Theory Completion Override
                </span>
                <span className="font-mono font-bold text-cyan-400">{manualPercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={manualPercent}
                onChange={(e) => handleManualPercentChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>0% (Not Started)</span>
                <span>50% (Midway)</span>
                <span>100% (Fully Mastered)</span>
              </div>
            </div>
          </div>

          {/* Quick Notes for this Chapter */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                Lecture Key Takeaways & Derivation Notes
              </h3>
              <button
                onClick={handleSaveNotes}
                className="text-xs px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded transition-colors"
              >
                Save Notes
              </button>
            </div>
            <textarea
              value={theoryNotes}
              onChange={(e) => setTheoryNotes(e.target.value)}
              placeholder="Jot down key formula conditions, boundary values, standard traps, or teacher caveats..."
              rows={4}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
            />
          </div>
        </div>

        {/* Right Column: Bookmarks, Prereqs, and Suggested Videos */}
        <div className="lg:col-span-4 space-y-4">
          {/* Timestamp Bookmarks Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
              <Bookmark className="w-4 h-4 text-cyan-400" />
              Timestamp Bookmarks
            </h3>

            {/* Add Bookmark form */}
            <div className="space-y-2 mb-4 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-cyan-300 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                  {formatSeconds(currentTime)}
                </span>
                <input
                  type="text"
                  value={bookmarkNote}
                  onChange={(e) => setBookmarkNote(e.target.value)}
                  placeholder="e.g. Inelastic Collision Derivation"
                  className="flex-1 bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
              <button
                onClick={handleAddBookmark}
                className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-medium rounded transition-colors flex items-center justify-center gap-1 border border-slate-700"
              >
                <Bookmark className="w-3 h-3 text-cyan-400" />
                Bookmark Current Second ({formatSeconds(currentTime)})
              </button>
            </div>

            {/* Bookmarks List */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {!currentChapter.bookmarks || currentChapter.bookmarks.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4 italic">
                  No bookmarks saved yet. Pause the lecture and bookmark key formulas!
                </p>
              ) : (
                currentChapter.bookmarks.map((bm) => (
                  <div
                    key={bm.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-colors text-xs"
                  >
                    <button
                      onClick={() => handleSeek(bm.timeSeconds)}
                      className="flex items-center gap-2 text-left truncate flex-1 hover:text-cyan-300"
                    >
                      <span className="font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/50">
                        {bm.timestampFormatted}
                      </span>
                      <span className="truncate text-slate-200">{bm.label}</span>
                    </button>
                    <button
                      onClick={() => handleDeleteBookmark(bm.id)}
                      className="text-slate-500 hover:text-rose-400 ml-2 p-1"
                      title="Delete bookmark"
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chapter Metadata & Prerequisites */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-400" />
              Syllabus Context
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Subject:</span>
                <span className="font-semibold text-white">{currentChapter.subject}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Unit:</span>
                <span className="text-slate-200">{currentChapter.unit}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">JEE Priority:</span>
                <span className={`font-semibold ${
                  currentChapter.priority === 'Critical' ? 'text-rose-400' :
                  currentChapter.priority === 'High' ? 'text-amber-400' : 'text-slate-300'
                }`}>
                  {currentChapter.priority}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Prerequisites:</span>
                <div className="flex flex-wrap gap-1.5">
                  {currentChapter.prerequisites && currentChapter.prerequisites.length > 0 ? (
                    currentChapter.prerequisites.map((p, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[11px] border border-slate-700"
                      >
                        {p}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500 italic">None (Foundation Chapter)</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Suggested High-Yield Lectures */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                High-Yield One-Shot Presets
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-700/50">
                Verified Playable
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Click to load top community-verified, full-chapter one-shot for {currentChapter.name}:
            </p>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setInputUrl(curatedVideo.url);
                  setPlayerError(null);
                  onUpdateChapter(currentChapter.id, { videoUrl: curatedVideo.url });
                }}
                className="w-full text-left p-3 rounded-xl bg-slate-950/90 border border-cyan-500/40 hover:border-cyan-400 hover:bg-slate-800/60 text-xs transition-all flex items-center justify-between group shadow-sm"
              >
                <div className="space-y-1 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      Default Curated One-Shot
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${
                      curatedVideo.badge === 'PW Manzil 2026'
                        ? 'bg-indigo-950 text-indigo-300 border-indigo-700'
                        : 'bg-cyan-950 text-cyan-300 border-cyan-800'
                    }`}>
                      {curatedVideo.badge || curatedVideo.channel}
                    </span>
                    {curatedVideo.durationEstimate && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        ~{curatedVideo.durationEstimate}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-300 line-clamp-1 font-medium">
                    {curatedVideo.title}
                  </div>
                  <div className="text-[11px] text-cyan-400/90 flex items-center gap-1 font-sans">
                    <Play className="w-3 h-3 fill-cyan-400 text-cyan-400" /> Click to play inside Study Room
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0" />
              </button>

              {/* Alternative Presets for Chapters with 2 parts (e.g. Chemical vs Ionic Eq, Electrochemistry vs Redox) */}
              {curatedVideo.alternatives && curatedVideo.alternatives.map((alt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputUrl(alt.url);
                    setPlayerError(null);
                    onUpdateChapter(currentChapter.id, { videoUrl: alt.url });
                  }}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-800/50 text-xs transition-all flex items-center justify-between group"
                >
                  <div className="space-y-0.5 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                        {alt.badge || 'Alternative Preset'}
                      </span>
                      {alt.durationEstimate && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          ~{alt.durationEstimate}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">
                      {alt.title}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0" />
                </button>
              ))}

              {/* Official Manzil Playlist Links */}
              {currentChapter.subject === 'Physics' ? (
                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>Official PW Manzil Physics Playlists:</span>
                  </div>
                  <a
                    href="https://www.youtube.com/playlist?list=PLxyGaR3hEy3ieFuXAdtlenRNcey9Cxo6I"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full p-2 rounded-xl bg-cyan-950/40 border border-cyan-700/50 hover:bg-cyan-900/40 text-xs text-cyan-300 hover:text-cyan-200 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span className="font-semibold">Manzil 2026 Physics (Saleem & RJ Sir)</span>
                    </div>
                    <span className="text-[10px] text-cyan-400 font-mono">Open ↗</span>
                  </a>
                  <a
                    href="https://www.youtube.com/playlist?list=PLxyGaR3hEy3gYPGsrnKx-XAi3yV6rocEx"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full p-2 rounded-xl bg-indigo-950/40 border border-indigo-700/50 hover:bg-indigo-900/40 text-xs text-indigo-300 hover:text-indigo-200 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-400" />
                      <span className="font-semibold">Manzil 2025 Physics (Saleem & RJ Sir)</span>
                    </div>
                    <span className="text-[10px] text-indigo-400 font-mono">Open ↗</span>
                  </a>
                  <a
                    href="https://www.youtube.com/playlist?list=PLxyGaR3hEy3gvV4VbbP8pza7MtoJkGu6M"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full p-2 rounded-xl bg-slate-950/80 border border-slate-700 hover:border-slate-600 text-xs text-slate-300 hover:text-white transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="font-semibold">Manzil Comeback Physics (Detailed)</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Open ↗</span>
                  </a>
                </div>
              ) : curatedVideo.playlistUrl ? (
                <a
                  href={curatedVideo.playlistUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-700/50 hover:bg-indigo-900/40 text-xs text-indigo-300 hover:text-indigo-200 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="font-medium">{curatedVideo.playlistName || 'PW Manzil Playlist'}</span>
                  </div>
                  <span className="text-[10px] text-indigo-400 font-mono">Open Playlist ↗</span>
                </a>
              ) : null}

              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(curatedVideo.searchQuery)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 text-xs text-slate-300 hover:text-white transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  <span>Search Other Lectures on YouTube</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">Open Search ↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
