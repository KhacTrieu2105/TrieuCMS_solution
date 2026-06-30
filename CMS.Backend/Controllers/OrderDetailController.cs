using CMS.Backend;
using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class OrderDetailController : Controller
    {
        private readonly ApplicationDbContext _context;

        public OrderDetailController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index(int orderId)
        {
            // Lấy chi tiết đơn hàng dựa trên OrderId và kèm thông tin Sản phẩm
            var orderDetails = _context.OrderDetails
                .Where(od => od.OrderId == orderId)
                .Include(od => od.Product) // Đảm bảo trong OrderDetail có thuộc tính public Product Product { get; set; }
                .ToList();

            return View(orderDetails);
        }
    }
}