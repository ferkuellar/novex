import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="hero">
        <h1>Bienvenido a NOVEX</h1>
        <p>Soluciones tecnológicas a tu alcance</p>
      </header>
      <section className="services">
        <h2>Servicios</h2>
        <ul>
          <li>Desarrollo de software a medida</li>
          <li>Consultoría tecnológica</li>
          <li>Soporte y mantenimiento</li>
        </ul>
      </section>
      <section className="about">
        <h2>Nosotros</h2>
        <p>
          En NOVEX nos especializamos en brindar soluciones innovadoras para
          potenciar tu negocio.
        </p>
      </section>
      <section className="contact">
        <h2>Contacto</h2>
        <p>Escríbenos a contacto@novex.com</p>
      </section>
    </div>
  );
}

export default App;
