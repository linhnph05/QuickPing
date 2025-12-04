'use client';

import { useState } from 'react';
import { MoreHorizontal, Reply, Smile, Pin, Pencil, Trash2, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MessageActionsProps {
  isOwnMessage: boolean;
  isVisible: boolean;
  isPinned?: boolean;
  canPin?: boolean;
  onReply?: () => void;
  onReact?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onPin?: () => void;
  onThread?: () => void;
  className?: string;
}

export function MessageActions({
  isOwnMessage,
  isVisible,
  isPinned = false,
  canPin = true,
  onReply,
  onReact,
  onEdit,
  onDelete,
  onPin,
  onThread,
  className,
}: MessageActionsProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Keep visible when menu is open
  const shouldShow = isVisible || isMenuOpen;

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.1 }}
          className={cn(
            'flex items-center gap-1 bg-white border border-gray-200 rounded-lg shadow-sm px-1 py-0.5',
            className
          )}
        >
          {/* Quick React Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            onClick={onReact}
            title="Add reaction"
          >
            <Smile className="h-4 w-4" />
          </Button>

          {/* Quick Reply Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            onClick={onReply}
            title="Reply"
          >
            <Reply className="h-4 w-4" />
          </Button>

          {/* More Options Dropdown */}
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={onReply} className="cursor-pointer">
                <Reply className="h-4 w-4 mr-2" />
                Reply
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={onThread} className="cursor-pointer">
                <MessageCircle className="h-4 w-4 mr-2" />
                Reply in Thread
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={onReact} className="cursor-pointer">
                <Smile className="h-4 w-4 mr-2" />
                Add Reaction
              </DropdownMenuItem>
              
              {canPin && (
                <DropdownMenuItem onClick={onPin} className="cursor-pointer">
                  <Pin className="h-4 w-4 mr-2" />
                  {isPinned ? 'Unpin Message' : 'Pin Message'}
                </DropdownMenuItem>
              )}

              {isOwnMessage && (
                <>
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit Message
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    onClick={onDelete} 
                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Message
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
