import { formatCop } from '../domain/format'
import type { QuoteState } from '../hooks/scheduleQuote'

interface Props {
  state: QuoteState
}

export function QuoteSummary({ state }: Props) {
  return (
    <section className="summary" aria-live="polite" aria-label="Precio estimado">
      <h2>Precio estimado</h2>

      {state.status === 'ready' && <p className="summary__total">{formatCop(state.totalCop)}</p>}

      {state.status === 'loading' && (
        <p className="summary__total summary__total--loading">
          {state.previousTotalCop !== undefined ? formatCop(state.previousTotalCop) : '…'}
          <span className="summary__hint"> Calculando…</span>
        </p>
      )}

      {state.status === 'invalid' && (
        <ul className="summary__issues">
          {state.issues.map((issue, index) => (
            <li key={`${issue.code}-${index}`}>{issue.message}</li>
          ))}
        </ul>
      )}

      {state.status === 'error' && (
        <p className="summary__error">
          No pudimos calcular el precio. Se intentará de nuevo cuando cambies la configuración.
        </p>
      )}

      <p className="summary__note">Valor de referencia, sujeto a confirmación.</p>
    </section>
  )
}
