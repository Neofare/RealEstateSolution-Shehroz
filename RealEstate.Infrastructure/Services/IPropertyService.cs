using RealEstate.Core.Models;

namespace RealEstate.Infrastructure.Services;

public interface IPropertyService
{
    List<Property> GetAll();
    Property? GetById(int id);
    Property Add(Property property);
    Property? Update(int id, Property property);
    bool Delete(int id);
}