using CadastroDeProcessos.Domain.Entities;
using AutoMapper;
using CadastroDeProcessos.Application.DTOs;

namespace CadastroDeProcessos.Application.Mappings
{
    public class ProcessoProfile : Profile
    {
        public ProcessoProfile()
        {
            CreateMap<Processo, ProcessoDto>().ReverseMap();
        }
    }
}
