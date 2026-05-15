using RealEstate.Core.Models;

namespace RealEstate.Infrastructure.Services;

public interface IInquiryService
{
    Inquiry Add(Inquiry inquiry);
    List<Inquiry> GetAll();
}