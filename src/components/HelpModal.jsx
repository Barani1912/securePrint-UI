import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Zap, Lock, Github, Info, BookOpen } from 'lucide-react';

export default function HelpModal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
          />
          
          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-paper rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="bg-ink p-8 flex justify-between items-center text-paper">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-paper2/20 rounded-xl flex items-center justify-center">
                   <BookOpen className="w-5 h-5" />
                 </div>
                 <h2 className="text-2xl font-black tracking-tight">Project Guide</h2>
               </div>
               <button 
                onClick={onClose}
                className="p-2 hover:bg-paper/10 rounded-full transition-colors"
               >
                 <X className="w-6 h-6" />
               </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-10 sm:p-12 space-y-12">
               {/* Intro */}
               <section>
                 <h3 className="text-xl font-black text-ink mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-accent" />
                    What is SecurePrint?
                 </h3>
                 <p className="text-muted leading-relaxed font-medium">
                   SecurePrint is a privacy-first document transfer system designed for the "print shop" use case. It allows users to send documents directly from their phone to a printer device without using email, USB drives, or third-party storage. 
                 </p>
               </section>

               {/* Features Grid */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-ink font-black uppercase text-xs tracking-widest">
                       <ShieldCheck className="w-4 h-4 text-success" />
                       Zero-Trace Policy
                    </div>
                    <p className="text-muted text-sm leading-relaxed">
                      Files are transferred via WebRTC P2P. They exist only in your browser's RAM and are never written to a disk or server.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-ink font-black uppercase text-xs tracking-widest">
                       <Lock className="w-4 h-4 text-accent" />
                       PIN Protection
                    </div>
                    <p className="text-muted text-sm leading-relaxed">
                      Every document is locked with a 4-digit PIN. Only the shop owner with the PIN can view and print the file.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-ink font-black uppercase text-xs tracking-widest">
                       <Zap className="w-4 h-4 text-warning" />
                       Auto-Destruction
                    </div>
                    <p className="text-muted text-sm leading-relaxed">
                      Sessions automatically expire after 10 minutes, and documents are wiped immediately after the print dialog finishes.
                    </p>
                  </div>
                   <div className="space-y-3">
                    <div className="flex items-center gap-2 text-ink font-black uppercase text-xs tracking-widest">
                       <Github className="w-4 h-4" />
                       Open Source
                    </div>
                    <p className="text-muted text-sm leading-relaxed">
                      Audit the code yourself. SecurePrint is a standard-compliant, transparent implementation of modern web protocols.
                    </p>
                  </div>
               </div>

               {/* Setup Steps */}
               <section className="bg-paper2 p-8 rounded-3xl space-y-4">
                  <h4 className="font-black text-ink uppercase tracking-widest text-xs">Quick Setup</h4>
                  <ul className="space-y-3 text-sm font-medium">
                     <li className="flex gap-3">
                        <span className="opacity-30">01</span>
                        <span>Shop starts a <b>Session</b> and displays the QR.</span>
                     </li>
                     <li className="flex gap-3">
                        <span className="opacity-30">02</span>
                        <span>Customer scans QR and picks a <b>PDF/Image</b> + <b>PIN</b>.</span>
                     </li>
                     <li className="flex gap-3">
                        <span className="opacity-30">03</span>
                        <span>Shop enters the PIN to <b>Print</b>. Everything is wiped.</span>
                     </li>
                  </ul>
               </section>
            </div>

            {/* Footer */}
            <div className="bg-paper2 border-t border-border p-6 text-center">
               <button 
                onClick={onClose}
                className="bg-ink text-paper px-10 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-accent transition-all"
               >
                 Got it, thanks!
               </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
