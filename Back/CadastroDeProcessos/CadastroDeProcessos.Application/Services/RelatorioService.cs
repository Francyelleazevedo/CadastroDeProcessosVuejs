using CadastroDeProcessos.Application.DTOs;
using CadastroDeProcessos.Application.Interfaces;
using System.Linq;

namespace CadastroDeProcessos.Application.Services
{
    public class RelatorioService(IProcessoService processoService) : IRelatorioService
    {
        private readonly IProcessoService _processoService = processoService;

        public async Task<DashboardDto> GerarRelatorioMensalAsync(int mes, int ano)
        {
            var todosProcessos = await _processoService.ListarAsync();

            var processosDoPeriodo = todosProcessos
                .Where(p => p.DataCadastro.Month == mes && p.DataCadastro.Year == ano)
                .ToList();

            var dataLimite = DateTime.Now.AddDays(-30);
            var processosUltimos30Dias = todosProcessos.Count(p => p.DataCadastro >= dataLimite);

            var processosPorUF = todosProcessos
                .GroupBy(p => p.UF)
                .ToDictionary(g => g.Key, g => g.Count());

            var processosRecentes = todosProcessos
                .OrderByDescending(p => p.DataCadastro)
                .Take(5)
                .Select(p => new ProcessoRecenteDto
                {
                    Id = p.Id,
                    NomeProcesso = p.NomeProcesso,
                    NPU = p.NPU,
                    DataCadastro = p.DataCadastro,
                    UF = p.UF,
                    Municipio = p.Municipio
                })
                .ToList();

            var processosSemVisualizacao = todosProcessos.Where(p => p.DataVisualizacao is null).Count();

            return new DashboardDto
            {
                TotalProcessos = todosProcessos.Count(),
                ProcessosSemVisualizacao = processosSemVisualizacao,
                ProcessosUltimos30Dias = processosUltimos30Dias,
                ProcessosPorUF = processosPorUF,
                ProcessosRecentes = processosRecentes
            };
        }

    }
}
