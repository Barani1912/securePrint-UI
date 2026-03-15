import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Printer, FileText, Eye, Info } from 'lucide-react';

export default function DocumentViewer({ blobUrl, fileType, fileName, onPrint }) {
  const { t } = useTranslation();
  const isPDF = fileType === 'application/pdf';

  return (
    <motion.div 
      id="document-viewer"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex flex-col items-center gap-[40px] w-full"
    >
      <div className="w-full max-w-2xl bg-white border border-border rounded-[16px] overflow-hidden shadow-sm print:shadow-none print:border-none relative">
        {/* Toolbar */}
        <div className="bg-paper3 border-b border-border px-6 py-4 flex justify-between items-center print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-ink" />
            <span className="text-sm font-bold text-ink truncate max-w-[200px]">{fileName}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-ink rounded-full">
            <Eye className="w-3.5 h-3.5 text-paper" />
            <span className="text-[10px] font-bold text-paper uppercase tracking-widest">Preview</span>
          </div>
        </div>

        <div className="relative">
          {isPDF ? (
            <div className="flex flex-col items-center justify-center p-16 bg-paper2 min-h-[300px]">
              <div className="w-[60px] h-[60px] bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <FileText className="w-8 h-8 text-ink opacity-20" />
              </div>
              <h3 className="text-[20px] font-bold text-ink mb-2">PDF Document</h3>
              <p className="text-muted text-sm text-center max-w-xs leading-relaxed">{t('pdf_fallback_msg')}</p>
              <iframe 
                src={`${blobUrl}#toolbar=0&navpanes=0`} 
                className="hidden print:block print:w-full print:h-[1000px]" 
                title="PDF Viewer"
              />
            </div>
          ) : (
            <motion.img 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={blobUrl} 
              alt={fileName} 
              className="w-full h-auto object-contain max-h-[60vh] mx-auto"
            />
          )}
        </div>
        
        {/* Quality indicator */}
        <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur px-3 py-1 rounded-lg text-[10px] font-bold text-ink uppercase tracking-wider print:hidden border border-border/50">
          Source: In-Memory Blob
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-sm print:hidden">
        <button
          onClick={onPrint}
          className="btn-primary"
        >
          <Printer className="w-5 h-5" />
          <span>{t('print')}</span>
        </button>
        
        <div className="flex items-center justify-center gap-2 text-muted opacity-60">
           <Info className="w-4 h-4" />
           <p className="text-[10px] font-bold uppercase tracking-widest">Wipes immediately after printing</p>
        </div>
      </div>
    </motion.div>
  );
}
