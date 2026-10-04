import React from 'react';
import {
  Smartphone,
  ShieldCheck,
  Zap,
  CreditCard,
  ExternalLink,
  QrCode,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import contentData from '../data/contentData.json';

export const DownloadAppSection: React.FC = () => {
  const download = contentData.downloadApp;

  return (
    <div className="max-w-6xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-[#005596] text-xs font-bold mb-3 border border-sky-100">
          <Smartphone className="w-3.5 h-3.5" />
          <span>ỨNG DỤNG NGÂN HÀNG SỐ TOÀN DIỆN</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {download.title}
        </h2>
        <p className="text-slate-500 text-sm mt-2">{download.subtitle}</p>
      </div>

      {/* 2 Main Platform Cards with High-Res QR Codes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* iOS Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.42c.6-1.06 1.01-2.53.8-3.92-1.12.05-2.49.75-3.3 1.69-.58.67-1.09 1.76-.95 3.23 1.25.1 2.61-.43 3.45-1.02z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">VietinBank iPay cho iOS</h3>
                  <span className="text-xs text-slate-500 font-medium">Hỗ trợ iPhone, iPad (iOS 12.0+)</span>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold">
                App Store
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-6">
              <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-200 shrink-0">
                <img
                  src={download.ios.qrUrl}
                  alt="QR Code Tải iPay iOS"
                  className="w-36 h-36 object-contain"
                />
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700">
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Quét mã tức thì</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Bật camera trên iPhone và hướng về phía mã QR để mở trang cài đặt chính thức trên App Store.
                </p>
                <div className="text-[11px] text-slate-400 font-medium">
                  Đánh giá 4.8★ trên App Store
                </div>
              </div>
            </div>
          </div>

          <a
            href={download.ios.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <span>Tải về trên App Store</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Android Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4483.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993 0 .5511-.4483.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.412 13.8533 8.082 12 8.082s-3.5902.33-4.8327.8677L5.145 5.4467a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.152 5676l1.9972 3.4592C2.6889 11.1867.2435 14.391 0 18.256h24c-.2435-3.865-2.6889-7.0693-6.1185-8.9346" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">VietinBank iPay cho Android</h3>
                  <span className="text-xs text-slate-500 font-medium">Hỗ trợ Samsung, Xiaomi, Oppo...</span>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold">
                Google Play
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-6">
              <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-200 shrink-0">
                <img
                  src={download.android.qrUrl}
                  alt="QR Code Tải iPay Android"
                  className="w-36 h-36 object-contain"
                />
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Quét mã tức thì</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Dùng Zalo hoặc máy ảnh điện thoại quét mã QR để cài đặt trực tiếp từ kho ứng dụng Google Play Store.
                </p>
                <div className="text-[11px] text-slate-400 font-medium">
                  Hơn 10.000.000+ lượt tải về
                </div>
              </div>
            </div>
          </div>

          <a
            href={download.android.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-emerald-700 text-white text-sm font-semibold hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <span>Tải về trên Google Play</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="bg-gradient-to-br from-sky-50 via-white to-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">
          Đặc Quyền Tiện Ích Của VietinBank iPay Mobile
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {download.features.map((feat, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-[#005596] flex items-center justify-center mb-3">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">{feat.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>

        {/* Security badge */}
        <div className="mt-8 pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>Bảo mật kép tiêu chuẩn quốc tế ISO/IEC 27001 & Smart OTP</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#005596]" />
            <span>Tuân thủ Quyết định 2345/QĐ-NHNN về an toàn thanh toán trực tuyến</span>
          </div>
        </div>
      </div>
    </div>
  );
};
