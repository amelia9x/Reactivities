using Application.Activities;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
       public MappingProfiles()
       {
            CreateMap<Activity, Activity>();
            CreateMap<Activity, ActivityDto>()
                .ForMember(x => x.HostUserName, o => o.MapFrom(s => s.Attendees
                    .FirstOrDefault(x => x.IsHost).AppUser.UserName));
            CreateMap<ActivityAttendee, Profiles.Profile>()
                .ForMember(x => x.UserName, o => o.MapFrom(x => x.AppUser.UserName))
                .ForMember(x => x.DisplayName, o => o.MapFrom(x => x.AppUser.DisplayName))
                .ForMember(x => x.Bio, o => o.MapFrom(x => x.AppUser.Bio));
            CreateMap<AppUser, Profiles.Profile>()
                .ForMember(d => d.Image, o => o.MapFrom(s => s.Photos.FirstOrDefault(x => x.IsMain).Url));
       } 
    }
}