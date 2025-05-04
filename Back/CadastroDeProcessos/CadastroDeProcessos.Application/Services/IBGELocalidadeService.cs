using CadastroDeProcessos.Application.DTOs;
using CadastroDeProcessos.Application.Interfaces;
using System.Text.Json;

public class IBGELocalidadeService : IIBGELocalidadeService
{
    private readonly HttpClient _httpClient;

    public IBGELocalidadeService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<IEnumerable<MunicipioDto>> ObterMunicipiosPorUFAsync(string uf)
    {
        var response = await _httpClient.GetAsync($"https://servicodados.ibge.gov.br/api/v1/localidades/estados/{uf}/municipios");

        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var municipios = JsonSerializer.Deserialize<List<MunicipioDto>>(content, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        return municipios ?? new List<MunicipioDto>();
    }
}
