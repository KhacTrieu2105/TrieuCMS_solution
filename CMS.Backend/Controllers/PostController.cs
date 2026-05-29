using CMS.Backend; // Thay bằng namespace chứa ApplicationDbContext của bạn nếu khác
using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace CMS.Backend.Controllers
{
    // Đảm bảo kế thừa từ lớp Controller của ASP.NET Core MVC
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Thực hiện "Tiêm" ApplicationDbContext vào Controller thông qua Constructor
        public PostController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Action Index để lấy danh sách bài viết và truyền sang View
        public IActionResult Index()
        {
            // Lấy tất cả bài viết từ Database, kèm theo dữ liệu Category nếu cần (Tùy chọn)
            var posts = _context.Posts.ToList();

            // Trả về View và truyền danh sách posts làm Model
            return View(posts);
        }
    }
}