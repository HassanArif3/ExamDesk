import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { LayoutTemplate, Plus, Trash2 } from 'lucide-react';
import ToolLayout from '../../components/layout/ToolLayout';
import { useDraft } from '../../hooks/useDraft';
import { usePrintDocument } from '../../hooks/usePrintDocument';

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function AttendanceSheetGenerator() {
  const [draft, setDraft, clearDraft] = useDraft<any>('draft_attendance', null);
  const [theme, setTheme] = useState<'landscape' | 'compact'>('landscape');
  const { componentRef, handlePrint } = usePrintDocument('Attendance_Sheet');

  const { register, control, watch, reset, setValue } = useForm({
    defaultValues: draft || {
      schoolName: 'Excellence High School',
      className: 'Grade 10',
      section: 'A',
      teacherName: '',
      month: new Date().getMonth().toString(),
      year: new Date().getFullYear().toString(),
      excludeSundays: true,
      excludeSaturdays: false,
      students: [
        { roll: '1', name: 'John Doe' },
        { roll: '2', name: 'Jane Smith' },
      ],
      bulkPaste: ''
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: "students" });
  const formData = watch();

  const handleSaveDraft = () => setDraft(formData);
  const handleReset = () => { clearDraft(); reset(); };

  const handleBulkPaste = () => {
    if (!formData.bulkPaste) return;
    const rows = formData.bulkPaste.split('\n');
    const newStudents = rows.map(r => {
      const parts = r.split(',').map(s => s.trim());
      if (parts.length >= 2) return { roll: parts[0], name: parts[1] };
      return { roll: '', name: parts[0] || '' };
    }).filter(s => s.name);
    
    setValue('students', newStudents);
    setValue('bulkPaste', '');
  };

  const formContent = (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Class Information</h3>
        <input {...register("schoolName")} className="edtech-input bg-slate-50 border-slate-200" placeholder="School Name" />
        <div className="grid grid-cols-2 gap-3">
          <input {...register("className")} className="edtech-input bg-slate-50 border-slate-200" placeholder="Class/Grade" />
          <input {...register("section")} className="edtech-input bg-slate-50 border-slate-200" placeholder="Section" />
          <input {...register("teacherName")} className="col-span-2 edtech-input bg-slate-50 border-slate-200" placeholder="Teacher Name" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Date Settings</h3>
        <div className="grid grid-cols-2 gap-3">
          <select {...register("month")} className="edtech-input bg-slate-50 border-slate-200 font-medium text-slate-700">
            {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>
          <input type="number" {...register("year")} className="edtech-input bg-slate-50 border-slate-200" placeholder="Year" />
        </div>
        <div className="flex gap-4 text-sm font-medium mt-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <label className="flex items-center gap-2 cursor-pointer text-slate-700"><input type="checkbox" className="rounded text-blue-600 focus:ring-blue-600 border-slate-300 w-4 h-4" {...register("excludeSundays")} /> Exclude Sundays</label>
          <label className="flex items-center gap-2 cursor-pointer text-slate-700"><input type="checkbox" className="rounded text-blue-600 focus:ring-blue-600 border-slate-300 w-4 h-4" {...register("excludeSaturdays")} /> Exclude Saturdays</label>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
          <h3 className="text-lg font-bold text-slate-900">Student List</h3>
          <button type="button" onClick={() => append({ roll: '', name: '' })} className="text-sm text-blue-600 font-bold hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg flex items-center gap-1">
            <Plus className="w-4 h-4"/> Add Student
          </button>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-600 mb-1 block">Bulk Paste (Format: Roll No, Name)</label>
          <textarea {...register("bulkPaste")} className="edtech-input min-h-[80px] py-2 resize-none bg-slate-50 border-slate-200" rows={3} placeholder="1, Alice&#10;2, Bob"></textarea>
          <button type="button" onClick={handleBulkPaste} className="mt-2 text-sm bg-slate-100 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors text-slate-800 font-bold">Import Students</button>
        </div>

        <div className="space-y-2 mt-4 max-h-64 overflow-y-auto pr-2 no-scrollbar">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-center group">
              <input {...register(`students.${index}.roll`)} className="w-20 edtech-input py-1.5 min-h-[36px] bg-slate-50 border-slate-200" placeholder="Roll" />
              <input {...register(`students.${index}.name`)} className="flex-1 edtech-input py-1.5 min-h-[36px] bg-slate-50 border-slate-200" placeholder="Student Name" />
              <button type="button" onClick={() => remove(index)} className="text-red-400 hover:text-red-600 transition-colors p-2 bg-red-50 rounded-lg opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
         <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2"><LayoutTemplate className="h-5 w-5 text-blue-600" /> Layout Selection</h3>
         <div className="flex gap-4">
            <button type="button" onClick={() => setTheme('landscape')} className={`flex-1 py-3 px-4 rounded-xl border text-sm font-bold transition-all ${theme === 'landscape' ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}>Landscape A4</button>
            <button type="button" onClick={() => setTheme('compact')} className={`flex-1 py-3 px-4 rounded-xl border text-sm font-bold transition-all ${theme === 'compact' ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}>Compact View</button>
         </div>
      </div>
    </div>
  );

  // Calculate Dates
  const getDaysInMonth = () => {
    const year = parseInt(formData.year) || new Date().getFullYear();
    const month = parseInt(formData.month) || 0;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const dates = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dayOfWeek = date.getDay();
      
      if (formData.excludeSundays && dayOfWeek === 0) continue;
      if (formData.excludeSaturdays && dayOfWeek === 6) continue;
      
      dates.push({
        dateNum: i,
        dayStr: ['S', 'M', 'T', 'W', 'T', 'F', 'S'][dayOfWeek]
      });
    }
    return dates;
  };

  const dates = getDaysInMonth();
  const monthName = MONTHS[parseInt(formData.month) || 0];

  const previewContent = (
    <div className={`bg-white shadow-xl relative origin-top scale-[0.6] sm:scale-[0.8] md:scale-90 lg:scale-100 ${theme === 'landscape' ? 'w-[297mm] min-h-[210mm]' : 'w-[210mm] min-h-[297mm]'}`} ref={componentRef}>
      <div className="p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold uppercase">{formData.schoolName}</h1>
          <h2 className="text-lg font-semibold border-b border-black inline-block pb-1 mt-1">MONTHLY ATTENDANCE REGISTER</h2>
          <div className="flex justify-between mt-4 text-sm font-bold">
            <span className="w-1/3 text-left">Class: {formData.className} {formData.section && `- Sec ${formData.section}`}</span>
            <span className="w-1/3 text-center">Month: {monthName} {formData.year}</span>
            <span className="w-1/3 text-right">Teacher: {formData.teacherName || '_____________'}</span>
          </div>
        </div>

        <table className="w-full border-collapse text-[10px]">
          <thead>
            <tr>
              <th className="border border-black p-1 w-8">R.No</th>
              <th className="border border-black p-1 w-32 text-left">Student Name</th>
              {dates.map((d, i) => (
                <th key={i} className="border border-black p-0 w-5">
                  <div className="text-[8px] bg-slate-100 border-b border-black">{d.dayStr}</div>
                  <div>{d.dateNum}</div>
                </th>
              ))}
              <th className="border border-black p-1 w-10">Total</th>
            </tr>
          </thead>
          <tbody>
            {formData.students?.map((student: any, i: number) => (
              <tr key={i} className="h-6 even:bg-slate-50">
                <td className="border border-black p-1 text-center font-medium">{student.roll}</td>
                <td className="border border-black p-1 font-semibold truncate max-w-[120px]">{student.name}</td>
                {dates.map((_, idx) => (
                  <td key={idx} className="border border-black p-1 text-center"></td>
                ))}
                <td className="border border-black p-1"></td>
              </tr>
            ))}
            {/* Blank rows to fill space */}
            {Array.from({ length: Math.max(0, 15 - (formData.students?.length || 0)) }).map((_, i) => (
              <tr key={`blank-${i}`} className="h-6">
                <td className="border border-black"></td>
                <td className="border border-black"></td>
                {dates.map((_, idx) => <td key={idx} className="border border-black"></td>)}
                <td className="border border-black"></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-12 flex justify-between px-8 text-xs font-bold">
           <div className="border-t border-black w-32 text-center pt-1">Class Teacher</div>
           <div className="border-t border-black w-32 text-center pt-1">Principal</div>
        </div>
      </div>
    </div>
  );

  return (
    <ToolLayout
      title="Attendance Sheet Generator"
      description="Create printable monthly attendance registers instantly."
      form={formContent}
      preview={previewContent}
      onPrint={handlePrint}
      onSaveDraft={handleSaveDraft}
      onReset={handleReset}
    />
  );
}
