import React from 'react';
import RootsGame from '@/components/math/mental-calc/RootsGame';

export default function CubeRootRoute() {
  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      <RootsGame type="cube" />
    </div>
  );
}
