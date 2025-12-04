'use client';

import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Message } from '@/types';

interface ReplyPreviewProps {
  replyingTo: Message;
  onCancel: () => void;
  className?: string;
}

export function ReplyPreview({ replyingTo, onCancel, className }: ReplyPreviewProps) {
  const senderName = replyingTo.sender_id?.username || 'Unknown';
  const avatarUrl = replyingTo.sender_id?.avatar_url;

  // Get content preview (max 1 line / ~80 chars)
  const getContentPreview = (): string => {
    if (replyingTo.content) {
      const content = replyingTo.content.trim();
      if (content.length > 80) {
        return content.substring(0, 80) + '...';
      }
      return content;
    }
    
    if (replyingTo.file_info) {
      const mimeType = replyingTo.file_info.mime_type || '';
      if (mimeType.startsWith('image/')) {
        return '📷 Photo';
      } else if (mimeType.startsWith('video/')) {
        return '🎬 Video';
      } else if (mimeType.startsWith('audio/')) {
        return '🎵 Audio';
      }
      return `📎 ${replyingTo.file_info.filename || 'File'}`;
    }
    
    return 'Message';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      exit={{ opacity: 0, y: 10, height: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'bg-gray-50 border-t border-gray-200 px-6 py-3',
        className
      )}
    >
      <div className="flex items-center gap-3">
        {/* Reply indicator bar */}
        <div className="w-1 h-10 bg-[#615EF0] rounded-full flex-shrink-0" />
        
        {/* Avatar */}
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback className="text-xs bg-gray-200">
            {senderName[0]?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        
        {/* Content */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <p className="text-xs font-semibold text-[#615EF0] truncate">
            Replying to {senderName}
          </p>
          <p className="text-sm text-gray-600 truncate">
            {getContentPreview()}
          </p>
        </div>
        
        {/* Cancel button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onCancel}
          className="flex-shrink-0 p-1.5 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Cancel reply"
        >
          <X className="h-4 w-4 text-gray-500" />
        </motion.button>
      </div>
    </motion.div>
  );
}
