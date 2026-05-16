using Microsoft.AspNetCore.Mvc;
using RealEstate.Infrastructure.Data;

namespace RealEstate.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _context;

    public AdminController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("stats")]
    public IActionResult GetStats()
    {
        var totalProperties = _context.Properties.Count();
        var totalInquiries = _context.Inquiries.Count();
        var totalUsers = _context.Users.Count();

        var totalVillas = _context.Properties.Count(p => p.Type.ToLower() == "villa");
        var totalApartments = _context.Properties.Count(p => p.Type.ToLower() == "apartment");
        var totalHouses = _context.Properties.Count(p => p.Type.ToLower() == "house");

        return Ok(new
        {
            totalProperties,
            totalInquiries,
            totalUsers,
            totalVillas,
            totalApartments,
            totalHouses
        });
    }
}