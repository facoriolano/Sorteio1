import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, 
  VolumeX, 
  Tv, 
  Shuffle, 
  Flame, 
  Star, 
  Sparkles, 
  BookOpen, 
  Layers, 
  CheckCircle2, 
  CloudLightning, 
  RefreshCw, 
  RotateCcw,
  Award, 
  HelpCircle,
  Clock,
  Play
} from 'lucide-react';
import { Question } from './types';
import { fallbackQuestions } from './data/fallbackQuestions';
import { AudioEngine } from './components/AudioEngine';
import { ThemeSlotMachine } from './components/ThemeSlotMachine';
import { QuizCard } from './components/QuizCard';
import { ThemeComplete } from './components/ThemeComplete';

// Custom lightweight robust CSV parser
function parseCSV(text: string): string[][] {
  const lines: string[][] = [];
  let row: string[] = [];
  let inQuotes = false;
  let currentField = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          currentField += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        row.push(currentField);
        currentField = '';
      } else if (char === '\r' || char === '\n') {
        row.push(currentField);
        currentField = '';
        if (row.length > 1 || (row.length === 1 && row[0] !== '')) {
          lines.push(row);
        }
        row = [];
        if (char === '\r' && nextChar === '\n') {
          i++;
        }
      } else {
        currentField += char;
      }
    }
  }
  if (currentField || row.length > 0) {
    row.push(currentField);
    lines.push(row);
  }
  return lines;
}

// Fisher-Yates Shuffle helper
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function App() {
  // Global configuration
  const [isTVMode, setIsTVMode] = useState<boolean>(false);
  const [muted, setMuted] = useState<boolean>(false);

  // Loaded questions state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [isFetchedFromGoogle, setIsFetchedFromGoogle] = useState<boolean>(false);

  // Active Quiz game states
  const [currentTheme, setCurrentTheme] = useState<string | null>(null);
  const [themeQuestions, setThemeQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOptionLetter, setSelectedOptionLetter] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Statistics & History
  const [score, setScore] = useState({
    correct: 0,
    incorrect: 0,
    streak: 0,
    maxStreak: 0,
  });

  // Unique themes list derived from questions
  const [uniqueThemes, setUniqueThemes] = useState<string[]>([]);
  
  const [themeCompletionHistory, setThemeCompletionHistory] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('theme_completion_history');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Keep track of active theme question sequences & current question indexes
  const [themesProgress, setThemesProgress] = useState<Record<string, {
    questions: Question[];
    currentIndex: number;
    correct: number;
    incorrect: number;
  }>>(() => {
    try {
      const saved = localStorage.getItem('themes_progress');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Sync completion history with localStorage
  useEffect(() => {
    localStorage.setItem('theme_completion_history', JSON.stringify(themeCompletionHistory));
  }, [themeCompletionHistory]);

  // Sync active themes progress with localStorage
  useEffect(() => {
    localStorage.setItem('themes_progress', JSON.stringify(themesProgress));
  }, [themesProgress]);

  // Calculate total correct answers in real-time across completed and in-progress themes
  const totalCorrectAnswers = uniqueThemes.reduce((sum, theme) => {
    const completed = themeCompletionHistory[theme] || 0;
    const inProgress = themesProgress[theme]?.correct || 0;
    return sum + Math.max(completed, inProgress);
  }, 0);

  // Active home tab ('raffle' for Slot Machine, 'list' for Selecting Theme)
  const [activeTab, setActiveTab] = useState<'raffle' | 'list'>('raffle');

  // Reset confirmation state for global reset button
  const [confirmingResetAll, setConfirmingResetAll] = useState(false);

  // Reset single theme progress & completion status
  const handleResetThemeProgress = (theme: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering startQuizForTheme(theme)
    
    setThemeCompletionHistory((prev) => {
      const updated = { ...prev };
      delete updated[theme];
      return updated;
    });

    setThemesProgress((prev) => {
      const updated = { ...prev };
      delete updated[theme];
      return updated;
    });

    AudioEngine.playSuccess();
  };

  // Reset entire app history & progress with double click protection
  const handleResetAllProgress = () => {
    if (!confirmingResetAll) {
      setConfirmingResetAll(true);
      // Automatically reset confirmation text back to default if not clicked again within 4s
      setTimeout(() => {
        setConfirmingResetAll(false);
      }, 4000);
      return;
    }

    setThemeCompletionHistory({});
    setThemesProgress({});
    setConfirmingResetAll(false);
    AudioEngine.playSuccess();
  };

  // Real-time Clock for Smart TV mode
  const [timeStr, setTimeStr] = useState<string>('');

  // Clock ticks
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync mute state with AudioEngine
  useEffect(() => {
    AudioEngine.setMuted(muted);
  }, [muted]);

  // Load questions on mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        // public csv export link
        const response = await fetch(
          'https://docs.google.com/spreadsheets/d/1d33ye_CCRwWALNqQj2otSOlcSTJCDf-rsoVwoOf2ffs/export?format=csv'
        );
        if (!response.ok) {
          throw new Error('Falha ao baixar planilha do Google Sheets');
        }
        
        const text = await response.text();
        const rows = parseCSV(text);
        
        if (rows.length < 2) {
          throw new Error('Planilha vazia ou com formato inválido');
        }

        const loadedQuestions: Question[] = [];
        let activeTheme = '';

        // Index 0 headers: TEMA, Pergunta, Opção A, Opção B, Opção C, Opção D, Gabarito
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (!row || row.length < 7) continue;

          const themeVal = row[0]?.trim();
          const questionText = row[1]?.trim();
          
          if (!questionText) continue; // skip empty rows
          
          if (themeVal) {
            activeTheme = themeVal;
          }

          const optionA = row[2]?.trim() || '';
          const optionB = row[3]?.trim() || '';
          const optionC = row[4]?.trim() || '';
          const optionD = row[5]?.trim() || '';
          const gabarito = row[6]?.trim() || '';

          const options = [
            { letter: 'A' as const, text: optionA },
            { letter: 'B' as const, text: optionB },
            { letter: 'C' as const, text: optionC },
            { letter: 'D' as const, text: optionD },
          ];

          // Locate correct answer letter
          let correctLetter: 'A' | 'B' | 'C' | 'D' = 'A';
          const matchIndex = options.findIndex(
            (opt) => opt.text.toLowerCase() === gabarito.toLowerCase()
          );
          if (matchIndex !== -1) {
            correctLetter = options[matchIndex].letter;
          } else {
            // Partial match fallback
            const partialIndex = options.findIndex(
              (opt) =>
                opt.text.toLowerCase().includes(gabarito.toLowerCase()) ||
                gabarito.toLowerCase().includes(opt.text.toLowerCase())
            );
            if (partialIndex !== -1) {
              correctLetter = options[partialIndex].letter;
            }
          }

          loadedQuestions.push({
            id: `g_${i}`,
            theme: activeTheme || 'GERAL',
            questionText,
            options,
            correctAnswerText: gabarito,
            correctLetter,
          });
        }

        if (loadedQuestions.length > 0) {
          setQuestions(loadedQuestions);
          setIsFetchedFromGoogle(true);
        } else {
          throw new Error('Nenhuma questão válida pôde ser importada');
        }
      } catch (err: any) {
        console.warn('Google sheets fetch failed, falling back to local database:', err);
        setLoadingError(err.message || 'Erro de conexão');
        setQuestions(fallbackQuestions);
        setIsFetchedFromGoogle(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Compute unique themes list once questions are loaded
  useEffect(() => {
    if (questions.length > 0) {
      const themesMap: Record<string, number> = {};
      questions.forEach((q) => {
        themesMap[q.theme] = (themesMap[q.theme] || 0) + 1;
      });
      // Filter out any blank theme names just in case
      const themesList = Object.keys(themesMap).filter((t) => t !== '');
      setUniqueThemes(themesList);
    }
  }, [questions]);

  // Start quiz for a specific theme
  const startQuizForTheme = (theme: string) => {
    // Filter questions belonging to this theme
    const filtered = questions.filter((q) => q.theme === theme);
    if (filtered.length === 0) return;

    let themeState = themesProgress[theme];

    // If there is no previous progress OR if the theme was fully completed, initialize a new progress
    if (!themeState || themeState.currentIndex >= themeState.questions.length) {
      const shuffled = shuffleArray(filtered);
      themeState = {
        questions: shuffled,
        currentIndex: 0,
        correct: 0,
        incorrect: 0,
      };
      setThemesProgress((prev) => ({
        ...prev,
        [theme]: themeState,
      }));
    }

    setThemeQuestions(themeState.questions);
    setCurrentTheme(theme);
    setCurrentQuestionIndex(themeState.currentIndex);
    setSelectedOptionLetter(null);
    setIsConfirmed(false);
    setIsFinished(false);

    // Sync score metrics with theme progress
    setScore((prev) => ({
      correct: themeState.correct,
      incorrect: themeState.incorrect,
      streak: prev.streak, // keep session streak active
      maxStreak: prev.maxStreak,
    }));
  };

  // Handle select option
  const handleSelectOption = (letter: 'A' | 'B' | 'C' | 'D') => {
    if (isConfirmed) return;
    setSelectedOptionLetter(letter);
    AudioEngine.playTick();
  };

  // Lock and confirm the answer
  const handleConfirmAnswer = () => {
    if (!selectedOptionLetter || isConfirmed) return;

    const currentQuestion = themeQuestions[currentQuestionIndex];
    const isCorrect = selectedOptionLetter === currentQuestion.correctLetter;

    let correctInc = 0;
    let incorrectInc = 0;

    if (isCorrect) {
      AudioEngine.playSuccess();
      correctInc = 1;
      setScore((prev) => {
        const nextStreak = prev.streak + 1;
        return {
          ...prev,
          correct: prev.correct + 1,
          streak: nextStreak,
          maxStreak: Math.max(prev.maxStreak, nextStreak),
        };
      });
    } else {
      AudioEngine.playError();
      incorrectInc = 1;
      setScore((prev) => ({
        ...prev,
        incorrect: prev.incorrect + 1,
        streak: 0,
      }));
    }

    // Save answer to theme progress
    if (currentTheme) {
      setThemesProgress((prev) => {
        const currentProgress = prev[currentTheme];
        if (!currentProgress) return prev;

        return {
          ...prev,
          [currentTheme]: {
            ...currentProgress,
            currentIndex: currentProgress.currentIndex + 1,
            correct: currentProgress.correct + correctInc,
            incorrect: currentProgress.incorrect + incorrectInc,
          },
        };
      });
    }

    setIsConfirmed(true);
  };

  // Proceed to next question or complete theme
  const handleNextQuestion = () => {
    if (!currentTheme) return;

    const progress = themesProgress[currentTheme];
    
    // Check if there are more questions left in the theme
    if (progress && progress.currentIndex < progress.questions.length) {
      // Go back to the raffle/theme selection screen immediately!
      setCurrentTheme(null);
      setThemeQuestions([]);
      setSelectedOptionLetter(null);
      setIsConfirmed(false);
    } else {
      // Completed the active theme!
      setIsFinished(true);
      AudioEngine.playLevelComplete();

      // Record completion history and high scores
      setThemeCompletionHistory((prev) => ({
        ...prev,
        [currentTheme]: Math.max(prev[currentTheme] || 0, progress ? progress.correct : score.correct),
      }));
    }
  };

  // Reset theme state to play again
  const handleRestartTheme = () => {
    if (currentTheme) {
      // Clear progress so startQuizForTheme will generate a fresh shuffle
      setThemesProgress((prev) => {
        const updated = { ...prev };
        delete updated[currentTheme];
        return updated;
      });
      // Small timeout to ensure state propagation before starting
      setTimeout(() => {
        startQuizForTheme(currentTheme);
      }, 50);
    }
  };

  // Exit back to raffle page
  const handleExitToRaffle = () => {
    setCurrentTheme(null);
    setThemeQuestions([]);
    setIsFinished(false);
  };

  // Theme card color generator
  const getThemeColorClass = (index: number) => {
    const gradients = [
      'from-amber-400 to-orange-500 shadow-orange-100 border-orange-200 text-orange-950',
      'from-emerald-400 to-teal-500 shadow-teal-100 border-teal-200 text-teal-950',
      'from-blue-400 to-indigo-500 shadow-indigo-100 border-indigo-200 text-indigo-950',
      'from-rose-400 to-pink-500 shadow-pink-100 border-pink-200 text-pink-950',
      'from-violet-400 to-purple-500 shadow-purple-100 border-purple-200 text-purple-950',
      'from-yellow-400 to-amber-500 shadow-amber-100 border-amber-200 text-amber-950',
    ];
    return gradients[index % gradients.length];
  };

  // App loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 text-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
          transition={{ repeat: Infinity, duration: 2.2 }}
          className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
        >
          <Flame className="w-8 h-8 text-white fill-white" />
        </motion.div>
        <h2 className="text-2xl font-black text-slate-800 mt-6 tracking-tight">Carregando Perguntas Sagradas...</h2>
        <p className="text-slate-500 text-sm mt-2 max-w-xs leading-relaxed font-semibold animate-pulse">
          Sincronizando com o Google Sheets de Crisma...
        </p>
      </div>
    );
  }

  const currentQuestion = themeQuestions[currentQuestionIndex];

  return (
    <div className={`min-h-screen transition-all ${isTVMode ? 'bg-slate-900 tv-mode' : 'bg-slate-50'} flex flex-col justify-between`}>
      
      {/* Header Bar */}
      <header className={`py-4 px-6 border-b transition-all ${
        isTVMode 
          ? 'bg-slate-800 border-slate-700 text-white' 
          : 'bg-white border-slate-100 text-slate-800 shadow-sm'
      }`}>
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={handleExitToRaffle}>
            <div className="bg-gradient-to-tr from-amber-500 to-red-500 text-white p-2.5 rounded-xl shadow-md shadow-amber-500/20">
              <Flame className="w-6 h-6 fill-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight leading-none">Quiz da Crisma</h1>
              <p className={`text-[10px] uppercase tracking-wider mt-0.5 font-black ${isTVMode ? 'text-amber-400' : 'text-slate-400'}`}>
                Caminho da Confirmação 🔥
              </p>
            </div>
          </div>

          {/* Quick status bar */}
          <div className="flex items-center gap-3">
            {/* Database status pill */}
            <div className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border hidden sm:inline-flex items-center gap-1 ${
              isFetchedFromGoogle
                ? isTVMode 
                  ? 'bg-emerald-950/40 border-emerald-800 text-emerald-400'
                  : 'bg-emerald-50 border-emerald-100 text-emerald-700'
                : isTVMode
                  ? 'bg-amber-950/40 border-amber-800 text-amber-400'
                  : 'bg-amber-50 border-amber-100 text-amber-700'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${isFetchedFromGoogle ? 'bg-emerald-500' : 'bg-amber-500'} animate-ping`} />
              <span>{isFetchedFromGoogle ? 'Sheets Online' : 'Offline Cache'}</span>
            </div>

            {/* Smart TV Clock */}
            {isTVMode && (
              <div className="flex items-center gap-1.5 bg-slate-700/60 text-slate-200 px-3 py-1 rounded-xl text-xs font-black border border-slate-600/50">
                <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>{timeStr}</span>
              </div>
            )}

            {/* Utility buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setIsTVMode(!isTVMode)}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  isTVMode
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200/60'
                }`}
                title="Modo TV Smart (Fontes grandes para espelhar)"
              >
                <Tv className="w-4 h-4" />
              </button>

              <button
                onClick={() => setMuted(!muted)}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  muted
                    ? isTVMode
                      ? 'bg-rose-950/40 border-rose-900 text-rose-400'
                      : 'bg-rose-50 border-rose-100 text-rose-500 shadow-sm'
                    : isTVMode
                      ? 'bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600'
                      : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {!currentTheme ? (
            // SCREEN 1: Home page (Bento Grid layout)
            <motion.div
              key="raffle-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch"
            >


              {/* BENTO CARD 2: Unified Interactive Hub (Slot Machine + Manual Selector Segmented Tabs) */}
              <div className={`md:col-span-12 p-6 md:p-8 rounded-[40px] border-2 border-b-6 flex flex-col transition-all ${
                isTVMode 
                  ? 'bg-slate-800 border-slate-700 border-b-slate-950 text-white' 
                  : 'bg-white border-slate-200/80 border-b-slate-300 text-slate-800 shadow-sm'
              }`}>
                {/* Modern Segmented Tab Switcher */}
                <div className="flex justify-center mb-6">
                  <div className={`p-1.5 rounded-2xl border-2 flex items-center gap-1.5 ${
                    isTVMode ? 'bg-slate-900 border-slate-700/60' : 'bg-[#F0F2F5]/80 border-slate-200/50'
                  }`}>
                    <button
                      onClick={() => {
                        setActiveTab('raffle');
                        AudioEngine.playTick();
                      }}
                      className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer select-none active:scale-95 ${
                        activeTab === 'raffle'
                          ? 'bg-indigo-600 text-white shadow-md border-b-4 border-indigo-800'
                          : isTVMode
                            ? 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                            : 'text-slate-600 hover:bg-slate-200/60'
                      }`}
                    >
                      🎰 Sorteador Caça-Níqueis
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('list');
                        AudioEngine.playTick();
                      }}
                      className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer select-none active:scale-95 ${
                        activeTab === 'list'
                          ? 'bg-indigo-600 text-white shadow-md border-b-4 border-indigo-800'
                          : isTVMode
                            ? 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                            : 'text-slate-600 hover:bg-slate-200/60'
                      }`}
                    >
                      📚 Selecionar um Tema
                    </button>
                  </div>
                </div>

                {/* Tab Contents */}
                <AnimatePresence mode="wait">
                  {activeTab === 'raffle' ? (
                    <motion.div
                      key="slot-machine-tab"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="w-full flex flex-col items-center justify-center py-2"
                    >
                      <div className="w-full max-w-md">
                        <ThemeSlotMachine
                          themes={uniqueThemes}
                          onThemeSelected={startQuizForTheme}
                          isTVMode={isTVMode}
                          muted={muted}
                          onToggleMute={() => setMuted(!muted)}
                          onToggleTV={() => setIsTVMode(!isTVMode)}
                          totalCorrectAnswers={totalCorrectAnswers}
                        />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="theme-list-tab"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="space-y-4 w-full"
                    >
                      <div className="flex justify-between items-center pb-2 border-b border-dashed border-slate-200">
                        <h3 className="text-sm font-black tracking-tight uppercase flex items-center gap-2">
                          <Layers className="w-4 h-4 text-indigo-500 shrink-0" />
                          Todos os Temas da Catequese
                        </h3>
                        <span className="text-xs font-black px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100 shrink-0 font-mono">
                          {uniqueThemes.length} TEMAS DISPONÍVEIS
                        </span>
                      </div>

                      {/* Clean 3-column responsive grid on large screens, scrollable */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[440px] overflow-y-auto pr-1.5 custom-scrollbar">
                        {uniqueThemes.map((theme, idx) => {
                          const played = themeCompletionHistory[theme] !== undefined;
                          const highScore = themeCompletionHistory[theme] || 0;
                          const totalQuestionsCount = questions.filter((q) => q.theme === theme).length;
                          const progress = themesProgress[theme];
                          const currentProgressIdx = progress ? progress.currentIndex : 0;
                          const hasActiveProgress = progress && currentProgressIdx > 0 && currentProgressIdx < totalQuestionsCount;

                          return (
                            <div
                              key={theme}
                              onClick={() => startQuizForTheme(theme)}
                              className={`p-3.5 rounded-2xl border text-left flex justify-between items-center group transition-all duration-150 border-b-4 hover:translate-y-[1px] hover:border-b-2 active:translate-y-[3px] active:border-b-0 cursor-pointer select-none ${
                                isTVMode
                                  ? 'bg-slate-900/60 hover:bg-slate-700/80 border-slate-700 text-white active:bg-slate-700 border-b-slate-950'
                                  : 'bg-white hover:bg-slate-50 border-slate-200 active:bg-slate-100 shadow-sm border-b-slate-300/80'
                              }`}
                            >
                              <div className="flex items-center gap-3 truncate">
                                <span className={`w-8 h-8 rounded-lg font-black text-xs flex items-center justify-center shrink-0 bg-gradient-to-tr ${getThemeColorClass(idx)}`}>
                                  {idx + 1}
                                </span>
                                <div className="truncate">
                                  <span className="font-extrabold text-xs block leading-tight truncate group-hover:text-indigo-600 transition-colors uppercase">
                                    {theme}
                                  </span>
                                  {hasActiveProgress ? (
                                    <span className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 block animate-pulse">
                                      Questão {currentProgressIdx + 1} de {totalQuestionsCount}
                                    </span>
                                  ) : (
                                    <span className={`text-[9px] font-bold ${isTVMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                      {totalQuestionsCount} questões
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0 pl-1">
                                {/* Individual Reset Theme Action */}
                                {(played || hasActiveProgress) && (
                                  <button
                                    title="Recomeçar este tema"
                                    onClick={(e) => handleResetThemeProgress(theme, e)}
                                    className={`p-1.5 rounded-full transition-all hover:scale-115 active:scale-90 ${
                                      isTVMode
                                        ? 'hover:bg-slate-700 text-slate-400 hover:text-rose-400'
                                        : 'hover:bg-rose-50 text-slate-400 hover:text-rose-600'
                                    }`}
                                  >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                  </button>
                                )}

                                {/* Completed Indicator Badge */}
                                {played ? (
                                  <div className="flex flex-col items-end shrink-0">
                                    <span className="text-emerald-500 font-extrabold text-[9px] flex items-center gap-0.5">
                                      <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-100" />
                                      Concluído
                                    </span>
                                    <span className="text-[8px] text-slate-400 font-bold">Recorde: {highScore}</span>
                                  </div>
                                ) : (
                                  <Play className="w-3.5 h-3.5 text-[#1CB0F6] group-hover:text-indigo-500 group-hover:scale-110 transition-all shrink-0" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="text-[10px] text-slate-400 font-bold pt-2 border-t border-slate-100 flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        <span>Clique em qualquer cartão de tema para iniciar o quiz ou continuar o seu progresso anterior de onde parou.</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* BENTO CARD 4: Study Achievements Metrics & Progress (Spans 12 columns if completed, otherwise a beautiful interactive encouragement bento section) */}
              <div className={`md:col-span-12 p-6 rounded-[40px] border-2 border-b-6 transition-all ${
                isTVMode 
                  ? 'bg-slate-800 border-slate-700 border-b-slate-950 text-white' 
                  : 'bg-white border-slate-200/80 border-b-slate-300 text-slate-800 shadow-sm'
              }`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-dashed border-slate-200">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-1.5">
                      <Award className="w-5 h-5 text-[#58CC02]" />
                      Painel de Progresso & Medalhas
                    </h3>
                    <p className="text-xs text-slate-500 font-bold mt-0.5">Veja sua evolução rumo à confirmação cristã.</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5 self-stretch md:self-auto justify-between md:justify-start">
                    {/* Reset All Progress Button with Click Protection */}
                    <button
                      onClick={handleResetAllProgress}
                      className={`text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full border-2 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer select-none ${
                        confirmingResetAll
                          ? isTVMode
                            ? 'border-rose-500 bg-rose-950/40 text-rose-300 animate-pulse'
                            : 'border-rose-300 bg-rose-100 text-rose-700 animate-pulse'
                          : isTVMode
                            ? 'border-slate-700 hover:border-rose-600 bg-slate-900/40 text-slate-400 hover:text-rose-500'
                            : 'border-slate-200 hover:border-rose-200 bg-white text-slate-500 hover:text-rose-600 hover:bg-rose-50/50 shadow-sm'
                      }`}
                    >
                      <RotateCcw className={`w-3.5 h-3.5 ${confirmingResetAll ? 'animate-spin' : ''}`} />
                      {confirmingResetAll ? 'Certeza? Clique de Novo! ⚠️' : 'Zerar Progresso'}
                    </button>

                    <span className="text-xs font-extrabold font-mono bg-[#58CC02]/10 text-[#46A302] border border-[#58CC02]/20 px-3 py-1 rounded-full shrink-0">
                      STATUS: EM DIA 🔥
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {/* Metric Block 1 */}
                  <div className={`p-4 rounded-2xl border-2 ${isTVMode ? 'bg-slate-900/40 border-slate-700/60' : 'bg-[#F0F2F5]/60 border-slate-100'}`}>
                    <span className="text-[9px] font-black uppercase tracking-wider block text-slate-400 mb-1">TEMAS CONCLUÍDOS</span>
                    <span className="text-2xl font-black text-indigo-600">
                      {Object.keys(themeCompletionHistory).length} <span className="text-sm font-bold text-slate-400">/ {uniqueThemes.length}</span>
                    </span>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-2 border border-slate-300/30">
                      <div className="bg-[#58CC02] h-full rounded-full" style={{ width: `${(Object.keys(themeCompletionHistory).length / Math.max(1, uniqueThemes.length)) * 100}%` }} />
                    </div>
                  </div>

                  {/* Metric Block 2 */}
                  <div className={`p-4 rounded-2xl border-2 ${isTVMode ? 'bg-slate-900/40 border-slate-700/60' : 'bg-[#F0F2F5]/60 border-slate-100'}`}>
                    <span className="text-[9px] font-black uppercase tracking-wider block text-slate-400 mb-1">TOTAL DE ACERTOS</span>
                    <span className="text-2xl font-black text-emerald-600">
                      {totalCorrectAnswers} <span className="text-xs font-bold text-slate-400">respostas</span>
                    </span>
                    <span className="text-[10px] text-emerald-500 font-black block mt-1.5">✓ 100% de dedicação</span>
                  </div>

                  {/* Metric Block 3 */}
                  <div className={`p-4 rounded-2xl border-2 ${isTVMode ? 'bg-slate-900/40 border-slate-700/60' : 'bg-[#F0F2F5]/60 border-slate-100'}`}>
                    <span className="text-[9px] font-black uppercase tracking-wider block text-slate-400 mb-1">NÍVEL DE PREPARAÇÃO</span>
                    <span className="text-2xl font-black text-[#1CB0F6]">
                      {Math.min(100, Math.round((Object.keys(themeCompletionHistory).length / Math.max(1, uniqueThemes.length)) * 100))}%
                    </span>
                    <span className="text-[10px] text-[#1899D6] font-black block mt-1.5">
                      {Object.keys(themeCompletionHistory).length === uniqueThemes.length ? 'Pronto para Confirmar! 🛡️' : 'Continue estudando! 📖'}
                    </span>
                  </div>

                  {/* Metric Block 4 */}
                  <div className={`p-4 rounded-2xl border-2 ${isTVMode ? 'bg-slate-900/40 border-slate-700/60' : 'bg-[#F0F2F5]/60 border-slate-100'}`}>
                    <span className="text-[9px] font-black uppercase tracking-wider block text-slate-400 mb-1">DISPOSITIVO ATUAL</span>
                    <span className="text-xl font-black text-amber-500 flex items-center gap-1.5 mt-0.5">
                      {isTVMode ? <Tv className="w-5 h-5 shrink-0" /> : <BookOpen className="w-5 h-5 shrink-0" />}
                      {isTVMode ? 'Modo TV Ativo' : 'Modo Pessoal'}
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold block mt-1.5">Configure no menu superior</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : isFinished ? (
            // SCREEN 3: Theme complete metrics & celebration screen
            <motion.div
              key="complete-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <ThemeComplete
                themeName={currentTheme}
                scoreCorrect={score.correct}
                scoreIncorrect={score.incorrect}
                maxStreak={score.maxStreak}
                onRestartTheme={handleRestartTheme}
                onGoToRaffle={handleExitToRaffle}
                isTVMode={isTVMode}
              />
            </motion.div>
          ) : (
            // SCREEN 2: Active quiz question panel
            <motion.div
              key="quiz-view"
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
            >
              <QuizCard
                question={currentQuestion}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={themeQuestions.length}
                selectedOption={selectedOptionLetter}
                isConfirmed={isConfirmed}
                onSelectOption={handleSelectOption}
                onConfirm={handleConfirmAnswer}
                onNext={handleNextQuestion}
                isTVMode={isTVMode}
                streak={score.streak}
                scoreCorrect={score.correct}
                scoreIncorrect={score.incorrect}
                muted={muted}
                onToggleMute={() => setMuted(!muted)}
                onExit={handleExitToRaffle}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer credits and information */}
      <footer className={`py-4 px-6 text-center text-xs font-semibold ${
        isTVMode ? 'bg-slate-800 text-slate-500 border-t border-slate-700' : 'bg-white text-slate-400 border-t border-slate-100'
      }`}>
        <p>Quiz da Crisma • Desenvolvido com amor para a educação cristã de jovens.</p>
        <p className="mt-1 opacity-75">
          Perguntas sincronizadas em tempo real via planilha Google Sheets.
        </p>
      </footer>

    </div>
  );
}
