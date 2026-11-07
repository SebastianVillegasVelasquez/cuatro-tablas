import './section.css'
import './Problem.css'

const PROBLEMS = [
  {
    title: 'Conversaciones sin fin',
    text: 'Medidas, madera, acabado, fotos… cada cotización es un hilo largo de mensajes antes de hablar de dinero.',
  },
  {
    title: 'Cotizar a ciegas',
    text: 'El cliente no ve lo que pide y tú no sabes si el presupuesto le alcanza. Los dos pierden tiempo.',
  },
  {
    title: 'Curiosos que no compran',
    text: 'Respondes con el mismo cuidado a quien va a comprar y a quien solo estaba mirando precios.',
  },
  {
    title: 'Medidas mal entendidas',
    text: 'Un centímetro mal anotado se descubre cuando el mueble ya está cortado.',
  },
]

export function Problem() {
  return (
    <section className="section section--sand" id="problema" aria-labelledby="problem-title">
      <div className="section__inner">
        <p className="section__eyebrow">El problema</p>
        <h2 id="problem-title" className="section__title">
          Cotizar un mueble a medida se come horas del taller
        </h2>
        <ul className="problem__grid">
          {PROBLEMS.map((problem) => (
            <li key={problem.title} className="problem__item">
              <h3>{problem.title}</h3>
              <p>{problem.text}</p>
            </li>
          ))}
        </ul>
        <p className="section__footnote">
          Son los problemas que creemos más comunes en talleres pequeños. Los validamos contigo en
          la primera conversación: si el tuyo es otro, cuéntanoslo.
        </p>
      </div>
    </section>
  )
}
