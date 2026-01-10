import type { User, ApiResponse } from '@/types';
import { http, httpGet, httpPost, httpDelete } from './http';

// Backend types
interface FollowRead {
  follower_id: string;
  following_id: string;
  created_at: string;
}

interface UserShort {
  id: string;
  username: string;
  display_name?: string;
  avatar?: string;
}

// Social API service
export const socialService = {
  // Follow a user
  async follow(userId: string): Promise<ApiResponse<void>> {
    try {
      await httpPost(`/users/${userId}/follow`, {});
      return { data: undefined, success: true };
    } catch (error: any) {
      console.error('Failed to follow user:', error);
      return { 
        data: undefined, 
        success: false, 
        message: error.message || 'Не удалось подписаться' 
      };
    }
  },

  // Unfollow a user
  async unfollow(userId: string): Promise<ApiResponse<void>> {
    try {
      await httpDelete(`/users/${userId}/follow`);
      return { data: undefined, success: true };
    } catch (error: any) {
      console.error('Failed to unfollow user:', error);
      return { 
        data: undefined, 
        success: false, 
        message: error.message || 'Не удалось отписаться' 
      };
    }
  },

  // Check if following a user
  async isFollowing(userId: string): Promise<boolean> {
    try {
      const response = await httpGet<{ following: boolean }>(`/users/${userId}/following`);
      return response.following;
    } catch (error) {
      console.error('Failed to check follow status:', error);
      return false;
    }
  },

  // Get followers list
  async getFollowers(userId: string, page = 1, limit = 20): Promise<ApiResponse<User[]>> {
    try {
      const response = await httpGet<UserShort[]>(`/users/${userId}/followers?page=${page}&limit=${limit}`);
      const users: User[] = response.map(u => ({
        id: u.id,
        username: u.username,
        displayName: u.display_name || u.username,
        email: '',
        avatar: u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
        isOnline: false,
        friendsCount: 0,
        postsCount: 0,
        createdAt: new Date().toISOString(),
      }));
      return { data: users, success: true };
    } catch (error: any) {
      console.error('Failed to get followers:', error);
      return { 
        data: [], 
        success: false, 
        message: error.message || 'Не удалось загрузить подписчиков' 
      };
    }
  },

  // Get following list
  async getFollowing(userId: string, page = 1, limit = 20): Promise<ApiResponse<User[]>> {
    try {
      const response = await httpGet<UserShort[]>(`/users/${userId}/following?page=${page}&limit=${limit}`);
      const users: User[] = response.map(u => ({
        id: u.id,
        username: u.username,
        displayName: u.display_name || u.username,
        email: '',
        avatar: u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
        isOnline: false,
        friendsCount: 0,
        postsCount: 0,
        createdAt: new Date().toISOString(),
      }));
      return { data: users, success: true };
    } catch (error: any) {
      console.error('Failed to get following:', error);
      return { 
        data: [], 
        success: false, 
        message: error.message || 'Не удалось загрузить подписки' 
      };
    }
  },
};
