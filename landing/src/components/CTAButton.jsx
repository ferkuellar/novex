import React from 'react';

function CTAButton({ href = '#', children, variant = 'primary', className = '' }) {
  return (
    <a href={href} className={`btn btn-${variant} ${className}`.trim()}>
      {children}
    </a>
  );
}

export default CTAButton;
