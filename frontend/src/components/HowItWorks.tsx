import './HowItWorks.css'

interface Step {
  title: string
  text: string
  icon: string // SVG path data, 24x24 viewBox, stroke-only
}

const STEPS: Step[] = [
  {
    title: 'Configura en 3D',
    text: 'Elige medidas, madera y acabado y mira tu mesa girar mientras la ajustas.',
    icon: 'M12 3 4 7.5v9L12 21l8-4.5v-9L12 3Zm0 0v9m0 0 8-4.5M12 12 4 7.5',
  },
  {
    title: 'Mira tu precio estimado',
    text: 'El precio se actualiza con cada cambio. Sin llamadas para saber si te alcanza.',
    icon: 'M4 6h16M4 12h16M4 18h10M18 16v4m-2-2h4',
  },
  {
    title: 'Pide tu cotización',
    text: 'Déjanos tus datos y un carpintero confirma el precio y los tiempos contigo.',
    icon: 'M4 5h16v11H8l-4 4V5Zm4 4h8m-8 3h5',
  },
]

export function HowItWorks() {
  return (
    <section className="how" id="como-funciona" aria-labelledby="how-title">
      <div className="how__inner">
        <p className="how__eyebrow">Cómo funciona</p>
        <h2 id="how-title" className="how__title">
          De una idea a una cotización en tres pasos
        </h2>
        <ol className="how__steps">
          {STEPS.map((step, index) => (
            <li key={step.title} className="how__step">
              <span className="how__number">{index + 1}</span>
              <svg className="how__icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d={step.icon} />
              </svg>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
        <a className="how__cta" href="#configurador">
          Empezar a configurar
        </a>
      </div>
    </section>
  )
}
