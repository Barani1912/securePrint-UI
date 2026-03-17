import { QRCodeSVG } from 'qrcode.react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

export default function QRDisplay({ sessionUrl }) {
  const { t } = useTranslation();

  if (!sessionUrl) return null;

  return (
    <div className="qr-container flex-col">
      <div className="qr-code">
        <QRCodeSVG 
          value={sessionUrl} 
          size={196}
          level="H"
          includeMargin={false}
        />
      </div>
      
      <p className="qr-label">{t('scan_qr')}</p>
      
      <div className="qr-url-container">
        <p className="qr-url">{sessionUrl}</p>
        <button 
          className="copy-btn"
          onClick={() => {
            navigator.clipboard.writeText(sessionUrl);
            toast.success(t('link_copied', 'Link copied!'));
          }}
        >
          {t('copy', 'Copy')}
        </button>
      </div>
    </div>
  );
}
