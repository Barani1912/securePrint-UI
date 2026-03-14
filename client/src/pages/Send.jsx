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
      toast.error(t('file_too_large'));
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
            </div>
          ) : state === 'ready' ? (
            <div className="main-card">
              <div className="w-12 h-12 bg-paper rounded-full flex items-center justify-center text-muted">
                <Smartphone className="w-6 h-6" />
              </div>
              <h2 className="card-title">Send Document</h2>

              <div className="w-full space-y-8 mt-4">
                {/* File Dropzone */}
                <div className="relative group border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center bg-paper hover:bg-white transition-all cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {file ? (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-ink rounded-lg flex items-center justify-center text-white">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-ink truncate max-w-[160px]">{file.name}</p>
                        <p className="text-[10px] text-muted font-bold uppercase tracking-widest mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <FileUp className="w-8 h-8 text-muted" />
                      <span className="text-sm font-bold text-ink">{t('select_file')}</span>
                    </div>
                  )}
                </div>

                {/* PIN Setup */}
                <div className="space-y-6">
                  <div className="text-left">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted block mb-4">Set 4-Digit Security PIN</label>
                    <PinInput value={pin} onChange={setPin} />
                  </div>
                  
                  {pin.length === 4 && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-left"
                    >
                      <label className="text-xs font-bold uppercase tracking-widest text-muted block mb-4">{t('confirm_pin')}</label>
                      <PinInput value={confirmPin} onChange={setConfirmPin} />
                      {confirmPin.length === 4 && pin !== confirmPin && (
                        <p className="text-accent text-[10px] font-bold uppercase tracking-widest mt-2">{t('pin_mismatch')}</p>
                      )}
                    </motion.div>
                  )}
                </div>

                <button
                  onClick={handleSend}
                  disabled={!isFormValid}
                  className="btn-primary"
                >
                  <span>{t('send_securely')}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
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
