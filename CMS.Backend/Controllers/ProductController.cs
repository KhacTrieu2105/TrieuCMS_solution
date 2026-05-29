using CMS.Backend; // Đảm bảo namespace này trỏ đúng đến file ApplicationDbContext của bạn
using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Action hiển thị danh sách sản phẩm
        public IActionResult Index()
        {
            // Lấy toàn bộ danh sách sản phẩm từ SQL Server thông qua DbContext
            var products = _context.Products.ToList();
            return View(products);
        }
    }
}