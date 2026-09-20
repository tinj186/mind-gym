import React from 'react';
import Link from 'next/link';

export default function MentalCalculationPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col p-12">
      <div className="mb-12">
        <span className="text-[12px] font-black text-amber-500 uppercase tracking-[0.3em] block mb-4">RESTRICTED ACCESS</span>
        <h1 className="text-5xl font-black text-white tracking-tighter">
          Mental Calculation Gym
        </h1>
        <p className="text-slate-400 font-medium max-w-2xl mt-4">
          Welcome to the secret training ground. Prepare to push your cognitive limits with high-speed repetitive exercises.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Link href="/math/mental-calculation/single-digit-addition">
          <div className="group bg-slate-800 border-2 border-slate-700 hover:border-amber-500 rounded-3xl p-8 cursor-pointer transition-all hover:-translate-y-1">
            <div className="text-4xl mb-4 bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-900 transition-colors">
              ⚡️
            </div>
            <h2 className="text-2xl font-black text-white mb-2 group-hover:text-amber-500 transition-colors">
              Single Digit Addition
            </h2>
            <p className="text-slate-400 font-medium">
              High-speed addition of numbers 1-9. Track your average speed and set new all-time records.
            </p>
          </div>
        </Link>
        <Link href="/math/mental-calculation/two-digit-addition">
          <div className="group bg-slate-800 border-2 border-slate-700 hover:border-amber-500 rounded-3xl p-8 cursor-pointer transition-all hover:-translate-y-1">
            <div className="text-4xl mb-4 bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-900 transition-colors">
              🧠
            </div>
            <h2 className="text-2xl font-black text-white mb-2 group-hover:text-amber-500 transition-colors">
              Double Digit Addition
            </h2>
            <p className="text-slate-400 font-medium">
              High-speed addition of numbers 10-99. Track your average speed and set new all-time records.
            </p>
          </div>
        </Link>
        <Link href="/math/mental-calculation/three-digit-addition">
          <div className="group bg-slate-800 border-2 border-slate-700 hover:border-amber-500 rounded-3xl p-8 cursor-pointer transition-all hover:-translate-y-1">
            <div className="text-4xl mb-4 bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-900 transition-colors">
              🔥
            </div>
            <h2 className="text-2xl font-black text-white mb-2 group-hover:text-amber-500 transition-colors">
              Triple Digit Addition
            </h2>
            <p className="text-slate-400 font-medium">
              High-speed addition of numbers 100-999. Track your average speed and set new all-time records.
            </p>
          </div>
        </Link>
        <Link href="/math/mental-calculation/single-digit-subtraction">
          <div className="group bg-slate-800 border-2 border-slate-700 hover:border-emerald-500 rounded-3xl p-8 cursor-pointer transition-all hover:-translate-y-1">
            <div className="text-4xl mb-4 bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-slate-900 transition-colors">
              📉
            </div>
            <h2 className="text-2xl font-black text-white mb-2 group-hover:text-emerald-500 transition-colors">
              Single Digit Subtraction
            </h2>
            <p className="text-slate-400 font-medium">
              High-speed subtraction of numbers 1-9. Track your average speed and set new all-time records.
            </p>
          </div>
        </Link>
        <Link href="/math/mental-calculation/two-digit-subtraction">
          <div className="group bg-slate-800 border-2 border-slate-700 hover:border-emerald-500 rounded-3xl p-8 cursor-pointer transition-all hover:-translate-y-1">
            <div className="text-4xl mb-4 bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-slate-900 transition-colors">
              📉
            </div>
            <h2 className="text-2xl font-black text-white mb-2 group-hover:text-emerald-500 transition-colors">
              Double Digit Subtraction
            </h2>
            <p className="text-slate-400 font-medium">
              High-speed subtraction of numbers 10-99. Track your average speed and set new all-time records.
            </p>
          </div>
        </Link>
        <Link href="/math/mental-calculation/three-digit-subtraction">
          <div className="group bg-slate-800 border-2 border-slate-700 hover:border-emerald-500 rounded-3xl p-8 cursor-pointer transition-all hover:-translate-y-1">
            <div className="text-4xl mb-4 bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-slate-900 transition-colors">
              📉
            </div>
            <h2 className="text-2xl font-black text-white mb-2 group-hover:text-emerald-500 transition-colors">
              Triple Digit Subtraction
            </h2>
            <p className="text-slate-400 font-medium">
              High-speed subtraction of numbers 100-999. Track your average speed and set new all-time records.
            </p>
          </div>
        </Link>
        <Link href="/math/mental-calculation/complements-1-digit">
          <div className="group bg-slate-800 border-2 border-slate-700 hover:border-violet-500 rounded-3xl p-8 cursor-pointer transition-all hover:-translate-y-1">
            <div className="text-4xl mb-4 bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-violet-500 group-hover:text-slate-900 transition-colors">
              🧩
            </div>
            <h2 className="text-2xl font-black text-white mb-2 group-hover:text-violet-500 transition-colors">
              Finding Complements (1 Digit)
            </h2>
            <p className="text-slate-400 font-medium">
              Find the number that adds up to 10. High-speed training. Track your average speed and set new all-time records.
            </p>
          </div>
        </Link>
        <Link href="/math/mental-calculation/complements-2-3-digits">
          <div className="group bg-slate-800 border-2 border-slate-700 hover:border-violet-500 rounded-3xl p-8 cursor-pointer transition-all hover:-translate-y-1">
            <div className="text-4xl mb-4 bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-violet-500 group-hover:text-slate-900 transition-colors">
              🎯
            </div>
            <h2 className="text-2xl font-black text-white mb-2 group-hover:text-violet-500 transition-colors">
              Finding Complements (2-3 Digits)
            </h2>
            <p className="text-slate-400 font-medium">
              Find the number that adds up to 100 or 1,000. Track your average speed and set new all-time records.
            </p>
          </div>
        </Link>
        <Link href="/math/mental-calculation/complements-4-5-digits">
          <div className="group bg-slate-800 border-2 border-slate-700 hover:border-violet-500 rounded-3xl p-8 cursor-pointer transition-all hover:-translate-y-1">
            <div className="text-4xl mb-4 bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-violet-500 group-hover:text-slate-900 transition-colors">
              💎
            </div>
            <h2 className="text-2xl font-black text-white mb-2 group-hover:text-violet-500 transition-colors">
              Finding Complements (4-5 Digits)
            </h2>
            <p className="text-slate-400 font-medium">
              Find the number that adds up to 10,000 or 100,000. Track your average speed and set new all-time records.
            </p>
          </div>
        </Link>
      </div>

      <div className="mt-16 mb-8">
        <h2 className="text-3xl font-black text-white tracking-tight mb-2">
          Advanced Techniques
        </h2>
        <p className="text-slate-400 font-medium">
          Master specialized calculation tricks for lightning-fast results.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Link href="/math/mental-calculation/squaring-2-digits">
          <div className="group bg-slate-800 border-2 border-slate-700 hover:border-fuchsia-500 rounded-3xl p-8 cursor-pointer transition-all hover:-translate-y-1">
            <div className="text-4xl mb-4 bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-fuchsia-500 group-hover:text-slate-900 transition-colors">
              🔳
            </div>
            <h2 className="text-2xl font-black text-white mb-2 group-hover:text-fuchsia-500 transition-colors">
              Squaring (2 Digits)
            </h2>
            <p className="text-slate-400 font-medium">
              Square numbers from 11-99 instantly using the rounding trick.
            </p>
          </div>
        </Link>
        <Link href="/math/mental-calculation/squaring-3-digits">
          <div className="group bg-slate-800 border-2 border-slate-700 hover:border-fuchsia-500 rounded-3xl p-8 cursor-pointer transition-all hover:-translate-y-1">
            <div className="text-4xl mb-4 bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-fuchsia-500 group-hover:text-slate-900 transition-colors">
              ⬛
            </div>
            <h2 className="text-2xl font-black text-white mb-2 group-hover:text-fuchsia-500 transition-colors">
              Squaring (3 Digits)
            </h2>
            <p className="text-slate-400 font-medium">
              Square numbers from 101-999 instantly using the rounding trick.
            </p>
          </div>
        </Link>
        <Link href="/math/mental-calculation/square-root">
          <div className="group bg-slate-800 border-2 border-slate-700 hover:border-fuchsia-500 rounded-3xl p-8 cursor-pointer transition-all hover:-translate-y-1">
            <div className="text-4xl mb-4 bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-fuchsia-500 group-hover:text-slate-900 transition-colors">
              🌿
            </div>
            <h2 className="text-2xl font-black text-white mb-2 group-hover:text-fuchsia-500 transition-colors">
              Square Root
            </h2>
            <p className="text-slate-400 font-medium">
              Calculate the square root of perfect squares up to 4 digits.
            </p>
          </div>
        </Link>
        <Link href="/math/mental-calculation/cube-root">
          <div className="group bg-slate-800 border-2 border-slate-700 hover:border-fuchsia-500 rounded-3xl p-8 cursor-pointer transition-all hover:-translate-y-1">
            <div className="text-4xl mb-4 bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-fuchsia-500 group-hover:text-slate-900 transition-colors">
              🌳
            </div>
            <h2 className="text-2xl font-black text-white mb-2 group-hover:text-fuchsia-500 transition-colors">
              Cube Root
            </h2>
            <p className="text-slate-400 font-medium">
              Calculate the cube root of perfect cubes up to 6 digits.
            </p>
          </div>
        </Link>
      </div>

      <div className="mt-16 mb-8">
        <h2 className="text-3xl font-black text-white tracking-tight mb-2">
          Multiplication Mastery
        </h2>
        <p className="text-slate-400 font-medium">
          Targeted practice for specific multipliers. Numbers scale up to 5 digits.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 15, 16, 18, 21, 22].map(multiplier => (
          <Link key={multiplier} href={`/math/mental-calculation/multiplication/${multiplier}`}>
            <div className="group bg-slate-800 border-2 border-slate-700 hover:border-amber-500 rounded-3xl p-6 cursor-pointer transition-all hover:-translate-y-1 text-center">
              <div className="text-3xl mb-3 bg-slate-900 w-12 h-12 mx-auto rounded-xl flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-900 transition-colors">
                ×
              </div>
              <h3 className="text-xl font-black text-white group-hover:text-amber-500 transition-colors">
                {multiplier}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-16 mb-8">
        <h2 className="text-3xl font-black text-white tracking-tight mb-2">
          Divisibility Rules
        </h2>
        <p className="text-slate-400 font-medium">
          Quickly identify if large numbers are divisible by a specific divisor without doing long division.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[2, 3, 4, 5, 6, 7, 8, 9, 11].map(divisor => (
          <Link key={divisor} href={`/math/mental-calculation/divisibility/${divisor}`}>
            <div className="group bg-slate-800 border-2 border-slate-700 hover:border-emerald-500 rounded-3xl p-6 cursor-pointer transition-all hover:-translate-y-1 text-center">
              <div className="text-3xl mb-3 bg-slate-900 w-12 h-12 mx-auto rounded-xl flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-slate-900 transition-colors">
                ➗
              </div>
              <h3 className="text-xl font-black text-white group-hover:text-emerald-500 transition-colors">
                {divisor}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-16 mb-8">
        <h2 className="text-3xl font-black text-white tracking-tight mb-2">
          Conversion Estimation
        </h2>
        <p className="text-slate-400 font-medium">
          Quickly estimate real-world unit conversions using fast approximations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Link href="/math/mental-calculation/miles-km-conversion">
          <div className="group bg-slate-800 border-2 border-slate-700 hover:border-blue-500 rounded-3xl p-8 cursor-pointer transition-all hover:-translate-y-1">
            <div className="text-4xl mb-4 bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-blue-500 group-hover:text-slate-900 transition-colors">
              🚗
            </div>
            <h2 className="text-2xl font-black text-white mb-2 group-hover:text-blue-500 transition-colors">
              Miles ↔ Kilometers
            </h2>
            <p className="text-slate-400 font-medium">
              Estimate distance conversions back and forth with high accuracy.
            </p>
          </div>
        </Link>
        <Link href="/math/mental-calculation/meters-feet-conversion">
          <div className="group bg-slate-800 border-2 border-slate-700 hover:border-blue-500 rounded-3xl p-8 cursor-pointer transition-all hover:-translate-y-1">
            <div className="text-4xl mb-4 bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-blue-500 group-hover:text-slate-900 transition-colors">
              📏
            </div>
            <h2 className="text-2xl font-black text-white mb-2 group-hover:text-blue-500 transition-colors">
              Meters ↔ Feet
            </h2>
            <p className="text-slate-400 font-medium">
              Estimate distance conversions back and forth with high accuracy.
            </p>
          </div>
        </Link>
      </div>

    </div>
  );
}
