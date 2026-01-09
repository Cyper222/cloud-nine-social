import type { Post, Comment, PaginatedResponse, ApiResponse } from '@/types';
import { mockPosts } from './mockData';
import { delay } from './api';
import { http, httpGet, httpPost, httpDelete } from './http';

// Backend Post types
interface PostRead {
  id: string;
  author_id: string;
  text: string | null;
  location: string | null;
  created_at: string;
  media?: PostMediaRead[];
}

interface PostMediaRead {
  id: string;
  post_id: string;
  media_key: string;
  media_type: string;
  position: number;
  created_at: string;
}

interface PostCreate {
  text?: string;
  media?: Array<{ media_key: string; media_type: string }>;
  location?: string;
}

// Helper to convert backend PostRead to frontend Post
const mapPostReadToPost = (postRead: PostRead, currentUser: any): Post => {
  const images = postRead.media
    ?.filter(m => m.media_type === 'image')
    .map(m => m.media_key) || [];
  
  return {
    id: postRead.id,
    author: currentUser, // TODO: нужно получать автора отдельно
    content: postRead.text || '',
    images: images.length > 0 ? images : undefined,
    likes: 0, // TODO: добавить в бэкенд
    comments: 0, // TODO: добавить в бэкенд
    reposts: 0, // TODO: добавить в бэкенд
    isLiked: false, // TODO: добавить в бэкенд
    reactions: [], // TODO: добавить в бэкенд
    createdAt: postRead.created_at,
  };
};

export const postsService = {
  async getFeed(page = 1, limit = 10): Promise<PaginatedResponse<Post>> {
    // TODO: добавить endpoint GET /posts для получения списка постов
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
    try {
      const postRead = await httpGet<PostRead>(`/posts/${id}`);
      // TODO: нужно получать автора отдельно
      const post = mapPostReadToPost(postRead, mockPosts[0].author);
      return { data: post, success: true };
    } catch (error) {
      console.error('Failed to fetch post:', error);
      // Fallback to mock
      const post = mockPosts.find(p => p.id === id);
      if (!post) {
        return { data: null as unknown as Post, success: false, message: 'Post not found' };
      }
      return { data: post, success: true };
    }
  },

  async createPost(content: string, images?: string[], musicId?: string): Promise<ApiResponse<Post>> {
    try {
      const postData: PostCreate = {
        text: content,
        media: images?.map((img, index) => ({
          media_key: img,
          media_type: 'image',
        })),
      };

      const postRead = await httpPost<PostRead>('/posts', postData);
      // TODO: нужно получать автора отдельно
      const post = mapPostReadToPost(postRead, mockPosts[0].author);
      return { data: post, success: true };
    } catch (error) {
      console.error('Failed to create post:', error);
      // Fallback to mock
      const newPost: Post = {
        id: Date.now().toString(),
        author: mockPosts[0].author,
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
    }
  },

  async deletePost(postId: string): Promise<ApiResponse<void>> {
    try {
      await httpDelete(`/posts/${postId}`);
      return { data: undefined, success: true };
    } catch (error) {
      console.error('Failed to delete post:', error);
      return { data: undefined, success: false, message: 'Failed to delete post' };
    }
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
