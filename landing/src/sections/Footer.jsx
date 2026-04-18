import React from 'react';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <a href="#inicio" className="brand">Casa Pietra</a>
          <p>
            Fabricación e instalación de cubiertas premium en mármol, granito y cuarzo para
            proyectos residenciales y comerciales.
          </p>
        </div>
        <div>
          <h3>Enlaces rápidos</h3>
          <ul>
            <li><a href="#materiales">Materiales</a></li>
            <li><a href="#proyectos">Proyectos</a></li>
            <li><a href="#proceso">Proceso</a></li>
            <li><a href="#contacto">Contacto</a></li>
          </ul>
        </div>
        <div>
          <h3>Contacto</h3>
          <p>Chihuahua, Chihuahua, México</p>
          <p>Tel: (614) 177 7711</p>
          <p>WhatsApp: (614) 177 7711</p>
          <p>
            Instagram: <a href="https://instagram.com/casapietramx" target="_blank" rel="noreferrer">@casapietramx</a>
          </p>
          <a href="https://wa.me/526141777711" className="btn btn-light footer-btn">Hablar por WhatsApp</a>
        </div>
      </div>
      <div className="container footer-copy">
        <span>© {new Date().getFullYear()} Casa Pietra. Todos los derechos reservados.</span>
        <a href="/admin" className="footer-admin-link">Acceso admin</a>
      </div>
    </footer>
  );
}

export default Footer;
