using CadastroDeProcessos.Domain.Interfaces;
using CadastroDeProcessos.Infra.Context;
using Microsoft.EntityFrameworkCore;

namespace CadastroDeProcessos.Infra.Repository
{
    public class BaseRepository<T> : IRepository<T> where T : class
    {
        protected readonly ApplicationDbContext _contexto;
        protected readonly DbSet<T> _dbSet;

        public BaseRepository(ApplicationDbContext contexto)
        {
            _contexto = contexto;
            _dbSet = _contexto.Set<T>();
        }

        public async Task<IEnumerable<T>> ListarAsync()
        {
            return await _dbSet.Where(e => EF.Property<bool>(e, "Ativo") == true).ToListAsync();
        }

        public async Task<T> ObterPorIdAsync(int id)
        {
            return await _dbSet.FindAsync(id);
        }

        public async Task AdicionarAsync(T entidade)
        {
            await _dbSet.AddAsync(entidade);
        }

        public async Task AtualizarAsync(T entidade)
        {
            _dbSet.Update(entidade);
        }

        public async Task RemoverAsync(T entidade)
        {
            _dbSet.Remove(entidade);
        }

        public async Task SalvarAsync()
        {
            await _contexto.SaveChangesAsync();
        }
    }
}
