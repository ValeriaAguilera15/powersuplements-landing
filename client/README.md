# Power Supplements - Landing Page

Aplicación full-stack para la gestión de perfiles deportivos y automatización de solicitudes de asesorías nutricionales.

## Cliente Elegido
**Power Supplements**: Tienda local de suplementación deportiva de alta gama orientada a atletas de alto rendimiento (CrossFit, halterofilia y entrenamientos funcionales). El sistema resuelve la necesidad de captar datos específicos de entrenamiento (disciplina, metas y dudas) para ofrecer asesorías personalizadas directas de forma inmediata.

## Tecnologías
- Frontend: React
- Backend: Node.js, Express
- Base de Datos: MongoDB Atlas (Mongoose)
- Notificaciones: Nodemailer

## Configuración del Entorno

### Backend
Crear un archivo `.env` en la carpeta `backend/` basándose en el archivo `.env.example`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/powersupplements
EMAIL_USER=tu_correo_corporativo@gmail.com
EMAIL_PASS=tu_clave
