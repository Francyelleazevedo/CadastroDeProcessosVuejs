using CadastroDeProcessos.Application.Interfaces;
using CadastroDeProcessos.Application.Common;
using CadastroDeProcessos.Domain.Entities;
using CadastroDeProcessos.Domain.Interfaces;

namespace CadastroDeProcessos.Application.Services
{
    public class ProcessoService(IProcessoRepository processoRepository) : IProcessoService
    {
        private readonly IProcessoRepository _processoRepository = processoRepository;

        #region Obter
        public async Task<PagedResult<Processo>> ListarPaginadoAsync(int pageNumber, int pageSize)
        {
            if (pageNumber <= 0) throw new ArgumentException("O número da página deve ser maior que zero.", nameof(pageNumber));
            if (pageSize <= 0) throw new ArgumentException("O tamanho da página deve ser maior que zero.", nameof(pageSize));
            try
            {
                int totalItems = await _processoRepository.GetTotalCountAsync();
                int skip = (pageNumber - 1) * pageSize;
                var processos = await _processoRepository.GetPagedAsync(skip, pageSize);

                return new PagedResult<Processo>
                {
                    Items = processos,
                    TotalItems = totalItems,
                    PageNumber = pageNumber,
                    PageSize = pageSize
                };
            }
            catch (Exception ex)
            {
                throw new Exception("Erro ao obter a lista de processos.", ex);
            }
        }

        public async Task<Processo> ObterPorIdAsync(int id)
        {
            ValidateId(id);
            try
            {
                var processo = await _processoRepository.ObterPorIdAsync(id);
                return processo;
            }
            catch (Exception ex)
            {
                throw new Exception("Erro ao obter o processo.", ex);
            }
        }
        #endregion

        #region Adicionar
        public async Task AdicionarAsync(Processo processo)
        {
            if (processo == null) throw new ArgumentNullException(nameof(processo), "O processo não pode ser nulo.");
            try
            {
                processo.DataCadastro = DateTime.Now;
                await _processoRepository.AdicionarAsync(processo);
                await _processoRepository.SalvarAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Erro ao adicionar o processo.", ex);
            }
        }
        #endregion

        #region Atualizar
        public async Task AtualizarAsync(Processo processo)
        {
            if (processo == null) throw new ArgumentNullException(nameof(processo), "O processo não pode ser nulo.");
            try
            {
                await _processoRepository.AtualizarAsync(processo);
                await _processoRepository.SalvarAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Erro ao atualizar o processo.", ex);
            }
        }
        #endregion

        #region Remover
        public async Task RemoverAsync(int id)
        {
            ValidateId(id);
            try
            {
                var processo = await _processoRepository.ObterPorIdAsync(id) ?? throw new Exception("Processo não encontrado.");
                await _processoRepository.RemoverAsync(processo);
                await _processoRepository.SalvarAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        #endregion

        #region Confirmar Visualizacao
        public async Task ConfirmarVisualizacaoAsync(int id)
        {
            ValidateId(id);
            try
            {
                var processo = await _processoRepository.ObterPorIdAsync(id) ?? throw new Exception("Processo não encontrado.");
                processo.DataVisualizacao = DateTime.Now;
                await _processoRepository.AtualizarAsync(processo);
                await _processoRepository.SalvarAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Erro ao confirmar a visualização do processo.", ex);
            }
        }
        #endregion

        #region Validações
        private static void ValidateId(int id)
        {
            if (id <= 0) throw new ArgumentException("O ID deve ser maior que zero.", nameof(id));
        }
        #endregion
    }
}
