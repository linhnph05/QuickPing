'use client';

import { Crown, Shield, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export type RoleType = 'admin' | 'moderator' | 'member';

interface RoleBadgeProps {
  role: RoleType;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showLabel?: boolean;
  className?: string;
}

const roleConfig = {
  admin: {
    label: 'Admin',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
    icon: Crown,
    iconColor: 'text-amber-500',
  },
  moderator: {
    label: 'Moderator',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    icon: Shield,
    iconColor: 'text-blue-500',
  },
  member: {
    label: 'Member',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-600',
    borderColor: 'border-gray-200',
    icon: User,
    iconColor: 'text-gray-500',
  },
};

const sizeConfig = {
  sm: {
    badge: 'px-1.5 py-0.5 text-[10px]',
    icon: 'w-3 h-3',
    gap: 'gap-0.5',
  },
  md: {
    badge: 'px-2 py-1 text-xs',
    icon: 'w-3.5 h-3.5',
    gap: 'gap-1',
  },
  lg: {
    badge: 'px-3 py-1.5 text-sm',
    icon: 'w-4 h-4',
    gap: 'gap-1.5',
  },
};

export function RoleBadge({
  role,
  size = 'md',
  showIcon = true,
  showLabel = true,
  className,
}: RoleBadgeProps) {
  const config = roleConfig[role];
  const sizeStyles = sizeConfig[size];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold rounded-full border transition-all duration-200',
        config.bgColor,
        config.textColor,
        config.borderColor,
        sizeStyles.badge,
        sizeStyles.gap,
        className
      )}
    >
      {showIcon && <Icon className={cn(sizeStyles.icon, config.iconColor)} />}
      {showLabel && <span>{config.label}</span>}
    </span>
  );
}

// Role icon only component for compact display
interface RoleIconProps {
  role: RoleType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showTooltip?: boolean;
}

export function RoleIcon({ role, size = 'md', className, showTooltip = true }: RoleIconProps) {
  const config = roleConfig[role];
  const sizeStyles = sizeConfig[size];
  const Icon = config.icon;

  if (role === 'member') {
    return null; // Don't show icon for regular members
  }

  return (
    <span
      className={cn('inline-flex items-center', className)}
      title={showTooltip ? config.label : undefined}
    >
      <Icon className={cn(sizeStyles.icon, config.iconColor)} />
    </span>
  );
}

// Export role config for use in other components
export { roleConfig };
