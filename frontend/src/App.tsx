import { DEFAULT_CONFIGURATION } from './domain/defaults'
import { Viewer } from './scene/Viewer'
import './App.css'

export default function App() {
  return (
    <main className="app">
      <header className="app__header">
        <h1>4-tablas</h1>
        <p>Mesa a medida</p>
      </header>
      <div className="app__layout">
        <section className="app__viewer">
          <Viewer configuration={DEFAULT_CONFIGURATION} />
        </section>
      </div>
    </main>
  )
}
