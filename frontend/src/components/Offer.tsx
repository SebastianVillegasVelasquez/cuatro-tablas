import './section.css'
import './Offer.css'

const WORKS_TODAY = [
  'Vista 3D del mueble con medidas, madera y acabado ajustables.',
  'Precio calculado en el servidor con reglas de materiales, acabados, mano de obra y margen.',
  'Validación de medidas: no se cotiza lo que no se puede fabricar.',
  'Solicitudes guardadas con las medidas exactas.',
  'Consulta de solicitudes protegida con clave (por ahora vía API).',
]

const TAILORED = [
  'Tus productos: mesas, escritorios, closets, puertas… lo que tú fabricas.',
  'Tus maderas, acabados y precios reales.',
  'Aviso a tu WhatsApp o correo cuando llegue una solicitud.',
  'Panel visual para ver y gestionar las solicitudes.',
  'Tu marca, tus colores y tu dominio.',
]

export function Offer() {
  return (
    <section className="section" id="incluye" aria-labelledby="offer-title">
      <div className="section__inner">
        <p className="section__eyebrow">Qué incluye</p>
        <h2 id="offer-title" className="section__title">
          Lo que ya funciona y lo que adaptamos a tu taller
        </h2>
        <p className="section__lead">
          Separamos lo que puedes probar hoy en esta demo de lo que construimos a la medida de tu
          negocio.
        </p>
        <div className="offer__columns">
          <div className="offer__card">
            <h3>Ya funciona en esta demo</h3>
            <ul className="offer__list offer__list--done">
              {WORKS_TODAY.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="offer__card offer__card--tailored">
            <h3>Lo adaptamos a tu taller</h3>
            <ul className="offer__list offer__list--todo">
              {TAILORED.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
