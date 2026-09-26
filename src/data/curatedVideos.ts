export const PW_MANZIL_2026_PHYSICAL_CHEM_PLAYLIST_URL = 'https://www.youtube.com/playlist?list=PLxyGaR3hEy3hVmPjmool3j3U78cTYxYq-';
export const PW_MANZIL_2026_INORGANIC_CHEM_PLAYLIST_URL = 'https://www.youtube.com/playlist?list=PLxyGaR3hEy3hUTwPWVhqBOR0l_1o3vyCs';
export const PW_MANZIL_2025_ORGANIC_CHEM_PLAYLIST_URL = 'https://www.youtube.com/playlist?list=PLxyGaR3hEy3joVGFUCCKG5BIKBSBW5ihL';
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
  // PHYSICS (22 Chapters)
  // ==========================================
  'phy-01': {
    id: 'phy-01',
    videoId: 'EziB4cDh1KE',
    url: 'https://www.youtube.com/watch?v=EziB4cDh1KE',
    title: 'Units & Dimensions in 52 Minutes | Full Chapter Revision',
    channel: 'JEE Wallah',
    durationEstimate: '52 mins',
    searchQuery: 'Units Dimensions Errors Experimental Physics One Shot JEE Main',
    alternatives: [
      {
        videoId: 'pVoN045dV8I',
        url: 'https://www.youtube.com/watch?v=pVoN045dV8I',
        title: 'Experimental Physics & Practical Skills in 1 Shot | JEE Main',
        channel: 'JEE Wallah',
        durationEstimate: '1.5 hours',
        badge: 'Practical Physics Focus',
      },
    ],
  },
  'phy-02': {
    id: 'phy-02',
    videoId: 'jkMn4MLLW-Q',
    url: 'https://www.youtube.com/watch?v=jkMn4MLLW-Q',
    title: 'Revise Kinematics in 120 Minutes | 1D & 2D Motion',
    channel: 'JEE Wallah',
    durationEstimate: '2 hours',
    searchQuery: 'Kinematics One Shot JEE Main Projectile Relative Motion',
  },
  'phy-03': {
    id: 'phy-03',
    videoId: 'aPwqkZCBouU',
    url: 'https://www.youtube.com/watch?v=aPwqkZCBouU',
    title: 'Newton Laws of Motion in One Shot: All Concepts & PYQs',
    channel: 'JEE Wallah',
    durationEstimate: '2.5 hours',
    searchQuery: 'Laws of Motion and Friction One Shot JEE Main',
  },
  'phy-04': {
    id: 'phy-04',
    videoId: 'm4T4Lne7Zos',
    url: 'https://www.youtube.com/watch?v=m4T4Lne7Zos',
    title: 'Work, Power & Energy in 60 Minutes | Full Revision',
    channel: 'JEE Wallah',
    durationEstimate: '60 mins',
    searchQuery: 'Work Power Energy One Shot JEE Main',
  },
  'phy-05': {
    id: 'phy-05',
    videoId: 'WwoNNUG_rFg',
    url: 'https://www.youtube.com/watch?v=WwoNNUG_rFg',
    title: 'Center of Mass, Momentum & Collisions | Complete Concepts',
    channel: 'JEE Wallah',
    durationEstimate: '2 hours',
    searchQuery: 'Center of Mass Collisions Conservation of Momentum One Shot JEE Main',
  },
  'phy-06': {
    id: 'phy-06',
    videoId: 'WwoNNUG_rFg',
    url: 'https://www.youtube.com/watch?v=WwoNNUG_rFg',
    title: 'Rotational Motion in 159 Minutes | Complete Concepts',
    channel: 'JEE Wallah',
    durationEstimate: '2.5 hours',
    searchQuery: 'Rotational Motion Moment of Inertia Rolling One Shot JEE Main',
  },
  'phy-07': {
    id: 'phy-07',
    videoId: 'rAj2huLVaEk',
    url: 'https://www.youtube.com/watch?v=rAj2huLVaEk',
    title: 'Gravitation Revision & PYQ Formula Sprint',
    channel: 'Eduniti (Mohit Goenka)',
    durationEstimate: '45 mins',
    searchQuery: 'Gravitation One Shot JEE Main Eduniti',
  },
  'phy-08': {
    id: 'phy-08',
    videoId: 'cXhxnd81Smw',
    url: 'https://www.youtube.com/watch?v=cXhxnd81Smw',
    title: 'Mechanical Properties of Solids & Fluids: Complete Chapter',
    channel: 'PW JEE',
    durationEstimate: '2.5 hours',
    searchQuery: 'Fluid Mechanics Properties of Matter Elasticity Viscosity One Shot JEE Main',
  },
  'phy-09': {
    id: 'phy-09',
    videoId: 'xD9H6YWuzG8',
    url: 'https://www.youtube.com/watch?v=xD9H6YWuzG8',
    title: 'Thermal Properties & Calorimetry | Thermal Physics Marathon',
    channel: 'Vedantu JEE English',
    durationEstimate: '2 hours',
    searchQuery: 'Thermal Properties Heat Transfer Calorimetry One Shot JEE',
  },
  'phy-10': {
    id: 'phy-10',
    videoId: 'Ymd_rQyV1DQ',
    url: 'https://www.youtube.com/watch?v=Ymd_rQyV1DQ',
    title: 'Thermodynamics & KTG in One Shot | All Concepts & Formulas',
    channel: 'JEE Wallah',
    durationEstimate: '2.5 hours',
    searchQuery: 'Thermodynamics KTG One Shot JEE Main',
  },
  'phy-11': {
    id: 'phy-11',
    videoId: 'mphn5DiugP4',
    url: 'https://www.youtube.com/watch?v=mphn5DiugP4',
    title: 'SHM in One Shot: Simple Harmonic Motion Complete Masterclass',
    channel: 'JEE Wallah',
    durationEstimate: '2 hours',
    searchQuery: 'Simple Harmonic Motion SHM One Shot JEE Main',
  },
  'phy-12': {
    id: 'phy-12',
    videoId: 'PAboWtPs8f4',
    url: 'https://www.youtube.com/watch?v=PAboWtPs8f4',
    title: 'Waves & Sound in 90 Minutes | Doppler, Standing Waves',
    channel: 'JEE Wallah',
    durationEstimate: '90 mins',
    searchQuery: 'Waves and Sound Doppler Effect One Shot JEE Main',
  },
  'phy-13': {
    id: 'phy-13',
    videoId: 'U0H_596tUQI',
    url: 'https://www.youtube.com/watch?v=U0H_596tUQI',
    title: 'Electrostatics Class 12 in One Shot: Electric Field & Potential',
    channel: 'JEE Wallah',
    durationEstimate: '3 hours',
    searchQuery: 'Electrostatics Electric Charges Fields Gauss Law One Shot JEE Main',
  },
  'phy-14': {
    id: 'phy-14',
    videoId: 'd9l7Mek5FzU',
    url: 'https://www.youtube.com/watch?v=d9l7Mek5FzU',
    title: 'Capacitors in 60 Minutes | Dielectrics, Circuits & Energy',
    channel: 'Eduniti (Mohit Goenka)',
    durationEstimate: '60 mins',
    searchQuery: 'Capacitance Dielectrics One Shot JEE Main Eduniti',
  },
  'phy-15': {
    id: 'phy-15',
    videoId: 'j0-Qz7l9x7w',
    url: 'https://www.youtube.com/watch?v=j0-Qz7l9x7w',
    title: 'Current Electricity in One Shot: Kirchhoff Laws & Meter Circuits',
    channel: 'JEE Wallah',
    durationEstimate: '2.5 hours',
    searchQuery: 'Current Electricity Circuits Kirchhoff One Shot JEE Main',
  },
  'phy-16': {
    id: 'phy-16',
    videoId: '7h9F-K9xR2A',
    url: 'https://www.youtube.com/watch?v=7h9F-K9xR2A',
    title: 'Moving Charges & Magnetism | Full Chapter Revision',
    channel: 'JEE Wallah',
    durationEstimate: '2 hours',
    searchQuery: 'Magnetic Effects of Current Magnetism One Shot JEE Main',
  },
  'phy-17': {
    id: 'phy-17',
    videoId: 'tYF6_yU2N7o',
    url: 'https://www.youtube.com/watch?v=tYF6_yU2N7o',
    title: 'EMI & Alternating Current (AC) Complete in One Shot',
    channel: 'JEE Wallah',
    durationEstimate: '3 hours',
    searchQuery: 'Electromagnetic Induction EMI Alternating Current AC One Shot JEE Main',
  },
  'phy-18': {
    id: 'phy-18',
    videoId: 'UDcW5zkWhtM',
    url: 'https://www.youtube.com/watch?v=UDcW5zkWhtM',
    title: 'MANZIL Comeback: ELECTROMAGNETIC WAVES in 1 Shot | All Concepts + PYQs',
    channel: 'PW Manzil (JEE Wallah)',
    durationEstimate: '2.5 hours',
    badge: 'PW Manzil',
    searchQuery: 'Electromagnetic Waves EM Waves One Shot JEE Main',
  },
  'phy-19': {
    id: 'phy-19',
    videoId: 'kZ6p43T16uI',
    url: 'https://www.youtube.com/watch?v=kZ6p43T16uI',
    title: 'Ray Optics Complete Revision in 3 Hours | All Formulas & PYQs',
    channel: 'JEE Wallah',
    durationEstimate: '3 hours',
    searchQuery: 'Ray Optics Optical Instruments Lenses Mirrors One Shot JEE Main',
  },
  'phy-20': {
    id: 'phy-20',
    videoId: '3h3OexznsA0',
    url: 'https://www.youtube.com/watch?v=3h3OexznsA0',
    title: 'WAVE OPTICS in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil (JEE Wallah)',
    durationEstimate: '3.5 hours',
    badge: 'PW Manzil',
    searchQuery: 'Wave Optics Interference YDSE Diffraction Polarization One Shot JEE Main',
  },
  'phy-21': {
    id: 'phy-21',
    videoId: 'V76QPpoWVwA',
    url: 'https://www.youtube.com/watch?v=V76QPpoWVwA',
    title: 'Modern Physics in One Shot | Dual Nature, Atoms & Nuclei',
    channel: 'JEE Wallah',
    durationEstimate: '3.5 hours',
    searchQuery: 'Modern Physics Dual Nature Atoms Nuclei One Shot JEE Main',
  },
  'phy-22': {
    id: 'phy-22',
    videoId: 'sIogEtNrepw',
    url: 'https://www.youtube.com/watch?v=sIogEtNrepw',
    title: 'MANZIL Comeback: SEMICONDUCTOR in 1 Shot | All Concepts + PYQs',
    channel: 'PW Manzil (JEE Wallah)',
    durationEstimate: '3 hours',
    badge: 'PW Manzil',
    searchQuery: 'Semiconductors Diodes Logic Gates Transistors One Shot JEE Main',
  },

  // ==========================================
  // PHYSICAL CHEMISTRY (PW Manzil 2026 Playlist: PLxyGaR3hEy3hVmPjmool3j3U78cTYxYq-)
  // ==========================================
  'chem-01': {
    id: 'chem-01',
    videoId: 'CAb8YZKLoac',
    url: 'https://www.youtube.com/watch?v=CAb8YZKLoac',
    title: 'Manzil 2026: MOLE CONCEPT in 1 Shot: All Concepts & PYQs Covered',
    channel: 'PW Manzil 2026 (JEE Wallah)',
    durationEstimate: '8h 00m',
    badge: 'PW Manzil 2026',
    playlistUrl: PW_MANZIL_2026_PHYSICAL_CHEM_PLAYLIST_URL,
    playlistName: 'PW Manzil 2026 Physical Chemistry Playlist',
    searchQuery: 'Mole Concept Some Basic Concepts in Chemistry One Shot JEE Main',
  },
  'chem-02': {
    id: 'chem-02',
    videoId: '7OkNy8vhDaw',
    url: 'https://www.youtube.com/watch?v=7OkNy8vhDaw',
    title: 'Manzil 2026: ATOMIC STRUCTURE in One Shot: All Concepts & PYQs Covered',
    channel: 'PW Manzil 2026 (JEE Wallah)',
    durationEstimate: '7h 54m',
    badge: 'PW Manzil 2026',
    playlistUrl: PW_MANZIL_2026_PHYSICAL_CHEM_PLAYLIST_URL,
    playlistName: 'PW Manzil 2026 Physical Chemistry Playlist',
    searchQuery: 'Structure of Atom Atomic Structure Quantum Numbers One Shot JEE Main',
  },
  'chem-03': {
    id: 'chem-03',
    videoId: 'NwCmoh7Vd9g',
    url: 'https://www.youtube.com/watch?v=NwCmoh7Vd9g',
    title: 'Manzil 2026: THERMODYNAMICS & THERMOCHEMISTRY in One Shot: All Concepts & PYQs',
    channel: 'PW Manzil 2026 (JEE Wallah)',
    durationEstimate: '8h 33m',
    badge: 'PW Manzil 2026',
    playlistUrl: PW_MANZIL_2026_PHYSICAL_CHEM_PLAYLIST_URL,
    playlistName: 'PW Manzil 2026 Physical Chemistry Playlist',
    searchQuery: 'Thermodynamics and Thermochemistry One Shot JEE Main',
  },
  'chem-04': {
    id: 'chem-04',
    videoId: 'gcPWM9JVE0Q',
    url: 'https://www.youtube.com/watch?v=gcPWM9JVE0Q',
    title: 'CHEMICAL EQUILIBRIUM in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil (JEE Wallah)',
    durationEstimate: '5h 37m',
    badge: 'PW Manzil',
    playlistUrl: PW_MANZIL_2026_PHYSICAL_CHEM_PLAYLIST_URL,
    playlistName: 'PW Manzil Physical Chemistry Playlist',
    searchQuery: 'Chemical Equilibrium Le Chatelier Equilibrium Constant One Shot JEE Main',
  },
  'chem-05': {
    id: 'chem-05',
    videoId: 'IF7DGTWCK_c',
    url: 'https://www.youtube.com/watch?v=IF7DGTWCK_c',
    title: 'IONIC EQUILIBRIUM in One Shot: All Concepts & PYQs Covered | JEE Main & Advanced',
    channel: 'PW Manzil (JEE Wallah)',
    durationEstimate: '6h 20m',
    badge: 'PW Manzil',
    playlistUrl: PW_MANZIL_2026_PHYSICAL_CHEM_PLAYLIST_URL,
    playlistName: 'PW Manzil Physical Chemistry Playlist',
    searchQuery: 'Ionic Equilibrium pH Buffer Solutions Hydrolysis Ksp One Shot JEE Main',
  },
  'chem-06': {
    id: 'chem-06',
    videoId: '8oypjDXAXZc',
    url: 'https://www.youtube.com/watch?v=8oypjDXAXZc',
    title: 'Manzil 2026: REDOX REACTION in 1 Shot: All Concepts & PYQs Covered',
    channel: 'PW Manzil 2026 (JEE Wallah)',
    durationEstimate: '6h 31m',
    badge: 'PW Manzil 2026',
    playlistUrl: PW_MANZIL_2026_PHYSICAL_CHEM_PLAYLIST_URL,
    playlistName: 'PW Manzil 2026 Physical Chemistry Playlist',
    searchQuery: 'Redox Reactions Oxidation Number Balancing One Shot JEE Main',
  },
  'chem-07': {
    id: 'chem-07',
    videoId: 'GplPceRaMi0',
    url: 'https://www.youtube.com/watch?v=GplPceRaMi0',
    title: 'Manzil 2026: ELECTROCHEMISTRY in One Shot: All Concepts & PYQs Covered',
    channel: 'PW Manzil 2026 (JEE Wallah)',
    durationEstimate: '7h 52m',
    badge: 'PW Manzil 2026',
    playlistUrl: PW_MANZIL_2026_PHYSICAL_CHEM_PLAYLIST_URL,
    playlistName: 'PW Manzil 2026 Physical Chemistry Playlist',
    searchQuery: 'Electrochemistry Galvanic Cells Nernst Equation Conductance One Shot JEE Main',
  },
  'chem-08': {
    id: 'chem-08',
    videoId: 'kwPNxC9AgZA',
    url: 'https://www.youtube.com/watch?v=kwPNxC9AgZA',
    title: 'Manzil 2026: CHEMICAL KINETICS in One Shot: All Concepts & PYQs Covered',
    channel: 'PW Manzil 2026 (JEE Wallah)',
    durationEstimate: '5h 32m',
    badge: 'PW Manzil 2026',
    playlistUrl: PW_MANZIL_2026_PHYSICAL_CHEM_PLAYLIST_URL,
    playlistName: 'PW Manzil 2026 Physical Chemistry Playlist',
    searchQuery: 'Chemical Kinetics Rate Law Order of Reaction One Shot JEE Main',
  },
  'chem-09': {
    id: 'chem-09',
    videoId: 'f6ENSghG7T4',
    url: 'https://www.youtube.com/watch?v=f6ENSghG7T4',
    title: 'Manzil 2026: SOLUTIONS in 1 Shot: All Concepts & PYQs Covered',
    channel: 'PW Manzil 2026 (JEE Wallah)',
    durationEstimate: '7h 27m',
    badge: 'PW Manzil 2026',
    playlistUrl: PW_MANZIL_2026_PHYSICAL_CHEM_PLAYLIST_URL,
    playlistName: 'PW Manzil 2026 Physical Chemistry Playlist',
    searchQuery: 'Solutions and Colligative Properties Raoults Law One Shot JEE Main',
  },

  // ==========================================
  // INORGANIC CHEMISTRY (PW Manzil 2026 Playlist: PLxyGaR3hEy3hUTwPWVhqBOR0l_1o3vyCs)
  // ==========================================
  'chem-10': {
    id: 'chem-10',
    videoId: 'nLE7_YBFQNQ',
    url: 'https://www.youtube.com/watch?v=nLE7_YBFQNQ',
    title: 'Manzil 2026: PERIODIC TABLE in One Shot: All Concepts & PYQs Covered',
    channel: 'PW Manzil 2026 (JEE Wallah)',
    durationEstimate: '6h 57m',
    badge: 'PW Manzil 2026',
    playlistUrl: PW_MANZIL_2026_INORGANIC_CHEM_PLAYLIST_URL,
    playlistName: 'PW Manzil 2026 Inorganic Chemistry Playlist',
    searchQuery: 'Periodic Table Periodicity Classification of Elements One Shot JEE Main',
  },
  'chem-11': {
    id: 'chem-11',
    videoId: 'kS8s_WX0IlY',
    url: 'https://www.youtube.com/watch?v=kS8s_WX0IlY',
    title: 'Manzil 2026: CHEMICAL BONDING in One Shot: All Concepts & PYQs Covered',
    channel: 'PW Manzil 2026 (JEE Wallah)',
    durationEstimate: '9h 29m',
    badge: 'PW Manzil 2026',
    playlistUrl: PW_MANZIL_2026_INORGANIC_CHEM_PLAYLIST_URL,
    playlistName: 'PW Manzil 2026 Inorganic Chemistry Playlist',
    searchQuery: 'Chemical Bonding and Molecular Structure VSEPR Hybridization One Shot JEE Main',
  },
  'chem-12': {
    id: 'chem-12',
    videoId: 'b0k5LOk_uPk',
    url: 'https://www.youtube.com/watch?v=b0k5LOk_uPk',
    title: 'Manzil 2026: P-BLOCK in One Shot: All Concepts & PYQs Covered',
    channel: 'PW Manzil 2026 (JEE Wallah)',
    durationEstimate: '5h 25m',
    badge: 'PW Manzil 2026',
    playlistUrl: PW_MANZIL_2026_INORGANIC_CHEM_PLAYLIST_URL,
    playlistName: 'PW Manzil 2026 Inorganic Chemistry Playlist',
    searchQuery: 'p Block Elements Groups 13 to 18 One Shot JEE Main',
  },
  'chem-13': {
    id: 'chem-13',
    videoId: 'SjILQ6cX_Vo',
    url: 'https://www.youtube.com/watch?v=SjILQ6cX_Vo',
    title: 'Manzil 2026: D & F-BLOCK in One Shot: All Concepts & PYQs Covered',
    channel: 'PW Manzil 2026 (JEE Wallah)',
    durationEstimate: '6h 20m',
    badge: 'PW Manzil 2026',
    playlistUrl: PW_MANZIL_2026_INORGANIC_CHEM_PLAYLIST_URL,
    playlistName: 'PW Manzil 2026 Inorganic Chemistry Playlist',
    searchQuery: 'd and f block elements Transition Metals Lanthanoids One Shot JEE Main',
  },
  'chem-14': {
    id: 'chem-14',
    videoId: '5myJzBeN514',
    url: 'https://www.youtube.com/watch?v=5myJzBeN514',
    title: 'Manzil 2026: COORDINATION COMPOUNDS in One Shot: All Concepts & PYQs Covered',
    channel: 'PW Manzil 2026 (JEE Wallah)',
    durationEstimate: '7h 47m',
    badge: 'PW Manzil 2026',
    playlistUrl: PW_MANZIL_2026_INORGANIC_CHEM_PLAYLIST_URL,
    playlistName: 'PW Manzil 2026 Inorganic Chemistry Playlist',
    searchQuery: 'Coordination Compounds CFT VBT Isomerism IUPAC One Shot JEE Main',
  },
  'chem-15': {
    id: 'chem-15',
    videoId: '8rRnn4ECwXI',
    url: 'https://www.youtube.com/watch?v=8rRnn4ECwXI',
    title: 'Manzil 2026: SALT ANALYSIS in One Shot: All Concepts & PYQs Covered',
    channel: 'PW Manzil 2026 (JEE Wallah)',
    durationEstimate: '6h 32m',
    badge: 'PW Manzil 2026',
    playlistUrl: PW_MANZIL_2026_INORGANIC_CHEM_PLAYLIST_URL,
    playlistName: 'PW Manzil 2026 Inorganic Chemistry Playlist',
    searchQuery: 'Salt Analysis Qualitative Analysis Practical Chemistry One Shot JEE Main',
  },

  // ==========================================
  // ORGANIC CHEMISTRY (PW Manzil 2025 Playlist: PLxyGaR3hEy3joVGFUCCKG5BIKBSBW5ihL)
  // ==========================================
  'chem-16': {
    id: 'chem-16',
    videoId: 'MOq0t9wBaXc',
    url: 'https://www.youtube.com/watch?v=MOq0t9wBaXc',
    title: 'Manzil 2025: IUPAC NOMENCLATURE in One Shot: All Concepts & PYQs Covered',
    channel: 'PW Manzil 2025 (JEE Wallah)',
    durationEstimate: '5h 18m',
    badge: 'PW Manzil 2025',
    playlistUrl: PW_MANZIL_2025_ORGANIC_CHEM_PLAYLIST_URL,
    playlistName: 'PW Manzil 2025 Organic Chemistry Playlist',
    searchQuery: 'IUPAC Nomenclature Organic Chemistry One Shot JEE Main',
  },
  'chem-17': {
    id: 'chem-17',
    videoId: 'wA3qYrCoydE',
    url: 'https://www.youtube.com/watch?v=wA3qYrCoydE',
    title: 'Manzil 2025: GOC in One Shot: All Concepts & PYQs Covered',
    channel: 'PW Manzil 2025 (JEE Wallah)',
    durationEstimate: '8h 01m',
    badge: 'PW Manzil 2025',
    playlistUrl: PW_MANZIL_2025_ORGANIC_CHEM_PLAYLIST_URL,
    playlistName: 'PW Manzil 2025 Organic Chemistry Playlist',
    searchQuery: 'General Organic Chemistry GOC Inductive Resonance Hyperconjugation One Shot JEE Main',
  },
  'chem-18': {
    id: 'chem-18',
    videoId: 'ajG-4UVkdeE',
    url: 'https://www.youtube.com/watch?v=ajG-4UVkdeE',
    title: 'Manzil 2025: ISOMERISM in One Shot: All Concepts & PYQs Covered',
    channel: 'PW Manzil 2025 (JEE Wallah)',
    durationEstimate: '7h 31m',
    badge: 'PW Manzil 2025',
    playlistUrl: PW_MANZIL_2025_ORGANIC_CHEM_PLAYLIST_URL,
    playlistName: 'PW Manzil 2025 Organic Chemistry Playlist',
    searchQuery: 'Isomerism Optical Geometrical Structural Stereoisomerism One Shot JEE Main',
  },
  'chem-19': {
    id: 'chem-19',
    videoId: 'gUCTJ7oVhLg',
    url: 'https://www.youtube.com/watch?v=gUCTJ7oVhLg',
    title: 'Manzil 2025: HYDROCARBON in One Shot: All Concepts & PYQs Covered',
    channel: 'PW Manzil 2025 (JEE Wallah)',
    durationEstimate: '6h 43m',
    badge: 'PW Manzil 2025',
    playlistUrl: PW_MANZIL_2025_ORGANIC_CHEM_PLAYLIST_URL,
    playlistName: 'PW Manzil 2025 Organic Chemistry Playlist',
    searchQuery: 'Hydrocarbons Alkanes Alkenes Alkynes Arenes One Shot JEE Main',
  },
  'chem-20': {
    id: 'chem-20',
    videoId: '9EGXs98Encw',
    url: 'https://www.youtube.com/watch?v=9EGXs98Encw',
    title: 'Manzil 2025: HALOALKANES & HALOARENES in One Shot: All Concepts & PYQs Covered',
    channel: 'PW Manzil 2025 (JEE Wallah)',
    durationEstimate: '5h 17m',
    badge: 'PW Manzil 2025',
    playlistUrl: PW_MANZIL_2025_ORGANIC_CHEM_PLAYLIST_URL,
    playlistName: 'PW Manzil 2025 Organic Chemistry Playlist',
    searchQuery: 'Haloalkanes and Haloarenes Alkyl Halides SN1 SN2 Mechanisms One Shot JEE Main',
  },
  'chem-21': {
    id: 'chem-21',
    videoId: 'RzzabEhT_Sw',
    url: 'https://www.youtube.com/watch?v=RzzabEhT_Sw',
    title: 'Manzil 2025: ALCOHOLS, PHENOLS & ETHERS in One Shot: All Concepts & PYQs Covered',
    channel: 'PW Manzil 2025 (JEE Wallah)',
    durationEstimate: '5h 36m',
    badge: 'PW Manzil 2025',
    playlistUrl: PW_MANZIL_2025_ORGANIC_CHEM_PLAYLIST_URL,
    playlistName: 'PW Manzil 2025 Organic Chemistry Playlist',
    searchQuery: 'Alcohols Phenols Ethers One Shot JEE Main',
  },
  'chem-22': {
    id: 'chem-22',
    videoId: '1wP3hVr7JEQ',
    url: 'https://www.youtube.com/watch?v=1wP3hVr7JEQ',
    title: 'Manzil 2025: ALDEHYDES, KETONES & CARBOXYLIC ACIDS in One Shot: All Concepts & PYQs Covered',
    channel: 'PW Manzil 2025 (JEE Wallah)',
    durationEstimate: '6h 50m',
    badge: 'PW Manzil 2025',
    playlistUrl: PW_MANZIL_2025_ORGANIC_CHEM_PLAYLIST_URL,
    playlistName: 'PW Manzil 2025 Organic Chemistry Playlist',
    searchQuery: 'Aldehydes Ketones Carboxylic Acids Carbonyl Compounds One Shot JEE Main',
  },
  'chem-23': {
    id: 'chem-23',
    videoId: 'z-E_koEXP8k',
    url: 'https://www.youtube.com/watch?v=z-E_koEXP8k',
    title: 'Manzil 2025: AMINES in One Shot: All Concepts & PYQs Covered',
    channel: 'PW Manzil 2025 (JEE Wallah)',
    durationEstimate: '3h 40m',
    badge: 'PW Manzil 2025',
    playlistUrl: PW_MANZIL_2025_ORGANIC_CHEM_PLAYLIST_URL,
    playlistName: 'PW Manzil 2025 Organic Chemistry Playlist',
    searchQuery: 'Amines Diazonium Salts Nitrogen Organic Compounds One Shot JEE Main',
  },
  'chem-24': {
    id: 'chem-24',
    videoId: '8hUpNyPrWaM',
    url: 'https://www.youtube.com/watch?v=8hUpNyPrWaM',
    title: 'Manzil 2025: BIOMOLECULES in One Shot: All Concepts & PYQs Covered',
    channel: 'PW Manzil 2025 (JEE Wallah)',
    durationEstimate: '2h 34m',
    badge: 'PW Manzil 2025',
    playlistUrl: PW_MANZIL_2025_ORGANIC_CHEM_PLAYLIST_URL,
    playlistName: 'PW Manzil 2025 Organic Chemistry Playlist',
    searchQuery: 'Biomolecules Carbohydrates Amino Acids Nucleic Acids Vitamins One Shot JEE Main',
  },

  // ==========================================
  // MATHEMATICS (21 Chapters)
  // ==========================================
  'math-01': {
    id: 'math-01',
    videoId: 'SOXQuRrgJHo',
    url: 'https://www.youtube.com/watch?v=SOXQuRrgJHo',
    title: 'Sets, Relations and Functions in One Shot | All Concepts',
    channel: 'JEE Wallah',
    durationEstimate: '2.5 hours',
    searchQuery: 'Sets Relations and Functions One Shot JEE Main',
  },
  'math-02': {
    id: 'math-02',
    videoId: 'jhFQxTiJdf8',
    url: 'https://www.youtube.com/watch?v=jhFQxTiJdf8',
    title: 'INVERSE TRIGONOMETRIC FUNCTIONS in One Shot | All Concepts & PYQs Covered',
    channel: 'JEE Wallah',
    durationEstimate: '2.5 hours',
    searchQuery: 'Inverse Trigonometric Functions ITF One Shot JEE Main',
  },
  'math-03': {
    id: 'math-03',
    videoId: 'o8T4ZG08q8g',
    url: 'https://www.youtube.com/watch?v=o8T4ZG08q8g',
    title: 'Complex Numbers & Quadratic Equations Full Chapter',
    channel: 'Arjuna JEE',
    durationEstimate: '2.5 hours',
    searchQuery: 'Complex Numbers and Quadratic Equations One Shot JEE Main',
  },
  'math-04': {
    id: 'math-04',
    videoId: 'd4U9uK40eCg',
    url: 'https://www.youtube.com/watch?v=d4U9uK40eCg',
    title: 'Matrices & Determinants Complete One Shot | All Concepts & Shortcuts',
    channel: 'JEE Wallah',
    durationEstimate: '2.5 hours',
    searchQuery: 'Matrices and Determinants One Shot JEE Main',
  },
  'math-05': {
    id: 'math-05',
    videoId: 'wYv7u7Tq_eQ',
    url: 'https://www.youtube.com/watch?v=wYv7u7Tq_eQ',
    title: 'Permutations and Combinations Masterclass in 2 Hours',
    channel: 'JEE Wallah',
    durationEstimate: '2 hours',
    searchQuery: 'Permutations and Combinations PNC One Shot JEE Main',
  },
  'math-06': {
    id: 'math-06',
    videoId: 'w9kE7_zT6nU',
    url: 'https://www.youtube.com/watch?v=w9kE7_zT6nU',
    title: 'Binomial Theorem in 90 Minutes | Full Concepts & PYQ Series',
    channel: 'MathonGo',
    durationEstimate: '90 mins',
    searchQuery: 'Binomial Theorem One Shot JEE Main MathonGo',
  },
  'math-07': {
    id: 'math-07',
    videoId: 'eYp0z-K4qRo',
    url: 'https://www.youtube.com/watch?v=eYp0z-K4qRo',
    title: 'Sequence & Series in One Shot | AP, GP, Special Series',
    channel: 'JEE Wallah',
    durationEstimate: '2 hours',
    searchQuery: 'Sequence and Series AP GP HP One Shot JEE Main',
  },
  'math-08': {
    id: 'math-08',
    videoId: 'o2F7_z6b-p0',
    url: 'https://www.youtube.com/watch?v=o2F7_z6b-p0',
    title: 'Trigonometry Complete Revision | Ratios, Identities & Equations',
    channel: 'JEE Wallah',
    durationEstimate: '2.5 hours',
    searchQuery: 'Trigonometric Ratios Identities Equations One Shot JEE Main',
  },
  'math-09': {
    id: 'math-09',
    videoId: 'g6F6iVbE8_M',
    url: 'https://www.youtube.com/watch?v=g6F6iVbE8_M',
    title: 'Limits, Continuity & Differentiability in One Shot',
    channel: 'JEE Wallah',
    durationEstimate: '3 hours',
    searchQuery: 'Limits Continuity Differentiability LCD One Shot JEE Main',
  },
  'math-10': {
    id: 'math-10',
    videoId: 'f_6_3u0E4oI',
    url: 'https://www.youtube.com/watch?v=f_6_3u0E4oI',
    title: 'Application of Derivatives (AOD) in One Shot | Tangents & Maxima',
    channel: 'JEE Wallah',
    durationEstimate: '2.5 hours',
    searchQuery: 'Application of Derivatives AOD Monotonicity Maxima Minima One Shot JEE Main',
  },
  'math-11': {
    id: 'math-11',
    videoId: 'aB7_N6mE8gE',
    url: 'https://www.youtube.com/watch?v=aB7_N6mE8gE',
    title: 'Indefinite Integration in 2 Hours | All Substitution Methods',
    channel: 'MathonGo',
    durationEstimate: '2 hours',
    searchQuery: 'Indefinite Integration Calculus One Shot JEE Main',
  },
  'math-12': {
    id: 'math-12',
    videoId: 'UwRAUIeoCtI',
    url: 'https://www.youtube.com/watch?v=UwRAUIeoCtI',
    title: 'DEFINITE INTEGRATION in One Shot: All Concepts & PYQs Covered',
    channel: 'JEE Wallah',
    durationEstimate: '2.5 hours',
    searchQuery: 'Definite Integration Properties King Rule One Shot JEE Main',
  },
  'math-13': {
    id: 'math-13',
    videoId: 'kZ6p43T16uI',
    url: 'https://www.youtube.com/watch?v=kZ6p43T16uI',
    title: 'Area Under Curves (AUC) in 60 Minutes | Formulas & Short Tricks',
    channel: 'JEE Wallah',
    durationEstimate: '60 mins',
    searchQuery: 'Area Under Curves AUC Application of Integrals One Shot JEE Main',
  },
  'math-14': {
    id: 'math-14',
    videoId: 'g7-2gGfT9mY',
    url: 'https://www.youtube.com/watch?v=g7-2gGfT9mY',
    title: 'Differential Equations in One Shot | Linear & Variable Separable',
    channel: 'JEE Wallah',
    durationEstimate: '2 hours',
    searchQuery: 'Differential Equations Integrating Factor One Shot JEE Main',
  },
  'math-15': {
    id: 'math-15',
    videoId: 'qP8k9vW2Z5M',
    url: 'https://www.youtube.com/watch?v=qP8k9vW2Z5M',
    title: 'Straight Lines & Coordinate Geometry Basics Full Revision',
    channel: 'JEE Wallah',
    durationEstimate: '2.5 hours',
    searchQuery: 'Straight Lines Pair of Straight Lines One Shot JEE Main',
  },
  'math-16': {
    id: 'math-16',
    videoId: 'e8vY-T9Q5iM',
    url: 'https://www.youtube.com/watch?v=e8vY-T9Q5iM',
    title: 'Circles in One Shot | Standard Forms, Tangents & Normal',
    channel: 'JEE Wallah',
    durationEstimate: '2.5 hours',
    searchQuery: 'Circles System of Circles Tangents One Shot JEE Main',
  },
  'math-17': {
    id: 'math-17',
    videoId: 'j0-Qz7l9x7w',
    url: 'https://www.youtube.com/watch?v=j0-Qz7l9x7w',
    title: 'Conic Sections (Parabola, Ellipse, Hyperbola) Complete Revision',
    channel: 'JEE Wallah',
    durationEstimate: '3.5 hours',
    searchQuery: 'Conic Sections Parabola Ellipse Hyperbola One Shot JEE Main',
  },
  'math-18': {
    id: 'math-18',
    videoId: 'r6gG-U4_o9w',
    url: 'https://www.youtube.com/watch?v=r6gG-U4_o9w',
    title: 'Vector Algebra in One Shot | Dot, Cross & Scalar Triple Product',
    channel: 'JEE Wallah',
    durationEstimate: '2 hours',
    searchQuery: 'Vector Algebra Dot Cross Scalar Triple Product One Shot JEE Main',
  },
  'math-19': {
    id: 'math-19',
    videoId: 'mP8_Y-6gV3k',
    url: 'https://www.youtube.com/watch?v=mP8_Y-6gV3k',
    title: '3D Geometry (Three Dimensional Geometry) in One Shot | Lines & Planes',
    channel: 'JEE Wallah',
    durationEstimate: '2.5 hours',
    searchQuery: 'Three Dimensional Geometry 3D Lines Planes One Shot JEE Main',
  },
  'math-20': {
    id: 'math-20',
    videoId: 'M0wE7kH_ojk',
    url: 'https://www.youtube.com/watch?v=M0wE7kH_ojk',
    title: 'STATISTICS : Complete Chapter in 1 Video || Concepts+PYQs',
    channel: 'JEE Wallah',
    durationEstimate: '2 hours',
    searchQuery: 'Statistics Measures of Dispersion Variance Standard Deviation One Shot JEE Main',
  },
  'math-21': {
    id: 'math-21',
    videoId: 'w_8pGz9uN7Y',
    url: 'https://www.youtube.com/watch?v=w_8pGz9uN7Y',
    title: 'Probability in One Shot | Bayes Theorem, Conditional Probability',
    channel: 'JEE Wallah',
    durationEstimate: '2.5 hours',
    searchQuery: 'Probability Bayes Theorem Conditional Probability One Shot JEE Main',
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

export const PW_MANZIL_2026_PHYSICAL_VIDEO_IDS = new Set([
  'CAb8YZKLoac',
  '7OkNy8vhDaw',
  'NwCmoh7Vd9g',
  'gcPWM9JVE0Q',
  'IF7DGTWCK_c',
  'BceSksiNLD4',
  '8oypjDXAXZc',
  'GplPceRaMi0',
  'kwPNxC9AgZA',
  'f6ENSghG7T4',
  '1W-UvePUAKo',
]);

export const PW_MANZIL_2026_INORGANIC_VIDEO_IDS = new Set([
  'nLE7_YBFQNQ',
  'kS8s_WX0IlY',
  'b0k5LOk_uPk',
  'SjILQ6cX_Vo',
  '5myJzBeN514',
  '8rRnn4ECwXI',
]);

export const PW_MANZIL_2025_ORGANIC_VIDEO_IDS = new Set([
  'MOq0t9wBaXc',
  'wA3qYrCoydE',
  'ajG-4UVkdeE',
  'gUCTJ7oVhLg',
  '9EGXs98Encw',
  'RzzabEhT_Sw',
  '1wP3hVr7JEQ',
  'z-E_koEXP8k',
  '8hUpNyPrWaM',
]);

export const PW_MANZIL_VIDEO_IDS = new Set([
  ...PW_MANZIL_2026_PHYSICAL_VIDEO_IDS,
  ...PW_MANZIL_2026_INORGANIC_VIDEO_IDS,
  ...PW_MANZIL_2025_ORGANIC_VIDEO_IDS,
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

export function isKnownInvalidUrl(url?: string): boolean {
  if (!url) return true;
  const vid = extractYouTubeVideoId(url);
  if (!vid) return true;
  return KNOWN_INVALID_VIDEO_IDS.has(vid);
}

export function getValidVideoUrlForChapter(chapterId: string, currentUrl?: string): string {
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

  if (currentUrl && !isKnownInvalidUrl(currentUrl)) {
    return currentUrl;
  }
  const curated = getCuratedVideo(chapterId);
  return curated.url;
}
