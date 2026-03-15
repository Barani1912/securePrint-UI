import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'ta' : 'en';
    i18n.changeLanguage(nextLang);
    localStorage.setItem('sp_lang', nextLang);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">S</div>
        <h1 className="navbar-title">SecurePrint</h1>
      </div>
      <div className="navbar-right">
        <button className="navbar-lang-button" onClick={toggleLanguage}>
          {i18n.language === 'en' ? 'தமிழ்' : 'English'}
        </button>
      </div>
    </nav>
  );
}
