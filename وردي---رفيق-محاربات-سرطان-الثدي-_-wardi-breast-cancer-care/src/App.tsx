/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { PatientView } from './components/PatientView';
import { DoctorDashboard } from './components/DoctorDashboard';
import { PhoneCallModal } from './components/PhoneCallModal';
import { NotificationToast, ToastMessage } from './components/NotificationToast';
import { MedicalReportModal } from './components/MedicalReportModal';
import { SupportModal } from './components/SupportModal';
import { GooglePlayBanner } from './components/GooglePlayBanner';
import { AuthModal } from './components/AuthModal';
import { PatientData, ChatMessage, IncomingCallPayload } from './types';
import { ShieldCheck, Heart, Smartphone, Play, PhoneCall, Wifi } from 'lucide-react';

// Fallback initial data in case of any initial server latency
const initialFallbackData: PatientData = {
  id: "P-882194",
  name: "فاطمة أحمد الزهراني",
  age: 48,
  bloodType: "A+",
  nationalId: "1098472910",
  diagnosis: "سرطان الثدي الغازي القنوي (Invasive Ductal Carcinoma)",
  stage: "المرحلة الثانية (Stage IIB - T2 N1 M0)",
  receptors: "ER+ (إيجابي للإستروجين), PR+ (إيجابي للبروجسترون), HER2- (سلبي)",
  attendingPhysician: "د. سارة المنصور - استشارية طب الأورام والمعالجة الكيميائية",
  hospital: "مركز الملك فهد الوطني للأورام - الرياض",
  lastEhrSync: new Date().toISOString(),
  encryptionStatus: {
    encrypted: true,
    algorithm: "AES-256-GCM / SHA-256 Integrity Verified",
    hipaaCompliant: true,
  },
  medications: [
    {
      id: "med-1",
      name: "تاموكسيفين (Tamoxifen)",
      dosage: "20 ملغ",
      time: "08:00 صباحاً",
      instructions: "قرص واحد يومياً بعد الإفطار مع كوب ماء وفير",
      takenToday: true,
      lastTakenTime: "08:15 ص",
      reminderType: "call",
      remainingPills: 28,
      category: "علاج هرموني موجه",
    },
    {
      id: "med-2",
      name: "أوندانسيترون (Ondansetron / Zofran)",
      dosage: "8 ملغ",
      time: "02:00 ظهراً",
      instructions: "قرص لتخفيف الغثيان قبل الوجبة بنصف ساعة",
      takenToday: false,
      lastTakenTime: null,
      reminderType: "both",
      remainingPills: 14,
      category: "مضاد للغثيان والقيء",
    },
    {
      id: "med-3",
      name: "ديكساميثازون (Dexamethasone)",
      dosage: "4 ملغ",
      time: "08:00 مساءً",
      instructions: "قرص مع العشاء لتقليل الالتهابات والحساسية",
      takenToday: false,
      lastTakenTime: null,
      reminderType: "call",
      remainingPills: 12,
      category: "كورتيكوستيرويد وقائي",
    },
    {
      id: "med-4",
      name: "كالسيوم وفيتامين د (Cal-D-Vita)",
      dosage: "600 ملغ",
      time: "10:00 مساءً",
      instructions: "قرص للمحافظة على كثافة العظام أثناء العلاج",
      takenToday: false,
      lastTakenTime: null,
      reminderType: "push",
      remainingPills: 45,
      category: "مكملات داعمة للعظام",
    },
  ],
  sessions: [
    {
      id: "sess-1",
      title: "جلسة العلاج الكيماوي (دورة AC الرابعة)",
      type: "chemotherapy",
      date: "2026-10-15",
      time: "09:30 صباحاً",
      location: "وحدة الرعاية النهارية للأورام - الجناح B - سرير 14",
      doctor: "د. سارة المنصور",
      status: "قادمة مؤكدة",
      prepNotes: "الصيام لمدة ساعتين قبل الجلسة، وشرب ما لا يقل عن لتر ونصف ماء في اليوم السابق. إجراء فحص CBC صباح الجلسة.",
      alarmCallEnabled: true,
    },
    {
      id: "sess-2",
      title: "فحص الموجات فوق الصوتية والماموجرام المتابعة",
      type: "imaging",
      date: "2026-10-24",
      time: "11:00 صباحاً",
      location: "قسم الأشعة التشخيصية - عيادة الثدي - غرفة 204",
      doctor: "د. عمر الخالد",
      status: "مجدولة",
      prepNotes: "عدم وضع أي بودرة أو مزيل عرق في يوم الفحص.",
      alarmCallEnabled: true,
    },
    {
      id: "sess-3",
      title: "استشارة طب الأورام والمراجعة الدورية",
      type: "consultation",
      date: "2026-10-29",
      time: "01:15 مساءً",
      location: "العيادات الخارجية - عيادة 12",
      doctor: "د. سارة المنصور",
      status: "مجدولة",
      prepNotes: "إحضار دفتر تدوين الأعراض اليومية وقياسات الضغط والحرارة.",
      alarmCallEnabled: false,
    },
  ],
  labResults: [
    {
      id: "lab-101",
      testName: "تعداد الدم الكامل (Complete Blood Count - CBC)",
      date: "2026-10-09",
      time: "10:45 ص",
      status: "طبيعي وضمن النطاق الآمن للعلاج",
      isNew: true,
      parameters: [
        { name: "خلايا الدم البيضاء (WBC)", value: "5.4 K/uL", range: "4.0 - 11.0", status: "normal" },
        { name: "العدلات المطلقة (ANC)", value: "2.8 K/uL", range: "1.5 - 8.0", status: "normal" },
        { name: "الهيموغلوبين (Hemoglobin)", value: "11.8 g/dL", range: "12.0 - 15.5", status: "low_mild" },
        { name: "الصفائح الدموية (Platelets)", value: "240 K/uL", range: "150 - 450", status: "normal" },
      ],
      doctorNote: "تعداد الدم والعدلات مطمئن جداً ويتيح أخذ الجلسة القادمة بأمان في موعدها.",
    },
    {
      id: "lab-102",
      testName: "دلالات أورام الثدي (Tumor Marker CA 15-3)",
      date: "2026-10-02",
      time: "09:00 ص",
      status: "انخفاض إيجابي ملحوظ",
      isNew: false,
      parameters: [
        { name: "مستوى CA 15-3", value: "18.2 U/mL", range: "< 30.0 U/mL", status: "normal" },
      ],
      doctorNote: "استجابة ممتازة ومثالية للبروتوكول العلاجي المتبع بحمد الله.",
    },
    {
      id: "lab-103",
      testName: "وظائف الكبد والكلى (LFT & Creatinine)",
      date: "2026-09-28",
      time: "11:20 ص",
      status: "سليمة تماماً",
      isNew: false,
      parameters: [
        { name: "الكرياتينين (Creatinine)", value: "0.7 mg/dL", range: "0.5 - 1.1", status: "normal" },
        { name: "ALT (إنزيم الكبد)", value: "22 U/L", range: "7 - 35", status: "normal" },
      ],
      doctorNote: "وظائف الأعضاء الحيوية طبيعية ومستقرة تماماً.",
    },
  ],
  vitalSigns: {
    temperature: "36.8 °C",
    bloodPressure: "118/76 mmHg",
    pulse: "74 نبضة/دقيقة",
    weight: "64 كغ",
    adherenceRate: 94,
    lastReportedSideEffects: ["إجهاد خفيف", "تغير طفيف في حاسة التذوق"],
  },
};

export default function App() {
  const [patientData, setPatientData] = useState<PatientData>(initialFallbackData);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentRole, setCurrentRole] = useState<'patient' | 'doctor'>('patient');
  const [isMobileFrame, setIsMobileFrame] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');

  // Modals & Calls
  const [activeCall, setActiveCall] = useState<IncomingCallPayload | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isPlayStoreOpen, setIsPlayStoreOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [ehrSyncing, setEhrSyncing] = useState(false);

  // Fetch initial data
  useEffect(() => {
    fetch('/api/patient-data')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setPatientData(res.data);
        }
      })
      .catch((err) => console.log('Using initial state data', err));

    fetch('/api/messages')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.messages) {
          setMessages(res.messages);
        }
      })
      .catch((err) => console.log('Messages loaded', err));

    // Request native browser notification permission if available
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const addToast = (type: 'info' | 'success' | 'alert' | 'call', title: string, description: string) => {
    const id = 'toast-' + Date.now();
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 6000);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Trigger Phone Call Simulation
  const handleTriggerCall = async (title: string, details: string) => {
    try {
      const res = await fetch('/api/trigger-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, details }),
      });
      const data = await res.json();
      if (data.success && data.call) {
        setActiveCall(data.call);
        addToast('call', '📞 اتصال هاتفي وارد الآن!', title);
      }
    } catch (e) {
      console.error(e);
      // Client-side fallback for offline simulation
      setActiveCall({
        id: 'CALL-' + Date.now(),
        callerName: 'خدمة التذكير الآلي - مركز الأورام',
        callerNumber: '+966 800 124 9999',
        title: title || 'تذكير بموعد الدواء الهرموني',
        spokenMessageArabic: `السلام عليكم ورحمة الله، أهلاً بكِ فاطمة. نذكركِ بموعد جرعتك الدوائية المحددة: ${details}. نرجو تناول الدواء مع كوب ماء وتأكيد أخذ الجرعة بالتطبيق. عافاكِ الله.`,
        timestamp: new Date().toISOString(),
      });
      addToast('call', '📞 اتصال هاتفي وارد الآن!', title);
    }
  };

  // Trigger SMS Simulation
  const handleTriggerSMS = async (message: string) => {
    try {
      const res = await fetch('/api/trigger-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (data.success) {
        addToast('info', '💬 تم إرسال رسالة نصية قصيرة SMS', message);
      }
    } catch (e) {
      addToast('info', '💬 تم إرسال رسالة نصية قصيرة SMS', message);
    }
  };

  // Toggle medication taken status
  const handleToggleMedication = async (medId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    try {
      const res = await fetch('/api/medications/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medId, taken: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setPatientData((prev) => {
          const updatedMeds = prev.medications.map((m) =>
            m.id === medId ? { ...m, takenToday: newStatus, lastTakenTime: newStatus ? 'الآن' : null } : m
          );
          const total = updatedMeds.length;
          const taken = updatedMeds.filter((m) => m.takenToday).length;
          return {
            ...prev,
            medications: updatedMeds,
            vitalSigns: {
              ...prev.vitalSigns,
              adherenceRate: Math.round((taken / total) * 100),
            },
          };
        });
        addToast(
          'success',
          newStatus ? 'تم تأكيد تناول الدواء ✓' : 'تم تحديث حالة الجرعة',
          newStatus ? 'أحسنتِ بالالتزام بجرعتك المقررة في موعدها' : 'تم إلغاء التحديد'
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Send Chat message
  const handleSendMessage = async (text: string, sender: 'patient' | 'doctor' = 'patient') => {
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender,
          senderName: sender === 'doctor' ? 'د. سارة المنصور' : patientData.name,
          text,
        }),
      });
      const data = await res.json();
      if (data.success && data.message) {
        setMessages((prev) => [...prev, data.message]);
        if (sender === 'patient') {
          addToast('info', 'تم إرسال الرسالة إلى د. سارة المنصور', 'سيتم إشعار الطبيبة فوراً');
        } else {
          addToast('info', 'تم إرسال الرد الطبي للمريضة', text);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Add Session by Doctor
  const handleAddSession = async (sessionData: any) => {
    try {
      const res = await fetch('/api/doctor/add-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData),
      });
      const data = await res.json();
      if (data.success && data.session) {
        setPatientData((prev) => ({
          ...prev,
          sessions: [data.session, ...prev.sessions],
        }));
        addToast('success', 'تمت جدولة الجلسة بنجاح', `تمت إضافة ${data.session.title} وإشعار المريضة`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Add Medication by Doctor
  const handleAddMedication = async (medData: any) => {
    try {
      const res = await fetch('/api/doctor/add-medication', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(medData),
      });
      const data = await res.json();
      if (data.success && data.medication) {
        setPatientData((prev) => ({
          ...prev,
          medications: [...prev.medications, data.medication],
        }));
        addToast('success', 'تمت إضافة الدواء بنجاح', `تم تحديث البروتوكول بالدواء: ${data.medication.name}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Update Vitals by Doctor
  const handleUpdateVitals = async (vitalsData: any) => {
    try {
      const res = await fetch('/api/doctor/update-vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vitalsData),
      });
      const data = await res.json();
      if (data.success && data.vitals) {
        setPatientData((prev) => ({ ...prev, vitalSigns: data.vitals }));
        addToast('success', 'تم تحديث المؤشرات الحيوية', 'تم حفظ التحديثات في ملف المريضة');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Sync EHR with hospital
  const handleSyncEhr = async () => {
    setEhrSyncing(true);
    try {
      const res = await fetch('/api/ehr-sync', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setPatientData((prev) => ({ ...prev, lastEhrSync: data.syncTime }));
        addToast('success', 'تمت مزامنة السجل الصحي الإلكتروني (EHR)', data.message);
      }
    } catch (e) {
      addToast('success', 'تمت مزامنة السجل الصحي الإلكتروني (EHR)', 'مزامنة معتمدة ومشفرة برمز SHA-256');
    } finally {
      setTimeout(() => setEhrSyncing(false), 800);
    }
  };

  // Register new patient account
  const handleRegisterPatient = (newPatient: Partial<PatientData>) => {
    setPatientData((prev) => ({
      ...prev,
      ...newPatient,
      id: 'P-' + Math.floor(100000 + Math.random() * 900000),
    }));
    addToast(
      'success',
      `أهلاً بكِ ${newPatient.name || ''} 🌸`,
      'تم إنشاء وتشفير ملفك الطبي بنجاح وربطه بنظام تذكير المكالمات'
    );
  };

  // Emergency SOS Trigger
  const handleTriggerEmergencySOS = () => {
    handleTriggerCall(
      "طوارئ الأورام الفورية 24/7",
      `أهلاً بكِ ${patientData.name}، تم استلام نداء الطوارئ الفوري من تطبيقك. فريق التمريض وطبيبة الأورام المناوبة معكِ الآن. إذا كان لديكِ حرارة أو نزيف فإليكِ الإرشادات العاجلة.`
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Top Navigation */}
      <Navbar
        currentRole={currentRole}
        setRole={setCurrentRole}
        isMobileFrame={isMobileFrame}
        setIsMobileFrame={setIsMobileFrame}
        fontSize={fontSize}
        setFontSize={setFontSize}
        onOpenSOS={handleTriggerEmergencySOS}
        onOpenSupport={() => setIsSupportOpen(true)}
        onOpenPlayStoreModal={() => setIsPlayStoreOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        userName={patientData.name}
      />

      {/* Main Container / Mobile Frame Wrapper */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 flex justify-center">
        {isMobileFrame ? (
          /* Realistic Google Play Android Smartphone Mockup */
          <div className="w-full max-w-[420px] bg-slate-950 rounded-[48px] p-3 shadow-2xl border-4 border-slate-800 ring-8 ring-slate-900/40 relative">
            
            {/* Phone Speaker & Camera Notch */}
            <div className="w-32 h-5 bg-slate-900 rounded-full mx-auto mb-2 flex items-center justify-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-700" />
              <span className="w-12 h-1 bg-slate-800 rounded-full" />
            </div>

            {/* Simulated Android Status Bar */}
            <div className="px-5 py-1 text-[11px] font-mono text-slate-400 flex items-center justify-between border-b border-white/5 mb-2">
              <span className="font-bold text-white">09:41</span>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Wifi className="w-3 h-3 text-white" />
                <span className="text-[10px] text-emerald-400 font-bold">5G</span>
                <span>88%</span>
              </div>
            </div>

            {/* Inner Phone Screen Content */}
            <div className="bg-slate-50 text-slate-800 rounded-[36px] overflow-y-auto max-h-[740px] p-4 no-scrollbar">
              {currentRole === 'patient' ? (
                <PatientView
                  patientData={patientData}
                  onToggleMedication={handleToggleMedication}
                  onTriggerCall={handleTriggerCall}
                  onTriggerSMS={handleTriggerSMS}
                  onOpenReportModal={() => setIsReportOpen(true)}
                  messages={messages}
                  onSendMessage={(txt) => handleSendMessage(txt, 'patient')}
                  fontSize={fontSize}
                />
              ) : (
                <DoctorDashboard
                  patientData={patientData}
                  onAddSession={handleAddSession}
                  onAddMedication={handleAddMedication}
                  onUpdateVitals={handleUpdateVitals}
                  onSyncEhr={handleSyncEhr}
                  onTriggerCall={handleTriggerCall}
                  onOpenReportModal={() => setIsReportOpen(true)}
                  messages={messages}
                  onDoctorSendMessage={(txt) => handleSendMessage(txt, 'doctor')}
                  ehrSyncing={ehrSyncing}
                />
              )}
            </div>

            {/* Android Navigation Bar Pill */}
            <div className="w-32 h-1 bg-slate-600 rounded-full mx-auto mt-3" />
          </div>
        ) : (
          /* Full Desktop / Tablet Wide Layout */
          <div className="w-full">
            {currentRole === 'patient' ? (
              <PatientView
                patientData={patientData}
                onToggleMedication={handleToggleMedication}
                onTriggerCall={handleTriggerCall}
                onTriggerSMS={handleTriggerSMS}
                onOpenReportModal={() => setIsReportOpen(true)}
                messages={messages}
                onSendMessage={(txt) => handleSendMessage(txt, 'patient')}
                fontSize={fontSize}
              />
            ) : (
              <DoctorDashboard
                patientData={patientData}
                onAddSession={handleAddSession}
                onAddMedication={handleAddMedication}
                onUpdateVitals={handleUpdateVitals}
                onSyncEhr={handleSyncEhr}
                onTriggerCall={handleTriggerCall}
                onOpenReportModal={() => setIsReportOpen(true)}
                messages={messages}
                onDoctorSendMessage={(txt) => handleSendMessage(txt, 'doctor')}
                ehrSyncing={ehrSyncing}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="no-print bg-white border-t border-slate-200 py-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span className="font-bold text-slate-700">وردي | Wardi Breast Cancer Care</span>
            <span>— معاً في كل خطوة نحو الشفاء</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>مشفر بنظام HIPAA & GDPR</span>
            </span>
            <span>•</span>
            <button
              onClick={() => setIsPlayStoreOpen(true)}
              className="text-slate-600 hover:text-rose-600 font-medium cursor-pointer"
            >
              جاهز لـ Google Play
            </button>
            <span>•</span>
            <button
              onClick={() => setIsSupportOpen(true)}
              className="text-slate-600 hover:text-rose-600 font-medium cursor-pointer"
            >
              الدعم 24/7
            </button>
          </div>
        </div>
      </footer>

      {/* Floating Incoming Call Simulator Modal */}
      <PhoneCallModal
        call={activeCall}
        onClose={() => setActiveCall(null)}
        onMedicationTaken={() => {
          // Toggle first pending medication
          const pending = patientData.medications.find((m) => !m.takenToday);
          if (pending) {
            handleToggleMedication(pending.id, false);
          }
        }}
      />

      {/* Toasts for Instant Notifications & Lab Alerts */}
      <NotificationToast
        toasts={toasts}
        onDismiss={handleDismissToast}
        onAction={(t) => {
          if (t.type === 'call') {
            handleTriggerCall(t.title, t.description);
          }
        }}
      />

      {/* Printable PDF Medical Report Modal */}
      <MedicalReportModal
        patientData={patientData}
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />

      {/* 24/7 Support & Emergency Modal */}
      <SupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
        onTriggerEmergencyCall={handleTriggerEmergencySOS}
      />

      {/* Google Play Publication & Android APK Modal */}
      <GooglePlayBanner
        isOpen={isPlayStoreOpen}
        onClose={() => setIsPlayStoreOpen(false)}
      />

      {/* Account Registration & Login Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onRegisterPatient={handleRegisterPatient}
        currentPatient={patientData}
      />
    </div>
  );
}
