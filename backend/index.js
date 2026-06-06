const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado con éxito a MongoDB Atlas'))
  .catch((error) => console.error('Error al conectar a MongoDB:', error));

// ====== 1. ESQUEMA DE CONTACTOS / ASESORÍAS ======
const contactoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true },
  telefono: String,
  disciplina: { type: String, required: true },
  objetivo: { type: String, required: true },
  mensaje: String,
  fecha: { type: Date, default: Date.now }
});

const Contacto = mongoose.model('Contacto', contactoSchema);

// ====== 2. ESQUEMA DE PRODUCTOS ======
const productoSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  precio: { type: Number, required: true },
  imagen_url: { type: String, required: true },
  stock: { type: Number, default: 0 }
});

const Producto = mongoose.model('Producto', productoSchema);

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ====== RUTA: Guardar Asesoría y enviar Correo ======
app.post('/api/contacto', async (req, res) => {
  try {
    const nuevoContacto = new Contacto(req.body);
    await nuevoContacto.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, 
      subject: `💪 Nueva Solicitud de Asesoría: ${req.body.nombre}`,
      html: `
        <div style="background-color: #000; color: #fff; padding: 20px; font-family: sans-serif; border: 1px solid #222; border-radius: 8px;">
          <h2 style="color: #99ff00; border-bottom: 1px solid #111; padding-bottom: 10px;">NUEVA SOLICITUD DE ASESORÍA</h2>
          <p><strong>Nombre:</strong> ${req.body.nombre}</p>
          <p><strong>Email:</strong> ${req.body.email}</p>
          <p><strong>Teléfono:</strong> ${req.body.telefono || 'No especificado'}</p>
          <p><strong>Disciplina:</strong> ${req.body.disciplina}</p>
          <p><strong>Objetivo Automatizado:</strong> ${req.body.objetivo}</p>
          <p><strong>Mensaje:</strong> ${req.body.mensaje || 'Sin mensaje adicional'}</p>
          <br />
          <p style="color: #555; font-size: 12px;">Recibido desde Power Suplements Landing &copy; 2026</p>
        </div>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.error('Error al enviar el email:', error);
      else console.log('Email enviado: ' + info.response);
    });

    res.status(201).json({ mensaje: 'Asesoría registrada y correo enviado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error al registrar la asesoría' });
  }
});

// ====== RUTA: Obtener productos desde MongoDB ======
app.get('/api/productos', async (req, res) => {
  try {
    const productos = await Producto.find().sort({ id: 1 });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos de MongoDB' });
  }
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor activo.');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
