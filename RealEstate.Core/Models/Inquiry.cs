namespace RealEstate.Core.Models;

public class Inquiry
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;

    public int PropertyId { get; set; }

    public string Status { get; set; } = "New"; // New, Resolved, Replied

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}