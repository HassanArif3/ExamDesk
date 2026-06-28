import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Plus, Trash2, LayoutTemplate } from 'lucide-react';
import ToolLayout from '../../components/layout/ToolLayout';
import { useDraft } from '../../hooks/useDraft';
import { usePrintDocument } from '../../hooks/usePrintDocument';

const schema = z.object({
  schoolName: z.string().min(1, 'School name is required'),
  examTitle: z.string().min(1, 'Exam title is required'),
  className: z.string().min(1, 'Class/Grade is required'),
  session: z.string().min(1, 'Session is required'),
  instructions: z.string(),
  subjects: z.array(z.object({
    date: z.string().min(1, 'Date is required'),
    day: z.string().min(1, 'Day is required'),
    time: z.string().min(1, 'Time is required'),
    subjectName: z.string().min(1, 'Subject is required'),
    syllabus: z.string()
  })).min(1, 'At least one subject is required')
});

type DateSheetForm = z.infer<typeof schema>;

const SAMPLE_DATA: DateSheetForm = {
  schoolName: "Cambridge International School",
  examTitle: "Final Term Examination 2024",
  className: "Grade 10",
  session: "2023-2024",
  instructions: "1. Students must bring their own stationery.\n2. No electronic devices allowed in the examination hall.\n3. Reporting time is 30 minutes before the exam starts.",
  subjects: [
    { date: "2024-03-10", day: "Monday", time: "09:00 AM - 12:00 PM", subjectName: "Mathematics", syllabus: "Chapters 1 to 8" },
    { date: "2024-03-12", day: "Wednesday", time: "09:00 AM - 12:00 PM", subjectName: "Physics", syllabus: "Chapters 1 to 5" },
    { date: "2024-03-15", day: "Saturday", time: "09:00 AM - 11:30 AM", subjectName: "English Language", syllabus: "Full Syllabus" },
  ]
};

export default function DateSheetGenerator() {
  const [draft, setDraft, clearDraft] = useDraft<DateSheetForm | null>('draft_datesheet', null);
  const [theme, setTheme] = useState<'classic' | 'modern' | 'minimal' | 'compact'>('classic');
  const { componentRef, handlePrint } = usePrintDocument('Date_Sheet');

  const { register, control, watch, reset, handleSubmit, setValue } = useForm<DateSheetForm>({
    resolver: zodResolver(schema),
    defaultValues: draft || {
      schoolName: '', examTitle: '', className: '', session: '', instructions: '',
      subjects: [{ date: '', day: '', time: '', subjectName: '', syllabus: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: "subjects" });
  const formData = watch();

  const handleSaveDraft = () => setDraft(formData);
  const handleReset = () => { clearDraft(); reset({ schoolName: '', examTitle: '', className: '', session: '', instructions: '', subjects: [{ date: '', day: '', time: '', subjectName: '', syllabus: '' }] }); };
  const loadSample = () => reset(SAMPLE_DATA);

  const autoFillDay = (index: number, dateStr: string) => {
    if (dateStr) {
      try {
        const dateObj = new Date(dateStr);
        const dayName = format(dateObj, 'EEEE');
        setValue(`subjects.${index}.day`, dayName);
      } catch (e) {
        // invalid date
      }
    }
  };

  const handleSortDates = () => {
    const subjects = [...(formData.subjects || [])];
    subjects.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setValue('subjects', subjects);
  };

  // Check for duplicate dates
  const dateCounts: Record<string, number> = {};
  formData.subjects?.forEach(s => {
    if (s.date) dateCounts[s.date] = (dateCounts[s.date] || 0) + 1;
  });
  const hasDuplicates = Object.values(dateCounts).some(c => c > 1);

  const formContent = (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Header Information</h3>
        
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">School Name</label>
          <input {...register("schoolName")} className="edtech-input bg-slate-50 border-slate-200" placeholder="e.g. Oxford High School" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Exam Title</label>
            <input {...register("examTitle")} className="edtech-input bg-slate-50 border-slate-200" placeholder="e.g. Mid Term Exam" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Session</label>
            <input {...register("session")} className="edtech-input bg-slate-50 border-slate-200" placeholder="e.g. 2024-25" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">Class / Grade</label>
          <input {...register("className")} className="edtech-input bg-slate-50 border-slate-200" placeholder="e.g. Grade 10" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
          <h3 className="text-lg font-bold text-slate-900">Schedule</h3>
          <div className="flex gap-3">
             <button type="button" onClick={handleSortDates} className="text-sm flex items-center bg-slate-100 px-3 py-1.5 rounded-lg text-slate-700 hover:bg-slate-200 font-bold transition-colors">Sort by Date</button>
             <button type="button" onClick={() => append({ date: '', day: '', time: '', subjectName: '', syllabus: '' })} className="text-sm flex items-center text-blue-600 font-bold hover:text-blue-700 transition-colors bg-blue-50 px-3 py-1.5 rounded-lg">
               <Plus className="h-4 w-4 mr-1" /> Add Subject
             </button>
          </div>
        </div>

        {hasDuplicates && (
          <div className="bg-red-50 text-red-600 text-sm font-medium p-3 rounded-xl border border-red-200 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
            Warning: Multiple subjects are scheduled on the same date.
          </div>
        )}

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="p-5 bg-slate-50 border border-slate-200 rounded-xl relative group shadow-sm">
              <button type="button" onClick={() => remove(index)} className="absolute -top-3 -right-3 p-1.5 bg-white border border-red-200 text-red-500 rounded-full hover:bg-red-50 hidden group-hover:block transition-all shadow-sm z-10">
                <Trash2 className="h-4 w-4" />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Date</label>
                  <input type="date" {...register(`subjects.${index}.date`)} onChange={(e) => { register(`subjects.${index}.date`).onChange(e); autoFillDay(index, e.target.value); }} className="edtech-input py-2 min-h-[40px] bg-white border-slate-200" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Day</label>
                  <input {...register(`subjects.${index}.day`)} className="edtech-input py-2 min-h-[40px] bg-white border-slate-200" placeholder="Auto-fills from date" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Time</label>
                  <input {...register(`subjects.${index}.time`)} className="edtech-input py-2 min-h-[40px] bg-white border-slate-200" placeholder="09:00 AM - 12:00 PM" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Subject</label>
                  <input {...register(`subjects.${index}.subjectName`)} className="edtech-input py-2 min-h-[40px] bg-white border-slate-200 font-bold" placeholder="Mathematics" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Syllabus / Remarks (Optional)</label>
                <input {...register(`subjects.${index}.syllabus`)} className="edtech-input py-2 min-h-[40px] bg-white border-slate-200" placeholder="Chapter 1 to 5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Instructions</h3>
        <textarea {...register("instructions")} rows={4} className="edtech-input bg-slate-50 border-slate-200 min-h-[100px] py-3 resize-none" placeholder="1. Bring your own stationery..." />
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
         <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2"><LayoutTemplate className="h-5 w-5 text-blue-600" /> Theme Selection</h3>
         <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => setTheme('classic')} className={`flex-1 min-w-[100px] py-3 px-3 text-sm font-bold rounded-xl border transition-all ${theme === 'classic' ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}>Classic Formal</button>
            <button type="button" onClick={() => setTheme('modern')} className={`flex-1 min-w-[100px] py-3 px-3 text-sm font-bold rounded-xl border transition-all ${theme === 'modern' ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}>Modern Blue</button>
            <button type="button" onClick={() => setTheme('minimal')} className={`flex-1 min-w-[100px] py-3 px-3 text-sm font-bold rounded-xl border transition-all ${theme === 'minimal' ? 'border-slate-800 bg-slate-100 text-slate-900 shadow-sm' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}>Minimal Clean</button>
            <button type="button" onClick={() => setTheme('compact')} className={`flex-1 min-w-[100px] py-3 px-3 text-sm font-bold rounded-xl border transition-all ${theme === 'compact' ? 'border-amber-600 bg-amber-50 text-amber-700 shadow-sm' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}>Compact</button>
         </div>
      </div>
    </div>
  );

  const previewContent = (
    <div className="w-[210mm] min-h-[297mm] bg-white shadow-xl relative scale-[0.6] sm:scale-[0.8] md:scale-90 lg:scale-100 origin-top flex flex-col" ref={componentRef}>
      <div className="p-12 flex-1 flex flex-col">
        {theme === 'classic' && (
          // Classic Theme
          <div className="text-center flex-1 flex flex-col font-serif">
            <h1 className="text-3xl font-bold uppercase tracking-widest mb-2 border-b-2 border-black inline-block pb-1">{formData.schoolName || 'SCHOOL NAME'}</h1>
            <h2 className="text-xl font-semibold mb-1 mt-4 tracking-wider">{formData.examTitle || 'EXAM TITLE'}</h2>
            <div className="flex justify-center gap-12 mb-8 text-sm font-medium border-b border-black pb-4 mt-2 uppercase tracking-widest">
              <span>Class: <span className="font-bold">{formData.className || '____'}</span></span>
              <span>Session: <span className="font-bold">{formData.session || '____'}</span></span>
            </div>

            <table className="w-full border-collapse border border-black mb-8 text-left text-sm font-sans">
              <thead>
                <tr className="bg-gray-100/80">
                  <th className="border border-black p-3 w-[15%] font-bold uppercase tracking-wider text-xs">Date</th>
                  <th className="border border-black p-3 w-[15%] font-bold uppercase tracking-wider text-xs">Day</th>
                  <th className="border border-black p-3 w-[20%] font-bold uppercase tracking-wider text-xs">Time</th>
                  <th className="border border-black p-3 w-[20%] font-bold uppercase tracking-wider text-xs">Subject</th>
                  <th className="border border-black p-3 w-[30%] font-bold uppercase tracking-wider text-xs">Syllabus</th>
                </tr>
              </thead>
              <tbody>
                {formData.subjects?.map((sub, i) => (
                  <tr key={i} className="even:bg-gray-50/50">
                    <td className="border border-black p-3 font-medium">{sub.date || '-'}</td>
                    <td className="border border-black p-3 uppercase text-xs">{sub.day || '-'}</td>
                    <td className="border border-black p-3 font-medium">{sub.time || '-'}</td>
                    <td className="border border-black p-3 font-bold">{sub.subjectName || '-'}</td>
                    <td className="border border-black p-3 text-xs italic">{sub.syllabus || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {formData.instructions && (
              <div className="text-left mt-8 font-sans">
                <h4 className="font-bold mb-2 uppercase tracking-wider text-xs border-b border-black inline-block pb-0.5">Instructions:</h4>
                <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">{formData.instructions}</div>
              </div>
            )}
            
            <div className="mt-auto pt-24 flex justify-between font-sans text-sm uppercase tracking-widest">
               <div className="flex flex-col items-center">
                  <div className="w-48 border-t border-black mb-2"></div>
                  <div>Exam Controller</div>
               </div>
               <div className="flex flex-col items-center">
                  <div className="w-48 border-t border-black mb-2"></div>
                  <div>Principal</div>
               </div>
            </div>
          </div>
        )}
        
        {theme === 'modern' && (
          <div className="flex-1 flex flex-col font-sans">
            <div className="bg-blue-900 text-white p-10 rounded-3xl mb-8 relative overflow-hidden shadow-lg">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <h1 className="text-4xl font-black tracking-tight mb-4 relative z-10">{formData.schoolName || 'SCHOOL NAME'}</h1>
              <div className="flex justify-between items-end relative z-10">
                <div>
                  <h2 className="text-2xl text-blue-200 font-bold mb-1 tracking-wide">{formData.examTitle || 'EXAM TITLE'}</h2>
                  <p className="text-sm text-blue-100 opacity-90 font-medium tracking-wider uppercase">Class {formData.className || '____'} • Session {formData.session || '____'}</p>
                </div>
                <div className="bg-white/10 px-5 py-3 rounded-xl backdrop-blur-md border border-white/10 text-right">
                  <span className="text-xs uppercase tracking-widest text-blue-200 block mb-1 font-bold">Schedule</span>
                  <span className="font-mono text-lg font-bold">{new Date().getFullYear()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {formData.subjects?.map((sub, i) => (
                <div key={i} className="flex bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                  <div className="w-1/4 bg-blue-50/50 p-5 border-r border-blue-100/50 flex flex-col justify-center items-center text-center">
                    <span className="text-blue-950 font-black text-xl tracking-tight">{sub.date || '--'}</span>
                    <span className="text-blue-600 text-xs font-bold uppercase tracking-widest mt-1">{sub.day || '--'}</span>
                  </div>
                  <div className="w-3/4 p-5 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-lg text-gray-900">{sub.subjectName || 'Subject Name'}</span>
                      <span className="bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded-lg font-bold tracking-wide border border-blue-100">{sub.time || '--:--'}</span>
                    </div>
                    {sub.syllabus && <span className="text-sm text-gray-500 font-medium leading-relaxed">{sub.syllabus}</span>}
                  </div>
                </div>
              ))}
            </div>

            {formData.instructions && (
              <div className="bg-yellow-50/50 border border-yellow-200/50 rounded-2xl p-6 mt-8">
                <h4 className="font-bold text-yellow-900 mb-3 flex items-center gap-2 uppercase tracking-wider text-xs">
                  <span className="w-6 h-6 rounded-full bg-yellow-200 flex items-center justify-center text-yellow-800 font-black">!</span>
                  Important Instructions
                </h4>
                <div className="whitespace-pre-wrap text-sm text-yellow-800/90 leading-relaxed font-medium">{formData.instructions}</div>
              </div>
            )}
            
            <div className="mt-auto pt-24 flex justify-between px-8 text-xs text-gray-400 font-bold uppercase tracking-widest">
              <div className="flex flex-col items-center">
                  <div className="w-48 border-t-2 border-gray-200 mb-3"></div>
                  <div>Exam Controller</div>
               </div>
               <div className="flex flex-col items-center">
                  <div className="w-48 border-t-2 border-gray-200 mb-3"></div>
                  <div>Principal</div>
               </div>
            </div>
          </div>
        )}

        {theme === 'minimal' && (
          <div className="font-sans flex-1 flex flex-col">
            <div className="mb-12">
               <h1 className="text-3xl font-light text-gray-900 uppercase tracking-[0.2em] mb-6">{formData.schoolName}</h1>
               <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <h2 className="text-xl font-medium text-gray-800 tracking-wide">{formData.examTitle}</h2>
                  <div className="text-sm text-gray-500 tracking-widest uppercase font-medium">{formData.className} • {formData.session}</div>
               </div>
            </div>

            <div className="space-y-0">
               <div className="grid grid-cols-12 gap-6 pb-4 border-b border-gray-200 text-xs font-bold text-gray-400 uppercase tracking-widest">
                 <div className="col-span-2">Date</div>
                 <div className="col-span-2">Day</div>
                 <div className="col-span-4">Subject</div>
                 <div className="col-span-4 text-right">Time</div>
               </div>
               
               {formData.subjects?.map((sub, i) => (
                 <div key={i} className="grid grid-cols-12 gap-6 py-5 border-b border-gray-100 items-center">
                   <div className="col-span-2 font-medium tracking-wide">{sub.date}</div>
                   <div className="col-span-2 text-gray-500 text-sm uppercase tracking-wider">{sub.day}</div>
                   <div className="col-span-4">
                     <div className="font-semibold text-gray-900 text-lg">{sub.subjectName}</div>
                     {sub.syllabus && <div className="text-sm text-gray-500 mt-1 line-clamp-2">{sub.syllabus}</div>}
                   </div>
                   <div className="col-span-4 text-sm font-medium text-gray-600 text-right font-mono bg-gray-50 px-3 py-1 rounded self-center justify-self-end">{sub.time}</div>
                 </div>
               ))}
            </div>

            {formData.instructions && (
              <div className="mt-12 bg-gray-50/80 p-8 rounded-xl text-sm text-gray-600 border border-gray-100">
                <strong className="block mb-3 text-gray-900 uppercase tracking-widest text-xs">Important Instructions</strong>
                <div className="whitespace-pre-wrap leading-relaxed">{formData.instructions}</div>
              </div>
            )}

            <div className="mt-auto pt-24 flex justify-between text-xs text-gray-400 font-medium uppercase tracking-widest">
              <div className="flex flex-col items-start">
                  <div className="w-40 border-t border-gray-300 mb-3"></div>
                  <div>Exam Controller</div>
               </div>
               <div className="flex flex-col items-end">
                  <div className="w-40 border-t border-gray-300 mb-3"></div>
                  <div>Principal</div>
               </div>
            </div>
          </div>
        )}

        {theme === 'compact' && (
          <div className="text-sm flex-1 flex flex-col font-sans">
            <div className="text-center mb-8 pb-4 border-b-2 border-black border-double">
              <h1 className="text-2xl font-black uppercase tracking-widest mb-1">{formData.schoolName}</h1>
              <h2 className="text-lg font-bold uppercase tracking-wider text-gray-800 mb-2">{formData.examTitle}</h2>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-600">Class: {formData.className} • Session: {formData.session}</p>
            </div>
            <table className="w-full border-collapse border-2 border-black mb-6">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-black p-2 font-bold uppercase tracking-wider text-xs">Date</th>
                  <th className="border border-black p-2 font-bold uppercase tracking-wider text-xs text-left">Subject</th>
                  <th className="border border-black p-2 font-bold uppercase tracking-wider text-xs">Time</th>
                </tr>
              </thead>
              <tbody>
                {formData.subjects?.map((sub, i) => (
                  <tr key={i} className="even:bg-gray-50">
                    <td className="border border-black p-2 text-center font-medium">{sub.date} <span className="text-xs text-gray-500 uppercase block mt-0.5">{sub.day?.substring(0,3)}</span></td>
                    <td className="border border-black p-2 font-bold text-base">{sub.subjectName}</td>
                    <td className="border border-black p-2 text-center font-medium font-mono text-xs">{sub.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {formData.instructions && (
              <div className="text-xs mb-6 border border-gray-300 p-4 bg-gray-50">
                <strong className="uppercase tracking-wider mb-1 block">Instructions:</strong> 
                <div className="leading-relaxed">{formData.instructions}</div>
              </div>
            )}
            <div className="mt-auto pt-16 flex justify-between px-12 text-xs font-bold uppercase tracking-widest text-gray-800">
               <div className="flex flex-col items-center">
                  <div className="w-32 border-t border-black mb-2"></div>
                  <div>Sign 1</div>
               </div>
               <div className="flex flex-col items-center">
                  <div className="w-32 border-t border-black mb-2"></div>
                  <div>Sign 2</div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <ToolLayout
      title="Date Sheet Generator"
      description="Create print-ready date sheets with automated day calculation and multiple themes."
      form={formContent}
      preview={previewContent}
      onPrint={handlePrint}
      onSaveDraft={handleSaveDraft}
      onReset={handleReset}
      onSampleData={loadSample}
    >
      <div className="max-w-4xl mx-auto space-y-12">
        <section>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Create Print-Ready Exam Date Sheets Instantly</h2>
          <p className="text-lg text-slate-600 mb-4">
            Manually designing exam schedules and date sheets is a tedious task. Our Date Sheet Generator eliminates the hassle of formatting tables in Word or Excel, offering professional, print-ready templates tailored for schools and universities.
          </p>
        </section>

        <section className="bg-blue-50 p-8 rounded-2xl border border-blue-100">
          <h3 className="text-2xl font-bold text-blue-900 mb-6">Key Features</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-bold text-primary-800">Auto Day Calculation</h4>
              <p className="text-primary-700/80">Select a date, and the system automatically fills in the correct day of the week, reducing typing errors.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-primary-800">Duplicate Date Warnings</h4>
              <p className="text-primary-700/80">The system alerts you if multiple subjects are scheduled on the exact same date to prevent scheduling conflicts.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-primary-800">Date Sorting</h4>
              <p className="text-primary-700/80">Click "Sort by Date" to automatically arrange all subjects in chronological order before printing.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-primary-800">Multiple Layouts</h4>
              <p className="text-primary-700/80">Switch between Classic Formal, Modern Blue, Minimal Clean, and Compact list formats with one click.</p>
            </div>
          </div>
        </section>
      </div>
    </ToolLayout>
  );
}
