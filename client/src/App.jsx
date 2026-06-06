import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

function App() {
  // Estado para almacenar los productos traídos de Supabase
  const [listaProductos, setListaProductos] = useState([]);
  
  // Estado para el carrito de compras (clave: id_producto, valor: cantidad)
  const [carrito, setCarrito] = useState({});

  // Estado para el formulario de asesoría profesional
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    disciplina: '',
    objetivo: '',
    mensaje: ''
  });
  const [status, setStatus] = useState('');

  // 1. CARGAR PRODUCTOS DESDE SUPABASE AL INICIAR
  useEffect(() => {
    const obtenerProductos = async () => {
      console.log("Intentando conectar a Supabase...");
      try {
        const { data, error } = await supabase
          .from('productos')
          .select('*')
          .order('id', { ascending: true });

        if (error) {
          console.error("Error devuelto por Supabase:", error);
          throw error;
        }

        console.log("Datos recibidos con éxito de Supabase:", data);

        if (data) {
          setListaProductos(data);
          // Inicializar dinámicamente las cantidades del carrito en 0 usando los IDs de la BD
          const carritoInicial = {};
          data.forEach(p => {
            carritoInicial[p.id] = 0;
          });
          setCarrito(carritoInicial);
        }
      } catch (error) {
        console.error('Error crítico al cargar productos:', error.message);
      }
    };

    obtenerProductos();
  }, []);

  // 2. LÓGICA DEL CARRITO (Incrementar / Decrementar)
  const incrementarProducto = (id) => {
    setCarrito(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const decrementarProducto = (id) => {
    setCarrito(prev => ({ ...prev, [id]: prev[id] > 0 ? prev[id] - 1 : 0 }));
  };

  // Cálculos dinámicos del total de unidades y monto acumulado
  const totalItems = Object.values(carrito).reduce((a, b) => a + b, 0);
  const montoTotal = listaProductos.reduce((total, p) => total + ((carrito[p.id] || 0) * p.precio), 0);

  // 3. ENVÍO DEL PEDIDO ACUMULADO A WHATSAPP
  const enviarPedidoWhatsApp = () => {
    const telefonoWhatsApp = "584146045659";
    const productosPedidos = listaProductos.filter(p => carrito[p.id] > 0);
    
    if (productosPedidos.length === 0) {
      alert("Por favor, agrega al menos un producto al carrito antes de comprar.");
      return;
    }

    let textoProductos = "";
    productosPedidos.forEach(p => {
      textoProductos += `• ${carrito[p.id]}x ${p.nombre} - $${p.precio * carrito[p.id]}\n`;
    });

    const mensajeWA = encodeURIComponent(
      `¡Hola, Power Suplements! 👋\n\n` +
      `Me interesa realizar el siguiente pedido desde la web:\n\n` +
      `${textoProductos}\n` +
      `💰 *Monto Total Estimado:* $${montoTotal}\n\n` +
      `¿Tienen disponibilidad para coordinar la entrega?`
    );

    window.open(`https://wa.me/${telefonoWhatsApp}?text=${mensajeWA}`, '_blank');
  };

  // 4. MANEJO DEL FORMULARIO DE ASESORÍA (Envío a tu API en Render)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('enviando');
    try {
      const response = await fetch('https://powersuplements-landing.onrender.com/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setStatus('exito');
        setFormData({ nombre: '', email: '', telefono: '', disciplina: '', objetivo: '', mensaje: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif', minHeight: '100vh' }}>
      
      {/* NAVBAR */}
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px',
        padding: '20px 5%', borderBottom: '1px solid #111', position: 'sticky', top: 0, background: '#000', zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <img
            src="/logo.jpg"
            alt="Power Suplements Logo"
            style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #99ff00a4' }}
          />
          <div style={{ color: '#99ff00a4', fontSize: '22px', fontWeight: 'bold', letterSpacing: '1px' }}>POWER SUPLEMENTS</div>
        </div>
        <nav style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
          <a href="#inicio" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px', textTransform: 'uppercase', fontWeight: '500' }}>Inicio</a>
          <a href="#productos" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px', textTransform: 'uppercase', fontWeight: '500' }}>Productos</a>
          <a href="#nosotros" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px', textTransform: 'uppercase', fontWeight: '500' }}>Nosotros</a>
          <a href="#testimonios" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px', textTransform: 'uppercase', fontWeight: '500' }}>Testimonios</a>
          <a href="#contacto" style={{ color: '#99ff00bd', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase' }}>Asesoría</a>
          
          {totalItems > 0 && (
            <span style={{ background: '#222', border: '1px solid #99ff0098', color: '#99ff00', padding: '4px 10px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold' }}>
              🛒 {totalItems} uds. (${montoTotal})
            </span>
          )}
        </nav>
      </header>

      {/* HERO SECTION */}
      <section id="inicio" style={{
        padding: '100px 5%', textAlign: 'center',
        background: 'radial-gradient(circle at center, #132202 0%, #000000 80%)'
      }}>
        <img
          src="/logo.jpg"
          alt="Power Suplements Hero"
          style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #99ff0083', marginBottom: '25px', boxShadow: '0 0 20px rgba(153,255,0,0.1)' }}
        />
        <h1 style={{ fontSize: 'clamp(32px, 6vw, 70px)', margin: '0 0 20px', fontWeight: '800', lineHeight: '1.1', letterSpacing: '-1px' }}>
          MAXIMIZA TU <br /><span style={{ color: '#99ff0098' }}>RENDIMIENTO ATLÉTICO</span>
        </h1>
        <p style={{ color: '#a1a1aa', fontSize: 'clamp(1rem, 1.5vw, 1.25rem)', maxWidth: '650px', margin: '0 auto 40px', lineHeight: '1.5' }}>
          Suplementación de alta gama formulada por y para atletas de élite junto a expertos en nutrición deportiva. Diseñado para romper marcas.
        </p>
        <a
          href="#productos"
          style={{
            background: '#99ff0098', color: '#000', padding: '15px 35px',
            borderRadius: '6px', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block', letterSpacing: '0.5px'
          }}
        >
          VER CATÁLOGO COMPLETO AQUÍ
        </a>
      </section>

      {/* SECCIÓN PRODUCTOS DINÁMICOS DESDE SUPABASE */}
      <section id="productos" style={{ padding: '80px 5%', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(28px, 4vw, 36px)', marginBottom: '50px', fontWeight: '800', letterSpacing: '-0.5px' }}>
          PRODUCTOS <span style={{ color: '#99ff0083' }}>DESTACADOS</span>
        </h2>
        
        {listaProductos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', border: '1px dashed #222', borderRadius: '12px', background: '#050505' }}>
            <div style={{ color: '#99ff00', fontSize: '24px', marginBottom: '10px' }}>🛒</div>
            <p style={{ color: '#a1a1aa', margin: 0, fontSize: '16px', fontWeight: '500' }}>
              Cargando catálogo oficial desde Supabase...
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '30px', marginBottom: '40px'
          }}>
            {listaProductos.map((p) => (
              <div key={p.id} style={cardStyle}>
                <div style={imgContainerStyle}>
                  <img src={`/${p.imagen_url}`} alt={p.nombre} style={productImgStyle} />
                </div>
                <h3 style={productTitleStyle}>{p.nombre}</h3>
                <p style={productDescStyle}>{p.descripcion}</p>
                <div style={{ color: '#99ff0098', fontWeight: 'bold', fontSize: '18px', marginBottom: '15px' }}>
                  ${p.precio}
                </div>
                {p.stock && <div style={badgeStyle}>Stock: {p.stock}</div>}
                
                {/* SELECTOR INTERACTIVO DE CANTIDADES */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '15px', 
                  background: '#0a0a0a', 
                  padding: '8px', 
                  borderRadius: '6px', 
                  border: '1px solid #222',
                  marginTop: 'auto' 
                }}>
                  <button type="button" onClick={() => decrementarProducto(p.id)} style={btnContadorStyle}>-</button>
                  <span style={{ fontSize: '16px', fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>
                    {carrito[p.id] || 0}
                  </span>
                  <button type="button" onClick={() => incrementarProducto(p.id)} style={btnContadorStyle}>+</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BARRA DE COMPRA DEL CARRITO ACUMULADO */}
        {totalItems > 0 && (
          <div style={{ 
            background: '#111', 
            padding: '20px', 
            borderRadius: '12px', 
            border: '1px solid #99ff0098', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: '20px', 
            boxShadow: '0 0 15px rgba(153,255,0,0.1)' 
          }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px' }}>Tu Pedido ({totalItems} productos)</h3>
              <p style={{ margin: '5px 0 0', color: '#a1a1aa' }}>
                Total a pagar: <strong style={{ color: '#99ff00' }}>${montoTotal}</strong>
              </p>
            </div>
            <button type="button" onClick={enviarPedidoWhatsApp} style={{ 
              background: '#99ff0098', 
              color: '#000', 
              border: 'none', 
              padding: '12px 25px', 
              borderRadius: '6px', 
              fontWeight: 'bold', 
              cursor: 'pointer', 
              fontSize: '15px', 
              letterSpacing: '0.5px' 
            }}>
              COMPRAR COMPLETO POR WHATSAPP 🛒
            </button>
          </div>
        )}
      </section>

      {/* SECCIÓN BENEFICIOS */}
      <section style={{ padding: '60px 5%', background: '#050505', borderTop: '1px solid #111', borderBottom: '1px solid #111' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '40px', textAlign: 'center' }}>
          <div style={{ flex: '1 1 250px' }}>
            <h4 style={{ color: '#99ff008f', fontSize: '20px', margin: '0 0 10px' }}>RESPALDO CIENTÍFICO</h4>
            <p style={{ color: '#71717a', fontSize: '15px', margin: 0 }}>Fórmulas diseñadas y testeadas rigurosamente por nutricionistas deportivos y atletas de alto nivel.</p>
          </div>
          <div style={{ flex: '1 1 250px' }}>
            <h4 style={{ color: '#99ff00a4', fontSize: '20px', margin: '0 0 10px' }}>ENVÍOS INMEDIATOS</h4>
            <p style={{ color: '#71717a', fontSize: '15px', margin: 0 }}>Recibe tus suplementos a nivel local el mismo día de tu orden.</p>
          </div>
        </div>
      </section>

      {/* SECCIÓN SOBRE NOSOTROS */}
      <section id="nosotros" style={{ padding: '90px 5%', background: '#000' }}>
        <div style={{ maxWidth: '850px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', marginBottom: '15px', fontWeight: '800', letterSpacing: '-0.5px' }}>
            SOBRE <span style={{ color: '#99ff0083' }}>NOSOTROS</span>
          </h2>
          <h3 style={{ color: '#99ff008f', fontSize: '18px', fontWeight: '600', marginBottom: '35px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Tienda de suplementos y expertos en nutrición deportiva
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', color: '#a1a1aa', lineHeight: '1.8', fontSize: '16px', textAlign: 'justify' }}>
            <p>Nacimos bajo la alianza de nutricionistas clínicos y atletas de alto rendimiento insatisfechos con el relleno del mercado actual. En <strong style={{ color: '#fff' }}>Power Suplements</strong> estamos completamente centrados en ofrecerte los suplementos deportivos de alto rendimiento que tu esfuerzo diario requiere.</p>
            <p>Somos deportistas, igual que tú, y por eso sabemos perfectamente lo que cuesta cada gota de sudor en el box, en la pista o en el gimnasio. Queremos ayudarte a convertir ese sacrificio en resultados reales y más músculo. Para ello, hemos seleccionado minuciosamente los productos que tu cuerpo te reclama en cada sesión de entrenamiento extremo: proteínas premium que potencian tu recuperación y tu aumento de masa muscular, aminoácidos puros para reparar tus tejidos, y creatina monohidratada o beta-alanina para llevar tu fuerza explosiva y resistencia al límite.</p>
            <p>Queremos verte crecer, más fuerte, más grande... queremos ser más grandes a tu lado. Por eso, más que una tienda, aquí encontrarás a un equipo experto que realmente te escuchará y te aconsejará el producto perfecto adaptado específicamente para tus necesidades biológicas, tus gustos y tu presupuesto.</p>
          </div>
        </div>
      </section>

      {/* SECCIÓN TESTIMONIOS */}
      <section id="testimonios" style={{ padding: '80px 5%', maxWidth: '1200px', margin: '0 auto', borderTop: '1px solid #111' }}>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(28px, 4vw, 36px)', marginBottom: '50px', fontWeight: '800', letterSpacing: '-0.5px' }}>
          LO QUE DICEN NUESTROS <span style={{ color: '#99ff0083' }}>ATLETAS</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
          
          {/* TESTIMONIO 1 */}
          <div style={testimonialCardStyle}>
            <p style={{ fontStyle: 'italic', color: '#a1a1aa', fontSize: '15px', lineHeight: '1.6', margin: '0 0 20px' }}>
              "La creatina monohidratada de Power Suplements se ha vuelto indispensable en mi preparación de CrossFit. He roto todas mis marcas de fuerza explosiva."
            </p>
            <div>
              <h4 style={{ color: '#fff', margin: 0, fontSize: '16px', fontWeight: '700' }}>Carlos Mendoza</h4>
              <span style={{ color: '#99ff0083', fontSize: '13px' }}>Atleta de CrossFit</span>
            </div>
          </div>

          {/* TESTIMONIO 2 */}
          <div style={testimonialCardStyle}>
            <p style={{ fontStyle: 'italic', color: '#a1a1aa', fontSize: '15px', lineHeight: '1.6', margin: '0 0 20px' }}>
              "La beta-alanina es brutal para retrasar la fatiga en los WODs más largos. El servicio de entrega rápida el mismo día me salvó la semana pasada."
            </p>
            <div>
              <h4 style={{ color: '#fff', margin: 0, fontSize: '16px', fontWeight: '700' }}>Mariana Silva</h4>
              <span style={{ color: '#99ff0083', fontSize: '13px' }}>Competidora Funcional</span>
            </div>
          </div>

          {/* TESTIMONIO 3 */}
          <div style={testimonialCardStyle}>
            <p style={{ fontStyle: 'italic', color: '#a1a1aa', fontSize: '15px', lineHeight: '1.6', margin: '0 0 20px' }}>
              "Excelente asesoría y suplementación 100% transparente. Como corredor de fondo, la pureza de lo que consumo es clave para mi recuperación."
            </p>
            <div>
              <h4 style={{ color: '#fff', margin: 0, fontSize: '16px', fontWeight: '700' }}>Luis Alviarez</h4>
              <span style={{ color: '#99ff0083', fontSize: '13px' }}>Corredor de Larga Distancia</span>
            </div>
          </div>

        </div>
      </section>

      {/* SECCIÓN CONTACTO (ASESORÍA) */}
      <section id="contacto" style={{ padding: '80px 5%', background: '#050505', borderTop: '1px solid #111' }}>
        <div style={{ maxWidth: '550px', margin: '0 auto', background: '#111', padding: 'clamp(20px, 5vw, 40px)', borderRadius: '12px', border: '1px solid #222' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '10px', fontSize: '28px', fontWeight: '800' }}>ASESORÍA <span style={{ color: '#99ff0098' }}>PROFESIONAL</span></h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input type="text" name="nombre" placeholder="Nombre completo" value={formData.nombre} onChange={handleChange} required style={inputStyle} />
            <input type="email" name="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} required style={inputStyle} />
            <input type="text" name="telefono" placeholder="Teléfono (WhatsApp)" value={formData.telefono} onChange={handleChange} style={inputStyle} />
            <select name="disciplina" value={formData.disciplina} onChange={handleChange} required style={inputStyle}>
              <option value="" disabled hidden>Selecciona tu disciplina deportiva</option>
              <option value="CrossFit">CrossFit / Entrenamiento Funcional</option>
              <option value="Running">Running / Ciclismo / Resistencia</option>
              <option value="Gimnasio">Gimnasio / Hipertrofia</option>
            </select>
            <button type="submit" style={{
              background: '#99ff0098', color: '#000', padding: '14px', borderRadius: '6px',
              fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '16px', marginTop: '10px'
            }}>SOLICITAR MI PLAN DE SUPLEMENTACIÓN</button>
            
            {status === 'enviando' && <p style={{ color: '#a1a1aa', textAlign: 'center', margin: 0 }}>Enviando perfil...</p>}
            {status === 'exito' && <p style={{ color: '#99ff0098', textAlign: 'center', margin: 0 }}>¡Perfil guardado con éxito!</p>}
            {status === 'error' && <p style={{ color: '#f87171', textAlign: 'center', margin: 0 }}>Error al conectar con el servidor.</p>}
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '40px 5%', textAlign: 'center', borderTop: '1px solid #111', color: '#3f3f46', fontSize: '14px' }}>
        <p style={{ margin: '0 0 15px' }}>&copy; 2026 Power Suplements. Todos los derechos reservados.</p>
      </footer>

    </div>
  );
}

// OBJETOS DE ESTILOS CSS-IN-JS
const cardStyle = { background: '#111', padding: '25px', borderRadius: '12px', border: '1px solid #1e1e1e', position: 'relative', display: 'flex', flexDirection: 'column' };
const testimonialCardStyle = { background: '#0a0a0a', padding: '30px', borderRadius: '12px', border: '1px solid #111', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' };
const imgContainerStyle = { width: '100%', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', background: '#0a0a0a', borderRadius: '8px', overflow: 'hidden' };
const productImgStyle = { maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' };
const productTitleStyle = { color: '#fff', margin: '0 0 10px', fontSize: '20px', fontWeight: '700' };
const productDescStyle = { color: '#a1a1aa', fontSize: '14px', lineHeight: '1.5', margin: '0 0 15px', flexGrow: 1 };
const badgeStyle = { position: 'absolute', top: '15px', right: '15px', background: '#222', color: '#99ff0083', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', border: '1px solid rgba(153,255,0,0.15)' };
const inputStyle = { padding: '12px', borderRadius: '6px', border: '1px solid #222', background: '#000', color: '#fff', fontSize: '15px', fontFamily: 'inherit' };
const btnContadorStyle = { background: '#222', color: '#99ff00', border: '1px solid #333', width: '30px', height: '30px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' };

export default App;