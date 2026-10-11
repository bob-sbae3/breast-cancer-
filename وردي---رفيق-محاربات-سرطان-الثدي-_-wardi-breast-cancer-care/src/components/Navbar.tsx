import React, { useState } from 'react';
import { 
  Heart, 
  ShieldCheck, 
  Smartphone, 
  Monitor, 
  Stethoscope, 
  UserCheck, 
  PhoneCall, 
  Lock, 
  Type, 
  HelpCircle,
  Play
} from 'lucide-react';

interface NavbarProps {
  currentRole: 'patient' | 'doctor';
  setRole: (role: 'patient' | 'doctor') => void;
  isMobileFrame: boolean;
  setIsMobileFrame: (val: boolean) => void;
  fontSize: 'normal' | 'large' | 'xlarge';
  setFontSize: (size: 'normal' | 'large' | 'xlarge') => void;
  onOpenSOS: () => void;
  onOpenSupport: () => void;
  onOpenPlayStoreModal: () => void;
  onOpenAuth: () => void;
  userName: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  setRole,
  isMobileFrame,
  setIsMobileFrame,
  fontSize,
  setFontSize,
  onOpenSOS,
  onOpenSupport,
  onOpenPlayStoreModal,
  onOpenAuth,
  userName,
}) => {
  const [showSecurityTooltip, setShowSecurityTooltip] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-rose-200">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" title="متصل بالنظام الصحي" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                <span>وردي</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold border border-rose-200">
                  Wardi Care
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              الرفيق الذكي لمحاربات سرطان الثدي
            </p>
          </div>
        </div>

        {/* Center / Accessibility & Controls */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* Elderly Accessibility Font Resizer */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200" title="حجم الخط لكبار السن">
            <Type className="w-3.5 h-3.5 text-slate-500 mx-1.5" />
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                fontSize === 'normal' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              عادي
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-2 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                fontSize === 'large' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              كبير +
            </button>
            <button
              onClick={() => setFontSize('xlarge')}
              className={`px-2 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                fontSize === 'xlarge' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              كبير جداً ++
            </button>
          </div>

          {/* Security & HIPAA Badge with tooltip */}
          <div className="relative">
            <button
              onClick={() => setShowSecurityTooltip(!showSecurityTooltip)}
              onMouseEnter={() => setShowSecurityTooltip(true)}
              onMouseLeave={() => setShowSecurityTooltip(false)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl border border-emerald-200 font-semibold transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">تشفير صحي AES-256</span>
              <Lock className="w-3 h-3 text-emerald-600" />
            </button>

            {showSecurityTooltip && (
              <div className="absolute top-full mt-2 right-0 w-64 bg-slate-900 text-white p-3 rounded-2xl shadow-xl text-xs z-50 border border-slate-700 animate-in fade-in duration-150">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>معايير أمان HIPAA والسرية الطبية</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  كافة بيانات المريضة، الأدوية، والتقارير الطبية مشفرة بتقنية AES-256 مع مطابقة بصمة SHA-256 عند المزامنة مع سجل المستشفى.
                </p>
              </div>
            )}
          </div>

          {/* Google Play / Mobile Frame Preview Switcher */}
          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border font-semibold transition-all cursor-pointer ${
              isMobileFrame
                ? 'bg-rose-50 text-rose-700 border-rose-300'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
            title="تبديل وضع معاينة شاشة الهاتف الذكي"
          >
            {isMobileFrame ? (
              <>
                <Smartphone className="w-3.5 h-3.5 text-rose-600" />
                <span className="hidden md:inline">هاتف Google Play</span>
              </>
            ) : (
              <>
                <Monitor className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden md:inline">عرض موسع</span>
              </>
            )}
          </button>

          {/* Google Play Download Modal Trigger */}
          <button
            onClick={onOpenPlayStoreModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white rounded-xl font-bold transition-all shadow-xs cursor-pointer"
            title="جاهز للنشر على متجر Google Play"
          >
            <Play className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span className="hidden sm:inline">Google Play</span>
          </button>
        </div>

        {/* Right / Role Switcher & SOS Emergency button */}
        <div className="flex items-center gap-2">
          {/* Account / Profile Button */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-xl border border-rose-200 text-xs font-bold transition-colors cursor-pointer"
            title="تسجيل حساب جديد أو تسجيل الدخول"
          >
            <UserCheck className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden sm:inline">حسابي: {userName.split(' ')[0]}</span>
            <span className="sm:hidden">حسابي</span>
          </button>

          {/* Role Switcher */}
          <div className="flex items-center bg-rose-50 p-1 rounded-xl border border-rose-200">
            <button
              onClick={() => setRole('patient')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentRole === 'patient'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-rose-800 hover:text-rose-950'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>المريضة</span>
            </button>
            <button
              onClick={() => setRole('doctor')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentRole === 'doctor'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-rose-800 hover:text-rose-950'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>لوحة الطبيب</span>
            </button>
          </div>

          {/* 24/7 Tech & Medical Support */}
          <button
            onClick={onOpenSupport}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
            title="الدعم الفني والمساندة 24/7"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* 24/7 Emergency SOS Call */}
          <button
            onClick={onOpenSOS}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-xl text-xs font-bold shadow-md shadow-red-200 transition-all cursor-pointer"
            title="اتصال طوارئ فوري بالأورام 24/7"
          >
            <PhoneCall className="w-3.5 h-3.5 animate-bounce" />
            <span className="hidden sm:inline">طوارئ 24/7</span>
          </button>
        </div>

      </div>
    </header>
  );
};
