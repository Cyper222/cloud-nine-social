import type { User, Post, Short, Conversation, Message, FriendRequest, MusicTrack } from '@/types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    username: 'cloud_dreamer',
    displayName: 'Мария Облакова',
    email: 'maria@clouds.app',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    cover: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1200&h=400&fit=crop',
    bio: 'Летаю среди облаков ☁️ Фотограф и мечтатель',
    isOnline: true,
    friendsCount: 342,
    postsCount: 128,
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    username: 'sky_walker',
    displayName: 'Алексей Небесный',
    email: 'alex@clouds.app',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    cover: 'https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?w=1200&h=400&fit=crop',
    bio: 'Программист днём, музыкант ночью 🎸',
    isOnline: false,
    friendsCount: 156,
    postsCount: 67,
    createdAt: '2024-02-20T14:30:00Z',
  },
  {
    id: '3',
    username: 'aurora_light',
    displayName: 'Аврора Светлова',
    email: 'aurora@clouds.app',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    cover: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200&h=400&fit=crop',
    bio: 'Дизайнер интерфейсов | Люблю минимализм',
    isOnline: true,
    friendsCount: 523,
    postsCount: 201,
    createdAt: '2023-11-10T09:15:00Z',
  },
  {
    id: '4',
    username: 'storm_chaser',
    displayName: 'Дмитрий Громов',
    email: 'dmitry@clouds.app',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    cover: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1200&h=400&fit=crop',
    bio: 'Путешественник | Фотограф погоды ⛈️',
    isOnline: true,
    friendsCount: 891,
    postsCount: 445,
    createdAt: '2023-08-05T16:45:00Z',
  },
];

// Mock Music Tracks
export const mockTracks: MusicTrack[] = [
  {
    id: '1',
    title: 'Облака над городом',
    artist: 'CloudWave',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=200&fit=crop',
    duration: 234,
  },
  {
    id: '2',
    title: 'Летний бриз',
    artist: 'SkyMelody',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop',
    duration: 187,
  },
  {
    id: '3',
    title: 'Ночное небо',
    artist: 'Stellar Dreams',
    cover: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=200&h=200&fit=crop',
    duration: 312,
  },
];

// Mock Posts
export const mockPosts: Post[] = [
  {
    id: '1',
    author: mockUsers[0],
    content: 'Сегодняшний закат был просто невероятным! 🌅 Облака окрасились в самые нежные оттенки розового и золотого. Такие моменты напоминают, почему я так люблю фотографию.',
    images: [
      'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?w=800&h=600&fit=crop',
    ],
    likes: 234,
    comments: 45,
    reposts: 12,
    isLiked: false,
    reactions: [
      { emoji: '❤️', count: 156, isReacted: false },
      { emoji: '😍', count: 78, isReacted: true },
      { emoji: '🔥', count: 45, isReacted: false },
    ],
    createdAt: '2024-12-20T18:30:00Z',
  },
  {
    id: '2',
    author: mockUsers[1],
    content: 'Новый трек готов! 🎵 Работал над ним целый месяц. Слушайте и делитесь впечатлениями!',
    music: mockTracks[0],
    likes: 567,
    comments: 89,
    reposts: 34,
    isLiked: true,
    reactions: [
      { emoji: '🎵', count: 234, isReacted: true },
      { emoji: '❤️', count: 189, isReacted: false },
      { emoji: '👏', count: 144, isReacted: false },
    ],
    createdAt: '2024-12-19T14:15:00Z',
  },
  {
    id: '3',
    author: mockUsers[2],
    content: 'Завершила редизайн мобильного приложения! Минималистичный подход с акцентом на usability. Что думаете? 💭',
    images: [
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop',
    ],
    likes: 892,
    comments: 156,
    reposts: 67,
    isLiked: false,
    reactions: [
      { emoji: '🎨', count: 445, isReacted: false },
      { emoji: '❤️', count: 267, isReacted: false },
      { emoji: '✨', count: 180, isReacted: false },
    ],
    createdAt: '2024-12-18T09:45:00Z',
  },
  {
    id: '4',
    author: mockUsers[3],
    content: 'Штормовые облака над Байкалом. Природа показывает свою мощь! ⛈️',
    images: [
      'https://images.unsplash.com/photo-1527482937786-6f4e4f7b7f5e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800&h=600&fit=crop',
    ],
    likes: 1234,
    comments: 234,
    reposts: 89,
    isLiked: true,
    reactions: [
      { emoji: '🌊', count: 567, isReacted: true },
      { emoji: '😮', count: 345, isReacted: false },
      { emoji: '❤️', count: 322, isReacted: false },
    ],
    createdAt: '2024-12-17T16:20:00Z',
  },
];

// Mock Shorts
export const mockShorts: Short[] = [
  {
    id: '1',
    author: mockUsers[0],
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=400&h=700&fit=crop',
    description: 'Облака на закате 🌅 #природа #облака',
    likes: 5678,
    comments: 234,
    shares: 89,
    isLiked: false,
    music: mockTracks[1],
  },
  {
    id: '2',
    author: mockUsers[2],
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=700&fit=crop',
    description: 'UI/UX туториал: Glassmorphism ✨',
    likes: 12345,
    comments: 567,
    shares: 234,
    isLiked: true,
  },
];

// Mock Conversations
export const mockConversations: Conversation[] = [
  {
    id: '1',
    participant: mockUsers[1],
    lastMessage: {
      id: 'm1',
      senderId: mockUsers[1].id,
      content: 'Привет! Как дела?',
      createdAt: '2024-12-20T15:30:00Z',
      isRead: false,
    },
    unreadCount: 2,
  },
  {
    id: '2',
    participant: mockUsers[2],
    lastMessage: {
      id: 'm2',
      senderId: '1',
      content: 'Спасибо за фидбек! 🙏',
      createdAt: '2024-12-19T20:15:00Z',
      isRead: true,
    },
    unreadCount: 0,
  },
  {
    id: '3',
    participant: mockUsers[3],
    lastMessage: {
      id: 'm3',
      senderId: mockUsers[3].id,
      content: 'Классные фотки с поездки!',
      createdAt: '2024-12-18T12:00:00Z',
      isRead: true,
    },
    unreadCount: 0,
  },
];

// Mock Friend Requests
export const mockFriendRequests: FriendRequest[] = [
  {
    id: '1',
    from: mockUsers[3],
    createdAt: '2024-12-20T10:00:00Z',
    status: 'pending',
  },
];

// Current User (logged in)
export const currentUser: User = mockUsers[0];
