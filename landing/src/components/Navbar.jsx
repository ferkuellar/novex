import React, { useState } from 'react';
import CTAButton from './CTAButton';

const menuItems = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Materiales', href: '#materiales' },
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Proceso', href: '#proceso' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Contacto', href: '#contacto' },
];

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <a href="#inicio" className="brand">StoneHaus</a>

        <nav className="desktop-nav" aria-label="Navegación principal">
          {menuItems.map((item) => (
            <a key={item.label} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <CTAButton href="https://wa.me/52614177711" className="desktop-cta">
            Cotiza por WhatsApp
          </CTAButton>

          <button
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Abrir menú"
            onClick={() => setOpen((prev) => !prev)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <nav id="mobile-menu" className={`mobile-nav ${open ? 'open' : ''}`} aria-label="Menú móvil">
        {menuItems.map((item) => (
          <a key={item.label} href={item.href} onClick={() => setOpen(false)}>
            {item.label}
          </a>
        ))}
        <CTAButton href="https://wa.me/52614177711" className="mobile-cta">
          Cotiza por WhatsApp
        </CTAButton>
      </nav>
    </header>
  );
}

export default Navbar;
