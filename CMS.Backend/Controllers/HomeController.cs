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
            var model = new HomeViewModel
            {
                Products = _context.Products.Take(8).ToList(), // Lấy 8 sản phẩm
                Posts = _context.Posts.OrderByDescending(p => p.CreatedDate).Take(3).ToList() // Lấy 3 bài viết
            };
            return View(model);
        }
    }
}