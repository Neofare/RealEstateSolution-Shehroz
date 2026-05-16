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

        var suspendedUsers = _context.Users.Count(u => u.IsSuspended);

        return Ok(new
        {
            totalProperties,
            totalInquiries,
            totalUsers,
            totalVillas,
            totalApartments,
            totalHouses,
            suspendedUsers
        });
    }

    [HttpGet("users")]
    public IActionResult GetUsers()
    {
        var users = _context.Users
            .OrderBy(u => u.Id)
            .Select(u => new
            {
                u.Id,
                u.FullName,
                u.Email,
                u.Phone,
                u.Role,
                u.IsSuspended
            })
            .ToList();

        return Ok(users);
    }

    [HttpPut("users/{id}/suspend")]
    public IActionResult SuspendUser(int id)
    {
        var user = _context.Users.FirstOrDefault(u => u.Id == id);

        if (user == null)
        {
            return NotFound(new { message = "User not found." });
        }

        user.IsSuspended = true;
        _context.SaveChanges();

        return Ok(new { message = "User suspended successfully." });
    }

    [HttpPut("users/{id}/activate")]
    public IActionResult ActivateUser(int id)
    {
        var user = _context.Users.FirstOrDefault(u => u.Id == id);

        if (user == null)
        {
            return NotFound(new { message = "User not found." });
        }

        user.IsSuspended = false;
        _context.SaveChanges();

        return Ok(new { message = "User activated successfully." });
    }
}