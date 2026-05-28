import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB Atlas
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
  .then(() => console.log(' Conexión exitosa a MongoDB Atlas'))
  .catch((error) => console.error(' Error al conectar a MongoDB:', error));

// Esquema actualizado con el perfil deportivo completo del Frontend
const contactoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true },
  telefono: { type: String, default: '' },
  disciplina: { type: String, required: true },
  objetivo: { type: String, required: true },
  mensaje: { type: String, default: '' },
  fecha: { type: Date, default: Date.now }
});

const Contacto = mongoose.model('Contacto', contactoSchema);

// Configuración de Nodemailer (Servicio de correos usando Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Tu correo de Gmail corporativo o personal
    pass: process.env.EMAIL_PASS  // Tu contraseña de aplicación de Google
  }
});

// Ruta POST para recibir y procesar el formulario
app.post('/api/contacto', async (req, res) => {
  try {
    const { nombre, email, telefono, disciplina, objetivo, mensaje } = req.body;

    // Validación básica de campos obligatorios
    if (!nombre || !email || !disciplina || !objetivo) {
      return res.status(400).json({ error: 'Faltan campos obligatorios en el perfil deportivo' });
    }

    // 1. Guardar en la Base de Datos
    const nuevoContacto = new Contacto({ nombre, email, telefono, disciplina, objetivo, mensaje });
    await nuevoContacto.save();

    // 2. Enviar Correo de Notificación Automática de Asesoría
    const mailOptions = {
      from: `"Power Supplements Asesorías" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Te llegará a ti misma para avisarte
      subject: ` Nueva Solicitud de Asesoría: ${nombre}`,
      html: `
        <div style="font-family: sans-serif; background-color: #000; color: #fff; padding: 20px; border-radius: 8px; border: 1px solid #99ff00;">
          <h2 style="color: #99ff00;">¡Tienes un nuevo perfil deportivo para revisar!</h2>
          <p><strong>Nombre:</strong> ${nombre}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>WhatsApp/Teléfono:</strong> ${telefono || 'No provisto'}</p>
          <p><strong>Disciplina:</strong> ${disciplina}</p>
          <p><strong>Objetivo Principal:</strong> ${objetivo}</p>
          <p><strong>Mensaje o dudas:</strong> ${mensaje || 'Sin comentarios adicionales'}</p>
          <hr style="border: 0; border-top: 1px solid #222; margin: 20px 0;">
          <p style="color: #71717a; font-size: 12px;">Este mensaje fue generado automáticamente desde la Landing Page.</p>
        </div>
      `
    };

    // Enviamos el mail de fondo de forma asíncrona
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.error(' Error al enviar el email:', error);
      else console.log(' Correo de asesoría enviado con éxito:', info.response);
    });

    res.status(201).json({ message: '¡Perfil deportivo guardado y enviado con éxito!' });
  } catch (error) {
    console.error('Error en el servidor:', error);
    res.status(500).json({ error: 'Hubo un error interno en el servidor' });
  }
});

app.get('/', (req, res) => {
  res.send('Servidor de Power Supplements corriendo perfectamente.');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en el puerto ${PORT}`);
});

