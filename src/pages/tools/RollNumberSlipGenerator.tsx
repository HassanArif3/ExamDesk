import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import ToolLayout from '../../components/layout/ToolLayout';
import { usePrintDocument } from '../../hooks/usePrintDocument';
import { useDraft } from '../../hooks/useDraft';
import { Plus, Trash2, LayoutTemplate } from 'lucide-react';

export default function RollNumberSlipGenerator() {
  const [draft, setDraft, clearDraft] = useDraft<any>('draft_rollnumber', null);
  const [theme, setTheme] = useState<'classic' | 'modern' | 'formal'>('classic');
  const { componentRef, handlePrint } = usePrintDocument('Roll_Number_Slips');

  const { register, control, watch, reset, setValue } = useForm({
    defaultValues: draft || {
      schoolName: 'Global International School',
      examTitle: 'Final Term Exam 2024',
      instructions: '1. Bring this slip daily.\n2. No mobile phones allowed.',
      students: [
        { name: 'John Doe', father: 'Richard Doe', roll: '1001', class: '10A', room: 'Hall 1' },
        { name: 'Jane Smith', father: 'Robert Smith', roll: '1002', class: '10A', room: 'Hall 1' }
      ],
      bulkPaste: '',
      schedule: [
        { subject: 'Mathematics', date: '10 Mar 2024', time: '09:00 AM' }
      ]
    }
  });

  const { fields: studentFields, append: appendStudent, remove: removeStudent } = useFieldArray({ control, name: "students" });
  const { fields: scheduleFields, append: appendSchedule, remove: removeSchedule } = useFieldArray({ control, name: "schedule" });
  const formData = watch();

  const handleSaveDraft = () => setDraft(formData);
  const handleReset = () => { clearDraft(); reset(); };

  const handleBulkPaste = () => {
    if (!formData.bulkPaste) return;
    const rows = formData.bulkPaste.split('\n');
    const newStudents = rows.map(r => {
      const parts = r.split(',').map(s => s.trim());
      return { 
        roll: parts[0] || '', 
        name: parts[1] || '',
        father: parts[2] || '',
        class: parts[3] || '',
        room: parts[4] || ''
      };
    }).filter(s => s.roll || s.name);
    
    setValue('students', newStudents);
    setValue('bulkPaste', '');
  };

  const formContent = (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Header Details</h3>
        <input {...register("schoolName")} className="w-full rounded-lg border-slate-200 border p-3 bg-slate-50 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors font-medium text-slate-700 placeholder:text-slate-400" placeholder="School Name" />
        <input {...register("examTitle")} className="w-full rounded-lg border-slate-200 border p-3 bg-slate-50 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors font-medium text-slate-700 placeholder:text-slate-400" placeholder="Exam Title" />
        <textarea {...register("instructions")} className="w-full rounded-lg border-slate-200 border p-3 bg-slate-50 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors text-sm font-medium text-slate-700 placeholder:text-slate-400 resize-none min-h-[100px]" rows={3} placeholder="General Instructions"></textarea>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
          <h3 className="text-lg font-bold text-slate-900">Subject Schedule (Appears on all slips)</h3>
          <button type="button" onClick={() => appendSchedule({ subject: '', date: '', time: '' })} className="text-sm flex items-center text-blue-600 font-bold hover:text-blue-700 transition-colors bg-blue-50 px-3 py-1.5 rounded-lg">
            <Plus className="h-4 w-4 mr-1" /> Add Subject
          </button>
        </div>
        <div className="space-y-3">
          {scheduleFields.map((field, index) => (
             <div key={field.id} className="flex gap-2 group items-center bg-slate-50 p-2 rounded-xl border border-slate-200">
               <input {...register(`schedule.${index}.subject`)} className="flex-1 text-sm border-slate-200 bg-white p-2 rounded-lg font-medium text-slate-700 placeholder:text-slate-400" placeholder="Subject" />
               <input {...register(`schedule.${index}.date`)} className="w-32 text-sm border-slate-200 bg-white p-2 rounded-lg font-medium text-slate-700 placeholder:text-slate-400" placeholder="Date" />
               <input {...register(`schedule.${index}.time`)} className="w-28 text-sm border-slate-200 bg-white p-2 rounded-lg font-medium text-slate-700 placeholder:text-slate-400" placeholder="Time" />
               <button type="button" onClick={() => removeSchedule(index)} className="text-red-400 hover:text-red-600 transition-colors p-2 bg-red-50 rounded-lg opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
             </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
          <h3 className="text-lg font-bold text-slate-900">Students List</h3>
          <button type="button" onClick={() => appendStudent({ name: '', father: '', roll: '', class: '', room: '' })} className="text-sm flex items-center text-blue-600 font-bold hover:text-blue-700 transition-colors bg-blue-50 px-3 py-1.5 rounded-lg">
            <Plus className="h-4 w-4 mr-1" /> Add Student
          </button>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-600 mb-1 block">Bulk Paste (Roll, Name, Father, Class, Room)</label>
          <textarea {...register("bulkPaste")} className="w-full text-sm border border-slate-200 bg-slate-50 rounded-lg p-3 font-medium text-slate-700 placeholder:text-slate-400 resize-none min-h-[100px]" rows={3} placeholder="1001, John, Richard, 10A, Hall 1"></textarea>
          <button type="button" onClick={handleBulkPaste} className="mt-2 text-sm bg-slate-100 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors text-slate-800 font-bold">Import Students</button>
        </div>

        <div className="space-y-4 max-h-64 overflow-y-auto pr-2 mt-6 no-scrollbar">
          {studentFields.map((field, index) => (
            <div key={field.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl relative group shadow-sm">
              <button type="button" onClick={() => removeStudent(index)} className="absolute -top-3 -right-3 p-1.5 bg-white border border-red-200 text-red-500 rounded-full hover:bg-red-50 transition-all shadow-sm z-10 hidden group-hover:block"><Trash2 className="w-4 h-4" /></button>
              <div className="grid grid-cols-2 gap-3">
                <input {...register(`students.${index}.roll`)} className="text-sm border-slate-200 bg-white p-2.5 rounded-lg font-bold text-slate-900 placeholder:text-slate-400" placeholder="Roll Number" />
                <input {...register(`students.${index}.name`)} className="text-sm border-slate-200 bg-white p-2.5 rounded-lg font-bold text-slate-900 placeholder:text-slate-400" placeholder="Student Name" />
                <input {...register(`students.${index}.father`)} className="text-sm border-slate-200 bg-white p-2.5 rounded-lg font-medium text-slate-700 placeholder:text-slate-400" placeholder="Father Name" />
                <input {...register(`students.${index}.class`)} className="text-sm border-slate-200 bg-white p-2.5 rounded-lg font-medium text-slate-700 placeholder:text-slate-400" placeholder="Class/Sec" />
                <input {...register(`students.${index}.room`)} className="text-sm border-slate-200 bg-white p-2.5 rounded-lg font-medium text-slate-700 placeholder:text-slate-400 col-span-2" placeholder="Exam Room" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
         <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2"><LayoutTemplate className="h-5 w-5 text-blue-600" /> Theme Selection</h3>
         <div className="flex gap-4">
            <button type="button" onClick={() => setTheme('classic')} className={`flex-1 py-3 px-2 text-sm font-bold rounded-xl border transition-all ${theme === 'classic' ? 'border-slate-800 bg-slate-100 text-slate-900 shadow-sm' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}>Classic 2-per-page</button>
            <button type="button" onClick={() => setTheme('modern')} className={`flex-1 py-3 px-2 text-sm font-bold rounded-xl border transition-all ${theme === 'modern' ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}>Modern Color</button>
            <button type="button" onClick={() => setTheme('formal')} className={`flex-1 py-3 px-2 text-sm font-bold rounded-xl border transition-all ${theme === 'formal' ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}>Formal Exam Slip</button>
         </div>
      </div>
    </div>
  );

  const previewContent = (
    <div className="w-[210mm] min-h-[297mm] bg-white shadow-xl relative scale-[0.6] sm:scale-[0.8] md:scale-90 lg:scale-100 origin-top flex flex-col" ref={componentRef}>
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 w-full flex-wrap">
        {formData.students?.map((student: any, i: number) => {
          
          if (theme === 'classic') {
            return (
              <div key={i} className="border-2 border-black rounded-lg p-4 break-inside-avoid shadow-sm flex flex-col h-auto max-h-[148mm]">
                <div className="text-center border-b-2 border-black pb-2 mb-3">
                  <h2 className="font-black text-sm uppercase tracking-wide">{formData.schoolName}</h2>
                  <h3 className="text-xs font-bold bg-black text-white inline-block px-3 py-0.5 rounded-full mt-1 uppercase">{formData.examTitle}</h3>
                  <div className="text-[11px] font-bold tracking-[0.2em] mt-1 underline">ROLL NUMBER SLIP</div>
                </div>
                
                <div className="flex justify-between items-start mb-3">
                  <div className="grid grid-cols-[80px_1fr] gap-y-1 text-sm flex-1">
                    <span className="font-bold text-xs">Roll No:</span>
                    <span className="font-black border border-black px-2 py-0.5 inline-block w-max bg-slate-100">{student.roll || '______'}</span>
                    
                    <span className="font-bold text-xs mt-1 border-t border-slate-200 pt-1">Name:</span>
                    <span className="font-bold uppercase mt-1 border-t border-slate-200 pt-1">{student.name || '________________'}</span>
                    
                    <span className="font-bold text-xs">Father:</span>
                    <span className="uppercase text-xs font-semibold">{student.father || '________________'}</span>
                    
                    <span className="font-bold text-xs">Class:</span>
                    <span className="font-semibold text-xs">{student.class || '______'}</span>
                    
                    <span className="font-bold text-xs">Room:</span>
                    <span className="font-semibold text-xs">{student.room || '______'}</span>
                  </div>
                  <div className="w-20 h-24 border-2 border-black border-dashed flex items-center justify-center text-[10px] text-slate-400 shrink-0 ml-2">
                     Paste<br/>Photo
                  </div>
                </div>

                {formData.schedule && formData.schedule.length > 0 && (
                  <div className="mb-3">
                    <table className="w-full text-[10px] border-collapse border border-black">
                      <thead className="bg-slate-100">
                        <tr>
                          <th className="border border-black p-1 text-left">Subject</th>
                          <th className="border border-black p-1 text-center">Date</th>
                          <th className="border border-black p-1 text-center">Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.schedule.map((sch: any, idx: number) => (
                          <tr key={idx}>
                            <td className="border border-black p-1 font-bold">{sch.subject}</td>
                            <td className="border border-black p-1 text-center">{sch.date}</td>
                            <td className="border border-black p-1 text-center">{sch.time}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="text-[9px] mb-8 line-clamp-3">
                  <strong>Instructions:</strong> {formData.instructions}
                </div>

                <div className="mt-auto flex justify-between items-end">
                   <div className="w-24 border-t border-black text-center text-[10px] pb-1">Controller</div>
                   <div className="w-24 border-t border-black text-center text-[10px] pb-1">Principal Sign</div>
                </div>
              </div>
            );
          }

          if (theme === 'modern') {
             return (
              <div key={i} className="border-2 border-primary-500 rounded-2xl overflow-hidden break-inside-avoid flex flex-col shadow-sm">
                <div className="bg-primary-600 text-white p-3 text-center">
                  <h2 className="font-black text-sm uppercase">{formData.schoolName}</h2>
                  <h3 className="text-[11px] font-medium opacity-90">{formData.examTitle}</h3>
                  <div className="bg-white text-primary-900 text-[10px] font-bold tracking-widest inline-block px-4 rounded-full mt-1">ADMIT CARD</div>
                </div>
                
                <div className="p-4 flex-1 flex flex-col bg-slate-50">
                   <div className="flex gap-4 mb-4">
                     <div className="w-16 h-20 bg-white border border-slate-200 rounded-lg shadow-inner shrink-0"></div>
                     <div className="flex-1">
                        <div className="text-xl font-black text-slate-900 leading-none mb-1 uppercase">{student.name}</div>
                        <div className="text-[10px] text-slate-500 font-medium mb-2 uppercase">S/O {student.father}</div>
                        
                        <div className="flex gap-2 mb-1">
                          <div className="bg-primary-100 text-primary-800 px-2 py-0.5 rounded text-[10px] font-bold">Class {student.class}</div>
                          <div className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold">Room {student.room}</div>
                        </div>
                     </div>
                   </div>

                   <div className="bg-white border border-slate-200 rounded-lg p-2 mb-4 text-center">
                     <span className="text-[10px] text-slate-500 uppercase block font-bold">Roll Number</span>
                     <span className="text-2xl font-black tracking-widest text-primary-700 font-mono">{student.roll}</span>
                   </div>

                   {formData.schedule && formData.schedule.length > 0 && (
                     <div className="mb-4">
                       <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Schedule</div>
                       <div className="space-y-1">
                         {formData.schedule.map((sch: any, idx: number) => (
                           <div key={idx} className="flex justify-between text-[10px] bg-white border border-slate-100 p-1 rounded">
                             <span className="font-bold">{sch.subject}</span>
                             <span className="text-slate-500">{sch.date}</span>
                           </div>
                         ))}
                       </div>
                     </div>
                   )}

                   <div className="mt-auto flex justify-between items-end px-2 pt-4">
                      <div className="text-[8px] text-slate-400 uppercase w-3/4">{formData.instructions}</div>
                      <div className="w-16 border-t border-slate-400 text-center text-[8px] text-slate-500 font-bold">Principal</div>
                   </div>
                </div>
              </div>
             );
          }

          if (theme === 'formal') {
            return (
              <div key={i} className="border-[3px] border-double border-black p-4 break-inside-avoid shadow-sm flex flex-col bg-[#fffdfa]">
                <div className="text-center border-b border-black pb-2 mb-4">
                  <h2 className="font-serif font-bold text-base uppercase">{formData.schoolName}</h2>
                  <div className="text-xs uppercase mt-1">{formData.examTitle}</div>
                  <div className="text-[10px] font-bold bg-black text-white px-2 mt-2 inline-block">EXAMINATION ADMIT SLIP</div>
                </div>
                
                <div className="flex gap-4 mb-4">
                  <div className="flex-1 space-y-2 text-xs font-serif">
                    <div className="border-b border-dotted border-slate-400 pb-1 flex">
                      <span className="w-20 font-bold">Roll No:</span>
                      <span className="font-bold text-sm tracking-wider">{student.roll}</span>
                    </div>
                    <div className="border-b border-dotted border-slate-400 pb-1 flex">
                      <span className="w-20 font-bold">Candidate:</span>
                      <span className="uppercase">{student.name}</span>
                    </div>
                    <div className="border-b border-dotted border-slate-400 pb-1 flex">
                      <span className="w-20 font-bold">Father:</span>
                      <span className="uppercase">{student.father}</span>
                    </div>
                    <div className="border-b border-dotted border-slate-400 pb-1 flex">
                      <span className="w-20 font-bold">Class:</span>
                      <span>{student.class}</span>
                    </div>
                    <div className="border-b border-dotted border-slate-400 pb-1 flex">
                      <span className="w-20 font-bold">Center/Room:</span>
                      <span>{student.room}</span>
                    </div>
                  </div>
                  <div className="w-[70px] h-[90px] border border-black flex items-center justify-center text-[10px] text-center bg-white p-1">
                    Affix Photograph Here
                  </div>
                </div>

                <div className="mt-8 flex justify-between text-[10px] font-serif font-bold italic">
                   <div className="w-24 border-t border-black text-center pt-1">Candidate's Sign</div>
                   <div className="w-24 border-t border-black text-center pt-1">Issuer Sign</div>
                </div>
              </div>
            )
          }
          
        })}
      </div>
    </div>
  );

  return (
    <ToolLayout
      title="Roll Number Slips"
      description="Generate bulk admit cards with automatic schedule inclusion and professional templates."
      form={formContent}
      preview={previewContent}
      onPrint={handlePrint}
      onSaveDraft={handleSaveDraft}
      onReset={handleReset}
    >
      <div className="max-w-4xl mx-auto space-y-12">
        <section>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Bulk Roll Number Slip & Admit Card Generator</h2>
          <p className="text-lg text-slate-600 mb-4">
            Printing roll number slips individually is a massive bottleneck before exams. This tool allows you to paste student data in bulk and instantly generates 2-per-page or individual admit cards that include schedules and instructions.
          </p>
        </section>

        <section className="bg-primary-50 p-8 rounded-2xl border border-primary-100">
          <h3 className="text-2xl font-bold text-primary-900 mb-6">Key Features</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-bold text-primary-800">Bulk Import via Paste</h4>
              <p className="text-primary-700/80">Copy rows directly from Excel or Google Sheets (comma separated) and paste them into the Bulk Import box to generate hundreds of slips instantly.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-primary-800">Integrated Exam Schedule</h4>
              <p className="text-primary-700/80">Define the exam date sheet once, and it will automatically be printed on every single student's roll number slip.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-primary-800">Room and Seat Details</h4>
              <p className="text-primary-700/80">Specify exact exam halls and rooms for each student to prevent confusion on exam day.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-primary-800">Photo Affixation Areas</h4>
              <p className="text-primary-700/80">Formal templates include dedicated areas for students to paste passport-sized photographs.</p>
            </div>
          </div>
        </section>
      </div>
    </ToolLayout>
  );
}
