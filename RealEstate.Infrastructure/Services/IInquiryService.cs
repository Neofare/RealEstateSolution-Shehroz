using RealEstate.Core.Models;

namespace RealEstate.Infrastructure.Services;

public interface IInquiryService
{
    Inquiry Add(Inquiry inquiry);
    List<Inquiry> GetAll();
    Inquiry? GetById(int id);
    Inquiry? UpdateStatus(int id, string status);
    bool Delete(int id);
}