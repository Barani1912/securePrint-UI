import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, ExternalLink, Layout, Server } from 'lucide-react';

export default function SourceCodeModal({ isOpen, onClose }) {
  const repos = [
    {
      name: 'Frontend (UI)',
      desc: 'The React + Vite application for customers and shops.',
      url: 'https://github.com/Barani1912/securePrint-UI',
      icon: <Layout className="w-5 h-5" />,
      tag: 'React / Tailwind'
    },
    {
      name: 'Backend (Signalling)',
      desc: 'Node.js server for PeerJS signalling and room management.',
      url: 'https://github.com/Barani1912/securePrint-BE',
      icon: <Server className="w-5 h-5" />,
      tag: 'Node.js / PeerJS'
    }
  ];

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
            className="relative w-full max-w-md bg-paper rounded-[32px] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="pt-12 pb-8 px-10 flex flex-col items-center relative">
               <button 
                onClick={onClose}
                className="absolute top-8 right-8 p-3 hover:bg-paper2 rounded-full transition-all text-muted hover:text-ink"
               >
                 <X className="w-6 h-6" />
               </button>

               <div className="w-16 h-16 bg-ink rounded-2xl flex items-center justify-center text-paper shadow-xl mb-6">
                 <Github className="w-8 h-8" />
               </div>
               
               <div className="text-center">
                  <h2 className="text-2xl font-black tracking-tight text-ink mb-2">Source Code</h2>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted font-bold">Audit Our Implementation</p>
               </div>
            </div>

            {/* Repos List */}
            <div className="px-10 pb-10 flex flex-col gap-6">
              {repos.map((repo, idx) => (
                <a 
                  key={idx}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-8 bg-white border-2 border-border/30 rounded-[28px] hover:bg-ink hover:border-ink hover:translate-y-[-4px] shadow-sm hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-4 text-ink group-hover:text-paper transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-paper2 group-hover:bg-paper/10 flex items-center justify-center transition-colors">
                        {repo.icon}
                      </div>
                      <span className="text-lg font-bold">{repo.name}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-paper2 group-hover:bg-paper/10 flex items-center justify-center transition-colors">
                      <ExternalLink className="w-4 h-4 text-muted group-hover:text-paper" />
                    </div>
                  </div>
                  <p className="text-sm text-muted group-hover:text-paper/70 mb-5 leading-relaxed transition-colors">{repo.desc}</p>
                  <span className="inline-block text-[10px] font-black uppercase tracking-widest py-1.5 px-4 bg-paper2 group-hover:bg-paper/10 rounded-full text-muted group-hover:text-paper/60 transition-colors">
                    {repo.tag}
                  </span>
                </a>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-8 bg-paper2/30 border-t border-border/20 text-center">
                <p className="text-xs font-bold text-muted/60 uppercase tracking-widest leading-loose">
                    This project is fully open-source.<br/>Your privacy is our code.
                </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
