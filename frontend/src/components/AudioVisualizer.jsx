import React from 'react';

export default function AudioVisualizer({ isRecording, isPlaying }) {
  if (!isRecording && !isPlaying) return null;

  return (
    <div className="flex items-center justify-center gap-1.5 h-10 px-4 py-2 bg-stone-900/90 backdrop-blur rounded-full shadow-inner">
      <span className="text-xs font-semibold mr-2 text-amber-400 uppercase tracking-widest">
        {isRecording ? "Listening..." : "Gnani Timbre Speaking..."}
      </span>
      <div className="w-1 bg-amber-400 rounded-full h-7 animate-wave-1"></div>
      <div className="w-1 bg-orange-500 rounded-full h-8 animate-wave-2"></div>
      <div className="w-1 bg-emerald-400 rounded-full h-6 animate-wave-3"></div>
      <div className="w-1 bg-amber-300 rounded-full h-9 animate-wave-4"></div>
      <div className="w-1 bg-orange-400 rounded-full h-5 animate-wave-5"></div>
      <div className="w-1 bg-emerald-500 rounded-full h-7 animate-wave-2"></div>
      <div className="w-1 bg-amber-400 rounded-full h-8 animate-wave-1"></div>
    </div>
  );
}
