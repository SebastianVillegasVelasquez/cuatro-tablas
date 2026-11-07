import { contactLinks } from '../config/contactLinks'
import './section.css'
import './Contact.css'

const LINKS = contactLinks(import.meta.env)

export function Contact() {
  const hasChannel = LINKS.whatsapp !== null || LINKS.email !== null

  return (
    <section className="section section--dark contact" id="contacto" aria-labelledby="contact-title">
      <div className="section__inner">
        <p className="section__eyebrow">Contacto</p>
        <h2 id="contact-title" className="section__title">
          ¿Tienes un taller? Hablemos.
        </h2>
        <p className="section__lead">
          Cuéntanos qué fabricas y cómo cotizas hoy. Te mostramos cómo se vería tu configurador.
        </p>
        {hasChannel ? (
          <div className="contact__actions">
            {LINKS.whatsapp && (
              <a className="contact__button contact__button--primary" href={LINKS.whatsapp}>
                Escríbenos por WhatsApp
              </a>
            )}
            {LINKS.email && (
              <a className="contact__button" href={LINKS.email}>
                Enviar un correo
              </a>
            )}
          </div>
        ) : (
          <p className="contact__pending">Los datos de contacto estarán disponibles pronto.</p>
        )}
      </div>
    </section>
  )
}
