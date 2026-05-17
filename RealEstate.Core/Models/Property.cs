namespace RealEstate.Core.Models;

public class Property
{
    public string Type { get; set; } = string.Empty; // villa, apartment, house
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Location { get; set; } = string.Empty;
    public int Bedrooms { get; set; }
    public int Bathrooms { get; set; }
    public double Area { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string AdditionalImages { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}