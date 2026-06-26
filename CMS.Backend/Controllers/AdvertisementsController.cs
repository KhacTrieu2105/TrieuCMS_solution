using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdvertisementsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdvertisementsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Advertisements
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                // Sử dụng AsNoTracking để tối ưu hiệu năng cho dữ liệu chỉ đọc
                var data = await _context.Advertisements
                                         .Where(x => x.IsActive)
                                         .OrderBy(x => x.DisplayOrder)
                                         .AsNoTracking()
                                         .ToListAsync();

                return Ok(data);
            }
            catch (Exception ex)
            {
                // Trả về lỗi server nếu database chưa được kết nối đúng
                return StatusCode(500, new { message = "Lỗi khi lấy dữ liệu banner", error = ex.Message });
            }
        }
    }
}