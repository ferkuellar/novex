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
            title="Cuéntanos tu proyecto y recibe una cotización personalizada"
            subtitle="Te respondemos por teléfono o WhatsApp para revisar medidas, materiales y tiempos de entrega."
          />
          <div className="contact-info">
            <p>Chihuahua, Chihuahua, México</p>
            <p>Tel: (614) 177 7711</p>
            <p>WhatsApp: (614) 177 7711</p>
          </div>

          <ul className="contact-highlights">
            <li>Asesoría sobre material según uso y estilo arquitectónico.</li>
            <li>Recomendación de espesores, cantos y acabados.</li>
            <li>Planeación de tiempos realista para obra o remodelación.</li>
          </ul>

          <div className="contact-actions">
            <CTAButton href="https://wa.me/526141777711">Atención inmediata por WhatsApp</CTAButton>
            <CTAButton href="#proyectos" variant="ghost">Ver proyectos recientes</CTAButton>
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
          <button type="submit" className="btn btn-primary">Enviar solicitud</button>
        </form>
      </div>
    </section>
  );
}

export default ContactSection;
