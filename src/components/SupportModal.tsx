import React, { useState } from 'react';
import { X, PhoneCall, Headphones, AlertTriangle, ShieldCheck, CheckCircle2, Send, MessageSquare } from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerEmergencyCall: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose, onTriggerEmergencyCall }) => {
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDetails, setTicketDetails] = useState('');
  const [ticketSent, setTicketSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim()) return;
    setTicketSent(true);
    setTimeout(() => {
      setTicketSent(false);
      setTicketSubject('');
      setTicketDetails('');
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 to-pink-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Headphones className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">مركز الدعم الفني والطوارئ 24/7</h3>
              <p className="text-xs text-rose-100">فريق مساندة متاح على مدار الساعة لخدمة المريضات</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-slate-800">
          
          {/* Emergency Oncology Call Banner */}
          <div className="p-4 bg-red-50 rounded-2xl border border-red-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-3 text-right">
              <div className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-red-900">طوارئ الأورام الفورية (24 ساعة)</h4>
                <p className="text-xs text-red-700 mt-0.5">
                  عند الشعور بحرارة &gt; 38°C أو ضيق تنفس حاد أثناء فترات العلاج
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                onTriggerEmergencyCall();
                onClose();
              }}
              className="w-full sm:w-auto px-4 py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-red-200 transition-all cursor-pointer shrink-0"
            >
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span>اتصال طوارئ فوري</span>
            </button>
          </div>

          {/* Hotline & Direct Channels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block mb-1 font-medium">الخط الساخن الوطني للاستشارات:</span>
              <strong className="text-slate-900 text-base font-mono dir-ltr block">937 (مجاني على مدار الساعة)</strong>
              <span className="text-[11px] text-emerald-700 font-semibold mt-1 inline-block">✓ استجابة فورية من أطباء معتمدين</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block mb-1 font-medium">دعم تطبيق Google Play والتذكيرات:</span>
              <strong className="text-slate-900 text-base font-mono dir-ltr block">+966 800 124 9999</strong>
              <span className="text-[11px] text-rose-700 font-semibold mt-1 inline-block">✓ دعم فني للمكالمات والإشعارات</span>
            </div>
          </div>

          {/* Quick Support Ticket Form */}
          <div className="pt-2 border-t border-slate-200">
            <h4 className="font-bold text-xs text-slate-800 mb-2 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-rose-600" />
              <span>إرسال طلب دعم فني أو بلاغ تقني سريع</span>
            </h4>

            {ticketSent ? (
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>تم إرسال تذكرتك بنجاح برقم #TK-9921. سيتواصل معكِ مهندس الدعم الطبي خلال 5 دقائق.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitTicket} className="space-y-2.5">
                <input
                  type="text"
                  placeholder="موضوع الطلب (مثلاً: مشكلة في استقبال مكالمات التذكير أو تحميل الفحوصات)"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-rose-500 bg-slate-50"
                  required
                />
                <textarea
                  placeholder="اكتبي تفاصيل استفسارك وسيقوم الفريق بتقديم المساعدة فوراً..."
                  rows={2}
                  value={ticketDetails}
                  onChange={(e) => setTicketDetails(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-rose-500 bg-slate-50 resize-none"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>إرسال الطلب الآن</span>
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
