import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';
import { Volume2, VolumeX, Sparkles, Tv, Flame, Shuffle, Trophy } from 'lucide-react';
import { AudioEngine } from './AudioEngine';

interface ThemeSlotMachineProps {
  themes: string[];
  onThemeSelected: (theme: string) => void;
  isTVMode: boolean;
  muted: boolean;
  onToggleMute: () => void;
  onToggleTV: () => void;
  totalCorrectAnswers: number;
}

export const ThemeSlotMachine: React.FC<ThemeSlotMachineProps> = ({
  themes,
  onThemeSelected,
  isTVMode,
  muted,
  onToggleMute,
  onToggleTV,
  totalCorrectAnswers,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  
  // Height of a single slot item in pixels
  const ITEM_HEIGHT = isTVMode ? 80 : 64;

  // We duplicate themes to simulate a long rolling wheel
  const REPETITIONS = 12;
  const rollingThemes = React.useMemo(() => {
    if (themes.length === 0) return ['Nenhum tema'];
    let list: string[] = [];
    for (let i = 0; i < REPETITIONS; i++) {
      list = [...list, ...themes];
    }
    return list;
  }, [themes]);

  // Framer Motion animated y offset of the reel
  const y = useMotionValue(0);

  // Derive blur amount based on current spinning velocity/state
  const [blurAmount, setBlurAmount] = useState(0);
  const [lightsActive, setLightsActive] = useState(false);

  // Sound triggering state
  const lastIndexRef = useRef(-1);

  // Side Lever animation state (rotates the pull arm)
  const [leverPulled, setLeverPulled] = useState(false);

  // Synchronize mute/tv state
  useEffect(() => {
    AudioEngine.setMuted(muted);
  }, [muted]);

  const spin = () => {
    if (isSpinning || themes.length === 0) return;

    setIsSpinning(true);
    setWinner(null);
    setLightsActive(true);
    setLeverPulled(true);

    // Play starting lever sound
    AudioEngine.playRaffleSpin();

    // Release lever after 300ms
    setTimeout(() => {
      setLeverPulled(false);
    }, 300);

    // Randomize a winning theme
    const winningIndex = Math.floor(Math.random() * themes.length);
    const selectedWinner = themes[winningIndex];

    // Determine target index in the middle of the repeated list (e.g. repetition group 8)
    const targetGroup = 8;
    const finalTargetIdx = targetGroup * themes.length + winningIndex;
    const targetY = -finalTargetIdx * ITEM_HEIGHT;

    // Start with a small visual overshoot bounce backwards before flying down
    const startY = y.get();
    
    // Smooth custom cubic-bezier for realistic heavy physical spin slowdown
    // starts very fast, slows down with heavy inertia
    const spinAnimation = animate(y, targetY, {
      type: 'tween',
      duration: 3.8,
      ease: [0.15, 0.85, 0.25, 1], // Custom slow deceleration curves
      onUpdate: (latest) => {
        // Calculate current item crossing index to play tick sounds
        const currentCrossingIndex = Math.round(Math.abs(latest) / ITEM_HEIGHT);
        if (currentCrossingIndex !== lastIndexRef.current) {
          // Play tick only if we are moving fast enough
          AudioEngine.playTick();
          lastIndexRef.current = currentCrossingIndex;
        }

        // Apply visual blur based on distance to the target
        const distanceRemaining = Math.abs(latest - targetY);
        if (distanceRemaining > 200) {
          setBlurAmount(Math.min(5, distanceRemaining / 120));
        } else {
          setBlurAmount(distanceRemaining / 100);
        }
      },
      onComplete: () => {
        // Spin complete
        setIsSpinning(false);
        setWinner(selectedWinner);
        setBlurAmount(0);

        // Flash lights quickly to celebrate
        AudioEngine.playSuccess();

        // Strobe effect on the cabinet lights
        let flashCount = 0;
        const interval = setInterval(() => {
          setLightsActive(prev => !prev);
          flashCount++;
          if (flashCount >= 8) {
            clearInterval(interval);
            setLightsActive(true);
          }
        }, 150);

        // Wait 1.5s so user can read the selected theme before navigating
        setTimeout(() => {
          onThemeSelected(selectedWinner);
        }, 1600);
      }
    });

    return () => spinAnimation.stop();
  };

  // Ensure current position resets gracefully if window/TV mode toggles item size
  useEffect(() => {
    y.set(0);
    setWinner(null);
    setBlurAmount(0);
  }, [isTVMode, themes]);

  return (
    <div className="flex flex-col items-center justify-center p-2 w-full max-w-md mx-auto">
      {/* Header Utilities */}
      <div className="w-full flex justify-between items-center mb-5 px-1">
        <div className="flex items-center gap-2">
          <div className="bg-amber-100 text-amber-700 p-2 rounded-xl border border-amber-200">
            <Flame className="w-5 h-5 fill-amber-500 text-amber-600 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xs font-black text-slate-800 leading-tight uppercase tracking-wider">Sorteador Sagrado</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Slots</span>
              <span className="inline-flex items-center gap-0.5 text-[10px] font-black px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                {totalCorrectAnswers} acertos 🔥
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex gap-1.5">
          <button
            onClick={onToggleTV}
            className={`p-2 rounded-xl border-2 transition-all cursor-pointer ${
              isTVMode 
                ? 'bg-indigo-100 border-indigo-400 text-indigo-700 shadow-sm' 
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            title="Modo TV Smart (Aumentar fontes)"
          >
            <Tv className="w-4 h-4" />
          </button>
          <button
            onClick={onToggleMute}
            className={`p-2 rounded-xl border-2 transition-all cursor-pointer ${
              muted 
                ? 'bg-rose-50 border-rose-200 text-rose-500' 
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Arcade Slot Machine Cabinet */}
      <div className="relative w-full flex items-center justify-center select-none">
        
        {/* PHYSICAL LEVER (Alavanca) on the right side - Hidden on tiny screens, visible on md+ */}
        <div className="absolute right-[-45px] top-[40%] h-44 w-12 hidden sm:flex flex-col items-center z-10">
          {/* Lever base pivot bracket */}
          <div className="w-8 h-8 bg-slate-700 rounded-full border-4 border-slate-500 shadow-md flex items-center justify-center">
            <div className="w-3 h-3 bg-slate-900 rounded-full"></div>
          </div>
          
          {/* Lever Arm (with custom pull rotation transition) */}
          <motion.div
            animate={{ 
              rotateX: leverPulled ? 55 : 0,
              y: leverPulled ? 15 : 0
            }}
            transition={{ type: 'spring', stiffness: leverPulled ? 400 : 150, damping: 10 }}
            className="w-3 bg-gradient-to-r from-slate-400 to-slate-200 border-r border-slate-500 origin-top h-24 -mt-1 flex flex-col items-center justify-end rounded-b-md cursor-pointer"
            onClick={spin}
            style={{ transformOrigin: 'top center' }}
          >
            {/* Red plastic handle ball at the end */}
            <motion.div 
              whileHover={{ scale: 1.15 }}
              className="w-8 h-8 bg-gradient-to-b from-rose-500 via-red-600 to-red-700 rounded-full shadow-lg border-2 border-red-400 -mb-7 cursor-pointer"
            />
          </motion.div>
        </div>

        {/* Main Cabinet Chassis */}
        <div className="relative w-full bg-gradient-to-b from-[#ffb703] via-[#fb8500] to-[#d46200] rounded-[36px] p-4 sm:p-5 border-4 border-[#ffb703] shadow-xl border-b-12 border-b-amber-800/80 flex flex-col items-center">
          
          {/* Decorative flashing lights on left and right borders */}
          <div className="absolute left-2.5 top-8 bottom-8 flex flex-col justify-between items-center py-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div 
                key={`l-${i}`} 
                className={`w-2.5 h-2.5 rounded-full transition-all duration-150 ${
                  lightsActive 
                    ? i % 2 === 0 ? 'bg-amber-300 shadow-[0_0_10px_#fff]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'
                    : i % 2 === 0 ? 'bg-red-800' : 'bg-amber-600'
                }`}
              />
            ))}
          </div>

          <div className="absolute right-2.5 top-8 bottom-8 flex flex-col justify-between items-center py-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div 
                key={`r-${i}`} 
                className={`w-2.5 h-2.5 rounded-full transition-all duration-150 ${
                  lightsActive 
                    ? i % 2 !== 0 ? 'bg-amber-300 shadow-[0_0_10px_#fff]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'
                    : i % 2 !== 0 ? 'bg-red-800' : 'bg-amber-600'
                }`}
              />
            ))}
          </div>

          {/* Golden Crown / Title Plate */}
          <div className="bg-slate-950 text-amber-400 border-2 border-amber-400/80 px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md mb-4 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-400" />
            SORTEIO AUTOMÁTICO
          </div>

          {/* Inner Reel Viewing Screen */}
          <div className="relative w-full bg-slate-900 border-6 border-slate-950 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center p-1">
            
            {/* Visual Glass Sheen Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/30 pointer-events-none z-20" />
            
            {/* Red Center Selector Line / Horizontal Winning Pointer Indicator */}
            <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 flex justify-between items-center z-10 pointer-events-none px-1">
              <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-12 border-l-rose-500 drop-shadow-md"></div>
              <div className="w-full border-b border-rose-500/50 border-dashed mx-2"></div>
              <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-12 border-r-rose-500 drop-shadow-md"></div>
            </div>

            {/* Inner frame shadow (depth simulation) - reduced to h-4 to prevent blacking out the text in the middle */}
            <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-slate-950 to-transparent pointer-events-none z-10" />
            <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none z-10" />

            {/* Reel Screen Window */}
            <div 
              style={{ height: `${ITEM_HEIGHT}px` }} 
              className="relative w-full overflow-hidden bg-slate-950 rounded-lg"
            >
              {/* Spinning Reel Cylinder */}
              <motion.div
                style={{ y }}
                className="absolute top-0 left-0 right-0 flex flex-col items-center"
              >
                {rollingThemes.map((theme, index) => (
                  <div
                    key={index}
                    style={{ 
                      height: `${ITEM_HEIGHT}px`,
                      filter: blurAmount > 0.1 ? `blur(${blurAmount}px)` : 'none'
                    }}
                    className="w-full flex items-center justify-center px-6 text-center select-none"
                  >
                    <span 
                      className={`font-black uppercase tracking-wide transition-all duration-75 block truncate text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] ${
                        isTVMode 
                          ? 'text-xl md:text-2xl' 
                          : 'text-sm md:text-base'
                      }`}
                    >
                      {theme}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Pull / Spin Instructions banner */}
          <div className="w-full text-center mt-3 mb-1 min-h-6">
            {winner ? (
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-[11px] text-amber-200 font-extrabold uppercase tracking-widest flex items-center justify-center gap-1"
              >
                <Trophy className="w-3.5 h-3.5 fill-amber-300 text-amber-400" />
                Tema Sorteado com Sucesso! 🎉
              </motion.div>
            ) : isSpinning ? (
              <span className="text-[11px] text-slate-100 font-bold uppercase tracking-wider animate-pulse">
                Girando os tambores... 🎰
              </span>
            ) : (
              <span className="text-[10px] text-amber-100/90 font-semibold uppercase tracking-wider">
                Puxe a alavanca ou aperte o botão abaixo
              </span>
            )}
          </div>

          {/* Glowing Tactile Push Button */}
          <button
            id="btn-slot-spin"
            onClick={spin}
            disabled={isSpinning}
            className={`w-full py-4.5 px-6 rounded-2xl text-white font-black tracking-wider uppercase transition-all duration-100 flex items-center justify-center gap-2 shadow-lg border-b-6 active:border-b-0 cursor-pointer select-none ${
              isSpinning
                ? 'bg-slate-600 border-slate-700 border-b-0 translate-y-1.5 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-indigo-600 hover:bg-indigo-500 border-indigo-800 active:translate-y-1.5'
            } ${isTVMode ? 'text-lg py-5' : 'text-sm'}`}
          >
            <Shuffle className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
            {isSpinning ? 'Sorteando...' : 'ALAVANCA: SORTEAR TEMA!'}
          </button>
        </div>
      </div>
    </div>
  );
};
