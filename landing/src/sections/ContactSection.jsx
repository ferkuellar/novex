import React from 'react';
import SectionHeading from '../components/SectionHeading';

function ContactSection() {
  return (
    <section className="section" id="contacto">
      <div className="container contact-wrap">
        <div>
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
        </div>

        <form className="lead-form" onSubmit={(e) => e.preventDefault()}>
          <label>Nombre<input type="text" name="nombre" required /></label>
          <label>Teléfono<input type="tel" name="telefono" required /></label>
          <label>Tipo de proyecto<input type="text" name="tipoProyecto" required /></label>
          <label>Material de interés<input type="text" name="material" required /></label>
          <label>Mensaje<textarea name="mensaje" rows="4" required /></label>
          <button type="submit" className="btn btn-primary">Enviar solicitud</button>
        </form>
      </div>
    </section>
  );
}

export default ContactSection;
