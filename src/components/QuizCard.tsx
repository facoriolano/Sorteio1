import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, Award, Flame, Star, Volume2, VolumeX, Tv, ArrowRight, CornerDownLeft, Sparkles } from 'lucide-react';
import { Question } from '../types';

interface QuizCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedOption: 'A' | 'B' | 'C' | 'D' | null;
  isConfirmed: boolean;
  onSelectOption: (letter: 'A' | 'B' | 'C' | 'D') => void;
  onConfirm: () => void;
  onNext: () => void;
  isTVMode: boolean;
  streak: number;
  scoreCorrect: number;
  scoreIncorrect: number;
  muted: boolean;
  onToggleMute: () => void;
  onExit: () => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  selectedOption,
  isConfirmed,
  onSelectOption,
  onConfirm,
  onNext,
  isTVMode,
  streak,
  scoreCorrect,
  scoreIncorrect,
  muted,
  onToggleMute,
  onExit,
}) => {
  const percentComplete = (questionNumber / totalQuestions) * 100;

  // Keyboards shortcuts helper
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isConfirmed) {
        if (e.key === 'Enter' || e.key === ' ') {
          onNext();
        }
        return;
      }

      if (e.key.toLowerCase() === 'a') onSelectOption('A');
      if (e.key.toLowerCase() === 'b') onSelectOption('B');
      if (e.key.toLowerCase() === 'c') onSelectOption('C');
      if (e.key.toLowerCase() === 'd') onSelectOption('D');

      if (e.key === 'Enter' && selectedOption) {
        onConfirm();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedOption, isConfirmed, onSelectOption, onConfirm, onNext]);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col h-full min-h-[85vh] justify-between relative bg-white rounded-[40px] shadow-sm overflow-hidden border-2 border-b-8 border-slate-200">
      
      {/* Quiz Header (Progress, Streak & Controls) */}
      <div className="px-6 py-5 bg-slate-50 border-b-2 border-slate-200 flex flex-col gap-3 rounded-t-[38px]">
        <div className="flex justify-between items-center w-full">
          {/* Back to Draw button */}
          <button
            onClick={onExit}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-white border-2 border-slate-200 px-3 py-1.5 rounded-xl transition-all active:translate-y-0.5"
          >
            ← Voltar
          </button>

          {/* Stats Badges */}
          <div className="flex items-center gap-3">
            {/* Streak Indicator */}
            {streak > 0 && (
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: [1.2, 1] }}
                className="flex items-center gap-1 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-black shadow-sm"
              >
                <Flame className="w-4 h-4 fill-white animate-bounce" />
                <span>{streak} COMBO</span>
              </motion.div>
            )}

            {/* Score Stats */}
            <div className="flex gap-2 text-xs font-extrabold bg-slate-200/60 px-2.5 py-1 rounded-xl text-slate-700">
              <span className="text-emerald-600 font-bold">✓ {scoreCorrect}</span>
              <span className="text-slate-300 font-normal">|</span>
              <span className="text-rose-500 font-bold">✗ {scoreIncorrect}</span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={onToggleMute}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-800 transition-all"
            >
              {muted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Theme badge and progress count */}
        <div className="flex justify-between items-center text-xs font-extrabold text-slate-500 uppercase tracking-wider">
          <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg border border-indigo-100 font-bold flex items-center gap-1 max-w-[70%] truncate">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            {question.theme}
          </span>
          <span className="shrink-0 font-bold text-indigo-900">
            Questão {questionNumber} de {totalQuestions}
          </span>
        </div>

        {/* Duolingo style loading/progress bar */}
        <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden border border-slate-300 p-0.5 shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentComplete}%` }}
            transition={{ type: 'spring', stiffness: 80 }}
            className="h-full bg-emerald-500 rounded-full"
          />
        </div>
      </div>

      {/* Question & Options Area */}
      <div className="flex-1 px-6 py-6 md:py-8 flex flex-col justify-center">
        {/* Question Statement */}
        <div className="text-center mb-6 md:mb-8">
          <h3 className={`font-black text-slate-800 tracking-tight leading-snug balance ${
            isTVMode ? 'text-3xl' : 'text-xl md:text-2xl'
          }`}>
            {question.questionText}
          </h3>
        </div>

        {/* 4 Options Grid */}
        <div className="grid grid-cols-1 gap-3.5 md:gap-4 max-w-xl mx-auto w-full">
          {question.options.map((option) => {
            const isSelected = selectedOption === option.letter;
            const isCorrectAnswer = option.text === question.correctAnswerText;
            
            let btnStyle = 'border-slate-200 bg-white border-b-6 text-slate-700 hover:border-slate-300 hover:bg-slate-50';
            let badgeStyle = 'bg-slate-100 text-slate-500 border-slate-300';

            if (isConfirmed) {
              if (isCorrectAnswer) {
                // Highlight the correct answer in green
                btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 border-b-6 shadow-md shadow-emerald-100';
                badgeStyle = 'bg-emerald-500 text-white border-emerald-600';
              } else if (isSelected && !isCorrectAnswer) {
                // Highlight the wrong chosen answer in red
                btnStyle = 'border-rose-500 bg-rose-50 text-rose-900 border-b-6 shadow-md shadow-rose-100';
                badgeStyle = 'bg-rose-500 text-white border-rose-600';
              } else {
                // Unselected and incorrect answers when confirmed
                btnStyle = 'border-slate-150 bg-slate-50 text-slate-400 border-b-2 opacity-50 cursor-not-allowed';
                badgeStyle = 'bg-slate-200 text-slate-400 border-slate-300';
              }
            } else if (isSelected) {
              // Highlight selected option before confirming
              btnStyle = 'border-indigo-500 bg-indigo-50/70 text-indigo-900 border-b-6 shadow-md shadow-indigo-100';
              badgeStyle = 'bg-indigo-600 text-white border-indigo-700';
            }

            return (
              <button
                id={`btn-option-${option.letter}`}
                key={option.letter}
                disabled={isConfirmed}
                onClick={() => onSelectOption(option.letter)}
                className={`w-full text-left p-4 rounded-2xl font-black border-2 transition-all flex items-center gap-4 group cursor-pointer ${btnStyle} ${
                  isTVMode ? 'text-xl py-5' : 'text-sm md:text-base'
                }`}
              >
                {/* Option Badge (A, B, C, D) */}
                <span className={`w-8 h-8 rounded-xl border-b-4 flex items-center justify-center font-black transition-all shrink-0 ${badgeStyle}`}>
                  {option.letter}
                </span>

                {/* Option Text */}
                <span className="flex-1 font-bold leading-normal">{option.text}</span>

                {/* Confirm indicator or visual helper icon */}
                {!isConfirmed && isSelected && (
                  <span className="text-indigo-600 animate-pulse hidden md:inline text-xs font-black">
                    Pressione Enter
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Duolingo-style Feedback Bottom Bar */}
      <div className={`w-full p-6 border-t-2 transition-colors duration-250 rounded-b-[38px] ${
        isConfirmed
          ? selectedOption === question.correctLetter
            ? 'bg-emerald-100 border-emerald-200 text-emerald-950'
            : 'bg-rose-100 border-rose-200 text-rose-950'
          : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="max-w-xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Status Message Left Side */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            <AnimatePresence mode="wait">
              {isConfirmed ? (
                selectedOption === question.correctLetter ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-3.5"
                  >
                    <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-md shadow-emerald-400/40 shrink-0">
                      <Check className="w-7 h-7 stroke-[3.5]" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black leading-none">Excelente! Você acertou! 🎉</h4>
                      <p className="text-xs text-emerald-800 font-semibold mt-1">Resposta correta: {question.correctAnswerText}</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-3.5"
                  >
                    <div className="w-12 h-12 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-md shadow-rose-400/40 shrink-0">
                      <X className="w-7 h-7 stroke-[3.5]" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black leading-none">Ops, resposta errada! 😢</h4>
                      <p className="text-xs text-rose-800 font-semibold mt-1">
                        A resposta certa é: <span className="underline font-black">{question.correctAnswerText}</span>
                      </p>
                    </div>
                  </motion.div>
                )
              ) : (
                <div className="text-slate-500 text-sm font-black flex items-center gap-2">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-500 animate-spin" style={{ animationDuration: '3s' }} />
                  <span>Selecione uma das 4 alternativas para confirmar a resposta.</span>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Button Right Side */}
          <div className="w-full md:w-auto shrink-0 flex flex-col gap-1.5 items-end">
            <button
              id="btn-confirm-next"
              onClick={isConfirmed ? onNext : onConfirm}
              disabled={!selectedOption}
              className={`w-full md:w-44 py-3.5 px-6 rounded-2xl font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer ${
                !selectedOption
                  ? 'bg-slate-200 border-b-0 translate-y-0.5 text-slate-400 cursor-not-allowed'
                  : isConfirmed
                    ? selectedOption === question.correctLetter
                      ? 'bg-emerald-500 hover:bg-emerald-400 border-b-6 border-emerald-700 active:border-b-0 active:translate-y-1 text-white'
                      : 'bg-rose-500 hover:bg-rose-400 border-b-6 border-rose-700 active:border-b-0 active:translate-y-1 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-500 border-b-6 border-indigo-800 active:border-b-0 active:translate-y-1 text-white'
              } ${isTVMode ? 'text-lg py-4 px-8' : 'text-sm'}`}
            >
              <span>{isConfirmed ? 'Continuar' : 'Confirmar'}</span>
              <ArrowRight className="w-4.5 h-4.5 stroke-[3.5]" />
            </button>
            <span className="text-[10px] text-slate-400 font-bold hidden md:inline-flex items-center gap-1">
              Atalho: <CornerDownLeft className="w-3 h-3" /> [Enter]
            </span>
          </div>

        </div>
      </div>

    </div>
  );
};
