'use client';

import { useState } from 'react';
import { Check, CheckCheck, Eye } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { User } from '@/types';

interface ReadByEntry {
  user_id: string | User;
  read_at: Date;
}

interface SeenStatusProps {
  readBy: ReadByEntry[];
  currentUserId: string;
  isGroupChat: boolean;
  totalParticipants?: number;
  otherUserId?: string; // For direct chats
  className?: string;
}

// Helper to get user info from read entry
function getUserInfo(entry: ReadByEntry): { id: string; username?: string; avatar?: string } {
  if (typeof entry.user_id === 'string') {
    return { id: entry.user_id };
  }
  return {
    id: entry.user_id._id,
    username: entry.user_id.username,
    avatar: entry.user_id.avatar_url,
  };
}

// Format relative time
function formatReadTime(date: Date): string {
  const now = new Date();
  const readAt = new Date(date);
  const diffMs = now.getTime() - readAt.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return readAt.toLocaleDateString();
}

export function SeenStatus({
  readBy,
  currentUserId,
  isGroupChat,
  totalParticipants = 0,
  otherUserId,
  className,
}: SeenStatusProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Filter out current user from read list
  const othersWhoRead = readBy.filter((entry) => {
    const userId = typeof entry.user_id === 'string' ? entry.user_id : entry.user_id._id;
    return userId !== currentUserId;
  });

  // For direct chat
  if (!isGroupChat) {
    const isRead = otherUserId && othersWhoRead.some((entry) => {
      const userId = typeof entry.user_id === 'string' ? entry.user_id : entry.user_id._id;
      return userId === otherUserId;
    });

    return (
      <span className={cn('inline-flex items-center', className)}>
        {isRead ? (
          <CheckCheck className="w-3.5 h-3.5 text-[#615EF0]" />
        ) : (
          <Check className="w-3.5 h-3.5 text-gray-400" />
        )}
      </span>
    );
  }

  // For group chat - show "Seen by X, Y and N others"
  const readCount = othersWhoRead.length;
  const maxVisibleParticipants = totalParticipants - 1; // Exclude sender
  const allRead = readCount >= maxVisibleParticipants && maxVisibleParticipants > 0;

  if (readCount === 0) {
    return (
      <span className={cn('inline-flex items-center', className)}>
        <Check className="w-3.5 h-3.5 text-gray-400" />
      </span>
    );
  }

  // Get first 2 users for display
  const visibleReaders = othersWhoRead.slice(0, 2);
  const remainingCount = readCount - 2;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            'inline-flex items-center gap-1.5 group cursor-pointer hover:opacity-80 transition-opacity',
            className
          )}
        >
          {/* Checkmarks */}
          <CheckCheck
            className={cn(
              'w-3.5 h-3.5 transition-colors',
              allRead ? 'text-[#615EF0]' : 'text-gray-400'
            )}
          />

          {/* Avatar stack for who read */}
          <div className="flex -space-x-1.5">
            {visibleReaders.slice(0, 3).map((entry, idx) => {
              const info = getUserInfo(entry);
              return (
                <Avatar
                  key={info.id}
                  className="h-4 w-4 border border-white ring-0"
                  style={{ zIndex: 3 - idx }}
                >
                  <AvatarImage src={info.avatar} />
                  <AvatarFallback className="text-[8px] bg-gray-200">
                    {info.username?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              );
            })}
            {remainingCount > 0 && (
              <div
                className="h-4 w-4 rounded-full bg-gray-200 border border-white flex items-center justify-center"
                style={{ zIndex: 0 }}
              >
                <span className="text-[8px] font-medium text-gray-600">+{remainingCount}</span>
              </div>
            )}
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-64 p-0" align="end">
        <div className="p-3 border-b">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-gray-500" />
            <span className="font-semibold text-sm">
              Seen by {readCount} of {maxVisibleParticipants}
            </span>
          </div>
        </div>

        <div className="max-h-48 overflow-y-auto py-1">
          {othersWhoRead.map((entry) => {
            const info = getUserInfo(entry);
            return (
              <div
                key={info.id}
                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={info.avatar} />
                  <AvatarFallback className="bg-gray-200 text-xs">
                    {info.username?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {info.username || 'Unknown User'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatReadTime(entry.read_at)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Simple inline seen text without popover
export function SeenByText({
  readBy,
  currentUserId,
  className,
}: {
  readBy: ReadByEntry[];
  currentUserId: string;
  className?: string;
}) {
  const othersWhoRead = readBy.filter((entry) => {
    const userId = typeof entry.user_id === 'string' ? entry.user_id : entry.user_id._id;
    return userId !== currentUserId;
  });

  if (othersWhoRead.length === 0) return null;

  const visibleReaders = othersWhoRead.slice(0, 2);
  const remainingCount = othersWhoRead.length - 2;

  const names = visibleReaders.map((entry) => {
    const info = getUserInfo(entry);
    return info.username || 'User';
  });

  let text = '';
  if (othersWhoRead.length === 1) {
    text = `Seen by ${names[0]}`;
  } else if (othersWhoRead.length === 2) {
    text = `Seen by ${names[0]} and ${names[1]}`;
  } else {
    text = `Seen by ${names[0]}, ${names[1]} and ${remainingCount} others`;
  }

  return (
    <span className={cn('text-[10px] text-gray-500 italic', className)}>
      {text}
    </span>
  );
}
