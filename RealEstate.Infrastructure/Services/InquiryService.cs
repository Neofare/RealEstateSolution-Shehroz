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
        inquiry.Status = "New";

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

    public Inquiry? GetById(int id)
    {
        return _context.Inquiries.FirstOrDefault(i => i.Id == id);
    }

    public Inquiry? UpdateStatus(int id, string status)
    {
        var inquiry = _context.Inquiries.FirstOrDefault(i => i.Id == id);

        if (inquiry == null)
        {
            return null;
        }

        var allowedStatuses = new[] { "New", "Resolved", "Replied" };

        if (!allowedStatuses.Contains(status))
        {
            status = "New";
        }

        inquiry.Status = status;

        _context.SaveChanges();

        return inquiry;
    }

    public bool Delete(int id)
    {
        var inquiry = _context.Inquiries.FirstOrDefault(i => i.Id == id);

        if (inquiry == null)
        {
            return false;
        }

        _context.Inquiries.Remove(inquiry);
        _context.SaveChanges();

        return true;
    }
}