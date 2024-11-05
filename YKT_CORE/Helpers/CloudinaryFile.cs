using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Threading.Tasks;

namespace YKT_CORE.Helpers
{
    public class CloudinaryFile
    {
        private readonly Cloudinary _cloudinary;

        public CloudinaryFile()
        {
            var account = new Account(
                "dn9kck1sm", // CloudName
                "469489488726841", // API Key
                "KQHMDjZM1LrO2zuECxaGvN2YR0Q" // API Secret
            );

            _cloudinary = new Cloudinary(account);
        }

        // Método para subir un archivo a Cloudinary
        public async Task<string> UploadFileAsync(IFormFile archivo)
        {
            if (archivo == null || archivo.Length == 0)
            {
                throw new ArgumentException("El archivo no puede ser nulo o vacío.", nameof(archivo));
            }

            using (var stream = archivo.OpenReadStream())
            {
                var uploadParams = new ImageUploadParams()
                {
                    File = new FileDescription(archivo.FileName, stream)
                };

                var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                if (uploadResult.StatusCode == System.Net.HttpStatusCode.OK)
                {
                    return uploadResult.SecureUrl.ToString();
                }
                else
                {
                    throw new Exception($"Error al subir la imagen: {uploadResult.Error.Message}");
                }
            }
        }

        // Método para eliminar un archivo de Cloudinary por su ID
        public async Task DeleteFileAsync(string publicId)
        {
            var deletionParams = new DeletionParams(publicId);
            var deletionResult = await _cloudinary.DestroyAsync(deletionParams);

            if (deletionResult.Result != "ok")
            {
                throw new Exception($"Error al eliminar el archivo: {deletionResult.Error?.Message}");
            }
        }

        // Método para obtener el archivo como Stream desde Cloudinary
        public async Task<Stream> DownloadFileAsync(string publicId)
        {
            var url = _cloudinary.Api.UrlImgUp.BuildUrl(publicId); // Construye la URL para acceder al archivo

            using (var client = new HttpClient())
            {
                var response = await client.GetAsync(url);

                if (response.IsSuccessStatusCode)
                {
                    var memoryStream = new MemoryStream();
                    await response.Content.CopyToAsync(memoryStream);
                    memoryStream.Position = 0; 

                    return memoryStream;
                }
                else
                {
                    throw new Exception($"Error al descargar el archivo: {response.ReasonPhrase}");
                }
            }
        }
    }
}
