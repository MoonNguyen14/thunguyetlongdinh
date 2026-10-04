import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Phone,
  Navigation as NavigationIcon,
  ExternalLink,
  Building2,
  Calendar,
  ShieldCheck,
  ChevronRight,
  Maximize2,
  X,
} from 'lucide-react';
import contentData from '../data/contentData.json';
import { BranchLocation } from '../types';

export const BranchNetworkSection: React.FC = () => {
  const branchesConfig = contentData.branches;
  const locations: BranchLocation[] = branchesConfig.items;

  const [selectedBranchId, setSelectedBranchId] = useState<string>(locations[0].id);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const activeBranch = locations.find((l) => l.id === selectedBranchId) || locations[0];

  return (
    <div className="max-w-6xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-[#005596] text-xs font-bold mb-3 border border-sky-100">
          <MapPin className="w-3.5 h-3.5" />
          <span>MẠNG LƯỚI GIAO DỊCH</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {branchesConfig.title}
        </h2>
        <p className="text-slate-500 text-sm mt-2">{branchesConfig.subtitle}</p>
      </div>

      {/* Working Hours Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#005596] flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Thời gian giao dịch phục vụ tại quầy
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                {branchesConfig.workingHours.weekdays}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{branchesConfig.workingHours.weekend}</span>
          </div>
        </div>
      </div>

      {/* Branch Selector Grid / Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-8">
        {locations.map((loc) => {
          const isSelected = loc.id === selectedBranchId;
          return (
            <button
              key={loc.id}
              onClick={() => setSelectedBranchId(loc.id)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#005596] text-white border-[#005596] shadow-sm ring-2 ring-sky-300'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Building2
                  className={`w-4 h-4 ${isSelected ? 'text-sky-200' : 'text-[#005596]'}`}
                />
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {loc.id === 'cn-taytiengiang' ? 'Hội Sở' : 'PGD'}
                </span>
              </div>
              <span className="text-xs font-bold leading-snug line-clamp-1">
                {loc.branch}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Branch Detailed Showcase Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Branch Image */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <div
              onClick={() => setZoomedImage(activeBranch.imageFallback || activeBranch.image)}
              className="group relative cursor-pointer rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner w-full max-h-[380px] flex items-center justify-center"
            >
              <img
                src={activeBranch.imageFallback || activeBranch.image}
                alt={activeBranch.name}
                referrerPolicy="no-referrer"
                className="w-full h-72 sm:h-80 object-cover rounded-xl transition-transform duration-300 group-hover:scale-[1.02]"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    const fallback = document.createElement('div');
                    fallback.className =
                      'w-full h-72 flex flex-col items-center justify-center bg-gradient-to-br from-[#005596] to-sky-800 text-white p-6 text-center';
                    fallback.innerHTML = `
                      <div class="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-3">
                        <svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>
                      </div>
                      <h4 class="font-bold text-base">${activeBranch.name}</h4>
                      <p class="text-xs text-sky-200 mt-1">${activeBranch.address}</p>
                    `;
                    parent.appendChild(fallback);
                  }
                }}
              />
              <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="px-3.5 py-1.5 rounded-lg bg-white/95 text-slate-800 text-xs font-bold flex items-center gap-1.5 shadow-md">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Phóng to xem trụ sở</span>
                </div>
              </div>
            </div>
          </div>

          {/* Branch Details */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <span className="text-xs font-bold text-[#005596] uppercase tracking-wider block mb-1">
                VIETINBANK CHI NHÁNH TÂY TIỀN GIANG
              </span>
              <h3 className="text-2xl font-black text-slate-900">
                {activeBranch.name}
              </h3>
            </div>

            {/* Address with Google Maps indicator */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#ED1C24] shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase block">
                    Địa chỉ trụ sở
                  </span>
                  <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                    {activeBranch.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Hotline & Working hours */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-sky-50 border border-sky-100">
                <span className="text-slate-500 block text-[11px]">Chuyên viên phụ trách:</span>
                <span className="font-bold text-slate-900">{contentData.branding.advisor.name}</span>
              </div>
              <div className="p-3 rounded-xl bg-sky-50 border border-sky-100">
                <span className="text-slate-500 block text-[11px]">Hotline hỗ trợ:</span>
                <a
                  href={`tel:${contentData.branding.advisor.phoneRaw}`}
                  className="font-bold font-mono text-[#005596] hover:underline"
                >
                  {contentData.branding.advisor.phone}
                </a>
              </div>
            </div>

            {/* Actions: Google Maps & Direct Call */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <a
                href={activeBranch.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#005596] text-white text-xs font-bold hover:bg-[#004275] transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <NavigationIcon className="w-4 h-4" />
                <span>Chỉ đường trên Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={`tel:${contentData.branding.advisor.phoneRaw}`}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Phone className="w-4 h-4 text-emerald-600 fill-current" />
                <span>Gọi Hotline</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* All 6 Locations Overview Table/Grid */}
      <div>
        <h4 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span>Danh sách 6 điểm giao dịch trong khu vực</span>
          <span className="text-xs text-slate-400 font-normal">
            (Bấm vào bất kỳ điểm nào để xem chi tiết hoặc mở Google Maps)
          </span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {locations.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setSelectedBranchId(item.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                item.id === selectedBranchId
                  ? 'bg-sky-50/70 border-sky-300 ring-2 ring-sky-200'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-slate-400">
                    0{idx + 1}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {item.branch}
                  </span>
                </div>
                <h5 className="text-sm font-bold text-slate-900 mb-1">
                  {item.name}
                </h5>
                <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                  {item.address}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <a
                  href={`tel:${contentData.branding.advisor.phoneRaw}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                >
                  <Phone className="w-3 h-3 fill-current" />
                  Gọi điện
                </a>

                <a
                  href={item.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs font-bold text-[#005596] hover:underline flex items-center gap-1"
                >
                  <NavigationIcon className="w-3 h-3" />
                  Google Maps
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zoomed Lightbox */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setZoomedImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden p-2 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-900/70 text-white flex items-center justify-center hover:bg-slate-900 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={zoomedImage}
              alt="Phóng to trụ sở"
              referrerPolicy="no-referrer"
              className="max-h-[82vh] w-auto mx-auto object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};
