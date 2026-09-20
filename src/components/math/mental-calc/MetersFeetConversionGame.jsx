"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const GAME_STATES = {
  MENU: 'MENU',
  PLAYING: 'PLAYING',
  FINISHED: 'FINISHED'
};

export default function MetersFeetConversionGame() {
  const [gameState, setGameState] = useState(GAME_STATES.MENU);
  const [totalQuestions, setTotalQuestions] = useState(10);
  
  // Game Logic State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [num, setNum] = useState(0); 
  const [isMetersToFeet, setIsMetersToFeet] = useState(true);
  const [expectedEstimate, setExpectedEstimate] = useState(0);
  const [actualExact, setActualExact] = useState(0);
  
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
    const saved = localStorage.getItem('mentalCalcMetersFeetScores');
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
    const direction = Math.random() < 0.5; // true = meters -> feet, false = feet -> meters
    setIsMetersToFeet(direction);
    
    // Multiples of 10 for clean math
    const val = (Math.floor(Math.random() * 50) + 1) * 10;
    setNum(val);
    
    if (direction) {
      // Meters to Feet
      // Trick: multiply by 3, then add 10% of that answer
      const multiplied = val * 3;
      const est = multiplied + (multiplied * 0.1);
      setExpectedEstimate(est);
      // Exact conversion: 1 meter = 3.28084 feet
      setActualExact(val * 3.28084);
    } else {
      // Feet to Meters
      // Trick: divide by 10, then multiply by 3
      const est = (val / 10) * 3;
      setExpectedEstimate(est);
      // Exact conversion: 1 foot = 0.3048 meters
      setActualExact(val * 0.3048);
    }
    
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
      const answer = parseFloat(inputValue);
      
      // Allow slight floating point tolerance just in case
      if (Math.abs(answer - expectedEstimate) < 0.01) {
        // Correct
        const now = Date.now();
        const splitDuration = now - lastSplitTime;
        const qSymbol = isMetersToFeet ? `${num} m → ft` : `${num} ft → m`;
        
        const errorPct = Math.abs((expectedEstimate - actualExact) / actualExact) * 100;
        
        const newSplits = [...splits, { 
          q: qSymbol, 
          est: expectedEstimate,
          actual: actualExact,
          err: errorPct,
          time: splitDuration 
        }];
        
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
    
    if (!currentRecord || avgTime < currentRecord) {
      const newScores = { ...highScores, [totalQuestions]: avgTime };
      setHighScores(newScores);
      localStorage.setItem('mentalCalcMetersFeetScores', JSON.stringify(newScores));
    }
  };

  const formatTime = (ms) => (ms / 1000).toFixed(2);

  if (gameState === GAME_STATES.MENU) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 relative">
        <Link href="/math/mental-calculation" className="absolute top-8 left-8 text-slate-400 hover:text-white flex items-center gap-2">
          ← Back to Hub
        </Link>
        <div className="text-center max-w-4xl">
          <div className="text-6xl mb-6">📏</div>
          <h1 className="text-5xl font-black mb-4 text-white">
            Meters ↔ Feet
          </h1>
          <p className="text-slate-400 mb-8">
            Press ENTER to submit your estimated answer. The clock does not stop for mistakes.
          </p>
          
          <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-2xl mb-12 text-left">
            <h3 className="text-amber-500 font-black mb-4 text-xl">💡 Pro Tip: Conversion Estimations</h3>
            <div className="text-slate-300 space-y-6 font-medium leading-relaxed">
              <div>
                <h4 className="text-emerald-400 font-bold mb-2">Meters to Feet</h4>
                <p>1. Multiply by 3.</p>
                <p>2. Then add 10% of that answer.</p>
                <p className="text-sm text-slate-400 mt-1">Example: 40 m → (40 × 3) = 120 → 120 + 12 = 132 ft.</p>
              </div>
              
              <div className="border-t border-slate-700 pt-4">
                <h4 className="text-emerald-400 font-bold mb-2">Feet to Meters</h4>
                <p>1. Divide by 10.</p>
                <p>2. Then multiply by 3.</p>
                <p className="text-sm text-slate-400 mt-1">Example: 40 ft → (40 ÷ 10) = 4 → 4 × 3 = 12 m.</p>
              </div>
            </div>
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
      <div className="flex flex-col items-center justify-center min-h-screen p-6 relative" onClick={() => inputRef.current?.focus()}>
        <div className="absolute top-8 left-8 text-2xl font-black text-slate-500">
          {currentQuestionIndex + 1} <span className="text-slate-700">/ {totalQuestions}</span>
        </div>
        <div className="absolute top-8 right-8 text-3xl font-black tabular-nums text-amber-500">
          {formatTime(elapsed)}s
        </div>

        <div className="flex flex-col items-center">
          <div className="text-[60px] md:text-[100px] font-black tracking-tighter mb-4 tabular-nums text-white flex items-center">
            {num}
          </div>
          <div className="text-3xl font-bold text-slate-400 mb-12 uppercase tracking-widest">
            {isMetersToFeet ? 'Meters → Feet' : 'Feet → Meters'}
          </div>
          
          <input
            ref={inputRef}
            type="number"
            step="any"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`w-full max-w-md text-center text-7xl font-black bg-slate-800 rounded-3xl p-6 outline-none border-4 transition-colors shadow-2xl ${
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
        <div className="max-w-6xl w-full bg-slate-800 rounded-[3rem] p-12 text-center border-4 border-slate-700 shadow-2xl">
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
            <h3 className="text-2xl font-black text-white mb-6 text-left">Detailed Breakdown</h3>
            
            <div className="overflow-x-auto rounded-2xl border border-slate-700">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-xs font-black">
                    <th className="p-4 border-b border-slate-700">Q#</th>
                    <th className="p-4 border-b border-slate-700">Question</th>
                    <th className="p-4 border-b border-slate-700">Your Est.</th>
                    <th className="p-4 border-b border-slate-700">Actual (Exact)</th>
                    <th className="p-4 border-b border-slate-700">% Error</th>
                    <th className="p-4 border-b border-slate-700 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="bg-slate-900/40 divide-y divide-slate-700/50">
                  {splits.map((split, i) => (
                    <tr key={i} className="hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 text-slate-500 font-black">{i + 1}</td>
                      <td className="p-4 text-white font-bold">{split.q}</td>
                      <td className="p-4 text-emerald-400 font-bold tabular-nums">{split.est}</td>
                      <td className="p-4 text-slate-300 font-medium tabular-nums">{split.actual.toFixed(2)}</td>
                      <td className="p-4 tabular-nums font-bold">
                        <span className={split.err > 2 ? 'text-red-400' : 'text-amber-400'}>
                          {split.err.toFixed(1)}%
                        </span>
                      </td>
                      <td className="p-4 text-right text-amber-500/80 font-black tabular-nums">{formatTime(split.time)}s</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
