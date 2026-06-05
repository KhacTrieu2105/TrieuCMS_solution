using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // Cần thiết cho ToListAsync, FindAsync
using CMS.Data;
using CMS.Data.Entities;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. Lấy danh sách toàn bộ đơn hàng (GET)
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _context.Orders.OrderByDescending(o => o.OrderDate).ToListAsync();
            return Ok(orders);
        }

        // 2. Lấy chi tiết đơn hàng (GET by ID)
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound(new { message = "Không tìm thấy đơn hàng" });
            return Ok(order);
        }

        // 3. Tạo mới đơn hàng (POST)
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] OrderInputDTO input)
        {
            if (input == null) return BadRequest(new { message = "Dữ liệu không hợp lệ" });

            var newOrder = new Order
            {
                OrderDate = DateTime.Now,
                CustomerId = input.CustomerId,
                Status = 0, // Mặc định là chờ xử lý
                Notes = input.Notes
            };

            _context.Orders.Add(newOrder);
            await _context.SaveChangesAsync();

            return StatusCode(201, new { message = "Đặt hàng thành công!", orderId = newOrder.Id });
        }

        // 4. Cập nhật trạng thái đơn hàng (PUT)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] OrderUpdateDTO input)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();

            order.Status = input.Status;
            order.Notes = input.Notes ?? order.Notes;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Cập nhật đơn hàng thành công!" });
        }

        // 5. Xóa đơn hàng (DELETE)
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã xóa đơn hàng!" });
        }
    }

    // DTO cho việc tạo đơn
    public class OrderInputDTO
    {
        public int CustomerId { get; set; }
        public string Notes { get; set; }
    }

    // DTO cho việc cập nhật trạng thái
    public class OrderUpdateDTO
    {
        public int Status { get; set; }
        public string Notes { get; set; }
    }
}