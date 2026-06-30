using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using BCrypt.Net; // Thư viện mã hóa

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerAuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CustomerAuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        private int? CurrentCustomerId =>
            int.TryParse(User.FindFirst("CustomerId")?.Value, out var id) ? id : null;

        // POST: api/CustomerAuth/CustomerRegister
        [HttpPost("CustomerRegister")]
        public async Task<IActionResult> CustomerRegister([FromBody] Customer model)
        {
            // 1. Validate Họ và Tên
            if (string.IsNullOrWhiteSpace(model.FullName) || model.FullName.Trim().Length < 2)
                return BadRequest(new { success = false, message = "Họ và tên không được để trống và phải có ít nhất 2 ký tự!" });

            // 2. Validate Email
            if (string.IsNullOrWhiteSpace(model.Email) || !new EmailAddressAttribute().IsValid(model.Email))
                return BadRequest(new { success = false, message = "Định dạng email không hợp lệ!" });

            if (await _context.Customers.AnyAsync(c => c.Email == model.Email))
                return BadRequest(new { success = false, message = "Email này đã được đăng ký!" });

            // 3. Validate Số điện thoại
            if (!string.IsNullOrWhiteSpace(model.Phone))
            {
                var trimmedPhone = model.Phone.Trim();
                var phoneRegex = new System.Text.RegularExpressions.Regex(@"^0[3|5|7|8|9][0-9]{8}$");

                if (!phoneRegex.IsMatch(trimmedPhone))
                    return BadRequest(new { success = false, message = "Số điện thoại không hợp lệ! (Vd: 0912345678)" });

                if (await _context.Customers.AnyAsync(c => c.Phone == trimmedPhone))
                    return BadRequest(new { success = false, message = "Số điện thoại này đã được sử dụng!" });

                model.Phone = trimmedPhone;
            }

            // 4. Validate Mật khẩu
            if (string.IsNullOrWhiteSpace(model.Password) || model.Password.Length < 6 || model.Password.Contains(" "))
                return BadRequest(new { success = false, message = "Mật khẩu phải có ít nhất 6 ký tự và không được chứa khoảng trắng!" });

            // 5. MÃ HÓA MẬT KHẨU TRƯỚC KHI LƯU
            model.Password = BCrypt.Net.BCrypt.HashPassword(model.Password);

            // 6. Chuẩn hóa dữ liệu
            model.FullName = model.FullName.Trim();

            _context.Customers.Add(model);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Đăng ký thành công!" });
        }

        // POST: api/CustomerAuth/CustomerLogin
        [HttpPost("CustomerLogin")]
        public async Task<IActionResult> CustomerLogin([FromBody] LoginDto login)
        {
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Email == login.Email);

            // Kiểm tra user tồn tại VÀ so khớp mật khẩu đã mã hóa
            if (customer == null || !BCrypt.Net.BCrypt.Verify(login.Password, customer.Password))
                return Unauthorized(new { success = false, message = "Email hoặc mật khẩu không đúng!" });

            await SignInCustomerAsync(customer);

            return Ok(new
            {
                success = true,
                customerId = customer.Id,
                fullName = customer.FullName,
                email = customer.Email,
                message = "Đăng nhập thành công!"
            });
        }

        // POST: api/CustomerAuth/logout
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok(new { success = true, message = "Đăng xuất thành công!" });
        }

        // GET: api/CustomerAuth/me
        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetProfile()
        {
            var customerId = CurrentCustomerId;
            if (!customerId.HasValue) return Unauthorized(new { message = "Bạn chưa đăng nhập." });

            var customer = await _context.Customers.FindAsync(customerId.Value);
            if (customer == null) return NotFound(new { message = "Không tìm thấy tài khoản." });

            return Ok(new { customer.FullName, customer.Email, customer.Phone, customer.Address });
        }

        // PUT: api/CustomerAuth/me
        [HttpPut("me")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile([FromBody] CustomerUpdateRequest request)
        {
            var customerId = CurrentCustomerId;
            if (!customerId.HasValue) return Unauthorized();

            var customer = await _context.Customers.FindAsync(customerId.Value);
            if (customer == null) return NotFound(new { message = "Không tìm thấy tài khoản." });

            if (string.IsNullOrWhiteSpace(request.FullName) || request.FullName.Trim().Length < 2)
                return BadRequest(new { success = false, message = "Họ và tên không hợp lệ!" });

            if (!string.IsNullOrWhiteSpace(request.Phone))
            {
                var trimmedPhone = request.Phone.Trim();
                if (await _context.Customers.AnyAsync(c => c.Phone == trimmedPhone && c.Id != customerId.Value))
                    return BadRequest(new { success = false, message = "Số điện thoại đã được tài khoản khác sử dụng!" });
                customer.Phone = trimmedPhone;
            }
            else customer.Phone = null;

            customer.Address = !string.IsNullOrWhiteSpace(request.Address) ? request.Address.Trim() : null;
            customer.FullName = request.FullName.Trim();

            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Cập nhật thành công!" });
        }

        private async Task SignInCustomerAsync(Customer customer)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, customer.Email),
                new Claim("CustomerId", customer.Id.ToString())
            };

            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity));
        }
        // --- THÊM MỚI: API Lấy lịch sử đơn hàng ---
        [HttpGet("orders")]
        [Authorize]
        public async Task<IActionResult> GetOrderHistory()
        {
            var customerId = CurrentCustomerId;

            // DEBUG: In ra cửa sổ output của Visual Studio để kiểm tra
            System.Diagnostics.Debug.WriteLine("DEBUG: CustomerId nhận được là: " + customerId);

            if (!customerId.HasValue) return Unauthorized();

            var orders = await _context.Orders
                .Where(o => o.CustomerId == customerId.Value) // Phải khớp với ID 10
                .OrderByDescending(o => o.OrderDate)
                .Select(o => new {
                    o.Id,
                    o.OrderDate,
                    o.Status,
                    TotalAmount = o.OrderDetails.Sum(od => od.Quantity * od.UnitPrice)
                })
                .ToListAsync();

            return Ok(orders);
        }

        // --- THÊM MỚI: API Đổi mật khẩu ---
        [HttpPost("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            var customer = await _context.Customers.FindAsync(CurrentCustomerId);
            if (customer == null) return NotFound();

            // Kiểm tra mật khẩu cũ
            if (!BCrypt.Net.BCrypt.Verify(request.OldPassword, customer.Password))
                return BadRequest(new { success = false, message = "Mật khẩu cũ không đúng!" });

            // Validate mật khẩu mới
            if (string.IsNullOrWhiteSpace(request.NewPassword) || request.NewPassword.Length < 6)
                return BadRequest(new { success = false, message = "Mật khẩu mới phải có ít nhất 6 ký tự!" });

            // Cập nhật mật khẩu mới đã mã hóa
            customer.Password = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);

            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Đổi mật khẩu thành công!" });
        }
    }

    public class LoginDto
    {
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
    }

    public class CustomerUpdateRequest
    {
        public string FullName { get; set; } = "";
        public string? Phone { get; set; }
        public string? Address { get; set; }
    }
    // ... cuối file CustomerAuthController.cs ...

    public class ChangePasswordRequest
    {
        public string OldPassword { get; set; } = "";
        public string NewPassword { get; set; } = "";
    }
} // <--- Đây là ngoặc đóng của namespace
