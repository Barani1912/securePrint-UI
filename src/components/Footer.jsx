import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SourceCodeModal from './SourceCodeModal';

export default function Footer() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);

  return (
    <footer className="footer">
      <p className="footer-text">{t('transparency_note')}</p>
      <div className="footer-links">
        <button onClick={() => navigate('/documentation')} className="footer-link">
          Documentation
        </button>
        <div className="footer-divider"></div>
        <button onClick={() => setIsSourceModalOpen(true)} className="footer-link">
          GitHub
        </button>
        <div className="footer-divider"></div>
        <span className="footer-link">© 2026 Patrona</span>
      </div>

      <SourceCodeModal 
        isOpen={isSourceModalOpen} 
        onClose={() => setIsSourceModalOpen(false)} 
      />
    </footer>
  );
}
