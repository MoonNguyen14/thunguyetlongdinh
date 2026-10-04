import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  HelpCircle,
  Smartphone,
  Gamepad2,
  PiggyBank,
  Calculator,
  Sparkles,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Phone,
  Gift,
  Star,
  Users,
  Building,
  CheckCircle2,
} from 'lucide-react';
import contentData from './data/contentData.json';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { FaqSection } from './components/FaqSection';
import { DownloadAppSection } from './components/DownloadAppSection';
import { GamesSection } from './components/GamesSection';
import { SavingsCalculatorSection } from './components/SavingsCalculatorSection';
import { LoanCalculatorSection } from './components/LoanCalculatorSection';
import { FeaturedProductsSection } from './components/FeaturedProductsSection';
import { BranchNetworkSection } from './components/BranchNetworkSection';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const mainContentRef = useRef<HTMLDivElement | null>(null);

  // GSAP animation on tab change
  useEffect(() => {
    if (mainContentRef.current) {
      gsap.fromTo(
        mainContentRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      );
    }
    // Scroll smoothly to top of main area
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleBackToMain = () => {
    setActiveTab('home');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-[#005596] selection:text-white">
      {/* 1. Headbar with VietinBank Logo */}
      <Header onOpenDownload={() => setActiveTab('download')} />

      {/* 2. Top Navigation Bar (7 Features) */}
      <Navigation activeTab={activeTab} onSelectTab={handleSelectTab} />

      {/* Main Content Viewport */}
      <main ref={mainContentRef} className="flex-1 w-full">
        {/* VIEW 0: HOME / COUNTER OVERVIEW */}
        {activeTab === 'home' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {/* Counter Hero Greeting */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#005596] via-[#004378] to-[#002e52] text-white p-6 sm:p-12 mb-10 shadow-xl border border-sky-900/40">
              {/* Subtle decorative circles */}
              <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
              <div className="absolute right-40 -top-20 w-60 h-60 rounded-full bg-red-500/10 pointer-events-none" />

              <div className="relative z-10 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sky-200 text-xs font-bold mb-4 backdrop-blur-xs">
                  <ShieldCheck className="w-4 h-4 text-sky-300" />
                  <span>CỔNG TƯƠNG TÁC QUẦY GIAO DỊCH VIETINBANK</span>
                </div>

                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white mb-4">
                  Chào mừng Quý khách đến với <br />
                  <span className="text-amber-300">VietinBank Tây Tiền Giang</span>
                </h1>

                <p className="text-sm sm:text-base text-sky-100 leading-relaxed max-w-2xl mb-8">
                  Trải nghiệm các tiện ích số hóa tại quầy: Hướng dẫn nghiệp vụ Ipay, tính lãi tiền gửi & vay vốn, tham gia game nhận quà xăng 2 lít và khám phá các sản phẩm ưu đãi hấp dẫn.
                </p>

                {/* Primary quick actions */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleSelectTab('faq')}
                    className="px-6 py-3 rounded-xl bg-white text-[#005596] font-bold text-xs sm:text-sm hover:bg-sky-50 transition-all shadow-md cursor-pointer flex items-center gap-2"
                  >
                    <HelpCircle className="w-4 h-4 text-[#005596]" />
                    <span>Giải đáp thắc mắc Ipay</span>
                  </button>

                  <button
                    onClick={() => handleSelectTab('game')}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#ED1C24] to-red-600 text-white font-bold text-xs sm:text-sm hover:from-red-600 hover:to-red-700 transition-all shadow-md cursor-pointer flex items-center gap-2"
                  >
                    <Gamepad2 className="w-4 h-4" />
                    <span>Chơi Game Săn Voucher Xăng</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px]">
                      2L Xăng
                    </span>
                  </button>

                  <button
                    onClick={() => handleSelectTab('savings')}
                    className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2"
                  >
                    <PiggyBank className="w-4 h-4 text-amber-300" />
                    <span>Tính lãi tiền gửi</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 7 Core Features Grid for Easy 1-Touch Selection */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Danh Mục Tiện Ích Phục Vụ Tại Quầy
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Chạm hoặc nhấp vào bất kỳ tiện ích nào dưới đây để bắt đầu trải nghiệm
                  </p>
                </div>
                <span className="hidden sm:inline text-xs font-semibold text-[#005596] bg-sky-50 px-3 py-1.5 rounded-full">
                  7 Tính năng chính
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {/* 1. FAQ */}
                <div
                  onClick={() => handleSelectTab('faq')}
                  className="group bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-xl hover:border-sky-300 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#005596] flex items-center justify-center group-hover:bg-[#005596] group-hover:text-white transition-colors duration-300">
                        <HelpCircle className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-400">01</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-[#005596] transition-colors mb-1.5">
                      Giải đáp thắc mắc khách hàng
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      Hướng dẫn từng bước có ảnh chụp & video: Quên mật khẩu Ipay, đóng thẻ, sinh trắc học CCCD, nộp thuế và đặt lịch hẹn.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#005596]">
                    <span>4 Hướng dẫn lớn</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 2. Download App */}
                <div
                  onClick={() => handleSelectTab('download')}
                  className="group bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-xl hover:border-sky-300 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                        <Smartphone className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-400">02</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-1.5">
                      Tải App VietinBank iPay
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      Quét mã QR tải ngay ứng dụng cho iPhone/iPad và Android để chuyển tiền miễn phí 24/7 và xác thực khuôn mặt an toàn.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                    <span>Mã QR iOS & Android</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 3. Game */}
                <div
                  onClick={() => handleSelectTab('game')}
                  className="group bg-gradient-to-br from-amber-500/10 via-white to-red-500/5 rounded-3xl p-6 border-2 border-amber-300/80 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#ED1C24] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                        <Gamepad2 className="w-6 h-6" />
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-[#ED1C24] text-white text-[10px] font-bold animate-pulse">
                        Nhận Quà Xăng
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-[#ED1C24] transition-colors mb-1.5">
                      Thử thách Game
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      “Chờ vui – Chơi hay – Nhận quà liền tay”: Flappy Bird & Rắn săn mồi nhận ngay voucher 2 lít xăng tại quầy giao dịch!
                    </p>
                  </div>
                  <div className="pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs font-bold text-[#ED1C24]">
                    <span>Flappy Bird & Snake</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 4. Savings Calculator */}
                <div
                  onClick={() => handleSelectTab('savings')}
                  className="group bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-xl hover:border-sky-300 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300">
                        <PiggyBank className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-400">04</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors mb-1.5">
                      Tính lãi tiền gửi
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      Công cụ tính lãi suất tiền gửi thông thường trả lãi sau: Nhập số tiền gửi, chọn kỳ hạn 1 - 36 tháng và xem tiền lãi sinh lời.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
                    <span>Tính lãi tức thì</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 5. Loan Calculator */}
                <div
                  onClick={() => handleSelectTab('loan')}
                  className="group bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-xl hover:border-sky-300 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                        <Calculator className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-400">05</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-700 transition-colors mb-1.5">
                      Lịch trả nợ khoản vay
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      Tính toán phương thức trả gốc đều, lãi trên dư nợ giảm dần; xuất bảng chi tiết từng kỳ trả nợ với ngày trả định kỳ.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-700">
                    <span>Bảng tính chi tiết</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 6. Featured Products */}
                <div
                  onClick={() => handleSelectTab('products')}
                  className="group bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-xl hover:border-red-300 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#ED1C24] flex items-center justify-center group-hover:bg-[#ED1C24] group-hover:text-white transition-colors duration-300">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-400">06</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-[#ED1C24] transition-colors mb-1.5">
                      Sản phẩm dịch vụ nổi bật
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      Xem poster dạng carousel: Tài khoản hộ kinh doanh, Chạm POS rút tiền, Thu hộ KHDN, Ưu đãi & Đấu giá tài sản bảo đảm.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#ED1C24]">
                    <span>Carousel Poster & Đăng ký</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 7. Branch Network */}
                <div
                  onClick={() => handleSelectTab('branches')}
                  className="group bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-xl hover:border-sky-300 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#005596] flex items-center justify-center group-hover:bg-[#005596] group-hover:text-white transition-colors duration-300">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-400">07</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-[#005596] transition-colors mb-1.5">
                      Điểm giao dịch
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      Tra cứu địa chỉ, hình ảnh trụ sở, giờ làm việc và liên kết Google Maps chỉ đường của 6 chi nhánh/phòng giao dịch.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#005596]">
                    <span>6 Điểm phục vụ</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Advisor Support Card */}
                <div className="bg-gradient-to-br from-slate-900 to-[#003867] text-white rounded-3xl p-6 shadow-md flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300 mb-4">
                      <Phone className="w-5 h-5 fill-current animate-pulse" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-sky-300 block mb-1">
                      HỖ TRỢ TRỰC TIẾP
                    </span>
                    <h4 className="text-base font-bold text-white mb-1">
                      {contentData.branding.advisor.name}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      {contentData.branding.advisor.role} luôn sẵn sàng tư vấn và giải đáp mọi nhu cầu tài chính của Quý khách.
                    </p>
                  </div>
                  <a
                    href={`tel:${contentData.branding.advisor.phoneRaw}`}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#005596] hover:bg-[#004780] text-white font-mono font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 fill-current" />
                    <span>Gọi {contentData.branding.advisor.phone}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 1: FAQ / GIẢI ĐÁP THẮC MẮC */}
        {activeTab === 'faq' && <FaqSection onBackToMain={handleBackToMain} />}

        {/* VIEW 2: TẢI APP VIETINBANK IPAY */}
        {activeTab === 'download' && <DownloadAppSection />}

        {/* VIEW 3: THỬ THÁCH GAME */}
        {activeTab === 'game' && <GamesSection onBackToMain={handleBackToMain} />}

        {/* VIEW 4: TÍNH LÃI TIỀN GỬI */}
        {activeTab === 'savings' && <SavingsCalculatorSection />}

        {/* VIEW 5: LỊCH TRẢ NỢ KHOẢN VAY */}
        {activeTab === 'loan' && <LoanCalculatorSection />}

        {/* VIEW 6: SẢN PHẨM DỊCH VỤ NỔI BẬT */}
        {activeTab === 'products' && <FeaturedProductsSection />}

        {/* VIEW 7: ĐIỂM GIAO DỊCH */}
        {activeTab === 'branches' && <BranchNetworkSection />}
      </main>

      {/* Floating Callout Button for Immediate Advisor Access on Counter Tablet */}
      <div className="fixed bottom-5 right-5 z-40">
        <a
          href={`tel:${contentData.branding.advisor.phoneRaw}`}
          className="group flex items-center gap-3 px-4 py-3 rounded-full bg-gradient-to-r from-[#005596] to-[#003966] text-white shadow-xl hover:shadow-2xl border border-sky-400/30 transition-all hover:scale-105 cursor-pointer"
          title={`Gọi Chuyên viên tư vấn: ${contentData.branding.advisor.name}`}
        >
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white">
            <Phone className="w-4 h-4 fill-current animate-pulse" />
          </div>
          <div className="hidden sm:flex flex-col text-left pr-1">
            <span className="text-[10px] text-sky-200 uppercase font-semibold">Tư vấn tại quầy</span>
            <span className="text-xs font-bold font-mono tracking-wider">{contentData.branding.advisor.phone}</span>
          </div>
        </a>
      </div>

      {/* Footer */}
      <Footer onSelectTab={handleSelectTab} />
    </div>
  );
}
