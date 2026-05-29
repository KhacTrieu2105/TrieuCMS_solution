using CMS.Backend; // Tên namespace chứa ApplicationDbContext của bạn
using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Tiêm ApplicationDbContext qua Constructor
        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Action Index lấy danh sách thành viên
        public IActionResult Index()
        {
            var users = _context.Users.ToList();
            return View(users);
        }
    }
}