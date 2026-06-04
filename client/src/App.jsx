import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; // Asegúrate de tener este archivo creado
import logoImg from './assets/logo.jpg';

function App() {
  const [productos, setProductos] = useState([]);
  const [modalProducto, setModalProducto] = useState(null);
  const [carrito, setCarrito] = useState({});
  const [formData, setFormData] = useState({ /* ... tu estado de form igual ... */ });
  const [status, setStatus] = useState('');

  // 1. Cargar productos desde Supabase
  useEffect(() => {
    const fetchProductos = async () => {
      const { data, error } = await supabase.from('productos').select('*');
      if (data) setProductos(data);
    };
    fetchProductos();
  }, []);

  // 2. Lógica de Carrito
  const ajustarCantidad = (id, delta) => {
    setCarrito(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta)
    }));
  };

  const finalizarCompra = () => {
    const pedido = Object.entries(carrito)
      .filter(([_, cant]) => cant > 0)
      .map(([id, cant]) => {
        const prod = productos.find(p => p.id == id);
        return `${prod.nombre} (x${cant})`;
      }).join(', ');
    window.open(`https://wa.me/584146045659?text=Hola, quiero comprar: ${pedido}`, '_blank');
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh' }}>
      
      {/* SECCIÓN PRODUCTOS (Reemplaza tu grid actual) */}
      <section id="productos" style={{ padding: '80px 5%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>PRODUCTOS <span style={{ color: '#99ff0083' }}>DISPONIBLES</span></h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
          {productos.map((prod) => (
            <div key={prod.id} style={cardStyle}>
              <img 
                src={`/${prod.imagen_url}`} 
                alt={prod.nombre} 
                onClick={() => setModalProducto(prod)} 
                style={{ cursor: 'pointer', width: '100%', height: '200px', objectFit: 'cover' }} 
              />
              <h3>{prod.nombre}</h3>
              <p>{prod.descripcion}</p>
              <p>Precio: ${prod.precio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL DE PRODUCTO */}
      {modalProducto && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#111', padding: '30px', borderRadius: '12px', border: '1px solid #333', maxWidth: '400px' }}>
            <h2>{modalProducto.nombre}</h2>
            <p>{modalProducto.descripcion}</p>
            <p>Precio: ${modalProducto.precio}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', margin: '20px 0' }}>
              <button onClick={() => ajustarCantidad(modalProducto.id, -1)}>-</button>
              <span>{carrito[modalProducto.id] || 0}</span>
              <button onClick={() => ajustarCantidad(modalProducto.id, 1)}>+</button>
            </div>
            <button onClick={() => setModalProducto(null)}>Cerrar</button>
          </div>
        </div>
      )}

      {/* BOTÓN FLOTANTE DE COMPRA */}
      {Object.values(carrito).some(v => v > 0) && (
        <button onClick={finalizarCompra} style={{ position: 'fixed', bottom: '20px', right: '20px', background: '#99ff00', padding: '15px' }}>
          Finalizar Pedido en WhatsApp
        </button>
      )}

      {/* ... resto de tu código de formulario ... */}
    </div>
  );
}