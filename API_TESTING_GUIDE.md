# RESTful API Testing Guide
## QuickPing API Testing Documentation

Hướng dẫn chi tiết các cách test RESTful API của QuickPing.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Method 1: Using Test Script (Recommended)](#method-1-using-test-script-recommended)
3. [Method 2: Using cURL](#method-2-using-curl)
4. [Method 3: Using Postman](#method-3-using-postman)
5. [Method 4: Using Browser DevTools](#method-4-using-browser-devtools)
6. [Method 5: Using HTTPie](#method-5-using-httpie)
7. [Complete API Endpoints List](#complete-api-endpoints-list)

---

## Prerequisites

### 1. Ensure Backend is Running

```bash
# Using Docker Compose
docker-compose -f docker-compose.dev.yml up -d

# OR Manual start
cd backend
npm run dev
```

### 2. Check Backend Status

```bash
# Health check
curl http://localhost:5001/health

# Should return:
# {"status":"ok","message":"QuickPing API is running"}
```

### 3. Base URLs

- **API Base URL:** `http://localhost:5001/api`
- **Backend URL:** `http://localhost:5001`

---

## Method 1: Using Test Script (Recommended)

### Setup

Script test đã có sẵn tại `backend/scripts/test-api.js`

### Usage

```bash
cd backend

# Test tất cả endpoints
npm run test-api

# Hoặc chạy trực tiếp
node scripts/test-api.js all

# Test chỉ auth endpoints
node scripts/test-api.js auth

# Test chỉ messages endpoints
node scripts/test-api.js messages

# Test chỉ conversations endpoints
node scripts/test-api.js conversations

# Test chỉ friends endpoints
node scripts/test-api.js friends

# Health check only
node scripts/test-api.js health
```

### Test Suites Available

- `all` - Test tất cả endpoints
- `health` - Health check
- `auth` - Authentication (register, login, logout)
- `users` - User search
- `conversations` - Conversation management
- `messages` - Message operations
- `friends` - Friend requests

---

## Method 2: Using cURL

### 1. Authentication Endpoints

#### Register User
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123",
    "mssv": "SV001"
  }'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "email": "test@example.com",
    "username": "testuser"
  }
}
```

**Save token for later use:**
```bash
export TOKEN="your_jwt_token_here"
```

#### Login
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### Get Current User (Me)
```bash
curl -X GET http://localhost:5001/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

#### Logout
```bash
curl -X POST http://localhost:5001/api/auth/logout \
  -H "Authorization: Bearer $TOKEN"
```

---

### 2. User Endpoints

#### Search Users
```bash
curl -X GET "http://localhost:5001/api/users/search?query=test" \
  -H "Authorization: Bearer $TOKEN"
```

#### Get User Profile
```bash
curl -X GET http://localhost:5001/api/users/USER_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

### 3. Conversation Endpoints

#### Get All Conversations
```bash
curl -X GET http://localhost:5001/api/conversations \
  -H "Authorization: Bearer $TOKEN"
```

#### Create Direct Conversation
```bash
curl -X POST http://localhost:5001/api/conversations/direct \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "OTHER_USER_ID"
  }'
```

#### Create Group Conversation
```bash
curl -X POST http://localhost:5001/api/conversations/group \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Study Group",
    "description": "Group for studying",
    "participants": ["USER_ID_1", "USER_ID_2"]
  }'
```

#### Get Conversation by ID
```bash
curl -X GET http://localhost:5001/api/conversations/CONVERSATION_ID \
  -H "Authorization: Bearer $TOKEN"
```

#### Update Conversation (Group)
```bash
curl -X PUT http://localhost:5001/api/conversations/CONVERSATION_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Group Name",
    "description": "Updated description"
  }'
```

#### Change Participant Role
```bash
curl -X PUT http://localhost:5001/api/conversations/CONVERSATION_ID/participants/USER_ID/role \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "moderator"
  }'
```

#### Remove Participant (or Leave Group)
```bash
curl -X DELETE http://localhost:5001/api/conversations/CONVERSATION_ID/participants/USER_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

### 4. Message Endpoints

#### Get Messages
```bash
curl -X GET "http://localhost:5001/api/messages/conversation/CONVERSATION_ID?limit=50" \
  -H "Authorization: Bearer $TOKEN"
```

#### Send Message
```bash
curl -X POST http://localhost:5001/api/messages \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "conversation_id": "CONVERSATION_ID",
    "content": "Hello, this is a test message!",
    "type": "text"
  }'
```

#### Edit Message
```bash
curl -X PUT http://localhost:5001/api/messages/MESSAGE_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Updated message content"
  }'
```

#### Mark Message as Read
```bash
curl -X POST http://localhost:5001/api/messages/MESSAGE_ID/read \
  -H "Authorization: Bearer $TOKEN"
```

#### Add Reaction
```bash
curl -X POST http://localhost:5001/api/messages/MESSAGE_ID/reaction \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "emoji": "👍"
  }'
```

#### Remove Reaction
```bash
curl -X DELETE http://localhost:5001/api/messages/MESSAGE_ID/reaction/👍 \
  -H "Authorization: Bearer $TOKEN"
```

---

### 5. Friend Endpoints

#### Get Friends List
```bash
curl -X GET http://localhost:5001/api/friends \
  -H "Authorization: Bearer $TOKEN"
```

#### Send Friend Request
```bash
curl -X POST http://localhost:5001/api/friends/request \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "friend_id": "USER_ID"
  }'
```

#### Get Friend Requests
```bash
curl -X GET http://localhost:5001/api/friends/requests \
  -H "Authorization: Bearer $TOKEN"
```

#### Accept Friend Request
```bash
curl -X PUT http://localhost:5001/api/friends/request/FRIENDSHIP_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "accepted"
  }'
```

#### Reject Friend Request
```bash
curl -X PUT http://localhost:5001/api/friends/request/FRIENDSHIP_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "rejected"
  }'
```

---

### 6. File Endpoints

#### Upload File
```bash
curl -X POST http://localhost:5001/api/files/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/your/file.pdf"
```

#### Download File
```bash
curl -X GET http://localhost:5001/api/files/FILE_ID \
  -H "Authorization: Bearer $TOKEN" \
  --output downloaded-file.pdf
```

---

### 7. AI Endpoints

#### Summarize Conversation
```bash
curl -X POST http://localhost:5001/api/ai/summarize \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "conversation_id": "CONVERSATION_ID",
    "type": "conversation"
  }'
```

#### Summarize File
```bash
curl -X POST http://localhost:5001/api/ai/summarize-file \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "file_id": "FILE_ID"
  }'
```

---

## Method 3: Using Postman

### 1. Import Postman Collection

Tạo Postman Collection với các requests sau:

### 2. Setup Environment Variables

Tạo Postman Environment với:
- `base_url`: `http://localhost:5001/api`
- `token`: (will be set after login)

### 3. Setup Pre-request Script (for auth)

Add to Collection Pre-request Script:
```javascript
// Auto-add Authorization header if token exists
if (pm.environment.get("token")) {
    pm.request.headers.add({
        key: "Authorization",
        value: "Bearer " + pm.environment.get("token")
    });
}
```

### 4. Sample Requests

#### Register → Save Token

**Request:**
- Method: `POST`
- URL: `{{base_url}}/auth/register`
- Body (raw JSON):
```json
{
  "email": "test@example.com",
  "username": "testuser",
  "password": "password123"
}
```

**Tests Script (to save token):**
```javascript
if (pm.response.code === 201 || pm.response.code === 200) {
    const jsonData = pm.response.json();
    if (jsonData.token) {
        pm.environment.set("token", jsonData.token);
        pm.environment.set("userId", jsonData.user._id);
    }
}
```

#### Create Group Chat

**Request:**
- Method: `POST`
- URL: `{{base_url}}/conversations/group`
- Headers: `Authorization: Bearer {{token}}`
- Body:
```json
{
  "name": "My Study Group",
  "description": "Group description",
  "participants": ["{{userId}}"]
}
```

---

## Method 4: Using Browser DevTools

### 1. Open Browser Console

1. Mở ứng dụng frontend: `http://localhost:3000`
2. Mở DevTools (F12)
3. Vào tab "Console" hoặc "Network"

### 2. Test API from Console

```javascript
// Login and get token
const loginResponse = await fetch('http://localhost:5001/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password123'
  })
});

const loginData = await loginResponse.json();
const token = loginData.token;
console.log('Token:', token);

// Use token for authenticated requests
const conversationsResponse = await fetch('http://localhost:5001/api/conversations', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const conversations = await conversationsResponse.json();
console.log('Conversations:', conversations);
```

### 3. Monitor Network Requests

1. Mở DevTools → Network tab
2. Filter: XHR/Fetch
3. Perform actions in UI
4. Inspect requests/responses

---

## Method 5: Using HTTPie

HTTPie là tool đẹp hơn cURL, syntax đơn giản hơn.

### Install HTTPie

```bash
# macOS
brew install httpie

# Linux
sudo apt install httpie
```

### Examples

#### Register
```bash
http POST localhost:5001/api/auth/register \
  email=test@example.com \
  username=testuser \
  password=password123
```

#### Login (và save token)
```bash
RESPONSE=$(http POST localhost:5001/api/auth/login \
  email=test@example.com \
  password=password123)

TOKEN=$(echo $RESPONSE | jq -r '.token')
export TOKEN
```

#### Get Conversations (with token)
```bash
http GET localhost:5001/api/conversations \
  Authorization:"Bearer $TOKEN"
```

#### Send Message
```bash
http POST localhost:5001/api/messages \
  Authorization:"Bearer $TOKEN" \
  conversation_id=CONV_ID \
  content="Hello from HTTPie!" \
  type=text
```

---

## Complete API Endpoints List

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| POST | `/auth/logout` | Logout user | Yes |
| GET | `/auth/me` | Get current user | Yes |

### Users (`/api/users`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users/search?query=...` | Search users | Yes |
| GET | `/users/:id` | Get user profile | Yes |
| PUT | `/users/profile` | Update profile | Yes |
| PUT | `/users/preferences` | Update preferences | Yes |

### Conversations (`/api/conversations`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/conversations` | Get all conversations | Yes |
| GET | `/conversations/:id` | Get conversation by ID | Yes |
| POST | `/conversations/direct` | Create direct chat | Yes |
| POST | `/conversations/group` | Create group chat | Yes |
| PUT | `/conversations/:id` | Update conversation | Yes (Admin/Mod) |
| PUT | `/conversations/:id/participants/:userId/role` | Change role | Yes (Admin) |
| DELETE | `/conversations/:id/participants/:userId` | Remove participant | Yes |
| POST | `/conversations/:id/pin` | Pin message | Yes |
| DELETE | `/conversations/:id/pin/:messageId` | Unpin message | Yes |

### Messages (`/api/messages`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/messages/conversation/:id` | Get messages | Yes |
| POST | `/messages` | Send message | Yes |
| PUT | `/messages/:id` | Edit message | Yes (Sender only) |
| POST | `/messages/:id/read` | Mark as read | Yes |
| POST | `/messages/:id/reaction` | Add reaction | Yes |
| DELETE | `/messages/:id/reaction/:emoji` | Remove reaction | Yes |

### Friends (`/api/friends`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/friends` | Get friends list | Yes |
| GET | `/friends/requests` | Get friend requests | Yes |
| POST | `/friends/request` | Send friend request | Yes |
| PUT | `/friends/request/:id` | Accept/reject request | Yes |

### Files (`/api/files`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/files/upload` | Upload file | Yes |
| GET | `/files/:id` | Download file | Yes |

### AI (`/api/ai`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/ai/summarize` | Summarize conversation | Yes |
| POST | `/ai/summarize-file` | Summarize file | Yes |

---

## Quick Test Workflow

### Step-by-step Testing

1. **Start Backend**
   ```bash
   docker-compose -f docker-compose.dev.yml up -d backend
   # OR
   cd backend && npm run dev
   ```

2. **Health Check**
   ```bash
   curl http://localhost:5001/health
   ```

3. **Register User**
   ```bash
   curl -X POST http://localhost:5001/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@test.com","username":"testuser","password":"123456"}'
   ```

4. **Login & Save Token**
   ```bash
   RESPONSE=$(curl -X POST http://localhost:5001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@test.com","password":"123456"}')
   
   TOKEN=$(echo $RESPONSE | jq -r '.token')
   export TOKEN
   ```

5. **Test Authenticated Endpoint**
   ```bash
   curl http://localhost:5001/api/conversations \
     -H "Authorization: Bearer $TOKEN"
   ```

---

## Troubleshooting

### Common Issues

1. **401 Unauthorized**
   - Check token is valid
   - Ensure token is in Authorization header: `Bearer TOKEN`
   - Token may have expired (7 days default)

2. **403 Forbidden**
   - User doesn't have permission
   - Check user role (for group operations)

3. **404 Not Found**
   - Check endpoint URL is correct
   - Check resource ID exists

4. **500 Server Error**
   - Check backend logs
   - Check database connection
   - Check environment variables

### Debug Tips

```bash
# View backend logs
docker-compose -f docker-compose.dev.yml logs -f backend

# Check if backend is running
curl http://localhost:5001/health

# Test database connection
docker exec -it quickping-mongodb-dev mongosh
```

---

## Example: Complete Test Session

```bash
# 1. Health check
curl http://localhost:5001/health

# 2. Register user 1
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user1@test.com","username":"user1","password":"123456"}'

# Save token
TOKEN1="your_token_here"

# 3. Register user 2
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user2@test.com","username":"user2","password":"123456"}'

# Save user 2 ID
USER2_ID="user2_id_here"

# 4. Create direct conversation
curl -X POST http://localhost:5001/api/conversations/direct \
  -H "Authorization: Bearer $TOKEN1" \
  -H "Content-Type: application/json" \
  -d "{\"userId\":\"$USER2_ID\"}"

# Save conversation ID
CONV_ID="conversation_id_here"

# 5. Send message
curl -X POST http://localhost:5001/api/messages \
  -H "Authorization: Bearer $TOKEN1" \
  -H "Content-Type: application/json" \
  -d "{\"conversation_id\":\"$CONV_ID\",\"content\":\"Hello!\",\"type\":\"text\"}"

# 6. Get messages
curl -X GET http://localhost:5001/api/messages/conversation/$CONV_ID \
  -H "Authorization: Bearer $TOKEN1"
```

---

**Happy Testing! 🚀**

