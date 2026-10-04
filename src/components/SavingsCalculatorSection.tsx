import React, { useState, useMemo } from 'react';
import {
  PiggyBank,
  TrendingUp,
  Coins,
  AlertTriangle,
  Play,
  ExternalLink,
  Info,
  Calendar,
  Percent,
  CheckCircle,
} from 'lucide-react';
import contentData from '../data/contentData.json';

export const SavingsCalculatorSection: React.FC = () => {
  const savingsConfig = contentData.savingsCalculator;

  // Form states
  const [depositAmountRaw, setDepositAmountRaw] = useState<string>('100000000'); // 100,000,000 VND default
  const [selectedMonths, setSelectedMonths] = useState<number>(12);
  const [customInterestRate, setCustomInterestRate] = useState<string>('5.2');
  const [hasInteractedRate, setHasInteractedRate] = useState<boolean>(false);

  // Validation errors
  const [amountError, setAmountError] = useState<string | null>(null);
  const [tenureError, setTenureError] = useState<string | null>(null);
  const [rateError, setRateError] = useState<string | null>(null);

  // Auto-set standard rate when tenure changes, unless customer explicitly edited rate
  const handleTenureChange = (months: number) => {
    setSelectedMonths(months);
    setTenureError(null);
    const standard = savingsConfig.tenures.find((t) => t.months === months);
    if (standard && !hasInteractedRate) {
      setCustomInterestRate(standard.rate.toString());
    }
  };

  // Format currency with dot separators (e.g. 100.000.000)
  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(Math.round(num));
  };

  // Parse raw text input to number
  const depositAmount = useMemo(() => {
    const clean = depositAmountRaw.replace(/\D/g, '');
    return clean ? parseInt(clean, 10) : 0;
  }, [depositAmountRaw]);

  const interestRate = useMemo(() => {
    const num = parseFloat(customInterestRate.replace(',', '.'));
    return isNaN(num) ? 0 : num;
  }, [customInterestRate]);

  // Handle amount change with strict numeric validation
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const digitsOnly = val.replace(/\D/g, '');
    setDepositAmountRaw(digitsOnly);

    if (!digitsOnly) {
      setAmountError('Vui lòng nhập số tiền gửi hợp lệ.');
    } else {
      const num = parseInt(digitsOnly, 10);
      if (num <= 0) {
        setAmountError('Vui lòng nhập số tiền gửi hợp lệ.');
      } else if (num < savingsConfig.minAmount) {
        setAmountError(`Số tiền gửi tối thiểu là ${savingsConfig.minAmountFormatted}.`);
      } else {
        setAmountError(null);
      }
    }
  };

  // Handle rate change
  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasInteractedRate(true);
    const val = e.target.value;
    setCustomInterestRate(val);

    const num = parseFloat(val.replace(',', '.'));
    if (isNaN(num) || num < 0 || num > 20) {
      setRateError('Vui lòng nhập lãi suất hợp lệ.');
    } else {
      setRateError(null);
    }
  };

  // Calculation:
  // Công thức: Tiền lãi = Tiền gửi × Lãi suất (%/năm) × (Số tháng / 12)
  // hoặc quy chuẩn theo ngày (Số tháng * 30 / 365)
  const calculatedInterest = useMemo(() => {
    if (amountError || tenureError || rateError || depositAmount <= 0) {
      return 0;
    }
    // Chuẩn ngân hàng trả lãi sau: Số tiền gửi * Lãi suất * (Số tháng / 12)
    return Math.round(depositAmount * (interestRate / 100) * (selectedMonths / 12));
  }, [depositAmount, interestRate, selectedMonths, amountError, tenureError, rateError]);

  const totalAmountAtMaturity = useMemo(() => {
    return depositAmount + calculatedInterest;
  }, [depositAmount, calculatedInterest]);

  return (
    <div className="max-w-6xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-3 border border-emerald-200">
          <PiggyBank className="w-3.5 h-3.5 text-emerald-600" />
          <span>TIỀN GỬI TIẾT KIỆM VIETINBANK</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {savingsConfig.title}
        </h2>
        <p className="text-slate-500 text-sm mt-2">
          Ước tính lợi nhuận sinh lời an toàn, minh bạch theo biểu lãi suất niêm yết mới nhất
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10">
        {/* Left Form: Inputs */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
            <span>Thông tin tiền gửi</span>
            <span className="text-xs text-sky-700 font-semibold">Trả lãi sau khi đáo hạn</span>
          </h3>

          {/* Input 1: Số tiền gửi */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Số tiền gửi dự tính (VND) <span className="text-red-500">*</span></span>
              {depositAmount > 0 && (
                <span className="text-xs font-mono font-bold text-[#005596]">
                  {formatVND(depositAmount)} VND
                </span>
              )}
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={depositAmountRaw ? formatVND(depositAmount) : ''}
                onChange={handleAmountChange}
                placeholder="Nhập số tiền gửi (VND)"
                className={`w-full px-4 py-3.5 rounded-xl border text-sm font-semibold font-mono tracking-wide focus:outline-hidden transition-colors ${
                  amountError
                    ? 'border-red-500 bg-red-50/30 focus:border-red-600'
                    : 'border-slate-300 focus:border-[#005596] bg-slate-50/50 focus:bg-white'
                }`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                VND
              </span>
            </div>
            {amountError && (
              <p className="text-xs text-red-600 flex items-center gap-1 font-medium">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                {amountError}
              </p>
            )}

            {/* Quick quick-pick buttons */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[20000000, 50000000, 100000000, 300000000, 500000000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setDepositAmountRaw(amt.toString());
                    setAmountError(null);
                  }}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-colors cursor-pointer ${
                    depositAmount === amt
                      ? 'bg-[#005596] text-white border-[#005596]'
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {formatVND(amt / 1000000)} Tr
                </button>
              ))}
            </div>
          </div>

          {/* Input 2: Kỳ hạn gửi */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Kỳ hạn gửi <span className="text-red-500">*</span></span>
              <span className="text-xs text-slate-400 font-medium">Chọn kỳ hạn phù hợp</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {savingsConfig.tenures.map((t) => {
                const isSelected = selectedMonths === t.months;
                return (
                  <button
                    key={t.months}
                    type="button"
                    onClick={() => handleTenureChange(t.months)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#005596] text-white border-[#005596] shadow-xs ring-2 ring-sky-300'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="block text-xs font-bold">{t.label}</span>
                    <span
                      className={`block text-[11px] font-mono mt-0.5 ${
                        isSelected ? 'text-sky-200' : 'text-emerald-600 font-semibold'
                      }`}
                    >
                      {t.rate}%/năm
                    </span>
                  </button>
                );
              })}
            </div>
            {tenureError && (
              <p className="text-xs text-red-600 flex items-center gap-1 font-medium">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                {tenureError}
              </p>
            )}
          </div>

          {/* Input 3: Lãi suất (%/năm) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                Lãi suất (%/năm) <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  const standard = savingsConfig.tenures.find((t) => t.months === selectedMonths);
                  if (standard) {
                    setCustomInterestRate(standard.rate.toString());
                    setRateError(null);
                    setHasInteractedRate(false);
                  }
                }}
                className="text-[11px] text-sky-700 hover:underline cursor-pointer font-semibold"
              >
                Khôi phục chuẩn VietinBank ({savingsConfig.tenures.find((t) => t.months === selectedMonths)?.rate}%/năm)
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                value={customInterestRate}
                onChange={handleRateChange}
                placeholder="Nhập lãi suất (%/năm)"
                className={`w-full px-4 py-3.5 rounded-xl border text-sm font-semibold font-mono focus:outline-hidden transition-colors ${
                  rateError
                    ? 'border-red-500 bg-red-50/30 focus:border-red-600'
                    : 'border-slate-300 focus:border-[#005596] bg-slate-50/50 focus:bg-white'
                }`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                %/năm
              </span>
            </div>
            {rateError && (
              <p className="text-xs text-red-600 flex items-center gap-1 font-medium">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                {rateError}
              </p>
            )}
          </div>
        </div>

        {/* Right Output: Calculation Results Display */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-gradient-to-br from-[#005596] to-[#003763] rounded-3xl p-6 sm:p-8 text-white shadow-xl">
            <span className="inline-block px-3 py-1 rounded-full bg-white/15 text-sky-100 text-xs font-bold mb-4">
              KẾT QUẢ TÍNH TIỀN GỬI DỰ TÍNH
            </span>

            {/* Interest Result Highlight */}
            <div className="mb-6 pb-6 border-b border-white/15">
              <span className="text-xs text-sky-200 block mb-1">
                Số tiền lãi dự tính (kỳ hạn {selectedMonths} tháng):
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-amber-300">
                  {formatVND(calculatedInterest)}
                </span>
                <span className="text-sm font-bold text-sky-200">VND</span>
              </div>
            </div>

            {/* Total at Maturity */}
            <div className="mb-6 pb-6 border-b border-white/15">
              <span className="text-xs text-sky-200 block mb-1">
                Tổng số tiền nhận được khi đáo hạn (Gốc + Lãi):
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-white">
                  {formatVND(totalAmountAtMaturity)}
                </span>
                <span className="text-sm font-bold text-sky-200">VND</span>
              </div>
            </div>

            {/* Summary details */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-white/10 p-3 rounded-2xl">
                <span className="text-sky-200 block text-[11px]">Tiền gửi gốc:</span>
                <span className="font-mono font-bold text-sm text-white">
                  {formatVND(depositAmount)} VND
                </span>
              </div>
              <div className="bg-white/10 p-3 rounded-2xl">
                <span className="text-sky-200 block text-[11px]">Lãi suất áp dụng:</span>
                <span className="font-mono font-bold text-sm text-amber-300">
                  {interestRate}% / năm
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-sky-200">
              <span>Phương thức: Lĩnh lãi cuối kỳ</span>
              <span>Kỳ hạn: {selectedMonths} tháng</span>
            </div>
          </div>

          {/* TikTok Video Guide Box */}
          {savingsConfig.tiktokVideoUrl && (
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shrink-0">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Video hướng dẫn gửi tiết kiệm VietinBank
                  </h4>
                  <p className="text-xs text-slate-500">
                    Xem clip hướng dẫn chi tiết cách mở sổ tiết kiệm trên app & tại quầy
                  </p>
                </div>
              </div>
              <a
                href={savingsConfig.tiktokVideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-xs cursor-pointer whitespace-nowrap"
              >
                <span>Xem trên TikTok</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
