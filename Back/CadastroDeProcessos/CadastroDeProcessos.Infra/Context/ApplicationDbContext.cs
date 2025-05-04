using Microsoft.EntityFrameworkCore;
using CadastroDeProcessos.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace CadastroDeProcessos.Infra.Context;

public class ApplicationDbContext : IdentityDbContext<Usuario>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
    public DbSet<Processo> Processos { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
    }
}
