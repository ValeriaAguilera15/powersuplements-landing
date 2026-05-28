import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();

// Configuración de CORS más robusta para producción
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Conexión a MongoDB Atlas
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
  .then(() => console.log('Conexión exitosa a MongoDB Atlas'))
  .catch((error) => console.error('Error al conectar a MongoDB:', error));

// Esquema
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

// Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Ruta principal
app.post('/api/contacto', async (req, res) => {
  try {
    const { nombre, email, telefono, disciplina, objetivo, mensaje } = req.body;

    if (!nombre || !email || !disciplina || !objetivo) {
      return res.status(400).json({ error: 'Faltan campos' });
    }

    const nuevoContacto = new Contacto({ nombre, email, telefono, disciplina, objetivo, mensaje });
    await nuevoContacto.save();

    const mailOptions = {
      from: `"Power Supplements" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `Nueva Asesoría: ${nombre}`,
      html: `
        <div style="font-family: sans-serif; background: #000; color: #fff; padding: 20px;">
          <h2 style="color: #99ff00;">Nueva solicitud</h2>
          <p><strong>Nombre:</strong> ${nombre}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Disciplina:</strong> ${disciplina}</p>
          <p><strong>Objetivo:</strong> ${objetivo}</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(201).json({ message: 'Enviado con éxito' });
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' });
  }
});

app.get('/', (req, res) => {
  res.send('Servidor activo.');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Puerto ${PORT}`);
});
