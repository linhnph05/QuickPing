export interface User {
  _id: string;
  email: string;
  username: string;
  mssv?: string;
  avatar_url?: string;
  bio?: string;
  role: 'admin' | 'moderator' | 'member';
  school_id?: string;
  is_online?: boolean;
  last_seen?: Date;
  is_verified: boolean;
  preferences?: {
    theme: 'light' | 'dark';
    font_size: 'small' | 'medium' | 'large';
  };
}

export interface Conversation {
  _id: string;
  type: 'direct' | 'group';
  name?: string;
  description?: string;
  participants: Array<{
    user_id: User;
    role: 'admin' | 'moderator' | 'member';
  }>;
  created_by: string;
  last_message?: Message;
  pinned_messages?: string[];
  created_at: Date;
  updated_at: Date;
}

export interface Message {
  _id: string;
  conversation_id: string;
  sender_id: User;
  type: 'text' | 'file' | 'image' | 'video' | 'system';
  content?: string;
  file_info?: {
    file_id: string;
    filename: string;
    mime_type: string;
    size: number;
  };
  reply_to?: Message;
  thread_id?: string;
  is_edited: boolean;
  reactions?: Array<{
    emoji: string;
    user_id: string;
  }>;
  read_by?: Array<{
    user_id: string;
    read_at: Date;
  }>;
  created_at: Date;
  updated_at: Date;
}

export interface FileAttachment {
  _id: string;
  original_name: string;
  stored_name: string;
  url: string;
  mime_type: string;
  size: number;
  uploader_id: User;
  conversation_id?: string;
  message_id?: string;
  upload_date: Date;
}

