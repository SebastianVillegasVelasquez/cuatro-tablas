import { lazy, Suspense, useRef, useState } from 'react'
import { useHeroScroll } from '../hooks/useHeroScroll'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { woodAppearance } from '../scene/appearance'
import { supportsWebGL } from '../scene/webgl'
import './Hero.css'

// Three.js is the heavy part of the bundle. Loading it lazily lets the headline
// and call to action paint first instead of waiting for the 3D code.
const HeroScene = lazy(() => import('../scene/HeroScene'))

const WOODS = [
  { id: 'pino', name: 'Pino' },
  { id: 'cedro', name: 'Cedro' },
  { id: 'roble', name: 'Roble' },
] as const

export function Hero() {
  const section = useRef<HTMLElement>(null)
  const scroll = useHeroScroll(section)
  const reducedMotion = usePrefersReducedMotion()
  const [materialId, setMaterialId] = useState<string>('cedro')
  const [webgl] = useState(supportsWebGL)

  return (
    <section className="hero" ref={section}>
      <div className="hero__stage" aria-hidden={!webgl}>
        {webgl ? (
          <Suspense fallback={null}>
            <HeroScene scroll={scroll} reducedMotion={reducedMotion} materialId={materialId} />
          </Suspense>
        ) : null}
      </div>

      <header className="hero__nav">
        <span className="hero__brand">4-tablas</span>
      </header>

      <div className="hero__content">
        <p className="hero__eyebrow">Para talleres de madera</p>
        <h1 className="hero__title">
          Que tus clientes diseñen su mueble <em>y se coticen solos.</em>
        </h1>
        <p className="hero__lead">
          Un configurador 3D con precio al instante, hecho a la medida de tu taller. Esta página es
          la demostración: pruébala.
        </p>

        <div className="hero__actions">
          <a className="button button--primary" href="#configurador">
            Prueba la demo
          </a>
          <a className="button button--ghost" href="#como-funciona">
            Cómo funciona
          </a>
        </div>

        <fieldset className="hero__woods">
          <legend>Prueba una madera</legend>
          {WOODS.map((wood) => (
            <label key={wood.id} className="swatch">
              <input
                type="radio"
                name="hero-wood"
                value={wood.id}
                checked={materialId === wood.id}
                onChange={() => setMaterialId(wood.id)}
              />
              <span
                className="swatch__dot"
                style={{ background: woodAppearance(wood.id, 'natural').color }}
              />
              {wood.name}
            </label>
          ))}
        </fieldset>

        <p className="hero__note">Demo con maderas y precios de ejemplo.</p>
      </div>

      <a className="hero__scroll" href="#configurador">
        <span>Desliza y arma tu mesa</span>
        <span className="hero__scroll-line" aria-hidden="true" />
      </a>
    </section>
  )
}
