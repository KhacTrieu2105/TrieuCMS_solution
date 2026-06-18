using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System.Linq;
using System.IO;
using System;

namespace CMS.Backend.Controllers
{
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public ProductController(ApplicationDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
        }

        // Phương thức hỗ trợ nạp danh mục cho DropDownList
        private void LoadCategories(object selectedCategory = null)
        {
            ViewBag.CategoryList = new SelectList(_context.CategoriesProducts.ToList(), "Id", "Name", selectedCategory);
        }

        // --- INDEX ---
        public IActionResult Index()
        {
            var products = _context.Products.ToList();
            return View(products);
        }

        // --- CREATE ---
        public IActionResult Create()
        {
            LoadCategories();
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Product product, IFormFile uploadImage)
        {
            if (ModelState.IsValid)
            {
                if (uploadImage != null && uploadImage.Length > 0)
                {
                    string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "uploads");
                    if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

                    string fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadImage.FileName);
                    string filePath = Path.Combine(uploadsFolder, fileName);
                    using (var stream = new FileStream(filePath, FileMode.Create)) { uploadImage.CopyTo(stream); }
                    product.ImageUrl = "/uploads/" + fileName;
                }

                _context.Products.Add(product);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }
            LoadCategories(product.CategoryProductId);
            return View(product);
        }

        // --- EDIT ---
        public IActionResult Edit(int id)
        {
            var product = _context.Products.Find(id);
            if (product == null) return NotFound();

            LoadCategories(product.CategoryProductId);
            return View(product);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(Product product, IFormFile? uploadImage)
        {
            // Kiểm tra xem ID có hợp lệ không trước khi quan tâm tới toàn bộ model
            var existingProduct = _context.Products.Find(product.Id);
            if (existingProduct == null) return NotFound();

            // Cập nhật các trường thông tin cơ bản
            existingProduct.Name = product.Name;
            existingProduct.Price = product.Price;
            existingProduct.StockQuantity = product.StockQuantity;
            existingProduct.Description = product.Description;

            // Đảm bảo cập nhật Category
            existingProduct.CategoryProductId = product.CategoryProductId;

            // Xử lý ảnh
            if (uploadImage != null && uploadImage.Length > 0)
            {
                string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "uploads");
                if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);
                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadImage.FileName);
                string filePath = Path.Combine(uploadsFolder, fileName);
                using (var stream = new FileStream(filePath, FileMode.Create)) { uploadImage.CopyTo(stream); }
                existingProduct.ImageUrl = "/uploads/" + fileName;
            }

            // Gỡ bỏ validation cho những trường không cần thiết nếu vẫn bị chặn
            ModelState.Remove("uploadImage");

            if (ModelState.IsValid)
            {
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }

            // Nếu vẫn lỗi, load lại danh mục và trả về view
            LoadCategories(product.CategoryProductId);
            return View(product);
        }

        // --- DELETE ---
        public IActionResult Delete(int id)
        {
            var product = _context.Products.Find(id);
            if (product != null)
            {
                // Tùy chọn: Xóa cả file ảnh nếu cần
                _context.Products.Remove(product);
                _context.SaveChanges();
            }
            return RedirectToAction(nameof(Index));
        }
     
    }

}