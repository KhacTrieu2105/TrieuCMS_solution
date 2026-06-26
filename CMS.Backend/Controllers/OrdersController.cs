using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using System;
using System.Linq;
using System.Collections.Generic;
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

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] OrderInputDTO input)
        {
            if (input == null || input.Items == null || !input.Items.Any())
                return BadRequest(new { message = "Giỏ hàng trống hoặc dữ liệu không hợp lệ" });

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // 1. Tạo đơn hàng
                var newOrder = new Order
                {
                    OrderDate = DateTime.Now,
                    CustomerId = input.CustomerId,
                    Status = 0,
                    Notes = input.Notes ?? "Không có ghi chú" // Xử lý lỗi Notes null
                };

                _context.Orders.Add(newOrder);
                await _context.SaveChangesAsync();

                // 2. Xử lý trừ kho và lưu chi tiết đơn hàng
                foreach (var item in input.Items)
                {
                    var product = await _context.Products.FindAsync(item.ProductId);
                    if (product == null) throw new Exception($"Sản phẩm ID {item.ProductId} không tồn tại.");

                    if (product.StockQuantity < item.Quantity)
                        throw new Exception($"Sản phẩm {product.Name} không đủ số lượng trong kho.");

                    product.StockQuantity -= item.Quantity; // TRỪ KHO

                    // Thêm vào bảng OrderDetail (giả định bạn có bảng này)
                    _context.OrderDetails.Add(new OrderDetail
                    {
                        OrderId = newOrder.Id,
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                       
                    });
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return StatusCode(201, new { message = "Đặt hàng thành công!", id = newOrder.Id });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();

                // Lấy thông báo lỗi sâu nhất
                var message = ex.Message;
                if (ex.InnerException != null)
                {
                    message = ex.InnerException.Message;
                    // Nếu có lỗi chi tiết hơn ở mức thấp hơn nữa
                    if (ex.InnerException.InnerException != null)
                    {
                        message += " | " + ex.InnerException.InnerException.Message;
                    }
                }

                return BadRequest(new { message = message });
            }
        }

        // --- Các hàm khác giữ nguyên ---
    }

    // Cập nhật DTO để nhận dữ liệu từ React
    public class OrderInputDTO
    {
        public int CustomerId { get; set; }
        public string Notes { get; set; }
        public List<OrderItemDTO> Items { get; set; }
    }

    public class OrderItemDTO
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
}