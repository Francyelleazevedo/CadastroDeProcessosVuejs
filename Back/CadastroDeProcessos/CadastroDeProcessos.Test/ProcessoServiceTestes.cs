using CadastroDeProcessos.Application.Services;
using CadastroDeProcessos.Domain.Entities;
using CadastroDeProcessos.Domain.Interfaces;
using Moq;

namespace CadastroDeProcessos.Test
{
    public class ProcessoServiceTestes
    {
        private readonly Mock<IProcessoRepository> _mockRepo;
        private readonly ProcessoService _service;

        public ProcessoServiceTestes()
        {
            _mockRepo = new Mock<IProcessoRepository>();
            _service = new ProcessoService(_mockRepo.Object);
        }

        [Fact]
        public async Task ListarPaginadoAsync_DeveRetornarResultadosPaginados()
        {
            var processos = new List<Processo> { new Processo(), new Processo() };
            _mockRepo.Setup(r => r.GetTotalCountAsync()).ReturnsAsync(2);
            _mockRepo.Setup(r => r.GetPagedAsync(0, 2)).ReturnsAsync(processos);

            var result = await _service.ListarPaginadoAsync(1, 2);

            Assert.Equal(2, result.TotalItems);
            Assert.Equal(2, result.Items.Count());
        }

        [Fact]
        public async Task ObterPorIdAsync_DeveRetornarProcesso()
        {
            var processo = new Processo { Id = 1 };
            _mockRepo.Setup(r => r.ObterPorIdAsync(1)).ReturnsAsync(processo);

            var result = await _service.ObterPorIdAsync(1);

            Assert.Equal(1, result.Id);
        }

        [Fact]
        public async Task AdicionarAsync_DeveChamarRepositorio()
        {
            var processo = new Processo();
            _mockRepo.Setup(r => r.AdicionarAsync(processo)).Returns(Task.CompletedTask);
            _mockRepo.Setup(r => r.SalvarAsync()).Returns(Task.CompletedTask);

            await _service.AdicionarAsync(processo);

            _mockRepo.Verify(r => r.AdicionarAsync(processo), Times.Once);
            _mockRepo.Verify(r => r.SalvarAsync(), Times.Once);
        }

        [Fact]
        public async Task AtualizarAsync_DeveChamarRepositorio()
        {
            var processo = new Processo();
            _mockRepo.Setup(r => r.AtualizarAsync(processo)).Returns(Task.CompletedTask);
            _mockRepo.Setup(r => r.SalvarAsync()).Returns(Task.CompletedTask);

            await _service.AtualizarAsync(processo);

            _mockRepo.Verify(r => r.AtualizarAsync(processo), Times.Once);
            _mockRepo.Verify(r => r.SalvarAsync(), Times.Once);
        }

        [Fact]
        public async Task RemoverAsync_DeveChamarRepositorio()
        {
            var processo = new Processo { Id = 1 };
            _mockRepo.Setup(r => r.ObterPorIdAsync(1)).ReturnsAsync(processo);
            _mockRepo.Setup(r => r.RemoverAsync(processo)).Returns(Task.CompletedTask);
            _mockRepo.Setup(r => r.SalvarAsync()).Returns(Task.CompletedTask);

            await _service.RemoverAsync(1);

            _mockRepo.Verify(r => r.RemoverAsync(processo), Times.Once);
            _mockRepo.Verify(r => r.SalvarAsync(), Times.Once);
        }

        [Fact]
        public async Task ConfirmarVisualizacaoAsync_DeveAtualizarDataVisualizacao()
        {
            var processo = new Processo { Id = 1 };
            _mockRepo.Setup(r => r.ObterPorIdAsync(1)).ReturnsAsync(processo);
            _mockRepo.Setup(r => r.AtualizarAsync(processo)).Returns(Task.CompletedTask);
            _mockRepo.Setup(r => r.SalvarAsync()).Returns(Task.CompletedTask);

            await _service.ConfirmarVisualizacaoAsync(1);

            Assert.NotNull(processo.DataVisualizacao);
            _mockRepo.Verify(r => r.AtualizarAsync(processo), Times.Once);
            _mockRepo.Verify(r => r.SalvarAsync(), Times.Once);
        }
    }
}