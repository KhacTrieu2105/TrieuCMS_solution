using CMS.Backend; // Tên namespace chứa ApplicationDbContext của bạn
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Tiêm ApplicationDbContext qua Constructor
        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Action Index lấy danh sách thành viên
        public IActionResult Index()
        {
            var users = _context.Users.ToList();
            return View(users);
        }
        // GET: Hiển thị form trống để nhập liệu
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        // POST: Tiếp nhận dữ liệu, kiểm tra trùng lặp và lưu vào Database
        [HttpPost]
        public IActionResult Create(User model)
        {
            // Kiểm tra tính duy nhất: Tránh tình trạng trùng Tên đăng nhập trong hệ thống
            var checkExist = _context.Users.Any(u => u.Username == model.Username);
            if (checkExist)
            {
                // Gửi thông báo lỗi trực tiếp vào ô nhập liệu Username trên View
                ModelState.AddModelError("Username", "Tên đăng nhập này đã có người sử dụng!");
                return View(model);
            }

            if (ModelState.IsValid)
            {
                _context.Users.Add(model);
                _context.SaveChanges(); // Ghi dữ liệu trực tiếp xuống SQL Server
                return RedirectToAction("Index");
            }

            return View(model);
        }
        // GET: Tìm kiếm User cũ theo Id và hiển thị lên Form
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null) return NotFound();

            return View(user);
        }

        [HttpPost]
        public IActionResult Edit(User model, string NewPassword)
        {
            var existingUser = _context.Users.AsNoTracking().FirstOrDefault(u => u.Id == model.Id);

            if (existingUser == null) return NotFound();

            if (!string.IsNullOrEmpty(NewPassword))
            {
                model.PasswordHash = NewPassword;
            }
            else
            {
                model.PasswordHash = existingUser.PasswordHash;
            }

            _context.Users.Update(model);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // Hành động xóa tài khoản trực tiếp qua chu trình ID nhận về từ nút bấm
        public IActionResult Delete(int id)
        {
            var user = _context.Users.Find(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                _context.SaveChanges(); // Lưu thay đổi trực tiếp xuống SQL Server
            }
            return RedirectToAction("Index");
        }
    }
}