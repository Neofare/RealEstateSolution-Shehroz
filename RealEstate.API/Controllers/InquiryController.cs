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



    [HttpPost]
    public IActionResult Create(Inquiry inquiry)
    {
        var result = _service.Add(inquiry);
        return Ok(result);
    }
}