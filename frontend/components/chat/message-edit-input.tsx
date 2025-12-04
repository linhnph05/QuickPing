'use client';

import { useState, useRef, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MessageEditInputProps {
  initialContent: string;
  onSave: (newContent: string) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  className?: string;
}

export function MessageEditInput({
  initialContent,
  onSave,
  onCancel,
  isLoading = false,
  className,
}: MessageEditInputProps) {
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Focus and select all text on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [content]);

  const handleSave = async () => {
    const trimmedContent = content.trim();
    if (!trimmedContent || trimmedContent === initialContent) {
      onCancel();
      return;
    }

    setIsSaving(true);
    try {
      await onSave(trimmedContent);
    } catch (error) {
      console.error('Failed to save message:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
  };

  const isDisabled = isLoading || isSaving;

  return (
    <div className={cn('flex flex-col gap-2 w-full', className)}>
      <textarea
        ref={inputRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isDisabled}
        className={cn(
          'w-full px-3 py-2 rounded-lg border border-gray-300 resize-none',
          'text-sm leading-relaxed',
          'focus:outline-none focus:ring-2 focus:ring-[#615EF0] focus:border-transparent',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'min-h-[40px] max-h-[200px]'
        )}
        placeholder="Edit message..."
        rows={1}
      />
      
      <div className="flex items-center gap-2 justify-end">
        <span className="text-xs text-gray-500 mr-auto">
          Press Enter to save, Esc to cancel
        </span>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={isDisabled}
          className="h-7 px-2 text-gray-500 hover:text-gray-700"
        >
          <X className="h-4 w-4 mr-1" />
          Cancel
        </Button>
        
        <Button
          variant="default"
          size="sm"
          onClick={handleSave}
          disabled={isDisabled || !content.trim() || content.trim() === initialContent}
          className="h-7 px-2 bg-[#615EF0] hover:bg-[#615EF0]/90"
        >
          <Check className="h-4 w-4 mr-1" />
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  );
}
