import React, { useRef, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  RotateCcw,
  Copy,
  Check,
  Flame,
  Award,
  ArrowLeft,
  Volume2,
  VolumeX,
} from 'lucide-react';
import contentData from '../../data/contentData.json';

declare global {
  interface Window {
    onFlappyVoucherWin?: (data: {
      score: number;
      voucherCode: string;
      reward: string;
      timestamp: string;
    }) => void;
    onFlappyVoucherLose?: (data: {
      score: number;
      timestamp: string;
    }) => void;
  }
}

interface FlappyBirdGameProps {
  onBackToMain?: () => void;
}

export const FlappyBirdGame: React.FC<FlappyBirdGameProps> = ({ onBackToMain }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Configuration constants
  const WIN_SCORE = 20;
  const VOUCHER_TEXT = 'Voucher 2 lít xăng';
  const BRAND_NAME = 'VietinBank';
  const GAME_TITLE = 'Chờ vui – Chơi hay – Nhận quà liền tay';

  // Game states: 'ready' | 'playing' | 'gameover' | 'won'
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameover' | 'won'>('ready');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('flappy_high_score') || '0', 10);
  });
  const [currentVoucher, setCurrentVoucher] = useState<string>('');
  const [recentVoucher, setRecentVoucher] = useState<string>(() => {
    return localStorage.getItem('flappy_recent_voucher') || '';
  });
  const [copied, setCopied] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  // References for game loop
  const animFrameIdRef = useRef<number | null>(null);
  const birdRef = useRef({
    x: 70,
    y: 180,
    velocity: 0,
    gravity: 0.28,
    jump: -5.6,
    radius: 16,
    tilt: 0,
  });

  const pipesRef = useRef<
    Array<{
      x: number;
      topHeight: number;
      bottomHeight: number;
      passed: boolean;
    }>
  >([]);

  const frameCountRef = useRef<number>(0);
  const scoreRef = useRef<number>(0);
  const hasWonRef = useRef<boolean>(false);

  // Motivational quote based on score
  const getMotivationalText = (s: number) => {
    if (s < 5) return 'Khởi động nhẹ nhàng!';
    if (s < 10) return 'Tốt lắm, tiếp tục nào!';
    if (s < 15) return 'Một nửa chặng đường rồi!';
    if (s < 20) return 'Sắp nhận quà rồi!';
    return 'Xuất sắc!';
  };

  const generateVoucherCode = useCallback(() => {
    const random6 = Math.floor(100000 + Math.random() * 900000);
    return `VB-${random6}`;
  }, []);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#005596', '#ED1C24', '#00A859', '#FBBF24', '#FFFFFF'],
      });
    } catch {
      // fallback silent
    }
  };

  const resetGame = useCallback(() => {
    birdRef.current = {
      x: 70,
      y: 180,
      velocity: 0,
      gravity: 0.28,
      jump: -5.6,
      radius: 16,
      tilt: 0,
    };
    pipesRef.current = [];
    frameCountRef.current = 0;
    scoreRef.current = 0;
    hasWonRef.current = false;
    setScore(0);
    setGameState('ready');
  }, []);

  const handleJump = useCallback(() => {
    if (gameState === 'ready') {
      setGameState('playing');
      birdRef.current.velocity = birdRef.current.jump;
    } else if (gameState === 'playing') {
      birdRef.current.velocity = birdRef.current.jump;
    }
  }, [gameState]);

  // Main canvas render and game physics loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const PIPE_SPEED = 2.0;
    const PIPE_GAP = 135; // friendly wider gap for customer convenience
    const PIPE_SPAWN_INTERVAL = 110;

    const gameLoop = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Bank-themed gradient sky background
      const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGrad.addColorStop(0, '#e0f2fe'); // light sky blue
      skyGrad.addColorStop(0.7, '#f0f9ff');
      skyGrad.addColorStop(1, '#bae6fd');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stylized bank building silhouettes in background
      ctx.fillStyle = 'rgba(0, 85, 150, 0.07)';
      ctx.fillRect(20, canvas.height - 120, 50, 90);
      ctx.fillRect(80, canvas.height - 150, 65, 120);
      ctx.fillRect(160, canvas.height - 110, 45, 80);
      ctx.fillRect(220, canvas.height - 160, 70, 130);
      ctx.fillRect(305, canvas.height - 130, 55, 100);

      // Draw Ground
      const groundGrad = ctx.createLinearGradient(0, canvas.height - 30, 0, canvas.height);
      groundGrad.addColorStop(0, '#0284c7');
      groundGrad.addColorStop(1, '#005596');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, canvas.height - 30, canvas.width, 30);
      ctx.fillStyle = '#ED1C24';
      ctx.fillRect(0, canvas.height - 30, canvas.width, 3);

      if (gameState === 'playing') {
        frameCountRef.current++;

        // Physics: Bird Gravity
        const bird = birdRef.current;
        bird.velocity += bird.gravity;
        bird.y += bird.velocity;
        bird.tilt = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, (bird.velocity / 10) * 0.8));

        // Spawn pipes
        if (frameCountRef.current % PIPE_SPAWN_INTERVAL === 0) {
          const availableHeight = canvas.height - 30 - PIPE_GAP - 60;
          const topHeight = Math.floor(Math.random() * availableHeight) + 30;
          const bottomHeight = canvas.height - 30 - topHeight - PIPE_GAP;

          pipesRef.current.push({
            x: canvas.width,
            topHeight,
            bottomHeight,
            passed: false,
          });
        }

        // Update & Render Pipes
        for (let i = pipesRef.current.length - 1; i >= 0; i--) {
          const p = pipesRef.current[i];
          p.x -= PIPE_SPEED;

          // Check if scored
          if (!p.passed && p.x + 40 < bird.x) {
            p.passed = true;
            scoreRef.current += 1;
            setScore(scoreRef.current);

            // Update high score
            if (scoreRef.current > highScore) {
              setHighScore(scoreRef.current);
              localStorage.setItem('flappy_high_score', scoreRef.current.toString());
            }

            // Check Win Condition at 20 pts
            if (scoreRef.current >= WIN_SCORE && !hasWonRef.current) {
              hasWonRef.current = true;
              const code = generateVoucherCode();
              setCurrentVoucher(code);
              setRecentVoucher(code);
              localStorage.setItem('flappy_recent_voucher', code);
              setGameState('won');
              triggerConfetti();

              if (window.onFlappyVoucherWin) {
                window.onFlappyVoucherWin({
                  score: 20,
                  voucherCode: code,
                  reward: VOUCHER_TEXT,
                  timestamp: new Date().toISOString(),
                });
              }
              return;
            }
          }

          // Draw Top Pipe (VietinBank Blue pillar with subtle cap)
          const pipeGrad = ctx.createLinearGradient(p.x, 0, p.x + 44, 0);
          pipeGrad.addColorStop(0, '#005596');
          pipeGrad.addColorStop(0.5, '#0284c7');
          pipeGrad.addColorStop(1, '#003e6f');

          ctx.fillStyle = pipeGrad;
          ctx.beginPath();
          ctx.roundRect(p.x, 0, 44, p.topHeight, [0, 0, 8, 8]);
          ctx.fill();

          // Pipe Cap
          ctx.fillStyle = '#ED1C24';
          ctx.fillRect(p.x - 2, p.topHeight - 8, 48, 8);

          // Draw Bottom Pipe
          const bottomY = canvas.height - 30 - p.bottomHeight;
          ctx.fillStyle = pipeGrad;
          ctx.beginPath();
          ctx.roundRect(p.x, bottomY, 44, p.bottomHeight, [8, 8, 0, 0]);
          ctx.fill();

          ctx.fillStyle = '#ED1C24';
          ctx.fillRect(p.x - 2, bottomY, 48, 8);

          // Collision Detection
          // Check horizontal match
          if (bird.x + bird.radius - 3 > p.x && bird.x - bird.radius + 3 < p.x + 44) {
            // Check vertical collision with top or bottom pipe
            if (bird.y - bird.radius + 3 < p.topHeight || bird.y + bird.radius - 3 > bottomY) {
              // Game Over
              setGameState('gameover');
              if (window.onFlappyVoucherLose) {
                window.onFlappyVoucherLose({
                  score: scoreRef.current,
                  timestamp: new Date().toISOString(),
                });
              }
              return;
            }
          }

          // Remove offscreen pipes
          if (p.x + 50 < 0) {
            pipesRef.current.splice(i, 1);
          }
        }

        // Check Ground or Ceiling Collision
        if (bird.y + bird.radius >= canvas.height - 30 || bird.y - bird.radius <= 0) {
          setGameState('gameover');
          if (window.onFlappyVoucherLose) {
            window.onFlappyVoucherLose({
              score: scoreRef.current,
              timestamp: new Date().toISOString(),
            });
          }
          return;
        }
      }

      // Draw Mascot / Flying Bank Card
      const bird = birdRef.current;
      ctx.save();
      ctx.translate(bird.x, bird.y);
      ctx.rotate(bird.tilt);

      // Flying VietinBank Card / Mascot
      // Shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 3;

      // Card body
      const cardGrad = ctx.createLinearGradient(-18, -12, 18, 12);
      cardGrad.addColorStop(0, '#005596');
      cardGrad.addColorStop(1, '#00335e');
      ctx.fillStyle = cardGrad;
      ctx.beginPath();
      ctx.roundRect(-18, -12, 36, 24, 4);
      ctx.fill();

      // Card stripe (Red accent)
      ctx.fillStyle = '#ED1C24';
      ctx.fillRect(-18, -2, 36, 4);

      // Chip
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(-12, -8, 6, 5);

      // Wing (flapping effect)
      ctx.fillStyle = '#FFFFFF';
      const wingY = gameState === 'playing' ? Math.sin(frameCountRef.current * 0.3) * 6 : 0;
      ctx.beginPath();
      ctx.ellipse(-2, wingY - 2, 7, 4, -0.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      animFrameIdRef.current = requestAnimationFrame(gameLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [gameState, highScore, generateVoucherCode]);

  // Keyboard Space listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleJump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleJump]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="flappy-voucher-game" className="max-w-xl mx-auto py-4 px-2 sm:px-4">
      {/* Game Card Container */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-sky-800">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>THỬ THÁCH NHẬN VOUCHER XĂNG</span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight">
              {GAME_TITLE}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 bg-slate-100 text-xs cursor-pointer"
              title="Bật/Tắt âm thanh"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            {onBackToMain && (
              <button
                onClick={onBackToMain}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 bg-slate-100 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                title="Quay lại danh sách tính năng"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Trang chủ</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Score & Progress */}
        <div className="mb-3 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-700 flex items-center gap-1">
              <span>Điểm số:</span>
              <span className="font-mono text-base text-[#005596]">{score} / {WIN_SCORE}</span>
            </span>
            <span className="text-slate-400 font-mono text-[11px]">
              Kỷ lục: {highScore}
            </span>
          </div>

          {/* Progress bar to 20 */}
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
            <div
              className="h-full bg-gradient-to-r from-[#005596] to-emerald-500 transition-all duration-200"
              style={{ width: `${Math.min(100, (score / WIN_SCORE) * 100)}%` }}
            />
          </div>

          {/* Motivational Toast Message */}
          <div className="text-center text-xs font-semibold text-sky-800 bg-sky-50/80 py-1 px-3 rounded-lg flex items-center justify-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
            <span>{getMotivationalText(score)}</span>
          </div>
        </div>

        {/* Game Canvas Area */}
        <div
          ref={containerRef}
          onClick={handleJump}
          onTouchStart={(e) => {
            e.preventDefault(); // prevent zoom and scroll
            handleJump();
          }}
          className="relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden shadow-inner border border-slate-300 select-none cursor-pointer bg-sky-100"
          style={{ touchAction: 'manipulation' }}
        >
          <canvas
            ref={canvasRef}
            width={440}
            height={330}
            className="w-full h-full block"
          />

          {/* Overlay: Ready to Play */}
          {gameState === 'ready' && (
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-white text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#005596] text-white flex items-center justify-center mb-3 shadow-lg">
                <Trophy className="w-7 h-7 text-amber-300" />
              </div>
              <h4 className="text-lg font-bold mb-1">Vượt 20 thử thách</h4>
              <p className="text-xs text-sky-100 mb-4 max-w-xs">
                Nhận ngay <strong className="text-amber-300">Voucher 2 lít xăng</strong> miễn phí tại quầy VietinBank!
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleJump();
                }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-sm shadow-md hover:from-emerald-600 hover:to-emerald-700 transition-all cursor-pointer animate-pulse"
              >
                Bắt đầu chơi
              </button>
              <span className="text-[11px] text-white/80 mt-3 font-medium">
                Chạm màn hình hoặc nhấn phím Space để bay
              </span>
            </div>
          )}

          {/* Overlay: Game Over (Lose) */}
          {gameState === 'gameover' && (
            <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-white text-center">
              <div className="w-12 h-12 rounded-2xl bg-red-600/90 text-white flex items-center justify-center mb-2">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold mb-1">Rất tiếc!</h4>
              <p className="text-xs text-slate-200 mb-1">
                Bạn đã vượt qua <strong className="text-amber-400 font-mono text-sm">{score}/{WIN_SCORE}</strong> thử thách.
              </p>
              <p className="text-xs text-sky-200 mb-5">
                Chỉ còn một chút nữa thôi, hãy thử lại nhé!
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    resetGame();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-xs shadow-md hover:bg-emerald-600 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Chơi lại
                </button>
                {onBackToMain && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onBackToMain();
                    }}
                    className="px-4 py-2.5 rounded-xl bg-white/20 text-white font-semibold text-xs hover:bg-white/30 transition-colors cursor-pointer"
                  >
                    Về màn hình chính
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Overlay: Game Won (Victory Voucher) */}
          {gameState === 'won' && (
            <div className="absolute inset-0 bg-gradient-to-b from-[#005596]/90 to-slate-900/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-white text-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center mb-2 shadow-xl animate-bounce">
                <Award className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-extrabold text-amber-300">Chúc mừng!</h4>
              <p className="text-xs text-sky-100 mt-1 mb-3">
                Bạn đã vượt qua 20 thử thách và đủ điều kiện nhận <strong>voucher 2 lít xăng</strong>.
              </p>

              {/* Voucher Code Box */}
              <div className="bg-white text-slate-900 px-5 py-3 rounded-2xl shadow-lg border-2 border-amber-300 mb-3 flex items-center gap-3">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">
                    MÃ NHẬN QUÀ CỦA BẠN
                  </span>
                  <span className="font-mono text-2xl font-black text-[#005596] tracking-widest">
                    {currentVoucher}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyCode(currentVoucher);
                  }}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  title="Sao chép mã"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <p className="text-[11px] text-amber-100 mb-4 max-w-xs leading-tight">
                Vui lòng chụp màn hình hoặc đưa mã này cho nhân viên để nhận quà.
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyCode(currentVoucher);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-400 text-slate-900 font-bold text-xs hover:bg-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Đã sao chép' : 'Sao chép mã'}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    resetGame();
                  }}
                  className="px-4 py-2 rounded-xl bg-white/20 text-white font-bold text-xs hover:bg-white/30 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Chơi lại
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Recent Voucher Slip info if exists */}
        {recentVoucher && (
          <div className="mt-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Award className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <span className="text-[11px] font-semibold text-amber-900">Mã voucher gần nhất: </span>
                <span className="font-mono font-bold text-xs text-[#005596]">{recentVoucher}</span>
              </div>
            </div>
            <button
              onClick={() => handleCopyCode(recentVoucher)}
              className="text-xs font-semibold text-[#005596] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Copy className="w-3 h-3" />
              Sao chép
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
