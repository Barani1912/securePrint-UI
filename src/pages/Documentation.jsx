import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck, Zap, Lock, EyeOff, Terminal, HardDrive } from 'lucide-react';

export default function Documentation() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const sections = [
    {
      title: "How it Works",
      icon: <Zap className="w-6 h-6" />,
      content: "SecurePrint leverages WebRTC (Web Real-Time Communication) to establish a direct connection between your phone and the shop's computer. When you scan the QR code, a 'secret tunnel' is created. Your document is broken into tiny encrypted chunks, sent through this tunnel, and reassembled in the shop's browser memory. It never touches our server or any cloud storage."
    },
    {
      title: "Security Model",
      icon: <Lock className="w-6 h-6" />,
      content: "We follow a 'Zero Trace' philosophy. The 4-digit PIN you create is never sent over the network; it acts as a local key to unlock the document once it arrives. If someone tries to guess the PIN, the session self-destructs after 3 failed attempts. Additionally, closing the tab or printing the document triggers an immediate memory wipe."
    },
    {
      title: "Privacy First",
      icon: <EyeOff className="w-6 h-6" />,
      content: "Most print shops ask you to send documents via WhatsApp or email, where they stay forever. With SecurePrint, there is no history, no logs, and no traces. We don't use cookies or analytics. Even the signalling server (the 'matchmaker' that helps devices find each other) deletes session metadata within 60 seconds."
    }
  ];

  return (
    <div className="doc-section max-w-4xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-12"
      >
        {/* Header */}
        <div className="flex flex-col gap-6">
          <button
            onClick={() => navigate(-1)}
            className="back-button !p-0 self-start"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-bold">{t('back')}</span>
          </button>
          <h1 className="text-4xl md:text-5xl font-black text-ink tracking-tight">
            Project Guide & Documentation
          </h1>
          <p className="text-xl text-muted leading-relaxed max-w-2xl">
            Everything you need to know about the most secure way to print documents in the digital age.
          </p>
        </div>

        <hr className="border-border" />

        {/* Quick Start */}
        <section className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-ink">Quick Start for Shop Owners</h2>
          <div className="doc-card-grid">
            <div className="doc-card">
              <div className="doc-card-icon">
                <Terminal className="w-6 h-6 text-ink" />
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="font-bold text-lg text-ink">Setup</h3>
                <p className="text-muted text-sm leading-relaxed">
                  Open SecurePrint on your PC, select how long you want the session to stay active, and click <strong>'Start Session'</strong>.
                </p>
              </div>
            </div>
            <div className="doc-card">
              <div className="doc-card-icon">
                <HardDrive className="w-6 h-6 text-ink" />
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="font-bold text-lg text-ink">Receiving</h3>
                <p className="text-muted text-sm leading-relaxed">
                  Once the document arrives, ask the customer for their 4-digit PIN to view and print. Everything is wiped automatically afterward.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Concepts */}
        <section className="flex flex-col gap-10">
          <h2 className="text-2xl font-bold text-ink">Core Concepts</h2>
          <div className="flex flex-col gap-8">
            {sections.map((s, i) => (
              <div key={i} className="doc-concept-item">
                <div className="doc-concept-icon shrink-0">
                  {s.icon}
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="text-xl font-bold text-ink">{s.title}</h3>
                  <p className="text-muted leading-relaxed line-height-relaxed">
                    {s.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Production & Reliability */}
        <section className="privacy-section">
          <div className="flex items-center gap-3 justify-center mb-6">
            <ShieldCheck className="w-8 h-8 text-accent" />
            <h2 className="privacy-section-title !m-0">Production & Reliability</h2>
          </div>
          <p className="privacy-section-content mb-8">
            SecurePrint is designed for high-traffic print shops. It supports multiple simultaneous customers in separate browser tabs and works reliably even on 3G networks. 
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <span className="px-4 py-2 bg-white/10 rounded-full text-xs font-mono tracking-wider">WEBRTC_P2P</span>
            <span className="px-4 py-2 bg-white/10 rounded-full text-xs font-mono tracking-wider">DTLS_ENCRYPTED</span>
            <span className="px-4 py-2 bg-white/10 rounded-full text-xs font-mono tracking-wider">ZERO_STORAGE</span>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
