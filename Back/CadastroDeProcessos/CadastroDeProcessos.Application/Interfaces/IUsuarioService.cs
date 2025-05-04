using CadastroDeProcessos.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace CadastroDeProcessos.Application.Interfaces
{
    public interface IUsuarioService
    {
        Task<IdentityResult> RegistrarAsync(Usuario usuario, string senha);
        Task<string> AutenticarAsync(string nomeUsuario, string senha);
    }
}
