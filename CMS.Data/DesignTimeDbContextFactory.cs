using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace CMS.Data
{
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();

            // Hardcode chuỗi kết nối tại đây để phục vụ RIÊNG cho công cụ Migration lúc gõ lệnh
            var connectionString = "Server=.;Database=ThaiCMS_DB;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True";

            optionsBuilder.UseSqlServer(connectionString);

            return new ApplicationDbContext(optionsBuilder.Options);
        }
    }
}