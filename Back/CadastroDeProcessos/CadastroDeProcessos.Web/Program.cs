using CadastroDeProcessos.Application.Mappings;
using CadastroDeProcessos.Infra.ApiConfigurations;
using CadastroDeProcessos.Infra.Context;
using CadastroDeProcessos.Infra.IoC;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.ResolveDependencies();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddHttpClient();
builder.Services.AddApiConfig();
builder.Services.AddSwaggerConfig();

builder.Services.AddJwtConfiguration(builder.Configuration);
builder.Services.AddRazorPages();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.UseApiConfig(app.Environment);
app.UseSwaggerConfig();
app.MapRazorPages();
app.Run();