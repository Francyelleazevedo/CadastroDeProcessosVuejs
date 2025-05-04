using CadastroDeProcessos.Application.Interfaces;
using CadastroDeProcessos.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CadastroDeProcessos.Application.Services
{
    public class UsuarioService(UserManager<Usuario> userManager, IConfiguration configuration) : IUsuarioService
    {
        private readonly UserManager<Usuario> _userManager = userManager;
        private readonly IConfiguration _configuration = configuration;

        public async Task<IdentityResult> RegistrarAsync(Usuario usuario, string senha)
        {
            var resultado = await _userManager.CreateAsync(usuario, senha);
           
            return resultado;
        }

        public async Task<string> AutenticarAsync(string email, string senha)
        {
            var usuario = await _userManager.FindByEmailAsync(email);
            if (usuario == null || !await _userManager.CheckPasswordAsync(usuario, senha))
                throw new Exception("Usuário não encontrado.");

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, usuario.Id),
                new Claim("nomeUsuario", usuario.UserName  ?? ""),
                new Claim("email", usuario.Email  ?? ""),
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Chave"] ?? ""));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Emissor"],
                audience: _configuration["Jwt:Publico"],
                claims: claims,
                expires: DateTime.Now.AddHours(3),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
