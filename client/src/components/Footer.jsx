import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <p className="footer-text">{t('transparency_note')}</p>
      <div className="footer-links">
        <button onClick={() => navigate('/documentation')} className="footer-link">
          Documentation
        </button>
        <div className="footer-divider"></div>
        <a href="https://github.com/example/secureprint" target="_blank" rel="noopener noreferrer" className="footer-link">
          GitHub
        </a>
        <div className="footer-divider"></div>
        <span className="footer-link">© 2026 SecurePrint</span>
      </div>
    </footer>
  );
}
