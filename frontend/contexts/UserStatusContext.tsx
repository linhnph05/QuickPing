'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
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
}

const UserStatusContext = createContext<UserStatusContextType>({
  userStatuses: new Map(),
  getUserStatus: () => null,
  isUserOnline: () => false,
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

    // Listen for user status changes
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

    socket.on('user_status_changed', handleUserStatusChanged);

    // Cleanup
    return () => {
      socket.off('user_status_changed', handleUserStatusChanged);
    };
  }, [socket]);

  const getUserStatus = (userId: string): UserStatus | null => {
    return userStatuses.get(userId) || null;
  };

  const isUserOnline = (userId: string): boolean => {
    const status = userStatuses.get(userId);
    return status?.is_online || false;
  };

  return (
    <UserStatusContext.Provider value={{
      userStatuses,
      getUserStatus,
      isUserOnline
    }}>
      {children}
    </UserStatusContext.Provider>
  );
}