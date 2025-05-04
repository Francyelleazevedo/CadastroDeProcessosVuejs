using CadastroDeProcessos.Domain.Entities;
using FluentValidation;

namespace CadastroDeProcessos.Application.Validator
{
    public class ProcessoValidator : AbstractValidator<Processo>
    {
        public ProcessoValidator()
        {
            RuleFor(p => p.NomeProcesso)
           .NotEmpty().WithMessage("O nome do processo é obrigatório.");

            RuleFor(p => p.NPU)
                .NotEmpty().WithMessage("O NPU é obrigatório.")
                .Matches(@"\d{7}-\d{2}\.\d{4}\.\d{1}\.\d{2}\.\d{4}").WithMessage("Formato de NPU inválido.");

            RuleFor(p => p.UF)
                .NotEmpty().WithMessage("A UF é obrigatória.");

            RuleFor(p => p.Municipio)
                .NotEmpty().WithMessage("O município é obrigatório.");
        }
    }
}
