import React from 'react';

function SectionHeading({ eyebrow, title, subtitle, centered = false }) {
  return (
    <header className={`section-heading ${centered ? 'centered' : ''}`}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2>{title}</h2>
      {subtitle ? <p className="subtitle">{subtitle}</p> : null}
    </header>
  );
}

export default SectionHeading;
