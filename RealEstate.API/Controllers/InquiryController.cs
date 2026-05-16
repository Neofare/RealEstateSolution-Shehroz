using Microsoft.AspNetCore.Mvc;
using RealEstate.Core.Models;
using RealEstate.Infrastructure.Services;

namespace RealEstate.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InquiryController : ControllerBase
{
    private readonly IInquiryService _service;

    public InquiryController(IInquiryService service)
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
        var inquiry = _service.GetById(id);

        if (inquiry == null)
        {
            return NotFound(new { message = "Inquiry not found." });
        }

        return Ok(inquiry);
    }

    [HttpPost]
    public IActionResult Create(Inquiry inquiry)
    {
        var created = _service.Add(inquiry);
        return Ok(created);
    }

    [HttpPut("{id}/status")]
    public IActionResult UpdateStatus(int id, InquiryStatusDto dto)
    {
        var updated = _service.UpdateStatus(id, dto.Status);

        if (updated == null)
        {
            return NotFound(new { message = "Inquiry not found." });
        }

        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var deleted = _service.Delete(id);

        if (!deleted)
        {
            return NotFound(new { message = "Inquiry not found." });
        }

        return Ok(new { message = "Inquiry deleted successfully." });
    }
}

public class InquiryStatusDto
{
    public string Status { get; set; } = "New";
}