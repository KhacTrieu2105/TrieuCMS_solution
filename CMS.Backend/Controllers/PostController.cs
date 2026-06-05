using Microsoft.AspNetCore.Authorization;
using CMS.Backend;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // Bắt buộc phải có để dùng lệnh .Include()
using System;
using System.Linq;

namespace CMS.Backend.Controllers
{
   
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;

        public PostController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 2.1 & 2.2: Lấy toàn bộ hoặc lọc bài viết theo danh mục (Sắp xếp mới nhất)
        public IActionResult Index(int? id)
        {
            var query = _context.Posts.Include(p => p.Category).AsQueryable();

            if (id != null)
            {
                query = query.Where(p => p.CategoryId == id);
            }

            var posts = query.OrderByDescending(p => p.CreatedDate).ToList();
            return View(posts);
        }

        // 3.1: Tìm kiếm và hiển thị chi tiết bài viết (Details)
        // GET: Post/Details/5
        public IActionResult Details(int id)
        {
            // Sử dụng .Include(p => p.Category) để ép EF Core kết nối bảng Posts với bảng Categories
            var post = _context.Posts
                               .Include(p => p.Category)
                               .FirstOrDefault(p => p.Id == id);

            // Kiểm tra nếu không tìm thấy bài viết (Tránh lỗi hệ thống)
            if (post == null)
            {
                return NotFound(); // Trả về trang lỗi 404 chuẩn
            }

            return View(post);
        }
        [Authorize]
        // 4.1. Hàm [GET]: Hiển thị Form trống cho người dùng nhập
        [HttpGet]
        public IActionResult Create()
        {
            ViewBag.Categories = _context.Categories.ToList();
            return View();
        }

        // 4.2. Hàm [POST]: Nhận dữ liệu từ Form gửi lên và lưu xuống Database
        [HttpPost]
        public IActionResult Create(Post model)
        {
            // MẸO SỬA LỖI: Loại bỏ xác thực thuộc tính liên kết Category để không bị lỗi ModelState.IsValid
            ModelState.Remove("Category");

            if (ModelState.IsValid)
            {
                model.CreatedDate = DateTime.Now;

                _context.Posts.Add(model); // Bước 1: Lưu bộ nhớ tạm
                _context.SaveChanges();    // Bước 2: Chốt đơn xuống SQL thật
                return RedirectToAction("Index");
            }

            ViewBag.Categories = _context.Categories.ToList();
            return View(model);
        }

        // =================================================================
        // 5. CHỨC NĂNG SỬA BÀI VIẾT (EDIT POST)

        // 5.1. Hàm [GET]: Lấy dữ liệu bài viết cũ và đổ lên Form
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var post = _context.Posts.FirstOrDefault(p => p.Id == id);

            if (post == null)
            {
                return NotFound();
            }

            // Load lại danh sách danh mục để đổ vào ô Dropdown chọn Chuyên mục
            ViewBag.Categories = _context.Categories.ToList();
            return View(post);
        }

        // 5.2. Hàm [POST]: Đón nhận dữ liệu đã sửa đổi từ Form gửi lên để cập nhật
        [HttpPost]
        public IActionResult Edit(Post model)
        {
            // MẸO SỬA LỖI: Loại bỏ xác thực thuộc tính liên kết để nút bấm hoạt động mượt mà
            ModelState.Remove("Category");

            if (ModelState.IsValid)
            {
                // Mẹo giữ lại hoặc cập nhật thời gian sửa bài (Tùy chọn)
                model.CreatedDate = DateTime.Now;

                _context.Posts.Update(model); // Bước 1: Cập nhật trạng thái bộ nhớ tạm
                _context.SaveChanges();       // Bước 2: Lưu thay đổi vĩnh viễn vào SQL Server
                return RedirectToAction("Index");
            }

            ViewBag.Categories = _context.Categories.ToList();
            return View(model);
        }

        // =================================================================
        // 6. CHỨC NĂNG XÓA BÀI VIẾT (DELETE POST)
        public IActionResult Delete(int id)
        {
            // Bước 1: Tìm bài viết cần xóa bằng ID
            var post = _context.Posts.FirstOrDefault(p => p.Id == id);

            if (post == null)
            {
                return NotFound();
            }

            // Bước 2: Đánh dấu xóa ở bộ nhớ tạm
            _context.Posts.Remove(post);

            // Bước 3: Đồng bộ thực thi lệnh xóa xuống Database SQL Server
            _context.SaveChanges();

            return RedirectToAction("Index");
        }
        // GET: Post/Details/5

    }
}