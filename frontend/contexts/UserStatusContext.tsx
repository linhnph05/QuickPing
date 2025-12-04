'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useSocket } from './SocketContext';

interface UserStatus {
  user_id: string;
  is_online: boolean;
  last_seen: Date;
}

interface UserStatusContextType {
  userStatuses: Map<string, UserStatus>;
  getUserStatus: (userId: string) => UserStatus | null;
  isUserOnline: (userId: string) => boolean;
  requestUserStatuses: (userIds: string[]) => void;
}

const UserStatusContext = createContext<UserStatusContextType>({
  userStatuses: new Map(),
  getUserStatus: () => null,
  isUserOnline: () => false,
  requestUserStatuses: () => {},
});

export const useUserStatus = () => useContext(UserStatusContext);

interface UserStatusProviderProps {
  children: ReactNode;
}

export function UserStatusProvider({ children }: UserStatusProviderProps) {
  const [userStatuses, setUserStatuses] = useState<Map<string, UserStatus>>(new Map());
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    // Listen for single user status changes
    const handleUserStatusChanged = (status: UserStatus) => {
      console.log('📡 User status changed:', status);
      setUserStatuses(prev => {
        const newMap = new Map(prev);
        newMap.set(status.user_id, {
          ...status,
          last_seen: new Date(status.last_seen)
        });
        return newMap;
      });
    };
    
    // Listen for initial bulk status updates (when first connecting)
    const handleInitialUserStatuses = (statuses: UserStatus[]) => {
      console.log('📡 Received initial user statuses:', statuses.length);
      setUserStatuses(prev => {
        const newMap = new Map(prev);
        statuses.forEach(status => {
          newMap.set(status.user_id, {
            ...status,
            last_seen: new Date(status.last_seen)
          });
        });
        return newMap;
      });
    };
    
    // Listen for conversation-specific status updates
    const handleConversationUserStatuses = (data: { conversation_id: string; statuses: UserStatus[] }) => {
      console.log('📡 Received conversation user statuses:', data.statuses.length);
      setUserStatuses(prev => {
        const newMap = new Map(prev);
        data.statuses.forEach(status => {
          if (status.user_id) {
            newMap.set(status.user_id, {
              ...status,
              last_seen: new Date(status.last_seen)
            });
          }
        });
        return newMap;
      });
    };
    
    // Listen for response to status request
    const handleUserStatusesResponse = (statuses: UserStatus[]) => {
      console.log('📡 Received user statuses response:', statuses.length);
      setUserStatuses(prev => {
        const newMap = new Map(prev);
        statuses.forEach(status => {
          newMap.set(status.user_id, {
            ...status,
            last_seen: new Date(status.last_seen)
          });
        });
        return newMap;
      });
    };

    socket.on('user_status_changed', handleUserStatusChanged);
    socket.on('initial_user_statuses', handleInitialUserStatuses);
    socket.on('conversation_user_statuses', handleConversationUserStatuses);
    socket.on('user_statuses_response', handleUserStatusesResponse);

    // Cleanup
    return () => {
      socket.off('user_status_changed', handleUserStatusChanged);
      socket.off('initial_user_statuses', handleInitialUserStatuses);
      socket.off('conversation_user_statuses', handleConversationUserStatuses);
      socket.off('user_statuses_response', handleUserStatusesResponse);
    };
  }, [socket]);

  const getUserStatus = useCallback((userId: string): UserStatus | null => {
    return userStatuses.get(userId) || null;
  }, [userStatuses]);

  const isUserOnline = useCallback((userId: string): boolean => {
    const status = userStatuses.get(userId);
    return status?.is_online || false;
  }, [userStatuses]);
  
  const requestUserStatuses = useCallback((userIds: string[]) => {
    if (socket && userIds.length > 0) {
      socket.emit('get_user_statuses', userIds);
    }
  }, [socket]);

  return (
    <UserStatusContext.Provider value={{
      userStatuses,
      getUserStatus,
      isUserOnline,
      requestUserStatuses
    }}>
      {children}
    </UserStatusContext.Provider>
  );
}