import React, { useState } from 'react';
import { 
  Pill, 
  Calendar, 
  Activity, 
  Bot, 
  MessageCircle, 
  PhoneCall, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Send, 
  Volume2, 
  FileText, 
  Heart, 
  ShieldCheck, 
  ChevronRight, 
  Sparkles,
  RefreshCw,
  Bell
} from 'lucide-react';
import { PatientData, Medication, Session, LabResult, ChatMessage, AiChatMessage } from '../types';
import { speakArabicText } from '../utils/audio';

interface PatientViewProps {
  patientData: PatientData;
  onToggleMedication: (medId: string, currentStatus: boolean) => void;
  onTriggerCall: (title: string, details: string) => void;
  onTriggerSMS: (message: string) => void;
  onOpenReportModal: () => void;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  fontSize: 'normal' | 'large' | 'xlarge';
}

export const PatientView: React.FC<PatientViewProps> = ({
  patientData,
  onToggleMedication,
  onTriggerCall,
  onTriggerSMS,
  onOpenReportModal,
  messages,
  onSendMessage,
  fontSize,
}) => {
  const [activeTab, setActiveTab] = useState<'meds' | 'sessions' | 'labs' | 'ai' | 'chat'>('meds');
  
  // AI Assistant State
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiChat, setAiChat] = useState<AiChatMessage[]>([
    {
      role: 'assistant',
      content: 'مرحباً بكِ عزيزتي فاطمة 🌸. أنا "د. وردة"، رفيقتك ومساعدتك الطبية الذكية. يمكنكِ سؤالي في أي وقت عن كيفية التعامل مع الأعراض الجانبية (مثل الغثيان أو الإجهاد)، التغذية الصحية لمحاربات سرطان الثدي، أو التحضير لجلسات العلاج. كيف يمكنني مساندتكِ اليوم؟',
      timestamp: 'الآن',
    },
  ]);

  // Doctor Chat State
  const [doctorChatInput, setDoctorChatInput] = useState('');

  // Font sizing classes
  const fontMultiplier = 
    fontSize === 'xlarge' ? 'text-lg leading-relaxed' : 
    fontSize === 'large' ? 'text-base leading-normal' : 
    'text-sm leading-normal';

  const headingMultiplier = 
    fontSize === 'xlarge' ? 'text-xl font-black' : 
    fontSize === 'large' ? 'text-lg font-bold' : 
    'text-base font-bold';

  const handleSendAiMessage = async (customPrompt?: string) => {
    const promptToSend = customPrompt || aiInput;
    if (!promptToSend.trim() || isAiLoading) return;

    const userMsg: AiChatMessage = {
      role: 'user',
      content: promptToSend.trim(),
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    };

    setAiChat((prev) => [...prev, userMsg]);
    if (!customPrompt) setAiInput('');
    setIsAiLoading(true);

    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToSend.trim(),
          chatHistory: aiChat,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setAiChat((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.reply,
            timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch (e) {
      console.error(e);
      setAiChat((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'عزيزتي فاطمة، يبدو أن هناك ضغطاً مؤقتاً في الاتصال. تذكري أن الراحة وتناول السوائل هما الأهم، ويمكنكِ الاتصال المباشر بالطبيبة عبر زر المحادثة في أي وقت.',
          timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSendDoctorChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorChatInput.trim()) return;
    onSendMessage(doctorChatInput.trim());
    setDoctorChatInput('');
  };

  const nextSession = patientData.sessions[0];
  const pendingMeds = patientData.medications.filter((m) => !m.takenToday);

  return (
    <div className="space-y-5 pb-12">
      
      {/* Patient Welcome Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white p-5 sm:p-7 shadow-xl shadow-rose-200">
        <div className="absolute top-0 -left-10 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-xs">
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>محاربة وبطلة الأمل: {patientData.name}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              صباح الصحة والشفاء، {patientData.name.split(' ')[0]} 🌸
            </h2>
            <p className="text-rose-100 text-xs sm:text-sm max-w-xl leading-relaxed">
              التشخيص: {patientData.diagnosis} • {patientData.stage}. طبيبك المعالج: {patientData.attendingPhysician}.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2">
              <button
                onClick={() => onTriggerCall(
                  "تذكير صوتي بدواء تاموكسيفين",
                  "حان موعد أخذ جرعة تاموكسيفين 20 ملغ اليومية مع كوب ماء وفير"
                )}
                className="px-3.5 py-2 bg-white text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-transform active:scale-95 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-rose-600 animate-pulse" />
                <span>جرّبي تذكير الاتصال الهاتفي 📞</span>
              </button>

              <button
                onClick={onOpenReportModal}
                className="px-3.5 py-2 bg-rose-900/60 hover:bg-rose-900/80 text-white border border-white/20 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>تصدير تقريرك الطبي (PDF)</span>
              </button>
            </div>
          </div>

          {/* Adherence & Next Session Pill Widget */}
          <div className="w-full md:w-auto bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex md:flex-col justify-around gap-3 shrink-0 text-center">
            <div>
              <span className="text-[11px] text-rose-200 block">نسبة الالتزام بالأدوية</span>
              <div className="text-2xl font-black text-white font-mono mt-0.5">
                {patientData.vitalSigns.adherenceRate}%
              </div>
              <span className="text-[10px] text-emerald-300 font-bold">مستوى ممتاز جداً</span>
            </div>

            <div className="border-r md:border-r-0 md:border-t border-white/20 pr-3 md:pr-0 md:pt-2">
              <span className="text-[11px] text-rose-200 block">الجلسة القادمة</span>
              <div className="text-xs font-bold text-white mt-0.5">{nextSession?.date || '15 أكتوبر'}</div>
              <span className="text-[10px] text-rose-200 truncate block max-w-[130px]">
                {nextSession?.title || 'علاج كيماوي'}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-slate-200">
        <button
          onClick={() => setActiveTab('meds')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'meds'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-200'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <Pill className="w-4 h-4" />
          <span>الأدوية اليومية</span>
          {pendingMeds.length > 0 && (
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              activeTab === 'meds' ? 'bg-white text-rose-700' : 'bg-rose-100 text-rose-700'
            }`}>
              {pendingMeds.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('sessions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'sessions'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-200'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>الجلسات والفحوصات ({patientData.sessions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('labs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'labs'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-200'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>نتائج المختبر الفورية</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        </button>

        <button
          onClick={() => setActiveTab('ai')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'ai'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-200'
              : 'bg-white text-purple-700 hover:text-purple-900 border border-purple-200'
          }`}
        >
          <Bot className="w-4 h-4 text-purple-300" />
          <span>المساعد الذكي (د. وردة)</span>
          <Sparkles className="w-3 h-3 text-amber-300" />
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'chat'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-200'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>محادثة الطبيب المباشرة</span>
        </button>
      </div>

      {/* Tab 1: Medications View */}
      {activeTab === 'meds' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className={headingMultiplier}>جدول الأدوية والتذكيرات اليومية</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                تصلك تنبيهات عبر المكالمات الهاتفية والإشعارات لضمان عدم تفويت أي جرعة
              </p>
            </div>
            <div className="text-xs text-slate-600">
              المتبقي لليوم: <strong className="text-rose-600 font-bold">{pendingMeds.length} جرعات</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patientData.medications.map((med) => (
              <div
                key={med.id}
                className={`p-4 rounded-3xl border transition-all ${
                  med.takenToday
                    ? 'bg-emerald-50/70 border-emerald-200 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-rose-300 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                      med.takenToday ? 'bg-emerald-600 text-white' : 'bg-rose-100 text-rose-700'
                    }`}>
                      <Pill className="w-6 h-6" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className={`font-bold text-slate-900 ${fontMultiplier}`}>{med.name}</h4>
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          {med.dosage}
                        </span>
                      </div>
                      <p className="text-xs text-rose-700 font-semibold mt-0.5">{med.category}</p>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{med.instructions}</p>
                      
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1 text-slate-700 font-bold">
                          <Clock className="w-3.5 h-3.5 text-rose-600" />
                          <span>{med.time}</span>
                        </span>
                        <span>• المتبقي بالعلبة: {med.remainingPills} قرص</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <button
                    onClick={() => onToggleMedication(med.id, med.takenToday)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      med.takenToday
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{med.takenToday ? 'تم أخذ الجرعة اليوم ✓' : 'تأكيد أخذ الدواء الآن'}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {/* Trigger simulated call */}
                    <button
                      onClick={() => onTriggerCall(
                        `تذكير بدواء ${med.name}`,
                        `حان الآن موعد أخذ جرعة ${med.name} (${med.dosage}) - ${med.instructions}`
                      )}
                      className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      title="رنّ على هاتفي لتذكيري الآن"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
                      <span>اتصال بالجوال 📞</span>
                    </button>

                    {/* Listen with TTS */}
                    <button
                      onClick={() => speakArabicText(`تذكير بدواء ${med.name}، الجرعة ${med.dosage}. التعليمات: ${med.instructions}`)}
                      className="p-2 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                      title="قراءة التعليمات بصوت مسموع"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Sessions & Chemo Schedule */}
      {activeTab === 'sessions' && (
        <div className="space-y-4">
          <div>
            <h3 className={headingMultiplier}>مواعيد جلسات العلاج والفحوصات الدورية</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              جدول جلسات الكيماوي، الماموجرام، والمراجعات الطبية مع خدمة التذكير المسبق
            </p>
          </div>

          <div className="space-y-3">
            {patientData.sessions.map((sess) => (
              <div
                key={sess.id}
                className="p-5 bg-white rounded-3xl border border-slate-200 hover:border-rose-300 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex flex-col items-center justify-center shrink-0">
                    <Calendar className="w-6 h-6 mb-0.5" />
                    <span className="text-[10px] font-bold font-mono">{sess.date.split('-')[2]} أكتوبر</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-base">{sess.title}</h4>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">
                        {sess.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 flex flex-wrap items-center gap-3">
                      <span>⏰ <strong>{sess.time}</strong></span>
                      <span>🏥 <strong>{sess.location}</strong></span>
                      <span>👨‍⚕️ <strong>{sess.doctor}</strong></span>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 mt-2">
                      <strong className="text-rose-800">تعليمات التحضير: </strong>
                      {sess.prepNotes}
                    </div>
                  </div>
                </div>

                <div className="flex md:flex-col gap-2 shrink-0 w-full md:w-auto">
                  <button
                    onClick={() => onTriggerCall(
                      `تذكير بجلسة ${sess.title}`,
                      `موعد جلستك القادمة يوم ${sess.date} في تمام الساعة ${sess.time} في ${sess.location}. ${sess.prepNotes}`
                    )}
                    className="flex-1 md:flex-initial px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-rose-200 transition-all cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>مكالمة تذكير للجلسة</span>
                  </button>

                  <button
                    onClick={() => speakArabicText(`تذكير بموعد الجلسة: ${sess.title}. الموعد يوم ${sess.date} الساعة ${sess.time}. المكان: ${sess.location}. ملاحظة: ${sess.prepNotes}`)}
                    className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>استمع للتعليمات</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Lab Results with Alerts */}
      {activeTab === 'labs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className={headingMultiplier}>نتائج التحاليل المخبرية المعتمدة</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                تحديث فوري وإشعار لحظي فور صدور النتائج من مختبر المستشفى
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>نتائج مؤكدة من المختبر</span>
            </span>
          </div>

          <div className="space-y-4">
            {patientData.labResults.map((lab) => (
              <div
                key={lab.id}
                className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-base">{lab.testName}</h4>
                      {lab.isNew && (
                        <span className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-bold rounded-full animate-pulse">
                          جديد
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 font-mono">تاريخ الفحص: {lab.date} ({lab.time})</span>
                  </div>

                  <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200">
                    {lab.status}
                  </span>
                </div>

                {/* Parameters Table */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {lab.parameters.map((param, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-[11px] text-slate-500 block truncate">{param.name}</span>
                      <div className="text-base font-bold font-mono text-slate-900 mt-1">{param.value}</div>
                      <span className="text-[10px] text-slate-500 block mt-0.5">المعدل الطبيعي: {param.range}</span>
                    </div>
                  ))}
                </div>

                {/* Doctor Note */}
                <div className="p-3 bg-rose-50/70 rounded-2xl border border-rose-200 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
                    <Heart className="w-4 h-4 fill-white" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-rose-900 block">توجيه الدكتورة سارة المنصور:</span>
                    <p className="text-xs text-slate-800 leading-relaxed mt-0.5">{lab.doctorNote}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: AI Medical Assistant (Dr. Warda) */}
      {activeTab === 'ai' && (
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-purple-900 via-indigo-950 to-purple-900 text-white rounded-3xl border border-purple-500/30 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-500 flex items-center justify-center text-white shadow-md">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-white">د. وردة - المساعد الطبي الذكي</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/40 text-purple-200 font-bold border border-purple-400/30">
                    Gemini AI Onco-Care
                  </span>
                </div>
                <p className="text-xs text-purple-200 leading-relaxed">
                  مساعد فوري للإجابة على تساؤلاتك الطبية عن الأعراض الجانبية، التغذية، والتحضير النفسي والبدني
                </p>
              </div>
            </div>
          </div>

          {/* Quick Suggestion Chips */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-600">أسئلة شائعة وسريعة يمكنكِ الضغط عليها:</span>
            <div className="flex flex-wrap gap-2">
              {[
                "كيف أخفف من الغثيان بعد جلسة الكيماوي؟",
                "ما هي الأطعمة المفيدة لرفع المناعة وتعداد الدم؟",
                "أشعر بإجهاد وتعب مستمر، ما أفضل نصائح للراحة؟",
                "نصائح للتعامل مع تساقط الشعر والهبات الساخنة",
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendAiMessage(chip)}
                  disabled={isAiLoading}
                  className="text-xs px-3 py-1.5 bg-white hover:bg-purple-50 text-purple-900 border border-purple-200 rounded-full font-medium transition-all shadow-2xs hover:border-purple-400 cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* AI Chat History */}
          <div className="bg-white rounded-3xl border border-slate-200 p-4 min-h-[340px] max-h-[460px] overflow-y-auto space-y-3.5 shadow-inner">
            {aiChat.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-rose-600 text-white rounded-br-xs'
                      : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>
                  
                  <div className="mt-2 flex items-center justify-between text-[10px] opacity-75">
                    <span>{msg.timestamp}</span>
                    {msg.role === 'assistant' && (
                      <button
                        onClick={() => speakArabicText(msg.content)}
                        className="flex items-center gap-1 hover:opacity-100 text-purple-700 font-bold cursor-pointer"
                        title="استمع للإجابة بصوت واضح"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>استمع بصوت مسموع</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isAiLoading && (
              <div className="flex items-center gap-2 p-3 bg-purple-50 text-purple-800 rounded-2xl w-fit text-xs border border-purple-200 animate-pulse">
                <Sparkles className="w-4 h-4 text-purple-600 animate-spin" />
                <span>د. وردة تقوم بصياغة التوجيه الطبي الداعم لكِ...</span>
              </div>
            )}
          </div>

          {/* AI Input Box */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="اكتبي سؤالك أو استفسارك هنا (مثلاً: هل ممارسة رياضة المشي آمنة؟)..."
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendAiMessage()}
              disabled={isAiLoading}
              className="flex-1 p-3.5 bg-white border border-slate-300 rounded-2xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={() => handleSendAiMessage()}
              disabled={isAiLoading || !aiInput.trim()}
              className="px-5 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>إرسال</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 5: Doctor Direct Chat */}
      {activeTab === 'chat' && (
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                د.س
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">{patientData.attendingPhysician}</h4>
                <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>متصلة بالعيادة لمتابعة حالتكِ</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onTriggerCall(
                "استشارة طبية هاتفية",
                "اتصال من عيادة الدكتورة سارة المنصور للاطمئنان على استجابتك للعلاج"
              )}
              className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>طلب اتصال مباشر</span>
            </button>
          </div>

          {/* Quick Symptom Chips to Doctor */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-bold text-slate-600 self-center">إبلاغ سريع:</span>
            {[
              "أشعر بغثيان خفيف بعد الجرعة",
              "ارتفعت حرارتي قليلاً إلى 37.4",
              "هل يمكن تأخير موعد الجلسة ساعة؟",
              "الحمد لله أشعر بتحسن كبير اليوم",
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => onSendMessage(chip)}
                className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 rounded-xl border border-slate-200 transition-colors cursor-pointer"
              >
                + {chip}
              </button>
            ))}
          </div>

          {/* Messages list */}
          <div className="bg-white rounded-3xl border border-slate-200 p-4 min-h-[300px] max-h-[420px] overflow-y-auto space-y-3 shadow-inner">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'patient' ? 'items-end' : 'items-start'}`}
              >
                <span className="text-[10px] text-slate-400 mb-1 px-1">
                  {msg.senderName} • {msg.timestamp}
                </span>
                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm max-w-[80%] leading-relaxed ${
                    msg.sender === 'patient'
                      ? 'bg-rose-600 text-white rounded-br-xs'
                      : 'bg-slate-100 text-slate-800 rounded-bl-xs border border-slate-200'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendDoctorChat} className="flex gap-2">
            <input
              type="text"
              placeholder="اكتبي رسالتك المباشرة للدكتورة سارة..."
              value={doctorChatInput}
              onChange={(e) => setDoctorChatInput(e.target.value)}
              className="flex-1 p-3.5 bg-white border border-slate-300 rounded-2xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500"
            />
            <button
              type="submit"
              disabled={!doctorChatInput.trim()}
              className="px-5 py-3.5 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>إرسال</span>
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
