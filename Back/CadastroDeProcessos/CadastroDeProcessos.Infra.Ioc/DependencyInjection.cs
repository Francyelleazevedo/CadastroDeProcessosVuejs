using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using CadastroDeProcessos.Application.Interfaces;
using CadastroDeProcessos.Application.Services;
using CadastroDeProcessos.Domain.Interfaces;
using CadastroDeProcessos.Infra.Context;
using CadastroDeProcessos.Infra.Repositories;
using CadastroDeProcessos.Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using CadastroDeProcessos.Application.Mappings;

namespace CadastroDeProcessos.Infra.IoC;

public static class DependencyInjection
{
    public static IServiceCollection ResolveDependencies(this IServiceCollection services)
    {
        services.AddScoped<ApplicationDbContext>();

        //AutoMapper
        services.AddAutoMapper(typeof(ProcessoProfile).Assembly);

        services.AddScoped<IProcessoRepository, ProcessoRepository>();
        services.AddScoped<IProcessoService, ProcessoService>();

        services.AddScoped<IIBGELocalidadeService, IBGELocalidadeService>();

        services.AddScoped<IUsuarioService, UsuarioService>();

        // Identity
        services.AddIdentity<Usuario, IdentityRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddErrorDescriber<CustomIdentityErrorDescriber>()
            .AddDefaultTokenProviders();

        // HttpContextAccessor

        services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
        return services;
    }

   
}
