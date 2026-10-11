import React, { useEffect, useState, useRef } from 'react';
import { Phone, PhoneCall, PhoneOff, Volume2, CheckCircle2, Clock, ShieldCheck, Heart } from 'lucide-react';
import { IncomingCallPayload } from '../types';
import { playPhoneRingtone, speakArabicText, stopArabicSpeech } from '../utils/audio';

interface PhoneCallModalProps {
  call: IncomingCallPayload | null;
  onClose: () => void;
  onMedicationTaken?: () => void;
}

export const PhoneCallModal: React.FC<PhoneCallModalProps> = ({ call, onClose, onMedicationTaken }) => {
  const [callState, setCallState] = useState<'ringing' | 'active' | 'ended'>('ringing');
  const [duration, setDuration] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const ringtoneStopRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (call) {
      setCallState('ringing');
      setDuration(0);
      ringtoneStopRef.current = playPhoneRingtone();
    }
    return () => {
      if (ringtoneStopRef.current) {
        ringtoneStopRef.current();
      }
      stopArabicSpeech();
    };
  }, [call]);

  useEffect(() => {
    let timer: any = null;
    if (callState === 'active') {
      timer = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callState]);

  if (!call) return null;

  const handleAnswer = () => {
    if (ringtoneStopRef.current) {
      ringtoneStopRef.current();
      ringtoneStopRef.current = null;
    }
    setCallState('active');
    setIsPlayingAudio(true);
    speakArabicText(call.spokenMessageArabic, () => {
      setIsPlayingAudio(false);
    });
  };

  const handleDecline = () => {
    if (ringtoneStopRef.current) {
      ringtoneStopRef.current();
      ringtoneStopRef.current = null;
    }
    stopArabicSpeech();
    setCallState('ended');
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleConfirmDose = () => {
    if (onMedicationTaken) {
      onMedicationTaken();
    }
    handleDecline();
  };

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-gradient-to-b from-slate-900 via-rose-950 to-slate-900 text-white rounded-3xl shadow-2xl border border-rose-500/30 overflow-hidden relative flex flex-col justify-between min-h-[560px] p-6">
        
        {/* Subtle Decorative Background */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-radial from-rose-500/20 to-transparent pointer-events-none" />

        {/* Header / Caller Info */}
        <div className="text-center pt-6 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/20 border border-rose-400/30 rounded-full text-xs text-rose-200 mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
            <span>مكالمة آلية مشفرة من مركز علاج الأورام</span>
          </div>

          {/* Caller Avatar / Pulsing Icon */}
          <div className="relative mx-auto w-24 h-24 mb-4 flex items-center justify-center">
            {callState === 'ringing' && (
              <>
                <div className="absolute inset-0 rounded-full bg-rose-500/30 animate-ping opacity-60" />
                <div className="absolute -inset-3 rounded-full bg-rose-400/20 animate-pulse" />
              </>
            )}
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-900/50 border-2 border-white/40">
              <Heart className="w-12 h-12 text-white fill-white" />
            </div>
          </div>

          <h3 className="text-xl font-bold text-white tracking-wide">{call.callerName}</h3>
          <p className="text-rose-200/80 text-sm dir-ltr font-mono mt-0.5">{call.callerNumber}</p>

          <div className="mt-3">
            {callState === 'ringing' && (
              <span className="inline-block px-3 py-1 rounded-full bg-rose-500/30 text-rose-200 text-xs font-semibold animate-pulse">
                🔔 وارد الآن... يرن هاتفك
              </span>
            )}
            {callState === 'active' && (
              <div className="flex items-center justify-center gap-2 text-emerald-400 font-mono text-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>مكالمة جارية • {formatDuration(duration)}</span>
              </div>
            )}
            {callState === 'ended' && (
              <span className="text-slate-400 text-sm">تم إنهاء المكالمة</span>
            )}
          </div>
        </div>

        {/* Call Content Area */}
        <div className="my-auto py-4 z-10">
          {callState === 'ringing' ? (
            <div className="bg-slate-900/70 border border-rose-500/20 rounded-2xl p-4 text-center">
              <p className="text-xs text-rose-300 font-medium mb-1">سبب الاتصال:</p>
              <p className="text-base font-bold text-white mb-2">{call.title}</p>
              <p className="text-xs text-slate-300 leading-relaxed">
                اضغطي الزر الأخضر للرد وسماع التعليمات الصوتية فوراً
              </p>
            </div>
          ) : callState === 'active' ? (
            <div className="space-y-3">
              <div className="bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2 text-emerald-300 text-xs font-semibold">
                  <Volume2 className="w-4 h-4 animate-bounce" />
                  <span>الرسالة الصوتية المباشرة:</span>
                </div>
                <p className="text-sm text-slate-100 leading-relaxed bg-black/30 p-3 rounded-xl border border-white/5">
                  "{call.spokenMessageArabic}"
                </p>
                {isPlayingAudio && (
                  <div className="flex items-center justify-center gap-1.5 mt-3">
                    <span className="w-1.5 h-4 bg-rose-400 rounded-full animate-pulse" />
                    <span className="w-1.5 h-7 bg-pink-400 rounded-full animate-pulse delay-75" />
                    <span className="w-1.5 h-5 bg-rose-400 rounded-full animate-pulse delay-150" />
                    <span className="w-1.5 h-8 bg-pink-400 rounded-full animate-pulse delay-100" />
                    <span className="w-1.5 h-4 bg-rose-400 rounded-full animate-pulse" />
                    <span className="text-xs text-rose-300 mr-2">جاري التحدث بصوت الطبيب...</span>
                  </div>
                )}
              </div>

              {/* Action buttons inside call */}
              <div className="flex gap-2">
                <button
                  onClick={handleConfirmDose}
                  className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>أخذت الجرعة الآن</span>
                </button>
                <button
                  onClick={() => speakArabicText(call.spokenMessageArabic)}
                  className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium flex items-center justify-center gap-1 border border-slate-700 cursor-pointer"
                  title="إعادة سماع الرسالة"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>إعادة</span>
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {/* Call Action Controls (Bottom) */}
        <div className="pt-4 pb-2 z-10">
          {callState === 'ringing' ? (
            <div className="flex items-center justify-around">
              {/* Decline Button */}
              <button
                onClick={handleDecline}
                className="group flex flex-col items-center gap-2 cursor-pointer transition-transform active:scale-95"
              >
                <div className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-950 transition-all border-2 border-white/20">
                  <PhoneOff className="w-7 h-7" />
                </div>
                <span className="text-xs text-slate-300 font-medium">رفض</span>
              </button>

              {/* Answer Button */}
              <button
                onClick={handleAnswer}
                className="group flex flex-col items-center gap-2 cursor-pointer transition-transform active:scale-95"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-lg shadow-emerald-950 transition-all border-2 border-white/20 animate-bounce">
                  <PhoneCall className="w-7 h-7" />
                </div>
                <span className="text-xs text-emerald-300 font-bold">الرد والتحدث</span>
              </button>
            </div>
          ) : callState === 'active' ? (
            <div className="flex justify-center">
              <button
                onClick={handleDecline}
                className="group flex flex-col items-center gap-2 cursor-pointer transition-transform active:scale-95"
              >
                <div className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-950 transition-all border-2 border-white/20">
                  <PhoneOff className="w-7 h-7" />
                </div>
                <span className="text-xs text-rose-300 font-medium">إنهاء المكالمة</span>
              </button>
            </div>
          ) : null}
        </div>

      </div>
    </div>
  );
};
