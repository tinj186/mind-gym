"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const GAME_STATES = {
  MENU: 'MENU',
  PLAYING: 'PLAYING',
  FINISHED: 'FINISHED'
};

export default function SingleDigitAdditionGame() {
  const [gameState, setGameState] = useState(GAME_STATES.MENU);
  const [totalQuestions, setTotalQuestions] = useState(10);
  
  // Game Logic State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [isError, setIsError] = useState(false);
  
  // Timing State
  const [startTime, setStartTime] = useState(0);
  const [lastSplitTime, setLastSplitTime] = useState(0);
  const [splits, setSplits] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);

  // High Scores State
  const [highScores, setHighScores] = useState({ 10: null, 20: null, 30: null });

  const inputRef = useRef(null);
  const timerRef = useRef(null);

  // Load high scores on mount
  useEffect(() => {
    const saved = localStorage.getItem('mentalCalcAdditionScores');
    if (saved) {
      setHighScores(JSON.parse(saved));
    }
  }, []);

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

  // Keep input focused
  useEffect(() => {
    if (gameState === GAME_STATES.PLAYING && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState, currentQuestionIndex]);

  const generateQuestion = () => {
    setNum1(Math.floor(Math.random() * 9) + 1);
    setNum2(Math.floor(Math.random() * 9) + 1);
    setInputValue('');
    setIsError(false);
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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const answer = parseInt(inputValue, 10);
      if (answer === num1 + num2) {
        // Correct
        const now = Date.now();
        const splitDuration = now - lastSplitTime;
        const newSplits = [...splits, { q: `${num1} + ${num2}`, time: splitDuration }];
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
        setInputValue('');
        setTimeout(() => setIsError(false), 300);
      }
    }
  };

  const finishGame = (finalSplits, totalDuration) => {
    setGameState(GAME_STATES.FINISHED);
    
    const avgTime = totalDuration / totalQuestions;
    const currentRecord = highScores[totalQuestions];
    
    // Check if new record (or if no record exists)
    // Add a small threshold (e.g., 0.001) to prevent floating point inaccuracies marking identical times as new records
    if (!currentRecord || avgTime < currentRecord) {
      const newScores = { ...highScores, [totalQuestions]: avgTime };
      setHighScores(newScores);
      localStorage.setItem('mentalCalcAdditionScores', JSON.stringify(newScores));
    }
  };

  const formatTime = (ms) => (ms / 1000).toFixed(2);

  if (gameState === GAME_STATES.MENU) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 relative">
        <Link href="/math/mental-calculation" className="absolute top-8 left-8 text-slate-400 hover:text-white flex items-center gap-2">
          ← Back to Hub
        </Link>
        <div className="text-center max-w-2xl">
          <div className="text-6xl mb-6">⚡️</div>
          <h1 className="text-5xl font-black mb-4 text-white">Single Digit Addition</h1>
          <p className="text-slate-400 mb-12">Press ENTER to submit your answer. The clock does not stop for mistakes.</p>
          
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
      <div className="flex flex-col items-center justify-center min-h-screen p-6 relative" onClick={() => inputRef.current?.focus()}>
        <div className="absolute top-8 left-8 text-2xl font-black text-slate-500">
          {currentQuestionIndex + 1} <span className="text-slate-700">/ {totalQuestions}</span>
        </div>
        <div className="absolute top-8 right-8 text-3xl font-black tabular-nums text-amber-500">
          {formatTime(elapsed)}s
        </div>

        <div className="flex flex-col items-center">
          <div className="text-[120px] md:text-[180px] font-black tracking-tighter mb-12 tabular-nums text-white">
            {num1} + {num2}
          </div>
          <input
            ref={inputRef}
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`w-64 text-center text-7xl font-black bg-slate-800 rounded-3xl p-6 outline-none border-4 transition-colors shadow-2xl ${
              isError ? 'border-red-500 text-red-500' : 'border-slate-600 focus:border-amber-500 text-white'
            }`}
            autoFocus
          />
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
            <div className="bg-slate-900 rounded-3xl p-8 border border-slate-700">
              <div className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">Total Time</div>
              <div className="text-5xl font-black text-amber-500 tabular-nums">{formatTime(totalTime)}s</div>
            </div>
            <div className="bg-slate-900 rounded-3xl p-8 border border-slate-700">
              <div className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">Average Speed</div>
              <div className="text-5xl font-black text-amber-500 tabular-nums">{formatTime(avgTime)}s <span className="text-2xl text-slate-500">/q</span></div>
            </div>
          </div>

          <div className="text-left mb-12">
            <h3 className="text-xl font-black text-white uppercase tracking-widest mb-6 border-b border-slate-700 pb-4">Question Breakdown</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {splits.map((split, idx) => (
                <div key={idx} className="bg-slate-900 p-4 rounded-2xl flex flex-col items-center border border-slate-800">
                  <div className="text-slate-500 font-bold mb-1 text-xs tracking-wider">#{idx + 1}</div>
                  <div className="text-white font-black text-xl mb-1">{split.q}</div>
                  <div className={`tabular-nums font-bold text-lg ${split.time / 1000 > avgTime * 1.5 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {formatTime(split.time)}s
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => setGameState(GAME_STATES.MENU)}
              className="px-10 py-5 bg-slate-700 hover:bg-slate-600 text-white font-black rounded-2xl transition-colors text-lg"
            >
              Back to Menu
            </button>
            <button 
              onClick={() => startGame(totalQuestions)}
              className="px-10 py-5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-black rounded-2xl transition-all hover:scale-105 active:scale-95 text-lg"
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
