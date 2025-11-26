# Class Diagrams
## QuickPing - Detailed Component Class Diagrams

**Version:** 1.0  
**Date:** 2024  
**Team:** Nhóm 4

This document provides detailed class diagrams for key components of the QuickPing system, including classes, their main attributes, operations, and relationships among them.

---

## Table of Contents

1. [Frontend Component Class Diagram](#1-frontend-component-class-diagram)
2. [Backend Component Class Diagram](#2-backend-component-class-diagram)
3. [Database Component Class Diagram](#3-database-component-class-diagram)

---

## 1. Frontend Component Class Diagram

### 1.1 Overview

The Frontend component is a Next.js 15 application built with React 19 and TypeScript. It provides the user interface for the QuickPing platform.

### 1.2 Class Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Frontend Component                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    SocketContext                                    │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  Attributes:                                                        │   │
│  │  - socket: Socket | null                                           │   │
│  │  - isConnected: boolean                                            │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  Operations:                                                        │   │
│  │  + SocketProvider(props: SocketProviderProps): ReactElement        │   │
│  │  + useSocket(): SocketContextType                                  │   │
│  │  + connect(token: string): void                                    │   │
│  │  + disconnect(): void                                              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                               │                                             │
│  ┌───────────────────────────▼─────────────────────────────────────────┐   │
│  │                         APIClient                                   │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  Attributes:                                                        │   │
│  │  - baseURL: string                                                  │   │
│  │  - USE_MOCK: boolean                                                │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  Operations:                                                        │   │
│  │  + auth.login(email: string, password: string): Promise<Response>  │   │
│  │  + auth.register(data: RegisterData): Promise<Response>            │   │
│  │  + auth.logout(): Promise<Response>                                │   │
│  │  + auth.me(): Promise<Response>                                    │   │
│  │  + conversations.getAll(): Promise<Response>                       │   │
│  │  + conversations.getById(id: string): Promise<Response>            │   │
│  │  + conversations.createDirect(userId: string): Promise<Response>   │   │
│  │  + conversations.createGroup(data: GroupData): Promise<Response>   │   │
│  │  + conversations.update(id: string, data: any): Promise<Response>  │   │
│  │  + conversations.changeParticipantRole(...): Promise<Response>     │   │
│  │  + conversations.removeParticipant(...): Promise<Response>         │   │
│  │  + messages.getByConversation(id: string): Promise<Response>       │   │
│  │  + messages.send(data: MessageData): Promise<Response>             │   │
│  │  + messages.edit(messageId: string, content: string): Promise      │   │
│  │  + messages.addReaction(messageId: string, emoji: string): Promise │   │
│  │  + messages.markAsRead(messageId: string): Promise<Response>       │   │
│  │  + users.search(query: string): Promise<Response>                  │   │
│  │  + friends.getAll(): Promise<Response>                             │   │
│  │  + friends.sendRequest(friendId: string): Promise<Response>        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                               │                                             │
│  ┌───────────────────────────▼─────────────────────────────────────────┐   │
│  │                         MessagesPanel                               │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  Attributes:                                                        │   │
│  │  - conversations: Conversation[]                                    │   │
│  │  - loading: boolean                                                 │   │
│  │  - searchQuery: string                                              │   │
│  │  - selectedId: string | null                                        │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  Operations:                                                        │   │
│  │  + MessagesPanel(props: MessagesPanelProps): ReactElement          │   │
│  │  - fetchConversations(): Promise<void>                             │   │
│  │  - handleSelect(id: string): void                                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                               │                                             │
│  ┌───────────────────────────▼─────────────────────────────────────────┐   │
│  │                         ChatPanel                                   │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  Attributes:                                                        │   │
│  │  - conversation: Conversation | null                                │   │
│  │  - messages: Message[]                                              │   │
│  │  - message: string                                                  │   │
│  │  - sending: boolean                                                 │   │
│  │  - loading: boolean                                                 │   │
│  │  - isTyping: boolean                                                │   │
│  │  - typingUsers: Set<string>                                         │   │
│  │  - messagesEndRef: RefObject<HTMLDivElement>                        │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  Operations:                                                        │   │
│  │  + ChatPanel(props: ChatPanelProps): ReactElement                  │   │
│  │  - fetchConversation(): Promise<void>                              │   │
│  │  - fetchMessages(): Promise<void>                                  │   │
│  │  - handleSendMessage(): Promise<void>                              │   │
│  │  - handleTyping(): void                                            │   │
│  │  - handleStopTyping(): void                                        │   │
│  │  - markMessagesAsRead(): Promise<void>                             │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                               │                                             │
│  ┌───────────────────────────▼─────────────────────────────────────────┐   │
│  │                         DirectoryPanel                              │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  Attributes:                                                        │   │
│  │  - conversation: Conversation | null                                │   │
│  │  - members: User[]                                                  │   │
│  │  - files: File[]                                                    │   │
│  │  - currentUserRole: string | null                                   │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  Operations:                                                        │   │
│  │  + DirectoryPanel(props: DirectoryPanelProps): ReactElement        │   │
│  │  - fetchMembers(): Promise<void>                                    │   │
│  │  - handleChangeRole(userId: string, role: string): Promise<void>   │   │
│  │  - handleRemoveParticipant(userId: string): Promise<void>          │   │
│  │  - handleLeaveGroup(): Promise<void>                                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

Relationships:
- SocketContext ◄──uses── ChatPanel
- SocketContext ◄──uses── MessagesPanel
- APIClient ◄──uses── MessagesPanel
- APIClient ◄──uses── ChatPanel
- APIClient ◄──uses── DirectoryPanel
- ChatPanel ◄──depends── Conversation
- ChatPanel ◄──depends── Message
- MessagesPanel ◄──depends── Conversation
```

### 1.3 Key Classes Description

#### SocketContext

**Purpose**: Manages Socket.io connection and provides real-time communication functionality

**Attributes**:
- `socket`: Socket.io client instance (null when not connected)
- `isConnected`: Boolean flag indicating connection status

**Operations**:
- `SocketProvider(props)`: React context provider component that initializes socket connection with JWT token from localStorage
- `useSocket()`: React hook to access socket context (socket instance and connection status)
- `connect(token)`: Establishes Socket.io connection to backend server with JWT token in auth
- `disconnect()`: Closes Socket.io connection and cleans up event listeners

**Relationships**: 
- Used by ChatPanel and MessagesPanel for real-time updates
- Provides socket connection state to child components via React Context

---

#### APIClient

**Purpose**: Provides unified interface for making HTTP API calls to backend

**Attributes**:
- `baseURL`: Base URL for API endpoints (default: `http://localhost:5001/api`)
- `USE_MOCK`: Boolean flag to switch between mock and real API (based on environment variable)

**Operations**:

**Auth Module**:
- `auth.login(email, password)`: Authenticates user and returns JWT token
- `auth.register(data)`: Registers new user account
- `auth.logout()`: Logs out current user
- `auth.me()`: Gets current authenticated user information

**Conversations Module**:
- `conversations.getAll()`: Retrieves all conversations for current user
- `conversations.getById(id)`: Gets conversation details by ID
- `conversations.createDirect(userId)`: Creates direct conversation with another user
- `conversations.createGroup(data)`: Creates group conversation with multiple participants
- `conversations.update(id, data)`: Updates conversation details (name, description)
- `conversations.changeParticipantRole(conversationId, userId, role)`: Changes participant role (admin only)
- `conversations.removeParticipant(conversationId, userId)`: Removes participant from group

**Messages Module**:
- `messages.getByConversation(id)`: Gets all messages for a conversation
- `messages.send(data)`: Sends new message
- `messages.edit(messageId, content)`: Edits existing message
- `messages.addReaction(messageId, emoji)`: Adds emoji reaction to message
- `messages.markAsRead(messageId)`: Marks message as read

**Users Module**:
- `users.search(query)`: Searches users by query string (username, email, MSSV)

**Friends Module**:
- `friends.getAll()`: Gets friends list
- `friends.sendRequest(friendId)`: Sends friend request

**Relationships**: Used by all React components for API communication

---

#### MessagesPanel

**Purpose**: Left sidebar component displaying list of conversations

**Attributes**:
- `conversations`: Array of Conversation objects
- `loading`: Boolean flag for loading state
- `searchQuery`: String for filtering conversations
- `selectedId`: Currently selected conversation ID

**Operations**:
- `fetchConversations()`: Fetches all conversations from API using APIClient
- `handleSelect(id)`: Handles conversation selection and calls onSelect callback

**Relationships**: 
- Uses APIClient for data fetching
- Uses SocketContext for real-time conversation updates (new messages, status changes)

---

#### ChatPanel

**Purpose**: Center panel component displaying messages and input field

**Attributes**:
- `conversation`: Current conversation object
- `messages`: Array of Message objects
- `message`: Current message input text
- `sending`: Boolean flag for sending state
- `loading`: Boolean flag for loading state
- `isTyping`: Boolean flag for typing state
- `typingUsers`: Set of user IDs currently typing
- `messagesEndRef`: Ref object to scroll to bottom of messages

**Operations**:
- `fetchConversation()`: Fetches conversation details from API
- `fetchMessages()`: Fetches messages for current conversation with pagination
- `handleSendMessage()`: Sends new message via API and emits socket event
- `handleTyping()`: Emits typing indicator via Socket.io
- `handleStopTyping()`: Emits stop typing indicator
- `markMessagesAsRead()`: Marks all visible messages as read via API

**Relationships**: 
- Uses APIClient for sending messages
- Uses SocketContext for real-time message updates
- Depends on Conversation and Message types

---

#### DirectoryPanel

**Purpose**: Right panel component displaying group members and files

**Attributes**:
- `conversation`: Current conversation object
- `members`: Array of User objects (participants)
- `files`: Array of File objects
- `currentUserRole`: Role of current user in conversation (admin/moderator/member)

**Operations**:
- `fetchMembers()`: Fetches conversation participants
- `handleChangeRole(userId, role)`: Changes participant role (admin only)
- `handleRemoveParticipant(userId)`: Removes participant from group (admin only)
- `handleLeaveGroup()`: Leaves group conversation

**Relationships**: Uses APIClient for role management operations

---

## 2. Backend Component Class Diagram

### 2.1 Overview

The Backend component is an Express.js application that provides REST API endpoints and Socket.io real-time server. It handles business logic, authentication, authorization, and database operations.

### 2.2 Class Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Backend Component                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    ExpressServer (server.js)                        │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  Attributes:                                                        │   │
│  │  - app: Express                                                     │   │
│  │  - httpServer: http.Server                                          │   │
│  │  - io: Server                                                       │   │
│  │  - allowedOrigins: string[]                                         │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  Operations:                                                        │   │
│  │  + constructor(): void                                              │   │
│  │  + setupMiddleware(): void                                          │   │
│  │  + setupRoutes(): void                                              │   │
│  │  + setupSocketIO(): void                                            │   │
│  │  + listen(port: number): void                                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                               │                                             │
│  ┌───────────────────────────▼─────────────────────────────────────────┐   │
│  │                         AuthMiddleware                              │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  Operations:                                                        │   │
│  │  + authenticate(req: Request, res: Response, next: NextFunction)    │   │
│  │  + authenticateSocket(socket: Socket, next: Function): void         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                               │                                             │
│  ┌───────────────────────────▼─────────────────────────────────────────┐   │
│  │                         AuthRoutes                                  │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  Attributes:                                                        │   │
│  │  - router: Router                                                   │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  Operations:                                                        │   │
│  │  + POST /register(req, res): Promise<void>                          │   │
│  │  + POST /login(req, res): Promise<void>                             │   │
│  │  + POST /logout(req, res): Promise<void>                            │   │
│  │  + GET /me(req, res): Promise<void>                                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                               │                                             │
│  ┌───────────────────────────▼─────────────────────────────────────────┐   │
│  │                      ConversationRoutes                             │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  Attributes:                                                        │   │
│  │  - router: Router                                                   │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  Operations:                                                        │   │
│  │  + POST /direct(req, res): Promise<void>                            │   │
│  │  + POST /group(req, res): Promise<void>                             │   │
│  │  + GET /(req, res): Promise<void>                                   │   │
│  │  + GET /:conversationId(req, res): Promise<void>                    │   │
│  │  + PUT /:conversationId(req, res): Promise<void>                    │   │
│  │  + PUT /:conversationId/participants/:userId/role(req, res)         │   │
│  │  + DELETE /:conversationId/participants/:userId(req, res)           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                               │                                             │
│  ┌───────────────────────────▼─────────────────────────────────────────┐   │
│  │                         MessageRoutes                               │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  Attributes:                                                        │   │
│  │  - router: Router                                                   │   │
│  │  - io: Server | null                                                │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  Operations:                                                        │   │
│  │  + setSocketIO(io: Server): void                                    │   │
│  │  + GET /conversation/:conversationId(req, res): Promise<void>       │   │
│  │  + POST /(req, res): Promise<void>                                  │   │
│  │  + PUT /:messageId(req, res): Promise<void>                         │   │
│  │  + POST /:messageId/read(req, res): Promise<void>                   │   │
│  │  + POST /:messageId/reaction(req, res): Promise<void>               │   │
│  │  + DELETE /:messageId/reaction/:emoji(req, res): Promise<void>      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                               │                                             │
│  ┌───────────────────────────▼─────────────────────────────────────────┐   │
│  │                      SocketHandler                                  │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  Attributes:                                                        │   │
│  │  - userSockets: Map<string, string>                                 │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  Operations:                                                        │   │
│  │  + setupSocketIO(io: Server): void                                  │   │
│  │  - handleConnection(socket: Socket): Promise<void>                  │   │
│  │  - handleJoinConversation(socket: Socket, conversationId: string)   │   │
│  │  - handleLeaveConversation(socket: Socket, conversationId: string)  │   │
│  │  - handleTyping(socket: Socket, data: any): void                    │   │
│  │  - handleStopTyping(socket: Socket, data: any): void                │   │
│  │  - handleMessageRead(socket: Socket, data: any): void               │   │
│  │  - handleDisconnect(socket: Socket): Promise<void>                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                               │                                             │
│  ┌───────────────────────────▼─────────────────────────────────────────┐   │
│  │                         User Model                                  │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  Attributes:                                                        │   │
│  │  - _id: ObjectId                                                    │   │
│  │  - email: string (unique, indexed)                                 │   │
│  │  - username: string (unique, indexed)                               │   │
│  │  - mssv: string                                                     │   │
│  │  - password_hash: string                                            │   │
│  │  - avatar_url: string                                               │   │
│  │  - bio: string                                                      │   │
│  │  - role: string                                                     │   │
│  │  - school_id: ObjectId                                              │   │
│  │  - is_online: boolean                                               │   │
│  │  - last_seen: Date                                                  │   │
│  │  - is_verified: boolean                                             │   │
│  │  - google_id: string                                                │   │
│  │  - preferences: Object                                              │   │
│  │  - created_at: Date                                                 │   │
│  │  - updated_at: Date                                                 │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  Operations:                                                        │   │
│  │  + save(): Promise<User>                                            │   │
│  │  + findOne(query: any): Promise<User | null>                        │   │
│  │  + findById(id: ObjectId): Promise<User | null>                     │   │
│  │  + find(query: any): Promise<User[]>                                │   │
│  │  + findByIdAndUpdate(id: ObjectId, update: any): Promise<User>      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                               │                                             │
│  ┌───────────────────────────▼─────────────────────────────────────────┐   │
│  │                      Conversation Model                             │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  Attributes:                                                        │   │
│  │  - _id: ObjectId                                                    │   │
│  │  - type: string                                                     │   │
│  │  - name: string                                                     │   │
│  │  - description: string                                              │   │
│  │  - participants: Array<Participant>                                 │   │
│  │  - settings: Map                                                    │   │
│  │  - pinned_messages: ObjectId[]                                      │   │
│  │  - created_by: ObjectId                                             │   │
│  │  - last_message: ObjectId                                           │   │
│  │  - created_at: Date                                                 │   │
│  │  - updated_at: Date                                                 │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  Operations:                                                        │   │
│  │  + save(): Promise<Conversation>                                    │   │
│  │  + findOne(query: any): Promise<Conversation | null>                │   │
│  │  + find(query: any): Promise<Conversation[]>                        │   │
│  │  + findById(id: ObjectId): Promise<Conversation | null>             │   │
│  │  + populate(fields: string): Promise<Conversation>                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                               │                                             │
│  ┌───────────────────────────▼─────────────────────────────────────────┐   │
│  │                         Message Model                               │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  Attributes:                                                        │   │
│  │  - _id: ObjectId                                                    │   │
│  │  - conversation_id: ObjectId                                        │   │
│  │  - sender_id: ObjectId                                              │   │
│  │  - type: string                                                     │   │
│  │  - content: string                                                  │   │
│  │  - file_info: Object                                                │   │
│  │  - reply_to: ObjectId                                               │   │
│  │  - thread_id: ObjectId                                              │   │
│  │  - is_edited: boolean                                               │   │
│  │  - reactions: Array<Reaction>                                       │   │
│  │  - read_by: Array<ReadBy>                                           │   │
│  │  - ai_summary: string                                               │   │
│  │  - created_at: Date                                                 │   │
│  │  - updated_at: Date                                                 │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  Operations:                                                        │   │
│  │  + save(): Promise<Message>                                         │   │
│  │  + find(query: any): Promise<Message[]>                            │   │
│  │  + findById(id: ObjectId): Promise<Message | null>                  │   │
│  │  + findOne(query: any): Promise<Message | null>                     │   │
│  │  + populate(fields: string): Promise<Message>                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

Relationships:
- ExpressServer ◄──uses── AuthMiddleware
- ExpressServer ◄──uses── AuthRoutes
- ExpressServer ◄──uses── ConversationRoutes
- ExpressServer ◄──uses── MessageRoutes
- ExpressServer ◄──uses── SocketHandler
- AuthRoutes ◄──uses── User Model
- ConversationRoutes ◄──uses── Conversation Model
- ConversationRoutes ◄──uses── User Model
- MessageRoutes ◄──uses── Message Model
- MessageRoutes ◄──uses── Conversation Model
- MessageRoutes ◄──uses── SocketHandler
- SocketHandler ◄──uses── User Model
- SocketHandler ◄──uses── Conversation Model
- User Model ◄──ref── Conversation Model (participants, created_by)
- Conversation Model ◄──ref── Message Model (last_message, pinned_messages)
- Message Model ◄──ref── Conversation Model (conversation_id)
- Message Model ◄──ref── User Model (sender_id)
```

### 2.3 Key Classes Description

#### ExpressServer

**Purpose**: Main entry point that initializes Express server and Socket.io

**Attributes**:
- `app`: Express application instance
- `httpServer`: HTTP server instance
- `io`: Socket.io server instance
- `allowedOrigins`: Array of allowed CORS origins

**Operations**:
- `constructor()`: Initializes Express app and HTTP server
- `setupMiddleware()`: Configures CORS, JSON parsing, URL encoding
- `setupRoutes()`: Mounts all API route handlers (auth, conversations, messages, users, friends, files, votes, ai)
- `setupSocketIO()`: Initializes Socket.io server with authentication middleware
- `listen(port)`: Starts HTTP server on specified port (default: 5001)

**Relationships**: Uses all route handlers, middleware, and socket handler

---

#### AuthMiddleware

**Purpose**: Validates JWT tokens for protected routes and Socket connections

**Operations**:
- `authenticate(req, res, next)`: HTTP middleware that extracts JWT token from Authorization header, verifies token using JWT_SECRET, finds user in database, attaches user to request object
- `authenticateSocket(socket, next)`: Socket middleware that extracts JWT token from handshake auth, verifies token, finds user, attaches userId and user object to socket instance

**Relationships**: Uses User model to verify user existence after token validation

---

#### AuthRoutes

**Purpose**: Handles authentication-related HTTP requests

**Operations**:
- `POST /api/auth/register`: Validates input using express-validator, checks for existing user by email/username, hashes password with bcrypt (salt rounds: 10), creates User document, generates JWT token, creates UserSession, returns token and user data (status: 201)
- `POST /api/auth/login`: Validates credentials, finds user by email, verifies password with bcrypt.compare, generates JWT token, updates user online status, creates session, returns token and user data (status: 200)
- `POST /api/auth/logout`: Invalidates user session in database, returns success message
- `GET /api/auth/me`: Returns current authenticated user information from req.user (set by AuthMiddleware)

**Relationships**: Uses User model, UserSession model, bcrypt for password hashing, JWT for token generation

---

#### ConversationRoutes

**Purpose**: Handles conversation-related HTTP requests

**Operations**:
- `GET /api/conversations`: Finds all conversations where user is participant, populates participant details and last message, sorts by updated_at descending
- `POST /api/conversations/direct`: Checks if direct conversation exists, creates new direct conversation with 2 participants (both as members), populates participants
- `POST /api/conversations/group`: Creates group conversation with multiple participants, sets creator as admin, validates participant IDs exist
- `GET /api/conversations/:id`: Gets conversation by ID, checks participant access, populates all related data (participants, created_by, pinned_messages)
- `PUT /api/conversations/:id`: Updates conversation name/description, checks admin/moderator permissions
- `PUT /api/conversations/:id/participants/:userId/role`: Changes participant role, validates admin permission, prevents removing last admin, updates participant role in array
- `DELETE /api/conversations/:id/participants/:userId`: Removes participant, validates admin permission, prevents removing last admin

**Relationships**: Uses Conversation model, User model, Message model

---

#### MessageRoutes

**Purpose**: Handles message-related HTTP requests and real-time broadcasting

**Attributes**:
- `io`: Socket.io server instance (set by setSocketIO method)

**Operations**:
- `setSocketIO(io)`: Sets Socket.io instance for emitting real-time events
- `GET /api/messages/conversation/:id`: Validates participant access, retrieves messages with pagination (limit, before timestamp), populates sender and file info, sorts by created_at descending
- `POST /api/messages`: Validates participant access, creates new Message document, updates conversation last_message and updated_at, emits Socket.io event ('message_received') to conversation room, populates sender before returning
- `PUT /api/messages/:id`: Validates sender permission (only sender can edit), updates message content, marks is_edited as true, updates updated_at
- `POST /api/messages/:id/read`: Adds user to read_by array, sets read_at timestamp if not already present
- `POST /api/messages/:id/reaction`: Adds or updates reaction in reactions array (removes existing reaction from same user if exists)
- `DELETE /api/messages/:id/reaction/:emoji`: Removes reaction from reactions array for current user

**Relationships**: Uses Message model, Conversation model, Socket.io for real-time updates

---

#### SocketHandler

**Purpose**: Handles real-time Socket.io events and room management

**Attributes**:
- `userSockets`: Map tracking user ID to socket ID for status management

**Operations**:
- `setupSocketIO(io)`: Sets up all Socket.io event handlers and connection logic
- `handleConnection(socket)`: Handles new socket connection, updates user online status in database, joins user-specific room (`user_{userId}`), auto-joins all conversation rooms user is part of, broadcasts online status change
- `handleJoinConversation(socket, conversationId)`: Joins socket to conversation room (`conversation_{conversationId}`), emits join confirmation to client
- `handleLeaveConversation(socket, conversationId)`: Leaves conversation room
- `handleTyping(socket, data)`: Broadcasts typing indicator to conversation room (except sender)
- `handleStopTyping(socket, data)`: Broadcasts stop typing indicator to conversation room
- `handleMessageRead(socket, data)`: Broadcasts read receipt to conversation room
- `handleDisconnect(socket)`: Updates user offline status in database, removes from userSockets map, broadcasts status change to all clients

**Relationships**: Uses User model, Conversation model, Socket.io server

---

## 3. Database Component Class Diagram

### 3.1 Overview

The Database component is a MongoDB NoSQL database that stores all application data. It uses Mongoose ODM for schema definition and data access from the backend.

### 3.2 Class Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Database Component                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         User Collection                             │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  Attributes:                                                        │   │
│  │  - _id: ObjectId                                                    │   │
│  │  - email: string (unique, indexed, required)                       │   │
│  │  - username: string (unique, indexed, required)                     │   │
│  │  - mssv: string                                                     │   │
│  │  - password_hash: string (required if no google_id)                 │   │
│  │  - avatar_url: string                                               │   │
│  │  - bio: string (maxlength: 500)                                     │   │
│  │  - role: string (enum: admin/moderator/member, default: member)     │   │
│  │  - school_id: ObjectId (ref: School)                                │   │
│  │  - is_online: boolean (default: false)                              │   │
│  │  - last_seen: Date (default: Date.now)                              │   │
│  │  - is_verified: boolean (default: false)                            │   │
│  │  - google_id: string                                                │   │
│  │  - preferences: { theme: string, font_size: string }                │   │
│  │  - created_at: Date (default: Date.now)                             │   │
│  │  - updated_at: Date (default: Date.now)                             │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  Operations:                                                        │   │
│  │  + save(): Promise<User>                                            │   │
│  │  + findOne(query: any): Promise<User | null>                        │   │
│  │  + findById(id: ObjectId): Promise<User | null>                     │   │
│  │  + find(query: any): Promise<User[]>                                │   │
│  │  + findByIdAndUpdate(id: ObjectId, update: any): Promise<User>      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                               │                                             │
│  ┌───────────────────────────▼─────────────────────────────────────────┐   │
│  │                    Conversation Collection                           │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  Attributes:                                                        │   │
│  │  - _id: ObjectId                                                    │   │
│  │  - type: string (enum: direct/group, required)                      │   │
│  │  - name: string                                                     │   │
│  │  - description: string (maxlength: 500)                             │   │
│  │  - participants: Array<Participant>                                 │   │
│  │    - user_id: ObjectId (ref: User, required)                        │   │
│  │    - role: string (enum: admin/moderator/member, default: member)   │   │
│  │  - settings: Map<string, any>                                       │   │
│  │  - pinned_messages: ObjectId[] (ref: Message)                       │   │
│  │  - created_by: ObjectId (ref: User, required)                       │   │
│  │  - last_message: ObjectId (ref: Message)                            │   │
│  │  - created_at: Date (default: Date.now)                             │   │
│  │  - updated_at: Date (default: Date.now)                             │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  Operations:                                                        │   │
│  │  + save(): Promise<Conversation>                                    │   │
│  │  + findOne(query: any): Promise<Conversation | null>                │   │
│  │  + find(query: any): Promise<Conversation[]>                        │   │
│  │  + findById(id: ObjectId): Promise<Conversation | null>             │   │
│  │  + populate(fields: string): Promise<Conversation>                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                               │                                             │
│  ┌───────────────────────────▼─────────────────────────────────────────┐   │
│  │                        Message Collection                            │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  Attributes:                                                        │   │
│  │  - _id: ObjectId                                                    │   │
│  │  - conversation_id: ObjectId (ref: Conversation, required, indexed) │   │
│  │  - sender_id: ObjectId (ref: User, required, indexed)               │   │
│  │  - type: string (enum: text/file/image/video/system, default: text) │   │
│  │  - content: string                                                  │   │
│  │  - file_info: {                                                    │   │
│  │      file_id: ObjectId (ref: File),                                │   │
│  │      filename: string,                                             │   │
│  │      mime_type: string,                                            │   │
│  │      size: number                                                  │   │
│  │    }                                                                │   │
│  │  - reply_to: ObjectId (ref: Message)                                │   │
│  │  - thread_id: ObjectId (ref: Message)                               │   │
│  │  - is_edited: boolean (default: false)                              │   │
│  │  - reactions: Array<Reaction>                                       │   │
│  │    - emoji: string (required)                                       │   │
│  │    - user_id: ObjectId (ref: User, required)                        │   │
│  │  - read_by: Array<ReadBy>                                           │   │
│  │    - user_id: ObjectId (ref: User, required)                        │   │
│  │    - read_at: Date (default: Date.now)                              │   │
│  │  - ai_summary: string                                               │   │
│  │  - created_at: Date (default: Date.now, indexed)                    │   │
│  │  - updated_at: Date (default: Date.now)                             │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  Operations:                                                        │   │
│  │  + save(): Promise<Message>                                         │   │
│  │  + find(query: any): Promise<Message[]>                            │   │
│  │  + findById(id: ObjectId): Promise<Message | null>                  │   │
│  │  + findOne(query: any): Promise<Message | null>                     │   │
│  │  + populate(fields: string): Promise<Message>                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                               │                                             │
│  ┌───────────────────────────▼─────────────────────────────────────────┐   │
│  │                      Friendship Collection                           │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  Attributes:                                                        │   │
│  │  - _id: ObjectId                                                    │   │
│  │  - user_id: ObjectId (ref: User, required, indexed)                 │   │
│  │  - friend_id: ObjectId (ref: User, required, indexed)               │   │
│  │  - status: string (enum: pending/accepted/rejected/blocked)         │   │
│  │  - sent_at: Date (default: Date.now)                                │   │
│  │  - responded_at: Date                                               │   │
│  │  - created_at: Date (default: Date.now)                             │   │
│  │  - updated_at: Date (default: Date.now)                             │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  Operations:                                                        │   │
│  │  + save(): Promise<Friendship>                                      │   │
│  │  + findOne(query: any): Promise<Friendship | null>                  │   │
│  │  + find(query: any): Promise<Friendship[]>                          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                               │                                             │
│  ┌───────────────────────────▼─────────────────────────────────────────┐   │
│  │                         File Collection                              │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  Attributes:                                                        │   │
│  │  - _id: ObjectId                                                    │   │
│  │  - uploader_id: ObjectId (ref: User, required, indexed)             │   │
│  │  - original_name: string (required)                                 │   │
│  │  - stored_name: string (required)                                   │   │
│  │  - url: string (required)                                           │   │
│  │  - mime_type: string (required)                                     │   │
│  │  - size: number (required)                                          │   │
│  │  - conversation_id: ObjectId (ref: Conversation, indexed)           │   │
│  │  - message_id: ObjectId (ref: Message)                              │   │
│  │  - metadata: Map<string, any>                                       │   │
│  │  - access_type: string (enum: public/private, default: private)     │   │
│  │  - upload_date: Date (default: Date.now)                            │   │
│  │  - expires_at: Date                                                 │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  Operations:                                                        │   │
│  │  + save(): Promise<File>                                            │   │
│  │  + findById(id: ObjectId): Promise<File | null>                     │   │
│  │  + find(query: any): Promise<File[]>                                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

Relationships:
- User ◄──1..*── Friendship (user_id)
- User ◄──1..*── Friendship (friend_id)
- User ◄──*── Conversation (participants.user_id)
- User ◄──1── Conversation (created_by)
- User ◄──*── Message (sender_id)
- User ◄──*── File (uploader_id)
- Conversation ◄──*── Message (conversation_id)
- Conversation ◄──0..1── Message (last_message)
- Conversation ◄──*── Message (pinned_messages)
- Message ◄──0..1── Message (reply_to)
- Message ◄──0..1── Message (thread_id)
- Message ◄──0..1── File (file_info.file_id)
- Conversation ◄──*── File (conversation_id)
```

### 3.3 Key Classes Description

#### User Collection

**Purpose**: Stores all user account information, profiles, and preferences

**Attributes**:
- `_id`: Unique ObjectId identifier
- `email`: Unique email address (required, unique index, lowercase, trimmed)
- `username`: Unique username (required, unique index, trimmed)
- `mssv`: Student ID (optional, sparse index)
- `password_hash`: Hashed password using bcrypt (required if no google_id)
- `avatar_url`: URL to user avatar image
- `bio`: User biography (max 500 characters)
- `role`: User role (enum: admin/moderator/member, default: member)
- `school_id`: Reference to School collection (optional)
- `is_online`: Boolean indicating current online status (default: false)
- `last_seen`: Timestamp of last activity (default: Date.now)
- `is_verified`: Boolean indicating email verification status
- `google_id`: Google OAuth ID (optional, sparse index)
- `preferences`: Object containing theme and font_size preferences
- `created_at`: Timestamp of account creation (default: Date.now)
- `updated_at`: Timestamp of last update (auto-updated on save via pre-save hook)

**Indexes**: 
- email (unique)
- username (unique)
- mssv (sparse)

**Relationships**: 
- Referenced by Conversation as participants.user_id (many)
- Referenced by Conversation as created_by (one)
- Referenced by Message as sender_id (many)
- Referenced by Friendship as user_id and friend_id (many)
- Referenced by File as uploader_id (many)

**Operations**: Standard Mongoose CRUD operations with pre-save hook to update updated_at

---

#### Conversation Collection

**Purpose**: Stores direct and group conversation data

**Attributes**:
- `_id`: Unique ObjectId identifier
- `type`: Conversation type (enum: direct/group, required)
- `name`: Group name (for group conversations, optional)
- `description`: Group description (max 500 characters)
- `participants`: Array of participant objects, each containing:
  - `user_id`: Reference to User (required)
  - `role`: Participant role (enum: admin/moderator/member, default: member)
- `settings`: Map of conversation settings (key-value pairs)
- `pinned_messages`: Array of Message ObjectIds (references to pinned messages)
- `created_by`: Reference to User who created the conversation (required)
- `last_message`: Reference to most recent Message (optional)
- `created_at`: Timestamp of creation (default: Date.now)
- `updated_at`: Timestamp of last update (auto-updated on save via pre-save hook)

**Indexes**: 
- participants.user_id (for finding user's conversations efficiently)

**Relationships**:
- References User collection (participants.user_id - many, created_by - one)
- Referenced by Message as conversation_id (many)
- References Message collection (last_message - one, pinned_messages - many)
- Referenced by File as conversation_id (many)

**Operations**: Standard Mongoose CRUD operations with pre-save hook, supports population of referenced fields

---

#### Message Collection

**Purpose**: Stores all chat messages with metadata

**Attributes**:
- `_id`: Unique ObjectId identifier
- `conversation_id`: Reference to Conversation (required, indexed)
- `sender_id`: Reference to User who sent message (required, indexed)
- `type`: Message type (enum: text/file/image/video/system, default: text)
- `content`: Message text content
- `file_info`: Object containing file metadata:
  - `file_id`: Reference to File collection
  - `filename`: Original filename
  - `mime_type`: File MIME type
  - `size`: File size in bytes
- `reply_to`: Reference to Message being replied to (optional)
- `thread_id`: Reference to Message that started thread (optional)
- `is_edited`: Boolean indicating if message was edited (default: false)
- `reactions`: Array of reaction objects, each containing:
  - `emoji`: Emoji string (required)
  - `user_id`: Reference to User who reacted (required)
- `read_by`: Array of read receipt objects, each containing:
  - `user_id`: Reference to User who read message (required)
  - `read_at`: Timestamp of read (default: Date.now)
- `ai_summary`: AI-generated summary text (optional)
- `created_at`: Timestamp of creation (default: Date.now, indexed)
- `updated_at`: Timestamp of last update (auto-updated on save via pre-save hook)

**Indexes**: 
- Compound index on (conversation_id, created_at) for efficient message retrieval by conversation
- Index on sender_id for finding user's messages

**Relationships**:
- References Conversation collection (conversation_id - many)
- References User collection (sender_id - many, reactions.user_id - many, read_by.user_id - many)
- References Message collection (reply_to - one, thread_id - one)
- References File collection (file_info.file_id - one)

**Operations**: Standard Mongoose CRUD operations with pre-save hook, supports population of all referenced fields

---

#### Friendship Collection

**Purpose**: Stores friend relationships and friend requests

**Attributes**:
- `_id`: Unique ObjectId identifier
- `user_id`: Reference to User (first user, required, indexed)
- `friend_id`: Reference to User (second user, required, indexed)
- `status`: Relationship status (enum: pending/accepted/rejected/blocked, default: pending)
- `sent_at`: Timestamp when request was sent (default: Date.now)
- `responded_at`: Timestamp when request was responded to (optional)
- `created_at`: Timestamp of creation (default: Date.now)
- `updated_at`: Timestamp of last update (auto-updated on save via pre-save hook)

**Indexes**: 
- Compound unique index on (user_id, friend_id) to prevent duplicate friendships
- Indexes on user_id and friend_id for efficient queries

**Relationships**:
- References User collection twice (user_id - many, friend_id - many)

**Operations**: Standard Mongoose CRUD operations with pre-save hook

---

#### File Collection

**Purpose**: Stores file metadata and storage information

**Attributes**:
- `_id`: Unique ObjectId identifier
- `uploader_id`: Reference to User who uploaded file (required, indexed)
- `original_name`: Original filename (required)
- `stored_name`: Filename in storage system (required)
- `url`: File access URL (required)
- `mime_type`: File MIME type (required)
- `size`: File size in bytes (required)
- `conversation_id`: Reference to Conversation where file was uploaded (indexed)
- `message_id`: Reference to Message containing file (optional)
- `metadata`: Map of additional file metadata (key-value pairs)
- `access_type`: File access type (enum: public/private, default: private)
- `upload_date`: Timestamp of upload (default: Date.now)
- `expires_at`: Expiration timestamp (optional)

**Indexes**: 
- uploader_id (for finding user's uploaded files)
- conversation_id (for finding files in a conversation)

**Relationships**:
- References User collection (uploader_id - many)
- References Conversation collection (conversation_id - many)
- References Message collection (message_id - one)

**Operations**: Standard Mongoose CRUD operations for file metadata management

---

**Document Prepared By:** Nhóm 4 - QuickPing Development Team  
**Last Updated:** 2024

