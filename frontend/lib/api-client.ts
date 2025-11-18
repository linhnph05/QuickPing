/**
 * API CLIENT WRAPPER
 * 
 * Provides unified interface cho cả Mock và Real API
 * Switch bằng environment variable NEXT_PUBLIC_USE_MOCK
 */

import api from './api';
import mockAPI from './mock-api';

// Check if we should use mock (default to REAL API)
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

// Real API implementation (maps to backend endpoints)
const realAPI = {
  // ==========================================================================
  // AUTH
  // ==========================================================================
  auth: {
    login: async (email: string, password: string) => {
      return await api.post('/auth/login', { email, password });
    },
    
    register: async (data: { email: string; username: string; password: string; mssv?: string }) => {
      return await api.post('/auth/register', data);
    },
    
    logout: async () => {
      return await api.post('/auth/logout');
    },
    
    me: async () => {
      return await api.get('/auth/me');
    },
  },
  
  // ==========================================================================
  // CONVERSATIONS
  // ==========================================================================
  conversations: {
    getAll: async () => {
      return await api.get('/conversations');
    },
    
    getById: async (id: string) => {
      return await api.get(`/conversations/${id}`);
    },
    
    createDirect: async (userId: string) => {
      return await api.post('/conversations/direct', { userId });
    },
    
    createGroup: async (data: { name: string; description?: string; participant_ids: string[] }) => {
      return await api.post('/conversations/group', {
        name: data.name,
        description: data.description,
        participants: data.participant_ids,
      });
    },
    
    update: async (id: string, data: { name?: string; description?: string; participants?: any[] }) => {
      return await api.put(`/conversations/${id}`, data);
    },
  },
  
  // ==========================================================================
  // MESSAGES
  // ==========================================================================
  messages: {
    getByConversation: async (conversationId: string) => {
      return await api.get(`/messages/conversation/${conversationId}`);
    },
    
    send: async (data: { conversation_id: string; content: string; type?: string; reply_to?: string }) => {
      return await api.post('/messages', data);
    },
    
    edit: async (messageId: string, content: string) => {
      return await api.put(`/messages/${messageId}`, { content });
    },
    
    addReaction: async (messageId: string, emoji: string) => {
      return await api.post(`/messages/${messageId}/reaction`, { emoji });
    },
    
    removeReaction: async (messageId: string, emoji: string) => {
      return await api.delete(`/messages/${messageId}/reaction/${emoji}`);
    },
  },
  
  // ==========================================================================
  // USERS
  // ==========================================================================
  users: {
    search: async (query: string) => {
      return await api.get(`/users/search?query=${encodeURIComponent(query)}`);
    },
    
    updateProfile: async (data: { username?: string; bio?: string; avatar_url?: string }) => {
      return await api.put('/users/profile', data);
    },
    
    updatePreferences: async (data: { theme?: 'light' | 'dark'; font_size?: 'small' | 'medium' | 'large' }) => {
      return await api.put('/users/preferences', data);
    },
  },
  
  // ==========================================================================
  // FRIENDS
  // ==========================================================================
  friends: {
    getAll: async () => {
      return await api.get('/friends');
    },
    
    getRequests: async () => {
      return await api.get('/friends/requests');
    },
    
    sendRequest: async (friendId: string) => {
      return await api.post('/friends/request', { friend_id: friendId });
    },
    
    acceptRequest: async (friendshipId: string) => {
      return await api.put(`/friends/request/${friendshipId}`, { status: 'accepted' });
    },
    
    rejectRequest: async (friendshipId: string) => {
      return await api.put(`/friends/request/${friendshipId}`, { status: 'rejected' });
    },
  },
  
  // ==========================================================================
  // FILES
  // ==========================================================================
  files: {
    upload: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      return await api.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
  },
};

// Export the appropriate API based on environment
export const apiClient = USE_MOCK ? mockAPI : realAPI;

// Utility to check current mode
export const isUsingMockAPI = () => USE_MOCK;

// Utility to log API mode on app start
if (typeof window !== 'undefined') {
  console.log(`🔌 API Mode: ${USE_MOCK ? '📦 MOCK' : '🌐 REAL'}`);
}

export default apiClient;

