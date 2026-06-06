import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// CONFIGURACIÓN DE CORS AVANZADA
// ==========================================
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// ==========================================
// CONEXIÓN A MONGODB ATLAS (CON DB FORZADA)
// ==========================================
mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI, {
  dbName: 'powersuplements' 
})
  .then(() => console.log('¡Conectado con éxito a la base de datos powersuplements en Atlas!'))
  .catch((err) => console.error('Error crítico al conectar a MongoDB:', err));

// ==========================================
// DEFINICIÓN DE ESQUEMAS Y MODELOS
// ==========================================

const productoSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.Mixed, 
  nombre: String,
  descripcion: String,
  precio: Number,
  imagen_url: String,
  stock: Number
}, { collection: 'productos' });

const Producto = mongoose.models.Producto || mongoose.model('Producto', productoSchema);

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

// GET: Obtener productos formateados para React
app.get('/api/productos', async (req, res) => {
  try {
    const productosDB = await Producto.find({}).lean(); 

    const productosFormateados = productosDB.map(p => {
      let finalId = "";
      if (p.id !== undefined && p.id !== null) {
        finalId = p.id.toString();
      } else if (p._id) {
        finalId = p._id.toString();
      }

      return {
        id: finalId, 
        nombre: p.nombre || "",
        descripcion: p.descripcion || "",
        precio: p.precio || 0,
        imagen_url: p.imagen_url || "", 
        stock: p.stock || 0
      };
    });

    console.log("Productos enviados con éxito al frontend:", productosFormateados);
    res.json(productosFormateados);
  } catch (error) {
    console.error("Error crítico en GET /api/productos:", error);
    res.status(500).json({ error: 'Error interno en el servidor al formatear los productos' });
  }
});

// POST: Guardar registros del formulario de asesoría
app.post('/api/contacto', async (req, res) => {
  try {
    const { nombre, email, telefono, disciplina, objetivo, mensaje } = req.body;

    if (!nombre || !email || !disciplina) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
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

app.get('/', (req, res) => {
  res.send('Servidor de Power Suplements corriendo perfectamente.');
});

app.listen(PORT, () => {
  console.log(`Servidor activo en el puerto: ${PORT}`);
});
