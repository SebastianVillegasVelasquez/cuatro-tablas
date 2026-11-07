import './section.css'
import './Packages.css'

interface Package {
  name: string
  text: string
  features: string[]
  featured?: boolean
}

const PACKAGES: Package[] = [
  {
    name: 'Vitrina 3D',
    text: 'Tu producto estrella en 3D, con tu marca.',
    features: ['Una página con un modelo interactivo', 'Botón directo a tu WhatsApp', 'Lista para aparecer en Google'],
  },
  {
    name: 'Configurador',
    text: 'Tus clientes diseñan y ven el precio estimado.',
    features: ['Medidas, maderas y acabados tuyos', 'Precio calculado con tus reglas', 'Solicitudes con las medidas ya definidas'],
    featured: true,
  },
  {
    name: 'Configurador + panel',
    text: 'Todo lo anterior, y tú gestionas desde un panel.',
    features: ['Panel para ver y ordenar solicitudes', 'Avisos automáticos a tu WhatsApp o correo', 'Administración de precios sin tocar código'],
  },
]

export function Packages() {
  return (
    <section className="section section--sand" id="paquetes" aria-labelledby="packages-title">
      <div className="section__inner">
        <p className="section__eyebrow">Paquetes</p>
        <h2 id="packages-title" className="section__title">
          Empieza pequeño y crece cuando lo necesites
        </h2>
        <p className="section__lead">
          No publicamos precios fijos: dependen de tu catálogo y de lo que necesites. Se cotiza por
          proyecto.
        </p>
        <div className="packages__grid">
          {PACKAGES.map((pack) => (
            <article
              key={pack.name}
              className={pack.featured ? 'package package--featured' : 'package'}
            >
              <h3>{pack.name}</h3>
              <p>{pack.text}</p>
              <ul>
                {pack.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <a className="package__cta" href="#contacto">
                Cotizar este paquete
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
