'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EmojiPicker } from '@/components/emoji/emoji-picker';
import { cn } from '@/lib/utils';

interface ReactionUser {
  _id: string;
  username: string;
  avatar_url?: string;
}

interface GroupedReaction {
  emoji: string;
  count: number;
  users: ReactionUser[];
  hasReacted: boolean;
}

interface MessageReactionsProps {
  reactions: Array<{
    emoji: string;
    user_id: string;
  }>;
  currentUserId: string;
  users: Map<string, ReactionUser>;
  onAddReaction: (emoji: string) => void;
  onRemoveReaction: (emoji: string) => void;
  isOwnMessage?: boolean;
  maxDisplay?: number;
}

export function MessageReactions({
  reactions,
  currentUserId,
  users,
  onAddReaction,
  onRemoveReaction,
  isOwnMessage = false,
  maxDisplay = 3,
}: MessageReactionsProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const addButtonRef = useRef<HTMLButtonElement>(null);

  if (!reactions || reactions.length === 0) return null;

  // Group reactions by emoji
  const groupedReactions: GroupedReaction[] = [];
  const emojiMap = new Map<string, GroupedReaction>();

  reactions.forEach((reaction) => {
    const userId = typeof reaction.user_id === 'string' 
      ? reaction.user_id 
      : (reaction.user_id as any)?._id?.toString() || '';
    
    if (!emojiMap.has(reaction.emoji)) {
      emojiMap.set(reaction.emoji, {
        emoji: reaction.emoji,
        count: 0,
        users: [],
        hasReacted: false,
      });
    }

    const group = emojiMap.get(reaction.emoji)!;
    group.count++;
    
    const user = users.get(userId);
    if (user) {
      group.users.push(user);
    } else {
      group.users.push({ _id: userId, username: 'Unknown' });
    }
    
    if (userId === currentUserId) {
      group.hasReacted = true;
    }
  });

  emojiMap.forEach((value) => groupedReactions.push(value));
  
  // Sort by count (most popular first)
  groupedReactions.sort((a, b) => b.count - a.count);

  const displayedReactions = groupedReactions.slice(0, maxDisplay);
  const remainingCount = groupedReactions.length - maxDisplay;

  const handleReactionClick = (emoji: string, hasReacted: boolean) => {
    if (hasReacted) {
      onRemoveReaction(emoji);
    } else {
      onAddReaction(emoji);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    onAddReaction(emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className={cn(
      'flex flex-wrap items-center gap-1 mt-1.5',
      isOwnMessage ? 'justify-end' : 'justify-start'
    )}>
      <AnimatePresence mode="popLayout">
        {displayedReactions.map((reaction) => (
          <Popover key={reaction.emoji}>
            <PopoverTrigger asChild>
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleReactionClick(reaction.emoji, reaction.hasReacted)}
                className={cn(
                  'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-all duration-200',
                  reaction.hasReacted
                    ? 'bg-[#615EF0]/10 border-[#615EF0]/30 text-[#615EF0]'
                    : 'bg-gray-100 border-gray-200 hover:border-gray-300 text-gray-700'
                )}
              >
                <span className="text-sm">{reaction.emoji}</span>
                <span className="font-medium">{reaction.count}</span>
              </motion.button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3" side="top" align="start">
              <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                <span className="text-xl">{reaction.emoji}</span>
                <span className="text-gray-600">
                  {reaction.count} {reaction.count === 1 ? 'reaction' : 'reactions'}
                </span>
              </p>
              <ScrollArea className="max-h-36">
                <div className="space-y-2">
                  {reaction.users.map((user, index) => (
                    <div key={`${user._id}-${index}`} className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={user.avatar_url} />
                        <AvatarFallback className="text-xs">
                          {user.username?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-700">
                        {user._id === currentUserId ? 'You' : user.username}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
        ))}

        {/* Show "+N more" if there are more reactions */}
        {remainingCount > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 border border-gray-200 text-gray-600 hover:bg-gray-200"
              >
                +{remainingCount} more
              </motion.button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3" side="top" align="start">
              <p className="text-sm font-semibold mb-2">All Reactions</p>
              <ScrollArea className="max-h-48">
                <div className="space-y-2">
                  {groupedReactions.slice(maxDisplay).map((reaction) => (
                    <button
                      key={reaction.emoji}
                      onClick={() => handleReactionClick(reaction.emoji, reaction.hasReacted)}
                      className={cn(
                        'w-full flex items-center justify-between px-2 py-1.5 rounded-lg transition-colors',
                        reaction.hasReacted
                          ? 'bg-[#615EF0]/10 text-[#615EF0]'
                          : 'hover:bg-gray-100'
                      )}
                    >
                      <span className="text-lg">{reaction.emoji}</span>
                      <span className="text-sm font-medium">{reaction.count}</span>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
        )}
      </AnimatePresence>

      {/* Add reaction button */}
      <div className="relative">
        <motion.button
          ref={addButtonRef}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowEmojiPicker(true)}
          className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <Plus className="h-3 w-3 text-gray-500" />
        </motion.button>
        
        <EmojiPicker
          isOpen={showEmojiPicker}
          onClose={() => setShowEmojiPicker(false)}
          onEmojiSelect={handleEmojiSelect}
          triggerRef={addButtonRef as React.RefObject<HTMLElement>}
          position="top"
        />
      </div>
    </div>
  );
}
