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
            <div className="main-card px-8 py-10">
              <div className="w-12 h-12 bg-ink rounded-xl flex items-center justify-center text-white shadow-lg">
                <FileUp className="w-6 h-6" />
              </div>
              <h2 className="card-title text-2xl mt-4">Upload & Send Document</h2>
              <p className="text-sm text-muted mt-1 max-w-xs mx-auto text-center leading-relaxed">Your files are encrypted and sent directly to the printer via a secure P2P link.</p>

              <div className="w-full flex flex-col gap-8 mt-8">
                {/* File Dropzone */}
                <div 
                  className={`relative group border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer min-h-[160px] ${file ? 'border-success bg-success/5 p-6' : 'border-border bg-paper hover:bg-white p-10'}`}
                  onClick={() => document.getElementById('file-upload').click()}
                >
                  <input
                    type="file"
                    id="file-upload"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {file ? (
                    <div className="flex flex-col items-center gap-4 w-full animate-in fade-in zoom-in-95 duration-300">
                      <div className="w-14 h-14 bg-success rounded-2xl flex items-center justify-center text-white shadow-xl">
                        <FileText className="w-7 h-7" />
                      </div>
                      <div className="text-center overflow-hidden w-full">
                        <p className="text-base font-bold text-ink truncate px-4">{file.name}</p>
                        <div className="flex items-center justify-center gap-2 mt-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                          <p className="text-[10px] text-success font-bold uppercase tracking-widest font-extrabold">READY ({(file.size / (1024 * 1024)).toFixed(2)} MB)</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4 text-center">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-muted shadow-sm group-hover:scale-110 group-hover:text-ink transition-all">
                        <FileUp className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-ink">Click to upload or drag & drop</p>
                        <p className="text-[10px] text-muted font-bold uppercase tracking-widest mt-2 px-4 py-1.5 bg-white rounded-full inline-block border border-border">PDF, JPG, PNG (Max 10MB)</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Section Divider */}
                <div className="flex items-center gap-4 px-2">
                  <div className="h-[1px] flex-1 bg-border" />
                  <div className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-muted whitespace-nowrap">Secure your document</div>
                  <div className="h-[1px] flex-1 bg-border" />
                </div>

                {/* PIN Setup */}
                <div className="flex flex-col gap-6 w-full items-center text-center">
                  <div className="w-full">
                    <div className="text-center mb-4">
                      <label className="text-[11px] font-bold uppercase tracking-widest text-ink block mb-1">Set 4-Digit Security PIN</label>
                      <p className="text-[10px] text-muted font-medium">The shop owner will need this to unlock your file.</p>
                    </div>
                    <div className="flex justify-center">
                      <PinInput value={pin} onChange={setPin} autoFocus />
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {pin.length === 4 && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="w-full overflow-hidden"
                      >
                        <label className="text-[11px] font-bold uppercase tracking-widest text-ink block mb-4 text-center">Confirm Your PIN</label>
                        <div className="flex justify-center">
                          <PinInput value={confirmPin} onChange={setConfirmPin} autoFocus />
                        </div>
                        {confirmPin.length === 4 && pin !== confirmPin && (
                          <p className="text-accent text-[10px] font-bold uppercase tracking-widest mt-4 flex items-center justify-center gap-2">
                            <AlertCircle className="w-3.5 h-3.5" /> PIN Mismatch
                          </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="pt-2 flex flex-col items-center w-full">
                  <button
                    onClick={handleSend}
                    disabled={!isFormValid}
                    className={`btn-primary w-full h-14 rounded-2xl ${!isFormValid ? 'opacity-40 grayscale cursor-not-allowed' : 'hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all'}`}
                  >
                    <span className="text-base font-bold">{!file ? "Select a File to Continue" : isFormValid ? "Upload & Send Securely" : "Confirm Security PIN"}</span>
                    {isFormValid && <ArrowRight className="w-5 h-5 ml-2" />}
                  </button>
                  <button 
                    onClick={() => navigate('/')} 
                    className="w-full max-w-[400px] text-[11px] font-bold uppercase tracking-widest text-muted hover:text-ink transition-colors mt-4 py-2 hover:bg-paper rounded-xl"
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
