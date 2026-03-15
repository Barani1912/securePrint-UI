import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  FileUp, 
  Smartphone, 
  ArrowRight, 
  AlertCircle, 
  Loader2, 
  CheckCircle2,
  FileText,
  ArrowLeft
} from 'lucide-react';

import { createCustomerPeer } from '../lib/peer';
import { splitIntoChunks } from '../lib/chunker';
import PinInput from '../components/PinInput';
import ProgressBar from '../components/ProgressBar';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function Send() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('room');

  const [state, setState] = useState('connecting'); // connecting | ready | sending | success | error
  const [file, setFile] = useState(null);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const peerRef = useRef(null);
  const connRef = useRef(null);

  useEffect(() => {
    if (!roomId) {
      setError(t('connection_lost'));
      setState('error');
      return;
    }

    const peer = createCustomerPeer();
    peerRef.current = peer;

    const timeout = setTimeout(() => {
      if (state === 'connecting') {
        setError(t('connection_lost'));
        setState('error');
        peer.destroy();
      }
    }, 15000);

    peer.on('open', () => {
      const conn = peer.connect(roomId);
      connRef.current = conn;

      conn.on('open', () => {
        clearTimeout(timeout);
        setState('ready');
      });

      conn.on('close', () => {
        if (state !== 'success') {
          setError(t('connection_lost'));
          setState('error');
        }
      });
    });

    peer.on('error', () => {
      setError(t('connection_lost'));
      setState('error');
    });

    return () => {
      clearTimeout(timeout);
      if (peerRef.current) peerRef.current.destroy();
    };
  }, [roomId, t]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error("File is too large! Maximum limit is 10MB.");
      return;
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error(t('file_invalid_type'));
      return;
    }

    setFile(selectedFile);
    toast.success("File added");
  };

  const isFormValid = file && pin.length === 4 && pin === confirmPin;

  const handleSend = async () => {
    if (!isFormValid || !connRef.current) return;
    
    setState('sending');
    setProgress(0);

    try {
      const buffer = await file.arrayBuffer();
      const chunks = splitIntoChunks(buffer, file.name, file.type, pin);
      
      let sentCount = 0;
      for (const chunk of chunks) {
        connRef.current.send(chunk);
        sentCount++;
        setProgress(Math.round((sentCount / chunks.length) * 100));
        
        if (sentCount % 10 === 0) {
          await new Promise(r => setTimeout(r, 20));
        }
      }

      setState('success');
      toast.success(t('sent_success'));
      
      setTimeout(() => {
        if (peerRef.current) peerRef.current.destroy();
        navigate('/');
      }, 60000);

    } catch (err) {
      setError('Transfer failed. Please try again.');
      setState('error');
    }
  };

  return (
    <div className="send-page">
      <AnimatePresence mode="wait">
        <motion.div 
          key={state}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="w-full flex justify-center"
        >
          {state === 'connecting' ? (
            <div className="flex flex-col items-center gap-4 py-20">
              <Loader2 className="w-12 h-12 text-ink animate-spin opacity-20" />
              <h2 className="text-xl font-bold">Establishing Secure Link</h2>
              <button onClick={() => navigate('/')} className="back-button mt-4">
                <ArrowLeft className="w-4 h-4 inline mr-2" /> Cancel
              </button>
            </div>
          ) : state === 'ready' ? (
            <div className="main-card">
              <div className="w-12 h-12 bg-paper rounded-full flex items-center justify-center text-muted">
                <Smartphone className="w-6 h-6" />
              </div>
              <h2 className="card-title">Send Document</h2>

              <div className="w-full flex flex-col gap-10 mt-8">
                {/* File Dropzone */}
                <div className={`relative group border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center bg-paper hover:bg-white transition-all cursor-pointer min-h-[160px] ${file ? 'p-8' : 'p-12'}`}>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {file ? (
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-ink rounded-xl flex items-center justify-center text-white shadow-xl">
                        <FileText className="w-7 h-7" />
                      </div>
                      <div className="text-left">
                        <p className="text-base font-bold text-ink truncate max-w-[200px]">{file.name}</p>
                        <p className="text-xs text-muted font-bold uppercase tracking-widest mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-5">
                      <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-muted shadow-sm group-hover:scale-110 transition-transform">
                        <FileUp className="w-7 h-7" />
                      </div>
                      <span className="text-sm font-bold text-ink">{t('select_file')} (Max 10MB)</span>
                    </div>
                  )}
                </div>

                {/* Section Divider */}
                <div className="flex items-center gap-4 px-2 py-2">
                  <div className="h-[1px] flex-1 bg-border" />
                  <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted whitespace-nowrap">Security Check</div>
                  <div className="h-[1px] flex-1 bg-border" />
                </div>

                {/* PIN Setup */}
                <div className="flex flex-col gap-10">
                  <div className="w-full">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted block mb-6 text-center">Set 4-Digit Security PIN</label>
                    <div className="flex justify-center">
                      <PinInput value={pin} onChange={setPin} />
                    </div>
                  </div>
                  
                  {pin.length === 4 && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-full"
                    >
                      <label className="text-xs font-bold uppercase tracking-widest text-muted block mb-6 text-center">{t('confirm_pin')}</label>
                      <div className="flex justify-center">
                        <PinInput value={confirmPin} onChange={setConfirmPin} />
                      </div>
                      {confirmPin.length === 4 && pin !== confirmPin && (
                        <p className="text-accent text-xs font-bold uppercase tracking-widest mt-5 flex items-center justify-center gap-2">
                          <AlertCircle className="w-4 h-4" /> {t('pin_mismatch')}
                        </p>
                      )}
                    </motion.div>
                  )}
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleSend}
                    disabled={!isFormValid}
                    className={`btn-primary w-full ${!isFormValid ? 'opacity-40 grayscale cursor-not-allowed' : 'hover:shadow-xl hover:translate-y-[-2px] active:translate-y-0 transition-all'}`}
                  >
                    <span>{t('send_securely')}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => navigate('/')} 
                    className="w-full text-xs font-bold uppercase tracking-widest text-muted hover:text-ink transition-colors mt-6 py-2"
                  >
                    Cancel & Go Back
                  </button>
                </div>
              </div>
            </div>
          ) : state === 'sending' ? (
            <div className="main-card">
              <div className="w-full">
                <ProgressBar current={progress} total={100} label="Transmitting via P2P" />
              </div>
              <p className="main-card-text">{t('transparency_note')}</p>
            </div>
          ) : state === 'success' ? (
            <div className="main-card">
              <div className="w-16 h-16 bg-success text-white rounded-2xl flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="card-title">{t('doc_sent')}</h2>
              <p className="main-card-text">
                Transfer complete.
                <br /><br />
                <span className="font-bold text-ink">PIN Shared?</span>
                <br />
                Tell the shop owner your secret 4-digit PIN aloud to unlock the document.
              </p>
              <button onClick={() => navigate('/')} className="btn-primary">
                {t('new_session')}
              </button>
            </div>
          ) : state === 'error' ? (
            <div className="main-card">
              <div className="w-12 h-12 bg-paper rounded-full flex items-center justify-center text-accent">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h2 className="card-title">Link Error</h2>
              <p className="main-card-text">{error}</p>
              <button onClick={() => navigate('/')} className="back-button">
                <ArrowLeft className="w-4 h-4 inline mr-2" /> Try Again
              </button>
            </div>
          ) : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
