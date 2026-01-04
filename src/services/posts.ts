import type { Post, Comment, PaginatedResponse, ApiResponse } from '@/types';
import { mockPosts } from './mockData';
import { delay } from './api';

// Mock service - ready to be replaced with real API calls

export const postsService = {
  async getFeed(page = 1, limit = 10): Promise<PaginatedResponse<Post>> {
    await delay(500); // Simulate network delay
    
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedPosts = mockPosts.slice(start, end);
    
    return {
      data: paginatedPosts,
      total: mockPosts.length,
      page,
      limit,
      hasMore: end < mockPosts.length,
    };
  },

  async getPostById(id: string): Promise<ApiResponse<Post>> {
    await delay(300);
    
    const post = mockPosts.find(p => p.id === id);
    
    if (!post) {
      return { data: null as unknown as Post, success: false, message: 'Post not found' };
    }
    
    return { data: post, success: true };
  },

  async createPost(content: string, images?: string[], musicId?: string): Promise<ApiResponse<Post>> {
    await delay(500);
    
    // Mock creating a new post
    const newPost: Post = {
      id: Date.now().toString(),
      author: mockPosts[0].author, // Current user
      content,
      images,
      likes: 0,
      comments: 0,
      reposts: 0,
      isLiked: false,
      reactions: [],
      createdAt: new Date().toISOString(),
    };
    
    return { data: newPost, success: true };
  },

  async likePost(postId: string): Promise<ApiResponse<{ liked: boolean; likes: number }>> {
    await delay(200);
    
    const post = mockPosts.find(p => p.id === postId);
    if (post) {
      post.isLiked = !post.isLiked;
      post.likes += post.isLiked ? 1 : -1;
      return { data: { liked: post.isLiked, likes: post.likes }, success: true };
    }
    
    return { data: { liked: false, likes: 0 }, success: false };
  },

  async addReaction(postId: string, emoji: string): Promise<ApiResponse<void>> {
    await delay(200);
    return { data: undefined, success: true };
  },

  async getComments(postId: string): Promise<PaginatedResponse<Comment>> {
    await delay(400);
    
    const mockComments: Comment[] = [
      {
        id: '1',
        author: mockPosts[1].author,
        content: 'Потрясающее фото! 📸',
        likes: 12,
        isLiked: false,
        createdAt: '2024-12-20T19:00:00Z',
      },
      {
        id: '2',
        author: mockPosts[2].author,
        content: 'Какая красота! Где это снято?',
        likes: 8,
        isLiked: true,
        createdAt: '2024-12-20T19:15:00Z',
      },
    ];
    
    return {
      data: mockComments,
      total: mockComments.length,
      page: 1,
      limit: 20,
      hasMore: false,
    };
  },

  async addComment(postId: string, content: string): Promise<ApiResponse<Comment>> {
    await delay(300);
    
    const newComment: Comment = {
      id: Date.now().toString(),
      author: mockPosts[0].author,
      content,
      likes: 0,
      isLiked: false,
      createdAt: new Date().toISOString(),
    };
    
    return { data: newComment, success: true };
  },
};
