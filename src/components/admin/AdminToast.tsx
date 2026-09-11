import React from 'react';

export interface ToastState {
  text: string;
  type: 'success' | 'error';
}

interface AdminToastProps {
  toastMessage: ToastState | null;
}

export default function AdminToast({ toastMessage }: AdminToastProps) {
  if (!toastMessage) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border px-5 py-3.5 shadow-2xl backdrop-blur-xl transition-all duration-300 ${
        toastMessage.type === 'error'
          ? 'border-red-500/40 bg-red-950/90 text-red-200 shadow-red-500/10'
          : 'border-emerald-500/40 bg-zinc-900/95 text-emerald-300 shadow-emerald-500/10'
      }`}
    >
      <span
        className={`flex h-2.5 w-2.5 rounded-full ${
          toastMessage.type === 'error' ? 'bg-red-500' : 'bg-emerald-400'
        }`}
      />
      <p className="text-sm font-medium">{toastMessage.text}</p>
    </div>
  );
}
