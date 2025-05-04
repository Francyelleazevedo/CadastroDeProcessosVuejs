using CadastroDeProcessos.Application.DTOs;

namespace CadastroDeProcessos.Application.Interfaces
{
    public interface IIBGELocalidadeService
    {
        Task<IEnumerable<MunicipioDto>> ObterMunicipiosPorUFAsync(string uf);
    }
}
