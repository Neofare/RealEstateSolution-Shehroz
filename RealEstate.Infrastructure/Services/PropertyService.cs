using RealEstate.Core.Models;
using RealEstate.Infrastructure.Data;

namespace RealEstate.Infrastructure.Services;

public class PropertyService : IPropertyService
{
    private readonly AppDbContext _context;

    public PropertyService(AppDbContext context)
    {
        _context = context;
    }

    public List<Property> GetAll()
    {
        return _context.Properties.ToList();
    }

    public Property? GetById(int id)
    {
        return _context.Properties.FirstOrDefault(x => x.Id == id);
    }

    public Property Add(Property property)
    {
        _context.Properties.Add(property);
        _context.SaveChanges();
        return property;
    }

    public Property? Update(int id, Property property)
    {
        var existing = _context.Properties.FirstOrDefault(x => x.Id == id);

        if (existing == null)
        {
            return null;
        }

        existing.Title = property.Title;
        existing.Type = property.Type;
        existing.Description = property.Description;
        existing.Price = property.Price;
        existing.Location = property.Location;
        existing.Bedrooms = property.Bedrooms;
        existing.Bathrooms = property.Bathrooms;
        existing.Area = property.Area;
        existing.ImageUrl = property.ImageUrl;
        existing.AdditionalImages = property.AdditionalImages;

        _context.SaveChanges();

        return existing;
    }

    public bool Delete(int id)
    {
        var property = _context.Properties.FirstOrDefault(x => x.Id == id);
        if (property == null) return false;

        _context.Properties.Remove(property);
        _context.SaveChanges();
        return true;
    }
}