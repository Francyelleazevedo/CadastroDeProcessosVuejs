using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CadastroDeProcessos.Application.Interfaces;
using CadastroDeProcessos.Domain.Entities;
using CadastroDeProcessos.Application.DTOs;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;

namespace CadastroDeProcessos.Web.Controllers
{
    [ApiController]
    [Route("api/processo")]
    [Authorize]
    public class ProcessoController : ControllerBase
    {
        private readonly IProcessoService _processoService;
        private readonly IMapper _mapper;
        public ProcessoController(IProcessoService processoService, IMapper mapper)
        {
            _processoService = processoService;
            _mapper = mapper;
        }

        [HttpGet()]
        public async Task<ActionResult> ListarPaginado([FromQuery] int? page, [FromQuery] int? pageSize)
        {
            try
            {
                int tamanhoPagina = pageSize ?? 10;
                int numeroPagina = page ?? 1;
                var pagedResult = await _processoService.ListarPaginadoAsync(numeroPagina, tamanhoPagina);

                var result = new
                {
                    items = pagedResult.Items,
                    pageNumber = pagedResult.PageNumber,
                    totalPages = pagedResult.TotalPages,
                    totalItems = pagedResult.TotalItems
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> ObterPorId(int id)
        {
            try
            {
                var processo = await _processoService.ObterPorIdAsync(id);
                if (processo == null) return NotFound("Processo não encontrado.");

                return Ok(processo);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<ActionResult> Adicionar([FromBody] ProcessoDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                var processoEntity = _mapper.Map<Processo>(dto);

                await _processoService.AdicionarAsync(processoEntity);
                return CreatedAtAction(nameof(ObterPorId), new { id = processoEntity.Id }, dto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao criar: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Atualizar(int id, ProcessoDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                var processoExistente = await _processoService.ObterPorIdAsync(id);
                if (processoExistente == null) return NotFound();

                _mapper.Map(dto, processoExistente);

                await _processoService.AtualizarAsync(processoExistente);
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await ProcessoExists(id))
                    return NotFound();
                else
                    throw;
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao atualizar: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Remover(int id)
        {
            try
            {
                await _processoService.RemoverAsync(id);
                return NoContent();
            }
            catch (Exception)
            {
                return StatusCode(500, new { Message = "Ocorreu um erro interno. Por favor, tente novamente mais tarde." });
            }
        }

        [HttpPost("{id}/confirmar-visualizacao")]
        public async Task<ActionResult> ConfirmarVisualizacao(int id)
        {
            try
            {
                await _processoService.ConfirmarVisualizacaoAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao confirmar visualização: {ex.Message}");
            }
        }

        private async Task<bool> ProcessoExists(int id)
        {
            var processo = await _processoService.ObterPorIdAsync(id);
            return processo != null;
        }
    }
}
