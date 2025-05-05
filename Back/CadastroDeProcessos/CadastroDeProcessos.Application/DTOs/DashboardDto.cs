namespace CadastroDeProcessos.Application.DTOs
{
    public class DashboardDto
    {
        public int TotalProcessos { get; set; }
        public int ProcessosSemVisualizacao { get; set; }
        public int ProcessosUltimos30Dias { get; set; }

        public Dictionary<string, int> ProcessosPorUF { get; set; }
        public List<ProcessoRecenteDto> ProcessosRecentes { get; set; }
    }

    public class ProcessoRecenteDto
    {
        public int Id { get; set; }
        public string NomeProcesso { get; set; }
        public string NPU { get; set; }
        public DateTime DataCadastro { get; set; }
        public string UF { get; set; }
        public string Municipio { get; set; }
        public string Status { get; set; }
    }
}