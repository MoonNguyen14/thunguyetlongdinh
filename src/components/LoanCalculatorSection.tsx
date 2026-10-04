import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Calendar,
  FileSpreadsheet,
  X,
  Printer,
  Copy,
  Check,
  TrendingDown,
  Info,
  DollarSign,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import contentData from '../data/contentData.json';
import { LoanScheduleRow } from '../types';

export const LoanCalculatorSection: React.FC = () => {
  // Inputs
  const [propertyValueRaw, setPropertyValueRaw] = useState<string>('33333333333'); // Giá trị bất động sản / TSBĐ (tùy chọn)
  const [loanAmountRaw, setLoanAmountRaw] = useState<string>('6666666667'); // 6,666,666,667 VND (như trong ảnh mẫu của PDF!)
  const [loanTermMonths, setLoanTermMonths] = useState<number>(240); // 240 tháng (như trong ảnh mẫu)
  const [annualInterestRate, setAnnualInterestRate] = useState<string>('8.0'); // 8%/năm (như trong ảnh mẫu)
  const [disbursementDate, setDisbursementDate] = useState<string>('2026-06-16'); // 16/06/2026
  const [repaymentCycle, setRepaymentCycle] = useState<'monthly' | 'quarterly' | 'semiAnnual' | 'yearly'>('monthly');
  const [repaymentDayOfMonth, setRepaymentDayOfMonth] = useState<number>(16); // Ngày trả nợ định kỳ
  const [roundingRule, setRoundingRule] = useState<'unit' | 'thousand'>('unit');

  // Modal State
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [copiedSchedule, setCopiedSchedule] = useState<boolean>(false);

  // Formatting helpers
  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(Math.round(num));
  };

  const parseNumber = (val: string) => {
    const clean = val.replace(/\D/g, '');
    return clean ? parseInt(clean, 10) : 0;
  };

  const loanAmount = useMemo(() => parseNumber(loanAmountRaw), [loanAmountRaw]);
  const propertyValue = useMemo(() => parseNumber(propertyValueRaw), [propertyValueRaw]);
  const interestRate = useMemo(() => {
    const num = parseFloat(annualInterestRate.replace(',', '.'));
    return isNaN(num) ? 0 : num;
  }, [annualInterestRate]);

  // Determine cycles per year and total periods
  const cycleConfig = useMemo(() => {
    switch (repaymentCycle) {
      case 'quarterly':
        return { divisor: 4, monthStep: 3, label: 'Hằng quý' };
      case 'semiAnnual':
        return { divisor: 2, monthStep: 6, label: '6 tháng' };
      case 'yearly':
        return { divisor: 1, monthStep: 12, label: 'Hằng năm' };
      case 'monthly':
      default:
        return { divisor: 12, monthStep: 1, label: 'Hằng tháng' };
    }
  }, [repaymentCycle]);

  const totalPeriods = useMemo(() => {
    const calculated = Math.ceil(loanTermMonths / cycleConfig.monthStep);
    return Math.max(1, calculated);
  }, [loanTermMonths, cycleConfig.monthStep]);

  // Rounding helper function
  const applyRounding = (val: number) => {
    if (roundingRule === 'thousand') {
      return Math.round(val / 1000) * 1000;
    }
    return Math.round(val);
  };

  // Generate full repayment schedule according to PDF rules
  const scheduleData = useMemo(() => {
    if (loanAmount <= 0 || totalPeriods <= 0) return [];

    const rows: LoanScheduleRow[] = [];
    const periodRate = (interestRate / 100) / cycleConfig.divisor;
    const basePrincipalPerPeriod = loanAmount / totalPeriods;

    let currentBalance = loanAmount;
    let accumulatedPrincipalPaid = 0;

    // Disbursement Date parse
    const [dYear, dMonth, dDay] = disbursementDate.split('-').map(Number);
    const disbDateObj = new Date(dYear, (dMonth || 1) - 1, dDay || 1);

    for (let i = 1; i <= totalPeriods; i++) {
      // Calculate date of payment
      const targetDate = new Date(disbDateObj);
      targetDate.setMonth(targetDate.getMonth() + i * cycleConfig.monthStep);
      
      // If user selected a specific day of month (e.g. 25th)
      if (repaymentDayOfMonth > 0) {
        const maxDaysInMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0).getDate();
        targetDate.setDate(Math.min(repaymentDayOfMonth, maxDaysInMonth));
      }

      const dateStr = targetDate.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      const startBal = currentBalance;
      let principal = applyRounding(basePrincipalPerPeriod);
      let interest = applyRounding(startBal * periodRate);

      // Final period adjustment to eliminate cumulative rounding errors
      if (i === totalPeriods) {
        principal = loanAmount - accumulatedPrincipalPaid;
        currentBalance = 0;
      } else {
        currentBalance = Math.max(0, startBal - principal);
      }

      accumulatedPrincipalPaid += principal;
      const totalPayment = principal + interest;

      rows.push({
        period: i,
        date: dateStr,
        startingBalance: startBal,
        principal,
        interest,
        totalPayment,
        endingBalance: currentBalance,
      });
    }

    return rows;
  }, [
    loanAmount,
    totalPeriods,
    interestRate,
    cycleConfig,
    disbursementDate,
    repaymentDayOfMonth,
    roundingRule,
  ]);

  // Aggregate summary
  const summary = useMemo(() => {
    if (scheduleData.length === 0) {
      return { firstMonth: 0, lastMonth: 0, totalInterest: 0, totalPayment: 0 };
    }
    const firstMonth = scheduleData[0].totalPayment;
    const lastMonth = scheduleData[scheduleData.length - 1].totalPayment;
    const totalInterest = scheduleData.reduce((acc, cur) => acc + cur.interest, 0);
    const totalPayment = scheduleData.reduce((acc, cur) => acc + cur.totalPayment, 0);
    return { firstMonth, lastMonth, totalInterest, totalPayment };
  }, [scheduleData]);

  // Copy schedule as TSV for pasting into Excel
  const handleCopySchedule = () => {
    let tsv = 'Kỳ\tNgày trả nợ\tSố gốc còn lại (VND)\tGốc (VND)\tLãi (VND)\tTổng gốc + Lãi (VND)\n';
    scheduleData.forEach((r) => {
      tsv += `${r.period}\t${r.date}\t${r.startingBalance}\t${r.principal}\t${r.interest}\t${r.totalPayment}\n`;
    });
    navigator.clipboard.writeText(tsv);
    setCopiedSchedule(true);
    setTimeout(() => setCopiedSchedule(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-[#005596] text-xs font-bold mb-3 border border-sky-100">
          <Calculator className="w-3.5 h-3.5" />
          <span>PHƯƠNG THỨC DƯ NỢ GIẢM DẦN</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {contentData.loanCalculator.title}
        </h2>
        <p className="text-slate-500 text-sm mt-2">
          Trả gốc đều đặn từng kỳ, tiền lãi tính trên dư nợ thực tế còn lại giúp tối ưu hóa tổng chi phí vay
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10">
        {/* Form Inputs */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">
              Nhập thông số khoản vay
            </h3>
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full">
              Lãi suất cạnh tranh
            </span>
          </div>

          {/* Row 1: Giá trị tài sản bảo đảm (tùy chọn) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Giá trị tài sản bảo đảm / BĐS (tùy chọn)</span>
              {propertyValue > 0 && (
                <span className="text-xs font-mono font-bold text-slate-500">
                  {formatVND(propertyValue)} VND
                </span>
              )}
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={propertyValueRaw ? formatVND(propertyValue) : ''}
                onChange={(e) => setPropertyValueRaw(e.target.value.replace(/\D/g, ''))}
                placeholder="Ví dụ: 33.333.333.333"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#005596] text-sm font-semibold font-mono bg-slate-50/50 focus:bg-white focus:outline-hidden transition-colors"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                VND
              </span>
            </div>
          </div>

          {/* Row 2: Số tiền vay (Dạng nhập chữ số, không dùng kéo thả) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>
                Số tiền vay <span className="text-red-500">*</span> (Dạng nhập liệu trực tiếp)
              </span>
              <span className="text-xs font-mono font-bold text-[#005596]">
                {formatVND(loanAmount)} VND
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={loanAmountRaw ? formatVND(loanAmount) : ''}
                onChange={(e) => setLoanAmountRaw(e.target.value.replace(/\D/g, ''))}
                placeholder="Nhập số tiền vay (VND)"
                className="w-full px-4 py-3.5 rounded-xl border-2 border-sky-600/30 focus:border-[#005596] text-sm font-bold font-mono bg-white focus:outline-hidden transition-colors"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                VND
              </span>
            </div>

            {/* Quick loan shortcuts */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[500000000, 1000000000, 2000000000, 5000000000, 6666666667].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setLoanAmountRaw(amt.toString())}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-colors cursor-pointer ${
                    loanAmount === amt
                      ? 'bg-[#005596] text-white border-[#005596]'
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {amt === 6666666667 ? '6,66 tỷ (Mẫu)' : `${formatVND(amt / 1000000000)} Tỷ`}
                </button>
              ))}
            </div>
          </div>

          {/* Row 3: Thời gian vay & Lãi suất năm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Thời gian vay (Tháng) <span className="text-red-500">*</span></span>
                <span className="text-xs text-slate-500 font-mono">
                  {Math.floor(loanTermMonths / 12)} năm {loanTermMonths % 12 ? `${loanTermMonths % 12} th` : ''}
                </span>
              </label>
              <input
                type="number"
                min={1}
                max={360}
                value={loanTermMonths}
                onChange={(e) => setLoanTermMonths(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#005596] text-sm font-semibold font-mono bg-slate-50/50 focus:bg-white focus:outline-hidden transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Lãi suất (%/Năm) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={annualInterestRate}
                  onChange={(e) => setAnnualInterestRate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#005596] text-sm font-semibold font-mono bg-slate-50/50 focus:bg-white focus:outline-hidden transition-colors"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  %/Năm
                </span>
              </div>
            </div>
          </div>

          {/* Row 4: Ngày giải ngân & Chu kỳ trả nợ & Ngày trả định kỳ */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Ngày giải ngân</label>
              <input
                type="date"
                value={disbursementDate}
                onChange={(e) => setDisbursementDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:border-[#005596] text-xs font-semibold font-mono bg-slate-50/50 focus:bg-white focus:outline-hidden"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Chu kỳ trả nợ</label>
              <select
                value={repaymentCycle}
                onChange={(e) => setRepaymentCycle(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:border-[#005596] text-xs font-semibold bg-slate-50/50 focus:bg-white focus:outline-hidden cursor-pointer"
              >
                <option value="monthly">Hằng tháng (12 kỳ/năm)</option>
                <option value="quarterly">Hằng quý (4 kỳ/năm)</option>
                <option value="semiAnnual">6 tháng (2 kỳ/năm)</option>
                <option value="yearly">Hằng năm (1 kỳ/năm)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Ngày trả định kỳ</label>
              <select
                value={repaymentDayOfMonth}
                onChange={(e) => setRepaymentDayOfMonth(parseInt(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:border-[#005596] text-xs font-semibold font-mono bg-slate-50/50 focus:bg-white focus:outline-hidden cursor-pointer"
              >
                {[5, 10, 15, 16, 20, 25, 28].map((d) => (
                  <option key={d} value={d}>
                    Ngày {d} hàng tháng
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 5: Quy tắc làm tròn */}
          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-slate-600 font-medium">Quy tắc làm tròn:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRoundingRule('unit')}
                className={`px-3 py-1.5 rounded-lg border font-semibold transition-colors cursor-pointer ${
                  roundingRule === 'unit'
                    ? 'bg-[#005596] text-white border-[#005596]'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                Đơn vị đồng (VND)
              </button>
              <button
                type="button"
                onClick={() => setRoundingRule('thousand')}
                className={`px-3 py-1.5 rounded-lg border font-semibold transition-colors cursor-pointer ${
                  roundingRule === 'thousand'
                    ? 'bg-[#005596] text-white border-[#005596]'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                Làm tròn 1.000 đồng
              </button>
            </div>
          </div>
        </div>

        {/* Right Summary Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-[#003b6d] rounded-3xl p-6 sm:p-8 text-white shadow-xl">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-sky-200 text-xs font-bold mb-4">
              DỰ TÍNH SỐ TIỀN PHẢI TRẢ
            </span>

            {/* Range of payment (Tháng đầu -> Tháng cuối) */}
            <div className="mb-6 pb-6 border-b border-white/15">
              <div className="text-xs text-sky-200 mb-1 flex items-center justify-between">
                <span>Số tiền trả hàng tháng (giảm dần):</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-[11px] text-sky-300">Từ</span>
                  <span className="text-2xl font-black font-mono text-amber-300">
                    {formatVND(summary.firstMonth)}
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-[11px] text-sky-300">đến</span>
                  <span className="text-xl font-bold font-mono text-emerald-400">
                    {formatVND(summary.lastMonth)}
                  </span>
                  <span className="text-xs font-semibold text-sky-200">VND</span>
                </div>
              </div>
            </div>

            {/* Total interest & Total payment */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-xs">
                <span className="text-sky-200">Tổng lãi phải trả:</span>
                <span className="font-mono font-bold text-amber-300">
                  {formatVND(summary.totalInterest)} VND
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-sky-200">Tổng tiền gốc + lãi:</span>
                <span className="font-mono font-bold text-base text-white">
                  {formatVND(summary.totalPayment)} VND
                </span>
              </div>
            </div>

            {/* Key characteristics note from PDF */}
            <div className="p-3 rounded-2xl bg-white/10 text-[11px] text-sky-100 space-y-1 mb-6">
              <p>• Trả gốc đều mỗi kỳ: <strong>{formatVND(loanAmount / totalPeriods)} VND</strong></p>
              <p>• Lãi giảm dần theo số dư nợ thực tế từng tháng</p>
              <p>• Tổng lãi thấp hơn đáng kể so với phương thức trả góp đều</p>
            </div>

            {/* CTA Button: Xem chi tiết */}
            <button
              onClick={() => setShowDetailModal(true)}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Xem chi tiết bảng tính lịch trả nợ</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Amortisation Schedule Detail Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  Bảng tính lịch trả nợ với dư nợ giảm dần
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Số tiền vay: <strong className="text-[#005596] font-mono">{formatVND(loanAmount)} VND</strong> · 
                  Thời gian: {loanTermMonths} tháng ({totalPeriods} kỳ) · 
                  Lãi suất: {annualInterestRate}%/năm
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySchedule}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  title="Sao chép toàn bộ bảng (Excel)"
                >
                  {copiedSchedule ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSchedule ? 'Đã sao chép' : 'Sao chép'}</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs hidden sm:flex"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>In bảng</span>
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="w-9 h-9 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center cursor-pointer ml-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Table Container */}
            <div className="flex-1 overflow-auto p-4 sm:p-6">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200 sticky top-0 z-10">
                    <th className="py-3 px-3 w-14 text-center">STT</th>
                    <th className="py-3 px-3">KỲ TRẢ NỢ</th>
                    <th className="py-3 px-3 text-right">SỐ GỐC CÒN LẠI</th>
                    <th className="py-3 px-3 text-right">GỐC</th>
                    <th className="py-3 px-3 text-right">LÃI</th>
                    <th className="py-3 px-3 text-right">TỔNG GỐC + LÃI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {/* Row 0: Ngày giải ngân as requested in PDF page 1 screenshot! */}
                  <tr className="bg-sky-50/50 font-bold text-slate-800">
                    <td className="py-2.5 px-3 text-center">0</td>
                    <td className="py-2.5 px-3 font-sans">
                      {new Date(disbursementDate).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })} (Giải ngân)
                    </td>
                    <td className="py-2.5 px-3 text-right text-[#005596]">
                      {formatVND(loanAmount)}
                    </td>
                    <td className="py-2.5 px-3 text-right">-</td>
                    <td className="py-2.5 px-3 text-right">-</td>
                    <td className="py-2.5 px-3 text-right">-</td>
                  </tr>

                  {/* Regular Schedule Rows */}
                  {scheduleData.map((row) => (
                    <tr
                      key={row.period}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-2.5 px-3 text-center font-sans text-slate-500">
                        {row.period}
                      </td>
                      <td className="py-2.5 px-3 font-sans font-medium text-slate-800">
                        {row.date}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-700 font-semibold">
                        {formatVND(row.startingBalance)}
                      </td>
                      <td className="py-2.5 px-3 text-right text-emerald-700 font-medium">
                        {formatVND(row.principal)}
                      </td>
                      <td className="py-2.5 px-3 text-right text-amber-700 font-medium">
                        {formatVND(row.interest)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                        {formatVND(row.totalPayment)}
                      </td>
                    </tr>
                  ))}
                </tbody>

                {/* Footer Total Row */}
                <tfoot>
                  <tr className="bg-slate-900 text-white font-mono font-bold text-xs sticky bottom-0">
                    <td colSpan={2} className="py-3 px-3 text-center font-sans">
                      TỔNG CỘNG
                    </td>
                    <td className="py-3 px-3 text-right text-sky-200">
                      -
                    </td>
                    <td className="py-3 px-3 text-right text-emerald-300">
                      {formatVND(loanAmount)}
                    </td>
                    <td className="py-3 px-3 text-right text-amber-300">
                      {formatVND(summary.totalInterest)}
                    </td>
                    <td className="py-3 px-3 text-right text-white text-sm">
                      {formatVND(summary.totalPayment)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
              <span>* Sai lệch do làm tròn được bù trừ tự động vào kỳ trả nợ cuối cùng.</span>
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Đóng bảng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
