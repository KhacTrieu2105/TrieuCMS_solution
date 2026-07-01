using CMS.API.Services;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;
        public OrdersController(
            ApplicationDbContext context,
            IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
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
                decimal total = 0;

                string body = $@"
<h2>Cảm ơn bạn đã đặt hàng tại TrieuCMS</h2>

<p><b>Mã đơn hàng:</b> {newOrder.Id}</p>

<p><b>Ngày đặt:</b> {newOrder.OrderDate:dd/MM/yyyy HH:mm}</p>

<p><b>Ghi chú:</b> {newOrder.Notes}</p>

<table border='1' cellpadding='8' cellspacing='0'>
<tr>
<th>Sản phẩm</th>
<th>Số lượng</th>
<th>Đơn giá</th>
</tr>";

                foreach (var item in input.Items)
                {
                    var product = await _context.Products.FindAsync(item.ProductId);

                    total += item.Price * item.Quantity;

                    body += $@"
<tr>
<td>{product.Name}</td>
<td>{item.Quantity}</td>
<td>{item.Price:N0} VNĐ</td>
</tr>";
                }
                body += $@"
</table>

<h3>Tổng tiền: {total:N0} VNĐ</h3>

<p>Cảm ơn quý khách đã mua hàng!</p>";
                await _emailService.SendAsync(
    input.Email,
    $"Xác nhận đơn hàng #{newOrder.Id}",
    body
);

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

        public string Email { get; set; }
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