using CMS.Backend;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class CategoryController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CategoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Hiển thị danh sách chuyên mục
        public IActionResult Index()
        {
            var categories = _context.Categories.ToList();
            return View(categories);
        }

        // 1. [GET] Hiển thị Form trống cho người dùng nhập
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        // 2. [POST] Nhận dữ liệu từ Form gửi về và ghi vào SQL Server
        [HttpPost]
        public IActionResult Create(Category model)
        {
            // MẸO SỬA LỖI: Loại bỏ kiểm tra xác thực danh sách thuộc tính liên kết (nếu có) để tránh lỗi ModelState.IsValid bị false
            ModelState.Remove("Posts");

            if (ModelState.IsValid)
            {
                _context.Categories.Add(model); // Bước 1: Lưu bộ nhớ tạm
                _context.SaveChanges();         // Bước 2: Đồng bộ xuống SQL thật
                return RedirectToAction("Index"); // Quay về trang danh sách chuyên mục
            }
            return View(model);
        }

        // 3. [GET/POST] Xử lý xóa 1 danh mục theo ID
        public IActionResult Delete(int id)
        {
            var category = _context.Categories.FirstOrDefault(c => c.Id == id);

            if (category == null)
            {
                return NotFound();
            }

            _context.Categories.Remove(category);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // 4.1. Hàm [GET]: Tìm danh mục cũ theo ID và đổ dữ liệu lên Form cho người dùng sửa
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var category = _context.Categories.FirstOrDefault(c => c.Id == id);

            if (category == null)
            {
                return NotFound();
            }

            return View(category);
        }

        // 4.2. Hàm [POST]: Đón nhận dữ liệu đã sửa từ Form gửi lên và cập nhật vào SQL Server
        [HttpPost]
        public IActionResult Edit(Category model)
        {
            // MẸO SỬA LỖI: Loại bỏ kiểm tra thuộc tính liên kết để nút bấm luôn hoạt động mượt mà
            ModelState.Remove("Posts");

            if (ModelState.IsValid)
            {
                _context.Categories.Update(model); // Bước 1: Cập nhật trạng thái bộ nhớ tạm
                _context.SaveChanges();            // Bước 2: Chốt lệnh đồng bộ xuống SQL Server
                return RedirectToAction("Index");
            }

            return View(model);
        }
    }
}