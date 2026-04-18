import React from 'react';
import SectionHeading from '../components/SectionHeading';
import CTAButton from '../components/CTAButton';

function ContactSection() {
  return (
    <section className="section" id="contacto">
      <div className="container contact-wrap">
        <div className="contact-copy">
          <SectionHeading
            eyebrow="Contacto"
            title={
              <>
                <span className="section-title-main">Cuéntanos tu proyecto</span>
                <span className="section-title-subline">y recibe una cotización personalizada</span>
              </>
            }
            subtitle={(
              <>
                <span className="contact-subtitle-full">Te respondemos por teléfono o WhatsApp para revisar medidas, materiales y tiempos de entrega.</span>
                <span className="contact-subtitle-mobile">Respuesta rápida por WhatsApp para cotizar medidas, material y tiempos.</span>
              </>
            )}
          />
          <div className="contact-info">
            <p>Chihuahua, Chihuahua, México</p>
            <p className="contact-line-phone">Tel: (614) 177 7711</p>
            <p>WhatsApp: (614) 177 7711</p>
            <p>
              Instagram: <a href="https://instagram.com/casapietramx" target="_blank" rel="noreferrer">@casapietramx</a>
            </p>
          </div>

          <ul className="contact-highlights contact-highlights-desktop">
            <li>Asesoría sobre material según uso y estilo arquitectónico.</li>
            <li>Recomendación de espesores, cantos y acabados.</li>
            <li>Planeación de tiempos realista para obra o remodelación.</li>
          </ul>

          <details className="contact-highlights-mobile">
            <summary>Ver asesoría incluida</summary>
            <ul className="contact-highlights">
              <li>Asesoría sobre material según uso y estilo arquitectónico.</li>
              <li>Recomendación de espesores, cantos y acabados.</li>
              <li>Planeación de tiempos realista para obra o remodelación.</li>
            </ul>
          </details>

          <div className="contact-actions">
            <CTAButton href="https://wa.me/526141777711">Hablar por WhatsApp</CTAButton>
            <CTAButton href="#proyectos" variant="ghost" className="contact-secondary-action">Ver proyectos</CTAButton>
          </div>
        </div>

        <form className="lead-form" onSubmit={(e) => e.preventDefault()}>
          <p className="form-title">Solicitar cotización</p>
          <div className="lead-fields">
            <label htmlFor="nombre">Nombre<input id="nombre" type="text" name="nombre" placeholder="Tu nombre" required /></label>
            <label htmlFor="telefono">Teléfono<input id="telefono" type="tel" name="telefono" placeholder="(614) 000 0000" required /></label>
            <label htmlFor="tipoProyecto">Tipo de proyecto<input id="tipoProyecto" type="text" name="tipoProyecto" placeholder="Cocina, baño, barra..." required /></label>
            <label htmlFor="material">Material de interés<input id="material" type="text" name="material" placeholder="Mármol, granito o cuarzo" required /></label>
          </div>
          <label htmlFor="mensaje">Mensaje<textarea id="mensaje" name="mensaje" rows="4" placeholder="Cuéntanos medidas aproximadas, estilo y tiempos." required /></label>
          <button type="submit" className="btn btn-primary">Solicitar cotización</button>
        </form>
      </div>
    </section>
  );
}

export default ContactSection;
