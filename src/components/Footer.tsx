import React from 'react';
import { Phone, ShieldCheck, Clock, MapPin, ExternalLink, QrCode } from 'lucide-react';
import contentData from '../data/contentData.json';

interface FooterProps {
  onSelectTab: (tabId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="bg-slate-900 text-white mt-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white">
                Vietin<span className="text-[#ED1C24]">Bank</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ngân hàng TMCP Công Thương Việt Nam — {contentData.branding.branchName}.
              Cổng dịch vụ tương tác thông minh phục vụ khách hàng tại quầy giao dịch.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Giao dịch an toàn & bảo mật tuyệt đối</span>
            </div>
          </div>

          {/* Col 2: Advisor in Charge */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider">
              Chuyên viên tư vấn trực tiếp
            </h4>
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
              <div className="text-sm font-bold text-white">
                {contentData.branding.advisor.name}
              </div>
              <div className="text-xs text-slate-400">
                {contentData.branding.advisor.role}
              </div>
              <a
                href={`tel:${contentData.branding.advisor.phoneRaw}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#005596] hover:bg-[#004275] text-white text-xs font-bold font-mono transition-colors"
              >
                <Phone className="w-3.5 h-3.5 fill-current animate-pulse" />
                {contentData.branding.advisor.phone}
              </a>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider">
              Tiện ích tra cứu
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => onSelectTab('faq')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  · Giải đáp thắc mắc Ipay & Sinh trắc học
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('savings')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  · Công cụ tính lãi suất tiền gửi
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('loan')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  · Lịch trả nợ vay dư nợ giảm dần
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('game')}
                  className="hover:text-white transition-colors cursor-pointer text-left text-amber-300 font-semibold"
                >
                  · Thử thách Game săn voucher xăng
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('branches')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  · Danh sách phòng giao dịch khu vực
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Customer Support & Hotline */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider">
              Tổng đài 24/7
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div>
                <span className="text-slate-400 block text-[11px]">Tổng đài VietinBank:</span>
                <a href="tel:1900558868" className="text-base font-black font-mono text-white hover:text-sky-300">
                  1900 558 868
                </a>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Giờ làm việc tại quầy:</span>
                <span className="text-slate-300">Thứ 2 - Thứ 6 (07:30 - 16:30)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Ngân hàng TMCP Công Thương Việt Nam (VietinBank). Bản quyền thuộc về VietinBank.
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onSelectTab('download')}
              className="hover:text-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Tải VietinBank iPay</span>
            </button>
            <a
              href="https://www.vietinbank.vn"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors flex items-center gap-1"
            >
              <span>vietinbank.vn</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
