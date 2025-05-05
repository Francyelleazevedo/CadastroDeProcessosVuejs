using CadastroDeProcessos.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CadastroDeProcessos.Web.Controllers
{
    [Route("api/relatorio")]
    [ApiController]
    [Authorize]
    public class RelatorioController : ControllerBase
    {
        private readonly IRelatorioService _relatorioService;

        public RelatorioController(IRelatorioService relatorioService)
        {
            _relatorioService = relatorioService;
        }

        [HttpGet("mensal")]
        public async Task<IActionResult> RelatorioMensal(int mes, int ano)
        {
            if (mes < 1 || mes > 12)
                return BadRequest(new { Message = "Mês inválido." });
            if (ano < 1900 || ano > DateTime.Now.Year)
                return BadRequest(new { Message = "Ano inválido." });

            try
            {
                var relatorio = await _relatorioService.GerarRelatorioMensalAsync(mes, ano);
                return Ok(relatorio);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Erro ao gerar relatório: " + ex.Message });
            }
        }
    }
}
