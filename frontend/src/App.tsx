import { useMemo, useState } from 'react'
import { ConfiguratorPanel } from './components/ConfiguratorPanel'
import { QuoteRequestForm } from './components/QuoteRequestForm'
import { QuoteSummary } from './components/QuoteSummary'
import { DEFAULT_CONFIGURATION } from './domain/defaults'
import { normalizeConfiguration } from './domain/normalize'
import { useCatalog } from './hooks/useCatalog'
import { useQuote } from './hooks/useQuote'
import { Viewer } from './scene/Viewer'
import './App.css'

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
    <main className="app">
      <header className="app__header">
        <h1>4-tablas</h1>
        <p>Mesa a medida</p>
      </header>
      <div className="app__layout">
        <section className="app__viewer">
          <Viewer configuration={configuration} />
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
    </main>
  )
}
