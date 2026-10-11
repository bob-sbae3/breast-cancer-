import React from 'react';
import { X, Printer, Download, ShieldCheck, Heart, FileText, CheckCircle } from 'lucide-react';
import { PatientData } from '../types';

interface MedicalReportModalProps {
  patientData: PatientData;
  isOpen: boolean;
  onClose: () => void;
}

export const MedicalReportModal: React.FC<MedicalReportModalProps> = ({ patientData, isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Action Header (hidden on print) */}
        <div className="no-print bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-rose-400" />
            <div>
              <h3 className="font-bold text-sm">التقرير الطبي الرسمي لحالة المريضة</h3>
              <p className="text-[11px] text-slate-400">معتمد وقابل للطباعة والتصدير بصيغة PDF</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة / حفظ كـ PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Content Body (Printable area) */}
        <div id="printable-report" className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-6 text-slate-800">
          
          {/* Hospital Header Banner */}
          <div className="border-b-2 border-rose-500 pb-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 text-white flex items-center justify-center font-black shadow-md">
                <Heart className="w-8 h-8 fill-white" />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900">مركز الأورام الشامل التخصصي</h1>
                <p className="text-xs text-slate-500 font-medium">قسم طب الأورام وعلاج سرطان الثدي • Comprehensive Breast Oncology Unit</p>
                <p className="text-[11px] text-rose-600 font-mono mt-0.5">رقم الاعتماد الدولي: JCI-ONCO-882194 • HIPAA Compliant</p>
              </div>
            </div>

            <div className="text-left font-mono text-xs text-slate-500 dir-ltr">
              <div className="font-bold text-slate-800">DATE: {new Date().toLocaleDateString('en-GB')}</div>
              <div>REPORT ID: RPT-BC-2026-8821</div>
              <div className="text-emerald-600 font-semibold flex items-center gap-1 justify-end">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>EHR ENCRYPTED & VERIFIED</span>
              </div>
            </div>
          </div>

          {/* Patient Demographics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block">اسم المريضة:</span>
              <strong className="text-sm text-slate-900">{patientData.name}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">رقم الملف الطبي (MRN):</span>
              <strong className="text-sm font-mono text-slate-900">{patientData.id}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">العمر وفصيلة الدم:</span>
              <strong className="text-sm text-slate-900">{patientData.age} سنة • {patientData.bloodType}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">الطبيب الاستشاري المعالج:</span>
              <strong className="text-sm text-slate-900">{patientData.attendingPhysician}</strong>
            </div>
          </div>

          {/* Oncology Diagnosis & Receptor Profile */}
          <div className="space-y-3">
            <h2 className="text-sm font-black text-rose-700 uppercase tracking-wide flex items-center gap-2 border-b border-rose-100 pb-1">
              <span>التشخيص النسيجي وتصنيف الورم (Oncology Staging & Pathology)</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 bg-rose-50/60 rounded-xl border border-rose-200 text-xs">
                <span className="text-rose-900 font-bold block mb-1">نوع الورم والدرجة:</span>
                <p className="text-slate-800 leading-relaxed font-medium">{patientData.diagnosis}</p>
              </div>

              <div className="p-3.5 bg-rose-50/60 rounded-xl border border-rose-200 text-xs">
                <span className="text-rose-900 font-bold block mb-1">المرحلة السريرية (TNM Stage):</span>
                <p className="text-slate-800 leading-relaxed font-bold text-rose-700">{patientData.stage}</p>
              </div>

              <div className="p-3.5 bg-rose-50/60 rounded-xl border border-rose-200 text-xs">
                <span className="text-rose-900 font-bold block mb-1">المستقبلات الحيوية (Biomarkers):</span>
                <p className="text-slate-800 leading-relaxed font-mono font-medium">{patientData.receptors}</p>
              </div>
            </div>
          </div>

          {/* Active Medications & Treatment Protocol */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1">
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-wide">
                البروتوكول العلاجي الدوائي وجدول الالتزام
              </h2>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                نسبة التزام المريضة بالدواء: {patientData.vitalSigns.adherenceRate}%
              </span>
            </div>

            <table className="w-full text-right text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 font-bold">
                <tr>
                  <th className="p-2.5">اسم الدواء</th>
                  <th className="p-2.5">الجرعة المحددة</th>
                  <th className="p-2.5">التوقيت اليومي</th>
                  <th className="p-2.5">التصنيف والغرض</th>
                  <th className="p-2.5">حالة جرعة اليوم</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {patientData.medications.map((med) => (
                  <tr key={med.id} className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold text-slate-900">{med.name}</td>
                    <td className="p-2.5 font-mono">{med.dosage}</td>
                    <td className="p-2.5">{med.time}</td>
                    <td className="p-2.5 text-slate-600">{med.category}</td>
                    <td className="p-2.5">
                      {med.takenToday ? (
                        <span className="text-emerald-700 font-bold inline-flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> تم الأخذ
                        </span>
                      ) : (
                        <span className="text-amber-700 font-semibold">بانتظار الموعد</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Latest Lab Parameters Summary */}
          <div className="space-y-3">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-wide border-b border-slate-200 pb-1">
              آخر المؤشرات الحيوية والتحاليل المخبرية (Latest Lab Work)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {patientData.labResults.slice(0, 2).map((lab) => (
                <div key={lab.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-slate-900">{lab.testName}</span>
                    <span className="text-[11px] text-slate-500 font-mono">{lab.date}</span>
                  </div>
                  <div className="space-y-1 mb-2">
                    {lab.parameters.map((param, i) => (
                      <div key={i} className="flex justify-between text-[11px]">
                        <span className="text-slate-600">{param.name}:</span>
                        <span className="font-mono font-bold text-slate-800">{param.value} (النطاق: {param.range})</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200 text-[11px] text-slate-700">
                    <strong>ملاحظة الاستشاري: </strong>{lab.doctorNote}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Oncology Plan */}
          <div className="p-3.5 bg-rose-50/50 rounded-xl border border-rose-200 text-xs space-y-1.5">
            <h3 className="font-bold text-rose-900">الخطة القادمة وتوجيهات الكادر الطبي:</h3>
            <p className="text-slate-700 leading-relaxed">
              المريضة تستجيب بشكل ممتاز لبروتوكول العلاج. استكمال الدورة الرابعة من العلاج الكيماوي في الموعد المحدد (15 أكتوبر 2026)، مع استمرار التذكير الآلي اليومي عبر الهاتف لضمان عدم تفويت جرعات التاموكسيفين ومضادات الغثيان. المتابعة المستمرة مع المساعد الطبي الذكي والإبلاغ الفوري عن أي ارتفاع في درجة الحرارة.
            </p>
          </div>

          {/* Signatures, Stamp & QR Verification */}
          <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-slate-500 block">توقيع وختم الطبيبة الاستشارية:</span>
              <div className="font-bold text-slate-900 text-sm">{patientData.attendingPhysician}</div>
              <div className="w-36 h-12 border-b-2 border-slate-400 border-dashed flex items-center justify-center text-rose-700 font-serif italic text-sm">
                Dr. Sarah Al-Mansoor
              </div>
            </div>

            {/* Simulated Hospital Official Stamp */}
            <div className="w-24 h-24 rounded-full border-2 border-rose-600 border-dashed flex flex-col items-center justify-center text-center p-1 text-[9px] text-rose-700 font-bold rotate-[-6deg] select-none">
              <span>وزارة الصحة</span>
              <span className="text-[10px] my-0.5">مركز الأورام</span>
              <span>معتمد إلكترونياً</span>
              <span className="text-[8px] font-mono">2026-10</span>
            </div>

            {/* QR Code Verification Simulation */}
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-900 p-1.5 rounded-lg text-white mx-auto flex items-center justify-center font-mono text-[7px] text-center leading-tight">
                QR-VERIFY<br/>EHR-FHIR<br/>882194
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">تحقق إلكتروني فوري</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
