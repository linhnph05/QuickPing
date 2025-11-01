'use client';

import { useState, useEffect } from 'react';
import { MoreVertical, Download, FileText, Image, FileSpreadsheet, File } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import api from '@/lib/api';
import { User, FileAttachment, Conversation } from '@/types';
import { cn } from '@/lib/utils';

interface DirectoryPanelProps {
  conversation?: Conversation | null;
}

export function DirectoryPanel({ conversation }: DirectoryPanelProps) {
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [files, setFiles] = useState<FileAttachment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (conversation) {
      fetchTeamMembers();
      fetchFiles();
    } else {
      setTeamMembers([]);
      setFiles([]);
    }
  }, [conversation]);

  const fetchTeamMembers = async () => {
    if (!conversation) return;
    
    try {
      // Get team members from conversation participants
      const members = conversation.participants
        ?.map(p => p.user_id)
        .filter((user): user is User => user !== null && user !== undefined) || [];
      setTeamMembers(members);
    } catch (error) {
      console.error('Error fetching team members:', error);
      setTeamMembers([]);
    }
  };

  const fetchFiles = async () => {
    if (!conversation) {
      setFiles([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Try to get files from messages in conversation
      // Since there's no direct endpoint, we'll get from messages
      const messagesResponse = await api.get<{ messages: any[] }>(
        `/messages/conversation/${conversation._id}`
      );
      
      // Extract files from messages
      const messageFiles = messagesResponse.data.messages
        ?.filter(msg => msg.file_info || msg.type === 'file' || msg.type === 'image')
        .map(msg => ({
          _id: msg.file_info?.file_id || msg._id,
          original_name: msg.file_info?.filename || 'File',
          stored_name: msg.file_info?.filename || 'file',
          url: msg.file_info?.url || '#',
          mime_type: msg.file_info?.mime_type || 'application/octet-stream',
          size: msg.file_info?.size || 0,
          uploader_id: msg.sender_id,
          conversation_id: conversation._id,
          message_id: msg._id,
          upload_date: msg.created_at,
        }))
        .slice(0, 10) || [];
      
      setFiles(messageFiles);
    } catch (error) {
      console.error('Error fetching files:', error);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType?.startsWith('image/')) return Image;
    if (mimeType?.includes('spreadsheet') || mimeType?.includes('excel')) return FileSpreadsheet;
    if (mimeType?.includes('pdf')) return FileText;
    if (mimeType?.includes('word') || mimeType?.includes('document')) return FileText;
    return File;
  };

  const getFileColor = (mimeType: string) => {
    if (mimeType?.startsWith('image/')) return 'text-green-500';
    if (mimeType?.includes('pdf')) return 'text-red-500';
    if (mimeType?.includes('word') || mimeType?.includes('document')) return 'text-blue-500';
    if (mimeType?.includes('spreadsheet') || mimeType?.includes('excel')) return 'text-purple-500';
    return 'text-gray-500';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  const getFileExtension = (filename: string): string => {
    return filename.split('.').pop()?.toUpperCase() || 'FILE';
  };

  return (
    <div className="w-[340px] border-l flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-semibold">Directory</h2>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        {/* Team Members */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm">
                {conversation?.type === 'group' ? 'Group Members' : 'Participants'}
              </h3>
              <Badge variant="secondary" className="rounded-full">
                {teamMembers.length}
              </Badge>
            </div>
          </div>

          <div className="space-y-3">
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : teamMembers.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {conversation ? 'No members found' : 'Select a conversation to see members'}
              </p>
            ) : (
              teamMembers.map((member) => (
                <div key={member._id} className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.avatar_url} />
                    <AvatarFallback>{member.username[0]?.toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{member.username}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {member.mssv || member.role || 'Member'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <Separator />

        {/* Files */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm">Files</h3>
              <Badge variant="secondary" className="rounded-full">
                {files.length}
              </Badge>
            </div>
          </div>

          <div className="space-y-3">
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading files...</p>
            ) : files.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {conversation ? 'No files in this conversation' : 'Select a conversation to see files'}
              </p>
            ) : (
              files.map((file) => {
                const Icon = getFileIcon(file.mime_type);
                const color = getFileColor(file.mime_type);
                const extension = getFileExtension(file.original_name);

                return (
                  <div
                    key={file._id}
                    className="flex items-center gap-3 group hover:bg-muted/50 p-2 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className={cn('p-2 bg-muted rounded-lg', color)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{file.original_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {extension} {formatFileSize(file.size)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (file.url && file.url !== '#') {
                          window.open(file.url, '_blank');
                        }
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
