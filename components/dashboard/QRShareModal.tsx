'use client';

import { useState, useRef } from 'react';
import { FiX, FiDownload, FiShare2, FiCheck, FiCopy } from 'react-icons/fi';
import QRCodeGenerator, { PRESETS, QRPreset } from '../qr/QRCodeGenerator';

interface QRShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
}

export default function QRShareModal({ isOpen, onClose, username }: QRShareModalProps) {
  const [preset, setPreset] = useState<QRPreset>('obsidian');
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const qrData = `https://getonelink.vercel.app/${username}`;

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(qrData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async (extension: 'png' | 'svg' | 'jpeg' | 'webp') => {
    setIsDownloading(true);
    try {
      const { default: QRCodeStyling } = await import('qr-code-styling');

      const downloadOptions = {
        width: 1200,
        height: 1200,
        data: qrData,
        margin: 40,
        type: 'svg' as const,
        ...PRESETS[preset],
      };

      const qrCode = new QRCodeStyling(downloadOptions);
      await qrCode.download({
        name: `onelink-qr-${username}-${preset}`,
        extension: extension
      });
    } catch (err) {
      console.error("Download failed", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-xl animate-in fade-in duration-500"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-[#111111] border border-white/5 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 fade-in duration-300">

        {/* Header */}
        <div className="flex items-center justify-between p-8 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400">
              <FiShare2 size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-white tracking-tight">Share Profile</h3>
              <p className="text-[11px] font-medium text-white/20 uppercase tracking-[2px]">Your Digital Signature</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/20 hover:text-white transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 pt-4 space-y-8">

          {/* QR Preview */}
          <div className="relative group">
            <QRCodeGenerator data={qrData} preset={preset} size={280} />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] rounded-2xl transition-all duration-300 flex items-center justify-center gap-4">
              <button
                onClick={() => handleDownload('png')}
                className="p-3 bg-white text-black rounded-full hover:scale-110 active:scale-95 transition-all shadow-xl"
                title="Download PNG"
              >
                <FiDownload size={20} />
              </button>
            </div>
          </div>

          {/* Style Selector */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase text-white/20 tracking-widest ml-1">Choose your aesthetic</h4>
            <div className="flex gap-3">
              {(['obsidian', 'notion', 'cherry-blossom'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPreset(p)}
                  className={`flex-1 py-3 px-2 rounded-xl text-[11px] font-black uppercase tracking-tight transition-all border ${preset === p
                      ? 'bg-white text-black border-white shadow-xl shadow-white/5'
                      : 'bg-white/5 text-white/40 border-white/5 hover:bg-white/10'
                    }`}
                >
                  {p.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Link Copy */}
          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 group">
            <div className="flex-1 overflow-hidden">
              <p className="text-[12px] font-mono text-white/40 truncate">{qrData}</p>
            </div>
            <button
              onClick={handleCopy}
              className="p-2 text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-2"
            >
              {copied ? <FiCheck size={18} /> : <FiCopy size={18} />}
              <span className="text-[10px] font-black uppercase tracking-widest">{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white/5 p-6 border-t border-white/5 flex items-center justify-between">
          <p className="text-[10px] font-medium text-white/10 uppercase tracking-widest">Powered by OneLink Premium</p>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
            <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
