import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Store, Smartphone, Printer, ArrowLeft } from 'lucide-react';

export default function HowItWorks() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const steps = [
    {
      id: 1,
      icon: <Store className="w-8 h-8 text-ink" />,
      title: t('step1_title'),
      desc: t('step1_desc'),
    },
    {
      id: 2,
      icon: <Smartphone className="w-8 h-8 text-ink" />,
      title: t('step2_title'),
      desc: t('step2_desc'),
    },
    {
      id: 3,
      icon: <Printer className="w-8 h-8 text-ink" />,
      title: t('step3_title'),
      desc: t('step3_desc'),
    },
  ];

  return (
    <div className="how-it-works-page">
      <div className="how-it-works-header">
        <button onClick={() => navigate('/')} className="back-button">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-sm font-bold uppercase tracking-widest text-muted">{t('back')}</span>
      </div>

      <h1 className="how-it-works-title">{t('how_it_works')}</h1>

      <div className="space-y-[24px]">
        {steps.map((step) => (
          <div key={step.id} className="step-container">
            <div className="step-icon">
              {step.icon}
            </div>
            <div className="step-content">
              <h2 className="step-title">{step.title}</h2>
              <p className="step-description">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <section className="privacy-section">
        <h3 className="privacy-section-title">Privacy is built-in.</h3>
        <p className="privacy-section-content">
          {t('privacy_policy_box_text')}
          <br /><br />
          <span className="privacy-section-highlight">No trace remains.</span>
        </p>
      </section>
    </div>
  );
}
