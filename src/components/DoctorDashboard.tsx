import React, { useState } from 'react';
import { 
  Stethoscope, 
  User, 
  Activity, 
  Calendar, 
  Pill, 
  FileText, 
  ShieldCheck, 
  Plus, 
  Send, 
  RefreshCw, 
  PhoneCall, 
  Bell, 
  CheckCircle2, 
  AlertTriangle,
  Lock,
  Database
} from 'lucide-react';
import { PatientData, ChatMessage } from '../types';

interface DoctorDashboardProps {
  patientData: PatientData;
  onAddSession: (sessionData: any) => void;
  onAddMedication: (medData: any) => void;
  onUpdateVitals: (vitalsData: any) => void;
  onSyncEhr: () => void;
  onTriggerCall: (title: string, details: string) => void;
  onOpenReportModal: () => void;
  messages: ChatMessage[];
  onDoctorSendMessage: (text: string) => void;
  ehrSyncing: boolean;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  patientData,
  onAddSession,
  onAddMedication,
  onUpdateVitals,
  onSyncEhr,
  onTriggerCall,
  onOpenReportModal,
  messages,
  onDoctorSendMessage,
  ehrSyncing,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'meds' | 'chat'>('overview');
  
  // Modals / Form toggles
  const [showAddSessionModal, setShowAddSessionModal] = useState(false);
  const [showAddMedModal, setShowAddMedModal] = useState(false);

  // Form states
  const [sessTitle, setSessTitle] = useState('');
  const [sessDate, setSessDate] = useState('');
  const [sessTime, setSessTime] = useState('');
  const [sessPrep, setSessPrep] = useState('');

  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medTime, setMedTime] = useState('');
  const [medInstructions, setMedInstructions] = useState('');
  const [medCategory, setMedCategory] = useState('علاج هرموني موجه');

  const [doctorReplyText, setDoctorReplyText] = useState('');

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessTitle.trim()) return;
    onAddSession({
      title: sessTitle,
      date: sessDate || '2026-10-20',
      time: sessTime || '10:00 ص',
      location: 'مركز الأورام - الرعاية النهارية',
      prepNotes: sessPrep || 'إجراء فحص دم مخبري قبل الجلسة بيوم.',
    });
    setSessTitle('');
    setSessPrep('');
    setShowAddSessionModal(false);
  };

  const handleCreateMed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName.trim()) return;
    onAddMedication({
      name: medName,
      dosage: medDosage || '10 ملغ',
      time: medTime || '09:00 ص',
      instructions: medInstructions || 'تناول الجرعة بعد الطعام',
      category: medCategory,
    });
    setMedName('');
    setMedDosage('');
    setMedInstructions('');
    setShowAddMedModal(false);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorReplyText.trim()) return;
    onDoctorSendMessage(doctorReplyText.trim());
    setDoctorReplyText('');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Doctor Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl border border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-600 flex items-center justify-center text-white shadow-md">
            <Stethoscope className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">لوحة تحكم واستشاري الأورام</h2>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                قناة طبية آمنة ومشفرة
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {patientData.attendingPhysician} • {patientData.hospital}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onSyncEhr}
            disabled={ehrSyncing}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="مزامنة مع السجل الصحي الإلكتروني للمستشفى (FHIR/EHR)"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${ehrSyncing ? 'animate-spin' : ''}`} />
            <span>{ehrSyncing ? 'جاري المزامنة...' : 'مزامنة سجل المستشفى (EHR)'}</span>
          </button>

          <button
            onClick={onOpenReportModal}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>طباعة التقرير الطبي PDF</span>
          </button>
        </div>
      </div>

      {/* Patient Vital Overview & Clinical Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Patient Card */}
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-black">
                ف
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">{patientData.name}</h4>
                <span className="text-[11px] text-slate-500 font-mono">الملف: {patientData.id} • {patientData.age} سنة</span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
              {patientData.bloodType}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <span className="text-slate-500 block">التشخيص:</span>
              <strong className="text-slate-800">{patientData.diagnosis}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">المرحلة السريرية والمستقبلات:</span>
              <strong className="text-rose-700 font-bold block">{patientData.stage}</strong>
              <span className="text-[11px] text-slate-600 font-mono block mt-0.5">{patientData.receptors}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">الالتزام بالبروتوكول:</span>
            <span className="font-bold text-emerald-600 font-mono text-sm">{patientData.vitalSigns.adherenceRate}% ✓</span>
          </div>
        </div>

        {/* Real-time Vitals */}
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-rose-600" />
              <span>المؤشرات الحيوية المقاسة اليوم</span>
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">تحديث مستمر</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[11px]">حرارة الجسم</span>
              <strong className="text-sm font-mono text-slate-900">{patientData.vitalSigns.temperature}</strong>
              <span className="text-[10px] text-emerald-600 block">طبيعية (&lt; 38°C)</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[11px]">ضغط الدم</span>
              <strong className="text-sm font-mono text-slate-900">{patientData.vitalSigns.bloodPressure}</strong>
              <span className="text-[10px] text-emerald-600 block">مستقر</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[11px]">النبض</span>
              <strong className="text-sm font-mono text-slate-900">{patientData.vitalSigns.pulse}</strong>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[11px]">الوزن</span>
              <strong className="text-sm font-mono text-slate-900">{patientData.vitalSigns.weight}</strong>
            </div>
          </div>

          <div className="p-2.5 bg-amber-50/70 rounded-xl border border-amber-200 text-xs">
            <span className="text-amber-900 font-bold block mb-1">الأعراض الجانبية المسجلة من المريضة:</span>
            <div className="flex flex-wrap gap-1">
              {patientData.vitalSigns.lastReportedSideEffects.map((side, i) => (
                <span key={i} className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded-md text-[11px] font-medium">
                  {side}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Clinical Direct Actions */}
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <h4 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
            إجراءات التدخل والاتصال الفوري
          </h4>

          <div className="space-y-2 text-xs">
            {/* Direct Call to Patient */}
            <button
              onClick={() => onTriggerCall(
                "اتصال من العيادة - د. سارة المنصور",
                "السلام عليكم فاطمة، مكالمة هاتفية مباشرة من د. سارة المنصور للاطمئنان على وضعك بعد الجلسة ومراجعة الخطة."
              )}
              className="w-full p-3 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-2xl border border-rose-200 font-bold flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-rose-600" />
                <span>إجراء اتصال هاتفي فوري بالمريضة</span>
              </div>
              <span className="text-[10px] bg-rose-200/80 px-2 py-0.5 rounded-full">رنين الآن</span>
            </button>

            {/* Schedule Session Button */}
            <button
              onClick={() => setShowAddSessionModal(true)}
              className="w-full p-3 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-2xl border border-slate-200 font-bold flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-600" />
                <span>جدولة جلسة علاج أو فحص جديد</span>
              </div>
              <Plus className="w-4 h-4 text-slate-600" />
            </button>

            {/* Prescribe Medication Button */}
            <button
              onClick={() => setShowAddMedModal(true)}
              className="w-full p-3 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-2xl border border-slate-200 font-bold flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Pill className="w-4 h-4 text-slate-600" />
                <span>وصف دواء أو تعديل بروتوكول</span>
              </div>
              <Plus className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>

      </div>

      {/* Tabs for Detailed Management */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'overview' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
          }`}
        >
          التحاليل والفحوصات المخبرية ({patientData.labResults.length})
        </button>

        <button
          onClick={() => setActiveTab('sessions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'sessions' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
          }`}
        >
          الجلسات المجدولة ({patientData.sessions.length})
        </button>

        <button
          onClick={() => setActiveTab('meds')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'meds' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
          }`}
        >
          الأدوية الموصوفة ({patientData.medications.length})
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'chat' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
          }`}
        >
          محادثة المريضة المباشرة ({messages.length})
        </button>
      </div>

      {/* Tab 1: Labs Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {patientData.labResults.map((lab) => (
              <div key={lab.id} className="p-4 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <strong className="text-slate-900 font-bold">{lab.testName}</strong>
                  <span className="text-[10px] text-slate-500 font-mono">{lab.date}</span>
                </div>

                <div className="space-y-1.5">
                  {lab.parameters.map((p, i) => (
                    <div key={i} className="flex justify-between items-center text-[11px] p-1.5 bg-slate-50 rounded-lg">
                      <span className="text-slate-600">{p.name}</span>
                      <strong className="font-mono text-slate-900">{p.value}</strong>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200 text-[11px] text-rose-900">
                  <strong>التقييم الطبي: </strong>{lab.doctorNote}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Sessions Management */}
      {activeTab === 'sessions' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-sm text-slate-900">قائمة الجلسات والمواعيد القادمة</h4>
            <button
              onClick={() => setShowAddSessionModal(true)}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة جلسة جديدة</span>
            </button>
          </div>

          <div className="space-y-3">
            {patientData.sessions.map((sess) => (
              <div key={sess.id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-sm text-slate-900">{sess.title}</strong>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono font-bold">
                      {sess.date} - {sess.time}
                    </span>
                  </div>
                  <p className="text-slate-500 mt-1">{sess.location} • {sess.prepNotes}</p>
                </div>

                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg font-bold border border-emerald-200">
                  {sess.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Prescriptions */}
      {activeTab === 'meds' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-sm text-slate-900">البروتوكول الدوائي المعتمد للمريضة</h4>
            <button
              onClick={() => setShowAddMedModal(true)}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>وصف دواء إضافي</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {patientData.medications.map((m) => (
              <div key={m.id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <strong className="text-sm text-slate-900">{m.name}</strong>
                    <span className="block text-rose-700 font-semibold">{m.category}</span>
                  </div>
                  <span className="font-mono font-bold px-2 py-0.5 bg-slate-100 rounded-lg">{m.dosage}</span>
                </div>
                <p className="text-slate-600">{m.instructions}</p>
                <div className="flex justify-between text-slate-500 text-[11px] pt-2 border-t border-slate-100">
                  <span>التوقيت: {m.time}</span>
                  <span>المتبقي: {m.remainingPills} حبة</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Doctor Chat */}
      {activeTab === 'chat' && (
        <div className="space-y-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <h4 className="font-bold text-sm text-slate-900">محادثة المتابعة المباشرة مع المريضة فاطمة</h4>
          
          <div className="min-h-[260px] max-h-[380px] overflow-y-auto space-y-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
            {messages.map((m) => (
              <div key={m.id} className={`flex flex-col ${m.sender === 'doctor' ? 'items-end' : 'items-start'}`}>
                <span className="text-[10px] text-slate-400 mb-0.5">{m.senderName} • {m.timestamp}</span>
                <div className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[80%] ${
                  m.sender === 'doctor' ? 'bg-slate-900 text-white' : 'bg-white text-slate-800 border border-slate-200'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendReply} className="flex gap-2">
            <input
              type="text"
              placeholder="اكتبي توجيهك أو ردك الطبي للمريضة..."
              value={doctorReplyText}
              onChange={(e) => setDoctorReplyText(e.target.value)}
              className="flex-1 p-3 bg-slate-50 border border-slate-300 rounded-2xl text-xs focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            />
            <button
              type="submit"
              disabled={!doctorReplyText.trim()}
              className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>إرسال الرد</span>
            </button>
          </form>
        </div>
      )}

      {/* Add Session Modal */}
      {showAddSessionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900">جدولة جلسة علاجية أو فحص جديد</h3>
            
            <form onSubmit={handleCreateSession} className="space-y-3">
              <div>
                <label className="block text-slate-600 mb-1">اسم الجلسة / الفحص:</label>
                <input
                  type="text"
                  placeholder="مثال: جلسة علاج كيماوي دورة 5"
                  value={sessTitle}
                  onChange={(e) => setSessTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 mb-1">التاريخ:</label>
                  <input
                    type="date"
                    value={sessDate}
                    onChange={(e) => setSessDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">الوقت:</label>
                  <input
                    type="text"
                    placeholder="10:00 صباحاً"
                    value={sessTime}
                    onChange={(e) => setSessTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">ملاحظات التحضير للمريضة:</label>
                <textarea
                  placeholder="الصيام، شرب السوائل، إلخ..."
                  value={sessPrep}
                  onChange={(e) => setSessPrep(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                  rows={2}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSessionModal(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 text-white rounded-xl font-bold cursor-pointer"
                >
                  تأكيد وحفظ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Medication Modal */}
      {showAddMedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900">وصف دواء جديد للمريضة</h3>
            
            <form onSubmit={handleCreateMed} className="space-y-3">
              <div>
                <label className="block text-slate-600 mb-1">اسم الدواء العلمي والتجاري:</label>
                <input
                  type="text"
                  placeholder="مثال: تاموكسيفين / ديكساميثازون"
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 mb-1">الجرعة:</label>
                  <input
                    type="text"
                    placeholder="20 ملغ"
                    value={medDosage}
                    onChange={(e) => setMedDosage(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">توقيت الجرعة:</label>
                  <input
                    type="text"
                    placeholder="08:00 صباحاً"
                    value={medTime}
                    onChange={(e) => setMedTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">تعليمات الاستخدام:</label>
                <input
                  type="text"
                  placeholder="قرص واحد بعد الوجبة مع كوب ماء"
                  value={medInstructions}
                  onChange={(e) => setMedInstructions(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMedModal(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 text-white rounded-xl font-bold cursor-pointer"
                >
                  إضافة للجدول
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
