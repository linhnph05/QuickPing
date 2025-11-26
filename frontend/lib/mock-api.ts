/**
 * MOCK API SERVICE
 * 
 * Service giả lập backend API với dữ liệu mẫu
 * Mục đích: Phát triển frontend độc lập mà không cần backend chạy
 * 
 * Usage:
 *   import { mockAPI } from '@/lib/mock-api';
 *   const conversations = await mockAPI.getConversations();
 */

import { User, Conversation, Message, FileAttachment } from '@/types';

// ============================================================================
// MOCK DATA STORAGE (sử dụng localStorage để persist)
// ============================================================================

const STORAGE_KEYS = {
  USERS: 'mock_users',
  CONVERSATIONS: 'mock_conversations',
  MESSAGES: 'mock_messages',
  FRIENDS: 'mock_friends',
  CURRENT_USER: 'mock_current_user',
};

// Helper functions
const getFromStorage = (key: string, defaultValue: any = []) => {
  if (typeof window === 'undefined') return defaultValue;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

const saveToStorage = (key: string, value: any) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
};

// ============================================================================
// INITIAL MOCK DATA
// ============================================================================

const INITIAL_USERS: User[] = [
  {
    _id: '1',
    email: 'user1@example.com',
    username: 'Alice',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    bio: 'Software developer',
    role: 'member',
    is_online: true,
    is_verified: true,
    preferences: { theme: 'light', font_size: 'medium' }
  },
  {
    _id: '2',
    email: 'user2@example.com',
    username: 'Bob',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    bio: 'Designer',
    role: 'member',
    is_online: false,
    is_verified: true,
    last_seen: new Date(Date.now() - 3600000),
    preferences: { theme: 'dark', font_size: 'medium' }
  },
  {
    _id: '3',
    email: 'user3@example.com',
    username: 'Charlie',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
    bio: 'Product manager',
    role: 'member',
    is_online: true,
    is_verified: true,
    preferences: { theme: 'light', font_size: 'large' }
  },
];

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    _id: 'conv1',
    type: 'direct',
    participants: [
      { user_id: INITIAL_USERS[0], role: 'member' },
      { user_id: INITIAL_USERS[1], role: 'member' },
    ],
    created_by: '1',
    created_at: new Date(Date.now() - 86400000),
    updated_at: new Date(Date.now() - 3600000),
  },
  {
    _id: 'conv2',
    type: 'group',
    name: 'Team Project',
    description: 'Discussion about our project',
    participants: [
      { user_id: INITIAL_USERS[0], role: 'admin' },
      { user_id: INITIAL_USERS[1], role: 'member' },
      { user_id: INITIAL_USERS[2], role: 'member' },
    ],
    created_by: '1',
    created_at: new Date(Date.now() - 172800000),
    updated_at: new Date(Date.now() - 7200000),
    pinned_messages: [],
  },
];

const INITIAL_MESSAGES: Message[] = [
  {
    _id: 'msg1',
    conversation_id: 'conv1',
    sender_id: INITIAL_USERS[1],
    type: 'text',
    content: 'Hey! How are you?',
    is_edited: false,
    reactions: [],
    read_by: [],
    created_at: new Date(Date.now() - 7200000),
    updated_at: new Date(Date.now() - 7200000),
  },
  {
    _id: 'msg2',
    conversation_id: 'conv1',
    sender_id: INITIAL_USERS[0],
    type: 'text',
    content: 'I\'m good! Working on the new features.',
    is_edited: false,
    reactions: [{ emoji: '👍', user_id: '2' }],
    read_by: [{ user_id: '2', read_at: new Date(Date.now() - 3600000) }],
    created_at: new Date(Date.now() - 3600000),
    updated_at: new Date(Date.now() - 3600000),
  },
  {
    _id: 'msg3',
    conversation_id: 'conv2',
    sender_id: INITIAL_USERS[0],
    type: 'text',
    content: 'Team meeting at 3 PM today!',
    is_edited: false,
    reactions: [
      { emoji: '👍', user_id: '2' },
      { emoji: '✅', user_id: '3' },
    ],
    read_by: [],
    created_at: new Date(Date.now() - 14400000),
    updated_at: new Date(Date.now() - 14400000),
  },
];

// Initialize storage on first load
const initializeMockData = () => {
  if (typeof window === 'undefined') return;
  
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    saveToStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CONVERSATIONS)) {
    saveToStorage(STORAGE_KEYS.CONVERSATIONS, INITIAL_CONVERSATIONS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
    saveToStorage(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.FRIENDS)) {
    saveToStorage(STORAGE_KEYS.FRIENDS, []);
  }
};

// Run initialization
initializeMockData();

// ============================================================================
// MOCK API IMPLEMENTATION
// ============================================================================

// Delay để simulate network latency
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAPI = {
  // ==========================================================================
  // AUTH
  // ==========================================================================
  
  auth: {
    login: async (email: string, password: string) => {
      await delay();
      const users = getFromStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
      const user = users.find((u: User) => u.email === email);
      
      if (!user) {
        throw new Error('Invalid credentials');
      }
      
      const token = 'mock_token_' + user._id;
      saveToStorage(STORAGE_KEYS.CURRENT_USER, user);
      
      return {
        data: {
          token,
          user,
        },
      };
    },
    
    register: async (data: { email: string; username: string; password: string; mssv?: string }) => {
      await delay();
      const users = getFromStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
      
      // Check if user exists
      if (users.some((u: User) => u.email === data.email)) {
        throw new Error('Email already exists');
      }
      
      const newUser: User = {
        _id: 'user_' + Date.now(),
        email: data.email,
        username: data.username,
        mssv: data.mssv,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`,
        role: 'member',
        is_online: true,
        is_verified: false,
        preferences: { theme: 'light', font_size: 'medium' },
      };
      
      users.push(newUser);
      saveToStorage(STORAGE_KEYS.USERS, users);
      saveToStorage(STORAGE_KEYS.CURRENT_USER, newUser);
      
      const token = 'mock_token_' + newUser._id;
      
      return {
        data: {
          token,
          user: newUser,
        },
      };
    },
    
    logout: async () => {
      await delay(100);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      return { data: { message: 'Logged out successfully' } };
    },
    
    me: async () => {
      await delay(100);
      const user = getFromStorage(STORAGE_KEYS.CURRENT_USER, null);
      if (!user) {
        throw new Error('Not authenticated');
      }
      return { data: { user } };
    },
  },
  
  // ==========================================================================
  // CONVERSATIONS
  // ==========================================================================
  
  conversations: {
    getAll: async () => {
      await delay();
      const conversations = getFromStorage(STORAGE_KEYS.CONVERSATIONS, INITIAL_CONVERSATIONS);
      return { data: { conversations } };
    },
    
    getById: async (id: string) => {
      await delay();
      const conversations = getFromStorage(STORAGE_KEYS.CONVERSATIONS, INITIAL_CONVERSATIONS);
      const conversation = conversations.find((c: Conversation) => c._id === id);
      
      if (!conversation) {
        throw new Error('Conversation not found');
      }
      
      return { data: { conversation } };
    },
    
    createDirect: async (userId: string) => {
      await delay();
      const conversations = getFromStorage(STORAGE_KEYS.CONVERSATIONS, INITIAL_CONVERSATIONS);
      const users = getFromStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
      const currentUser = getFromStorage(STORAGE_KEYS.CURRENT_USER);
      
      const otherUser = users.find((u: User) => u._id === userId);
      if (!otherUser) {
        throw new Error('User not found');
      }
      
      // Check if conversation exists
      const existing = conversations.find((c: Conversation) => 
        c.type === 'direct' &&
        c.participants.some(p => p.user_id._id === currentUser._id) &&
        c.participants.some(p => p.user_id._id === userId)
      );
      
      if (existing) {
        return { data: { conversation: existing } };
      }
      
      // Create new conversation
      const newConversation: Conversation = {
        _id: 'conv_' + Date.now(),
        type: 'direct',
        participants: [
          { user_id: currentUser, role: 'member' },
          { user_id: otherUser, role: 'member' },
        ],
        created_by: currentUser._id,
        created_at: new Date(),
        updated_at: new Date(),
      };
      
      conversations.push(newConversation);
      saveToStorage(STORAGE_KEYS.CONVERSATIONS, conversations);
      
      return { data: { conversation: newConversation } };
    },
    
    createGroup: async (data: { name: string; description?: string; participant_ids: string[] }) => {
      await delay();
      const conversations = getFromStorage(STORAGE_KEYS.CONVERSATIONS, INITIAL_CONVERSATIONS);
      const users = getFromStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
      const currentUser = getFromStorage(STORAGE_KEYS.CURRENT_USER);
      
      const participants = [
        { user_id: currentUser, role: 'admin' as const },
        ...data.participant_ids.map(id => ({
          user_id: users.find((u: User) => u._id === id),
          role: 'member' as const,
        })),
      ];
      
      const newConversation: Conversation = {
        _id: 'conv_' + Date.now(),
        type: 'group',
        name: data.name,
        description: data.description,
        participants,
        created_by: currentUser._id,
        created_at: new Date(),
        updated_at: new Date(),
        pinned_messages: [],
      };
      
      conversations.push(newConversation);
      saveToStorage(STORAGE_KEYS.CONVERSATIONS, conversations);
      
      return { data: { conversation: newConversation } };
    },
    
    changeParticipantRole: async (conversationId: string, userId: string, role: 'admin' | 'moderator' | 'member') => {
      await delay();
      const conversations = getFromStorage(STORAGE_KEYS.CONVERSATIONS, INITIAL_CONVERSATIONS);
      const conversationIndex = conversations.findIndex((c: Conversation) => c._id === conversationId);
      
      if (conversationIndex === -1) {
        throw new Error('Conversation not found');
      }
      
      const participantIndex = conversations[conversationIndex].participants.findIndex(
        (p: any) => p.user_id._id === userId
      );
      
      if (participantIndex === -1) {
        throw new Error('Participant not found');
      }
      
      conversations[conversationIndex].participants[participantIndex].role = role;
      conversations[conversationIndex].updated_at = new Date();
      
      saveToStorage(STORAGE_KEYS.CONVERSATIONS, conversations);
      
      return { data: { conversation: conversations[conversationIndex] } };
    },
    
    removeParticipant: async (conversationId: string, userId: string) => {
      await delay();
      const conversations = getFromStorage(STORAGE_KEYS.CONVERSATIONS, INITIAL_CONVERSATIONS);
      const conversationIndex = conversations.findIndex((c: Conversation) => c._id === conversationId);
      
      if (conversationIndex === -1) {
        throw new Error('Conversation not found');
      }
      
      conversations[conversationIndex].participants = conversations[conversationIndex].participants.filter(
        (p: any) => p.user_id._id !== userId
      );
      
      conversations[conversationIndex].updated_at = new Date();
      
      saveToStorage(STORAGE_KEYS.CONVERSATIONS, conversations);
      
      return { data: { conversation: conversations[conversationIndex] } };
    },
  },
  
  // ==========================================================================
  // MESSAGES
  // ==========================================================================
  
  messages: {
    getByConversation: async (conversationId: string) => {
      await delay();
      const messages = getFromStorage(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
      const conversationMessages = messages.filter((m: Message) => m.conversation_id === conversationId);
      
      return { data: { messages: conversationMessages } };
    },
    
    send: async (data: { conversation_id: string; content: string; type?: string; reply_to?: string }) => {
      await delay();
      const messages = getFromStorage(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
      const currentUser = getFromStorage(STORAGE_KEYS.CURRENT_USER);
      
      const newMessage: Message = {
        _id: 'msg_' + Date.now(),
        conversation_id: data.conversation_id,
        sender_id: currentUser,
        type: (data.type as any) || 'text',
        content: data.content,
        is_edited: false,
        reactions: [],
        read_by: [],
        created_at: new Date(),
        updated_at: new Date(),
      };
      
      if (data.reply_to) {
        const replyToMsg = messages.find((m: Message) => m._id === data.reply_to);
        if (replyToMsg) {
          newMessage.reply_to = replyToMsg;
        }
      }
      
      messages.push(newMessage);
      saveToStorage(STORAGE_KEYS.MESSAGES, messages);
      
      // Update conversation last_message
      const conversations = getFromStorage(STORAGE_KEYS.CONVERSATIONS);
      const convIndex = conversations.findIndex((c: Conversation) => c._id === data.conversation_id);
      if (convIndex !== -1) {
        conversations[convIndex].updated_at = new Date();
        saveToStorage(STORAGE_KEYS.CONVERSATIONS, conversations);
      }
      
      return { data: { message: newMessage } };
    },
    
    edit: async (messageId: string, content: string) => {
      await delay();
      const messages = getFromStorage(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
      const messageIndex = messages.findIndex((m: Message) => m._id === messageId);
      
      if (messageIndex === -1) {
        throw new Error('Message not found');
      }
      
      messages[messageIndex].content = content;
      messages[messageIndex].is_edited = true;
      messages[messageIndex].updated_at = new Date();
      
      saveToStorage(STORAGE_KEYS.MESSAGES, messages);
      
      return { data: { message: messages[messageIndex] } };
    },
    
    addReaction: async (messageId: string, emoji: string) => {
      await delay(100);
      const messages = getFromStorage(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
      const currentUser = getFromStorage(STORAGE_KEYS.CURRENT_USER);
      const messageIndex = messages.findIndex((m: Message) => m._id === messageId);
      
      if (messageIndex === -1) {
        throw new Error('Message not found');
      }
      
      // Remove existing reaction from user
      messages[messageIndex].reactions = messages[messageIndex].reactions?.filter(
        (r: any) => r.user_id !== currentUser._id
      ) || [];
      
      // Add new reaction
      messages[messageIndex].reactions.push({
        emoji,
        user_id: currentUser._id,
      });
      
      saveToStorage(STORAGE_KEYS.MESSAGES, messages);
      
      return { data: { message: messages[messageIndex] } };
    },
    
    removeReaction: async (messageId: string, emoji: string) => {
      await delay(100);
      const messages = getFromStorage(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
      const currentUser = getFromStorage(STORAGE_KEYS.CURRENT_USER);
      const messageIndex = messages.findIndex((m: Message) => m._id === messageId);
      
      if (messageIndex === -1) {
        throw new Error('Message not found');
      }
      
      messages[messageIndex].reactions = messages[messageIndex].reactions?.filter(
        (r: any) => !(r.user_id === currentUser._id && r.emoji === emoji)
      ) || [];
      
      saveToStorage(STORAGE_KEYS.MESSAGES, messages);
      
      return { data: { message: messages[messageIndex] } };
    },
  },
  
  // ==========================================================================
  // USERS
  // ==========================================================================
  
  users: {
    search: async (query: string) => {
      await delay();
      const users = getFromStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
      const currentUser = getFromStorage(STORAGE_KEYS.CURRENT_USER);
      
      const results = users.filter((u: User) => 
        u._id !== currentUser._id &&
        (u.username.toLowerCase().includes(query.toLowerCase()) ||
         u.email.toLowerCase().includes(query.toLowerCase()) ||
         u.mssv?.toLowerCase().includes(query.toLowerCase()))
      );
      
      return { data: { users: results } };
    },
    
    updateProfile: async (data: { username?: string; bio?: string; avatar_url?: string }) => {
      await delay();
      const currentUser = getFromStorage(STORAGE_KEYS.CURRENT_USER);
      const users = getFromStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
      
      const userIndex = users.findIndex((u: User) => u._id === currentUser._id);
      if (userIndex === -1) {
        throw new Error('User not found');
      }
      
      users[userIndex] = { ...users[userIndex], ...data };
      saveToStorage(STORAGE_KEYS.USERS, users);
      saveToStorage(STORAGE_KEYS.CURRENT_USER, users[userIndex]);
      
      return { data: { user: users[userIndex] } };
    },
    
    updatePreferences: async (data: { theme?: 'light' | 'dark'; font_size?: 'small' | 'medium' | 'large' }) => {
      await delay();
      const currentUser = getFromStorage(STORAGE_KEYS.CURRENT_USER);
      const users = getFromStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
      
      const userIndex = users.findIndex((u: User) => u._id === currentUser._id);
      if (userIndex === -1) {
        throw new Error('User not found');
      }
      
      users[userIndex].preferences = { ...users[userIndex].preferences, ...data };
      saveToStorage(STORAGE_KEYS.USERS, users);
      saveToStorage(STORAGE_KEYS.CURRENT_USER, users[userIndex]);
      
      return { data: { preferences: users[userIndex].preferences } };
    },
  },
  
  // ==========================================================================
  // FRIENDS
  // ==========================================================================
  
  friends: {
    getAll: async () => {
      await delay();
      const friends = getFromStorage(STORAGE_KEYS.FRIENDS, []);
      return { data: { friends } };
    },
    
    getRequests: async () => {
      await delay();
      const friends = getFromStorage(STORAGE_KEYS.FRIENDS, []);
      const currentUser = getFromStorage(STORAGE_KEYS.CURRENT_USER);
      const requests = friends.filter((f: any) => 
        f.friend_id._id === currentUser._id && f.status === 'pending'
      );
      return { data: { requests } };
    },
    
    sendRequest: async (friendId: string) => {
      await delay();
      const friends = getFromStorage(STORAGE_KEYS.FRIENDS, []);
      const users = getFromStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
      const currentUser = getFromStorage(STORAGE_KEYS.CURRENT_USER);
      
      const friend = users.find((u: User) => u._id === friendId);
      if (!friend) {
        throw new Error('User not found');
      }
      
      const request = {
        _id: 'friend_' + Date.now(),
        user_id: currentUser,
        friend_id: friend,
        status: 'pending',
        sent_at: new Date(),
      };
      
      friends.push(request);
      saveToStorage(STORAGE_KEYS.FRIENDS, friends);
      
      return { data: { friendship: request } };
    },
    
    acceptRequest: async (friendshipId: string) => {
      await delay();
      const friends = getFromStorage(STORAGE_KEYS.FRIENDS, []);
      const index = friends.findIndex((f: any) => f._id === friendshipId);
      
      if (index === -1) {
        throw new Error('Friend request not found');
      }
      
      friends[index].status = 'accepted';
      friends[index].responded_at = new Date();
      saveToStorage(STORAGE_KEYS.FRIENDS, friends);
      
      return { data: { friendship: friends[index] } };
    },
    
    rejectRequest: async (friendshipId: string) => {
      await delay();
      const friends = getFromStorage(STORAGE_KEYS.FRIENDS, []);
      const filtered = friends.filter((f: any) => f._id !== friendshipId);
      saveToStorage(STORAGE_KEYS.FRIENDS, filtered);
      
      return { data: { message: 'Request rejected' } };
    },
  },
  
  // ==========================================================================
  // FILES (Simplified mock)
  // ==========================================================================
  
  files: {
    upload: async (file: File) => {
      await delay(1000);
      
      const mockFile: FileAttachment = {
        _id: 'file_' + Date.now(),
        original_name: file.name,
        stored_name: file.name,
        url: URL.createObjectURL(file),
        mime_type: file.type,
        size: file.size,
        uploader_id: getFromStorage(STORAGE_KEYS.CURRENT_USER),
        upload_date: new Date(),
      };
      
      return { data: { file: mockFile } };
    },
  },
  
  // ==========================================================================
  // UTILITY
  // ==========================================================================
  
  reset: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.CONVERSATIONS);
    localStorage.removeItem(STORAGE_KEYS.MESSAGES);
    localStorage.removeItem(STORAGE_KEYS.FRIENDS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    initializeMockData();
  },
};

export default mockAPI;

