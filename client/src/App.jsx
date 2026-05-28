import { useState } from 'react';

// IMPORTACIÓN DE IMÁGENES LOCALES desde assets
import logoImg from './assets/logo.jpg';
import creatinaImg from './assets/creatina.jpg';
import betaImg from './assets/beta_alanina.jpg';
import proteinImg from './assets/protein.jpg';
import argininaImg from './assets/arginina.jpg';

function App() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    disciplina: '',
    objetivo: '',
    mensaje: ''
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('enviando');
    try {
      const response = await fetch('http://localhost:5000/api/contacto', {
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
      
      {/* NAVBAR RESPONSIVO */}
      <header style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px',
        padding: '20px 5%', borderBottom: '1px solid #111', position: 'sticky', top: 0, background: '#000', zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <img 
            src={logoImg} 
            alt="Power Suplements Logo" 
            style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #99ff00a4' }} 
          />
          <div style={{ color: '#99ff00a4', fontSize: '22px', fontWeight: 'bold', letterSpacing: '1px' }}>POWER SUPLEMENTS</div>
        </div>
        <nav style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <a href="#inicio" className="nav-link" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px', textTransform: 'uppercase', fontWeight: '500' }}>Inicio</a>
          <a href="#productos" className="nav-link" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px', textTransform: 'uppercase', fontWeight: '500' }}>Productos</a>
          <a href="#nosotros" className="nav-link" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px', textTransform: 'uppercase', fontWeight: '500' }}>Nosotros</a>
          <a href="#testimonios" className="nav-link" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px', textTransform: 'uppercase', fontWeight: '500' }}>Testimonios</a>
          <a href="#contacto" className="nav-link" style={{ color: '#99ff00bd', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase' }}>Asesoría</a>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section id="inicio" style={{ 
        padding: '100px 5%', textAlign: 'center', 
        background: 'radial-gradient(circle at center, #132202 0%, #000000 80%)' 
      }}>
        <img 
          src={logoImg} 
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
          href="https://powersupplements.my.canva.site/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-neon-hover"
          style={{ 
            background: '#99ff0098', color: '#000', padding: '15px 35px', 
            borderRadius: '6px', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block', letterSpacing: '0.5px'
          }}
        >
          VER CATÁLOGO COMPLETO AQUÍ
        </a>
      </section>

      {/* SECCIÓN PRODUCTOS */}
      <section id="productos" style={{ padding: '80px 5%', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(28px, 4vw, 36px)', marginBottom: '50px', fontWeight: '800', letterSpacing: '-0.5px' }}>
          PRODUCTOS <span style={{ color: '#99ff0083' }}>DESTACADOS</span>
        </h2>
        <div style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '30px'
        }}>
          {/* PRODUCTO 1: CREATINA */}
          <div style={cardStyle}>
            <div style={imgContainerStyle}>
              <img src={creatinaImg} alt="Creatina Soldiers" style={productImgStyle} />
            </div>
            <h3 style={productTitleStyle}>Creatina Monohidratada</h3>
            <p style={productDescStyle}>100% Pura. Promueve la ganancia de masa muscular y aumenta significativamente la fuerza explosiva.</p>
            <div style={badgeStyle}>300g</div>
          </div>

          {/* PRODUCTO 2: BETA-ALANINA */}
          <div style={cardStyle}>
            <div style={imgContainerStyle}>
              <img src={betaImg} alt="Beta Alanina" style={productImgStyle} />
            </div>
            <h3 style={productTitleStyle}>Beta-Alanina</h3>
            <p style={productDescStyle}>Aumenta la capacidad de ejercicio de alta intensidad y retrasa la fatiga muscular en el entrenamiento.</p>
            <div style={badgeStyle}>250g</div>
          </div>

          {/* PRODUCTO 3: WHEY PROTEIN */}
          <div style={cardStyle}>
            <div style={imgContainerStyle}>
              <img src={proteinImg} alt="Whey Protein" style={productImgStyle} />
            </div>
            <h3 style={productTitleStyle}>Whey Protein</h3>
            <p style={productDescStyle}>Nutrición premium para una excelente recuperación, crecimiento muscular y control del peso.</p>
            <div style={badgeStyle}>2kg</div>
          </div>

          {/* PRODUCTO 4: L-ARGININA */}
          <div style={cardStyle}>
            <div style={imgContainerStyle}>
              <img src={argininaImg} alt="L-Arginina" style={productImgStyle} />
            </div>
            <h3 style={productTitleStyle}>L-Arginina</h3>
            <p style={productDescStyle}>100% Pura. Mejora la vasodilatación, quema de grasa y la óptima recuperación de tissues.</p>
            <div style={badgeStyle}>250g</div>
          </div>
        </div>
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
            <p>
              Nacimos bajo la alianza de nutricionistas clínicos y atletas de alto rendimiento insatisfechos con el relleno del mercado actual. En <strong style={{ color: '#fff' }}>Power Suplements</strong> estamos completamente centrados en ofrecerte los suplementos deportivos de alto rendimiento que tu esfuerzo diario requiere. 
            </p>
            <p>
              Somos deportistas, igual que tú, y por eso sabemos perfectamente lo que cuesta cada gota de sudor en el box, en la pista o en el gimnasio. Queremos ayudarte a convertir ese sacrificio en resultados reales y más músculo. Para ello, hemos seleccionado minuciosamente los productos que tu cuerpo te reclama en cada sesión de entrenamiento extremo: proteínas premium que potencian tu recuperación y tu aumento de masa muscular, aminoácidos puros para reparar tus tejidos, y creatina monohidratada o beta-alanina para llevar tu fuerza explosiva y resistencia al límite.
            </p>
            <p>
              Queremos verte crecer, más fuerte, más grande... queremos ser más grandes a tu lado. Por eso, más que una tienda, aquí encontrarás a un equipo experto que realmente te escuchará y te aconsejará el producto perfecto adaptado específicamente para tus necesidades biológicas, tus gustos y tu presupuesto.
            </p>
          </div>
        </div>
      </section>

      {/* SECCIÓN TESTIMONIOS */}
      <section id="testimonios" style={{ padding: '80px 5%', maxWidth: '1200px', margin: '0 auto', borderTop: '1px solid #111' }}>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(28px, 4vw, 36px)', marginBottom: '50px', fontWeight: '800', letterSpacing: '-0.5px' }}>
          LO QUE DICEN NUESTROS <span style={{ color: '#99ff0083' }}>ATLETAS</span>
        </h2>
        <div style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '30px'
        }}>
          <div style={testimonialCardStyle}>
            <p style={{ fontStyle: 'italic', color: '#a1a1aa', fontSize: '15px', lineHeight: '1.6', margin: '0 0 20px' }}>
              "La creatina monohidratada de Power Suplements se ha vuelto indispensable en mi preparación de CrossFit. He roto todas mis marcas de fuerza explosiva."
            </p>
            <h4 style={{ color: '#fff', margin: 0, fontSize: '16px', fontWeight: '700' }}>Carlos Mendoza</h4>
            <span style={{ color: '#99ff0083', fontSize: '13px' }}>Atleta de CrossFit</span>
          </div>

          <div style={testimonialCardStyle}>
            <p style={{ fontStyle: 'italic', color: '#a1a1aa', fontSize: '15px', lineHeight: '1.6', margin: '0 0 20px' }}>
              "La beta-alanina es brutal para retrasar la fatiga en los WODs más largos. El servicio de entrega rápida el mismo día me salvó la semana pasada."
            </p>
            <h4 style={{ color: '#fff', margin: 0, fontSize: '16px', fontWeight: '700' }}>Mariana Silva</h4>
            <span style={{ color: '#99ff0083', fontSize: '13px' }}>Competidora Funcional</span>
          </div>

          <div style={testimonialCardStyle}>
            <p style={{ fontStyle: 'italic', color: '#a1a1aa', fontSize: '15px', lineHeight: '1.6', margin: '0 0 20px' }}>
              "Excelente asesoría y suplementación 100% transparente. Como corredor de fondo, la pureza de lo que consumo es clave para mi recuperación."
            </p>
            <h4 style={{ color: '#fff', margin: 0, fontSize: '16px', fontWeight: '700' }}>Luis Alviarez</h4>
            <span style={{ color: '#99ff0083', fontSize: '13px' }}>Corredor de Larga Distancia</span>
          </div>
        </div>
      </section>

      {/* SECCIÓN CONTACTO Y ASESORÍA */}
      <section id="contacto" style={{ padding: '80px 5%', background: '#050505', borderTop: '1px solid #111' }}>
        <div style={{ maxWidth: '550px', margin: '0 auto', background: '#111', padding: 'clamp(20px, 5vw, 40px)', borderRadius: '12px', border: '1px solid #222' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '10px', fontSize: '28px', fontWeight: '800' }}>ASESORÍA <span style={{ color: '#99ff0098' }}>PROFESIONAL</span></h2>
          <p style={{ color: '#71717a', textAlign: 'center', marginBottom: '30px', fontSize: '15px', lineHeight: '1.4' }}>
            Nuestras marcas están desarrolladas por nutricionistas y atletas élite. Cuéntanos qué entrenas y tus metas para recomendarte tu suplementación ideal.
          </p>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input type="text" name="nombre" placeholder="Nombre completo" value={formData.nombre} onChange={handleChange} required style={inputStyle} />
            <input type="email" name="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} required style={inputStyle} />
            <input type="text" name="telefono" placeholder="Teléfono (WhatsApp)" value={formData.telefono} onChange={handleChange} style={inputStyle} />
            
            <select name="disciplina" value={formData.disciplina} onChange={handleChange} required style={inputStyle}>
              <option value="" disabled hidden>Selecciona tu disciplina deportiva</option>
              <option value="CrossFit">CrossFit / Entrenamiento Funcional</option>
              <option value="Running">Running / Ciclismo / Resistencia</option>
              <option value="Gimnasio">Gimnasio / Hipertrofia</option>
              <option value="Powerlifting">Powerlifting / Fuerza Pura</option>
              <option value="Otro">Otro deporte de alta intensidad</option>
            </select>

            <select name="objetivo" value={formData.objetivo} onChange={handleChange} required style={inputStyle}>
              <option value="" disabled hidden>¿Cuál es tu objetivo principal?</option>
              <option value="Fuerza">Aumentar fuerza explosiva y potencia</option>
              <option value="Resistencia">Mejorar el rendimiento y retrasar la fatiga</option>
              <option value="Masa Muscular">Desarrollo de masa muscular magra</option>
              <option value="Recuperacion">Acelerar la recuperación post-entrenamiento</option>
            </select>

            <textarea name="mensaje" placeholder="¿Tienes alguna duda específica sobre alergias, dosis o combinación de suplementos? (Opcional)" value={formData.mensaje} onChange={handleChange} rows="3" style={inputStyle}></textarea>
            
            <button type="submit" className="btn-neon-hover" style={{ 
              background: '#99ff0098', color: '#000', padding: '14px', borderRadius: '6px', 
              fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '16px', letterSpacing: '0.5px', marginTop: '10px'
            }}>SOLICITAR MI PLAN DE SUPLEMENTACIÓN</button>
            
            {status === 'enviando' && <p style={{ color: '#a1a1aa', textAlign: 'center', margin: 0 }}>Enviando perfil deportivo...</p>}
            {status === 'exito' && <p style={{ color: '#99ff0098', textAlign: 'center', margin: 0 }}>¡Perfil guardado! Un expert revisará tus datos.</p>}
            {status === 'error' && <p style={{ color: '#f87171', textAlign: 'center', margin: 0 }}>Error al conectar con el servidor.</p>}
          </form>
        </div>
      </section>

      {/* FOOTER ENLAZADO A REDES REALES */}
      <footer style={{ padding: '40px 5%', textAlign: 'center', borderTop: '1px solid #111', color: '#3f3f46', fontSize: '14px' }}>
        <p style={{ margin: '0 0 15px' }}>&copy; 2026 Power Suplements. Todos los derechos reservados.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <a 
            href="https://www.instagram.com/powersupplements.pzo/" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ color: '#71717a', textDecoration: 'none', fontWeight: '500', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.target.style.color = '#99ff0098'}
            onMouseLeave={(e) => e.target.style.color = '#71717a'}
          >
            INSTAGRAM
          </a>
          <a 
            href="https://wa.me/584146045659" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ color: '#71717a', textDecoration: 'none', fontWeight: '500', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.target.style.color = '#99ff0098'}
            onMouseLeave={(e) => e.target.style.color = '#71717a'}
          >
            WHATSAPP
          </a>
        </div>
      </footer>

    </div>
  );
}

// ESTILOS EN OBJETOS
const cardStyle = {
  background: '#111', 
  padding: '25px', 
  borderRadius: '12px', 
  border: '1px solid #1e1e1e', 
  position: 'relative',
  display: 'flex',
  flexDirection: 'column'
};

const testimonialCardStyle = {
  background: '#0a0a0a',
  padding: '30px',
  borderRadius: '12px',
  border: '1px solid #111',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
};

const imgContainerStyle = {
  width: '100%', 
  height: '220px', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center',
  marginBottom: '20px',
  background: '#0a0a0a',
  borderRadius: '8px',
  overflow: 'hidden'
};

const productImgStyle = {
  maxHeight: '100%', 
  maxWidth: '100%', 
  objectFit: 'contain'
};

const productTitleStyle = {
  color: '#fff', 
  margin: '0 0 10px', 
  fontSize: '20px', 
  fontWeight: '700'
};

const productDescStyle = {
  color: '#a1a1aa', 
  fontSize: '14px', 
  lineHeight: '1.5',
  margin: '0 0 20px'
};

const badgeStyle = {
  position: 'absolute', 
  top: '15px', 
  right: '15px', 
  background: '#222', 
  color: '#99ff0083', 
  padding: '4px 10px', 
  borderRadius: '20px', 
  fontSize: '12px', 
  fontWeight: 'bold',
  border: '1px solid rgba(153,255,0,0.15)'
};

const inputStyle = {
  padding: '12px',
  borderRadius: '6px',
  border: '1px solid #222',
  background: '#000',
  color: '#fff',
  fontSize: '15px',
  fontFamily: 'inherit'
};

export default App;