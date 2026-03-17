import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  Store, 
  Clock, 
  FileText, 
  CheckCircle2, 
  Timer,
  ArrowLeft,
  Printer,
  ShieldCheck,
  Settings2,
  Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { createShopPeer, prewarmServer } from '../lib/peer';
import { wipeSession } from '../lib/wipe';
import { reassembleChunks } from '../lib/chunker';
import QRDisplay from '../components/QRDisplay';
import CountdownTimer from '../components/CountdownTimer';
import ProgressBar from '../components/ProgressBar';
import PinInput from '../components/PinInput';

export default function Shop() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [state, setState] = useState('waiting_config'); 
  const [sessionId, setSessionId] = useState(null);
  const [expiryMinutes, setExpiryMinutes] = useState(10);
  const [jobNumber, setJobNumber] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);

  // File State
  const [fileBlob, setFileBlob] = useState(null);
  const [blobUrl, setBlobUrl] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('');
  const [filePin, setFilePin] = useState(''); 
  const [userPin, setUserPin] = useState(''); 
  const [isPinVerified, setIsPinVerified] = useState(false);
  const [attempts, setAttempts] = useState(0);
  
  const peerRef = useRef(null);

  useEffect(() => {
    const lastJob = parseInt(localStorage.getItem('sp_job_count') || '0');
    setJobNumber(lastJob + 1);
  }, []);

  const startSession = () => {
    const id = crypto.randomUUID();
    setSessionId(id);
    localStorage.setItem('sp_job_count', jobNumber.toString());
    document.title = `${t('app_name')} — ${t('job_label')} ${jobNumber}`;

    setIsConnecting(true);
    peerRef.current = createShopPeer(id);
    
    peerRef.current.on('open', () => {
      setIsConnecting(false);
      setState('waiting');
      toast.success("Reception session started!");
    });

    peerRef.current.on('error', (err) => {
      setIsConnecting(false);
      console.error('PeerJS Error:', err);
      toast.error("Failed to connect to signalling server. Retrying...");
      // Try to prewarm again if it failed
      prewarmServer();
    });

    peerRef.current.on('connection', (conn) => {
      setState('receiving');
      let incomingChunks = [];
      // Capture metadata from the FIRST chunk (chunks 1..N have these as null)
      let receivedFileName = '';
      let receivedFileType = '';
      let receivedFilePin = '';

      conn.on('data', (data) => {
        if (incomingChunks.length === 0 && data.totalChunks) {
          // Only the first chunk carries metadata — store locally so we can
          // use the correct fileType at reassembly time (the last chunk has
          // fileType: null, so using data.fileType there creates a typeless blob
          // which the browser displays as raw binary text instead of rendering as PDF).
          receivedFileName = data.fileName;
          receivedFileType = data.fileType;
          receivedFilePin  = data.pin;
          setFileName(data.fileName);
          setFileType(data.fileType);
          setFilePin(data.pin);
        }
        
        incomingChunks.push(data);
        const currentProgress = Math.round((incomingChunks.length / data.totalChunks) * 100);
        setProgress(currentProgress);

        if (incomingChunks.length === data.totalChunks) {
          // Use receivedFileType (from chunk 0), NOT data.fileType (which is null on the last chunk)
          const blob = reassembleChunks(incomingChunks, receivedFileType);
          const url = URL.createObjectURL(blob);
          setFileBlob(blob);
          setBlobUrl(url);
          setState('received');
          toast.success("Document received!");
        }
      });
    });
  };

  const handleExpire = (reason = 'complete') => {
    wipeSession({ setFileBlob, setFileName, setFileType, setPin: setUserPin, blobUrl, peerRef });
    setBlobUrl(null);
    setState(reason);
    if (reason === 'destroyed') {
      toast.error("Security lockout triggered.");
    }
  };

  const handlePinChange = (val) => {
    setUserPin(val);
    if (val.length === 4) {
      if (val === filePin) {
        setIsPinVerified(true);
        toast.success("PIN Verified.");
        window.onafterprint = () => handleExpire('complete');
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setUserPin('');
        if (newAttempts >= 3) {
          handleExpire('destroyed');
        } else {
           toast.error(t('wrong_pin'));
        }
      }
    }
  };

  const handlePrint = () => {
    if (!blobUrl) return;

    if (fileType === 'application/pdf') {
      // PDF Popup Print (Fixed logic)
      const printWin = window.open(blobUrl, '_blank', 'width=900,height=700');
      if (!printWin) {
        window.open(blobUrl, '_blank');
        return;
      }
      printWin.addEventListener('load', () => {
        printWin.focus();
        printWin.print();
        printWin.addEventListener('afterprint', () => {
          printWin.close();
          handleExpire('complete');
        });
      });
    } else {
      // Image Print
      const printWin = window.open('', '_blank');
      printWin.document.write(`<html><body style="margin:0;display:flex;justify-content:center;align-items:center;"><img src="${blobUrl}" style="max-width:100%;max-height:100%;"></body></html>`);
      printWin.document.close();
      printWin.focus();
      setTimeout(() => {
        printWin.print();
        printWin.close();
        handleExpire('complete');
      }, 500);
    }
  };

  const sessionUrl = sessionId ? `${window.location.origin}/send?room=${sessionId}` : '';

  return (
    <div className="shop-page">
      {/* Transaction Bar */}
      {sessionId && !['complete', 'expired', 'destroyed', 'waiting_config'].includes(state) && (
        <div className="transaction-bar">
          <div className="job-badge">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span>{t('job_label')} {jobNumber}</span>
          </div>
          <CountdownTimer expiryMinutes={expiryMinutes} onExpire={() => handleExpire('expired')} />
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div 
          key={state}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="w-full flex justify-center"
        >
          {state === 'waiting_config' ? (
            <div className="glass-card relative">
              <button 
                onClick={() => navigate('/')} 
                className="absolute top-6 left-6 p-2 rounded-full hover:bg-white/20 transition-colors text-muted hover:text-ink"
                aria-label={t('back')}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="setup-header">
                <div className="w-20 h-20 bg-white/40 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/60 shadow-inner">
                  <ShieldCheck className="w-10 h-10 text-ink" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-ink mb-2">
                    {t('setup_station_title')}
                  </h2>
                  <p className="text-sm text-muted max-w-xs mx-auto leading-relaxed">
                    {t('setup_station_desc')}
                  </p>
                </div>
              </div>

              <div className="w-full space-y-6">
                <div className="text-left">
                  <label htmlFor="expiry-select" className="input-label">
                    {t('select_expiry')}
                  </label>
                  <div className="relative">
                    <select 
                      id="expiry-select"
                      value={expiryMinutes}
                      onChange={(e) => setExpiryMinutes(parseInt(e.target.value))}
                      className="standard-input"
                    >
                      <option value={5}>5 {t('minutes')}</option>
                      <option value={10}>10 {t('minutes')} ({t('recommended')})</option>
                      <option value={30}>30 {t('minutes')}</option>
                    </select>
                  </div>
                  <p className="helper-text">
                    <Activity className="w-3 h-3 inline mr-1 opacity-70" />
                    {t('duration_note')}
                  </p>
                </div>

                <button 
                  onClick={startSession} 
                  className={`btn-primary w-full h-14 text-lg ${isConnecting ? 'opacity-70 cursor-wait' : ''}`}
                  disabled={isConnecting}
                >
                  {isConnecting ? (
                    <>
                      <Clock className="w-6 h-6 animate-spin" />
                      <span>{t('connecting')}</span>
                    </>
                  ) : (
                    <>
                      <span>{t('activate_station')}</span>
                      <Settings2 className="w-6 h-6" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : state === 'waiting' ? (
            <div className="main-card">
              <div className="status-badge">
                <div className="status-dot animate-pulse" />
                READY TO RECEIVE
              </div>
              <h3 className="card-title mt-2">Waiting for Document</h3>
              <p className="main-card-text">
                Ask the customer to scan the QR code or use the link below to securely send their file.
              </p>
              <QRDisplay sessionUrl={sessionUrl} />
              <div className="w-full pt-4 border-t border-border mt-2">
                <button onClick={() => handleExpire('complete')} className="cancel-button w-full">
                   End Session
                </button>
              </div>
            </div>
          ) : state === 'receiving' ? (
            <div className="main-card">
              <div className="w-full">
                <ProgressBar current={progress} total={100} label={t('receiving')} />
              </div>
              <p className="main-card-text">{t('transparency_note')}</p>
            </div>
          ) : state === 'received' ? (
            <div className="main-card">
              <div className="w-16 h-16 bg-paper rounded-2xl flex items-center justify-center border border-border">
                <FileText className={`w-8 h-8 ${isPinVerified ? 'text-success' : 'text-ink'}`} />
              </div>
              <h3 className="card-title">{isPinVerified ? t('verified') : t('received')}</h3>
              <p className="main-card-text font-bold truncate max-w-xs">{fileName}</p>
              
              <div className="w-full mt-10 flex flex-col items-center gap-12">
                <div className="w-full flex flex-col items-center gap-6">
                  <div className={`${isPinVerified ? 'opacity-40 pointer-events-none grayscale' : ''}`}>
                    <PinInput value={userPin} onChange={handlePinChange} label={t('enter_pin')} />
                  </div>
                  
                  {attempts > 0 && !isPinVerified && (
                    <p className="text-accent text-xs font-bold text-center">{3 - attempts} attempts left</p>
                  )}
                </div>

                <div className="flex flex-col items-center w-full gap-8">
                  <button
                    onClick={handlePrint}
                    disabled={!isPinVerified}
                    className={`btn-primary w-full h-14 rounded-2xl ${!isPinVerified ? 'opacity-40 grayscale cursor-not-allowed' : 'shadow-xl hover:scale-[1.02] active:scale-[0.98]'}`}
                  >
                    <Printer className="w-5 h-5" />
                    <span className="text-base font-bold">{t('print')}</span>
                  </button>

                  <button 
                    onClick={() => handleExpire('complete')} 
                    className="w-full max-w-[400px] text-[11px] font-bold uppercase tracking-widest text-muted hover:text-accent transition-colors py-2 hover:bg-paper rounded-xl"
                  >
                    Discard Document
                  </button>
                </div>
              </div>
            </div>
          ) : ['complete', 'expired', 'destroyed'].includes(state) ? (
            <div className="main-card">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${state === 'complete' ? 'bg-success text-white' : 'bg-accent text-white'}`}>
                {state === 'complete' ? <CheckCircle2 className="w-10 h-10" /> : <ShieldAlert className="w-10 h-10" />}
              </div>
              <h2 className="card-title">
                {state === 'complete' ? t('complete') : state === 'expired' ? t('session_expired') : t('session_destroyed')}
              </h2>
              <p className="main-card-text">
                Privacy loop closed. Your document was cleared from volatile memory.
              </p>
              <button onClick={() => window.location.reload()} className="btn-primary">
                {t('new_session')}
              </button>
            </div>
          ) : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
