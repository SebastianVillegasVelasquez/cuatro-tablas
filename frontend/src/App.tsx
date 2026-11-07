import { lazy, Suspense, useMemo, useState } from 'react'
import { Hero } from './components/Hero'
import { Problem } from './components/Problem'
import { HowItWorks } from './components/HowItWorks'
import { ConfiguratorPanel } from './components/ConfiguratorPanel'
import { QuoteRequestForm } from './components/QuoteRequestForm'
import { QuoteSummary } from './components/QuoteSummary'
import { DEFAULT_CONFIGURATION } from './domain/defaults'
import { normalizeConfiguration } from './domain/normalize'
import { useCatalog } from './hooks/useCatalog'
import { useQuote } from './hooks/useQuote'
import './components/section.css'
import './App.css'

const Viewer = lazy(() => import('./scene/Viewer').then((m) => ({ default: m.Viewer })))

export default function App() {
  const catalogState = useCatalog()
  const [draft, setDraft] = useState(DEFAULT_CONFIGURATION)

  // Derived, not stored: once the catalog arrives the draft is clamped to it.
  const configuration = useMemo(
    () =>
      catalogState.status === 'ready'
        ? normalizeConfiguration(draft, catalogState.catalog)
        : draft,
    [draft, catalogState],
  )

  const quote = useQuote(configuration)

  return (
    <main>
      <Hero />
      <Problem />
      <HowItWorks />
      <div className="app" id="configurador">
        <header className="app__header">
          <p className="section__eyebrow">Demo en vivo</p>
          <h2>Pruébalo como lo haría tu cliente</h2>
          <p className="app__notice">
            Es una demostración: las maderas y los precios son de ejemplo y las solicitudes no
            llegan a ningún taller.
          </p>
        </header>
        <div className="app__layout">
          <section className="app__viewer">
            <Suspense fallback={<p role="status">Cargando vista 3D…</p>}>
              <Viewer configuration={configuration} />
            </Suspense>
          </section>
          <aside className="app__side">
            {catalogState.status === 'loading' && <p role="status">Cargando opciones…</p>}
            {catalogState.status === 'error' && (
              <p role="alert">
                No pudimos cargar las opciones. Verifica que el servidor esté en marcha e inténtalo
                de nuevo.
              </p>
            )}
            {catalogState.status === 'ready' && (
              <>
                <ConfiguratorPanel
                  catalog={catalogState.catalog}
                  configuration={configuration}
                  onChange={setDraft}
                />
                <QuoteSummary state={quote} />
                <QuoteRequestForm configuration={configuration} canSubmit={quote.status === 'ready'} />
              </>
            )}
          </aside>
        </div>
      </div>
    </main>
  )
}
