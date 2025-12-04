'use client';

import {
  FileText,
  Image,
  Film,
  Music,
  FileArchive,
  FileCode,
  FileSpreadsheet,
  File,
  Presentation,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileTypeIconProps {
  mimeType: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-8 h-8',
};

export function FileTypeIcon({ mimeType, className, size = 'md' }: FileTypeIconProps) {
  const iconClass = cn(sizeClasses[size], className);

  // Image files
  if (mimeType.startsWith('image/')) {
    return <Image className={cn(iconClass, 'text-green-500')} />;
  }

  // Video files
  if (mimeType.startsWith('video/')) {
    return <Film className={cn(iconClass, 'text-purple-500')} />;
  }

  // Audio files
  if (mimeType.startsWith('audio/')) {
    return <Music className={cn(iconClass, 'text-pink-500')} />;
  }

  // PDF files
  if (mimeType === 'application/pdf') {
    return <FileText className={cn(iconClass, 'text-red-500')} />;
  }

  // Word documents
  if (
    mimeType === 'application/msword' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return <FileText className={cn(iconClass, 'text-blue-500')} />;
  }

  // Excel/Spreadsheets
  if (
    mimeType === 'application/vnd.ms-excel' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    mimeType === 'text/csv'
  ) {
    return <FileSpreadsheet className={cn(iconClass, 'text-green-600')} />;
  }

  // PowerPoint
  if (
    mimeType === 'application/vnd.ms-powerpoint' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ) {
    return <Presentation className={cn(iconClass, 'text-orange-500')} />;
  }

  // Archive files
  if (
    mimeType === 'application/zip' ||
    mimeType === 'application/x-rar-compressed' ||
    mimeType === 'application/x-7z-compressed' ||
    mimeType === 'application/gzip' ||
    mimeType === 'application/x-tar'
  ) {
    return <FileArchive className={cn(iconClass, 'text-yellow-600')} />;
  }

  // Code files
  if (
    mimeType.startsWith('text/') ||
    mimeType === 'application/javascript' ||
    mimeType === 'application/typescript' ||
    mimeType === 'application/json' ||
    mimeType === 'application/xml'
  ) {
    return <FileCode className={cn(iconClass, 'text-gray-600')} />;
  }

  // Default file icon
  return <File className={cn(iconClass, 'text-gray-500')} />;
}

// Helper to get file type category
export function getFileCategory(mimeType: string): 'image' | 'video' | 'audio' | 'document' | 'archive' | 'other' {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (
    mimeType === 'application/pdf' ||
    mimeType.includes('document') ||
    mimeType.includes('spreadsheet') ||
    mimeType.includes('presentation') ||
    mimeType === 'application/msword' ||
    mimeType === 'application/vnd.ms-excel' ||
    mimeType === 'application/vnd.ms-powerpoint'
  ) {
    return 'document';
  }
  if (
    mimeType === 'application/zip' ||
    mimeType.includes('rar') ||
    mimeType.includes('7z') ||
    mimeType.includes('tar') ||
    mimeType.includes('gzip')
  ) {
    return 'archive';
  }
  return 'other';
}

// Helper to format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

// Helper to check if file type is previewable
export function isPreviewable(mimeType: string): boolean {
  return (
    mimeType.startsWith('image/') ||
    mimeType.startsWith('video/') ||
    mimeType.startsWith('audio/') ||
    mimeType === 'application/pdf'
  );
}
