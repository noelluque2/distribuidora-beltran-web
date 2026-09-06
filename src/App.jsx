import { useEffect, useMemo, useState } from 'react'
import { supabase } from './supabaseClient'

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMERO || '5491100000000'
const EMAIL = import.meta.env.VITE_EMAIL_CONTACTO || 'info@distribuidorabeltran.com.ar'
const DIRECCION = import.meta.env.VITE_DIRECCION || 'Dirección de ejemplo 1234, Localidad, Provincia'
const HORARIO = import.meta.env.VITE_HORARIO || 'Lunes a viernes de 8 a 17 hs'
const ERP_URL = import.meta.env.VITE_ERP_URL || 'https://app.distribuidorabeltran.com.ar'

const waLink = (texto) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`

const money = (n) =>
  n == null ? '' : n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })

const Icon = ({ d, ...p }) => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
)

const ICONS = {
  box: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
  whatsapp: 'M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z',
  mail: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6',
  pin: 'M12 22s8-7.5 8-13a8 8 0 10-16 0c0 5.5 8 13 8 13z M12 12a3 3 0 100-6 3 3 0 000 6z',
  clock: 'M12 22a10 10 0 100-20 10 10 0 000 20z M12 6v6l4 2',
  search: 'M21 21l-4.35-4.35 M11 19a8 8 0 100-16 8 8 0 000 16z',
  check: 'M20 6L9 17l-5-5',
  menu: 'M4 6h16M4 12h16M4 18h16',
  close: 'M6 6l12 12M18 6L6 18',
  arrow: 'M5 12h14M13 6l6 6-6 6',
}

const NAV = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'nosotros', label: 'Nosotros' },
  { id: 'catalogo', label: 'Catálogo' },
  { id: 'contacto', label: 'Contacto' },
]

function useCatalogo() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let activo = true
    setLoading(true)
    supabase
      .from('catalogo_publico')
      .select('*')
      .then(({ data, error }) => {
        if (!activo) return
        if (error) setError(error.message)
        else setProductos(data || [])
        setLoading(false)
      })
    return () => { activo = false }
  }, [])

  return { productos, loading, error }
}

function Header({ open, setOpen }) {
  return (
    <header className="header">
      <div className="container header-inner">
        <a href="#inicio" className="brand">
          <img src="/logo.png" alt="Distribuidora Beltrán" className="brand-mark" />
          <span className="brand-text">
            <strong>Distribuidora Beltrán</strong>
            <small>Packaging &amp; descartables</small>
          </span>
        </a>

        <nav className={`nav${open ? ' open' : ''}`}>
          {NAV.map(n => (
            <a key={n.id} href={`#${n.id}`} onClick={() => setOpen(false)}>{n.label}</a>
          ))}
          <a href={ERP_URL} className="nav-erp" target="_blank" rel="noreferrer">Ingresar al sistema</a>
        </nav>

        <a className="btn btn-wa header-wa" href={waLink('Hola! Quisiera hacer una consulta.')} target="_blank" rel="noreferrer">
          <Icon d={ICONS.whatsapp} width={18} height={18} /> WhatsApp
        </a>

        <button className="menu-btn" onClick={() => setOpen(o => !o)} aria-label="Abrir menú">
          <Icon d={open ? ICONS.close : ICONS.menu} />
        </button>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section id="inicio" className="hero">
      <div className="container hero-inner">
        <div>
          <span className="eyebrow">Venta mayorista y minorista</span>
          <h1>Packaging, descartables y embalajes para tu negocio</h1>
          <p className="lead">
            [Editar: bajada institucional — dos o tres líneas contando a qué se dedica
            Distribuidora Beltrán, hace cuánto tiempo, y qué la distingue: variedad,
            precios, entrega, atención personalizada, etc.]
          </p>
          <div className="hero-actions">
            <a href="#catalogo" className="btn btn-primary">Ver catálogo <Icon d={ICONS.arrow} width={16} height={16} /></a>
            <a href={waLink('Hola! Quisiera hacer un pedido.')} className="btn btn-outline" target="_blank" rel="noreferrer">
              <Icon d={ICONS.whatsapp} width={16} height={16} /> Consultar por WhatsApp
            </a>
          </div>
          <ul className="hero-points">
            <li><Icon d={ICONS.check} width={16} height={16} /> [Ej: Entregas en el día]</li>
            <li><Icon d={ICONS.check} width={16} height={16} /> [Ej: Precios por mayor]</li>
            <li><Icon d={ICONS.check} width={16} height={16} /> [Ej: Amplio catálogo]</li>
          </ul>
        </div>
        <div className="hero-card" aria-hidden="true">
          <img src="/logo.png" alt="" className="hero-logo" />
        </div>
      </div>
    </section>
  )
}

function Nosotros() {
  return (
    <section id="nosotros" className="section section-alt">
      <div className="container">
        <h2>Nosotros</h2>
        <p className="section-sub">
          [Editar: historia breve de la distribuidora — origen, rubro, zona que
          cubre, tipo de clientes (comercios, industria, gastronomía, etc.)]
        </p>
        <div className="grid-3">
          <div className="feature">
            <h3>[Variedad]</h3>
            <p>[Editar: descripción corta sobre la variedad de productos que manejan.]</p>
          </div>
          <div className="feature">
            <h3>[Calidad]</h3>
            <p>[Editar: descripción corta sobre calidad, proveedores, marcas.]</p>
          </div>
          <div className="feature">
            <h3>[Atención]</h3>
            <p>[Editar: descripción corta sobre atención al cliente, pedidos, cuenta corriente para clientes habituales, etc.]</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProductoCard({ p }) {
  return (
    <div className="prod-card">
      {p.imagen_url
        ? <img src={p.imagen_url} alt={p.nombre} className="prod-photo" loading="lazy" />
        : <div className="prod-thumb"><Icon d={ICONS.box} width={30} height={30} /></div>}
      <div className="prod-info">
        <span className="prod-cat">{p.categoria || 'Sin categoría'}</span>
        <h4>{p.nombre}</h4>
        {p.medidas && <span className="prod-medidas">{p.medidas}</span>}
      </div>
      {p.precio_venta != null && <div className="prod-precio">{money(p.precio_venta)}</div>}
    </div>
  )
}

function Catalogo() {
  const { productos, loading, error } = useCatalogo()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('todas')

  const categorias = useMemo(() => {
    const set = new Set(productos.map(p => p.categoria).filter(Boolean))
    return ['todas', ...Array.from(set).sort()]
  }, [productos])

  const filtrados = useMemo(() => {
    const texto = q.trim().toLowerCase()
    return productos.filter(p => {
      const okCat = cat === 'todas' || p.categoria === cat
      const okTexto = !texto || p.nombre?.toLowerCase().includes(texto) || p.codigo?.toLowerCase().includes(texto)
      return okCat && okTexto
    })
  }, [productos, q, cat])

  return (
    <section id="catalogo" className="section">
      <div className="container">
        <h2>Catálogo</h2>
        <p className="section-sub">
          Estos son nuestros productos disponibles. Los precios y el listado se actualizan
          automáticamente. Para pedidos por mayor o cuenta corriente, escribinos por WhatsApp.
        </p>

        <div className="catalogo-filtros">
          <div className="input-search">
            <Icon d={ICONS.search} width={16} height={16} />
            <input
              placeholder="Buscar producto o código..."
              value={q}
              onChange={e => setQ(e.target.value)}
            />
          </div>
          <select value={cat} onChange={e => setCat(e.target.value)}>
            {categorias.map(c => (
              <option key={c} value={c}>{c === 'todas' ? 'Todas las categorías' : c}</option>
            ))}
          </select>
        </div>

        {loading && <p className="catalogo-estado">Cargando catálogo...</p>}
        {error && (
          <p className="catalogo-estado catalogo-error">
            No pudimos cargar el catálogo en este momento. Escribinos por WhatsApp y te
            pasamos la lista de productos directamente.
          </p>
        )}
        {!loading && !error && filtrados.length === 0 && (
          <p className="catalogo-estado">No encontramos productos con ese filtro.</p>
        )}

        {!loading && !error && filtrados.length > 0 && (
          <div className="prod-grid">
            {filtrados.map(p => <ProductoCard key={p.id} p={p} />)}
          </div>
        )}
      </div>
    </section>
  )
}

function Contacto() {
  return (
    <section id="contacto" className="section section-alt">
      <div className="container">
        <h2>Contacto</h2>
        <p className="section-sub">Consultanos por stock, precios mayoristas o pedidos especiales.</p>
        <div className="contacto-grid">
          <a className="contacto-item" href={waLink('Hola! Quisiera hacer una consulta.')} target="_blank" rel="noreferrer">
            <Icon d={ICONS.whatsapp} />
            <div><strong>WhatsApp</strong><span>Respuesta rápida en horario comercial</span></div>
          </a>
          <a className="contacto-item" href={`mailto:${EMAIL}`}>
            <Icon d={ICONS.mail} />
            <div><strong>Email</strong><span>{EMAIL}</span></div>
          </a>
          <div className="contacto-item">
            <Icon d={ICONS.pin} />
            <div><strong>Dirección</strong><span>{DIRECCION}</span></div>
          </div>
          <div className="contacto-item">
            <Icon d={ICONS.clock} />
            <div><strong>Horario</strong><span>{HORARIO}</span></div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span>© {new Date().getFullYear()} Distribuidora Beltrán</span>
        <a href={ERP_URL} target="_blank" rel="noreferrer">Acceso al sistema interno</a>
      </div>
    </footer>
  )
}

export default function App() {
  const [navOpen, setNavOpen] = useState(false)
  return (
    <>
      <Header open={navOpen} setOpen={setNavOpen} />
      <Hero />
      <Nosotros />
      <Catalogo />
      <Contacto />
      <Footer />
    </>
  )
}
