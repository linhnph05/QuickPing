'use client';

import { motion } from 'framer-motion';
import { Check, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoteOptionProps {
  text: string;
  voteCount: number;
  totalVotes: number;
  isSelected: boolean;
  isWinner?: boolean;
  disabled?: boolean;
  showResults: boolean;
  anonymous?: boolean;
  voterNames?: string[];
  onClick?: () => void;
}

export function VoteOptionComponent({
  text,
  voteCount,
  totalVotes,
  isSelected,
  isWinner = false,
  disabled = false,
  showResults,
  anonymous = false,
  voterNames = [],
  onClick,
}: VoteOptionProps) {
  const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.01 } : {}}
      whileTap={!disabled ? { scale: 0.99 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-full text-left p-3 rounded-xl border-2 transition-all relative overflow-hidden group',
        isSelected
          ? 'border-[#615EF0] bg-[#615EF0]/5'
          : 'border-gray-200 hover:border-gray-300',
        isWinner && 'border-green-500 bg-green-50',
        disabled && 'cursor-default opacity-80'
      )}
    >
      {/* Progress bar background */}
      {showResults && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={cn(
            'absolute inset-y-0 left-0 rounded-l-xl',
            isWinner
              ? 'bg-green-500/20'
              : isSelected
              ? 'bg-[#615EF0]/15'
              : 'bg-gray-200/50'
          )}
        />
      )}

      <div className="relative flex items-center gap-3">
        {/* Radio/Check indicator */}
        <div
          className={cn(
            'w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors',
            isSelected
              ? 'border-[#615EF0] bg-[#615EF0]'
              : 'border-gray-300 group-hover:border-gray-400'
          )}
        >
          {isSelected && <Check className="w-3 h-3 text-white" />}
        </div>

        {/* Option text */}
        <span className={cn(
          'flex-1 text-sm font-medium',
          isSelected ? 'text-gray-900' : 'text-gray-700'
        )}>
          {text}
        </span>

        {/* Vote count and percentage */}
        {showResults && (
          <div className="flex items-center gap-2 text-sm">
            <span className={cn(
              'font-semibold',
              isWinner ? 'text-green-600' : isSelected ? 'text-[#615EF0]' : 'text-gray-600'
            )}>
              {percentage}%
            </span>
            <span className="text-gray-400 text-xs">
              ({voteCount})
            </span>
          </div>
        )}
      </div>

      {/* Voters tooltip (non-anonymous) */}
      {showResults && !anonymous && voterNames.length > 0 && (
        <div className="relative mt-2 flex items-center gap-1.5 text-xs text-gray-500">
          <Users className="w-3 h-3" />
          <span className="truncate">
            {voterNames.slice(0, 3).join(', ')}
            {voterNames.length > 3 && ` +${voterNames.length - 3} more`}
          </span>
        </div>
      )}
    </motion.button>
  );
}
