'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Sparkles, 
  FileText, 
  Target, 
  CheckSquare, 
  Copy, 
  Check,
  Loader2,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface AISummary {
  summary: string;
  keyPoints: string[];
  actionItems: {
    assignee: string;
    task: string;
  }[];
}

interface AISummaryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversationId: string;
  conversationName: string;
  messageCount: number;
}

// Skeleton loading component
function SummarySkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Summary skeleton */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-200 rounded" />
          <div className="w-24 h-5 bg-gray-200 rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
      </div>

      {/* Key points skeleton */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-200 rounded" />
          <div className="w-28 h-5 bg-gray-200 rounded" />
        </div>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-gray-200 rounded-full mt-1.5" />
            <div className="h-4 bg-gray-200 rounded w-4/5" />
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-gray-200 rounded-full mt-1.5" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-gray-200 rounded-full mt-1.5" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>
        </div>
      </div>

      {/* Action items skeleton */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-200 rounded" />
          <div className="w-32 h-5 bg-gray-200 rounded" />
        </div>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded mt-0.5" />
            <div className="h-4 bg-gray-200 rounded w-4/5" />
          </div>
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded mt-0.5" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AISummaryModal({
  open,
  onOpenChange,
  conversationId,
  conversationName,
  messageCount,
}: AISummaryModalProps) {
  const [copied, setCopied] = useState(false);
  const [summary, setSummary] = useState<AISummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    if (!conversationId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.ai.summarize(conversationId);
      setSummary({
        summary: response.summary,
        keyPoints: response.keyPoints || [],
        actionItems: response.actionItems || [],
      });
    } catch (err: any) {
      console.error('Failed to fetch AI summary:', err);
      setError(err.response?.data?.error || err.message || 'Không thể tạo tóm tắt');
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  // Fetch summary when modal opens - only once per modal open
  useEffect(() => {
    if (open && !summary && !isLoading && !error) {
      fetchSummary();
    }
  }, [open]); // Only depend on 'open' to prevent multiple fetches

  // Reset state when conversation changes (not when modal closes to preserve cache)
  useEffect(() => {
    setSummary(null);
    setError(null);
  }, [conversationId]);

  const handleRetry = () => {
    setSummary(null);
    fetchSummary();
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleCopyToClipboard = async () => {
    if (!summary) return;

    const text = `📝 AI Summary - ${conversationName}
${'-'.repeat(40)}

📄 Summary:
${summary.summary}

🎯 Key Points:
${summary.keyPoints.map(point => `• ${point}`).join('\n')}

${summary.actionItems.length > 0 ? `✅ Action Items:
${summary.actionItems.map(item => `□ ${item.assignee}: ${item.task}`).join('\n')}` : ''}
`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="w-6 h-6 text-[#615EF0]" />
            AI Summary
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Tóm tắt từ {messageCount} tin nhắn trong "{conversationName}"
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4 -mr-4">
          <div className="space-y-6 py-4">
            {/* Loading State */}
            {isLoading && (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3 py-4 text-muted-foreground">
                  <Loader2 className="w-5 h-5 animate-spin text-[#615EF0]" />
                  <span>Đang phân tích cuộc trò chuyện...</span>
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  Dự kiến 5-10 giây
                </p>
                <SummarySkeleton />
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-4 py-8"
              >
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-gray-900">Không thể tạo tóm tắt</p>
                  <p className="text-sm text-muted-foreground mt-1">{error}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleRetry}
                  className="gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Thử lại
                </Button>
              </motion.div>
            )}

            {/* Summary Content */}
            {summary && !isLoading && !error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Summary Section */}
                <div className="space-y-3">
                  <h3 className="flex items-center gap-2 font-semibold text-gray-900">
                    <FileText className="w-5 h-5 text-[#615EF0]" />
                    Tóm tắt
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {summary.summary}
                    </p>
                  </div>
                </div>

                {/* Key Points Section */}
                {summary.keyPoints.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="flex items-center gap-2 font-semibold text-gray-900">
                      <Target className="w-5 h-5 text-[#615EF0]" />
                      Điểm chính
                    </h3>
                    <ul className="space-y-2">
                      {summary.keyPoints.map((point, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-3 text-gray-700"
                        >
                          <span className="w-2 h-2 rounded-full bg-[#615EF0] mt-2 flex-shrink-0" />
                          <span>{point}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Items Section */}
                {summary.actionItems.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="flex items-center gap-2 font-semibold text-gray-900">
                      <CheckSquare className="w-5 h-5 text-[#615EF0]" />
                      Việc cần làm
                    </h3>
                    <ul className="space-y-2">
                      {summary.actionItems.map((item, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-3 bg-amber-50 rounded-lg p-3"
                        >
                          <CheckSquare className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-medium text-amber-800">
                              {item.assignee}:
                            </span>{' '}
                            <span className="text-amber-700">{item.task}</span>
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        {summary && !isLoading && !error && (
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleCopyToClipboard}
              className="gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-500" />
                  Đã copy
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy to Clipboard
                </>
              )}
            </Button>
            <Button onClick={handleClose}>
              Đóng
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
