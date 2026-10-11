import React from 'react';
import { Bell, CheckCircle2, AlertCircle, Phone, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'alert' | 'call';
  title: string;
  description: string;
}

interface NotificationToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
  onAction?: (toast: ToastMessage) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ toasts, onDismiss, onAction }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-16 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 space-y-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-4 rounded-2xl shadow-xl border backdrop-blur-md transition-all transform animate-in slide-in-from-top-4 flex items-start gap-3 ${
            toast.type === 'call'
              ? 'bg-rose-900/95 text-white border-rose-500 shadow-rose-950/40'
              : toast.type === 'alert'
              ? 'bg-amber-900/95 text-white border-amber-500'
              : toast.type === 'success'
              ? 'bg-emerald-900/95 text-white border-emerald-500'
              : 'bg-slate-900/95 text-white border-slate-700'
          }`}
        >
          <div className="mt-0.5 shrink-0">
            {toast.type === 'call' ? (
              <div className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center animate-pulse">
                <Phone className="w-4 h-4 text-white" />
              </div>
            ) : toast.type === 'success' ? (
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
            ) : toast.type === 'alert' ? (
              <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-white" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-rose-500/30 flex items-center justify-center">
                <Bell className="w-4 h-4 text-rose-300" />
              </div>
            )}
          </div>

          <div className="flex-1 text-xs">
            <h4 className="font-bold text-sm text-white">{toast.title}</h4>
            <p className="text-slate-200 mt-0.5 leading-relaxed">{toast.description}</p>
            {onAction && toast.type === 'call' && (
              <button
                onClick={() => onAction(toast)}
                className="mt-2 text-xs font-bold px-3 py-1 bg-rose-500 hover:bg-rose-400 text-white rounded-lg inline-flex items-center gap-1 cursor-pointer"
              >
                فتح شاشة الاتصال 📞
              </button>
            )}
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
