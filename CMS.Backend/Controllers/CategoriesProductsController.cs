using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using System.Threading.Tasks;
using System.Linq;
using System;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategoriesProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/CategoriesProducts
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var categories = await _context.CategoriesProducts
                    .OrderBy(c => c.Id)
                    .Select(c => new
                    {
                        c.Id,
                        c.Name,
                        c.Description
                    })
                    .ToListAsync();

                return Ok(categories);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi kết nối CSDL", detail = ex.Message });
            }
        }

        // POST: api/CategoriesProducts
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CategoryProduct category)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            _context.CategoriesProducts.Add(category);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAll), new { id = category.Id }, category);
        }

        // PUT: api/CategoriesProducts/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CategoryProduct category)
        {
            if (id != category.Id) return BadRequest("ID không khớp");

            var existing = await _context.CategoriesProducts.FindAsync(id);
            if (existing == null) return NotFound();

            existing.Name = category.Name;
            existing.Description = category.Description;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/CategoriesProducts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var category = await _context.CategoriesProducts.FindAsync(id);
            if (category == null) return NotFound();

            _context.CategoriesProducts.Remove(category);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa danh mục thành công" });
        }
    }
}