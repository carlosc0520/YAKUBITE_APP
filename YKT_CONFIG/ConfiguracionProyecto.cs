namespace YKT.CONFIG
{
    public class ConfiguracionProyecto
    {
        public const string PROYECTO = PROYECTOS.YAKUBITE;
        public const string TEMA = TEMAS.Default;
        public const string ENTORNO_DESPLIEGUE = ENTORNOS.Desarrollo;

        public const int TIEMPO_SESION_MINUTOS = 120;

        public const string DISK = ""; //"C:\\yakubite\\";
        public const string HOST = ""; // "C:\\yakubite\\";

        public static class TEMAS
        {
            public const string Default = "default";
        }
        public static class PROYECTOS
        {
            public const string YAKUBITE = "YAKUBITE";
        }
        public static class ENTORNOS
        {
            public const string Desarrollo = "Development";
            public const string Pruebas = "Staging";
            public const string Produccion = "Production";
        }

        public static class CARPETAS_DESPLIEGUE
        {
            public const string Login_Web = "login";
            public const string Seguridad_Web = "sgs-web";
            public const string Persona_Web = "per-web";
        }

        public static class CADENA_CONEXION
        {
            public const string Seguridad = "DefaultConnection";
            public const string Persona = "DefaultConnection";
        }

        public static class CAPTCHA
        {
            public const string SecretKey = "6Lcd6LAmAAAAABgcM7kchoISw0lw9TADkxGdSsLL";
            public const decimal ScoreAdmitido = 0.5M;
        }

    }
}
