using RealEstate.Core.Models;
using RealEstate.Infrastructure.Data;

namespace RealEstate.Infrastructure.Services;

public class InquiryService : IInquiryService
{
    private readonly AppDbContext _context;

    public InquiryService(AppDbContext context)
    {
        _context = context;
    }

    public Inquiry Add(Inquiry inquiry)
    {
        inquiry.CreatedAt = DateTime.UtcNow;

        _context.Inquiries.Add(inquiry);
        _context.SaveChanges();

        return inquiry;
    }

    public List<Inquiry> GetAll()
    {
        return _context.Inquiries
            .OrderByDescending(i => i.CreatedAt)
            .ToList();
    }
}