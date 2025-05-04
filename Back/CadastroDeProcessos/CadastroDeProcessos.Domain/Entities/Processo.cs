namespace CadastroDeProcessos.Domain.Entities;

public class Processo
{
    public int Id { get; set; }
    public string NomeProcesso { get; set; }
    public string NPU { get; set; }
    public DateTime DataCadastro { get; set; }
    public DateTime? DataVisualizacao { get; set; }
    public string UF { get; set; }
    public string Municipio { get; set; }
    public string CodigoMunicipio { get; set; }
}
