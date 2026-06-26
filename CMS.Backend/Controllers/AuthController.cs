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

        // --- HELPER: Lấy ID từ User Claims ---
        private int? CurrentCustomerId =>
            int.TryParse(User.FindFirst("CustomerId")?.Value, out var id) ? id : null;

        // POST: api/CustomerAuth/CustomerRegister
        [HttpPost("CustomerRegister")]
        public async Task<IActionResult> CustomerRegister([FromBody] Customer model)
        {
            // 1. Validate Họ và Tên
            if (string.IsNullOrWhiteSpace(model.FullName) || model.FullName.Trim().Length < 2)
                return BadRequest(new { success = false, message = "Họ và tên không được để trống và phải có ít nhất 2 ký tự!" });

            // 2. Validate Số điện thoại (Bao gồm định dạng và Check trùng lặp)
            if (!string.IsNullOrWhiteSpace(model.Phone))
            {
                var trimmedPhone = model.Phone.Trim();
                var phoneRegex = new System.Text.RegularExpressions.Regex(@"^0[3|5|7|8|9][0-9]{8}$");

                if (!phoneRegex.IsMatch(trimmedPhone))
                    return BadRequest(new { success = false, message = "Số điện thoại không hợp lệ! (Vd: 0912345678)" });

                // 👉 THÊM MỚI: Kiểm tra SĐT đã tồn tại trong Database chưa
                if (await _context.Customers.AnyAsync(c => c.Phone == trimmedPhone))
                    return BadRequest(new { success = false, message = "Số điện thoại này đã được sử dụng cho tài khoản khác!" });

                model.Phone = trimmedPhone;
            }

            // 3. Validate Địa chỉ
            if (!string.IsNullOrWhiteSpace(model.Address))
            {
                if (model.Address.Trim().Length < 5)
                    return BadRequest(new { success = false, message = "Địa chỉ quá ngắn, vui lòng nhập địa chỉ hợp lệ (ít nhất 5 ký tự)!" });

                model.Address = model.Address.Trim();
            }

            // 4. Validate Mật khẩu
            if (string.IsNullOrWhiteSpace(model.Password) || model.Password.Length < 6 || model.Password.Contains(" "))
                return BadRequest(new { success = false, message = "Mật khẩu phải có ít nhất 6 ký tự và không được chứa khoảng trắng!" });

            // 5. Validate Email trùng lặp
            if (await _context.Customers.AnyAsync(c => c.Email == model.Email))
                return BadRequest(new { success = false, message = "Email này đã được đăng ký!" });

            // 6. Chuẩn hóa dữ liệu tên
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
                .FirstOrDefaultAsync(c => c.Email == login.Email && c.Password == login.Password);

            if (customer == null)
                return Unauthorized(new { success = false, message = "Email hoặc mật khẩu không đúng!" });

            // Ghi Cookie vào trình duyệt
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

            // 1. Validate Họ Tên
            if (string.IsNullOrWhiteSpace(request.FullName) || request.FullName.Trim().Length < 2)
                return BadRequest(new { success = false, message = "Họ và tên không được để trống và phải có ít nhất 2 ký tự!" });

            // 2. Validate SĐT (Bao gồm định dạng và Check trùng lặp)
            if (!string.IsNullOrWhiteSpace(request.Phone))
            {
                var trimmedPhone = request.Phone.Trim();
                var phoneRegex = new System.Text.RegularExpressions.Regex(@"^0[3|5|7|8|9][0-9]{8}$");

                if (!phoneRegex.IsMatch(trimmedPhone))
                    return BadRequest(new { success = false, message = "Số điện thoại không hợp lệ! (Vd: 0912345678)" });

                // 👉 THÊM MỚI: Check trùng SĐT khi cập nhật (Lưu ý: Phải loại trừ chính ID của người đang đăng nhập ra)
                if (await _context.Customers.AnyAsync(c => c.Phone == trimmedPhone && c.Id != customerId.Value))
                    return BadRequest(new { success = false, message = "Số điện thoại này đã được sử dụng bởi tài khoản khác!" });

                customer.Phone = trimmedPhone;
            }
            else
            {
                customer.Phone = null;
            }

            // 3. Validate Địa chỉ
            if (!string.IsNullOrWhiteSpace(request.Address))
            {
                if (request.Address.Trim().Length < 5)
                    return BadRequest(new { success = false, message = "Địa chỉ quá ngắn, vui lòng nhập địa chỉ hợp lệ (ít nhất 5 ký tự)!" });

                customer.Address = request.Address.Trim();
            }
            else
            {
                customer.Address = null;
            }

            customer.FullName = request.FullName.Trim();

            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Cập nhật thành công!" });
        }

        // Hàm helper nhét "CustomerId" vào Cookie
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
    }

    // Các lớp hỗ trợ (DTOs)
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
}