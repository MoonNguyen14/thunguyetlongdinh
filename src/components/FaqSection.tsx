import React, { useState } from 'react';
import {
  KeyRound,
  CreditCard,
  ScanFace,
  Receipt,
  CalendarCheck,
  Play,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Phone,
  Maximize2,
  X,
  ExternalLink,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import contentData from '../data/contentData.json';
import { FaqTopic } from '../types';

interface FaqSectionProps {
  onBackToMain?: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onBackToMain }) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [feedbackStatus, setFeedbackStatus] = useState<'none' | 'ok' | 'notOk'>('none');
  const [hasEndedChat, setHasEndedChat] = useState<boolean>(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [activeVideoModal, setActiveVideoModal] = useState<string | null>(null);

  const topics: FaqTopic[] = contentData.faq.topics;
  const currentTopic = topics.find((t) => t.id === selectedTopicId);

  const getTopicIcon = (id: string) => {
    switch (id) {
      case 'quen-mat-khau':
        return KeyRound;
      case 'dong-the':
        return CreditCard;
      case 'sinh-trac-hoc':
        return ScanFace;
      case 'nop-thue':
        return Receipt;
      case 'dat-lich':
        return CalendarCheck;
      default:
        return KeyRound;
    }
  };

  const handleSelectTopic = (id: string) => {
    setSelectedTopicId(id);
    setCurrentStepIndex(0);
    setFeedbackStatus('none');
    setHasEndedChat(false);
  };

  const handleResetToMainMenu = () => {
    setSelectedTopicId(null);
    setCurrentStepIndex(0);
    setFeedbackStatus('none');
    setHasEndedChat(false);
    if (onBackToMain) onBackToMain();
  };

  const handleEndChat = () => {
    setHasEndedChat(true);
  };

  // If user selected End Chat
  if (hasEndedChat) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
            Cảm ơn Quý khách!
          </h3>
          <p className="text-slate-600 text-base sm:text-lg mb-8 leading-relaxed">
            {contentData.faq.endChatMessage}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleResetToMainMenu}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#005596] text-white font-semibold hover:bg-[#004275] transition-all cursor-pointer shadow-sm"
            >
              Bắt đầu phiên giao dịch mới
            </button>
            <a
              href={`tel:${contentData.branding.advisor.phoneRaw}`}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-emerald-600" />
              Hotline: {contentData.branding.advisor.phone}
            </a>
          </div>
        </div>
      </div>
    );
  }

  // View: Topic Detail Step-by-Step Guide
  if (currentTopic) {
    const totalSteps = currentTopic.steps.length;
    const currentStep = currentTopic.steps[currentStepIndex];

    return (
      <div className="max-w-5xl mx-auto py-6 sm:py-10 px-4">
        {/* Top navigation within guide */}
        <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
          <button
            onClick={() => setSelectedTopicId(null)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#005596] transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
            Chọn nội dung khác
          </button>

          <div className="flex items-center gap-3">
            {/* YouTube Video Link Button */}
            {currentTopic.videoUrl && (
              <a
                href={currentTopic.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 text-xs font-bold transition-colors cursor-pointer"
                title="Xem video trên YouTube"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Xem Video Hướng Dẫn</span>
                <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
              </a>
            )}
          </div>
        </div>

        {/* Header of the guide */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 mb-1">
            <span>HƯỚNG DẪN CHI TIẾT</span>
            <span>·</span>
            <span>{totalSteps} BƯỚC THỰC HIỆN</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {currentTopic.title}
          </h2>
          <p className="text-sm text-slate-500 mt-1">{currentTopic.shortDesc}</p>
        </div>

        {/* Step progress pills */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-2">
            <span>Tiến độ thực hiện</span>
            <span className="font-mono font-semibold text-slate-800">
              Bước {currentStepIndex + 1} / {totalSteps}
            </span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#005596] to-sky-500 h-full transition-all duration-300"
              style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
            />
          </div>

          {/* Quick jump step dots */}
          <div className="flex items-center gap-1.5 mt-3 overflow-x-auto py-1">
            {currentTopic.steps.map((st, i) => (
              <button
                key={i}
                onClick={() => setCurrentStepIndex(i)}
                className={`min-w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                  i === currentStepIndex
                    ? 'bg-[#005596] text-white shadow-xs'
                    : i < currentStepIndex
                    ? 'bg-sky-100 text-sky-800'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
                title={`Bước ${i + 1}: ${st.title}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Step Content Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Step text instructions */}
            <div className="lg:col-span-6 flex flex-col justify-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200/80 text-sky-800 text-xs font-bold w-fit">
                <span>BƯỚC {currentStep.step}</span>
                <span>—</span>
                <span>{currentStep.title}</span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 leading-snug">
                {currentStep.title}
              </h3>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700 text-base leading-relaxed font-medium">
                {currentStep.desc}
              </div>

              <div className="pt-2 text-xs text-slate-500 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Nhấn vào hình ảnh bên cạnh để phóng to xem rõ nét chi tiết màn hình.</span>
              </div>

              {/* Prev / Next controls */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  disabled={currentStepIndex === 0}
                  onClick={() => setCurrentStepIndex((p) => Math.max(0, p - 1))}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Bước trước
                </button>

                <button
                  disabled={currentStepIndex === totalSteps - 1}
                  onClick={() => setCurrentStepIndex((p) => Math.min(totalSteps - 1, p + 1))}
                  className="px-5 py-2.5 rounded-xl bg-[#005596] text-white text-sm font-semibold hover:bg-[#004378] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs ml-auto"
                >
                  Bước tiếp theo
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Step Screenshot Illustration */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center">
              <div
                onClick={() => setZoomedImage(currentStep.image)}
                className="group relative cursor-pointer rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/90 shadow-inner max-h-[460px] flex items-center justify-center p-2"
              >
                <img
                  src={currentStep.image}
                  alt={`Minh họa bước ${currentStep.step}: ${currentStep.title}`}
                  referrerPolicy="no-referrer"
                  className="max-h-[440px] w-auto object-contain rounded-xl transition-transform duration-300 group-hover:scale-[1.02]"
                  onError={(e) => {
                    // Fallback container
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      const div = document.createElement('div');
                      div.className =
                        'w-72 h-80 flex flex-col items-center justify-center text-center p-6 bg-slate-100 rounded-xl text-slate-500';
                      div.innerHTML = `
                        <div class="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-3">
                          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                        </div>
                        <p class="font-bold text-slate-700">Minh họa Bước ${currentStep.step}</p>
                        <p class="text-xs text-slate-500 mt-1">${currentStep.title}</p>
                      `;
                      parent.appendChild(div);
                    }
                  }}
                />
                <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="px-3.5 py-1.5 rounded-lg bg-white/95 text-slate-800 text-xs font-bold flex items-center gap-1.5 shadow-md">
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Phóng to xem</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Tutorial Bar */}
        {currentTopic.videoUrl && (
          <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-red-500/10 via-sky-50 to-white border border-red-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  Video hướng dẫn thực tế trên YouTube
                </p>
                <p className="text-xs text-slate-600">
                  Xem video chi tiết từng thao tác quay trực tiếp từ màn hình điện thoại
                </p>
              </div>
            </div>
            <a
              href={currentTopic.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors shadow-xs cursor-pointer whitespace-nowrap"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Xem trên YouTube
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Follow-up Question Box: "Sau mỗi phần hướng dẫn xong, hỏi khách hàng thực hiện ổn hay chưa?" */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
          <div className="text-center max-w-xl mx-auto mb-6">
            <h4 className="text-lg font-bold text-slate-900">
              Anh/chị đã thực hiện ổn nội dung này chưa?
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Phản hồi của Quý khách giúp chúng tôi hỗ trợ và phục vụ tốt hơn
            </p>
          </div>

          {feedbackStatus === 'none' && (
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => setFeedbackStatus('ok')}
                className="px-6 py-3 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                Đã ổn, tôi làm được rồi
              </button>
              <button
                onClick={() => setFeedbackStatus('notOk')}
                className="px-6 py-3 rounded-xl bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 transition-all flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <AlertCircle className="w-4 h-4" />
                Chưa ổn, cần hỗ trợ thêm
              </button>
            </div>
          )}

          {feedbackStatus === 'ok' && (
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center max-w-lg mx-auto space-y-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-emerald-900 font-bold text-sm">
                Tuyệt vời! Chúc Quý khách thao tác thuận tiện trên VietinBank iPay.
              </p>
              <p className="text-xs text-emerald-700">
                Quý khách có thể quay lại menu chính để tra cứu thêm các dịch vụ khác.
              </p>
            </div>
          )}

          {feedbackStatus === 'notOk' && (
            <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 max-w-2xl mx-auto space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-5 h-5 fill-current" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-amber-950 leading-relaxed">
                    “Cảm ơn Quý khách đã phản hồi. Quý khách có thể liên hệ{' '}
                    <strong className="font-bold text-slate-900">
                      Chuyên viên tư vấn {contentData.branding.advisor.name}
                    </strong>{' '}
                    – số điện thoại:{' '}
                    <a
                      href={`tel:${contentData.branding.advisor.phoneRaw}`}
                      className="font-bold underline text-[#005596] font-mono"
                    >
                      {contentData.branding.advisor.phone}
                    </a>{' '}
                    để hỗ trợ trực tiếp. Em sẽ cố gắng cải thiện để phục vụ Quý khách tốt hơn!”
                  </p>
                </div>
              </div>
              <div className="pt-2 flex flex-wrap items-center gap-3 justify-center sm:justify-start">
                <a
                  href={`tel:${contentData.branding.advisor.phoneRaw}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#005596] text-white text-xs font-bold hover:bg-[#004275] transition-all cursor-pointer shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5 fill-current animate-pulse" />
                  Gọi ngay: {contentData.branding.advisor.phone}
                </a>
              </div>
            </div>
          )}

          {/* Navigation Controls: "Quay lại menu chính" & "Kết thúc cuộc trò chuyện" */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handleResetToMainMenu}
              className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold transition-colors cursor-pointer"
            >
              Quay lại menu chính
            </button>
            <button
              onClick={handleEndChat}
              className="px-6 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors cursor-pointer"
            >
              Kết thúc cuộc trò chuyện
            </button>
          </div>
        </div>

        {/* Zoomed Screenshot Lightbox */}
        {zoomedImage && (
          <div
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
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
                alt="Phóng to minh họa"
                referrerPolicy="no-referrer"
                className="max-h-[82vh] w-auto mx-auto object-contain rounded-lg"
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // View: Main 4 FAQ Cards Selection
  return (
    <div className="max-w-6xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
      {/* Title & Greeting */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-[#005596] text-xs font-bold mb-3 border border-sky-100">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>HỖ TRỢ TRỰC TUYẾN TẠI QUẦY</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {contentData.faq.question}
        </h2>
        <p className="text-slate-500 text-sm mt-2">
          Chọn chủ đề Quý khách quan tâm để xem hướng dẫn thao tác từng bước minh họa
        </p>
      </div>

      {/* 4/5 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((t, idx) => {
          const Icon = getTopicIcon(t.id);
          return (
            <div
              key={t.id}
              onClick={() => handleSelectTopic(t.id)}
              className="group bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-xl hover:border-sky-300 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#005596] flex items-center justify-center group-hover:bg-[#005596] group-hover:text-white transition-colors duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    0{idx + 1}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#005596] transition-colors mb-2">
                  {t.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-6">
                  {t.shortDesc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-400">
                  {t.steps.length} bước thực hiện
                </span>
                <span className="inline-flex items-center gap-1 text-[#005596] group-hover:translate-x-1 transition-transform">
                  Xem ngay
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Direct Support Callout */}
      <div className="mt-12 bg-gradient-to-r from-sky-50 via-white to-sky-50 rounded-3xl p-6 sm:p-8 border border-sky-100 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#005596] text-white flex items-center justify-center shrink-0">
            <Phone className="w-6 h-6 fill-current animate-pulse" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900">
              Cần hỗ trợ trực tiếp từ Chuyên viên quầy?
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Liên hệ {contentData.branding.advisor.name} ({contentData.branding.advisor.role}) để được trợ giúp ngay.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`tel:${contentData.branding.advisor.phoneRaw}`}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#005596] text-white text-xs font-bold hover:bg-[#004378] transition-colors shadow-xs"
          >
            <Phone className="w-3.5 h-3.5 fill-current" />
            <span>Gọi {contentData.branding.advisor.phone}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
