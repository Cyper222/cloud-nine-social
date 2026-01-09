// User Types
export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar: string;
  cover?: string;
  bio?: string;
  isOnline: boolean;
  friendsCount: number;
  postsCount: number;
  createdAt: string;
}

// Post Types
export interface Post {
  id: string;
  author: User;
  content: string;
  images?: string[];
  music?: MusicTrack;
  video?: VideoContent;
  likes: number;
  comments: number;
  reposts: number;
  isLiked: boolean;
  reactions: Reaction[];
  createdAt: string;
}

export interface Reaction {
  emoji: string;
  count: number;
  isReacted: boolean;
}

// Music Types
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  cover: string;
  duration: number;
  url?: string;
}

// Video Types
export interface VideoContent {
  id: string;
  url: string;
  thumbnail: string;
  duration: number;
  views: number;
}

// Shorts Types
export interface Short {
  id: string;
  author: User;
  videoUrl: string;
  thumbnail: string;
  description: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  music?: MusicTrack;
}

// Message Types
export interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participant: User;
  lastMessage: Message;
  unreadCount: number;
}

// Friend Types
export interface FriendRequest {
  id: string;
  from: User;
  createdAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}

// Comment Types
export interface Comment {
  id: string;
  author: User;
  content: string;
  likes: number;
  isLiked: boolean;
  createdAt: string;
  replies?: Comment[];
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
