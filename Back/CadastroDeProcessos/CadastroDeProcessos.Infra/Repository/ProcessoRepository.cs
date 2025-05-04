using Microsoft.EntityFrameworkCore;
using CadastroDeProcessos.Domain.Entities;
using CadastroDeProcessos.Domain.Interfaces;
using CadastroDeProcessos.Infra.Context;
using CadastroDeProcessos.Infra.Exceptions;
using CadastroDeProcessos.Infra.Repository;

namespace CadastroDeProcessos.Infra.Repositories
{
    public class ProcessoRepository(ApplicationDbContext contexto) : BaseRepository<Processo>(contexto), IProcessoRepository
    {
        private readonly ApplicationDbContext _context = contexto;

        public async Task<int> GetTotalCountAsync()
        {
            try
            {
                return await _context.Processos.CountAsync();
            }
            catch (DbUpdateException ex)
            {
                throw new InfrastructureException("Erro ao contar o número total de processos.", ex);
            }
        }

        public async Task<List<Processo>> GetPagedAsync(int skip, int take)
        {
            if (skip < 0)
                throw new ArgumentException("O valor de 'skip' não pode ser negativo.", nameof(skip));
            if (take <= 0)
                throw new ArgumentException("O valor de 'take' deve ser maior que zero.", nameof(take));

            try
            {
                return await _context.Processos
                    .AsNoTracking()
                    .OrderByDescending(p => p.Id)
                    .Skip(skip)
                    .Take(take)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new InfrastructureException("Erro ao obter a lista paginada de processos.", ex);
            }
        }
    }
}
