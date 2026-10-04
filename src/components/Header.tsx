import React, { useState, useEffect } from 'react';
import contentData from '../data/contentData.json';
import { Phone, Clock, ShieldCheck, QrCode } from 'lucide-react';

interface HeaderProps {
  onOpenDownload: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenDownload }) => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: VietinBank Brand Logo */}
          <div className="flex items-center gap-4">
            <a
              href="#top"
              className="flex items-center gap-3 transition-transform hover:scale-[1.01]"
              title="VietinBank"
            >
              <img
                src={contentData.branding.logoUrl}
                alt="VietinBank Logo"
                referrerPolicy="no-referrer"
                className="h-10 sm:h-12 w-auto object-contain"
                onError={(e) => {
                  // Fallback if raw GitHub content is delayed
                  (e.currentTarget as HTMLElement).style.display = 'none';
                  const fallback = e.currentTarget.parentElement?.querySelector('.logo-fallback');
                  if (fallback) (fallback as HTMLElement).style.display = 'flex';
                }}
              />
              <div className="logo-fallback hidden items-center gap-2">
                <span className="text-2xl font-bold tracking-tight text-[#005596]">Vietin<span className="text-[#ED1C24]">Bank</span></span>
              </div>
            </a>

            <div className="hidden md:flex flex-col border-l border-slate-200 pl-4 py-0.5">
              <span className="text-xs font-bold text-slate-800 tracking-wide uppercase">
                {contentData.branding.branchName}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                Cổng Tương Tác Quầy Giao Dịch
              </span>
            </div>
          </div>

          {/* Right: Counter utilities, Advisor Direct Hotline, Digital Clock */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Real-time Clock */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100/80 text-xs font-medium text-slate-600 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{time || '08:00:00'}</span>
            </div>

            {/* Download App Shortcut */}
            <button
              onClick={onOpenDownload}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-sky-50 text-[#005596] hover:bg-sky-100 transition-colors border border-sky-100 cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-[#005596]" />
              <span className="hidden sm:inline">Quét QR Tải App</span>
              <span className="sm:hidden">Tải App</span>
            </button>

            {/* Direct Advisor Call */}
            <a
              href={`tel:${contentData.branding.advisor.phoneRaw}`}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#005596] to-[#003c70] rounded-lg shadow-xs hover:from-[#004780] hover:to-[#002f58] transition-all cursor-pointer whitespace-nowrap"
              title={`Gọi Chuyên viên ${contentData.branding.advisor.name}`}
            >
              <Phone className="w-3.5 h-3.5 fill-current animate-pulse" />
              <span className="hidden sm:inline">{contentData.branding.advisor.name}:</span>
              <span className="font-mono tracking-wider">{contentData.branding.advisor.phone}</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
