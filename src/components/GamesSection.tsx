import React, { useState } from 'react';
import { Trophy, Gamepad2, Gift, Sparkles, Fuel } from 'lucide-react';
import { FlappyBirdGame } from './games/FlappyBirdGame';
import { SnakeGame } from './games/SnakeGame';

interface GamesSectionProps {
  onBackToMain?: () => void;
}

export const GamesSection: React.FC<GamesSectionProps> = ({ onBackToMain }) => {
  const [selectedGame, setSelectedGame] = useState<'flappy' | 'snake'>('flappy');

  return (
    <div className="max-w-6xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold mb-3 border border-amber-200">
          <Gift className="w-3.5 h-3.5 text-[#ED1C24]" />
          <span>TRI ÂN KHÁCH HÀNG TẠI QUẦY GIAO DỊCH</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Góc Thử Thách & Nhận Quà Liền Tay
        </h2>
        <p className="text-slate-500 text-sm mt-2">
          Chơi game giải trí trong thời gian chờ đợi phục vụ – Chinh phục điểm số và nhận ngay Voucher Xăng 2 Lít từ VietinBank!
        </p>
      </div>

      {/* Game Selector Tabs */}
      <div className="flex items-center justify-center mb-8">
        <div className="p-1.5 bg-slate-200/80 rounded-2xl flex items-center gap-2 shadow-inner">
          <button
            onClick={() => setSelectedGame('flappy')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              selectedGame === 'flappy'
                ? 'bg-white text-[#005596] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Game 1: Flappy Bird</span>
            <span className="px-1.5 py-0.5 rounded-full bg-red-100 text-[#ED1C24] text-[10px]">
              20 Điểm = 1 Voucher
            </span>
          </button>

          <button
            onClick={() => setSelectedGame('snake')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              selectedGame === 'snake'
                ? 'bg-white text-[#005596] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Game 2: Snake Challenge</span>
            <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px]">
              Lên đến 2 Voucher
            </span>
          </button>
        </div>
      </div>

      {/* Active Game */}
      {selectedGame === 'flappy' ? (
        <FlappyBirdGame onBackToMain={onBackToMain} />
      ) : (
        <SnakeGame onBackToMain={onBackToMain} />
      )}

      {/* Rules & Transparency Note */}
      <div className="max-w-2xl mx-auto mt-8 p-5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-500 space-y-2">
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <Fuel className="w-4 h-4 text-[#ED1C24]" />
          <span>Quy định nhận quà tặng tại quầy:</span>
        </div>
        <p className="leading-relaxed">
          • Trò chơi chỉ mang tính chất tri ân, tạo trải nghiệm vui vẻ cho Quý khách hàng trong thời gian chờ giao dịch.
        </p>
        <p className="leading-relaxed">
          • Không yêu cầu nhập thông tin cá nhân, số điện thoại hay số tài khoản. Không có yếu tố cá cược hoặc đổi tiền mặt.
        </p>
        <p className="leading-relaxed">
          • Sau khi hoàn thành lượt chơi đạt mốc, Quý khách vui lòng lưu/chụp mã voucher trên màn hình và thông báo với Giao dịch viên tại quầy để nhận quà tương ứng.
        </p>
      </div>
    </div>
  );
};
