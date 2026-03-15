import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  Store, 
  Clock, 
  FileText, 
  Trash2, 
  ShieldAlert, 
  CheckCircle2, 
  Timer,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { createShopPeer } from '../lib/peer';
import { wipeSession } from '../lib/wipe';
import { reassembleChunks } from '../lib/chunker';
import QRDisplay from '../components/QRDisplay';
import CountdownTimer from '../components/CountdownTimer';
import ProgressBar from '../components/ProgressBar';
import PinInput from '../components/PinInput';
import DocumentViewer from '../components/DocumentViewer';

export default function Shop() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [state, setState] = useState('waiting_config'); 
  const [sessionId, setSessionId] = useState(null);
  const [expiryMinutes, setExpiryMinutes] = useState(10);
  const [jobNumber, setJobNumber] = useState(0);
  const [progress, setProgress] = useState(0);

  // File State
  const [fileBlob, setFileBlob] = useState(null);
  const [blobUrl, setBlobUrl] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('');
  const [filePin, setFilePin] = useState(''); 
  const [userPin, setUserPin] = useState(''); 
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
    document.title = `${t('app_name')} — Job ${jobNumber}`;

    peerRef.current = createShopPeer(id);
    
    peerRef.current.on('open', () => {
      setState('waiting');
      toast.success("Reception session started!");
    });

    peerRef.current.on('connection', (conn) => {
      setState('receiving');
      let incomingChunks = [];

      conn.on('data', (data) => {
        if (incomingChunks.length === 0 && data.totalChunks) {
          setFileName(data.fileName);
          setFileType(data.fileType);
          setFilePin(data.pin);
        }
        
        incomingChunks.push(data);
        const currentProgress = Math.round((incomingChunks.length / data.totalChunks) * 100);
        setProgress(currentProgress);

        if (incomingChunks.length === data.totalChunks) {
          const blob = reassembleChunks(incomingChunks, data.fileType);
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
        setState('unlocked');
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
    window.print();
  };

  const sessionUrl = sessionId ? `${window.location.origin}/send?room=${sessionId}` : '';

  return (
    <div className="shop-page">
      {/* Transaction Bar */}
      {sessionId && !['complete', 'expired', 'destroyed', 'waiting_config'].includes(state) && (
        <div className="transaction-bar">
          <div className="job-badge">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span>Job {jobNumber}</span>
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
            <div className="main-card">
              <div className="w-16 h-16 bg-paper rounded-2xl flex items-center justify-center border border-border">
                <Timer className="w-8 h-8 text-ink" />
              </div>
              <h2 className="card-title">Configure Station</h2>
              <div className="w-full space-y-4">
                <div className="text-left">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted block mb-2">{t('select_expiry')}</label>
                  <select 
                    value={expiryMinutes}
                    onChange={(e) => setExpiryMinutes(parseInt(e.target.value))}
                    className="standard-input"
                  >
                    <option value={5}>5 {t('minutes')}</option>
                    <option value={10}>10 {t('minutes')}</option>
                    <option value={30}>30 {t('minutes')}</option>
                  </select>
                </div>
              </div>
              <button onClick={startSession} className="btn-primary">
                {t('start_session')} <Store className="w-5 h-5" />
              </button>
              <button onClick={() => navigate('/')} className="back-button mt-4">
                <ArrowLeft className="w-4 h-4 inline mr-2" /> {t('back')}
              </button>
            </div>
          ) : state === 'waiting' ? (
            <div className="main-card">
              <div className="status-badge">
                <div className="status-dot animate-pulse" />
                {t('waiting')}
              </div>
              <p className="main-card-text">Customers should scan this QR to start sending their document directly.</p>
              <QRDisplay sessionUrl={sessionUrl} />
              <button onClick={() => handleExpire('complete')} className="cancel-button">
                 {t('cancel')}
              </button>
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
              <div className="w-16 h-16 bg-paper rounded-2xl flex items-center justify-center">
                <FileText className="w-8 h-8 text-ink" />
              </div>
              <h3 className="card-title">{t('received')}</h3>
              <p className="main-card-text">{fileName}</p>
              
              <div className="w-full space-y-4">
                <PinInput value={userPin} onChange={handlePinChange} label={t('enter_pin')} />
                {attempts > 0 && <p className="text-accent text-xs font-bold">{3 - attempts} attempts left</p>}
              </div>

              <button onClick={() => handleExpire('complete')} className="cancel-button !mt-8">
                Discard Document
              </button>
            </div>
          ) : state === 'unlocked' ? (
            <div className="w-full max-w-4xl">
               <DocumentViewer blobUrl={blobUrl} fileType={fileType} fileName={fileName} onPrint={handlePrint} />
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
