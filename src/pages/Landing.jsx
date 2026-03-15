import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Store, Smartphone, ArrowRight } from 'lucide-react';

export default function Landing() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Header */}
      <div className="landing-header">
        <h1 className="landing-title">{t('app_name')}</h1>
        <p className="landing-subtitle">{t('tagline')}</p>
      </div>

      {/* Cards */}
      <div className="cards-container">
        {/* Shop Card */}
        <motion.div 
          className="card cursor-pointer" 
          onClick={() => navigate('/shop')}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
        >
          <div className="card-icon">
            <Store className="w-8 h-8 text-ink" />
          </div>
          <h2 className="card-title">{t('role_shop_title')}</h2>
          <p className="card-description">{t('role_shop_desc')}</p>
          <button className="card-link">
            {t('start_session')} <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Customer Card */}
        <motion.div 
          className="card cursor-pointer" 
          onClick={() => navigate('/how-it-works')}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
        >
          <div className="card-icon">
            <Smartphone className="w-8 h-8 text-ink" />
          </div>
          <h2 className="card-title">{t('role_customer_title')}</h2>
          <p className="card-description">{t('role_customer_desc')}</p>
          <button className="card-link">
            {t('how_it_works')} <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>

      {/* Bottom Note */}
      <div className="text-center max-w-2xl px-4">
        <p className="footer-text opacity-70">
          {t('transparency_note')} Peer-to-peer data transfer means your document is never stored, 
          never logged, and never seen by anyone but the intended recipient.
        </p>
      </div>
    </div>
  );
}
