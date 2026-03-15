import { QRCodeSVG } from 'qrcode.react';
import { useTranslation } from 'react-i18next';

export default function QRDisplay({ sessionUrl }) {
  const { t } = useTranslation();

  if (!sessionUrl) return null;

  return (
    <div className="qr-container flex-col">
      <div className="qr-code">
        <QRCodeSVG 
          value={sessionUrl} 
          size={240}
          level="H"
          includeMargin={false}
        />
      </div>
      
      <p className="qr-label">{t('scan_qr')}</p>
      <p className="qr-url">{sessionUrl}</p>
    </div>
  );
}
