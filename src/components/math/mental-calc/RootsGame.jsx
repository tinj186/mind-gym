"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const GAME_STATES = {
  MENU: 'MENU',
  PLAYING: 'PLAYING',
  FINISHED: 'FINISHED'
};

export default function RootsGame({ type = 'square' }) {
  const isSquare = type === 'square';
  const [gameState, setGameState] = useState(GAME_STATES.MENU);
  const [totalQuestions, setTotalQuestions] = useState(10);
  
  // Game Logic State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [num, setNum] = useState(0); // The big number (y)
  const [rootValue, setRootValue] = useState(0); // The correct answer (x)
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
    const saved = localStorage.getItem(`mentalCalc${isSquare ? 'Square' : 'Cube'}RootScores`);
    if (saved) {
      setHighScores(JSON.parse(saved));
    }
  }, [isSquare]);

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
    // Generate a root between 10 and 99
    // Square root of up to 4 digits: max 99^2 = 9801
    // Cube root of up to 6 digits: max 99^3 = 970299
    const x = Math.floor(Math.random() * 90) + 10;
    const y = isSquare ? x * x : x * x * x;
    
    setNum(y);
    setRootValue(x);
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
      if (answer === rootValue) {
        // Correct
        const now = Date.now();
        const splitDuration = now - lastSplitTime;
        const qSymbol = isSquare ? `√${num}` : `³√${num}`;
        const newSplits = [...splits, { q: qSymbol, time: splitDuration }];
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
      localStorage.setItem(`mentalCalc${isSquare ? 'Square' : 'Cube'}RootScores`, JSON.stringify(newScores));
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
          <div className="text-6xl mb-6">{isSquare ? '🌿' : '🌳'}</div>
          <h1 className="text-5xl font-black mb-4 text-white">
            {isSquare ? 'Square Root Trick' : 'Cube Root Trick'}
          </h1>
          <p className="text-slate-400 mb-8">
            Press ENTER to submit your answer. The clock does not stop for mistakes.
          </p>
          
          <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-2xl mb-12 text-left">
            <h3 className="text-amber-500 font-black mb-4 text-xl">💡 Pro Tip: {isSquare ? 'Square Root Trick (Up to 4 digits)' : 'Cube Root Trick (Up to 6 digits)'}</h3>
            {isSquare ? (
              <div className="text-slate-300 space-y-4 font-medium leading-relaxed">
                <p><strong>Memorize the squares of 1 through 9.</strong></p>
                <ol className="list-decimal pl-5 space-y-3">
                  <li><strong>Find the Potential Last Digits:</strong> Look at the last digit of the large number. Unlike cubes, squares share endings (e.g., both 2² and 8² end in 4). This gives you two possible numbers for the last digit of your answer.</li>
                  <li><strong>Cross out the last two digits:</strong> Ignore them entirely.</li>
                  <li><strong>Find the First Digit:</strong> Look at the remaining digits on the left and find the largest perfect square that fits into it. That base number is your first digit.</li>
                  <li><strong>Choose between the two options:</strong> To figure out which of the two potential last digits is correct, multiply your first digit by the next highest whole integer. If the remaining numbers from step 3 are smaller than this product, pick the smaller last digit option. If they are larger, pick the larger option.</li>
                </ol>
              </div>
            ) : (
              <div className="text-slate-300 space-y-4 font-medium leading-relaxed">
                <p><strong>Memorize the cubes of 1 through 10</strong> (1=1, 2=8, 3=27, 4=64, 5=125, 6=216, 7=343, 8=512, 9=729, 10=1000). Once memorized, every perfect cube calculation is just pattern recognition:</p>
                <ol className="list-decimal pl-5 space-y-3">
                  <li><strong>Find the Last Digit:</strong> Look at the last digit of the large number you want to find the root of. Each digit (1-9) produces a unique ending digit when cubed. For example, if the large number ends in a 2, the only base cube that ends in 2 is 8 (8³ = 512). Your answer will end in 8.</li>
                  <li><strong>Cross out the last three digits:</strong> Ignore the final three numbers of the large number completely.</li>
                  <li><strong>Find the First Digit:</strong> Look at the remaining digits on the left. Find the largest perfect cube from your memorized list that is less than or equal to this remaining number. That base number is your first digit.</li>
                </ol>
              </div>
            )}
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
          <div className="text-[100px] md:text-[140px] font-black tracking-tighter mb-12 tabular-nums text-white flex items-center">
            <span className="text-[60px] md:text-[80px] text-slate-500 mr-2">{isSquare ? '√' : '³√'}</span>{num}
          </div>
          <input
            ref={inputRef}
            type="number"
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
                  <div className="text-white font-medium mb-1">{split.q}</div>
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
