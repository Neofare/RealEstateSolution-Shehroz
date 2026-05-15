using Microsoft.EntityFrameworkCore;
using RealEstate.Infrastructure.Data;
using RealEstate.Infrastructure.Services;


var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddScoped<IPropertyService, PropertyService>();
builder.Services.AddScoped<IInquiryService, InquiryService>();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// DB
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        b => b.MigrationsAssembly("RealEstate.Infrastructure")
    ));

// CORS (for frontend later)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});



var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();