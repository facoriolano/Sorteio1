import React from 'react';
import { motion } from 'motion/react';
import { Award, RefreshCw, Shuffle, Star, CheckCircle, Flame, Trophy, Play, Home } from 'lucide-react';

interface ThemeCompleteProps {
  themeName: string;
  scoreCorrect: number;
  scoreIncorrect: number;
  maxStreak: number;
  onRestartTheme: () => void;
  onGoToRaffle: () => void;
  isTVMode: boolean;
}

export const ThemeComplete: React.FC<ThemeCompleteProps> = ({
  themeName,
  scoreCorrect,
  scoreIncorrect,
  maxStreak,
  onRestartTheme,
  onGoToRaffle,
  isTVMode,
}) => {
  const total = scoreCorrect + scoreIncorrect;
  const accuracy = total > 0 ? Math.round((scoreCorrect / total) * 100) : 0;

  // Choose medal and title based on performance
  let badgeTitle = 'Participante da Fé';
  let badgeColor = 'from-amber-400 to-amber-600 text-amber-950';
  let desc = 'Continue estudando e crescendo na palavra de Deus!';
  let TrophyIcon = Star;

  if (accuracy === 100) {
    badgeTitle = 'Mestre Sábio da Fé';
    badgeColor = 'from-yellow-300 via-amber-400 to-yellow-500 text-amber-950';
    desc = 'Incrível! Aproveitamento perfeito! O Espírito Santo está te guiando.';
    TrophyIcon = Trophy;
  } else if (accuracy >= 80) {
    badgeTitle = 'Discípulo Zeloso';
    badgeColor = 'from-slate-300 via-slate-100 to-slate-400 text-slate-800';
    desc = 'Excelente desempenho! Você está muito bem preparado.';
    TrophyIcon = Award;
  } else if (accuracy >= 50) {
    badgeTitle = 'Buscador da Verdade';
    badgeColor = 'from-amber-600 to-amber-800 text-white';
    desc = 'Bom progresso! Faça mais uma leitura e tente novamente.';
    TrophyIcon = CheckCircle;
  }

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-[40px] shadow-sm overflow-hidden border-2 border-b-8 border-slate-200 p-8 text-center flex flex-col justify-between min-h-[75vh]">
      
      {/* Celebration Header */}
      <div>
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: [1.2, 1], rotate: 0 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center shadow-md shadow-amber-300/40 mb-6 border-2 border-b-4 border-amber-700"
        >
          <TrophyIcon className="w-12 h-12 text-white animate-bounce" style={{ animationDuration: '2.5s' }} />
        </motion.div>

        <h2 className={`font-black text-slate-800 tracking-tight leading-tight ${isTVMode ? 'text-4xl' : 'text-3xl'}`}>
          Tema Concluído! 🥳
        </h2>
        
        <p className="text-slate-500 font-bold mt-2 uppercase tracking-wide bg-indigo-50 text-indigo-700 inline-block px-4 py-1.5 rounded-full text-xs border border-indigo-100">
          {themeName}
        </p>

        <p className="text-slate-600 font-medium text-sm max-w-md mx-auto mt-4 leading-relaxed">
          {desc}
        </p>
      </div>

      {/* Stats Display Block */}
      <div className="my-8 grid grid-cols-3 gap-3.5">
        
        {/* Stat 1: Accuracy */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-emerald-50 border-2 border-b-4 border-emerald-200 rounded-2xl p-4 flex flex-col justify-center items-center shadow-sm"
        >
          <span className="text-xs font-black text-emerald-800 uppercase tracking-wide">Acertos</span>
          <span className="text-3xl font-black text-emerald-600 mt-1">{scoreCorrect}</span>
          <span className="text-[10px] text-emerald-700 font-bold mt-0.5">de {total} questões</span>
        </motion.div>

        {/* Stat 2: Precision */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-indigo-50 border-2 border-b-4 border-indigo-200 rounded-2xl p-4 flex flex-col justify-center items-center shadow-sm"
        >
          <span className="text-xs font-black text-indigo-800 uppercase tracking-wide">Aproveito</span>
          <span className="text-3xl font-black text-indigo-600 mt-1">{accuracy}%</span>
          <span className="text-[10px] text-indigo-700 font-bold mt-0.5">de precisão</span>
        </motion.div>

        {/* Stat 3: Combo/Streak */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-amber-50 border-2 border-b-4 border-amber-200 rounded-2xl p-4 flex flex-col justify-center items-center shadow-sm"
        >
          <span className="text-xs font-black text-amber-800 uppercase tracking-wide">Combo Máx</span>
          <span className="text-3xl font-black text-amber-600 mt-1 flex items-center justify-center gap-1">
            <Flame className="w-6 h-6 text-amber-500 fill-amber-400" />
            {maxStreak}
          </span>
          <span className="text-[10px] text-amber-700 font-bold mt-0.5">seguidas</span>
        </motion.div>

      </div>

      {/* Achievement Tag */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className={`bg-gradient-to-r ${badgeColor} py-4 px-6 rounded-2xl shadow-md border-b-4 border-black/15 flex flex-col items-center justify-center`}
      >
        <span className="text-[10px] uppercase font-black tracking-widest opacity-80">Você Conquistou o Título:</span>
        <span className="text-xl font-black uppercase mt-1 tracking-wider">{badgeTitle}</span>
      </motion.div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col gap-3">
        
        {/* Draw Another Theme */}
        <button
          id="btn-concluir-sortear"
          onClick={onGoToRaffle}
          className={`w-full py-4 rounded-2xl text-white font-black tracking-wider uppercase transition-all flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 border-b-6 border-indigo-800 active:border-b-0 active:translate-y-1 shadow-md cursor-pointer ${
            isTVMode ? 'text-xl py-5' : 'text-base'
          }`}
        >
          <Shuffle className="w-5 h-5" />
          SORTEAR OUTRO TEMA
        </button>

        {/* Restart/Repeat same Theme */}
        <button
          id="btn-concluir-repetir"
          onClick={onRestartTheme}
          className={`w-full py-4 rounded-2xl text-slate-700 font-black tracking-wider uppercase transition-all flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 border-2 border-slate-200 hover:border-slate-300 border-b-6 border-b-slate-300 active:border-b-0 active:translate-y-1 shadow-sm cursor-pointer ${
            isTVMode ? 'text-lg py-4' : 'text-sm'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          REPETIR ESTE TEMA
        </button>

      </div>

    </div>
  );
};
