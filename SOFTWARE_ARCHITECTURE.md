# Software Architecture Document
## QuickPing - Chat Platform for Students & Teachers

**Version:** 1.0  
**Date:** 2024  
**Team:** Nhóm 4

---

## 1. Introduction

[The introduction of the Software Architecture Document provides an overview of the entire Software Architecture Document. It includes the purpose, scope, definitions, acronyms, abbreviations, references, and overview of the Software Architecture Document.]

### 1.1 Purpose

This Software Architecture Document provides a comprehensive overview of the QuickPing system architecture. It describes the overall structure, key components, their relationships, and the technologies used to build the platform. The document serves as a blueprint for developers, stakeholders, and system administrators to understand the system's design and implementation.

QuickPing is a modern real-time chat platform designed for educational institutions. The system enables students and teachers to communicate through direct messages and group chats with features like file sharing, role management, and AI-powered conversation summarization.

### 1.2 Scope

This document covers:
- The overall architecture of the QuickPing chat platform
- Component architecture and detailed component descriptions
- Communication methods between components
- Technology stack and programming languages
- Database schema and data models
- Security and authentication mechanisms
- Real-time communication architecture
- AI agent integration

### 1.3 Definitions, Acronyms, and Abbreviations

- **API**: Application Programming Interface
- **JWT**: JSON Web Token
- **REST**: Representational State Transfer
- **ODM**: Object Document Mapper (Mongoose)
- **RBAC**: Role-Based Access Control
- **SSR**: Server-Side Rendering
- **SSG**: Static Site Generation
- **CRUD**: Create, Read, Update, Delete
- **PM**: Private Message (Direct Message)
- **MSSV**: Mã Số Sinh Viên (Student ID)
- **HTTP**: Hypertext Transfer Protocol
- **HTTPS**: HTTP Secure
- **WebSocket**: Communication protocol for real-time bidirectional data transfer
- **TCP/IP**: Transmission Control Protocol/Internet Protocol

### 1.4 References

- Next.js Documentation: https://nextjs.org/docs
- Express.js Documentation: https://expressjs.com/
- MongoDB Documentation: https://www.mongodb.com/docs/
- Socket.io Documentation: https://socket.io/docs/
- Mongoose Documentation: https://mongoosejs.com/docs/
- React Documentation: https://react.dev/
- TypeScript Documentation: https://www.typescriptlang.org/docs/

### 1.5 Overview

This document is organized as follows:
- **Section 2**: Architectural Goals and Constraints
- **Section 3**: Use-Case Model
- **Section 4**: Logical View (with component details)
- **Section 5**: Deployment (for PA4)
- **Section 6**: Implementation View (for PA4)

---

## 2. Architectural Goals and Constraints

[This section describes the software requirements and objectives that have some significant impact on the architecture; for example, safety, security, privacy, use of an off-the-shelf product, portability, distribution, and reuse. It also captures the special constraints that may apply: design and implementation strategy, development tools, team structure, schedule, legacy code, and so on.

Vietnamese: Phần này nêu các mục tiêu và ràng buộc của kiến trúc phần mềm. Các mục tiêu và ràng buộc này lấy từ yêu cầu phi chức năng trong tài liệu Vision. Ví dụ, các ràng buộc/mục tiêu như yêu cầu áp dụng ngôn ngữ lập trình, môi trường của ứng dụng (như web, mobile, hay cả hai), ràng buộc về bảo mật, hiệu năng, v.v…

Các bạn chỉ cần gạch đầu dòng các mục tiêu và ràng buộc quan trọng ở đây thôi.]

### 2.1 Architectural Goals

- **Real-time Communication**: Support instant messaging with low latency (< 1 second) for real-time chat experience
- **Scalability**: Design architecture to support concurrent users (target: 1000+ simultaneous connections)
- **Maintainability**: Create modular and maintainable codebase with clear separation of concerns
- **Security**: Implement robust authentication and authorization mechanisms to protect user data
- **Performance**: Optimize database queries and WebSocket connections for efficient data retrieval
- **Portability**: Use containerization (Docker) for easy deployment across different environments
- **Reusability**: Design reusable components and services for code reuse

### 2.2 Technology Constraints

- **Programming Languages**:
  - Frontend: TypeScript/JavaScript (ES6+)
  - Backend: JavaScript (Node.js 18+)

- **Operating Environment**:
  - Web application (browser-based)
  - Responsive design for desktop and mobile browsers
  - Server environment: Node.js runtime

- **Frameworks and Libraries**:
  - Frontend: Next.js 15 (React framework)
  - Backend: Express.js 4.x
  - Database: MongoDB (NoSQL)
  - Real-time: Socket.io 4.x

### 2.3 Security Constraints

- JWT-based authentication for API access
- Password hashing using bcrypt (salt rounds: 10)
- HTTPS encryption for production (recommended)
- CORS (Cross-Origin Resource Sharing) configuration
- Input validation and sanitization on all endpoints
- Role-based access control (RBAC) for group operations
- Authentication required for all protected routes
- Secure token storage (localStorage on client)

### 2.4 Performance Constraints

- Real-time message delivery (< 1 second latency)
- Support for concurrent users (target: 1000+ simultaneous connections)
- Database query optimization with indexes
- Efficient WebSocket connection management

### 2.5 Scalability Constraints

- Stateless backend design for horizontal scaling
- Database connection pooling
- File storage considerations (local filesystem, extensible to cloud storage)

### 2.6 Development Constraints

- Modular and maintainable codebase
- Clear separation of concerns (frontend/backend/database)
- Containerized deployment (Docker)
- Environment-based configuration (.env files)
- Version control: Git

### 2.7 Integration Constraints

- RESTful API for synchronous operations
- WebSocket (Socket.io) for real-time features
- OpenAI API integration for AI features (optional)
- MongoDB Atlas or local MongoDB instance

### 2.8 Platform Constraints

- Browser compatibility: Modern browsers (Chrome, Firefox, Safari, Edge)
- Node.js version: 18 or higher
- MongoDB version: 7.0 or compatible

---

## 3. Use-Case Model

[This section includes the use case diagrams that are already modeled and presented in the use-case specification document.]

### 3.1 Use Case Diagram Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         QuickPing System                        │
└─────────────────────────────────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼──────┐   ┌────────▼────────┐   ┌───────▼──────┐
│  Student     │   │  Teacher        │   │  Admin       │
└───────┬──────┘   └────────┬────────┘   └───────┬──────┘
        │                   │                    │
        └───────────────────┼────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐  ┌───────▼──────┐  ┌────────▼───────┐
│ Authenticate   │  │ Search Users │  │ Manage Profile │
│ (Login/Register)│  │              │  │                │
└────────────────┘  └──────────────┘  └────────────────┘
        │                   │                   │
┌───────▼────────┐  ┌───────▼──────┐  ┌────────▼───────┐
│ Send Message   │  │ Create Group │  │ Manage Friends │
│                │  │              │  │                │
└────────────────┘  └──────────────┘  └────────────────┘
        │                   │                   │
┌───────▼────────┐  ┌───────▼──────┐  ┌────────▼───────┐
│ Upload File    │  │ Manage Roles │  │ View Status    │
│                │  │ (Admin only) │  │                │
└────────────────┘  └──────────────┘  └────────────────┘
```

### 3.2 Key Use Cases

#### Authentication Use Cases
- **UC-001**: Register new user account
- **UC-002**: Login to system
- **UC-003**: Logout from system

#### Messaging Use Cases
- **UC-004**: Send direct message to another user
- **UC-005**: Send message in group chat
- **UC-006**: View conversation messages
- **UC-007**: Edit sent message
- **UC-008**: React to message (emoji)
- **UC-009**: Mark message as read

#### Group Management Use Cases
- **UC-010**: Create group conversation
- **UC-011**: Add member to group
- **UC-012**: Remove member from group
- **UC-013**: Change member role (Admin only)
- **UC-014**: Leave group

#### User Management Use Cases
- **UC-015**: Search for users
- **UC-016**: Send friend request
- **UC-017**: Accept friend request
- **UC-018**: Reject friend request
- **UC-019**: View user profile

#### File Management Use Cases
- **UC-020**: Upload file to conversation
- **UC-021**: Download file from conversation

#### AI Features Use Cases
- **UC-022**: Summarize conversation (AI)
- **UC-023**: Summarize file content (AI)

---

## 4. Logical View

[This section describes the architecture with components and relationships among them. One or several diagrams showing the architecture are provided here. For each component, describe its responsibilities and/or services that are provided for other components. Each relationship should also indicate the means of communication, such as HTTP, HTTPS, Socket, LAN, Internet, etc.

The detail of each component is provided using the subsection below.]

### 4.1 Overall Architecture

QuickPing follows a **3-Tier Architecture** pattern:

1. **Presentation Tier** (Frontend/Client)
2. **Application Tier** (Backend/Server)
3. **Data Tier** (Database)

### 4.2 Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                         PRESENTATION TIER                            │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  Next.js Frontend Application (Port 3000)                      │ │
│  │  - Pages & Routes                                              │ │
│  │  - React Components                                            │ │
│  │  - Context Providers                                           │ │
│  │  - API Client                                                  │ │
│  │  - Socket.io Client                                            │ │
│  └────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
            HTTP/HTTPS               WebSocket
            (REST API)               (Socket.io)
                    │                       │
┌───────────────────▼───────────────────────▼───────────────────────┐
│                      APPLICATION TIER                              │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  Express.js Backend Server (Port 5001)                       │ │
│  │                                                               │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │ │
│  │  │  Auth Routes │  │  User Routes │  │ Conversation │      │ │
│  │  │              │  │              │  │ Routes       │      │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘      │ │
│  │                                                               │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │ │
│  │  │ Message      │  │ File Routes  │  │ AI Routes    │      │ │
│  │  │ Routes       │  │              │  │              │      │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘      │ │
│  │                                                               │ │
│  │  ┌──────────────┐  ┌──────────────┐                        │ │
│  │  │ Auth         │  │ Socket.io    │                        │ │
│  │  │ Middleware   │  │ Handler      │                        │ │
│  │  └──────────────┘  └──────────────┘                        │ │
│  └──────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                                │
                        Mongoose ODM
                        (TCP/IP)
                                │
┌───────────────────────────────▼───────────────────────────────────┐
│                         DATA TIER                                 │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  MongoDB Database (Port 27017)                               │ │
│  │  - users collection                                           │ │
│  │  - conversations collection                                   │ │
│  │  - messages collection                                        │ │
│  │  - friendships collection                                     │ │
│  │  - files collection                                           │ │
│  │  - notifications collection                                   │ │
│  │  - schools collection                                         │ │
│  │  - votes collection                                           │ │
│  │  - user_sessions collection                                   │ │
│  └──────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘

        ┌────────────────────────────────────────────┐
        │         External Services                  │
        │  - OpenAI API (HTTPS REST API)            │
        │  - MongoDB Atlas (Cloud Database)         │
        └────────────────────────────────────────────┘
```

### 4.3 Component Relationships and Communication

#### 4.3.1 Frontend ↔ Backend Communication

**HTTP/REST API (Synchronous):**
- **Protocol**: HTTP/HTTPS
- **Method**: RESTful API
- **Port**: 5001
- **Data Format**: JSON
- **Authentication**: JWT Bearer Token in Authorization header
- **Examples**:
  - `POST /api/auth/login` - User login
  - `GET /api/conversations` - Get user conversations
  - `POST /api/messages` - Send message

**WebSocket (Asynchronous/Real-time):**
- **Protocol**: WebSocket (via Socket.io)
- **Method**: Socket.io events
- **Port**: 5001 (same as HTTP)
- **Data Format**: JSON
- **Authentication**: JWT token in handshake
- **Examples**:
  - `message_received` - New message event
  - `user_typing` - Typing indicator
  - `user_status_changed` - Online/offline status

#### 4.3.2 Backend ↔ Database Communication

- **Protocol**: TCP/IP
- **Method**: Mongoose ODM (Object Document Mapper)
- **Port**: 27017 (MongoDB default)
- **Connection**: MongoDB connection string (local or Atlas via Internet)
- **Operations**: CRUD operations via Mongoose models

#### 4.3.3 Backend ↔ External Services

- **OpenAI API**: HTTPS REST API calls over Internet for AI summarization
- **MongoDB Atlas**: Cloud database connection via connection string over Internet

### 4.4 Component Responsibilities

#### 4.4.1 Frontend Component Responsibilities

- **User Interface Rendering**: Display pages, components, and UI elements
- **User Input Handling**: Capture and validate user input
- **State Management**: Manage application state (React Context, hooks)
- **API Communication**: Send HTTP requests and handle responses
- **Real-time Communication**: Connect to Socket.io and handle real-time events
- **Routing**: Handle page navigation (Next.js App Router)
- **Authentication State**: Manage user session and token

#### 4.4.2 Backend Component Responsibilities

- **Request Processing**: Handle HTTP requests from frontend
- **Authentication**: Validate JWT tokens and authenticate users
- **Authorization**: Check user permissions and roles
- **Business Logic**: Implement application logic and rules
- **Data Validation**: Validate and sanitize input data
- **Database Operations**: Perform CRUD operations on database
- **Real-time Events**: Emit Socket.io events for real-time updates
- **File Handling**: Process file uploads and downloads
- **AI Integration**: Integrate with OpenAI API for summarization

#### 4.4.3 Database Component Responsibilities

- **Data Persistence**: Store all application data
- **Data Integrity**: Ensure data consistency and validation
- **Query Processing**: Process database queries efficiently
- **Relationship Management**: Maintain relationships between entities
- **Indexing**: Provide fast data retrieval via indexes

---

### 4.1 Component: Frontend

[This section provides details for the component named "Frontend". You need to include class diagrams for this component and explain key classes.]

#### 4.1.1 Overview

The Frontend component is a Next.js 15 application built with React 19 and TypeScript. It provides the user interface for the QuickPing platform and communicates with the backend via HTTP REST API and WebSocket.

**Technology Stack:**
- Next.js 15 (React framework with App Router)
- TypeScript 5.3.3
- React 19.2.0
- Tailwind CSS 3.3.6
- Shadcn UI (Radix UI based)
- Axios 1.6.2 (HTTP client)
- Socket.io-client 4.8.1 (WebSocket client)

**Communication Methods:**
- **To Backend (HTTP)**: HTTP/HTTPS REST API via Axios client
- **To Backend (WebSocket)**: WebSocket via Socket.io-client

#### 4.1.2 Responsibilities and Services

The Frontend component provides the following services:

- **User Interface Rendering**: Displays all UI components, pages, and visual elements
- **User Input Handling**: Captures and validates user input from forms and interactions
- **State Management**: Manages application state using React Context and hooks
- **API Communication**: Sends HTTP requests to backend and handles responses
- **Real-time Communication**: Connects to Socket.io server and handles real-time events
- **Routing**: Handles page navigation using Next.js App Router
- **Authentication State**: Manages user session and JWT token

#### 4.1.3 Class Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Component                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Pages (Next.js App Router)             │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │  + LoginPage                                        │   │
│  │  + RegisterPage                                     │   │
│  │  + ChatPage                                         │   │
│  │  + GroupsPage                                       │   │
│  │  + FriendsPage                                      │   │
│  │  + ProfilePage                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                       │                                     │
│  ┌────────────────────▼─────────────────────────────────┐  │
│  │              React Components                        │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  + MessagesPanel                                     │  │
│  │  + ChatPanel                                         │  │
│  │  + DirectoryPanel                                    │  │
│  │  + UserProfileModal                                  │  │
│  │  + AddMembersModal                                   │  │
│  │  + UI Components (Button, Input, Dialog, etc.)      │  │
│  └──────────────────────────────────────────────────────┘  │
│                       │                                     │
│  ┌────────────────────▼─────────────────────────────────┐  │
│  │              Context Providers                       │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  + SocketContext                                     │  │
│  │    - socket: Socket                                  │  │
│  │    - isConnected: boolean                            │  │
│  │    + connect(): void                                 │  │
│  │    + disconnect(): void                              │  │
│  │    + emit(event: string, data: any): void           │  │
│  │    + on(event: string, callback: Function): void    │  │
│  │                                                      │  │
│  │  + SidebarContext                                    │  │
│  │    - isOpen: boolean                                 │  │
│  │    + toggle(): void                                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                       │                                     │
│  ┌────────────────────▼─────────────────────────────────┐  │
│  │              Services                                │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  + APIClient                                         │  │
│  │    - baseURL: string                                 │  │
│  │    + auth.login(email, password): Promise           │  │
│  │    + auth.register(data): Promise                   │  │
│  │    + conversations.getAll(): Promise                │  │
│  │    + messages.send(data): Promise                   │  │
│  │                                                      │  │
│  │  + SocketService                                     │  │
│  │    - socket: Socket                                  │  │
│  │    + connect(token: string): void                   │  │
│  │    + joinRoom(roomId: string): void                 │  │
│  │    + sendMessage(data: any): void                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### 4.1.4 Key Classes

**SocketContext:**
- **Purpose**: Manages Socket.io connection and provides real-time communication functionality
- **Key Methods**:
  - `connect()`: Establishes Socket.io connection to backend server
  - `disconnect()`: Closes Socket.io connection
  - `emit(event, data)`: Emits events to backend server
  - `on(event, callback)`: Listens to events from backend server
- **Usage**: Used by components to send and receive real-time updates

**APIClient:**
- **Purpose**: Provides unified interface for making HTTP API calls to backend
- **Key Modules**:
  - `auth`: Authentication APIs (login, register, logout, getCurrentUser)
  - `conversations`: Conversation management APIs (getAll, getById, createDirect, createGroup)
  - `messages`: Message APIs (send, edit, addReaction, markAsRead)
  - `users`: User APIs (search, getProfile)
  - `friends`: Friend request APIs (sendRequest, acceptRequest, getFriends)
- **Usage**: Used by components to fetch data and perform operations via REST API

**MessagesPanel:**
- **Purpose**: Left sidebar component displaying list of conversations
- **Key Features**: Search conversations, display conversation list with last message, unread count, online status
- **Communication**: Uses APIClient to fetch conversations, uses SocketContext for real-time updates

**ChatPanel:**
- **Purpose**: Center panel component displaying messages and input field
- **Key Features**: Display messages, send new messages, show typing indicators, display read receipts
- **Communication**: Uses APIClient to send messages, uses SocketContext for real-time message updates

**DirectoryPanel:**
- **Purpose**: Right panel component displaying group members and files
- **Key Features**: List group members with roles, manage member roles (admin only), display files, leave group option
- **Communication**: Uses APIClient to fetch members and files, manage roles

---

### 4.2 Component: Backend

[This section provides details for the component named "Backend". You need to include class diagrams for this component and explain key classes.]

#### 4.2.1 Overview

The Backend component is an Express.js application that provides REST API endpoints and Socket.io real-time server. It handles business logic, authentication, authorization, and database operations.

**Technology Stack:**
- Node.js 18+
- Express.js 4.18.2
- Socket.io 4.6.1
- Mongoose 8.19.2 (MongoDB ODM)
- JWT 9.0.2 (Authentication)
- bcryptjs 2.4.3 (Password hashing)
- Express Validator 7.0.1 (Input validation)

**Communication Methods:**
- **From Frontend (HTTP)**: HTTP/HTTPS REST API via Express.js routes
- **From Frontend (WebSocket)**: WebSocket via Socket.io server
- **To Database**: TCP/IP via Mongoose ODM
- **To External Services**: HTTPS REST API calls to OpenAI API

#### 4.2.2 Responsibilities and Services

The Backend component provides the following services:

- **Request Processing**: Handles HTTP requests from frontend
- **Authentication**: Validates JWT tokens and authenticates users
- **Authorization**: Checks user permissions and roles for protected operations
- **Business Logic**: Implements application logic and business rules
- **Data Validation**: Validates and sanitizes input data
- **Database Operations**: Performs CRUD operations on database via Mongoose
- **Real-time Events**: Emits Socket.io events for real-time updates
- **File Handling**: Processes file uploads and downloads
- **AI Integration**: Integrates with OpenAI API for conversation summarization

#### 4.2.3 Class Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Backend Component                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │            Express Application (server.js)          │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │  - app: Express                                     │   │
│  │  - httpServer: http.Server                          │   │
│  │  - io: Server (Socket.io)                           │   │
│  │  + listen(port: number): void                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                       │                                     │
│  ┌────────────────────▼─────────────────────────────────┐  │
│  │                 Route Handlers                       │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  + AuthRoutes                                        │  │
│  │    + POST /api/auth/register                         │  │
│  │    + POST /api/auth/login                            │  │
│  │    + POST /api/auth/logout                           │  │
│  │    + GET /api/auth/me                                │  │
│  │                                                      │  │
│  │  + ConversationRoutes                                │  │
│  │    + GET /api/conversations                          │  │
│  │    + POST /api/conversations/direct                  │  │
│  │    + POST /api/conversations/group                   │  │
│  │    + PUT /api/conversations/:id                      │  │
│  │                                                      │  │
│  │  + MessageRoutes                                     │  │
│  │    + GET /api/messages/conversation/:id              │  │
│  │    + POST /api/messages                              │  │
│  │    + PUT /api/messages/:id                           │  │
│  │                                                      │  │
│  │  + UserRoutes                                        │  │
│  │  + FriendRoutes                                      │  │
│  │  + FileRoutes                                        │  │
│  │  + AIRoutes                                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                       │                                     │
│  ┌────────────────────▼─────────────────────────────────┐  │
│  │                 Middleware                           │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  + AuthMiddleware                                    │  │
│  │    + authenticate(req, res, next): void             │  │
│  │    + authenticateSocket(socket, next): void         │  │
│  │                                                      │  │
│  │  + ValidationMiddleware                              │  │
│  │    + validateRequest(): Function                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                       │                                     │
│  ┌────────────────────▼─────────────────────────────────┐  │
│  │              Socket Handler (socket.js)              │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  + setupSocketIO(io: Server): void                  │  │
│  │  + handleConnection(socket: Socket): void           │  │
│  │  + handleJoinConversation(socket: Socket): void     │  │
│  │  + handleMessage(socket: Socket): void              │  │
│  │  + handleTyping(socket: Socket): void               │  │
│  └──────────────────────────────────────────────────────┘  │
│                       │                                     │
│  ┌────────────────────▼─────────────────────────────────┐  │
│  │              Models (Mongoose)                       │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  + User                                              │  │
│  │    - email: string                                   │  │
│  │    - username: string                                │  │
│  │    - password_hash: string                           │  │
│  │    - is_online: boolean                              │  │
│  │    + save(): Promise                                 │  │
│  │    + findOne(query): Promise                         │  │
│  │                                                      │  │
│  │  + Conversation                                      │  │
│  │    - type: string                                    │  │
│  │    - participants: Array                             │  │
│  │    + save(): Promise                                 │  │
│  │    + find(query): Promise                            │  │
│  │                                                      │  │
│  │  + Message                                           │  │
│  │    - conversation_id: ObjectId                       │  │
│  │    - sender_id: ObjectId                             │  │
│  │    - content: string                                 │  │
│  │    + save(): Promise                                 │  │
│  │    + find(query): Promise                            │  │
│  │                                                      │  │
│  │  + Friendship                                        │  │
│  │  + File                                              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### 4.2.4 Key Classes

**Express Application (server.js):**
- **Purpose**: Main entry point that initializes Express server and Socket.io
- **Key Responsibilities**:
  - Initialize Express application
  - Setup CORS middleware
  - Mount API routes
  - Initialize Socket.io server
  - Start HTTP server on port 5001
- **Usage**: Entry point for the entire backend application

**AuthRoutes:**
- **Purpose**: Handles authentication-related HTTP requests
- **Key Methods**:
  - `POST /api/auth/register`: Registers new user, hashes password, creates user in database
  - `POST /api/auth/login`: Validates credentials, generates JWT token
  - `POST /api/auth/logout`: Logs out user, invalidates session
  - `GET /api/auth/me`: Returns current authenticated user information
- **Usage**: Used by frontend for user authentication operations

**ConversationRoutes:**
- **Purpose**: Handles conversation-related HTTP requests
- **Key Methods**:
  - `GET /api/conversations`: Retrieves all conversations for authenticated user
  - `POST /api/conversations/direct`: Creates direct conversation between users
  - `POST /api/conversations/group`: Creates group conversation with multiple participants
  - `PUT /api/conversations/:id`: Updates conversation details (name, description)
  - `PUT /api/conversations/:id/participants/:userId/role`: Changes participant role
  - `DELETE /api/conversations/:id/participants/:userId`: Removes participant
- **Usage**: Used by frontend for conversation management

**MessageRoutes:**
- **Purpose**: Handles message-related HTTP requests
- **Key Methods**:
  - `GET /api/messages/conversation/:id`: Retrieves messages for a conversation
  - `POST /api/messages`: Creates new message, saves to database, emits Socket.io event
  - `PUT /api/messages/:id`: Edits existing message
  - `POST /api/messages/:id/read`: Marks message as read
  - `POST /api/messages/:id/reaction`: Adds reaction to message
- **Usage**: Used by frontend for messaging operations

**AuthMiddleware:**
- **Purpose**: Validates JWT tokens for protected routes and Socket connections
- **Key Methods**:
  - `authenticate(req, res, next)`: Middleware for HTTP routes, validates JWT token from Authorization header
  - `authenticateSocket(socket, next)`: Middleware for Socket.io connections, validates JWT token from handshake
- **Usage**: Applied to all protected routes and Socket connections to ensure user authentication

**Socket Handler (socket.js):**
- **Purpose**: Handles real-time Socket.io events
- **Key Events**:
  - `join_conversation`: User joins conversation room
  - `leave_conversation`: User leaves conversation room
  - `typing`: User typing indicator
  - `message_read`: Message read receipt
- **Usage**: Manages real-time communication between clients

**Mongoose Models (User, Conversation, Message, etc.):**
- **Purpose**: Define database schemas and provide data access layer
- **Key Features**:
  - Schema validation
  - Relationship definitions (references)
  - Index definitions for query optimization
  - Middleware hooks (pre/post save)
- **Usage**: Used by route handlers to perform database operations

---

### 4.3 Component: Database

[This section provides details for the component named "Database". You need to include class diagrams for this component and explain key classes.]

#### 4.3.1 Overview

The Database component is a MongoDB NoSQL database that stores all application data. It uses Mongoose ODM for schema definition and data access from the backend.

**Technology:**
- MongoDB 7.0 (NoSQL Document Database)
- Mongoose 8.19.2 (ODM - Object Document Mapper)

**Communication Methods:**
- **From Backend**: TCP/IP connection via Mongoose ODM
- **Port**: 27017 (default MongoDB port)
- **Connection**: MongoDB connection string (local: `mongodb://localhost:27017/quickping` or MongoDB Atlas via Internet)

#### 4.3.2 Responsibilities and Services

The Database component provides the following services:

- **Data Persistence**: Stores all application data permanently
- **Data Integrity**: Ensures data consistency and validation through schemas
- **Query Processing**: Processes database queries efficiently using indexes
- **Relationship Management**: Maintains relationships between entities through references
- **Indexing**: Provides fast data retrieval via indexes on frequently queried fields

#### 4.3.3 Collections (Collections in MongoDB are equivalent to tables in relational databases)

**users:**
- Stores user accounts, profiles, and preferences
- **Key Fields**: email (unique), username (unique), password_hash, avatar_url, is_online, last_seen, role
- **Indexes**: email (unique), username (unique)

**conversations:**
- Stores direct and group conversations
- **Key Fields**: type (direct/group), name, description, participants (array with user_id and role), created_by
- **Indexes**: participants.user_id

**messages:**
- Stores chat messages
- **Key Fields**: conversation_id (ref: Conversation), sender_id (ref: User), content, type, read_by (array), reactions (array)
- **Indexes**: conversation_id, created_at (compound), sender_id

**friendships:**
- Stores friend relationships and requests
- **Key Fields**: user_id (ref: User), friend_id (ref: User), status (pending/accepted/rejected)
- **Indexes**: user_id, friend_id

**files:**
- Stores file metadata
- **Key Fields**: filename, mime_type, size, file_path, uploaded_by (ref: User)
- **Relations**: Linked to messages and conversations

**notifications:**
- Stores user notifications
- **Key Fields**: user_id (ref: User), type, content, is_read, created_at

**schools:**
- Stores educational institutions data
- **Key Fields**: name, email_domain, address

**votes:**
- Stores group voting data
- **Key Fields**: conversation_id (ref: Conversation), created_by (ref: User), question, options, votes (array)

**user_sessions:**
- Stores active user sessions
- **Key Fields**: user_id (ref: User), token, expires_at, created_at

#### 4.3.4 Entity Relationships Diagram

```
Users (1) ──────< Friendships >────── (1) Users
  │
  │
  │< Participants >────────── Conversations
  │                              │
  │                              │
  │< Sender >──────── Messages ───┴──> Conversation
  │
  │< Uploader >────── Files
```

#### 4.3.5 Class Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                   Database Component                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │            MongoDB Database                         │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │  - host: string                                     │   │
│  │  - port: number (27017)                             │   │
│  │  - database: string (quickping)                     │   │
│  │  + connect(uri: string): Promise                    │   │
│  │  + query(collection: string): Query                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                       │                                     │
│  ┌────────────────────▼─────────────────────────────────┐  │
│  │              Collections                             │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  + users                                             │  │
│  │    - _id: ObjectId                                   │  │
│  │    - email: string (unique, indexed)                 │  │
│  │    - username: string (unique, indexed)              │  │
│  │    - password_hash: string                           │  │
│  │    - avatar_url: string                              │  │
│  │    - is_online: boolean                              │  │
│  │    - last_seen: Date                                 │  │
│  │    - role: string                                    │  │
│  │    - created_at: Date                                │  │
│  │                                                      │  │
│  │  + conversations                                     │  │
│  │    - _id: ObjectId                                   │  │
│  │    - type: string (direct/group)                     │  │
│  │    - name: string                                    │  │
│  │    - participants: Array<{user_id, role}>            │  │
│  │    - created_by: ObjectId (ref: users)               │  │
│  │    - last_message: ObjectId (ref: messages)          │  │
│  │    - created_at: Date                                │  │
│  │                                                      │  │
│  │  + messages                                          │  │
│  │    - _id: ObjectId                                   │  │
│  │    - conversation_id: ObjectId (ref: conversations)  │  │
│  │    - sender_id: ObjectId (ref: users)                │  │
│  │    - content: string                                 │  │
│  │    - type: string                                    │  │
│  │    - read_by: Array<{user_id, read_at}>              │  │
│  │    - reactions: Array<{emoji, user_id}>              │  │
│  │    - created_at: Date (indexed)                      │  │
│  │                                                      │  │
│  │  + friendships                                       │  │
│  │    - _id: ObjectId                                   │  │
│  │    - user_id: ObjectId (ref: users)                  │  │
│  │    - friend_id: ObjectId (ref: users)                │  │
│  │    - status: string                                  │  │
│  │                                                      │  │
│  │  + files                                             │  │
│  │  + notifications                                     │  │
│  │  + schools                                           │  │
│  │  + votes                                             │  │
│  │  + user_sessions                                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### 4.3.6 Key Classes/Collections

**users Collection:**
- **Purpose**: Stores all user account information and profiles
- **Key Fields**:
  - `email`: Unique email address (indexed)
  - `username`: Unique username (indexed)
  - `password_hash`: Hashed password using bcrypt
  - `is_online`: Boolean indicating online status
  - `last_seen`: Timestamp of last activity
  - `role`: User role (admin/moderator/member)
- **Relationships**: Referenced by conversations (participants, created_by), messages (sender_id), friendships (user_id, friend_id)

**conversations Collection:**
- **Purpose**: Stores direct and group conversation data
- **Key Fields**:
  - `type`: Conversation type (direct or group)
  - `name`: Group name (for group conversations)
  - `participants`: Array of participant objects with user_id and role
  - `created_by`: Reference to user who created the conversation
  - `last_message`: Reference to the most recent message
- **Relationships**: Referenced by messages (conversation_id), participants reference users collection

**messages Collection:**
- **Purpose**: Stores all chat messages
- **Key Fields**:
  - `conversation_id`: Reference to conversation this message belongs to
  - `sender_id`: Reference to user who sent the message
  - `content`: Message text content
  - `type`: Message type (text/file/image/video)
  - `read_by`: Array of objects tracking which users have read the message
  - `reactions`: Array of emoji reactions from users
- **Relationships**: References conversations and users collections

**friendships Collection:**
- **Purpose**: Stores friend relationships and friend requests
- **Key Fields**:
  - `user_id`: Reference to first user
  - `friend_id`: Reference to second user
  - `status`: Relationship status (pending/accepted/rejected)
- **Relationships**: References users collection twice (user_id and friend_id)

---

## 5. Deployment

[Leave this section blank for PA3 if you are writing this document for PA4.

In this section, describe how the system is deployed by mapping the components in Section 4 to machines running them. For example, your mobile app is running on a mobile device (Android, iOS, etc), your server runs all components on the server side including the database]

*This section will be completed in PA4.*

---

## 6. Implementation View

[Leave this section blank for PA3 if you are writing this document for PA4.

In this section, provide folder structures for your code for all components described in Section 4. ]

*This section will be completed in PA4.*

---

**Document Prepared By:** Nhóm 4 - QuickPing Development Team  
**Last Updated:** 2024
