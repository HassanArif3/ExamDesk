import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, LayoutTemplate } from 'lucide-react';
import ToolLayout from '../../components/layout/ToolLayout';
import { useDraft } from '../../hooks/useDraft';
import { usePrintDocument } from '../../hooks/usePrintDocument';
import { calculateGrade } from '../../lib/utils';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function ResultCardGenerator() {
  const [draft, setDraft, clearDraft] = useDraft<any>('draft_resultcard', null);
  const [theme, setTheme] = useState<'classic' | 'modern' | 'minimal' | 'formal'>('classic');
  const [isDownloading, setIsDownloading] = useState(false);
  const { componentRef, handlePrint } = usePrintDocument('Result_Card');

  const SAMPLE_DATA = {
    schoolName: 'Excellence Academy',
    examType: 'Annual Examination 2024',
    studentName: 'Ali Khan', fatherName: 'Tariq Khan', rollNumber: '1001', className: 'Grade 10',
    subjects: [
      { name: 'Mathematics', total: 100, obtained: 95 },
      { name: 'English', total: 100, obtained: 82 },
      { name: 'Science', total: 100, obtained: 88 },
      { name: 'History', total: 100, obtained: 75 },
    ]
  };

  const { register, control, watch, reset } = useForm({
    defaultValues: draft || {
      schoolName: '', examType: '', studentName: '', fatherName: '', rollNumber: '', className: '',
      subjects: [
        { name: 'Mathematics', total: 100, obtained: '' },
        { name: 'English', total: 100, obtained: '' },
        { name: 'Science', total: 100, obtained: '' },
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: "subjects" });
  const formData = watch();

  const handleSaveDraft = () => setDraft(formData);
  const handleReset = () => { clearDraft(); reset(); };
  const loadSample = () => reset(SAMPLE_DATA);

  const handleDownloadPdf = async () => {
    if (!componentRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(componentRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Result_Card.pdf');
    } catch (e) {
      console.error(e);
      alert("Failed to generate PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  // Calculations
  const subjects = formData.subjects || [];
  const grandTotal = subjects.reduce((sum: number, sub: any) => sum + (Number(sub.total) || 0), 0);
  const grandObtained = subjects.reduce((sum: number, sub: any) => sum + (Number(sub.obtained) || 0), 0);
  const percentage = grandTotal > 0 ? (grandObtained / grandTotal) * 100 : 0;
  const grade = calculateGrade(percentage);

  const formContent = (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Institution Details</h3>
        <input {...register("schoolName")} className="edtech-input bg-slate-50 border-slate-200" placeholder="School Name" />
        <input {...register("examType")} className="edtech-input bg-slate-50 border-slate-200" placeholder="Exam Type (e.g. Mid Term)" />
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Student Profile</h3>
        <div className="grid grid-cols-2 gap-4">
          <input {...register("studentName")} className="edtech-input bg-slate-50 border-slate-200 font-bold" placeholder="Student Name" />
          <input {...register("fatherName")} className="edtech-input bg-slate-50 border-slate-200" placeholder="Father Name" />
          <input {...register("rollNumber")} className="edtech-input bg-slate-50 border-slate-200 font-bold text-blue-700" placeholder="Roll No." />
          <input {...register("className")} className="edtech-input bg-slate-50 border-slate-200" placeholder="Class/Section" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
          <h3 className="text-lg font-bold text-slate-900">Marks Entry</h3>
          <button type="button" onClick={() => append({ name: '', total: 100, obtained: '' })} className="text-sm flex items-center text-blue-600 font-bold hover:text-blue-700 transition-colors bg-blue-50 px-3 py-1.5 rounded-lg">
            <Plus className="h-4 w-4 mr-1" /> Add Subject
          </button>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-12 gap-3 text-xs font-bold text-slate-500 px-3 uppercase tracking-wider">
             <div className="col-span-6">Subject</div>
             <div className="col-span-3 text-center">Total Marks</div>
             <div className="col-span-3 text-center">Obtained</div>
          </div>
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-12 gap-3 items-center relative group bg-slate-50 p-2 rounded-xl border border-slate-200">
              <div className="col-span-6">
                <input {...register(`subjects.${index}.name`)} className="edtech-input w-full py-2 min-h-[40px] bg-white border-slate-200 font-medium" placeholder="Subject Name" />
              </div>
              <div className="col-span-3">
                <input type="number" {...register(`subjects.${index}.total`)} className="edtech-input w-full text-center py-2 min-h-[40px] bg-white border-slate-200" />
              </div>
              <div className="col-span-3 relative">
                <input type="number" {...register(`subjects.${index}.obtained`)} className="edtech-input w-full text-center py-2 min-h-[40px] bg-white border-slate-200 font-bold text-blue-700" placeholder="0" />
                <button type="button" onClick={() => remove(index)} className="absolute -right-10 top-2 text-red-400 hover:text-red-600 transition-colors hidden group-hover:block p-1 bg-red-50 rounded-md"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
         <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2"><LayoutTemplate className="h-5 w-5 text-blue-600" /> Theme Selection</h3>
         <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => setTheme('classic')} className={`py-3 px-2 text-sm font-bold rounded-xl border transition-all ${theme === 'classic' ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}>Classic Result Card</button>
            <button type="button" onClick={() => setTheme('modern')} className={`py-3 px-2 text-sm font-bold rounded-xl border transition-all ${theme === 'modern' ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}>Modern Blue Report</button>
            <button type="button" onClick={() => setTheme('minimal')} className={`py-3 px-2 text-sm font-bold rounded-xl border transition-all ${theme === 'minimal' ? 'border-slate-800 bg-slate-100 text-slate-900 shadow-sm' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}>Minimal Result Sheet</button>
            <button type="button" onClick={() => setTheme('formal')} className={`py-3 px-2 text-sm font-bold rounded-xl border transition-all ${theme === 'formal' ? 'border-amber-600 bg-amber-50 text-amber-700 shadow-sm' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}>Formal School Report</button>
         </div>
      </div>
    </div>
  );

  const previewContent = (
    <div className="w-[210mm] min-h-[297mm] bg-white shadow-xl relative scale-[0.6] sm:scale-[0.8] md:scale-90 lg:scale-100 origin-top flex flex-col" ref={componentRef}>
      {theme === 'classic' && (
        <div className="p-12 border-[8px] border-double border-slate-800 m-6 flex flex-col h-[calc(100%-3rem)]">
          <div className="text-center border-b-2 border-slate-800 pb-6 mb-8">
            <h1 className="text-4xl font-black uppercase tracking-widest text-slate-900 mb-2">{formData.schoolName}</h1>
            <h2 className="text-xl font-bold text-slate-700 tracking-wider bg-slate-200 inline-block px-6 py-2 rounded-full">{formData.examType}</h2>
            <div className="mt-4 text-sm font-semibold tracking-[0.2em] text-slate-600">ACADEMIC RESULT REPORT</div>
          </div>

          <div className="grid grid-cols-2 gap-y-4 gap-x-12 mb-10 text-sm">
            <div className="border-b border-dashed border-slate-400 pb-1">
              <span className="font-bold text-slate-500 w-32 inline-block">STUDENT NAME:</span>
              <span className="font-bold text-lg uppercase">{formData.studentName || '________________'}</span>
            </div>
            <div className="border-b border-dashed border-slate-400 pb-1">
              <span className="font-bold text-slate-500 w-32 inline-block">FATHER NAME:</span>
              <span className="font-bold uppercase">{formData.fatherName || '________________'}</span>
            </div>
            <div className="border-b border-dashed border-slate-400 pb-1">
              <span className="font-bold text-slate-500 w-32 inline-block">ROLL NO:</span>
              <span className="font-bold">{formData.rollNumber || '______'}</span>
            </div>
            <div className="border-b border-dashed border-slate-400 pb-1">
              <span className="font-bold text-slate-500 w-32 inline-block">CLASS/SEC:</span>
              <span className="font-bold">{formData.className || '______'}</span>
            </div>
          </div>

          <table className="w-full border-collapse mb-10 border-2 border-slate-800 flex-1">
            <thead>
              <tr className="bg-slate-800 text-white text-sm">
                <th className="border border-slate-800 p-3 text-left w-[40%]">SUBJECT</th>
                <th className="border border-slate-800 p-3 text-center w-[20%]">TOTAL MARKS</th>
                <th className="border border-slate-800 p-3 text-center w-[20%]">OBTAINED</th>
                <th className="border border-slate-800 p-3 text-center w-[20%]">GRADE</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((sub: any, i: number) => {
                const p = Number(sub.total) > 0 ? (Number(sub.obtained) / Number(sub.total)) * 100 : 0;
                const g = calculateGrade(p);
                return (
                  <tr key={i} className="even:bg-slate-50">
                    <td className="border border-slate-300 p-3 font-semibold text-slate-800">{sub.name || '-'}</td>
                    <td className="border border-slate-300 p-3 text-center text-slate-600">{sub.total || '-'}</td>
                    <td className="border border-slate-300 p-3 text-center font-bold text-slate-900">{sub.obtained || '-'}</td>
                    <td className="border border-slate-300 p-3 text-center font-bold">{sub.obtained ? g : '-'}</td>
                  </tr>
                )
              })}
              <tr className="bg-slate-200 font-bold border-t-2 border-slate-800">
                <td className="border border-slate-300 p-3 text-right">GRAND TOTAL</td>
                <td className="border border-slate-300 p-3 text-center">{grandTotal}</td>
                <td className="border border-slate-300 p-3 text-center text-lg">{grandObtained}</td>
                <td className="border border-slate-300 p-3 text-center"></td>
              </tr>
            </tbody>
          </table>

          <div className="grid grid-cols-2 gap-8 mb-16">
            <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center">
              <span className="text-slate-500 font-bold mb-1 tracking-wider text-sm">PERCENTAGE</span>
              <span className="text-3xl font-black text-slate-900">{percentage.toFixed(2)}%</span>
            </div>
            <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center">
              <span className="text-slate-500 font-bold mb-1 tracking-wider text-sm">FINAL GRADE</span>
              <span className="text-4xl font-black text-slate-900">{grade}</span>
            </div>
          </div>
          
          <div className="mt-auto flex justify-between px-10 text-sm font-bold text-slate-500 pb-8">
            <div className="text-center w-48 border-t-2 border-slate-800 pt-2 text-slate-800">Class Teacher</div>
            <div className="text-center w-48 border-t-2 border-slate-800 pt-2 text-slate-800">Principal</div>
          </div>
        </div>
      )}

      {theme === 'modern' && (
        <div className="p-0 m-0 w-full h-full bg-slate-50">
           <div className="bg-blue-600 text-white p-12 pb-24 rounded-b-[4rem] relative shadow-lg">
             <div className="text-center relative z-10">
                <h1 className="text-3xl font-black tracking-tight">{formData.schoolName}</h1>
                <h2 className="text-lg font-medium opacity-90 mt-1">{formData.examType}</h2>
             </div>
           </div>

           <div className="px-12 -mt-16 relative z-20 space-y-6 flex flex-col h-full min-h-[500px]">
              <div className="bg-white rounded-2xl shadow-md p-6 grid grid-cols-2 gap-6">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase">Student Name</div>
                  <div className="text-xl font-bold text-slate-900 uppercase">{formData.studentName}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase">Roll No</div>
                  <div className="text-xl font-bold text-slate-900 font-mono">{formData.rollNumber}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase">Father Name</div>
                  <div className="text-sm font-semibold text-slate-700 uppercase">{formData.fatherName}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase">Class</div>
                  <div className="text-sm font-semibold text-slate-700">{formData.className}</div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-md overflow-hidden flex-1 flex flex-col">
                 <div className="bg-blue-50 grid grid-cols-12 p-4 text-xs font-bold text-blue-900 uppercase">
                    <div className="col-span-5">Subject</div>
                    <div className="col-span-2 text-center">Total</div>
                    <div className="col-span-3 text-center">Marks</div>
                    <div className="col-span-2 text-center">Grade</div>
                 </div>
                 <div className="flex-1">
                   {subjects.map((sub: any, i: number) => {
                      const p = Number(sub.total) > 0 ? (Number(sub.obtained) / Number(sub.total)) * 100 : 0;
                      const g = calculateGrade(p);
                      return (
                        <div key={i} className="grid grid-cols-12 p-4 border-b border-slate-100 items-center">
                          <div className="col-span-5 font-bold text-slate-800">{sub.name}</div>
                          <div className="col-span-2 text-center text-slate-500">{sub.total}</div>
                          <div className="col-span-3 text-center font-bold text-slate-900">{sub.obtained}</div>
                          <div className="col-span-2 text-center font-bold text-blue-600">{sub.obtained ? g : ''}</div>
                        </div>
                      )
                   })}
                 </div>
                 <div className="bg-slate-100 p-4 grid grid-cols-12 items-center font-black">
                    <div className="col-span-5 text-right text-slate-600 pr-4 uppercase text-xs">Total</div>
                    <div className="col-span-2 text-center">{grandTotal}</div>
                    <div className="col-span-3 text-center text-xl text-blue-600">{grandObtained}</div>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                 <div className="bg-white rounded-2xl shadow-md p-6 flex justify-between items-center">
                   <div>
                     <div className="text-xs font-bold text-slate-400 uppercase">Percentage</div>
                     <div className="text-3xl font-black text-slate-900">{percentage.toFixed(1)}%</div>
                   </div>
                 </div>
                 <div className="bg-blue-600 rounded-2xl shadow-md p-6 flex justify-between items-center text-white">
                   <div>
                     <div className="text-xs font-bold text-blue-200 uppercase">Final Grade</div>
                     <div className="text-4xl font-black">{grade}</div>
                   </div>
                 </div>
              </div>

              <div className="flex justify-between mt-auto mb-16 px-8 text-sm font-bold text-slate-400 uppercase">
                 <div className="border-t-2 border-slate-300 pt-2 w-48 text-center">Class Teacher</div>
                 <div className="border-t-2 border-slate-300 pt-2 w-48 text-center">Principal</div>
              </div>
           </div>
        </div>
      )}

      {theme === 'minimal' && (
        <div className="p-16 h-full flex flex-col font-sans text-slate-800">
           <div className="mb-12">
             <h1 className="text-3xl font-light tracking-widest uppercase text-slate-900 mb-2">{formData.schoolName}</h1>
             <h2 className="text-xl font-medium text-slate-500">{formData.examType}</h2>
           </div>

           <div className="grid grid-cols-2 gap-8 mb-12">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Student</p>
                <p className="text-2xl font-medium">{formData.studentName}</p>
                <p className="text-sm text-slate-500">{formData.fatherName}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Details</p>
                <p className="text-lg font-medium">Roll: {formData.rollNumber}</p>
                <p className="text-lg font-medium">Class: {formData.className}</p>
              </div>
           </div>

           <div className="w-full border-t border-black pb-2 mb-2 grid grid-cols-12 text-xs font-bold uppercase tracking-widest">
              <div className="col-span-6">Subject</div>
              <div className="col-span-2 text-right">Total</div>
              <div className="col-span-2 text-right">Obtained</div>
              <div className="col-span-2 text-right">Grade</div>
           </div>

           <div className="flex-1 space-y-4">
             {subjects.map((sub: any, i: number) => {
                const p = Number(sub.total) > 0 ? (Number(sub.obtained) / Number(sub.total)) * 100 : 0;
                const g = calculateGrade(p);
                return (
                  <div key={i} className="grid grid-cols-12 items-center border-b border-slate-100 pb-4">
                    <div className="col-span-6 font-medium text-lg">{sub.name}</div>
                    <div className="col-span-2 text-right text-slate-500">{sub.total}</div>
                    <div className="col-span-2 text-right font-medium">{sub.obtained}</div>
                    <div className="col-span-2 text-right font-bold">{sub.obtained ? g : ''}</div>
                  </div>
                )
             })}
           </div>

           <div className="border-t-2 border-black pt-4 grid grid-cols-12 mb-12">
              <div className="col-span-6 text-xl font-bold uppercase">Total</div>
              <div className="col-span-2 text-right text-slate-500 text-xl">{grandTotal}</div>
              <div className="col-span-2 text-right font-bold text-xl">{grandObtained}</div>
           </div>

           <div className="flex justify-between items-end mb-24">
             <div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Percentage</p>
               <p className="text-3xl font-light">{percentage.toFixed(1)}%</p>
             </div>
             <div className="text-right">
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Final Grade</p>
               <p className="text-5xl font-medium">{grade}</p>
             </div>
           </div>

           <div className="flex justify-between mt-auto">
             <div className="w-48 border-t border-slate-300 pt-2 text-xs font-bold uppercase tracking-widest text-slate-400">Class Teacher</div>
             <div className="w-48 border-t border-slate-300 pt-2 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">Principal</div>
           </div>
        </div>
      )}

      {theme === 'formal' && (
        <div className="p-12 border-2 border-slate-800 m-8 h-[calc(100%-4rem)] bg-[#fffdfa] flex flex-col font-serif">
           <div className="text-center mb-8 border-b-2 border-slate-800 pb-6 relative">
              <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">{formData.schoolName}</h1>
              <h2 className="text-lg italic text-slate-600 mb-4">{formData.examType}</h2>
              <div className="inline-block border border-slate-800 px-6 py-1 font-bold tracking-widest">RESULT INTIMATION CARD</div>
           </div>

           <div className="flex gap-12 mb-8">
              <div className="flex-1 space-y-2 text-sm">
                 <div className="flex"><span className="w-32 font-bold">Student Name:</span> <span className="uppercase border-b border-dotted border-slate-400 flex-1 font-bold">{formData.studentName}</span></div>
                 <div className="flex"><span className="w-32 font-bold">Father Name:</span> <span className="uppercase border-b border-dotted border-slate-400 flex-1">{formData.fatherName}</span></div>
              </div>
              <div className="w-64 space-y-2 text-sm">
                 <div className="flex"><span className="w-24 font-bold">Roll No:</span> <span className="border-b border-dotted border-slate-400 flex-1 font-mono font-bold text-center">{formData.rollNumber}</span></div>
                 <div className="flex"><span className="w-24 font-bold">Class:</span> <span className="border-b border-dotted border-slate-400 flex-1 text-center">{formData.className}</span></div>
              </div>
           </div>

           <table className="w-full border-collapse border border-slate-800 mb-8 flex-1">
             <thead>
               <tr className="bg-slate-100">
                 <th className="border border-slate-800 p-2 text-left">Subject</th>
                 <th className="border border-slate-800 p-2 text-center w-24">Max Marks</th>
                 <th className="border border-slate-800 p-2 text-center w-24">Marks Obt.</th>
                 <th className="border border-slate-800 p-2 text-center w-24">Remarks</th>
               </tr>
             </thead>
             <tbody>
               {subjects.map((sub: any, i: number) => {
                  const p = Number(sub.total) > 0 ? (Number(sub.obtained) / Number(sub.total)) * 100 : 0;
                  const g = calculateGrade(p);
                  return (
                    <tr key={i}>
                      <td className="border border-slate-800 p-2 font-bold">{sub.name}</td>
                      <td className="border border-slate-800 p-2 text-center">{sub.total}</td>
                      <td className="border border-slate-800 p-2 text-center font-bold">{sub.obtained}</td>
                      <td className="border border-slate-800 p-2 text-center text-xs">{sub.obtained ? (g === 'F' ? 'Fail' : 'Pass') : ''}</td>
                    </tr>
                  )
               })}
             </tbody>
             <tfoot>
               <tr className="bg-slate-100 font-bold border-t-[3px] border-slate-800">
                 <td className="border border-slate-800 p-2 text-right">TOTAL</td>
                 <td className="border border-slate-800 p-2 text-center">{grandTotal}</td>
                 <td className="border border-slate-800 p-2 text-center">{grandObtained}</td>
                 <td className="border border-slate-800 p-2 text-center"></td>
               </tr>
             </tfoot>
           </table>

           <div className="flex justify-between items-center border border-slate-800 p-4 mb-auto">
              <div className="text-center">
                 <div className="text-xs uppercase tracking-wider mb-1">Percentage</div>
                 <div className="text-xl font-bold">{percentage.toFixed(2)}%</div>
              </div>
              <div className="w-px h-12 bg-slate-800"></div>
              <div className="text-center">
                 <div className="text-xs uppercase tracking-wider mb-1">Grade</div>
                 <div className="text-2xl font-bold">{grade}</div>
              </div>
              <div className="w-px h-12 bg-slate-800"></div>
              <div className="text-center">
                 <div className="text-xs uppercase tracking-wider mb-1">Status</div>
                 <div className="text-xl font-bold uppercase">{percentage >= 50 ? 'Promoted' : 'Detained'}</div>
              </div>
           </div>

           <div className="mt-16 flex justify-between px-8 text-sm italic font-bold">
              <div className="w-40 border-t border-slate-800 text-center pt-1">Prepared By</div>
              <div className="w-40 border-t border-slate-800 text-center pt-1">Principal's Signature</div>
           </div>
        </div>
      )}
    </div>
  );

  return (
    <ToolLayout
      title="Result Card Generator"
      description="Create beautiful, auto-calculating student result cards with multiple professional templates."
      form={formContent}
      preview={previewContent}
      onPrint={handlePrint}
      onDownload={handleDownloadPdf}
      onSaveDraft={handleSaveDraft}
      onReset={handleReset}
      onSampleData={loadSample}
    >
      <div className="max-w-4xl mx-auto space-y-12">
        <section>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Professional Student Result Card Generator</h2>
          <p className="text-lg text-slate-600 mb-4">
            Creating student result cards at the end of the academic term is traditionally a time-consuming process. The ExamDesk Result Card Generator automates calculations, prevents grading errors, and provides multiple professional templates suitable for any educational institution.
          </p>
          <p className="text-lg text-slate-600">
            Simply enter the student details, input the maximum marks and obtained marks for each subject, and let our system automatically calculate the total score, percentage, and final grade.
          </p>
        </section>

        <section className="bg-primary-50 p-8 rounded-2xl border border-primary-100">
          <h3 className="text-2xl font-bold text-primary-900 mb-6">Key Features</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-bold text-primary-800">Auto-Calculation</h4>
              <p className="text-primary-700/80">Instantly calculates grand totals, percentages, and assigns accurate grades based on standard academic rubrics.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-primary-800">Multiple Templates</h4>
              <p className="text-primary-700/80">Choose from Classic, Modern Blue, Minimal, or Formal template designs to match your school's branding.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-primary-800">Draft Saving</h4>
              <p className="text-primary-700/80">Save your progress locally in your browser. Come back later without losing your entered marks.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-primary-800">PDF & Print Support</h4>
              <p className="text-primary-700/80">Export perfectly formatted, A4-sized PDF documents ready for printing or digital distribution to parents.</p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div className="border border-slate-200 rounded-lg p-4">
              <h4 className="font-bold text-slate-800 mb-2">How is the final grade calculated?</h4>
              <p className="text-slate-600">The grade is automatically calculated using a standard academic scale (A+ for &gt;90%, A for &gt;80%, B for &gt;70%, etc.) based on the total percentage.</p>
            </div>
            <div className="border border-slate-200 rounded-lg p-4">
              <h4 className="font-bold text-slate-800 mb-2">Can I add custom subjects?</h4>
              <p className="text-slate-600">Yes, you can click the "Add Subject" button to add as many subjects as needed. You can type any name for the subject.</p>
            </div>
            <div className="border border-slate-200 rounded-lg p-4">
              <h4 className="font-bold text-slate-800 mb-2">Is the data secure?</h4>
              <p className="text-slate-600">Yes, when you click "Save Draft", the data is only saved locally in your own web browser's storage. It is not sent to any external server.</p>
            </div>
          </div>
        </section>
      </div>
    </ToolLayout>
  );
}
