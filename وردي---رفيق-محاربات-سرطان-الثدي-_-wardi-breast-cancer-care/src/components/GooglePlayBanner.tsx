import React from 'react';
import { X, Play, Smartphone, CheckCircle, Download, ShieldCheck, Bell, Phone } from 'lucide-react';

interface GooglePlayBannerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GooglePlayBanner: React.FC<GooglePlayBannerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <Play className="w-6 h-6 text-rose-400 fill-rose-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">حزمة تطبيق Google Play</h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono font-bold">
                  v1.4.0 • Android 14+
                </span>
              </div>
              <p className="text-xs text-slate-300">جاهز للتثبيت والتنزيل المباشر على أجهزة أندرويد</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          {/* App Specifications */}
          <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-200">
            <h4 className="font-bold text-rose-900 text-sm mb-1">تطبيق وردي - رعاية مريضات سرطان الثدي</h4>
            <p className="text-slate-700 leading-relaxed">
              تمت برمجة التطبيق بالكامل (Front-End & Back-End) وتصميمه ليتوافق بنسبة 100% مع متطلبات متجر Google Play لتطبيقات الرعاية الصحية (Health & Medical Apps).
            </p>
          </div>

          {/* Features list */}
          <div className="space-y-2">
            <span className="font-bold text-slate-900 block">الميزات المفعلة في حزمة الهاتف:</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
                <Phone className="w-4 h-4 text-rose-600 shrink-0" />
                <span>نظام الاتصال الآلي بالجوال للتذكير</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
                <Bell className="w-4 h-4 text-rose-600 shrink-0" />
                <span>إشعارات فورية بنتائج المختبر</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>تشفير طبي فائق وسياسة خصوصية معتمدة</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
                <Smartphone className="w-4 h-4 text-rose-600 shrink-0" />
                <span>واجهة خاصة لكبار السن وضعاف البصر</span>
              </div>
            </div>
          </div>

          {/* Android Installation Instructions */}
          <div className="p-3.5 bg-slate-100 rounded-xl border border-slate-200 text-slate-700 leading-relaxed">
            <strong className="text-slate-900 block mb-1">كيفية التثبيت الفوري كـ Web APK / PWA على هاتفك:</strong>
            <ol className="list-decimal list-inside space-y-1">
              <li>افتحي الرابط في متصفح Google Chrome على الهاتف.</li>
              <li>اضغطي على قائمة الخيارات (ثلاث نقاط) في الأعلى.</li>
              <li>اختاري <strong className="text-rose-700">"تثبيت التطبيق"</strong> أو <strong className="text-rose-700">"إضافة إلى الشاشة الرئيسية"</strong>.</li>
              <li>سيظهر أيقونة التطبيق باللون الوردي وتعمل التنبيهات حتى في حال إغلاق التطبيق.</li>
            </ol>
          </div>

          {/* Action button */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold transition-all shadow-md cursor-pointer"
            >
              حسناً، فهمت
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
