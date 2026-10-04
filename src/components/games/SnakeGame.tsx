import React, { useRef, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  RotateCcw,
  Copy,
  Check,
  Award,
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Flame,
} from 'lucide-react';

interface SnakeGameProps {
  onBackToMain?: () => void;
}

interface Point {
  x: number;
  y: number;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ onBackToMain }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const GRID_SIZE = 18; // 18x18 grid
  const CELL_SIZE = 18; // 324px canvas
  const CANVAS_DIM = GRID_SIZE * CELL_SIZE;

  // States
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameover'>('ready');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('snake_high_score') || '0', 10);
  });
  const [rewardNotice, setRewardNotice] = useState<string | null>(null);
  const [voucherCode, setVoucherCode] = useState<string>('');
  const [completedTime, setCompletedTime] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // References
  const snakeRef = useRef<Point[]>([
    { x: 9, y: 9 },
    { x: 8, y: 9 },
    { x: 7, y: 9 },
  ]);
  const directionRef = useRef<Point>({ x: 1, y: 0 });
  const nextDirectionRef = useRef<Point>({ x: 1, y: 0 });
  const foodRef = useRef<Point>({ x: 14, y: 9 });
  const gameIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasAlerted20Ref = useRef<boolean>(false);
  const hasAlerted40Ref = useRef<boolean>(false);

  const spawnFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    let collision: boolean;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      collision = currentSnake.some((s) => s.x === newFood.x && s.y === newFood.y);
    } while (collision);
    foodRef.current = newFood;
  }, []);

  const generateVoucher = () => {
    const random6 = Math.floor(100000 + Math.random() * 900000);
    return `VB-${random6}`;
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#005596', '#ED1C24', '#00A859', '#FBBF24'],
      });
    } catch {
      // silent
    }
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background grid
    ctx.fillStyle = '#0f172a'; // slate-900
    ctx.fillRect(0, 0, CANVAS_DIM, CANVAS_DIM);

    // Subtle grid pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, CANVAS_DIM);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(CANVAS_DIM, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw Food (VietinBank Gold Coin with Star)
    const food = foodRef.current;
    const fx = food.x * CELL_SIZE + CELL_SIZE / 2;
    const fy = food.y * CELL_SIZE + CELL_SIZE / 2;
    const fr = CELL_SIZE / 2 - 2;

    ctx.save();
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(fx, fy, fr, 0, Math.PI * 2);
    ctx.fill();

    // inner rim
    ctx.strokeStyle = '#fef3c7';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // coin star icon
    ctx.fillStyle = '#ED1C24';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('★', fx, fy);
    ctx.restore();

    // Draw Snake
    const snake = snakeRef.current;
    snake.forEach((part, index) => {
      const px = part.x * CELL_SIZE;
      const py = part.y * CELL_SIZE;

      if (index === 0) {
        // Head
        ctx.fillStyle = '#005596';
        ctx.beginPath();
        ctx.roundRect(px + 1, py + 1, CELL_SIZE - 2, CELL_SIZE - 2, 6);
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#ffffff';
        const dir = directionRef.current;
        let eye1 = { x: px + 4, y: py + 4 };
        let eye2 = { x: px + 12, y: py + 4 };
        if (dir.x === 1) {
          eye1 = { x: px + 12, y: py + 4 };
          eye2 = { x: px + 12, y: py + 12 };
        } else if (dir.x === -1) {
          eye1 = { x: px + 4, y: py + 4 };
          eye2 = { x: px + 4, y: py + 12 };
        } else if (dir.y === 1) {
          eye1 = { x: px + 4, y: py + 12 };
          eye2 = { x: px + 12, y: py + 12 };
        }
        ctx.beginPath();
        ctx.arc(eye1.x, eye1.y, 2, 0, Math.PI * 2);
        ctx.arc(eye2.x, eye2.y, 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Body (alternating bank blue and cyan)
        ctx.fillStyle = index % 2 === 0 ? '#0284c7' : '#0369a1';
        ctx.beginPath();
        ctx.roundRect(px + 1.5, py + 1.5, CELL_SIZE - 3, CELL_SIZE - 3, 4);
        ctx.fill();
      }
    });
  }, [CANVAS_DIM, CELL_SIZE]);

  const stepGame = useCallback(() => {
    directionRef.current = nextDirectionRef.current;
    const head = snakeRef.current[0];
    const newHead: Point = {
      x: head.x + directionRef.current.x,
      y: head.y + directionRef.current.y,
    };

    // Check Wall Collision
    if (
      newHead.x < 0 ||
      newHead.x >= GRID_SIZE ||
      newHead.y < 0 ||
      newHead.y >= GRID_SIZE
    ) {
      handleGameOver();
      return;
    }

    // Check Self Collision
    if (snakeRef.current.some((part) => part.x === newHead.x && part.y === newHead.y)) {
      handleGameOver();
      return;
    }

    const newSnake = [newHead, ...snakeRef.current];

    // Check Food Eaten
    if (newHead.x === foodRef.current.x && newHead.y === foodRef.current.y) {
      const newScore = score + 1;
      setScore(newScore);

      // Check milestones without interrupting the game
      if (newScore >= 20 && !hasAlerted20Ref.current) {
        hasAlerted20Ref.current = true;
        setRewardNotice('Chúc mừng Quý khách đã đạt 20 điểm! Nhận được 01 voucher xăng trị giá 2 lít.');
        triggerConfetti();
      } else if (newScore >= 40 && !hasAlerted40Ref.current) {
        hasAlerted40Ref.current = true;
        setRewardNotice('Xuất sắc! Quý khách đã đạt 40 điểm! Nhận được 02 voucher xăng, mỗi voucher trị giá 2 lít.');
        triggerConfetti();
      }

      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('snake_high_score', newScore.toString());
      }
      spawnFood(newSnake);
    } else {
      newSnake.pop();
    }

    snakeRef.current = newSnake;
    draw();
  }, [score, highScore, spawnFood, draw]);

  const handleGameOver = () => {
    if (gameIntervalRef.current) {
      clearInterval(gameIntervalRef.current);
    }
    setGameState('gameover');
    setCompletedTime(new Date().toLocaleTimeString('vi-VN') + ' - ' + new Date().toLocaleDateString('vi-VN'));
    if (score >= 20) {
      setVoucherCode(generateVoucher());
    }
  };

  const startGame = () => {
    snakeRef.current = [
      { x: 9, y: 9 },
      { x: 8, y: 9 },
      { x: 7, y: 9 },
    ];
    directionRef.current = { x: 1, y: 0 };
    nextDirectionRef.current = { x: 1, y: 0 };
    hasAlerted20Ref.current = false;
    hasAlerted40Ref.current = false;
    setRewardNotice(null);
    setScore(0);
    setGameState('playing');
    spawnFood(snakeRef.current);
  };

  // Game loop interval
  useEffect(() => {
    if (gameState === 'playing') {
      const interval = setInterval(stepGame, 120); // friendly speed
      gameIntervalRef.current = interval;
      return () => clearInterval(interval);
    }
  }, [gameState, stepGame]);

  // Initial draw
  useEffect(() => {
    draw();
  }, [draw]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      const current = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'KeyW':
          if (current.y !== 1) nextDirectionRef.current = { x: 0, y: -1 };
          e.preventDefault();
          break;
        case 'ArrowDown':
        case 'KeyS':
          if (current.y !== -1) nextDirectionRef.current = { x: 0, y: 1 };
          e.preventDefault();
          break;
        case 'ArrowLeft':
        case 'KeyA':
          if (current.x !== 1) nextDirectionRef.current = { x: -1, y: 0 };
          e.preventDefault();
          break;
        case 'ArrowRight':
        case 'KeyD':
          if (current.x !== -1) nextDirectionRef.current = { x: 1, y: 0 };
          e.preventDefault();
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  const changeDirection = (dx: number, dy: number) => {
    if (gameState !== 'playing') return;
    const current = directionRef.current;
    if (dx !== 0 && current.x !== -dx) {
      nextDirectionRef.current = { x: dx, y: 0 };
    } else if (dy !== 0 && current.y !== -dy) {
      nextDirectionRef.current = { x: 0, y: dy };
    }
  };

  const getRewardTierText = (s: number) => {
    if (s >= 40) return '02 voucher xăng (mỗi voucher trị giá 2 lít)';
    if (s >= 20) return '01 voucher xăng trị giá 2 lít';
    return 'Chưa đạt mốc thưởng (Cần tối thiểu 20 điểm)';
  };

  const getEndMessage = (s: number) => {
    if (s >= 40) {
      return 'Chúc mừng Quý khách! Quý khách đủ điều kiện nhận 02 voucher xăng, mỗi voucher trị giá 2 lít.';
    }
    if (s >= 20) {
      return 'Chúc mừng Quý khách! Quý khách đủ điều kiện nhận 01 voucher xăng trị giá 2 lít.';
    }
    return 'Rất tiếc, Quý khách chưa đạt mốc nhận voucher. Hãy thử lại để chinh phục mốc 20 điểm!';
  };

  const handleCopyCode = () => {
    if (!voucherCode) return;
    navigator.clipboard.writeText(voucherCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-xl mx-auto py-4 px-2 sm:px-4">
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-sky-800">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>VIETINBANK SNAKE CHALLENGE</span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight">
              Chơi vui tại quầy – Săn voucher xăng hấp dẫn
            </h3>
          </div>

          {onBackToMain && (
            <button
              onClick={onBackToMain}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 bg-slate-100 text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Trang chủ</span>
            </button>
          )}
        </div>

        {/* Milestone info banner */}
        <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
          <div className="p-2 rounded-xl bg-sky-50 border border-sky-100 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#005596] text-white flex items-center justify-center font-bold text-[11px]">
              20
            </span>
            <span className="text-slate-700 font-medium">Nhận 01 voucher 2L</span>
          </div>
          <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-[11px]">
              40
            </span>
            <span className="text-slate-700 font-medium">Nhận 02 voucher 2L</span>
          </div>
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between text-xs font-bold pb-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-slate-600">Điểm:</span>
            <span className="font-mono text-lg text-[#005596]">{score}</span>
          </div>
          <div className="text-slate-400 font-mono text-xs">
            Kỷ lục: {highScore}
          </div>
        </div>

        {/* Milestone Achievement Notification while playing */}
        {rewardNotice && (
          <div className="mb-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
            <Flame className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{rewardNotice}</span>
          </div>
        )}

        {/* Canvas Display */}
        <div className="relative mx-auto rounded-2xl overflow-hidden shadow-inner border border-slate-800 w-[324px] h-[324px]">
          <canvas
            ref={canvasRef}
            width={CANVAS_DIM}
            height={CANVAS_DIM}
            className="block"
          />

          {/* Ready Overlay */}
          {gameState === 'ready' && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-white text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#005596] text-white flex items-center justify-center mb-3">
                <Trophy className="w-6 h-6 text-amber-300" />
              </div>
              <h4 className="text-base font-bold mb-1">VietinBank Snake</h4>
              <p className="text-xs text-slate-300 mb-4 max-w-xs">
                Dùng phím mũi tên hoặc nút bấm bên dưới để điều khiển rắn ăn sao vàng.
              </p>
              <button
                onClick={startGame}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-xs shadow-md hover:from-emerald-600 hover:to-emerald-700 transition-all cursor-pointer"
              >
                Bắt đầu chơi
              </button>
            </div>
          )}

          {/* Game Over Slip Overlay */}
          {gameState === 'gameover' && (
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-white text-center overflow-y-auto">
              {score >= 20 ? (
                /* PHIẾU XÁC NHẬN QUÀ TẶNG */
                <div className="w-full bg-white text-slate-900 rounded-2xl p-4 shadow-xl border border-amber-300 space-y-2">
                  <div className="border-b border-dashed border-slate-300 pb-2">
                    <span className="text-[10px] font-bold tracking-widest text-[#005596] uppercase">
                      VIETINBANK - PHIẾU XÁC NHẬN QUÀ TẶNG
                    </span>
                    <h5 className="text-sm font-black text-slate-900 mt-0.5">
                      {getEndMessage(score)}
                    </h5>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-left text-xs py-1">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Điểm cuối cùng</span>
                      <span className="font-mono font-bold text-slate-900 text-sm">{score} điểm</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Mức quà</span>
                      <span className="font-bold text-emerald-700 text-xs">
                        {score >= 40 ? '02 Voucher Xăng' : '01 Voucher Xăng'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-sky-50 p-2 rounded-xl border border-sky-100 flex items-center justify-between">
                    <div className="text-left">
                      <span className="text-[9px] text-slate-400 uppercase font-bold block">Mã Voucher</span>
                      <span className="font-mono font-black text-base text-[#005596] tracking-wider">
                        {voucherCode}
                      </span>
                    </div>
                    <button
                      onClick={handleCopyCode}
                      className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold flex items-center gap-1 hover:bg-slate-50 cursor-pointer"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Đã chép' : 'Chép'}</span>
                    </button>
                  </div>

                  <p className="text-[10px] text-amber-800 bg-amber-50 p-1.5 rounded-lg font-medium leading-tight">
                    Vui lòng chụp màn hình hoặc thông báo với giao dịch viên để nhận quà.
                  </p>

                  <div className="pt-1 flex items-center justify-center gap-2">
                    <button
                      onClick={startGame}
                      className="px-4 py-2 rounded-xl bg-[#005596] text-white text-xs font-bold hover:bg-[#004275] transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Chơi lại
                    </button>
                  </div>
                </div>
              ) : (
                /* Below 20 pts screen */
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600/80 text-white flex items-center justify-center mx-auto">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold">Rất tiếc!</h4>
                  <p className="text-xs text-slate-300 max-w-xs leading-relaxed">
                    {getEndMessage(score)}
                  </p>
                  <p className="text-xs text-sky-200 font-mono">Điểm đạt: {score} điểm</p>
                  <button
                    onClick={startGame}
                    className="px-5 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-colors flex items-center gap-1.5 mx-auto cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Chơi lại
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* On-screen D-Pad for Tablet & Mobile Touch */}
        <div className="mt-4 flex flex-col items-center">
          <button
            onClick={() => changeDirection(0, -1)}
            className="w-12 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 flex items-center justify-center text-slate-700 shadow-xs cursor-pointer mb-1"
            title="Lên"
          >
            <ChevronUp className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => changeDirection(-1, 0)}
              className="w-12 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 flex items-center justify-center text-slate-700 shadow-xs cursor-pointer"
              title="Trái"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => changeDirection(0, 1)}
              className="w-12 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 flex items-center justify-center text-slate-700 shadow-xs cursor-pointer"
              title="Xuống"
            >
              <ChevronDown className="w-6 h-6" />
            </button>
            <button
              onClick={() => changeDirection(1, 0)}
              className="w-12 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 flex items-center justify-center text-slate-700 shadow-xs cursor-pointer"
              title="Phải"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 font-medium">
            Có thể dùng phím mũi tên trên bàn phím hoặc chạm các nút ở trên
          </span>
        </div>
      </div>
    </div>
  );
};
