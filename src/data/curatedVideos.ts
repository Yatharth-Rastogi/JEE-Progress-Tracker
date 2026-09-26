// User Requested Detailed Physics Playlists (Saleem Sir & Rajwant Sir)
export const PW_MANZIL_2025_PHYSICS_PLAYLIST_URL = 'https://www.youtube.com/playlist?list=PLxyGaR3hEy3gYPGsrnKx-XAi3yV6rocEx';
export const PW_MANZIL_COMEBACK_PHYSICS_PLAYLIST_URL = 'https://www.youtube.com/playlist?list=PLxyGaR3hEy3gvV4VbbP8pza7MtoJkGu6M';
export const PW_MANZIL_2026_PHYSICS_PLAYLIST_URL = 'https://www.youtube.com/playlist?list=PLxyGaR3hEy3ieFuXAdtlenRNcey9Cxo6I';
export const PW_MANZIL_PHYSICS_PLAYLIST_URL = PW_MANZIL_2026_PHYSICS_PLAYLIST_URL;

export const PW_MANZIL_2026_PHYSICAL_CHEM_PLAYLIST_URL = 'https://www.youtube.com/playlist?list=PLxyGaR3hEy3hVmPjmool3j3U78cTYxYq-';
export const PW_MANZIL_2026_INORGANIC_CHEM_PLAYLIST_URL = 'https://www.youtube.com/playlist?list=PLxyGaR3hEy3hUTwPWVhqBOR0l_1o3vyCs';
export const PW_MANZIL_2025_ORGANIC_CHEM_PLAYLIST_URL = 'https://www.youtube.com/playlist?list=PLxyGaR3hEy3joVGFUCCKG5BIKBSBW5ihL';
export const PW_MANZIL_2025_MATH_PLAYLIST_URL = 'https://www.youtube.com/playlist?list=PLxyGaR3hEy3g9e9Q4rR3a6v7mZ2Lq6k8u';
export const PW_MANZIL_2026_PLAYLIST_URL = PW_MANZIL_2026_PHYSICAL_CHEM_PLAYLIST_URL;

export interface VideoPreset {
  videoId: string;
  url: string;
  title: string;
  channel: string;
  durationEstimate?: string;
  badge?: string;
}

export interface CuratedVideo extends VideoPreset {
  id: string;
  searchQuery: string;
  playlistUrl?: string;
  playlistName?: string;
  alternatives?: VideoPreset[];
}

export const CURATED_CHAPTER_VIDEOS: Record<string, CuratedVideo> = {
  // ==========================================
  // PHYSICS (22 Chapters - Exact Manzil One-Shot URLs provided by User)
  // ==========================================
  'phy-01': {
    id: 'phy-01',
    videoId: 'wuI3MWvr0dY',
    url: 'https://www.youtube.com/watch?v=wuI3MWvr0dY',
    title: 'UNITS & MEASUREMENTS in One Shot | All Concepts & PYQs Covered | Class 11 Physics',
    channel: 'PW Manzil (Rajwant Sir)',
    durationEstimate: '4h 40m',
    badge: 'PW Manzil (Rajwant Sir)',
    playlistUrl: PW_MANZIL_2025_PHYSICS_PLAYLIST_URL,
    playlistName: 'PW Manzil 2025 Physics Playlist',
    searchQuery: 'UNITS & MEASUREMENTS in One Shot All Concepts & PYQs Covered Class 11 Physics Rajwant Sir',
    alternatives: [
      {
        videoId: '2i0p2tidN88',
        url: 'https://www.youtube.com/watch?v=2i0p2tidN88',
        title: 'Manzil 2025: BASIC MATHEMATICS in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
        channel: 'PW Manzil (Saleem Sir)',
        durationEstimate: '6h 15m',
        badge: 'Basic Maths Foundation',
      },
    ],
  },
  'phy-02': {
    id: 'phy-02',
    videoId: 'v-kDOGM3214',
    url: 'https://www.youtube.com/watch?v=v-kDOGM3214',
    title: 'MOTION IN A STRAIGHT LINE in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil (Saleem Sir)',
    durationEstimate: '7h 30m',
    badge: 'PW Manzil (Saleem Sir)',
    playlistUrl: PW_MANZIL_2026_PHYSICS_PLAYLIST_URL,
    playlistName: 'PW Manzil 2026 Physics Playlist',
    searchQuery: 'MOTION IN A STRAIGHT LINE in One Shot All Concepts & PYQs Covered Saleem Sir',
    alternatives: [
      {
        videoId: 'U-tlb7_vnhM',
        url: 'https://www.youtube.com/watch?v=U-tlb7_vnhM',
        title: 'MOTION IN A PLANE in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
        channel: 'PW Manzil (Saleem Sir)',
        durationEstimate: '6h 45m',
        badge: 'Motion in a Plane (2D)',
      },
      {
        videoId: 'griSf2U_Zlk',
        url: 'https://www.youtube.com/watch?v=griSf2U_Zlk',
        title: 'CIRCULAR MOTION in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
        channel: 'PW Manzil (Saleem Sir)',
        durationEstimate: '4h 10m',
        badge: 'Circular Motion',
      },
    ],
  },
  'phy-03': {
    id: 'phy-03',
    videoId: 'mE8w2uxm6XY',
    url: 'https://www.youtube.com/watch?v=mE8w2uxm6XY',
    title: 'LAWS OF MOTION in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil (Saleem Sir)',
    durationEstimate: '8h 45m',
    badge: 'PW Manzil (Saleem Sir)',
    playlistUrl: PW_MANZIL_2026_PHYSICS_PLAYLIST_URL,
    playlistName: 'PW Manzil 2026 Physics Playlist',
    searchQuery: 'LAWS OF MOTION in One Shot All Concepts & PYQs Covered Saleem Sir',
  },
  'phy-04': {
    id: 'phy-04',
    videoId: 'PAlXOkn_Pa8',
    url: 'https://www.youtube.com/watch?v=PAlXOkn_Pa8',
    title: 'WORK, ENERGY & POWER in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil (Saleem Sir)',
    durationEstimate: '6h 30m',
    badge: 'PW Manzil (Saleem Sir)',
    playlistUrl: PW_MANZIL_2026_PHYSICS_PLAYLIST_URL,
    playlistName: 'PW Manzil 2026 Physics Playlist',
    searchQuery: 'WORK, ENERGY & POWER in One Shot All Concepts & PYQs Covered Saleem Sir',
  },
  'phy-05': {
    id: 'phy-05',
    videoId: '7xy0V3FjxdY',
    url: 'https://www.youtube.com/watch?v=7xy0V3FjxdY',
    title: 'CENTRE OF MASS in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil (Saleem Sir)',
    durationEstimate: '7h 20m',
    badge: 'PW Manzil (Saleem Sir)',
    playlistUrl: PW_MANZIL_2025_PHYSICS_PLAYLIST_URL,
    playlistName: 'PW Manzil 2025 Physics Playlist',
    searchQuery: 'CENTRE OF MASS in One Shot All Concepts & PYQs Covered Saleem Sir',
  },
  'phy-06': {
    id: 'phy-06',
    videoId: 'UsHUxG90f_4',
    url: 'https://www.youtube.com/watch?v=UsHUxG90f_4',
    title: 'ROTATIONAL MOTION in One Shot: All Concepts & PYQs Covered || JEE Main & Advanced',
    channel: 'PW Manzil (Saleem Sir)',
    durationEstimate: '9h 40m',
    badge: 'PW Manzil (Saleem Sir)',
    playlistUrl: PW_MANZIL_2025_PHYSICS_PLAYLIST_URL,
    playlistName: 'PW Manzil 2025 Physics Playlist',
    searchQuery: 'ROTATIONAL MOTION in One Shot All Concepts & PYQs Covered Saleem Sir',
  },
  'phy-07': {
    id: 'phy-07',
    videoId: 'wE0xrUuJLnk',
    url: 'https://www.youtube.com/watch?v=wE0xrUuJLnk',
    title: 'GRAVITATION in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil (Rajwant Sir)',
    durationEstimate: '5h 15m',
    badge: 'PW Manzil (Rajwant Sir)',
    playlistUrl: PW_MANZIL_2025_PHYSICS_PLAYLIST_URL,
    playlistName: 'PW Manzil 2025 Physics Playlist',
    searchQuery: 'GRAVITATION in One Shot All Concepts & PYQs Covered Rajwant Sir',
  },
  'phy-08': {
    id: 'phy-08',
    videoId: 'gziRcxMiO_Q',
    url: 'https://www.youtube.com/watch?v=gziRcxMiO_Q',
    title: 'MECHANICAL PROPERTIES OF SOLID & FLUID in One Shot: All Concept & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil (Saleem Sir)',
    durationEstimate: '8h 30m',
    badge: 'PW Manzil (Saleem Sir)',
    playlistUrl: PW_MANZIL_2025_PHYSICS_PLAYLIST_URL,
    playlistName: 'PW Manzil 2025 Physics Playlist',
    searchQuery: 'MECHANICAL PROPERTIES OF SOLID & FLUID in One Shot Saleem Sir',
  },
  'phy-09': {
    id: 'phy-09',
    videoId: 'UYfR15GpKIs',
    url: 'https://www.youtube.com/watch?v=UYfR15GpKIs',
    title: 'THERMAL PROPERTIES OF MATTER in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil (Rajwant Sir)',
    durationEstimate: '6h 15m',
    badge: 'PW Manzil (Rajwant Sir)',
    playlistUrl: PW_MANZIL_2025_PHYSICS_PLAYLIST_URL,
    playlistName: 'PW Manzil 2025 Physics Playlist',
    searchQuery: 'THERMAL PROPERTIES OF MATTER in One Shot All Concepts & PYQs Covered Rajwant Sir',
  },
  'phy-10': {
    id: 'phy-10',
    videoId: 'JAvi2K_DbbI',
    url: 'https://www.youtube.com/watch?v=JAvi2K_DbbI',
    title: 'KTG & THERMODYNAMICS in one Shot: All Concepts & PYQs Covered || JEE Main & Advanced',
    channel: 'PW Manzil (Saleem Sir)',
    durationEstimate: '7h 45m',
    badge: 'PW Manzil (Saleem Sir)',
    playlistUrl: PW_MANZIL_2025_PHYSICS_PLAYLIST_URL,
    playlistName: 'PW Manzil 2025 Physics Playlist',
    searchQuery: 'KTG & THERMODYNAMICS in one Shot All Concepts & PYQs Covered Saleem Sir',
  },
  'phy-11': {
    id: 'phy-11',
    videoId: 'bv8qBsHK9bM',
    url: 'https://www.youtube.com/watch?v=bv8qBsHK9bM',
    title: 'OSCILLATIONS in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil (Saleem Sir)',
    durationEstimate: '6h 40m',
    badge: 'PW Manzil (Saleem Sir)',
    playlistUrl: PW_MANZIL_2025_PHYSICS_PLAYLIST_URL,
    playlistName: 'PW Manzil 2025 Physics Playlist',
    searchQuery: 'OSCILLATIONS in One Shot All Concepts & PYQs Covered Saleem Sir',
  },
  'phy-12': {
    id: 'phy-12',
    videoId: 'p3vMfyGjfcM',
    url: 'https://www.youtube.com/watch?v=p3vMfyGjfcM',
    title: 'Waves | Full Chapter in ONE SHOT | Chapter 14 | Class 11 Physics',
    channel: 'PW Manzil (Rajwant Sir)',
    durationEstimate: '7h 20m',
    badge: 'PW Manzil (Rajwant Sir)',
    playlistUrl: PW_MANZIL_2025_PHYSICS_PLAYLIST_URL,
    playlistName: 'PW Manzil 2025 Physics Playlist',
    searchQuery: 'Waves Full Chapter in ONE SHOT Chapter 14 Class 11 Physics Rajwant Sir',
  },
  'phy-13': {
    id: 'phy-13',
    videoId: 'GLEZZdGwuXU',
    url: 'https://www.youtube.com/watch?v=GLEZZdGwuXU',
    title: 'ELECTRIC CHARGES AND FIELDS in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil (Saleem Sir)',
    durationEstimate: '9h 15m',
    badge: 'PW Manzil (Saleem Sir)',
    playlistUrl: PW_MANZIL_2026_PHYSICS_PLAYLIST_URL,
    playlistName: 'PW Manzil 2026 Physics Playlist',
    searchQuery: 'ELECTRIC CHARGES AND FIELDS in One Shot All Concepts & PYQs Covered Saleem Sir',
    alternatives: [
      {
        videoId: 'sGb3VLDvNRU',
        url: 'https://www.youtube.com/watch?v=sGb3VLDvNRU',
        title: 'ELECTRIC POTENTIAL, DIPOLE & CONDUCTOR in One Shot: All Concepts & PYQs Covered |JEE Main & Advanced',
        channel: 'PW Manzil (Saleem Sir)',
        durationEstimate: '6h 30m',
        badge: 'Potential & Dipole',
      },
    ],
  },
  'phy-14': {
    id: 'phy-14',
    videoId: 'EJJGEpGFzQs',
    url: 'https://www.youtube.com/watch?v=EJJGEpGFzQs',
    title: 'CAPACITOR in One Shot: All Concepts & PYQs Covered |JEE Main & Advanced',
    channel: 'PW Manzil (Saleem Sir)',
    durationEstimate: '6h 30m',
    badge: 'PW Manzil (Saleem Sir)',
    playlistUrl: PW_MANZIL_2025_PHYSICS_PLAYLIST_URL,
    playlistName: 'PW Manzil 2025 Physics Playlist',
    searchQuery: 'CAPACITOR in One Shot All Concepts & PYQs Covered Saleem Sir',
  },
  'phy-15': {
    id: 'phy-15',
    videoId: 'JY24andAvME',
    url: 'https://www.youtube.com/watch?v=JY24andAvME',
    title: 'CURRENT ELECTRICITY in One Shot: All Concepts & PYQs Covered |JEE Main & Advanced',
    channel: 'PW Manzil (Saleem Sir)',
    durationEstimate: '8h 50m',
    badge: 'PW Manzil (Saleem Sir)',
    playlistUrl: PW_MANZIL_2025_PHYSICS_PLAYLIST_URL,
    playlistName: 'PW Manzil 2025 Physics Playlist',
    searchQuery: 'CURRENT ELECTRICITY in One Shot All Concepts & PYQs Covered Saleem Sir',
  },
  'phy-16': {
    id: 'phy-16',
    videoId: 'I4kB3onwjpw',
    url: 'https://www.youtube.com/watch?v=I4kB3onwjpw',
    title: 'MAGNETISM in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil (Saleem Sir)',
    durationEstimate: '9h 20m',
    badge: 'PW Manzil (Saleem Sir)',
    playlistUrl: PW_MANZIL_2025_PHYSICS_PLAYLIST_URL,
    playlistName: 'PW Manzil 2025 Physics Playlist',
    searchQuery: 'MAGNETISM in One Shot All Concepts & PYQs Covered Saleem Sir',
  },
  'phy-17': {
    id: 'phy-17',
    videoId: '_WXExQ4E-po',
    url: 'https://www.youtube.com/watch?v=_WXExQ4E-po',
    title: 'ELECTROMAGNETIC INDUCTION in One Shot: All Concepts & PYQs Covered |JEE Main & Advanced',
    channel: 'PW Manzil (Saleem Sir)',
    durationEstimate: '8h 40m',
    badge: 'PW Manzil (Saleem Sir)',
    playlistUrl: PW_MANZIL_2025_PHYSICS_PLAYLIST_URL,
    playlistName: 'PW Manzil 2025 Physics Playlist',
    searchQuery: 'ELECTROMAGNETIC INDUCTION in One Shot All Concepts & PYQs Covered Saleem Sir',
    alternatives: [
      {
        videoId: 'FImh-a0673s',
        url: 'https://www.youtube.com/watch?v=FImh-a0673s',
        title: 'ALTERNATING CURRENT in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
        channel: 'PW Manzil (Saleem Sir)',
        durationEstimate: '5h 30m',
        badge: 'Alternating Current (AC)',
      },
    ],
  },
  'phy-18': {
    id: 'phy-18',
    videoId: '8TnzQkZrztQ',
    url: 'https://www.youtube.com/watch?v=8TnzQkZrztQ',
    title: 'ELECTROMAGNETIC WAVES in One Shot: All Concepts & PYQs Covered |JEE Main & Advanced',
    channel: 'PW Manzil (Rajwant Sir)',
    durationEstimate: '3h 10m',
    badge: 'PW Manzil (Rajwant Sir)',
    playlistUrl: PW_MANZIL_2025_PHYSICS_PLAYLIST_URL,
    playlistName: 'PW Manzil 2025 Physics Playlist',
    searchQuery: 'ELECTROMAGNETIC WAVES in One Shot All Concepts & PYQs Covered Rajwant Sir',
  },
  'phy-19': {
    id: 'phy-19',
    videoId: '72T8RfBU0ME',
    url: 'https://www.youtube.com/watch?v=72T8RfBU0ME',
    title: 'RAY OPTICS in 1 Shot: All Concepts & PYQs Covered || JEE Main & Advanced',
    channel: 'PW Manzil (Saleem Sir)',
    durationEstimate: '10h 15m',
    badge: 'PW Manzil (Saleem Sir)',
    playlistUrl: PW_MANZIL_2025_PHYSICS_PLAYLIST_URL,
    playlistName: 'PW Manzil 2025 Physics Playlist',
    searchQuery: 'RAY OPTICS in 1 Shot All Concepts & PYQs Covered Saleem Sir',
  },
  'phy-20': {
    id: 'phy-20',
    videoId: 'k8IyQgwDdUk',
    url: 'https://www.youtube.com/watch?v=k8IyQgwDdUk',
    title: 'WAVE OPTICS in 1 Shot : All Concepts & PYQs Covered || JEE Main & Advanced',
    channel: 'PW Manzil (Saleem Sir)',
    durationEstimate: '6h 45m',
    badge: 'PW Manzil (Saleem Sir)',
    playlistUrl: PW_MANZIL_2025_PHYSICS_PLAYLIST_URL,
    playlistName: 'PW Manzil 2025 Physics Playlist',
    searchQuery: 'WAVE OPTICS in 1 Shot All Concepts & PYQs Covered Saleem Sir',
  },
  'phy-21': {
    id: 'phy-21',
    videoId: 'V76QPpoWVwA',
    url: 'https://www.youtube.com/watch?v=V76QPpoWVwA',
    title: 'MODERN PHYSICS in One Shot: All Concepts & PYQs Covered |JEE Main & Advanced',
    channel: 'PW Manzil (Saleem Sir)',
    durationEstimate: '9h 30m',
    badge: 'PW Manzil (Saleem Sir)',
    playlistUrl: PW_MANZIL_2025_PHYSICS_PLAYLIST_URL,
    playlistName: 'PW Manzil 2025 Physics Playlist',
    searchQuery: 'MODERN PHYSICS in One Shot All Concepts & PYQs Covered Saleem Sir',
  },
  'phy-22': {
    id: 'phy-22',
    videoId: 'rdnWOyqZTy4',
    url: 'https://www.youtube.com/watch?v=rdnWOyqZTy4',
    title: 'SEMICONDUCTOR in One Shot: All Concepts & PYQs Covered |JEE Main & Advanced',
    channel: 'PW Manzil (Rajwant Sir)',
    durationEstimate: '5h 20m',
    badge: 'PW Manzil (Rajwant Sir)',
    playlistUrl: PW_MANZIL_2025_PHYSICS_PLAYLIST_URL,
    playlistName: 'PW Manzil 2025 Physics Playlist',
    searchQuery: 'SEMICONDUCTOR in One Shot All Concepts & PYQs Covered Rajwant Sir',
  },

  // ==========================================
  // PHYSICAL CHEMISTRY (PW Manzil 2026 Playlist)
  // ==========================================
  'chem-01': {
    id: 'chem-01',
    videoId: 'CAb8YZKLoac',
    url: 'https://www.youtube.com/watch?v=CAb8YZKLoac',
    title: 'Manzil 2026: MOLE CONCEPT in 1 Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil (JEE Wallah)',
    durationEstimate: '8h 00m',
    badge: 'PW Manzil 2026',
    playlistUrl: PW_MANZIL_2026_PHYSICAL_CHEM_PLAYLIST_URL,
    playlistName: 'PW Manzil Physical Chemistry Playlist',
    searchQuery: 'Mole Concept Some Basic Concepts in Chemistry One Shot JEE Main',
  },
  'chem-02': {
    id: 'chem-02',
    videoId: '7OkNy8vhDaw',
    url: 'https://www.youtube.com/watch?v=7OkNy8vhDaw',
    title: 'STRUCTURE OF ATOM in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil (JEE Wallah)',
    durationEstimate: '7h 54m',
    badge: 'PW Manzil',
    playlistUrl: PW_MANZIL_2026_PHYSICAL_CHEM_PLAYLIST_URL,
    playlistName: 'PW Manzil Physical Chemistry Playlist',
    searchQuery: 'Structure of Atom Atomic Structure Quantum Numbers One Shot JEE Main',
  },
  'chem-03': {
    id: 'chem-03',
    videoId: 'NwCmoh7Vd9g',
    url: 'https://www.youtube.com/watch?v=NwCmoh7Vd9g',
    title: 'THERMODYNAMICS in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil (JEE Wallah)',
    durationEstimate: '8h 33m',
    badge: 'PW Manzil',
    playlistUrl: PW_MANZIL_2026_PHYSICAL_CHEM_PLAYLIST_URL,
    playlistName: 'PW Manzil Physical Chemistry Playlist',
    searchQuery: 'Thermodynamics and Thermochemistry One Shot JEE Main',
  },
  'chem-04': {
    id: 'chem-04',
    videoId: 'BceSksiNLD4',
    url: 'https://www.youtube.com/watch?v=BceSksiNLD4',
    title: 'CHEMICAL EQUILIBRIUM in 1 Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil (JEE Wallah)',
    durationEstimate: '6h 10m',
    badge: 'PW Manzil',
    playlistUrl: PW_MANZIL_2026_PHYSICAL_CHEM_PLAYLIST_URL,
    playlistName: 'PW Manzil Physical Chemistry Playlist',
    searchQuery: 'Chemical Equilibrium Le Chatelier Equilibrium Constant One Shot JEE Main',
  },
  'chem-05': {
    id: 'chem-05',
    videoId: '1W-UvePUAKo',
    url: 'https://www.youtube.com/watch?v=1W-UvePUAKo',
    title: 'IONIC EQUILIBRIUM in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil (JEE Wallah)',
    durationEstimate: '6h 45m',
    badge: 'PW Manzil',
    playlistUrl: PW_MANZIL_2026_PHYSICAL_CHEM_PLAYLIST_URL,
    playlistName: 'PW Manzil Physical Chemistry Playlist',
    searchQuery: 'Ionic Equilibrium pH Buffer Solutions Hydrolysis Ksp One Shot JEE Main',
  },
  'chem-06': {
    id: 'chem-06',
    videoId: '8oypjDXAXZc',
    url: 'https://www.youtube.com/watch?v=8oypjDXAXZc',
    title: 'REDOX REACTION in 1 Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil (JEE Wallah)',
    durationEstimate: '6h 31m',
    badge: 'PW Manzil',
    playlistUrl: PW_MANZIL_2026_PHYSICAL_CHEM_PLAYLIST_URL,
    playlistName: 'PW Manzil Physical Chemistry Playlist',
    searchQuery: 'Redox Reactions Oxidation Number Balancing One Shot JEE Main',
  },
  'chem-07': {
    id: 'chem-07',
    videoId: 'GplPceRaMi0',
    url: 'https://www.youtube.com/watch?v=GplPceRaMi0',
    title: 'ELECTROCHEMISTRY in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil (JEE Wallah)',
    durationEstimate: '7h 52m',
    badge: 'PW Manzil',
    playlistUrl: PW_MANZIL_2026_PHYSICAL_CHEM_PLAYLIST_URL,
    playlistName: 'PW Manzil Physical Chemistry Playlist',
    searchQuery: 'Electrochemistry Galvanic Cells Nernst Equation Conductance One Shot JEE Main',
  },
  'chem-08': {
    id: 'chem-08',
    videoId: 'kwPNxC9AgZA',
    url: 'https://www.youtube.com/watch?v=kwPNxC9AgZA',
    title: 'CHEMICAL KINETICS in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil (JEE Wallah)',
    durationEstimate: '5h 32m',
    badge: 'PW Manzil',
    playlistUrl: PW_MANZIL_2026_PHYSICAL_CHEM_PLAYLIST_URL,
    playlistName: 'PW Manzil Physical Chemistry Playlist',
    searchQuery: 'Chemical Kinetics Rate Law Order of Reaction One Shot JEE Main',
  },
  'chem-09': {
    id: 'chem-09',
    videoId: 'f6ENSghG7T4',
    url: 'https://www.youtube.com/watch?v=f6ENSghG7T4',
    title: 'SOLUTIONS in 1 Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil (JEE Wallah)',
    durationEstimate: '7h 27m',
    badge: 'PW Manzil',
    playlistUrl: PW_MANZIL_2026_PHYSICAL_CHEM_PLAYLIST_URL,
    playlistName: 'PW Manzil Physical Chemistry Playlist',
    searchQuery: 'Solutions and Colligative Properties Raoults Law One Shot JEE Main',
  },

  // ==========================================
  // INORGANIC CHEMISTRY (PW Manzil Playlist)
  // ==========================================
  'chem-10': {
    id: 'chem-10',
    videoId: 'nLE7_YBFQNQ',
    url: 'https://www.youtube.com/watch?v=nLE7_YBFQNQ',
    title: 'Manzil 2026: PERIODIC TABLE in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil 2026 (JEE Wallah)',
    durationEstimate: '6h 57m',
    badge: 'PW Manzil 2026',
    playlistUrl: PW_MANZIL_2026_INORGANIC_CHEM_PLAYLIST_URL,
    playlistName: 'PW Manzil Inorganic Chemistry Playlist',
    searchQuery: 'Periodic Table Periodicity Classification of Elements One Shot JEE Main',
  },
  'chem-11': {
    id: 'chem-11',
    videoId: 'kS8s_WX0IlY',
    url: 'https://www.youtube.com/watch?v=kS8s_WX0IlY',
    title: 'CHEMICAL BONDING in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil (JEE Wallah)',
    durationEstimate: '9h 29m',
    badge: 'PW Manzil',
    playlistUrl: PW_MANZIL_2026_INORGANIC_CHEM_PLAYLIST_URL,
    playlistName: 'PW Manzil Inorganic Chemistry Playlist',
    searchQuery: 'Chemical Bonding and Molecular Structure VSEPR Hybridization One Shot JEE Main',
  },
  'chem-12': {
    id: 'chem-12',
    videoId: 'b0k5LOk_uPk',
    url: 'https://www.youtube.com/watch?v=b0k5LOk_uPk',
    title: 'P-BLOCK in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil (JEE Wallah)',
    durationEstimate: '5h 25m',
    badge: 'PW Manzil',
    playlistUrl: PW_MANZIL_2026_INORGANIC_CHEM_PLAYLIST_URL,
    playlistName: 'PW Manzil Inorganic Chemistry Playlist',
    searchQuery: 'p Block Elements Groups 13 to 18 One Shot JEE Main',
  },
  'chem-13': {
    id: 'chem-13',
    videoId: 'SjILQ6cX_Vo',
    url: 'https://www.youtube.com/watch?v=SjILQ6cX_Vo',
    title: 'D & F-BLOCK in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil (JEE Wallah)',
    durationEstimate: '6h 20m',
    badge: 'PW Manzil',
    playlistUrl: PW_MANZIL_2026_INORGANIC_CHEM_PLAYLIST_URL,
    playlistName: 'PW Manzil Inorganic Chemistry Playlist',
    searchQuery: 'd and f block elements Transition Metals Lanthanoids One Shot JEE Main',
  },
  'chem-14': {
    id: 'chem-14',
    videoId: '5myJzBeN514',
    url: 'https://www.youtube.com/watch?v=5myJzBeN514',
    title: 'COORDINATION COMPOUNDS in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil (JEE Wallah)',
    durationEstimate: '7h 47m',
    badge: 'PW Manzil',
    playlistUrl: PW_MANZIL_2026_INORGANIC_CHEM_PLAYLIST_URL,
    playlistName: 'PW Manzil Inorganic Chemistry Playlist',
    searchQuery: 'Coordination Compounds CFT VBT Isomerism IUPAC One Shot JEE Main',
    alternatives: [
      {
        videoId: '78AbMcGOdYo',
        url: 'https://www.youtube.com/watch?v=78AbMcGOdYo',
        title: 'COORDINATION COMPOUNDS in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
        channel: 'PW Manzil (JEE Wallah)',
        durationEstimate: '7h 30m',
        badge: 'Manzil Edition',
      },
    ],
  },
  'chem-15': {
    id: 'chem-15',
    videoId: '8rRnn4ECwXI',
    url: 'https://www.youtube.com/watch?v=8rRnn4ECwXI',
    title: 'SALT ANALYSIS in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil (JEE Wallah)',
    durationEstimate: '6h 32m',
    badge: 'PW Manzil',
    playlistUrl: PW_MANZIL_2026_INORGANIC_CHEM_PLAYLIST_URL,
    playlistName: 'PW Manzil Inorganic Chemistry Playlist',
    searchQuery: 'Salt Analysis Qualitative Analysis Practical Chemistry One Shot JEE Main',
  },

  // ==========================================
  // ORGANIC CHEMISTRY (PW Manzil Playlist)
  // ==========================================
  'chem-16': {
    id: 'chem-16',
    videoId: 'MOq0t9wBaXc',
    url: 'https://www.youtube.com/watch?v=MOq0t9wBaXc',
    title: 'Manzil 2025: IUPAC NOMENCLATURE in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil 2025 (JEE Wallah)',
    durationEstimate: '5h 18m',
    badge: 'PW Manzil 2025',
    playlistUrl: PW_MANZIL_2025_ORGANIC_CHEM_PLAYLIST_URL,
    playlistName: 'PW Manzil Organic Chemistry Playlist',
    searchQuery: 'IUPAC Nomenclature Organic Chemistry One Shot JEE Main',
  },
  'chem-17': {
    id: 'chem-17',
    videoId: 'wA3qYrCoydE',
    url: 'https://www.youtube.com/watch?v=wA3qYrCoydE',
    title: 'Manzil 2025: GOC in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil 2025 (JEE Wallah)',
    durationEstimate: '8h 01m',
    badge: 'PW Manzil 2025',
    playlistUrl: PW_MANZIL_2025_ORGANIC_CHEM_PLAYLIST_URL,
    playlistName: 'PW Manzil Organic Chemistry Playlist',
    searchQuery: 'General Organic Chemistry GOC Inductive Resonance Hyperconjugation One Shot JEE Main',
  },
  'chem-18': {
    id: 'chem-18',
    videoId: 'ajG-4UVkdeE',
    url: 'https://www.youtube.com/watch?v=ajG-4UVkdeE',
    title: 'ISOMERISM in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil (JEE Wallah)',
    durationEstimate: '7h 31m',
    badge: 'PW Manzil',
    playlistUrl: PW_MANZIL_2025_ORGANIC_CHEM_PLAYLIST_URL,
    playlistName: 'PW Manzil Organic Chemistry Playlist',
    searchQuery: 'Isomerism Optical Geometrical Structural Stereoisomerism One Shot JEE Main',
  },
  'chem-19': {
    id: 'chem-19',
    videoId: 'gUCTJ7oVhLg',
    url: 'https://www.youtube.com/watch?v=gUCTJ7oVhLg',
    title: 'HYDROCARBON in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil (JEE Wallah)',
    durationEstimate: '6h 43m',
    badge: 'PW Manzil',
    playlistUrl: PW_MANZIL_2025_ORGANIC_CHEM_PLAYLIST_URL,
    playlistName: 'PW Manzil Organic Chemistry Playlist',
    searchQuery: 'Hydrocarbons Alkanes Alkenes Alkynes Arenes One Shot JEE Main',
  },
  'chem-20': {
    id: 'chem-20',
    videoId: '9EGXs98Encw',
    url: 'https://www.youtube.com/watch?v=9EGXs98Encw',
    title: 'HALOALKANES & HALOARENES in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil (JEE Wallah)',
    durationEstimate: '5h 17m',
    badge: 'PW Manzil',
    playlistUrl: PW_MANZIL_2025_ORGANIC_CHEM_PLAYLIST_URL,
    playlistName: 'PW Manzil Organic Chemistry Playlist',
    searchQuery: 'Haloalkanes and Haloarenes Alkyl Halides SN1 SN2 Mechanisms One Shot JEE Main',
  },
  'chem-21': {
    id: 'chem-21',
    videoId: 'RzzabEhT_Sw',
    url: 'https://www.youtube.com/watch?v=RzzabEhT_Sw',
    title: 'ALCOHOLS, PHENOLS & ETHERS in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil (JEE Wallah)',
    durationEstimate: '5h 36m',
    badge: 'PW Manzil',
    playlistUrl: PW_MANZIL_2025_ORGANIC_CHEM_PLAYLIST_URL,
    playlistName: 'PW Manzil Organic Chemistry Playlist',
    searchQuery: 'Alcohols Phenols Ethers One Shot JEE Main',
  },
  'chem-22': {
    id: 'chem-22',
    videoId: '1wP3hVr7JEQ',
    url: 'https://www.youtube.com/watch?v=1wP3hVr7JEQ',
    title: 'ALDEHYDES, KETONES & CARBOXYLIC ACIDS in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil (JEE Wallah)',
    durationEstimate: '6h 50m',
    badge: 'PW Manzil',
    playlistUrl: PW_MANZIL_2025_ORGANIC_CHEM_PLAYLIST_URL,
    playlistName: 'PW Manzil Organic Chemistry Playlist',
    searchQuery: 'Aldehydes Ketones Carboxylic Acids Carbonyl Compounds One Shot JEE Main',
  },
  'chem-23': {
    id: 'chem-23',
    videoId: 'z-E_koEXP8k',
    url: 'https://www.youtube.com/watch?v=z-E_koEXP8k',
    title: 'AMINES in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil (JEE Wallah)',
    durationEstimate: '3h 40m',
    badge: 'PW Manzil',
    playlistUrl: PW_MANZIL_2025_ORGANIC_CHEM_PLAYLIST_URL,
    playlistName: 'PW Manzil Organic Chemistry Playlist',
    searchQuery: 'Amines Diazonium Salts Nitrogen Organic Compounds One Shot JEE Main',
  },
  'chem-24': {
    id: 'chem-24',
    videoId: 'LcVNwEWJtyI',
    url: 'https://www.youtube.com/watch?v=LcVNwEWJtyI',
    title: 'BIOMOLECULES in 1 Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil (JEE Wallah)',
    durationEstimate: '2h 45m',
    badge: 'PW Manzil',
    playlistUrl: PW_MANZIL_2025_ORGANIC_CHEM_PLAYLIST_URL,
    playlistName: 'PW Manzil Organic Chemistry Playlist',
    searchQuery: 'Biomolecules Carbohydrates Amino Acids Nucleic Acids Vitamins One Shot JEE Main',
  },

  // ==========================================
  // MATHEMATICS (21 Chapters - PW Manzil One-Shots)
  // ==========================================
  'math-01': {
    id: 'math-01',
    videoId: 'NKth1h8pr7s',
    url: 'https://www.youtube.com/watch?v=NKth1h8pr7s',
    title: 'RELATIONS & FUNCTIONS in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil',
    durationEstimate: '6h 30m',
    badge: 'PW Manzil',
    playlistUrl: PW_MANZIL_2025_MATH_PLAYLIST_URL,
    playlistName: 'PW Manzil Mathematics Playlist',
    searchQuery: 'RELATIONS & FUNCTIONS in One Shot All Concepts & PYQs Covered JEE Main & Advanced',
    alternatives: [
      {
        videoId: 'XYJyV48ijms',
        url: 'https://www.youtube.com/watch?v=XYJyV48ijms',
        title: 'SETS in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
        channel: 'PW Manzil',
        durationEstimate: '3h 15m',
        badge: 'Sets in 1 Shot',
      },
      {
        videoId: 'UCdxT4d8k5c',
        url: 'https://www.youtube.com/watch?v=UCdxT4d8k5c',
        title: 'Manzil 2025: BASIC MATHS in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
        channel: 'PW Manzil',
        durationEstimate: '5h 45m',
        badge: 'Basic Maths Foundation',
      },
    ],
  },
  'math-02': {
    id: 'math-02',
    videoId: 'II05jy4LZ4I',
    url: 'https://www.youtube.com/watch?v=II05jy4LZ4I',
    title: 'INVERSE TRIGONOMETRIC FUNCTIONS in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil',
    durationEstimate: '4h 50m',
    badge: 'PW Manzil',
    playlistUrl: PW_MANZIL_2025_MATH_PLAYLIST_URL,
    playlistName: 'PW Manzil Mathematics Playlist',
    searchQuery: 'INVERSE TRIGONOMETRIC FUNCTIONS in One Shot All Concepts & PYQs Covered JEE Main & Advanced',
  },
  'math-03': {
    id: 'math-03',
    videoId: 'yejWh3kni-o',
    url: 'https://www.youtube.com/watch?v=yejWh3kni-o',
    title: 'Manzil 2025: QUADRATIC EQUATIONS in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil',
    durationEstimate: '5h 15m',
    badge: 'PW Manzil',
    playlistUrl: PW_MANZIL_2025_MATH_PLAYLIST_URL,
    playlistName: 'PW Manzil Mathematics Playlist',
    searchQuery: 'Manzil 2025 QUADRATIC EQUATIONS in One Shot All Concepts & PYQs Covered',
    alternatives: [
      {
        videoId: 'o8T4ZG08q8g',
        url: 'https://www.youtube.com/watch?v=o8T4ZG08q8g',
        title: 'COMPLEX NUMBERS in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
        channel: 'PW Manzil',
        durationEstimate: '6h 10m',
        badge: 'Complex Numbers',
      },
    ],
  },
  'math-04': {
    id: 'math-04',
    videoId: 'ZtTDs2FZ2Qw',
    url: 'https://www.youtube.com/watch?v=ZtTDs2FZ2Qw',
    title: 'Manzil 2025: MATRICES in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil',
    durationEstimate: '6h 00m',
    badge: 'PW Manzil',
    playlistUrl: PW_MANZIL_2025_MATH_PLAYLIST_URL,
    playlistName: 'PW Manzil Mathematics Playlist',
    searchQuery: 'Manzil 2025 MATRICES in One Shot All Concepts & PYQs Covered',
    alternatives: [
      {
        videoId: 'hEFge5SsIz0',
        url: 'https://www.youtube.com/watch?v=hEFge5SsIz0',
        title: 'Manzil 2025: DETERMINANTS in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
        channel: 'PW Manzil',
        durationEstimate: '5h 30m',
        badge: 'Determinants',
      },
    ],
  },
  'math-05': {
    id: 'math-05',
    videoId: 'Cq9SqJPC0Dk',
    url: 'https://www.youtube.com/watch?v=Cq9SqJPC0Dk',
    title: 'PERMUTATIONS AND COMBINATIONS in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil',
    durationEstimate: '7h 15m',
    badge: 'PW Manzil',
    playlistUrl: PW_MANZIL_2025_MATH_PLAYLIST_URL,
    playlistName: 'PW Manzil Mathematics Playlist',
    searchQuery: 'PERMUTATIONS AND COMBINATIONS in One Shot All Concepts & PYQs Covered JEE Main & Advanced',
  },
  'math-06': {
    id: 'math-06',
    videoId: 'YiY0Z5sQ47U',
    url: 'https://www.youtube.com/watch?v=YiY0Z5sQ47U',
    title: 'BINOMIAL THEOREM in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil',
    durationEstimate: '5h 45m',
    badge: 'PW Manzil',
    playlistUrl: PW_MANZIL_2025_MATH_PLAYLIST_URL,
    playlistName: 'PW Manzil Mathematics Playlist',
    searchQuery: 'BINOMIAL THEOREM in One Shot All Concepts & PYQs Covered JEE Main & Advanced',
  },
  'math-07': {
    id: 'math-07',
    videoId: 'zOdUhsMydtM',
    url: 'https://www.youtube.com/watch?v=zOdUhsMydtM',
    title: 'SEQUENCE & SERIES in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil',
    durationEstimate: '6h 30m',
    badge: 'PW Manzil',
    playlistUrl: PW_MANZIL_2025_MATH_PLAYLIST_URL,
    playlistName: 'PW Manzil Mathematics Playlist',
    searchQuery: 'SEQUENCE & SERIES in One Shot All Concepts & PYQs Covered JEE Main & Advanced',
  },
  'math-08': {
    id: 'math-08',
    videoId: '0DgG7LxiYzk',
    url: 'https://www.youtube.com/watch?v=0DgG7LxiYzk',
    title: 'TRIGONOMETRIC FUNCTIONS in One Shot: All Concepts & PYQs Covered || JEE Main & Advanced',
    channel: 'PW Manzil',
    durationEstimate: '7h 10m',
    badge: 'PW Manzil',
    playlistUrl: PW_MANZIL_2025_MATH_PLAYLIST_URL,
    playlistName: 'PW Manzil Mathematics Playlist',
    searchQuery: 'TRIGONOMETRIC FUNCTIONS in One Shot All Concepts & PYQs Covered JEE Main & Advanced',
  },
  'math-09': {
    id: 'math-09',
    videoId: '81v0t4OG6Wc',
    url: 'https://www.youtube.com/watch?v=81v0t4OG6Wc',
    title: 'LIMIT, CONTINUITY & DIFFERENTIABILITY in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil',
    durationEstimate: '8h 20m',
    badge: 'PW Manzil',
    playlistUrl: PW_MANZIL_2025_MATH_PLAYLIST_URL,
    playlistName: 'PW Manzil Mathematics Playlist',
    searchQuery: 'LIMIT CONTINUITY & DIFFERENTIABILITY in One Shot All Concepts & PYQs Covered',
    alternatives: [
      {
        videoId: 'e7bnfHnl6PE',
        url: 'https://www.youtube.com/watch?v=e7bnfHnl6PE',
        title: 'METHOD OF DIFFERENTIATION in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
        channel: 'PW Manzil',
        durationEstimate: '4h 15m',
        badge: 'Method of Diff (MOD)',
      },
    ],
  },
  'math-10': {
    id: 'math-10',
    videoId: 'f_6_3u0E4oI',
    url: 'https://www.youtube.com/watch?v=f_6_3u0E4oI',
    title: 'APPLICATION OF DERIVATIVES in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil',
    durationEstimate: '7h 50m',
    badge: 'PW Manzil',
    playlistUrl: PW_MANZIL_2025_MATH_PLAYLIST_URL,
    playlistName: 'PW Manzil Mathematics Playlist',
    searchQuery: 'APPLICATION OF DERIVATIVES in One Shot All Concepts & PYQs Covered JEE Main & Advanced',
  },
  'math-11': {
    id: 'math-11',
    videoId: '925SY-xvuj8',
    url: 'https://www.youtube.com/watch?v=925SY-xvuj8',
    title: 'INDEFINITE INTEGRATION in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil',
    durationEstimate: '7h 30m',
    badge: 'PW Manzil',
    playlistUrl: PW_MANZIL_2025_MATH_PLAYLIST_URL,
    playlistName: 'PW Manzil Mathematics Playlist',
    searchQuery: 'INDEFINITE INTEGRATION in One Shot All Concepts & PYQs Covered JEE Main & Advanced',
  },
  'math-12': {
    id: 'math-12',
    videoId: 'ISth4dTVbWY',
    url: 'https://www.youtube.com/watch?v=ISth4dTVbWY',
    title: 'DEFINITE INTEGRATION in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil',
    durationEstimate: '6h 40m',
    badge: 'PW Manzil',
    playlistUrl: PW_MANZIL_2025_MATH_PLAYLIST_URL,
    playlistName: 'PW Manzil Mathematics Playlist',
    searchQuery: 'DEFINITE INTEGRATION in One Shot All Concepts & PYQs Covered JEE Main & Advanced',
  },
  'math-13': {
    id: 'math-13',
    videoId: 'doc6zf-pddw',
    url: 'https://www.youtube.com/watch?v=doc6zf-pddw',
    title: 'AREA UNDER CURVE in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil',
    durationEstimate: '4h 30m',
    badge: 'PW Manzil',
    playlistUrl: PW_MANZIL_2025_MATH_PLAYLIST_URL,
    playlistName: 'PW Manzil Mathematics Playlist',
    searchQuery: 'AREA UNDER CURVE in One Shot All Concepts & PYQs Covered JEE Main & Advanced',
  },
  'math-14': {
    id: 'math-14',
    videoId: 'Kqmq47WOvdU',
    url: 'https://www.youtube.com/watch?v=Kqmq47WOvdU',
    title: 'DIFFERENTIAL EQUATIONS in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil',
    durationEstimate: '5h 45m',
    badge: 'PW Manzil',
    playlistUrl: PW_MANZIL_2025_MATH_PLAYLIST_URL,
    playlistName: 'PW Manzil Mathematics Playlist',
    searchQuery: 'DIFFERENTIAL EQUATIONS in One Shot All Concepts & PYQs Covered JEE Main & Advanced',
  },
  'math-15': {
    id: 'math-15',
    videoId: 'gZ735nqr9FI',
    url: 'https://www.youtube.com/watch?v=gZ735nqr9FI',
    title: 'STRAIGHT LINES in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil',
    durationEstimate: '6h 15m',
    badge: 'PW Manzil',
    playlistUrl: PW_MANZIL_2025_MATH_PLAYLIST_URL,
    playlistName: 'PW Manzil Mathematics Playlist',
    searchQuery: 'STRAIGHT LINES in One Shot All Concepts & PYQs Covered JEE Main & Advanced',
  },
  'math-16': {
    id: 'math-16',
    videoId: 'e8vY-T9Q5iM',
    url: 'https://www.youtube.com/watch?v=e8vY-T9Q5iM',
    title: 'CIRCLES in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil',
    durationEstimate: '6h 50m',
    badge: 'PW Manzil',
    playlistUrl: PW_MANZIL_2025_MATH_PLAYLIST_URL,
    playlistName: 'PW Manzil Mathematics Playlist',
    searchQuery: 'CIRCLES in One Shot All Concepts & PYQs Covered JEE Main & Advanced',
  },
  'math-17': {
    id: 'math-17',
    videoId: 'hIeh8YyqgO0',
    url: 'https://www.youtube.com/watch?v=hIeh8YyqgO0',
    title: 'PARABOLA in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil',
    durationEstimate: '5h 30m',
    badge: 'PW Manzil',
    playlistUrl: PW_MANZIL_2025_MATH_PLAYLIST_URL,
    playlistName: 'PW Manzil Mathematics Playlist',
    searchQuery: 'PARABOLA in One Shot All Concepts & PYQs Covered JEE Main & Advanced',
    alternatives: [
      {
        videoId: 'claYb6CfGP4',
        url: 'https://www.youtube.com/watch?v=claYb6CfGP4',
        title: 'Ellipse FULL CHAPTER | Class 11th Maths | Arjuna JEE',
        channel: 'Arjuna JEE (PW)',
        durationEstimate: '4h 45m',
        badge: 'Ellipse Full Chapter',
      },
      {
        videoId: 'j0-Qz7l9x7w',
        url: 'https://www.youtube.com/watch?v=j0-Qz7l9x7w',
        title: 'Conic Sections (Parabola, Ellipse, Hyperbola) Complete Revision',
        channel: 'PW Manzil',
        durationEstimate: '3h 30m',
        badge: 'Hyperbola & Full Conics',
      },
    ],
  },
  'math-18': {
    id: 'math-18',
    videoId: 'cS64-wAFDuI',
    url: 'https://www.youtube.com/watch?v=cS64-wAFDuI',
    title: 'VECTORS in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil',
    durationEstimate: '6h 20m',
    badge: 'PW Manzil',
    playlistUrl: PW_MANZIL_2025_MATH_PLAYLIST_URL,
    playlistName: 'PW Manzil Mathematics Playlist',
    searchQuery: 'VECTORS in One Shot All Concepts & PYQs Covered JEE Main & Advanced',
  },
  'math-19': {
    id: 'math-19',
    videoId: '7v2vYv6Pl7g',
    url: 'https://www.youtube.com/watch?v=7v2vYv6Pl7g',
    title: 'THREE-DIMENSIONAL GEOMETRY in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil',
    durationEstimate: '6h 40m',
    badge: 'PW Manzil',
    playlistUrl: PW_MANZIL_2025_MATH_PLAYLIST_URL,
    playlistName: 'PW Manzil Mathematics Playlist',
    searchQuery: 'THREE-DIMENSIONAL GEOMETRY in One Shot All Concepts & PYQs Covered JEE Main & Advanced',
  },
  'math-20': {
    id: 'math-20',
    videoId: 'M0wE7kH_ojk',
    url: 'https://www.youtube.com/watch?v=M0wE7kH_ojk',
    title: 'STATISTICS in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil',
    durationEstimate: '3h 15m',
    badge: 'PW Manzil',
    playlistUrl: PW_MANZIL_2025_MATH_PLAYLIST_URL,
    playlistName: 'PW Manzil Mathematics Playlist',
    searchQuery: 'STATISTICS in One Shot All Concepts & PYQs Covered JEE Main & Advanced',
  },
  'math-21': {
    id: 'math-21',
    videoId: '3OFuYbk-BV4',
    url: 'https://www.youtube.com/watch?v=3OFuYbk-BV4',
    title: 'PROBABILITY in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil',
    durationEstimate: '7h 10m',
    badge: 'PW Manzil',
    playlistUrl: PW_MANZIL_2025_MATH_PLAYLIST_URL,
    playlistName: 'PW Manzil Mathematics Playlist',
    searchQuery: 'PROBABILITY in One Shot All Concepts & PYQs Covered JEE Main & Advanced',
  },
};

export const DEFAULT_GLOBAL_FALLBACK: CuratedVideo = {
  id: 'global-fallback',
  videoId: 'EziB4cDh1KE',
  url: 'https://www.youtube.com/watch?v=EziB4cDh1KE',
  title: 'JEE Main & Advanced High-Yield Chapter Revision',
  channel: 'JEE Wallah',
  durationEstimate: '2 hours',
  searchQuery: 'JEE Main Full Chapter Revision One Shot',
};

export const KNOWN_INVALID_VIDEO_IDS = new Set([
  '4yO991rX4Wk',
  'mD2bU_39p_k',
  '2yE99000000',
  '1uP0o4596z0',
  'U0H_596tUQI', // unavailable old electrostatics link
  'rAj2huLVaEk', // non-Manzil Eduniti link
  'xD9H6YWuzG8', // non-Manzil Vedantu link
  'd9l7Mek5FzU', // non-Manzil Eduniti link
  'undefined',
  'null',
  '',
]);

export function getCuratedVideo(chapterId: string): CuratedVideo {
  if (CURATED_CHAPTER_VIDEOS[chapterId]) {
    return CURATED_CHAPTER_VIDEOS[chapterId];
  }
  return DEFAULT_GLOBAL_FALLBACK;
}

export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = trimmed.match(regExp);
  if (match && match[2] && match[2].length === 11) {
    return match[2];
  }
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  return null;
}

export const PHYSICS_CHAPTER_IDS = new Set([
  'phy-01', 'phy-02', 'phy-03', 'phy-04', 'phy-05', 'phy-06', 'phy-07', 'phy-08',
  'phy-09', 'phy-10', 'phy-11', 'phy-12', 'phy-13', 'phy-14', 'phy-15', 'phy-16',
  'phy-17', 'phy-18', 'phy-19', 'phy-20', 'phy-21', 'phy-22',
]);

export const PHYSICAL_CHEMISTRY_CHAPTER_IDS = new Set([
  'chem-01',
  'chem-02',
  'chem-03',
  'chem-04',
  'chem-05',
  'chem-06',
  'chem-07',
  'chem-08',
  'chem-09',
]);

export const INORGANIC_CHEMISTRY_CHAPTER_IDS = new Set([
  'chem-10',
  'chem-11',
  'chem-12',
  'chem-13',
  'chem-14',
  'chem-15',
]);

export const ORGANIC_CHEMISTRY_CHAPTER_IDS = new Set([
  'chem-16',
  'chem-17',
  'chem-18',
  'chem-19',
  'chem-20',
  'chem-21',
  'chem-22',
  'chem-23',
  'chem-24',
]);

export const MATH_CHAPTER_IDS = new Set([
  'math-01',
  'math-02',
  'math-03',
  'math-04',
  'math-05',
  'math-06',
  'math-07',
  'math-08',
  'math-09',
  'math-10',
  'math-11',
  'math-12',
  'math-13',
  'math-14',
  'math-15',
  'math-16',
  'math-17',
  'math-18',
  'math-19',
  'math-20',
  'math-21',
]);

export const PW_MANZIL_PHYSICS_VIDEO_IDS = new Set([
  '2i0p2tidN88', // Basic Mathematics (Saleem Sir)
  'GLEZZdGwuXU', // Electric Charges and Fields (Saleem Sir)
  'v-kDOGM3214', // Motion in a Straight Line (Saleem Sir)
  'sGb3VLDvNRU', // Electric Potential, Dipole & Conductor (Saleem Sir)
  'U-tlb7_vnhM', // Motion in a Plane (Saleem Sir)
  'EJJGEpGFzQs', // Capacitor (Saleem Sir)
  'mE8w2uxm6XY', // Laws of Motion (Saleem Sir)
  'JY24andAvME', // Current Electricity (Saleem Sir)
  'griSf2U_Zlk', // Circular Motion (Saleem Sir)
  'PAlXOkn_Pa8', // Work, Energy & Power (Saleem Sir)
  'I4kB3onwjpw', // Magnetism (Saleem Sir)
  '_WXExQ4E-po', // Electromagnetic Induction (Saleem Sir)
  'FImh-a0673s', // Alternating Current (Saleem Sir)
  'V76QPpoWVwA', // Modern Physics (Saleem Sir)
  'rdnWOyqZTy4', // Semiconductor (Rajwant Sir)
  'wE0xrUuJLnk', // Gravitation (Rajwant Sir)
  'gziRcxMiO_Q', // Mechanical Properties of Solid & Fluid (Saleem Sir)
  'UYfR15GpKIs', // Thermal Properties of Matter (Rajwant Sir)
  '7xy0V3FjxdY', // Centre of Mass (Saleem Sir)
  '8TnzQkZrztQ', // Electromagnetic Waves (Rajwant Sir)
  'k8IyQgwDdUk', // Wave Optics (Saleem Sir)
  '72T8RfBU0ME', // Ray Optics (Saleem Sir)
  'UsHUxG90f_4', // Rotational Motion (Saleem Sir)
  'JAvi2K_DbbI', // KTG & Thermodynamics (Saleem Sir)
  'bv8qBsHK9bM', // Oscillations (Saleem Sir)
  'p3vMfyGjfcM', // Waves (Rajwant Sir)
  'wuI3MWvr0dY', // Units & Measurements (Rajwant Sir)
]);

export const PW_MANZIL_2026_PHYSICAL_VIDEO_IDS = new Set([
  'CAb8YZKLoac', // Mole Concept
  '7OkNy8vhDaw', // Structure of Atom
  'NwCmoh7Vd9g', // Thermodynamics
  'BceSksiNLD4', // Chemical Equilibrium
  '1W-UvePUAKo', // Ionic Equilibrium
  '8oypjDXAXZc', // Redox Reaction
  'GplPceRaMi0', // Electrochemistry
  'kwPNxC9AgZA', // Chemical Kinetics
  'f6ENSghG7T4', // Solutions
]);

export const PW_MANZIL_2026_INORGANIC_VIDEO_IDS = new Set([
  'nLE7_YBFQNQ', // Periodic Table
  'kS8s_WX0IlY', // Chemical Bonding
  'b0k5LOk_uPk', // p-Block
  'SjILQ6cX_Vo', // d- & f-Block
  '5myJzBeN514', // Coordination Compounds
  '78AbMcGOdYo', // Coordination Compounds (Alternative)
  '8rRnn4ECwXI', // Salt Analysis
]);

export const PW_MANZIL_2025_ORGANIC_VIDEO_IDS = new Set([
  'MOq0t9wBaXc', // IUPAC Nomenclature
  'wA3qYrCoydE', // GOC
  'ajG-4UVkdeE', // Isomerism
  'gUCTJ7oVhLg', // Hydrocarbon
  '9EGXs98Encw', // Haloalkanes & Haloarenes
  'RzzabEhT_Sw', // Alcohols, Phenols & Ethers
  '1wP3hVr7JEQ', // Aldehydes, Ketones & Carboxylic Acids
  'z-E_koEXP8k', // Amines
  'LcVNwEWJtyI', // Biomolecules
]);

export const PW_MANZIL_2025_MATH_VIDEO_IDS = new Set([
  'UCdxT4d8k5c', // Basic Maths
  'ZtTDs2FZ2Qw', // Matrices
  'hEFge5SsIz0', // Determinants
  'yejWh3kni-o', // Quadratic Equations
  'cS64-wAFDuI', // Vectors
  'zOdUhsMydtM', // Sequence & Series
  '7v2vYv6Pl7g', // 3D Geometry
  'YiY0Z5sQ47U', // Binomial Theorem
  'NKth1h8pr7s', // Relations & Functions
  'II05jy4LZ4I', // Inverse Trigonometric Functions
  'gZ735nqr9FI', // Straight Lines
  'ISth4dTVbWY', // Definite Integration
  '81v0t4OG6Wc', // Limit, Continuity & Differentiability
  'Kqmq47WOvdU', // Differential Equations
  'e7bnfHnl6PE', // Method of Differentiation
  '925SY-xvuj8', // Indefinite Integration
  'doc6zf-pddw', // Area Under Curve
  'XYJyV48ijms', // Sets
  'hIeh8YyqgO0', // Parabola
  'claYb6CfGP4', // Ellipse
  'j0-Qz7l9x7w', // Conic Sections
  'Cq9SqJPC0Dk', // Permutations & Combinations
  '0DgG7LxiYzk', // Trigonometric Functions
  'e8vY-T9Q5iM', // Circles
  'f_6_3u0E4oI', // Application of Derivatives
  'o8T4ZG08q8g', // Complex Numbers
  'M0wE7kH_ojk', // Statistics
  '3OFuYbk-BV4', // Probability
]);

export const PW_MANZIL_VIDEO_IDS = new Set([
  ...PW_MANZIL_PHYSICS_VIDEO_IDS,
  ...PW_MANZIL_2026_PHYSICAL_VIDEO_IDS,
  ...PW_MANZIL_2026_INORGANIC_VIDEO_IDS,
  ...PW_MANZIL_2025_ORGANIC_VIDEO_IDS,
  ...PW_MANZIL_2025_MATH_VIDEO_IDS,
]);

export function isPhysicalChemistryChapter(chapterId: string): boolean {
  return PHYSICAL_CHEMISTRY_CHAPTER_IDS.has(chapterId);
}

export function isInorganicChemistryChapter(chapterId: string): boolean {
  return INORGANIC_CHEMISTRY_CHAPTER_IDS.has(chapterId);
}

export function isOrganicChemistryChapter(chapterId: string): boolean {
  return ORGANIC_CHEMISTRY_CHAPTER_IDS.has(chapterId);
}

export function isMathChapter(chapterId: string): boolean {
  return MATH_CHAPTER_IDS.has(chapterId);
}

export function isKnownInvalidUrl(url?: string): boolean {
  if (!url) return true;
  const vid = extractYouTubeVideoId(url);
  if (!vid) return true;
  return KNOWN_INVALID_VIDEO_IDS.has(vid);
}

export function getValidVideoUrlForChapter(chapterId: string, currentUrl?: string): string {
  // If it is a Physics chapter, prioritize the verified Saleem Sir & Rajwant Sir PW Manzil one-shots
  if (PHYSICS_CHAPTER_IDS.has(chapterId)) {
    const vid = currentUrl ? extractYouTubeVideoId(currentUrl) : null;
    const curated = getCuratedVideo(chapterId);
    if (vid && PW_MANZIL_PHYSICS_VIDEO_IDS.has(vid)) {
      return currentUrl!;
    }
    return curated.url;
  }

  // If it is a Physical Chemistry chapter, prioritize the PW Manzil playlist video
  if (PHYSICAL_CHEMISTRY_CHAPTER_IDS.has(chapterId)) {
    const vid = currentUrl ? extractYouTubeVideoId(currentUrl) : null;
    if (vid && PW_MANZIL_2026_PHYSICAL_VIDEO_IDS.has(vid)) {
      return currentUrl!;
    }
    const curated = getCuratedVideo(chapterId);
    return curated.url;
  }

  // If it is an Inorganic Chemistry chapter, prioritize the PW Manzil playlist video
  if (INORGANIC_CHEMISTRY_CHAPTER_IDS.has(chapterId)) {
    const vid = currentUrl ? extractYouTubeVideoId(currentUrl) : null;
    if (vid && PW_MANZIL_2026_INORGANIC_VIDEO_IDS.has(vid)) {
      return currentUrl!;
    }
    const curated = getCuratedVideo(chapterId);
    return curated.url;
  }

  // If it is an Organic Chemistry chapter, prioritize the PW Manzil 2025 playlist video
  if (ORGANIC_CHEMISTRY_CHAPTER_IDS.has(chapterId)) {
    const vid = currentUrl ? extractYouTubeVideoId(currentUrl) : null;
    if (vid && PW_MANZIL_2025_ORGANIC_VIDEO_IDS.has(vid)) {
      return currentUrl!;
    }
    const curated = getCuratedVideo(chapterId);
    return curated.url;
  }

  // If it is a Mathematics chapter, prioritize the PW Manzil 2025/2026 playlist video
  if (MATH_CHAPTER_IDS.has(chapterId)) {
    const vid = currentUrl ? extractYouTubeVideoId(currentUrl) : null;
    if (vid && PW_MANZIL_2025_MATH_VIDEO_IDS.has(vid)) {
      return currentUrl!;
    }
    const curated = getCuratedVideo(chapterId);
    return curated.url;
  }

  if (currentUrl && !isKnownInvalidUrl(currentUrl)) {
    return currentUrl;
  }
  const curated = getCuratedVideo(chapterId);
  return curated.url;
}
