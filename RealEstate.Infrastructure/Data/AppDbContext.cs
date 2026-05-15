using Microsoft.EntityFrameworkCore;
using RealEstate.Core.Models;

namespace RealEstate.Infrastructure.Data;

public class AppDbContext : DbContext
{

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Property>()
            .Property(p => p.Price)
            .HasPrecision(18, 2);
    }
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    public DbSet<Property> Properties => Set<Property>();
    public DbSet<Agent> Agents => Set<Agent>();
    public DbSet<Inquiry> Inquiries => Set<Inquiry>();
}