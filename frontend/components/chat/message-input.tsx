'use client';

import { useState, useRef } from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';
import { EmojiPicker } from '@/components/emoji/emoji-picker';
import { cn } from '@/lib/utils';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (e: React.FormEvent) => void;
  onTyping?: () => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function MessageInput({
  value,
  onChange,
  onSend,
  onTyping,
  disabled = false,
  placeholder = 'Type a message',
  className,
}: MessageInputProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleEmojiSelect = (emoji: string) => {
    // Insert emoji at cursor position or at end
    const input = inputRef.current;
    if (input) {
      const start = input.selectionStart || value.length;
      const end = input.selectionEnd || value.length;
      const newValue = value.slice(0, start) + emoji + value.slice(end);
      onChange(newValue);
      
      // Move cursor after emoji
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(start + emoji.length, start + emoji.length);
      }, 0);
    } else {
      onChange(value + emoji);
    }
    
    // Keep picker open for multiple selections
    // setShowEmojiPicker(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    onTyping?.();
  };

  return (
    <div className={cn('flex items-center gap-6 px-6 py-6', className)}>
      {/* Attachment button */}
      <button 
        type="button" 
        className="flex-shrink-0 text-gray-600 hover:text-gray-900 transition-colors"
        disabled={disabled}
      >
        <Paperclip className="w-6 h-6" strokeWidth={1.5} />
      </button>
      
      {/* Input container */}
      <form 
        onSubmit={onSend} 
        className="flex-1 flex items-center gap-[10px] px-5 py-2.5 bg-white border-2 border-[#E2E8F0] rounded-xl relative"
      >
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          className="flex-1 bg-transparent border-none outline-none text-[14px] leading-[21px] text-gray-900 placeholder:text-gray-900 placeholder:opacity-40"
          disabled={disabled}
        />
        
        {/* Emoji picker button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={cn(
              'flex-shrink-0 transition-colors',
              showEmojiPicker ? 'text-[#615EF0]' : 'text-gray-400 hover:text-gray-600'
            )}
            disabled={disabled}
          >
            <Smile className="w-5 h-5" strokeWidth={1.5} />
          </button>
          
          {/* Emoji picker popup */}
          <EmojiPicker
            isOpen={showEmojiPicker}
            onClose={() => setShowEmojiPicker(false)}
            onEmojiSelect={handleEmojiSelect}
          />
        </div>
        
        {/* Send button */}
        <button
          type="submit"
          disabled={!value.trim() || disabled}
          className={cn(
            'flex-shrink-0 transition-colors',
            value.trim() ? 'text-[#615EF0] hover:text-[#615EF0]/80' : 'text-gray-400'
          )}
        >
          <Send className="w-5 h-5" strokeWidth={1.5} />
        </button>
      </form>
    </div>
  );
}
