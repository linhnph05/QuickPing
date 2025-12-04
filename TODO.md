# QuickPing - Danh Sách Chức Năng

## ✅ Các Chức Năng Đã Hoàn Thành (Có Backend + Frontend UI)

### 1. ✅ Đăng ký / Đăng nhập (email/password)
- ✅ Có trang login (`/login`) và register (`/register`)
- ✅ Form đăng ký với email, username, password, mssv
- ✅ Form đăng nhập với email và password
- ✅ JWT authentication
- ✅ Session management
- ❌ **Chưa có: OAuth (Google) - không có backend và UI**

### 2. ❌ Verify email theo từng trường
- ✅ Backend có endpoint verify email
- ✅ Validation email từ danh sách trường (School model)
- ❌ **Chưa có: Chưa gửi email verification thực tế**
- ❌ **Chưa có: UI để verify email**

### 3. ✅ Tin nhắn 1-1 (PM)
- ✅ UI chat panel hoàn chỉnh (`components/chat/chat-panel.tsx`)
- ✅ Gửi/nhận tin nhắn text realtime
- ✅ Hiển thị avatar, username, timestamp
- ✅ Typing indicator
- ✅ Có thể tạo conversation mới qua search users dialog
- ❌ **Chưa có: Nút gửi emoji trong input (chỉ có component EmojiPicker chưa tích hợp)**
- ❌ **Chưa có: Nút gửi file (có icon Paperclip nhưng chưa có chức năng)**

### 4. ❌ Reply-to-message, tạo thread
- ✅ Backend có endpoint reply và thread
- ✅ Message model có trường `reply_to` và `thread_id`
- ❌ **Chưa có: UI để reply message (không có nút reply)**
- ❌ **Chưa có: UI hiển thị thread**

### 5. ✅ Tìm kiếm người dùng theo username, MSSV, email
- ✅ Trang search (`/search`) với UI đầy đủ
- ✅ Search box với filter (người dùng/nhóm/tin nhắn)
- ✅ Backend API search theo username, email, mssv
- ✅ Hiển thị kết quả với avatar, username, email
- ✅ Nút "Nhắn tin" để tạo conversation
- ✅ **Hoàn thành: Search API được gọi với real backend**
- ❌ **Chưa có: Tìm kiếm nhóm (backend chưa có)**

### 6. ✅ Gửi/nhận lời mời kết bạn
- ✅ Trang friends (`/friends`) với UI hoàn chỉnh
- ✅ Tab "Chờ duyệt" hiển thị friend requests
- ✅ Nút Accept/Reject friend request
- ✅ Danh sách bạn bè với nút "Nhắn tin" và "Xóa bạn"
- ✅ Backend API gửi/nhận/chấp nhận friend request
- ✅ Notification model cho friend request
- ❌ **Chưa có: Nút "Thêm bạn bè" từ search (chỉ có "Nhắn tin")**

### 7. ✅ Group chat
- ✅ Trang groups (`/groups`) với UI đầy đủ
- ✅ Nút "Tạo nhóm mới"
- ✅ Trang create group (`/groups/create`)
- ✅ Hiển thị danh sách group với stats (thành viên, admin badge)
- ✅ Nút "Nhắn tin" để mở group chat
- ✅ Backend API tạo group
- ✅ **UI thêm thành viên vào group**
  - ✅ Modal `AddMembersModal` với search và checkbox
  - ✅ Nút "Thêm thành viên" trong groups page (cho admin/moderator)
  - ✅ Nút "Thêm thành viên" trong Directory Panel của chat (cho admin/moderator)
  - ✅ Chỉ hiển thị bạn bè chưa có trong group
  - ✅ Có thể chọn nhiều người cùng lúc
  - ✅ Reload danh sách sau khi thêm thành công

### 8. ✅ Role quản trị group (admin, moderator, member)
- ✅ Backend có phân quyền admin, moderator, member
- ✅ UI hiển thị badge "Admin" trong group list
- ✅ Nút "Settings" chỉ hiển thị cho admin
- ✅ Backend kiểm soát quyền update group
- ❌ **Chưa có: UI quản lý role (promote/demote member)**
- ❌ **Chưa có: UI settings group (chỉ có nút chưa có chức năng)**

### 9. ❌ Tạo vote trong group chat
- ✅ Backend API tạo vote hoàn chỉnh
- ✅ Vote đơn hoặc nhiều lựa chọn
- ✅ Đặt thời gian hết hạn
- ✅ Xem kết quả vote realtime
- ❌ **Chưa có: UI tạo vote trong chat**
- ❌ **Chưa có: UI hiển thị vote trong message**
- ❌ **Chưa có: Nút vote trong message**

### 10. ✅ Hiển thị trạng thái online/offline và seen tin nhắn
- ✅ Chấm xanh online/offline trong chat header
- ✅ Text "Online/Offline" hiển thị rõ ràng
- ✅ Socket.io cập nhật realtime online/offline
- ✅ Backend có read receipts
- ❌ **Chưa có: UI hiển thị "seen" trong message (tích xanh/xám)**
- ❌ **Chưa có: Last seen time hiển thị trong UI**

### 11. ❌ Upload file ảnh/video + tài liệu
- ✅ Backend API upload file hoàn chỉnh
- ✅ Multer upload với giới hạn 100MB
- ✅ Lưu metadata file
- ✅ Icon paperclip trong chat input
- ❌ **Chưa có: Click vào paperclip để chọn file**
- ❌ **Chưa có: UI preview file trước khi gửi**
- ❌ **Chưa có: Progress bar upload**
- ❌ **Chưa có: UI hiển thị file trong message**

### 12. ❌ Reaction emoji cho message
- ✅ Backend API thêm/xóa reaction
- ✅ Component `ReactionViewer` có sẵn
- ✅ Component `EmojiPicker` có sẵn
- ❌ **Chưa có: Tích hợp vào chat message (không có nút react)**
- ❌ **Chưa có: Hiển thị reactions dưới message**
- ❌ **Chưa có: Click emoji để react**

### 13. ❌ Pin message trong conversation
- ✅ Backend API pin/unpin message
- ✅ Conversation model có `pinned_messages`
- ❌ **Chưa có: UI nút pin message**
- ❌ **Chưa có: UI hiển thị pinned messages**
- ❌ **Chưa có: Section pinned messages trong conversation**

### 14. ✅ Tạo / sửa profile (avatar, bio)
- ✅ Trang profile (`/profile`) với UI đầy đủ
- ✅ Form cập nhật username, bio
- ✅ Hiển thị email, MSSV (read-only)
- ✅ Nút "Đổi ảnh đại diện"
- ✅ Nút "Lưu thay đổi"
- ✅ Backend API update profile
- ❌ **Chưa có: Upload avatar thực tế (chỉ có nút)**
- ❌ **Chưa có: UI settings theme (dark mode)**
- ❌ **Chưa có: UI settings font size**

### 15. ❌ AI summarize
- ✅ Backend API summarize conversation/thread
- ✅ Backend API summarize file
- ❌ **Chưa có: Nút "AI Summarize" trong UI**
- ❌ **Chưa có: UI hiển thị summary**
- ❌ **Chưa tích hợp AI thật (chỉ có placeholder)**

### 16. ❌ Sửa tin nhắn
- ✅ Backend API edit message
- ✅ Flag `is_edited` trong message
- ✅ Chỉ người gửi được sửa
- ❌ **Chưa có: Nút "Edit" trên message**
- ❌ **Chưa có: UI chỉnh sửa message**
- ❌ **Chưa có: Hiển thị "(edited)" trên message đã sửa**

---

## 📊 Tổng Kết

### Backend
- **✅ Hoàn thành đầy đủ**: 16/16 chức năng có API

### Frontend
- **✅ Hoàn thành đầy đủ**: 5/16 chức năng
  1. Đăng ký/Đăng nhập
  2. Tin nhắn 1-1 (PM) - cơ bản
  3. Tìm kiếm người dùng
  4. Gửi/nhận lời mời kết bạn
  5. Group chat - cơ bản

- **⚠️ Hoàn thành một phần**: 4/16 chức năng
  1. Tạo/sửa profile (thiếu upload avatar)
  2. Trạng thái online/offline (thiếu UI seen message)
  3. Tin nhắn 1-1 (thiếu gửi file, emoji picker)
  4. Group chat (thiếu quản lý settings)

- **❌ Chưa có UI**: 7/16 chức năng
  1. Verify email
  2. Reply-to-message & Thread
  3. Vote trong group
  4. Upload file
  5. Reaction emoji
  6. Pin message
  7. AI summarize
  8. Sửa tin nhắn
