export interface Credit {
  name: string;
  role: string;
  isMainArtist?: boolean;
}

export interface ArtistDetails {
  name: string;
  imageUrl: string;
  isVerified: boolean;
  monthlyListeners: number;
}

export interface Track {
  id: string;
  title: string;
  durationMs: number;
  audioUrl: string;
  imageUrl: string;
  albumName: string;
  addedAt: string;
  artist: ArtistDetails;
  sourceUrl?: string;
  credits: Credit[];
}

export interface PlaylistData {
  id: string;
  title: string;
  owner: string;
  description?: string;
  imageUrl: string;
  tracks: Track[];
  type: "Album" | "Playlist";
}

export interface CategoryData {
  id: string;
  title: string;
  bgColor: string;
  imageUrl: string;
}

const clonnexArtist: ArtistDetails = {
  name: "Clonnex",
  imageUrl:
    "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2000&auto=format&fit=crop",
  isVerified: true,
  monthlyListeners: 124584,
};

const synthwaveArtist: ArtistDetails = {
  name: "Kavinsky",
  imageUrl:
    "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=2000&auto=format&fit=crop",
  isVerified: true,
  monthlyListeners: 3500200,
};

const lofiArtist: ArtistDetails = {
  name: "Lofi Girl",
  imageUrl:
    "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=2000&auto=format&fit=crop",
  isVerified: false,
  monthlyListeners: 8900000,
};

export const allTracks: Track[] = [
  {
    id: "a4037099-9e25-4b41-9707-517b7903fed9",
    title: "Перший хіт",
    durationMs: 204000,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    imageUrl:
      "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=150",
    albumName: "Neon Nights",
    addedAt: "2026-08-21T10:00:00Z",
    artist: clonnexArtist,
    credits: [
      { name: "Clonnex", role: "Основний Виконавець", isMainArtist: true },
    ],
  },
  {
    id: "t2",
    title: "Nightcall",
    durationMs: 258000,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    imageUrl: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=150",
    albumName: "OutRun",
    addedAt: "2026-08-22T10:00:00Z",
    artist: synthwaveArtist,
    credits: [
      { name: "Kavinsky", role: "Основний Виконавець", isMainArtist: true },
    ],
  },
  {
    id: "t3",
    title: "Chill Study Beats",
    durationMs: 185000,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    imageUrl:
      "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150",
    albumName: "Morning Coffee",
    addedAt: "2026-08-23T10:00:00Z",
    artist: lofiArtist,
    credits: [
      { name: "Lofi Girl", role: "Основний Виконавець", isMainArtist: true },
    ],
  },
  {
    id: "t4",
    title: "Cyberpunk City",
    durationMs: 210000,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    imageUrl:
      "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=150",
    albumName: "OutRun",
    addedAt: "2026-08-24T10:00:00Z",
    artist: synthwaveArtist,
    credits: [
      { name: "Kavinsky", role: "Основний Виконавець", isMainArtist: true },
    ],
  },
];

export const userStats = {
  listeningTime: {
    allTime: "11h 32m",
    thisWeek: "5h 12m",
  },
  library: {
    tracksCount: 50,
    playlistsCount: 4,
    duration: "2h 11m",
  },
  streaks: {
    weeklyPulse: 75, // Відсоток заповненості прогрес-бару
    dailyGoal: { current: 2, total: 120, unit: "m" },
    streakDays: 1,
  },
};

export const userPlaylists: PlaylistData[] = [
  {
    id: "p1",
    title: "Топ Треки 2026",
    owner: "Твій Нікнейм",
    description: "Найкраща музика для кодінгу",
    imageUrl:
      "https://images.unsplash.com/photo-1493225457124-a1a2a5956093?w=500",
    tracks: [allTracks[0], allTracks[1], allTracks[3]],
    type: "Playlist",
  },
  {
    id: "p2",
    title: "OutRun (Deluxe)",
    owner: "Kavinsky",
    description: "Офіційний альбом",
    imageUrl: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=500",
    tracks: [allTracks[1], allTracks[3]],
    type: "Album",
  },
  {
    id: "p3",
    title: "Lo-Fi 24/7",
    owner: "Spotify",
    description: "Музика для навчання та релаксу",
    imageUrl:
      "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500",
    tracks: [allTracks[2]],
    type: "Playlist",
  },
];

export const searchCategories: CategoryData[] = [
  {
    id: "c1",
    title: "Поп",
    bgColor: "#8a2be2",
    imageUrl: "https://placehold.co/150/purple/white?text=Pop",
  },
  {
    id: "c2",
    title: "Хіп-хоп",
    bgColor: "#d2691e",
    imageUrl: "https://placehold.co/150/orange/white?text=HipHop",
  },
  {
    id: "c3",
    title: "Рок",
    bgColor: "#dc143c",
    imageUrl: "https://placehold.co/150/red/white?text=Rock",
  },
  {
    id: "c4",
    title: "Інді",
    bgColor: "#daa520",
    imageUrl: "https://placehold.co/150/yellow/black?text=Indie",
  },
  {
    id: "c5",
    title: "Електронна",
    bgColor: "#008b8b",
    imageUrl: "https://placehold.co/150/cyan/white?text=Electro",
  },
  {
    id: "c6",
    title: "Класична",
    bgColor: "#2e8b57",
    imageUrl: "https://placehold.co/150/green/white?text=Classic",
  },
  {
    id: "c7",
    title: "Подкасти",
    bgColor: "#008080",
    imageUrl: "https://placehold.co/150/teal/white?text=Podcasts",
  },
  {
    id: "c8",
    title: "Новинки",
    bgColor: "#9370db",
    imageUrl: "https://placehold.co/150/indigo/white?text=New",
  },
];
