using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data; // Namespace chứa ApplicationDbContext của bạn
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class HomeController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Tiêm DbContext vào Controller thông qua cơ chế Dependency Injection (DI)
        public HomeController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            // CÔNG THỨC LINQ: Lấy chuẩn 3 bài viết vừa mới đăng xong
            var latestPosts = _context.Posts
                                      .Include(p => p.Category) // 1. Join kèm bảng danh mục để lấy Tên danh mục
                                      .OrderByDescending(p => p.CreatedDate) // 2. Đưa ngày lớn nhất (mới nhất) lên đầu
                                      .Take(3) // 3. Cắt lấy đúng 3 phần tử đầu tiên của danh sách
                                      .ToList(); // 4. Thực thi truy vấn gửi xuống SQL Server

            return View(latestPosts); // Truyền danh sách 3 bài viết ra View hiển thị
        }
    }
}