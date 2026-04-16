import React, { useEffect, useState } from 'react';

const COOKIE_CONSENT_KEY = 'casa_pietra_cookie_consent_v2';

function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const storedConsent = window.localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!storedConsent) {
        setVisible(true);
        return;
      }

      const parsed = JSON.parse(storedConsent);
      const validDecision = parsed?.decision === 'accepted' || parsed?.decision === 'rejected';
      if (!validDecision) setVisible(true);
    } catch (error) {
      setVisible(true);
    }
  }, []);

  const saveConsent = (decision) => {
    try {
      window.localStorage.setItem(
        COOKIE_CONSENT_KEY,
        JSON.stringify({
          decision,
          date: new Date().toISOString(),
        }),
      );
    } catch (error) {
      // If storage is blocked, we still close the banner for current session view.
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside className="cookie-banner" role="dialog" aria-live="polite" aria-label="Aviso de cookies">
      <div className="cookie-banner-inner">
        <p>
          Utilizamos cookies para mejorar tu experiencia y el rendimiento del sitio.
        </p>
        <div className="cookie-banner-actions">
          <button type="button" className="btn btn-ghost" onClick={() => saveConsent('rejected')}>
            No aceptar cookies
          </button>
          <button type="button" className="btn btn-primary" onClick={() => saveConsent('accepted')}>
            Aceptar cookies
          </button>
        </div>
      </div>
    </aside>
  );
}

export default CookieConsentBanner;
