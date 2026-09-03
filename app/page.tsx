import Image from 'next/image';
import { ArrowRight, Camera, MessageCircle, Users } from 'lucide-react';

const products = [
  { name: 'Natural Woodland', category: 'Alimento para perros', detail: 'Wild Iberian Diet · 7 y 15 kg', image: '/natural-woodland.jpg', tone: 'wood' },
  { name: 'Pet Palatto', category: 'Alimento súper premium', detail: 'Senior +7 · Frango & arroz', image: '/pet-palatto.jpg', tone: 'cream' },
  { name: 'Bocão Signature', category: 'Alimento para gatos', detail: 'Adultos · Salmón y pollo', image: '/bocao.jpg', tone: 'orange' },
  { name: 'Forza', category: 'Formato familiar', detail: 'Razas medianas y grandes · 20 kg', image: '/forza.jpg', tone: 'dark' },
];

const whatsapp = 'https://api.whatsapp.com/send/?phone=56987898184&text=Hola%20RASF%20Pets%2C%20quisiera%20consultar%20por%20sus%20productos&type=phone_number&app_absent=0';

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="RASF Pets, inicio">
          <Image src="/rasf-logo.jpg" alt="Logo RASF Pets" width={54} height={54} priority />
          <span>RASF <small>PETS</small></span>
        </a>
        <nav aria-label="Navegación principal"><a href="#catalogo">Catálogo</a><a href="#contacto">Contacto</a></nav>
        <a className="header-cta" href={whatsapp} target="_blank" rel="noreferrer">Consultar <ArrowRight size={17} /></a>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <p className="eyebrow">Alimentos para perros y gatos</p>
          <h1>Lo bueno para ellos, <em>más cerca de ti.</em></h1>
          <p className="hero-text">Encuentra alternativas para cada etapa y necesidad de tu mascota. Escríbenos y te ayudamos a elegir.</p>
          <div className="hero-actions">
            <a className="button button-primary" href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={20} /> Consultar por WhatsApp</a>
            <a className="button button-ghost" href="#catalogo">Ver catálogo</a>
          </div>
          <div className="trust-row" aria-label="Beneficios de compra"><span>✓ Atención directa</span><span>✓ Variedad para perros y gatos</span></div>
        </div>
        <div className="hero-visual">
          <Image src="/forza.jpg" alt="Perros junto a alimento para mascotas Forza" fill priority sizes="(max-width: 900px) 100vw, 48vw" />
          <div className="hero-badge"><strong>RASF Pets</strong><span>Todo para regalonearlos</span></div>
        </div>
      </section>

      <section className="catalog" id="catalogo">
        <div className="section-heading">
          <div><p className="eyebrow">Selección RASF</p><h2>Productos destacados</h2></div>
          <p>Consulta disponibilidad y formatos directamente con nosotros.</p>
        </div>
        <div className="product-grid">
          {products.map((product) => (
            <article className={`product-card ${product.tone}`} key={product.name}>
              <div className="product-image"><Image src={product.image} alt={product.name} fill sizes="(max-width: 680px) 100vw, (max-width: 1050px) 50vw, 25vw" /></div>
              <div className="product-info">
                <p>{product.category}</p><h3>{product.name}</h3><span>{product.detail}</span>
                <a href={whatsapp} target="_blank" rel="noreferrer" aria-label={`Consultar por ${product.name} en WhatsApp`}>Consultar <ArrowRight size={16} /></a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="contact" id="contacto">
        <div><p className="eyebrow light">¿Necesitas ayuda?</p><h2>Conversemos sobre tu mascota.</h2><p>Cuéntanos qué estás buscando y te orientamos con una alternativa.</p></div>
        <div className="social-actions">
          <a href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={21} /> WhatsApp</a>
          <a href="https://www.instagram.com/rasfpets/" target="_blank" rel="noreferrer"><Camera size={21} /> Instagram</a>
          <a href="https://www.facebook.com/Deliverypets.ccp/" target="_blank" rel="noreferrer"><Users size={21} /> Facebook</a>
        </div>
      </section>

      <footer>
        <a className="brand footer-brand" href="#inicio"><Image src="/rasf-logo.jpg" alt="" width={46} height={46} /><span>RASF <small>PETS</small></span></a>
        <p>Alimentos y productos para tus compañeros de vida.</p><span>Concepción, Chile</span>
      </footer>
    </main>
  );
}
