using CadastroDeProcessos.Domain.Entities;

namespace CadastroDeProcessos.Domain.Interfaces;

public interface IProcessoRepository
{
    Task<int> GetTotalCountAsync();
    Task<List<Processo>> GetPagedAsync(int skip, int take);
    Task<IEnumerable<Processo>> ListarAsync();
    Task<Processo> ObterPorIdAsync(int id);
    Task AdicionarAsync(Processo processo);
    Task AtualizarAsync(Processo processo);
    Task RemoverAsync(Processo processo);
    Task SalvarAsync();
}

