import './section.css'
import './Faq.css'

const QUESTIONS = [
  {
    q: '¿Mis precios quedan expuestos?',
    a: 'No. Tu cliente solo ve el total estimado. El desglose (materiales, mano de obra y margen) solo se consulta con una clave de administrador.',
  },
  {
    q: '¿El precio que ve el cliente es definitivo?',
    a: 'No: es una estimación y tú confirmas el precio final. Además, el sistema solo cotiza medidas que se pueden fabricar.',
  },
  {
    q: '¿Y si no hago mesas?',
    a: 'La demo es una mesa, pero el mismo enfoque sirve para cualquier mueble paramétrico. Definimos juntos qué medidas y opciones tiene cada producto.',
  },
  {
    q: '¿Necesito saber de tecnología?',
    a: 'No. Tú nos cuentas tus productos, medidas, maderas y precios, y nosotros lo montamos.',
  },
  {
    q: '¿Cuánto cuesta y cuánto tarda?',
    a: 'Depende de tu catálogo y de lo que necesites. Lo definimos en una cotización después de conocer tu taller.',
  },
  {
    q: '¿Qué pasa con los datos que escribo en la demo?',
    a: 'Se guardan en una base de pruebas. Usa datos de prueba: este sitio no es un taller real y nadie te contactará.',
  },
]

export function Faq() {
  return (
    <section className="section" id="preguntas" aria-labelledby="faq-title">
      <div className="section__inner faq">
        <p className="section__eyebrow">Preguntas frecuentes</p>
        <h2 id="faq-title" className="section__title">
          Lo que suelen preguntar los talleres
        </h2>
        <div className="faq__list">
          {QUESTIONS.map((item) => (
            <details key={item.q} className="faq__item">
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
