import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configuración de CORS
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// ==========================================
// CONEXIÓN A MONGODB ATLAS (CORREGIDA)
// ==========================================
// Se utiliza dbName: 'powersupplements' para coincidir con tu Atlas
mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI, {
  dbName: 'powersupplements' 
})
  .then(() => console.log('¡Conectado con éxito a la base de datos powersupplements en Atlas!'))
  .catch((err) => console.error('Error crítico al conectar a MongoDB:', err));

// ==========================================
// MODELOS
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

app.get('/api/productos', async (req, res) => {
  try {
    const productosDB = await Producto.find({}).lean(); 
    
    // Mapeo seguro para el frontend
    const productosFormateados = productosDB.map(p => ({
      id: (p.id || p._id || "").toString(),
      nombre: p.nombre || "",
      descripcion: p.descripcion || "",
      precio: p.precio || 0,
      imagen_url: p.imagen_url || p.imagen || "", 
      stock: p.stock || 0
    }));

    console.log("Productos enviados al frontend:", productosFormateados);
    res.json(productosFormateados);
  } catch (error) {
    console.error("Error en GET /api/productos:", error);
    res.status(500).json({ error: 'Error interno en el servidor' });
  }
});

app.post('/api/contacto', async (req, res) => {
  try {
    const nuevoContacto = new Contacto(req.body);
    await nuevoContacto.save();
    res.status(201).json({ mensaje: '¡Éxito!' });
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar el formulario' });
  }
});

app.get('/', (req, res) => res.send('Servidor activo.'));

app.listen(PORT, () => console.log(`Servidor en puerto: ${PORT}`));
