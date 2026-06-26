using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using System.Linq;

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
            // Kiểm tra xem dữ liệu có đúng yêu cầu không
            if (ModelState.IsValid)
            {
                _context.Customers.Add(customer);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }

            // Nếu có lỗi, trả về view với dữ liệu cũ để người dùng sửa
            return View(customer);
        }

        // --- EDIT ---
        public IActionResult Edit(int id)
        {
            var customer = _context.Customers.Find(id);
            return customer == null ? NotFound() : View(customer);
        }

        [HttpPost]
        public IActionResult Edit(Customer customer)
        {
            if (ModelState.IsValid)
            {
                _context.Customers.Update(customer);
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