using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RealEstate.Core.DTOs;
using RealEstate.Core.Models;
using RealEstate.Infrastructure.Data;
using System.Security.Cryptography;
using System.Text;

namespace RealEstate.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;

    public AuthController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("register")]
    public IActionResult Register(RegisterDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.FullName) ||
            string.IsNullOrWhiteSpace(dto.Email) ||
            string.IsNullOrWhiteSpace(dto.Phone) ||
            string.IsNullOrWhiteSpace(dto.Password))
        {
            return BadRequest(new { message = "All fields are required." });
        }

        var emailExists = _context.Users.Any(u => u.Email == dto.Email);

        if (emailExists)
        {
            return BadRequest(new { message = "Email already registered." });
        }

        var user = new User
        {
            FullName = dto.FullName,
            Email = dto.Email,
            Phone = dto.Phone,
            PasswordHash = HashPassword(dto.Password),
            Role = "User"
        };

        _context.Users.Add(user);
        _context.SaveChanges();

        return Ok(new
        {
            message = "Account created successfully.",
            user = new
            {
                user.Id,
                user.FullName,
                user.Email,
                user.Phone,
                user.Role
            }
        });
    }

    [HttpPost("login")]
    public IActionResult Login(LoginDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Email) ||
            string.IsNullOrWhiteSpace(dto.Password))
        {
            return BadRequest("Email and password are required.");
        }

        var user = _context.Users.FirstOrDefault(u => u.Email == dto.Email);

        if (user == null)
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }

        if (user.IsSuspended)
        {
            return Unauthorized(new { message = "Your account has been suspended. Please contact support." });
        }

        var hashedPassword = HashPassword(dto.Password);

        if (user.PasswordHash != hashedPassword)
        {
            return Unauthorized("Invalid email or password.");
        }

        return Ok(new
        {
            message = "Login successful.",
            user = new
            {
                user.Id,
                user.FullName,
                user.Email,
                user.Phone,
                user.Role
            }
        });
    }

    private static string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(bytes);
    }
}