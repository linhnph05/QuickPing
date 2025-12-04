'use client';

import { cn } from '@/lib/utils';

interface StatusIndicatorProps {
  isOnline: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showOffline?: boolean;
  position?: 'bottom-right' | 'top-right' | 'bottom-left' | 'top-left';
}

const sizeConfig = {
  sm: {
    dot: 'h-2 w-2',
    border: 'border',
    ring: 'ring-[1px]',
  },
  md: {
    dot: 'h-3 w-3',
    border: 'border-2',
    ring: 'ring-[2px]',
  },
  lg: {
    dot: 'h-4 w-4',
    border: 'border-2',
    ring: 'ring-[3px]',
  },
};

const positionConfig = {
  'bottom-right': 'bottom-0 right-0',
  'top-right': 'top-0 right-0',
  'bottom-left': 'bottom-0 left-0',
  'top-left': 'top-0 left-0',
};

export function StatusIndicator({
  isOnline,
  size = 'md',
  className,
  showOffline = true,
  position = 'bottom-right',
}: StatusIndicatorProps) {
  const sizeStyles = sizeConfig[size];
  const posStyles = positionConfig[position];

  // Don't render anything if offline and showOffline is false
  if (!isOnline && !showOffline) {
    return null;
  }

  return (
    <div
      className={cn(
        'absolute rounded-full ring-white transition-all duration-300',
        sizeStyles.dot,
        sizeStyles.ring,
        posStyles,
        isOnline
          ? 'bg-green-500 animate-status-online'
          : 'bg-gray-400',
        className
      )}
    >
      {/* Inner pulse ring for online status */}
      {isOnline && (
        <span
          className={cn(
            'absolute inset-0 rounded-full bg-green-500 animate-ping-slow opacity-75'
          )}
        />
      )}
    </div>
  );
}

// Standalone status dot (not positioned absolutely)
interface StatusDotProps {
  isOnline: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showOffline?: boolean;
}

export function StatusDot({
  isOnline,
  size = 'md',
  className,
  showOffline = true,
}: StatusDotProps) {
  const sizeStyles = sizeConfig[size];

  if (!isOnline && !showOffline) {
    return null;
  }

  return (
    <div
      className={cn(
        'relative rounded-full transition-colors duration-300',
        sizeStyles.dot,
        isOnline ? 'bg-green-500' : 'bg-gray-400',
        className
      )}
    >
      {isOnline && (
        <span
          className={cn(
            'absolute inset-0 rounded-full bg-green-500 animate-ping-slow opacity-75'
          )}
        />
      )}
    </div>
  );
}
