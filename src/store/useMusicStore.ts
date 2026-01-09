import { create } from 'zustand';
import type { MusicTrack } from '@/types';

interface MusicState {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  progress: number;
  volume: number;
  queue: MusicTrack[];
  
  // Actions
  play: (track: MusicTrack) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  next: () => void;
  previous: () => void;
  setProgress: (progress: number) => void;
  setVolume: (volume: number) => void;
  addToQueue: (track: MusicTrack) => void;
  clearQueue: () => void;
}

export const useMusicStore = create<MusicState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  progress: 0,
  volume: 80,
  queue: [],

  play: (track) => {
    set({ currentTrack: track, isPlaying: true, progress: 0 });
  },

  pause: () => {
    set({ isPlaying: false });
  },

  resume: () => {
    set({ isPlaying: true });
  },

  stop: () => {
    set({ currentTrack: null, isPlaying: false, progress: 0 });
  },

  next: () => {
    const { queue, currentTrack } = get();
    if (queue.length === 0) return;
    
    const currentIndex = queue.findIndex(t => t.id === currentTrack?.id);
    const nextIndex = (currentIndex + 1) % queue.length;
    
    set({ currentTrack: queue[nextIndex], progress: 0, isPlaying: true });
  },

  previous: () => {
    const { queue, currentTrack, progress } = get();
    if (queue.length === 0) return;
    
    // If more than 3 seconds in, restart current track
    if (progress > 3) {
      set({ progress: 0 });
      return;
    }
    
    const currentIndex = queue.findIndex(t => t.id === currentTrack?.id);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : queue.length - 1;
    
    set({ currentTrack: queue[prevIndex], progress: 0, isPlaying: true });
  },

  setProgress: (progress) => {
    set({ progress });
  },

  setVolume: (volume) => {
    set({ volume: Math.max(0, Math.min(100, volume)) });
  },

  addToQueue: (track) => {
    set(state => ({ queue: [...state.queue, track] }));
  },

  clearQueue: () => {
    set({ queue: [] });
  },
}));
