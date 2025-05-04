using CadastroDeProcessos.Application.Common;
using CadastroDeProcessos.Domain.Entities;

namespace CadastroDeProcessos.Application.Interfaces;

public interface IProcessoService
{
    Task<PagedResult<Processo>> ListarPaginadoAsync(int pageNumber, int pageSize);
    Task<Processo> ObterPorIdAsync(int id);
    Task AdicionarAsync(Processo processo);  
    Task AtualizarAsync(Processo processo);
    Task RemoverAsync(int id);
    Task ConfirmarVisualizacaoAsync(int id);
}
