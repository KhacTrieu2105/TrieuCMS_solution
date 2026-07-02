using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _context.Products.OrderByDescending(p => p.Id).ToListAsync();
            return Ok(products);
        }

        [HttpGet("categoryproduct/{categoryProductId}")]
        public async Task<IActionResult> GetByCategoryProduct(int categoryProductId)
        {
            var products = await _context.Products
                .Where(p => p.CategoryProductId == categoryProductId)
                .ToListAsync();
            return Ok(products);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id);
            if (product == null) return NotFound();
            return Ok(product);
        }
    

// 4. THÊM MỚI SẢN PHẨM (POST)
[HttpPost]
        public async Task<IActionResult> Create([FromBody] CMS.Data.Entities.Product product)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDetail), new { id = product.Id }, product);
        }

        // 5. CẬP NHẬT SẢN PHẨM (PUT)
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CMS.Data.Entities.Product product)
        {
            if (id != product.Id) return BadRequest("ID không khớp");

            var existingProduct = await _context.Products.FindAsync(id);
            if (existingProduct == null) return NotFound();

            // Cập nhật các trường thông tin
            existingProduct.Name = product.Name;
            existingProduct.Price = product.Price;
            existingProduct.ImageUrl = product.ImageUrl;
            existingProduct.StockQuantity = product.StockQuantity;
            existingProduct.Description = product.Description;
            existingProduct.CategoryProductId = product.CategoryProductId;

            await _context.SaveChangesAsync();
            return NoContent(); // Trả về 204 nếu cập nhật thành công
        }

        // 6. XÓA SẢN PHẨM (DELETE)
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã xóa sản phẩm thành công" });
        }
        [HttpGet("GetByCategory/{categoryId}")]
        public IActionResult GetByCategory(int categoryId)
        {
            var products = _context.Products
                                   .Where(p => p.CategoryProductId == categoryId)
                                   .ToList();
            return Ok(products);
        }

        [HttpGet("hot")]
        public async Task<IActionResult> GetHotProducts()
        {
            try
            {
                // Truy vấn từ bảng con OrderDetails để tránh lỗi null từ Product
                var topProductIds = await _context.OrderDetails
                    .GroupBy(od => od.ProductId)
                    .OrderByDescending(g => g.Sum(od => od.Quantity))
                    .Take(3)
                    .Select(g => g.Key)
                    .ToListAsync();

                var hotProducts = await _context.Products
                    .Where(p => topProductIds.Contains(p.Id))
                    .Select(p => new { p.Id, p.Name, p.Price, p.ImageUrl })
                    .ToListAsync();

                return Ok(hotProducts);
            }
            catch (Exception ex)
            {
                // Log lỗi ra cửa sổ Visual Studio để xem chính xác bị gì
                System.Diagnostics.Debug.WriteLine(ex.Message);
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search(string keyword)
        {
            if (string.IsNullOrWhiteSpace(keyword))
            {
                return Ok(new List<Product>());
            }

            keyword = keyword.Trim().ToLower();

            var products = await _context.Products
                .Where(p => p.Name.ToLower().Contains(keyword))
                .OrderByDescending(p => p.Id)
                .ToListAsync();

            return Ok(products);
        }
        // GET api/Products/filter?categoryId=1&min=100000&max=500000
        [HttpGet("filter")]
        public async Task<IActionResult> Filter(
            int? categoryId,
            decimal min = 0,
            decimal max = decimal.MaxValue)
        {
            var query = _context.Products.AsQueryable();

            if (categoryId.HasValue)
            {
                query = query.Where(x => x.CategoryProductId == categoryId.Value);
            }

            query = query.Where(x => x.Price >= min && x.Price <= max);

            var products = await query
                .OrderByDescending(x => x.Id)
                .ToListAsync();

            return Ok(products);
        }

        [HttpGet("latest")]
        public async Task<IActionResult> GetLatestProducts()
        {
            var products = await _context.Products
                .OrderByDescending(x => x.Id)
                .Take(3)
                .Select(x => new
                {
                    x.Id,
                    x.Name,
                    x.Price,
                    x.ImageUrl
                })
                .ToListAsync();

            return Ok(products);
        }
    }

}