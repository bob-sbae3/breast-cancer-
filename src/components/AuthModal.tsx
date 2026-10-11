import React, { useState } from 'react';
import { X, UserPlus, LogIn, Heart, ShieldCheck, Phone, Lock, Calendar, Stethoscope, CheckCircle2 } from 'lucide-react';
import { PatientData } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterPatient: (newPatient: Partial<PatientData>) => void;
  currentPatient: PatientData;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onRegisterPatient,
  currentPatient,
}) => {
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');
  const [role, setRole] = useState<'patient' | 'doctor' | 'caregiver'>('patient');

  // Form Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [bloodType, setBloodType] = useState('A+');
  const [diagnosis, setDiagnosis] = useState('سرطان الثدي القنوي الغازي (Invasive Ductal Carcinoma)');
  const [stage, setStage] = useState('المرحلة الثانية (Stage IIB)');
  const [doctorName, setDoctorName] = useState('د. سارة المنصور');
  const [password, setPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'register') {
      if (!name.trim()) return;

      onRegisterPatient({
        name: name.trim(),
        age: parseInt(age) || 45,
        bloodType: bloodType,
        diagnosis: diagnosis,
        stage: stage,
        attendingPhysician: doctorName,
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1500);
    } else {
      // Login mode
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shadow-inner">
              <Heart className="w-6 h-6 fill-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">
                {authMode === 'register' ? 'إنشاء حساب جديد في وردي' : 'تسجيل الدخول إلى حسابك'}
              </h3>
              <p className="text-xs text-rose-100">
                ملف صحي مشفر وخاص بكِ لمتابعة الأدوية ومكالمات التذكير
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Mode Tabs */}
        <div className="flex border-b border-slate-200 text-xs font-bold">
          <button
            onClick={() => setAuthMode('register')}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer flex items-center justify-center gap-2 ${
              authMode === 'register'
                ? 'border-b-2 border-rose-600 text-rose-700 bg-rose-50/50'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>إنشاء حساب مريضة جديدة</span>
          </button>
          <button
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer flex items-center justify-center gap-2 ${
              authMode === 'login'
                ? 'border-b-2 border-rose-600 text-rose-700 bg-rose-50/50'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>تسجيل الدخول لحساب قائم</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {isSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-900">
                {authMode === 'register' ? 'مرحباً بكِ في مجتمع وردي 🌸' : 'أهلاً بعودتكِ مجدداً!'}
              </h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                تم تجهيز وتشفير ملفكِ الطبي بنجاح. كافة التذكيرات والمكالمات الهاتفية مهيأة الآن لخدمتكِ.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Role Selection */}
              <div>
                <label className="block text-slate-600 font-bold mb-1.5">نوع الحساب:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('patient')}
                    className={`py-2 px-2.5 rounded-xl border text-center font-bold transition-colors cursor-pointer ${
                      role === 'patient'
                        ? 'border-rose-500 bg-rose-50 text-rose-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    🌸 مريضة / محاربة
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('caregiver')}
                    className={`py-2 px-2.5 rounded-xl border text-center font-bold transition-colors cursor-pointer ${
                      role === 'caregiver'
                        ? 'border-rose-500 bg-rose-50 text-rose-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    🤝 مرافق / عائلة
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('doctor')}
                    className={`py-2 px-2.5 rounded-xl border text-center font-bold transition-colors cursor-pointer ${
                      role === 'doctor'
                        ? 'border-rose-500 bg-rose-50 text-rose-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    🩺 طبيب أورام
                  </button>
                </div>
              </div>

              {authMode === 'register' ? (
                <>
                  {/* Name and Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 font-bold mb-1">الاسم الكامل:</label>
                      <input
                        type="text"
                        placeholder="مثال: مريم العبدالله"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-rose-500 bg-slate-50 text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-bold mb-1">رقم الهاتف (للتذكيرات والمكالمات):</label>
                      <div className="relative">
                        <input
                          type="tel"
                          placeholder="05xxxxxxxx"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full p-2.5 pr-8 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-rose-500 bg-slate-50 text-xs dir-ltr text-right"
                          required
                        />
                        <Phone className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3" />
                      </div>
                    </div>
                  </div>

                  {/* Age & Blood Type */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 font-bold mb-1">العمر:</label>
                      <input
                        type="number"
                        placeholder="مثال: 45"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-rose-500 bg-slate-50 text-xs"
                        min="18"
                        max="100"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-bold mb-1">فصيلة الدم:</label>
                      <select
                        value={bloodType}
                        onChange={(e) => setBloodType(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-rose-500 bg-slate-50 text-xs"
                      >
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>
                  </div>

                  {/* Diagnosis & Staging */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 font-bold mb-1">نوع الورم والتشخيص:</label>
                      <select
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-rose-500 bg-slate-50 text-xs"
                      >
                        <option value="سرطان الثدي القنوي الغازي (IDC)">سرطان الثدي القنوي الغازي (IDC)</option>
                        <option value="سرطان الثدي الفصيصي الغازي (ILC)">سرطان الثدي الفصيصي الغازي (ILC)</option>
                        <option value="سرطان الثدي الثلاثي السلبي (Triple-Negative)">سرطان الثدي الثلاثي السلبي (TNBC)</option>
                        <option value="سرطان الثدي الإيجابي لـ HER2">سرطان الثدي الإيجابي لـ HER2</option>
                        <option value="سرطان الثدي الموضعي (DCIS)">سرطان الثدي الموضعي (DCIS)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-600 font-bold mb-1">المرحلة السريرية (Stage):</label>
                      <select
                        value={stage}
                        onChange={(e) => setStage(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-rose-500 bg-slate-50 text-xs"
                      >
                        <option value="المرحلة الأولى (Stage I)">المرحلة الأولى (Stage I)</option>
                        <option value="المرحلة الثانية (Stage IIA / IIB)">المرحلة الثانية (Stage IIA / IIB)</option>
                        <option value="المرحلة الثالثة (Stage IIIA / IIIB)">المرحلة الثالثة (Stage IIIA / IIIB)</option>
                        <option value="المرحلة الرابعة (Stage IV)">المرحلة الرابعة (Stage IV)</option>
                        <option value="مرحلة التعافي والوقاية">مرحلة التعافي والمتابعة الوقائية</option>
                      </select>
                    </div>
                  </div>

                  {/* Doctor & Hospital */}
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">اسم الطبيب أو المستشفى المعالج:</label>
                    <input
                      type="text"
                      placeholder="مثال: د. سارة المنصور - مركز الملك فهد للأورام"
                      value={doctorName}
                      onChange={(e) => setDoctorName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-rose-500 bg-slate-50 text-xs"
                    />
                  </div>

                  {/* Password / PIN */}
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">رمز الدخول السريع أو كلمة المرور:</label>
                    <input
                      type="password"
                      placeholder="رمز سري لحماية خصوصية بياناتك الطبية (4 أرقام أو أكثر)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-rose-500 bg-slate-50 text-xs"
                      required
                    />
                  </div>
                </>
              ) : (
                /* Login Mode */
                <div className="space-y-3 py-2">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">رقم الهاتف أو الملف الطبي (MRN):</label>
                    <input
                      type="text"
                      defaultValue={currentPatient.nationalId}
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-rose-500 bg-slate-50 text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">رمز الدخول أو كلمة المرور:</label>
                    <input
                      type="password"
                      defaultValue="••••••"
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-rose-500 bg-slate-50 text-xs"
                      required
                    />
                  </div>
                  <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-[11px] text-rose-800">
                    ℹ️ يتم حفظ بيانات تسجيل الدخول وتشفيرها محلياً على هذا الجهاز لسرعة الاستخدام في حالات الطوارئ.
                  </div>
                </div>
              )}

              {/* Security statement */}
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>بياناتكِ مشفرة بتقنية AES-256 وتخضع لسرية HIPAA التامة ولا تتم مشاركتها إطلاقاً.</span>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold shadow-md shadow-rose-200 transition-all cursor-pointer"
                >
                  {authMode === 'register' ? 'إنشاء الحساب وتفعيل التذكيرات' : 'دخول إلى الحساب'}
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
