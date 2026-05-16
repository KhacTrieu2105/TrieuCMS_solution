# TrieuCMS Solution

## Giới thiệu
Đây là project CMS (Content Management System) được xây dựng bằng ASP.NET Core MVC.

Project hỗ trợ quản lý:

- Bài viết (Post)
- Danh mục (Category)
- Người dùng (User)
- Sản phẩm (Product)
- Đơn hàng (Order)

---

# Công nghệ sử dụng

- ASP.NET Core MVC
- C#
- Entity Framework Core
- Bootstrap 5
- SQL Server
- Git & GitHub

---

# Cấu trúc project

```bash
TrieuCMS_solution
│
├── CMS.Backend
│   ├── Controllers
│   ├── Models
│   ├── Views
│   └── wwwroot
│
├── CMS.Data
│   └── Entities
│
└── cms.frontend
```

---

# Chức năng đã hoàn thành

## Buổi 1

### Post Management
- Hiển thị danh sách bài viết
- Xem chi tiết bài viết
- Giao diện card Bootstrap
- Hiển thị ảnh thumbnail

### User Management
- Hiển thị danh sách thành viên
- Phân quyền:
  - Administrator
  - Editor
  - Author
  - Member

### Category
- Tạo CategoryController
- Hiển thị danh sách danh mục

---

# Giao diện

## Danh sách bài viết
- Hiển thị dạng card
- Responsive Bootstrap
- Có nút:
  - Xem chi tiết
  - Sửa
  - Xóa

## Quản lý User
- Hiển thị table quản lý thành viên
- Badge phân quyền màu sắc

---

# Cách chạy project

## Clone project

```bash
git clone https://github.com/KhacTrieu2105/TrieuCMS_solution.git
```

---

## Mở project

Mở file:

```bash
TrieuCMS_solution.sln
```

bằng Visual Studio 2022.

---

## Chạy project

Nhấn:

```bash
Ctrl + F5
```

hoặc:

```bash
dotnet run
```

---

# Git Commit

```bash
git add .
git commit -m "Hoan thanh buoi 1"
git push
```

---

# Tác giả

- Họ tên: Triệu Nguyễn
- GitHub: KhacTrieu2105
