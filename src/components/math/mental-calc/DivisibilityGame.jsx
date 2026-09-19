"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const GAME_STATES = {
  MENU: 'MENU',
  PLAYING: 'PLAYING',
  FINISHED: 'FINISHED'
};

export default function DivisibilityGame({ divisor, hint }) {
  const [gameState, setGameState] = useState(GAME_STATES.MENU);
  const [totalQuestions, setTotalQuestions] = useState(10);
  
  // Game Logic State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [num, setNum] = useState(0);
  const [isError, setIsError] = useState(false);
  const [lastInput, setLastInput] = useState(null); // visual feedback for what was pressed
  
  // Timing State
  const [startTime, setStartTime] = useState(0);
  const [lastSplitTime, setLastSplitTime] = useState(0);
  const [splits, setSplits] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);

  // High Scores State
  const [highScores, setHighScores] = useState({ 10: null, 20: null, 30: null });

  const timerRef = useRef(null);
  
  // We don't need a visible input, we just listen to window keydown
  // but to keep mobile working, maybe we provide big YES/NO buttons as well.

  // Load high scores on mount
  useEffect(() => {
    const saved = localStorage.getItem(`mentalCalcDivisibility_${divisor}_Scores`);
    if (saved) {
      setHighScores(JSON.parse(saved));
    }
  }, [divisor]);

  // Timer Loop
  useEffect(() => {
    if (gameState === GAME_STATES.PLAYING) {
      timerRef.current = setInterval(() => {
        setCurrentTime(Date.now());
      }, 50);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  // Keydown listener for the whole window when playing
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (gameState !== GAME_STATES.PLAYING) return;
      
      const key = e.key.toLowerCase();
      let isYes = null;
      
      if (key === 'y' || key === '1' || key === 'arrowright') isYes = true;
      if (key === 'n' || key === '0' || key === 'arrowleft') isYes = false;
      
      if (isYes !== null) {
        submitAnswer(isYes);
      }
    };
    
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [gameState, num, splits, currentQuestionIndex]);

  const generateQuestion = () => {
    // Random 1 to 5 digits (1 to 99999)
    // 1 digit: 1-9
    // 2 digits: 10-99
    // 3 digits: 100-999
    // 4 digits: 1000-9999
    // 5 digits: 10000-99999
    // Let's just generate a random number up to 99999, but ensure a good mix.
    // Actually, to make it fair, let's randomly pick the number of digits first.
    const numDigits = Math.floor(Math.random() * 5) + 1; // 1 to 5
    const min = Math.pow(10, numDigits - 1);
    let max = Math.pow(10, numDigits) - 1;
    if (numDigits === 1) { max = 9; }
    
    // We want roughly 50% chance of being divisible to make the game balanced
    const forceDivisible = Math.random() < 0.5;
    
    let n = Math.floor(Math.random() * (max - min + 1)) + min;
    
    if (forceDivisible) {
      // Find the nearest multiple of divisor
      const rem = n % divisor;
      n = n - rem;
      if (n < min) n += divisor;
    } else {
      if (n % divisor === 0) {
        n += 1; // make it indivisible
      }
    }
    
    setNum(n);
    setIsError(false);
    setLastInput(null);
  };

  const startGame = (count) => {
    setTotalQuestions(count);
    setCurrentQuestionIndex(0);
    setSplits([]);
    const now = Date.now();
    setStartTime(now);
    setLastSplitTime(now);
    setCurrentTime(now);
    setGameState(GAME_STATES.PLAYING);
    generateQuestion();
  };

  const submitAnswer = (answeredYes) => {
    const isActuallyDivisible = (num % divisor === 0);
    setLastInput(answeredYes);
    
    if (answeredYes === isActuallyDivisible) {
      // Correct
      const now = Date.now();
      const splitDuration = now - lastSplitTime;
      const newSplits = [...splits, { q: num, time: splitDuration }];
      setSplits(newSplits);
      
      if (currentQuestionIndex + 1 >= totalQuestions) {
        finishGame(newSplits, now - startTime);
      } else {
        setLastSplitTime(now);
        setCurrentQuestionIndex(prev => prev + 1);
        generateQuestion();
      }
    } else {
      // Wrong
      setIsError(true);
      setTimeout(() => setIsError(false), 300);
    }
  };

  const finishGame = (finalSplits, totalDuration) => {
    setGameState(GAME_STATES.FINISHED);
    
    const avgTime = totalDuration / totalQuestions;
    const currentRecord = highScores[totalQuestions];
    
    if (!currentRecord || avgTime < currentRecord) {
      const newScores = { ...highScores, [totalQuestions]: avgTime };
      setHighScores(newScores);
      localStorage.setItem(`mentalCalcDivisibility_${divisor}_Scores`, JSON.stringify(newScores));
    }
  };

  const formatTime = (ms) => (ms / 1000).toFixed(2);

  if (gameState === GAME_STATES.MENU) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 relative">
        <Link href="/math/mental-calculation" className="absolute top-8 left-8 text-slate-400 hover:text-white flex items-center gap-2">
          ← Back to Hub
        </Link>
        <div className="text-center max-w-3xl">
          <div className="text-6xl mb-6">➗</div>
          <h1 className="text-5xl font-black mb-4 text-white">Divisibility by {divisor}</h1>
          <p className="text-slate-400 mb-8">
            Press <strong className="text-emerald-400">Y / 1 / →</strong> for YES. 
            Press <strong className="text-red-400">N / 0 / ←</strong> for NO.
          </p>
          
          <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl mb-12 text-left">
            <h3 className="text-amber-500 font-black mb-3">💡 Divisibility Rule Hint</h3>
            <p className="text-slate-300 text-lg font-medium leading-relaxed">
              {hint}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[10, 20, 30].map(count => (
              <div key={count} className="bg-slate-800 p-6 rounded-3xl border-2 border-slate-700 flex flex-col items-center">
                <h3 className="text-2xl font-bold mb-2 text-white">{count} Questions</h3>
                <p className="text-sm text-slate-400 mb-6 font-medium tracking-wide">
                  Record: <span className="text-amber-400 font-bold">{highScores[count] ? `${formatTime(highScores[count])}s/q` : 'None'}</span>
                </p>
                <button 
                  onClick={() => startGame(count)}
                  className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-black rounded-2xl transition-all hover:scale-105 active:scale-95"
                >
                  START
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (gameState === GAME_STATES.PLAYING) {
    const elapsed = currentTime - startTime;
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 relative">
        <div className="absolute top-8 left-8 text-2xl font-black text-slate-500">
          {currentQuestionIndex + 1} <span className="text-slate-700">/ {totalQuestions}</span>
        </div>
        <div className="absolute top-8 right-8 text-3xl font-black tabular-nums text-amber-500">
          {formatTime(elapsed)}s
        </div>

        <div className="flex flex-col items-center">
          <div className="text-3xl font-black text-slate-400 uppercase tracking-widest mb-6">
            Is it divisible by {divisor}?
          </div>
          <div className={`text-[100px] md:text-[150px] font-black tracking-tighter mb-16 tabular-nums transition-colors ${isError ? 'text-red-500' : 'text-white'}`}>
            {num}
          </div>
          
          <div className="flex gap-8 w-full max-w-md">
            <button 
              onClick={() => submitAnswer(false)}
              className={`flex-1 py-8 rounded-3xl text-3xl font-black transition-all border-4 ${
                lastInput === false && isError ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-slate-800 border-slate-700 hover:border-red-400 text-white'
              }`}
            >
              NO <span className="block text-sm text-slate-500 mt-2 font-medium">(N / 0 / ←)</span>
            </button>
            <button 
              onClick={() => submitAnswer(true)}
              className={`flex-1 py-8 rounded-3xl text-3xl font-black transition-all border-4 ${
                lastInput === true && isError ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-slate-800 border-slate-700 hover:border-emerald-400 text-white'
              }`}
            >
              YES <span className="block text-sm text-slate-500 mt-2 font-medium">(Y / 1 / →)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === GAME_STATES.FINISHED) {
    const totalTime = splits.reduce((acc, curr) => acc + curr.time, 0);
    const avgTime = totalTime / totalQuestions;
    const isNewRecord = avgTime <= highScores[totalQuestions];

    return (
      <div className="flex flex-col items-center min-h-screen p-6 py-20">
        <div className="max-w-4xl w-full bg-slate-800 rounded-[3rem] p-12 text-center border-4 border-slate-700 shadow-2xl">
          {isNewRecord && <div className="text-amber-500 font-black tracking-[0.3em] uppercase mb-4 text-sm animate-pulse">🏆 New All-Time Record!</div>}
          <h2 className="text-5xl font-black mb-8 text-white">Session Complete</h2>
          
          <div className="grid grid-cols-2 gap-8 mb-12">
            <div className="bg-slate-900 rounded-3xl p-6 border-2 border-slate-700">
              <div className="text-slate-400 font-medium uppercase tracking-wider text-sm mb-2">Total Time</div>
              <div className="text-4xl font-black text-white tabular-nums">{formatTime(totalTime)}s</div>
            </div>
            <div className="bg-slate-900 rounded-3xl p-6 border-2 border-slate-700">
              <div className="text-slate-400 font-medium uppercase tracking-wider text-sm mb-2">Average Speed</div>
              <div className="text-4xl font-black text-amber-500 tabular-nums">{formatTime(avgTime)}s</div>
            </div>
          </div>

          <div className="mb-12">
            <h3 className="text-2xl font-black text-white mb-6 text-left">Splits</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {splits.map((split, i) => (
                <div key={i} className="bg-slate-900/50 rounded-2xl p-4 border border-slate-700/50 flex flex-col items-center">
                  <div className="text-slate-500 text-xs font-black uppercase tracking-wider mb-2">Q{i + 1}</div>
                  <div className="text-white font-medium mb-1 truncate w-full text-center">{split.q}</div>
                  <div className="text-amber-500/80 font-black tabular-nums">{formatTime(split.time)}s</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => setGameState(GAME_STATES.MENU)}
              className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-black rounded-2xl transition-all"
            >
              Back to Menu
            </button>
            <button 
              onClick={() => startGame(totalQuestions)}
              className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-black rounded-2xl transition-all"
            >
              Play Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
