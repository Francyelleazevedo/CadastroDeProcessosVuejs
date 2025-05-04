using System.ComponentModel.DataAnnotations;

namespace CadastroDeProcessos.Application.DTOs
{
    public class ProcessoDto
    {
        public string NomeProcesso { get; set; }

        [RegularExpression(@"\d{7}-\d{2}\.\d{4}\.\d{1}\.\d{2}\.\d{4}", ErrorMessage = "Formato de NPU inválido.")]
        public string NPU { get; set; }
        public string UF { get; set; }
        public string Municipio { get; set; }
        public string CodigoMunicipio { get; set; }
    }
}
