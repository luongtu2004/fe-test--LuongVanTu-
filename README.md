# TaskBoard - Frontend Test

Repo nộp bài test vị trí Frontend Developer. Đây là ứng dụng quản lý công việc nội bộ (TaskBoard) theo yêu cầu của đề bài.

## Tech stack
Dự án dùng đúng các thư viện theo yêu cầu:
- React 18 + TypeScript 5 (Strict mode)
- Ant Design 5.x (UI Component)
- Redux Toolkit 2.x (Quản lý state, filter, dùng createSlice & createSelector)
- Tailwind CSS 3.x (Layout, margin, responsive)
- Vite

## Cấu trúc thư mục chính
- `/src/components`: Các component dùng chung cho toàn app (như MainLayout).
- `/src/features/tasks`: Logic tính năng chính (chứa màn Dashboard, TaskList và file Redux slice `tasksSlice.ts`).
- `/src/store`: Setup Redux store.
- `/src/types`: Định nghĩa type/interface cho TypeScript (như `Task`).
- `/src/utils`: Các file tiện ích và mock data.

## Các chức năng đã làm
- **Dashboard**: Hiện thống kê (Todo, In Progress, Done), thanh progress biểu diễn tỷ lệ phần trăm và list 5 task mới tạo.
- **Task List**: 
  - Hiển thị bảng danh sách công việc (có phân trang).
  - Thêm, sửa, xóa task.
  - Cập nhật nhanh trạng thái (Status) trực tiếp ngay trên bảng.
  - Xóa nhiều task cùng lúc (chọn qua checkbox trên table).
  - Tìm kiếm theo tên task (có debounce 300ms).
  - Bộ lọc nhiều điều kiện: Lọc theo Status (chọn nhiều), Priority, Khoảng thời gian (Due Date). Trạng thái bộ lọc có update lên URL.
  - Nút Reset để xóa nhanh các bộ lọc.

*(Lưu ý: App không dùng backend, data là 20 task mock được khởi tạo sẵn trong Redux store. F5 trang sẽ reset lại data ban đầu).*

## Cách chạy project trên máy

1. Clone repo này về máy:
```bash
git clone <link-repo>
cd fe-test-taskboard
```

2. Cài đặt các package:
```bash
npm install
```

3. Chạy project:
```bash
npm run dev
```
Sau đó mở trình duyệt và truy cập: `http://localhost:5173`
