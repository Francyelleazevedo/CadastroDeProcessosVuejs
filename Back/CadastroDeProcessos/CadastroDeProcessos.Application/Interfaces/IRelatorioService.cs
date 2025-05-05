using CadastroDeProcessos.Application.DTOs;

namespace CadastroDeProcessos.Application.Interfaces
{
    public interface IRelatorioService
    {
        Task<DashboardDto> GerarRelatorioMensalAsync(int mes, int ano);
    }
}
