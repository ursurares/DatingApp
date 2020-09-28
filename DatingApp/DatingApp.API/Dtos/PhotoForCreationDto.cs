using System;
using Microsoft.AspNetCore.Http;

namespace DatingApp.API.Dtos
{
    public class PhotoForCreationDto
    {
        public string Url { get; set; }

        public IFormFile File { get; set; }
        public string Description { get; set; }
        public DateTime DateAded { get; set; }
        public string PublicId { get; set; }

        public PhotoForCreationDto()
        {
            DateAded=DateTime.Now;
        }
    }
}