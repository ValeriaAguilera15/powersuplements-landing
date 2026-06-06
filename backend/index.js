import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Configuración de variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// ==========================================
// CONEXIÓN A MONGODB ATLAS
// ==========================================
mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI)
  .then(() => console.log('¡Conectado con éxito a MongoDB Atlas!'))
  .catch((err) => console.error('Error crítico al conectar a MongoDB:', err));

// ==========================================
// DEFINICIÓN DE ESQUEMAS Y MODELOS
// ==========================================

// Esquema de Productos (Incluye tu 'id' numérico manual)
const productoSchema = new mongoose.Schema({
  id: Number, 
  nombre: String,
  descripcion: String,
  precio: Number,
  imagen_url: String,
  stock: Number
}, { collection: 'productos' });

const Producto = mongoose.models.Producto || mongoose.model('Producto', productoSchema);

// Esquema de Contactos (Campos flexibles para evitar Error 400)
const contactoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true },
  telefono: String,
  disciplina: { type: String, required: true },
  objetivo: { type: String, default: "No especificado" },
  mensaje: { type: String, default: "" },
  fecha: { type: Date, default: Date.now }
}, { collection: 'contactos' });

const Contacto = mongoose.models.Contacto || mongoose.model('Contacto', contactoSchema);

// ==========================================
// RUTAS DE LA API
// ==========================================

// 1. GET: Obtener productos formateados para React
app.get('/api/productos', async (req, res) => {
  try {
    const productosDB = await Producto.find({}).lean(); 

    // Mapeamos para garantizar que React reciba la propiedad 'id' como un String estable
    const productosFormateados = productosDB.map(p => ({
      id: p.id ? p.id.toString() : p._id.toString(), 
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio: p.precio,
      imagen_url: p.imagen_url, 
      stock: p.stock
    }));

    console.log("Productos enviados con éxito al frontend:", productosFormateados);
    res.json(productosFormateados);
  } catch (error) {
    console.error("Error en GET /api/productos:", error);
    res.status(500).json({ error: 'Error al obtener los productos desde MongoDB' });
  }
});

// 2. POST: Guardar registros del formulario de asesoría
app.post('/api/contacto', async (req, res) => {
  try {
    const { nombre, email, telefono, disciplina, objetivo, mensaje } = req.body;

    if (!nombre || !email || !disciplina) {
      return res.status(400).json({ error: 'Faltan campos obligatorios (nombre, email o disciplina)' });
    }

    const nuevoContacto = new Contacto({
      nombre,
      email,
      telefono,
      disciplina,
      objetivo: objetivo || "No especificado", 
      mensaje: mensaje || ""
    });

    await nuevoContacto.save();
    res.status(201).json({ mensaje: '¡Perfil de asesoría guardado con éxito!' });
  } catch (error) {
    console.error("Error en POST /api/contacto:", error);
    res.status(500).json({ error: 'Error interno al procesar el formulario' });
  }
});

// Ruta base de prueba
app.get('/', (req, res) => {
  res.send('Servidor de Power Suplements corriendo perfectamente.');
});

// Inicialización del servidor
app.listen(PORT, () => {
  console.log(`Servidor activo en el puerto: ${PORT}`);
});
