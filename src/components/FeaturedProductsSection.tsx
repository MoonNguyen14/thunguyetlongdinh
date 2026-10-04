import React, { useState } from 'react';
import {
  Sparkles,
  Gift,
  Star,
  Phone,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  ExternalLink,
  Layers,
  SlidersHorizontal,
} from 'lucide-react';
import contentData from '../data/contentData.json';
import { ProductItem } from '../types';

export const FeaturedProductsSection: React.FC = () => {
  const productsConfig = contentData.featuredProducts;
  const items: ProductItem[] = productsConfig.items;

  const [activeCategory, setActiveCategory] = useState<string>('Tất cả');
  const [selectedProductForModal, setSelectedProductForModal] = useState<ProductItem | null>(null);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // Filter items
  const filteredItems = items.filter((item) => {
    if (activeCategory === 'Tất cả') return true;
    return item.category === activeCategory;
  });

  const handleNextCarousel = () => {
    setCarouselIndex((prev) => (prev + 1) % filteredItems.length);
  };

  const handlePrevCarousel = () => {
    setCarouselIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  };

  const currentCarouselItem = filteredItems[carouselIndex] || filteredItems[0];

  return (
    <div className="max-w-6xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
      {/* Header with featured badge and styling */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 via-red-500/10 to-sky-500/10 border border-red-300 text-[#ED1C24] text-xs font-bold mb-3 shadow-xs">
          <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
          <span>NỔI BẬT TẠI CHI NHÁNH</span>
          <Gift className="w-3.5 h-3.5 text-[#005596]" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {productsConfig.title}
        </h2>
        <p className="text-slate-500 text-sm mt-2">{productsConfig.desc}</p>
      </div>

      {/* Filter Chips Bar (All 5 Groups from PDF) */}
      <div className="flex items-center justify-between gap-4 mb-8 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-1.5 flex-nowrap">
          {productsConfig.categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setCarouselIndex(0);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#005596] text-white shadow-xs ring-2 ring-sky-300'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* View mode toggle */}
        <div className="hidden sm:flex items-center p-1 bg-slate-100 rounded-xl shrink-0">
          <button
            onClick={() => setViewMode('carousel')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              viewMode === 'carousel'
                ? 'bg-white text-[#005596] shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Carousel
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-white text-[#005596] shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Dạng lưới
          </button>
        </div>
      </div>

      {/* CAROUSEL VIEW (Recommended by PDF for high engagement) */}
      {viewMode === 'carousel' && currentCarouselItem && (
        <div className="max-w-4xl mx-auto mb-10">
          <div className="relative bg-gradient-to-br from-white via-sky-50/30 to-slate-50 rounded-3xl p-6 sm:p-8 border-2 border-red-100 shadow-md">
            {/* Top Bar inside card */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <span className="px-3 py-1 rounded-full bg-red-50 text-[#ED1C24] text-xs font-bold border border-red-200 flex items-center gap-1.5">
                <Star className="w-3 h-3 fill-current" />
                {currentCarouselItem.badge}
              </span>
              <span className="text-xs font-mono text-slate-400">
                {carouselIndex + 1} / {filteredItems.length}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Poster image */}
              <div className="md:col-span-6 flex items-center justify-center">
                <div
                  onClick={() => setZoomedImage(currentCarouselItem.image)}
                  className="group relative cursor-pointer rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm max-h-[460px] p-2"
                >
                  <img
                    src={currentCarouselItem.image}
                    alt={currentCarouselItem.title}
                    referrerPolicy="no-referrer"
                    className="max-h-[420px] w-auto object-contain rounded-xl transition-transform duration-300 group-hover:scale-[1.02]"
                    onError={(e) => {
                      // Fallback card
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        const fallback = document.createElement('div');
                        fallback.className =
                          'w-64 h-80 bg-gradient-to-br from-[#005596] to-sky-800 text-white rounded-xl p-6 flex flex-col justify-between';
                        fallback.innerHTML = `
                          <div class="text-xs text-sky-200 uppercase font-bold">${currentCarouselItem.category}</div>
                          <div class="text-lg font-black">${currentCarouselItem.title}</div>
                          <div class="text-xs text-sky-100">${currentCarouselItem.desc}</div>
                        `;
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="px-3 py-1.5 rounded-lg bg-white text-slate-900 text-xs font-bold flex items-center gap-1.5 shadow-md">
                      <Maximize2 className="w-3.5 h-3.5" />
                      Phóng to xem poster
                    </div>
                  </div>
                </div>
              </div>

              {/* Description & Action */}
              <div className="md:col-span-6 space-y-4">
                <span className="text-xs font-bold text-[#005596] uppercase tracking-wider block">
                  {currentCarouselItem.category}
                </span>
                <h3 className="text-2xl font-black text-slate-900 leading-snug">
                  {currentCarouselItem.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  {currentCarouselItem.desc}
                </p>

                <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() => setSelectedProductForModal(currentCarouselItem)}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#ED1C24] to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Gift className="w-4 h-4" />
                    <span>Tôi quan tâm</span>
                  </button>

                  <a
                    href={`tel:${contentData.branding.advisor.phoneRaw}`}
                    className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4 text-emerald-600" />
                    Tư vấn trực tiếp: {contentData.branding.advisor.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* Carousel Controls */}
            {filteredItems.length > 1 && (
              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={handlePrevCarousel}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Sản phẩm trước
                </button>

                <div className="flex items-center gap-1.5">
                  {filteredItems.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCarouselIndex(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        idx === carouselIndex ? 'w-6 bg-[#005596]' : 'w-2 bg-slate-300 hover:bg-slate-400'
                      }`}
                      title={`Xem sản phẩm ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNextCarousel}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  Sản phẩm tiếp theo
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* GRID VIEW (Alternative) */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {filteredItems.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div
                  onClick={() => setZoomedImage(prod.image)}
                  className="relative cursor-pointer rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 mb-4 h-64 flex items-center justify-center p-2"
                >
                  <img
                    src={prod.image}
                    alt={prod.title}
                    referrerPolicy="no-referrer"
                    className="max-h-60 w-auto object-contain rounded-xl"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 text-[#ED1C24] text-[11px] font-bold shadow-xs">
                    {prod.badge}
                  </span>
                </div>

                <span className="text-[11px] text-[#005596] font-bold block mb-1 uppercase">
                  {prod.category}
                </span>
                <h4 className="text-base font-bold text-slate-900 mb-2 leading-tight">
                  {prod.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-3">
                  {prod.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedProductForModal(prod)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#005596] text-white text-xs font-bold hover:bg-[#004378] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Gift className="w-3.5 h-3.5" />
                  <span>Tôi quan tâm</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* "Tôi Quan Tâm" Modal Popup (As requested in PDF) */}
      {selectedProductForModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-center relative animate-fade-in">
            <button
              onClick={() => setSelectedProductForModal(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-sky-50 text-[#005596] flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {selectedProductForModal.title}
            </h3>

            {/* Notification Text strictly matching PDF prompt:
              "Cảm ơn Quý khách đã quan tâm đến sản phẩm/dịch vụ này. Quý khách vui lòng liên hệ cán bộ VietinBank tại quầy để được tư vấn chi tiết.
              Hoặc liên hệ Chuyên viên tư vấn Lê Hoàng Hiệp - 0907800525."
            */}
            <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 text-slate-700 text-sm leading-relaxed mb-6 space-y-3">
              <p>
                Cảm ơn Quý khách đã quan tâm đến sản phẩm/dịch vụ này. Quý khách vui lòng liên hệ cán bộ VietinBank tại quầy để được tư vấn chi tiết.
              </p>
              <p className="font-semibold text-slate-900">
                Hoặc liên hệ Chuyên viên tư vấn{' '}
                <strong className="text-[#005596]">{contentData.branding.advisor.name}</strong> –{' '}
                <a
                  href={`tel:${contentData.branding.advisor.phoneRaw}`}
                  className="underline text-[#ED1C24] font-mono font-bold"
                >
                  {contentData.branding.advisor.phone}
                </a>.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`tel:${contentData.branding.advisor.phoneRaw}`}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#005596] text-white text-xs font-bold hover:bg-[#004275] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Phone className="w-4 h-4 fill-current animate-pulse" />
                <span>Gọi Chuyên viên: {contentData.branding.advisor.phone}</span>
              </a>
              <button
                onClick={() => setSelectedProductForModal(null)}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Đóng thông báo
              </button>
            </div>
          </div>
        </div>
      )}

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
              alt="Phóng to poster"
              referrerPolicy="no-referrer"
              className="max-h-[82vh] w-auto mx-auto object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};
