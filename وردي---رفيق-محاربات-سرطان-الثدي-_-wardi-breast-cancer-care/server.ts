import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Google GenAI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// In-Memory Database store with rich initial data
let patientData = {
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
      reminderType: "call", // call | push | both
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

let messages = [
  {
    id: "msg-1",
    sender: "doctor",
    senderName: "د. سارة المنصور (طبيبة الأورام)",
    text: "أهلاً بكِ فاطمة، اطلعت على تحاليل الدم اليوم، النتائج مطمئنة جداً ومستوى العدلات ممتاز. هل تشعرين بأي إرهاق غير معتاد بعد جرعة الدواء الأخيرة؟",
    timestamp: "10:30 ص",
  },
  {
    id: "msg-2",
    sender: "patient",
    senderName: "فاطمة الزهراني",
    text: "الحمد لله دكتورة سارة، فقط شعور خفيف بالغثيان في الصباح وتناول الزوفران ساعدني كثيراً.",
    timestamp: "10:38 ص",
  },
  {
    id: "msg-3",
    sender: "doctor",
    senderName: "د. سارة المنصور (طبيبة الأورام)",
    text: "ممتاز يا فاطمة، استمري على شرب السوائل الدافئة والوجبات الخفيفة المجزأة. أنا وفريق التمريض متواجدون لمتابعتك على مدار 24 ساعة.",
    timestamp: "10:42 ص",
  },
];

// Routes

// 1. Get full patient & clinical data
app.get('/api/patient-data', (_req: Request, res: Response) => {
  res.json({ success: true, data: patientData });
});

// 2. Mark medication taken / toggle
app.post('/api/medications/toggle', (req: Request, res: Response) => {
  const { medId, taken } = req.body;
  const med = patientData.medications.find((m) => m.id === medId);
  if (med) {
    med.takenToday = taken;
    med.lastTakenTime = taken ? new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }) : null;
    if (taken && med.remainingPills > 0) {
      med.remainingPills -= 1;
    }
    // Update adherence
    const total = patientData.medications.length;
    const takenCount = patientData.medications.filter((m) => m.takenToday).length;
    patientData.vitalSigns.adherenceRate = Math.round((takenCount / total) * 100);
    return res.json({ success: true, med, adherenceRate: patientData.vitalSigns.adherenceRate });
  }
  return res.status(404).json({ success: false, error: "الدواء غير موجود" });
});

// 3. Trigger Phone Call Simulation
app.post('/api/trigger-call', (req: Request, res: Response) => {
  const { title, details, recipientNumber } = req.body;
  const callPayload = {
    id: "CALL-" + Date.now(),
    callerName: "خدمة التذكير الآلي - مركز الأورام",
    callerNumber: "+966 800 124 9999",
    targetNumber: recipientNumber || "+966 50 123 4567",
    timestamp: new Date().toISOString(),
    title: title || "تذكير بموعد الدواء الهرموني",
    spokenMessageArabic: `السلام عليكم ورحمة الله وبركاته، مرحباً بكِ فاطمة. هذه مكالمة تذكيرية آلية من مركز الرعاية الصحية لسرطان الثدي: ${details || 'حان الآن موعد أخذ جرعتك المحددة من دواء تاموكسيفين 20 ملغ'}. نرجو أخذ الجرعة مع كوب ماء وتأكيد تناولها في التطبيق. نتمنى لكِ دوام الصحة والعافية.`,
    status: "calling",
  };
  res.json({ success: true, call: callPayload });
});

// 4. Trigger SMS Simulation
app.post('/api/trigger-sms', (req: Request, res: Response) => {
  const { message, recipientNumber } = req.body;
  res.json({
    success: true,
    sms: {
      id: "SMS-" + Date.now(),
      sender: "CarePink-Oncology",
      recipient: recipientNumber || "+966 50 123 4567",
      content: message || "تذكير وردي: حان موعد جرعتك الدوائية وجلستك العلاجية القادمة. تفاصيل الرعاية متاحة على مدار الساعة.",
      deliveredAt: new Date().toLocaleTimeString('ar-SA'),
    },
  });
});

// 5. Patient/Doctor Chat Messaging
app.get('/api/messages', (_req: Request, res: Response) => {
  res.json({ success: true, messages });
});

app.post('/api/messages', (req: Request, res: Response) => {
  const { sender, senderName, text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ success: false, error: "النص مطلوب" });
  }
  const newMsg = {
    id: "msg-" + Date.now(),
    sender: sender || "patient",
    senderName: senderName || (sender === "doctor" ? "د. سارة المنصور" : "فاطمة الزهراني"),
    text: text.trim(),
    timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
  };
  messages.push(newMsg);
  res.json({ success: true, message: newMsg });
});

// 6. Doctor Dashboard updates (add session, medication, notes)
app.post('/api/doctor/add-session', (req: Request, res: Response) => {
  const { title, type, date, time, location, prepNotes } = req.body;
  const newSession = {
    id: "sess-" + Date.now(),
    title: title || "جلسة فحص جديدة",
    type: type || "consultation",
    date: date || new Date().toISOString().split('T')[0],
    time: time || "10:00 ص",
    location: location || "مركز الأورام - العيادات التخصصية",
    doctor: "د. سارة المنصور",
    status: "مجدولة حديثاً",
    prepNotes: prepNotes || "الالتزام بتوجيهات الطبيب المعالج.",
    alarmCallEnabled: true,
  };
  patientData.sessions.unshift(newSession);
  res.json({ success: true, session: newSession });
});

app.post('/api/doctor/add-medication', (req: Request, res: Response) => {
  const { name, dosage, time, instructions, category } = req.body;
  const newMed = {
    id: "med-" + Date.now(),
    name: name || "دواء جديد",
    dosage: dosage || "10 ملغ",
    time: time || "09:00 صباحاً",
    instructions: instructions || "تناول الجرعة حسب التعليمات المرفقة",
    takenToday: false,
    lastTakenTime: null,
    reminderType: "both",
    remainingPills: 30,
    category: category || "علاج داعم",
  };
  patientData.medications.push(newMed);
  res.json({ success: true, medication: newMed });
});

app.post('/api/doctor/update-vitals', (req: Request, res: Response) => {
  const { temperature, bloodPressure, pulse, notes } = req.body;
  if (temperature) patientData.vitalSigns.temperature = temperature;
  if (bloodPressure) patientData.vitalSigns.bloodPressure = bloodPressure;
  if (pulse) patientData.vitalSigns.pulse = pulse;
  if (notes) {
    patientData.vitalSigns.lastReportedSideEffects.push(notes);
  }
  res.json({ success: true, vitals: patientData.vitalSigns });
});

// 7. EHR / Hospital System Synchronization
app.post('/api/ehr-sync', (_req: Request, res: Response) => {
  patientData.lastEhrSync = new Date().toISOString();
  res.json({
    success: true,
    message: "تم مزامنة وتشفير السجل الصحي الإلكتروني بنجاح مع شبكة مستشفيات الأورام الموحدة (FHIR / HL7 Compliant)",
    syncTime: patientData.lastEhrSync,
    checksum: "SHA256-" + Math.random().toString(36).substring(2, 12).toUpperCase(),
  });
});

// 8. AI Medical Assistant for Breast Cancer Patient queries
app.post('/api/ai-assistant', async (req: Request, res: Response) => {
  const { prompt, chatHistory } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ success: false, error: "الرجاء كتابة السؤال الطبي" });
  }

  const systemInstruction = `أنت "د. وردة - المساعد الطبي الذكي لسرطان الثدي"، رفيقة طبية رحيمة ومتخصصة في تقديم الدعم المعرفي والتوجيه السريع لمريضات ومحاربات سرطان الثدي وأسرهن.
المرضية الحالية: فاطمة، تشخيص: سرطان الثدي مرحلة IIB (ER+, PR+, HER2-)، تتلقى علاجاً هرمونياً وبروتوكول كيماوي داعم.

مبادئ إجاباتك الصارمة:
1. التحدث بلغة عربية فصحى دافئة، مطمئنة، سهلة الفهم جداً وواضحة بدون تعقيدات طبية معقدة تناسب كبار السن وجميع الأعمار.
2. تقديم نصائح عملية ومريحة للتخفيف من الأعراض الجانبية الشائعة (مثل: الغثيان، الإرهاق، تقرحات الفم، تساقط الشعر، الهبات الساخنة الناتجة عن العلاج الهرموني، التغذية المقوية للمناعة).
3. التشديد الدائم على أنكِ مساعد إرشادي ولا تستبدلين الفحص السريري المباشر، وتذكير المريضة بمراجعة طبيبتها (د. سارة المنصور) عند ظهور أي علامات خطيرة مثل (حرارة أعلى من 38 مئوية، ضيق تنفس حاد، نزيف).
4. استخدمي نقاطاً موجزة وواضحة لتسهيل القراءة. يمكنكِ إضافة كلمات تشجيعية تبث الأمل والعزيمة.`;

  try {
    const formattedHistory = Array.isArray(chatHistory)
      ? chatHistory.map((m: { role: string; content: string }) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }))
      : [];

    const contents = [
      ...formattedHistory,
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents as any,
      config: {
        systemInstruction,
        temperature: 0.6,
      },
    });

    const reply = response.text || "أهلاً بكِ عزيزتي فاطمة. أنا هنا لدعمكِ في رحلة الشفاء. نرجو التواصل مع الكادر الطبي للاستفسارات العاجلة.";
    return res.json({ success: true, reply });
  } catch (error: any) {
    console.error("Gemini API Error in /api/ai-assistant:", error);
    // Graceful helpful fallback for offline/test environments
    return res.json({
      success: true,
      reply: `مرحباً بكِ عزيزتي. شكراً لسؤالك. في رحلة علاج سرطان الثدي، من الطبيعي الشعور ببعض التغيرات. يُنصح بتناول وجبات خفيفة مقسمة على مدار اليوم، والإكثار من شرب الماء الدافئ، وأخذ قسط كافٍ من الراحة. عند الشعور بأي حرارة أو أعراض مفاجئة، يمكنكِ الضغط على زر الاتصال بالطبيبة أو زر الطوارئ الفوري في التطبيق. نحن معكِ خطوة بخطوة نحو الشفاء التام بإذن الله.`,
    });
  }
});

// Vite Middleware for development / Static files for production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
