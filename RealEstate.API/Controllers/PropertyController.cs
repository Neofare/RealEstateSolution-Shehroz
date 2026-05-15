using Microsoft.AspNetCore.Mvc;
using RealEstate.Core.Models;
using RealEstate.Infrastructure.Services;

namespace RealEstate.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PropertyController : ControllerBase
{
    private readonly IPropertyService _service;

    public PropertyController(IPropertyService service)
    {
        _service = service;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(_service.GetAll());
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var property = _service.GetById(id);
        if (property == null) return NotFound();
        return Ok(property);
    }

    [HttpPost]
    public IActionResult Create(Property property)
    {
        var created = _service.Add(property);
        return Ok(created);
    }

    [HttpPut("{id}")]
    public IActionResult Update(int id, Property property)
    {
        var updated = _service.Update(id, property);
        if (updated == null) return NotFound();
        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var result = _service.Delete(id);
        if (!result) return NotFound();
        return Ok("Deleted successfully");
    }
}