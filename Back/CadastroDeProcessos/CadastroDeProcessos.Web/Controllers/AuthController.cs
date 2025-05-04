using CadastroDeProcessos.Application.DTOs;
using CadastroDeProcessos.Application.Interfaces;
using CadastroDeProcessos.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace CadastroDeProcessos.Web.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController(IUsuarioService usuarioServico) : ControllerBase
    {
        private readonly IUsuarioService _usuarioServico = usuarioServico;

        [HttpPost("registrar")]
        public async Task<IActionResult> Registrar([FromBody] RegristrarUsuarioDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var usuario = new Usuario
            {
                UserName = dto.NomeUsuario,
                Email = dto.Email
            };  

            var resultado = await _usuarioServico.RegistrarAsync(usuario, dto.Senha);
            if (!resultado.Succeeded)
            {
                var erros = resultado.Errors.Select(e => new { e.Description });
                return BadRequest(new { Mensagem = "Falha ao registrar usuário.", Erros = erros });
            }

            return Ok(usuario);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUsuarioDto dto)
        {
            try
            {
                var token = await _usuarioServico.AutenticarAsync(dto.Email, dto.Senha);
                return Ok(new { token });
            }
            catch (Exception ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }
    }
}
