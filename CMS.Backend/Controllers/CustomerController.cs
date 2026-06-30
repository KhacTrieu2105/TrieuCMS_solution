using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using System.Linq;
using BCrypt.Net; // Cần cài đặt BCrypt.Net-Next

namespace CMS.Backend.Controllers
{
    public class CustomerController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CustomerController(ApplicationDbContext context) => _context = context;

        public IActionResult Index() => View(_context.Customers.ToList());

        // --- CREATE ---
        public IActionResult Create() => View();

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Customer customer)
        {
            if (ModelState.IsValid)
            {
                // MÃ HÓA MẬT KHẨU KHI TẠO MỚI
                customer.Password = BCrypt.Net.BCrypt.HashPassword(customer.Password);

                _context.Customers.Add(customer);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }
            return View(customer);
        }

        // --- EDIT ---
        public IActionResult Edit(int id)
        {
            var customer = _context.Customers.Find(id);
            // Xóa mật khẩu trước khi gửi về View để tránh lộ hash ra ngoài
            if (customer != null) customer.Password = string.Empty;
            return customer == null ? NotFound() : View(customer);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(Customer customer)
        {
            if (ModelState.IsValid)
            {
                var existingCustomer = _context.Customers.Find(customer.Id);
                if (existingCustomer == null) return NotFound();

                // Cập nhật các trường thông tin cơ bản
                existingCustomer.FullName = customer.FullName;
                existingCustomer.Email = customer.Email;
                existingCustomer.Phone = customer.Phone;
                existingCustomer.Address = customer.Address;

                // Chỉ mã hóa nếu Admin nhập mật khẩu mới
                if (!string.IsNullOrWhiteSpace(customer.Password))
                {
                    existingCustomer.Password = BCrypt.Net.BCrypt.HashPassword(customer.Password);
                }

                _context.Customers.Update(existingCustomer);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }
            return View(customer);
        }

        // --- DELETE ---
        public IActionResult Delete(int id)
        {
            var customer = _context.Customers.Find(id);
            if (customer != null)
            {
                _context.Customers.Remove(customer);
                _context.SaveChanges();
            }
            return RedirectToAction(nameof(Index));
        }
    }
}