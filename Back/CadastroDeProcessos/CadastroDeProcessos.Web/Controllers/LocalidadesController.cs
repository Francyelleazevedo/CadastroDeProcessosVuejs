using CadastroDeProcessos.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/localidades")]
[Authorize]
public class LocalidadesController : ControllerBase
{
    private readonly IIBGELocalidadeService _ibgeLocalidadeService;

    public LocalidadesController(IIBGELocalidadeService ibgeLocalidadeService)
    {
        _ibgeLocalidadeService = ibgeLocalidadeService;
    }

    [HttpGet("municipios/{uf}")]
    public async Task<IActionResult> ObterMunicipiosPorUf(string uf)
    {
        if (string.IsNullOrWhiteSpace(uf) || uf.Length != 2)
            return BadRequest("UF inválida.");

        try
        {
            var municipios = await _ibgeLocalidadeService.ObterMunicipiosPorUFAsync(uf.ToUpper());

            if (!municipios.Any())
                return NotFound("Nenhum município encontrado para a UF informada.");

            return Ok(municipios);
        }
        catch (HttpRequestException ex)
        {
            return StatusCode(503, $"Erro ao consultar o IBGE: {ex.Message}");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Erro interno: {ex.Message}");
        }
    }
}
