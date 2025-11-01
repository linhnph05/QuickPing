'use client';

import { useState, useEffect, useRef } from 'react';
import { Phone, MoreVertical, Send, Paperclip, Smile } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import vi from 'date-fns/locale/vi';
import api from '@/lib/api';
import { Conversation, Message, User } from '@/types';
import { cn } from '@/lib/utils';
import { useUser } from '@/hooks/useUser';
import { useSocket } from '@/contexts/SocketContext';

interface ChatPanelProps {
  conversationId: string | null;
  onConversationLoaded?: (conversation: Conversation | null) => void;
}

export function ChatPanel({ conversationId, onConversationLoaded }: ChatPanelProps) {
  const { user: currentUser } = useUser();
  const { socket } = useSocket();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conversationId) {
      fetchConversation();
      fetchMessages();
    } else {
      setConversation(null);
      setMessages([]);
    }
  }, [conversationId]);

  // Socket.io listeners for realtime messages
  useEffect(() => {
    if (!socket || !conversationId) return;

    console.log('📡 Setting up socket listeners for conversation:', conversationId);

    // Join conversation room
    socket.emit('join_conversation', conversationId);

    // Listen for new messages
    const handleMessageReceived = (data: { message: Message; conversation_id: string }) => {
      console.log('✉️ Message received:', data);
      if (data.conversation_id === conversationId) {
        setMessages((prev) => {
          // Check if message already exists (avoid duplicates)
          const messageId = data.message._id?.toString();
          const exists = prev.some(m => m._id?.toString() === messageId);
          if (exists) {
            console.log('⚠️ Duplicate message ignored:', messageId);
            return prev;
          }
          return [...prev, data.message];
        });
      }
    };

    socket.on('message_received', handleMessageReceived);

    // Cleanup
    return () => {
      console.log('🔌 Cleaning up socket listeners');
      socket.off('message_received', handleMessageReceived);
      socket.emit('leave_conversation', conversationId);
    };
  }, [socket, conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversation = async () => {
    if (!conversationId) {
      setConversation(null);
      onConversationLoaded?.(null);
      return;
    }
    
    try {
      const response = await api.get<{ conversation: Conversation }>(`/conversations/${conversationId}`);
      setConversation(response.data.conversation);
      onConversationLoaded?.(response.data.conversation);
    } catch (error) {
      console.error('Error fetching conversation:', error);
      setConversation(null);
      onConversationLoaded?.(null);
    }
  };

  const fetchMessages = async () => {
    if (!conversationId) return;

    try {
      setLoading(true);
      const response = await api.get<{ messages: Message[] }>(`/messages/conversation/${conversationId}`);
      const fetchedMessages = response.data.messages || [];
      
      // Remove duplicates by ID before setting state
      const uniqueMessages = fetchedMessages.filter((msg, index, self) => {
        const msgId = msg._id?.toString();
        if (!msgId) return true; // Keep messages without ID
        return index === self.findIndex(m => m._id?.toString() === msgId);
      });
      
      setMessages(uniqueMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !conversationId || sending) return;

    setSending(true);
    try {
      const response = await api.post<{ message: Message }>('/messages', {
        conversation_id: conversationId,
        content: message.trim(),
        type: 'text',
      });

      // Don't add message here - let Socket.io event handle it to avoid duplicates
      // The socket event will add the message to the list
      const newMessage = response.data.message;
      setMessages(prev => {
        // Check if already exists (in case socket is slow)
        const messageId = newMessage._id?.toString();
        const exists = prev.some(m => m._id?.toString() === messageId);
        if (exists) {
          console.log('⚠️ Message already exists, skipping:', messageId);
          return prev;
        }
        return [...prev, newMessage];
      });
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getConversationName = (): string => {
    if (!conversation) return 'Unknown';
    
    if (conversation.type === 'direct') {
      const currentUserId = currentUser?._id?.toString();
      
      const otherParticipant = conversation.participants?.find(
        p => p.user_id?._id?.toString() !== currentUserId
      )?.user_id;
      return otherParticipant?.username || 'Unknown';
    }
    return conversation.name || 'Group Chat';
  };

  const getOtherParticipant = (): User | null => {
    if (!conversation || conversation.type !== 'direct') return null;
    
    const currentUserId = currentUser?._id?.toString();
    
    const otherParticipant = conversation.participants?.find(
      p => p.user_id?._id?.toString() !== currentUserId
    )?.user_id;
    
    return otherParticipant || null;
  };

  const isOwnMessage = (message: Message): boolean => {
    const currentUserId = currentUser?._id?.toString();
    return message.sender_id?._id?.toString() === currentUserId;
  };

  if (!conversationId) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <p>Select a conversation to start chatting</p>
      </div>
    );
  }

  if (!conversation || loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <p>Loading conversation...</p>
      </div>
    );
  }

  const otherParticipant = getOtherParticipant();
  const conversationName = getConversationName();

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <div className="h-16 border-b flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={otherParticipant?.avatar_url} />
            <AvatarFallback>{conversationName[0]?.toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{conversationName}</h3>
            {conversation.type === 'direct' && otherParticipant?.is_online && (
              <div className="flex items-center gap-1 text-sm text-green-600">
                <div className="h-2 w-2 rounded-full bg-green-600" />
                Online
              </div>
            )}
            {conversation.type === 'group' && (
              <p className="text-xs text-muted-foreground">
                {conversation.participants?.length || 0} thành viên
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-primary">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground mt-8">
              Chưa có tin nhắn nào. Bắt đầu cuộc trò chuyện!
            </div>
          ) : (
            messages.map((msg, index) => {
              const showDate = index === 0 || 
                new Date(msg.created_at).toDateString() !== 
                new Date(messages[index - 1].created_at).toDateString();
              const isOwn = isOwnMessage(msg);
              
              // Use unique key combining message ID and index to prevent duplicates
              const messageId = msg._id?.toString() || `temp-${index}`;
              const uniqueKey = `${messageId}-${index}`;
              
              return (
                <div key={uniqueKey}>
                  {showDate && (
                    <div className="text-center text-xs text-muted-foreground my-4">
                      {format(new Date(msg.created_at), 'dd/MM/yyyy', { locale: vi })}
                    </div>
                  )}
                  
                  <div className={cn('flex gap-3', isOwn ? 'justify-end' : 'justify-start')}>
                    {!isOwn && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={msg.sender_id?.avatar_url} />
                        <AvatarFallback>{msg.sender_id?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className={cn('max-w-xs lg:max-w-md', isOwn && 'order-first')}>
                      {!isOwn && (
                        <div className="text-xs text-muted-foreground mb-1">
                          {msg.sender_id?.username}
                        </div>
                      )}
                      
                      <div
                        className={cn(
                          'px-4 py-2 rounded-2xl',
                          isOwn
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        )}
                      >
                        {msg.content && <p className="text-sm">{msg.content}</p>}
                        
                        {msg.file_info && (
                          <div className="mt-2">
                            <span className="text-sm">📎 {msg.file_info.filename || 'File'}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className={cn('text-xs mt-1', isOwn ? 'text-primary/70' : 'text-muted-foreground')}>
                        {format(new Date(msg.created_at), 'HH:mm')}
                        {msg.is_edited && <span className="ml-1">(đã chỉnh sửa)</span>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2 max-w-4xl mx-auto">
          <Button type="button" variant="ghost" size="icon">
            <Paperclip className="h-5 w-5" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="pr-10"
              disabled={sending}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2"
            >
              <Smile className="h-4 w-4" />
            </Button>
          </div>
          
          <Button type="submit" size="icon" className="rounded-full" disabled={!message.trim() || sending}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
