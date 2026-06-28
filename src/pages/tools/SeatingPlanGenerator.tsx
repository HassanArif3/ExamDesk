import React, { useState, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, LayoutTemplate } from 'lucide-react';
import ToolLayout from '../../components/layout/ToolLayout';
import { useDraft } from '../../hooks/useDraft';
import { usePrintDocument } from '../../hooks/usePrintDocument';

export default function SeatingPlanGenerator() {
  const [draft, setDraft, clearDraft] = useDraft<any>('draft_seating', null);
  const [theme, setTheme] = useState<'grid' | 'table' | 'compact'>('grid');
  const { componentRef, handlePrint } = usePrintDocument('Seating_Plan');

  const { register, control, watch, reset, setValue } = useForm({
    defaultValues: draft || {
      schoolName: 'Oxford High School',
      examTitle: 'Final Term Exam',
      date: new Date().toISOString().split('T')[0],
      session: 'Morning',
      instructions: 'Students must bring their roll number slips.',
      fillMode: 'column', // 'row' or 'column'
      shuffle: false,
      students: [
        { roll: '1001', name: 'Alice', class: '10A' },
        { roll: '1002', name: 'Bob', class: '10A' },
        { roll: '1003', name: 'Charlie', class: '10A' },
        { roll: '1004', name: 'Diana', class: '10A' },
      ],
      bulkPaste: '',
      rooms: [
        { roomName: 'Hall A', rows: 4, cols: 5, invigilator: '' }
      ]
    }
  });

  const { fields: roomFields, append: appendRoom, remove: removeRoom } = useFieldArray({ control, name: "rooms" });
  const { fields: studentFields, append: appendStudent, remove: removeStudent } = useFieldArray({ control, name: "students" });
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
        class: parts[2] || '',
      };
    }).filter(s => s.roll || s.name);
    
    setValue('students', newStudents);
    setValue('bulkPaste', '');
  };

  // Logic
  const totalStudents = formData.students?.length || 0;
  const totalSeats = formData.rooms?.reduce((sum: number, r: any) => sum + (Number(r.rows) * Number(r.cols)), 0) || 0;
  const emptySeats = totalSeats - totalStudents;
  const hasError = emptySeats < 0;

  const distributeStudents = () => {
    let studentList = [...(formData.students || [])];
    
    if (formData.shuffle) {
      studentList = studentList.sort(() => Math.random() - 0.5);
    }

    let studentIndex = 0;
    const roomPlans: any[] = [];

    formData.rooms?.forEach((room: any) => {
      const rows = Number(room.rows) || 1;
      const cols = Number(room.cols) || 1;
      const matrix: any[][] = Array(rows).fill(null).map(() => Array(cols).fill(null));
      const list: any[] = []; // for table/compact view

      if (formData.fillMode === 'row') {
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            if (studentIndex < studentList.length) {
              const s = studentList[studentIndex++];
              matrix[r][c] = s;
              list.push({...s, row: r+1, col: c+1});
            }
          }
        }
      } else { // column
        for (let c = 0; c < cols; c++) {
          for (let r = 0; r < rows; r++) {
            if (studentIndex < studentList.length) {
              const s = studentList[studentIndex++];
              matrix[r][c] = s;
              list.push({...s, row: r+1, col: c+1});
            }
          }
        }
      }

      roomPlans.push({
        roomName: room.roomName,
        invigilator: room.invigilator,
        rows, cols,
        matrix,
        list
      });
    });

    return roomPlans;
  };

  const roomPlans = useMemo(() => distributeStudents(), [formData.students, formData.rooms, formData.fillMode, formData.shuffle]);

  const formContent = (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl text-center">
          <div className="text-3xl font-black text-blue-600">{totalStudents}</div>
          <div className="text-xs font-bold text-blue-800/80 uppercase tracking-wider mt-1">Students</div>
        </div>
        <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl text-center">
          <div className="text-3xl font-black text-indigo-600">{totalSeats}</div>
          <div className="text-xs font-bold text-indigo-800/80 uppercase tracking-wider mt-1">Total Seats</div>
        </div>
        <div className={`p-4 rounded-2xl text-center border ${emptySeats < 0 ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
          <div className={`text-3xl font-black ${emptySeats < 0 ? 'text-red-600' : 'text-emerald-600'}`}>{Math.abs(emptySeats)}</div>
          <div className={`text-xs font-bold uppercase tracking-wider mt-1 ${emptySeats < 0 ? 'text-red-800' : 'text-emerald-800/80'}`}>
            {emptySeats < 0 ? 'Shortfall (Error)' : 'Empty Seats'}
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-center">
          <div className="text-3xl font-black text-slate-800">{formData.rooms?.length || 0}</div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Rooms</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Plan Details</h3>
        <input {...register("schoolName")} className="edtech-input bg-slate-50 border-slate-200" placeholder="School Name" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input {...register("examTitle")} className="edtech-input bg-slate-50 border-slate-200" placeholder="Exam Title" />
          <input type="date" {...register("date")} className="edtech-input bg-slate-50 border-slate-200" />
          <input {...register("session")} className="edtech-input bg-slate-50 border-slate-200" placeholder="Session (e.g. Morning)" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
          <h3 className="text-lg font-bold text-slate-900">Exam Rooms</h3>
          <button type="button" onClick={() => appendRoom({ roomName: '', rows: 5, cols: 4, invigilator: '' })} className="text-sm flex items-center text-blue-600 font-bold hover:text-blue-700 transition-colors bg-blue-50 px-3 py-1.5 rounded-lg">
            <Plus className="h-4 w-4 mr-1" /> Add Room
          </button>
        </div>

        <div className="space-y-4">
          {roomFields.map((field, index) => (
            <div key={field.id} className="p-5 bg-slate-50 border border-slate-200 rounded-xl relative group space-y-3 shadow-sm">
              <button type="button" onClick={() => removeRoom(index)} className="absolute -top-3 -right-3 p-1.5 bg-white border border-red-200 text-red-500 rounded-full hover:bg-red-50 transition-all shadow-sm z-10 hidden group-hover:block">
                <Trash2 className="h-4 w-4" />
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                <input {...register(`rooms.${index}.roomName`)} className="col-span-2 edtech-input py-2 min-h-[40px] bg-white border-slate-200" placeholder="Room Name (e.g. Hall A)" />
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Rows</label>
                  <input type="number" {...register(`rooms.${index}.rows`)} className="edtech-input py-2 min-h-[40px] bg-white border-slate-200" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Columns</label>
                  <input type="number" {...register(`rooms.${index}.cols`)} className="edtech-input py-2 min-h-[40px] bg-white border-slate-200" />
                </div>
                <input {...register(`rooms.${index}.invigilator`)} className="col-span-2 edtech-input py-2 min-h-[40px] bg-white border-slate-200" placeholder="Invigilator Name (Optional)" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Student Data</h3>
        
        <div>
          <label className="text-xs font-bold text-slate-600 mb-1 block">Bulk Paste (Format: Roll No, Name, Class)</label>
          <textarea {...register("bulkPaste")} className="edtech-input min-h-[80px] py-2 resize-none bg-slate-50 border-slate-200" rows={3} placeholder="1001, Alice, 10A&#10;1002, Bob, 10A"></textarea>
          <button type="button" onClick={handleBulkPaste} className="mt-2 text-sm bg-slate-100 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors text-slate-800 font-bold">Import Students</button>
        </div>

        <div className="flex justify-between items-center mt-6 border-t border-slate-100 pt-4">
          <span className="text-md font-bold text-slate-900">Manual Entry</span>
          <button type="button" onClick={() => appendStudent({ roll: '', name: '', class: '' })} className="text-sm text-blue-600 font-bold hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg flex items-center gap-1"><Plus className="w-4 h-4"/> Add Row</button>
        </div>
        
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2 no-scrollbar">
          {studentFields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-center group">
              <input {...register(`students.${index}.roll`)} className="w-24 edtech-input py-1.5 min-h-[36px] bg-slate-50 border-slate-200" placeholder="Roll" />
              <input {...register(`students.${index}.name`)} className="flex-1 edtech-input py-1.5 min-h-[36px] bg-slate-50 border-slate-200" placeholder="Name" />
              <input {...register(`students.${index}.class`)} className="w-24 edtech-input py-1.5 min-h-[36px] bg-slate-50 border-slate-200" placeholder="Class" />
              <button type="button" onClick={() => removeStudent(index)} className="text-red-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 p-2 bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
         <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2"><LayoutTemplate className="h-5 w-5 text-blue-600" /> Settings & Theme</h3>
         
         <div className="flex flex-wrap gap-6 mb-4 text-sm font-medium text-slate-700">
           <label className="flex items-center gap-2 cursor-pointer">
             <input type="radio" value="column" className="text-blue-600 focus:ring-blue-600 border-slate-300 w-4 h-4" {...register("fillMode")} /> Fill Column-wise
           </label>
           <label className="flex items-center gap-2 cursor-pointer">
             <input type="radio" value="row" className="text-blue-600 focus:ring-blue-600 border-slate-300 w-4 h-4" {...register("fillMode")} /> Fill Row-wise
           </label>
           <label className="flex items-center gap-2 cursor-pointer ml-auto bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
             <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-600 border-slate-300 w-4 h-4" {...register("shuffle")} /> Shuffle Students
           </label>
         </div>

         <div className="flex gap-4">
            <button type="button" onClick={() => setTheme('grid')} className={`flex-1 py-3 px-2 text-sm font-bold rounded-xl border transition-all ${theme === 'grid' ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}>Desk Grid</button>
            <button type="button" onClick={() => setTheme('table')} className={`flex-1 py-3 px-2 text-sm font-bold rounded-xl border transition-all ${theme === 'table' ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}>Room Table</button>
            <button type="button" onClick={() => setTheme('compact')} className={`flex-1 py-3 px-2 text-sm font-bold rounded-xl border transition-all ${theme === 'compact' ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}>Compact List</button>
         </div>
      </div>
    </div>
  );

  const previewContent = (
    <div className="w-[210mm] min-h-[297mm] bg-white shadow-xl relative scale-[0.6] sm:scale-[0.8] md:scale-90 lg:scale-100 origin-top flex flex-col" ref={componentRef}>
      {hasError && (
         <div className="absolute inset-0 bg-red-50/90 z-50 flex items-center justify-center p-12 text-center backdrop-blur-sm">
           <div className="bg-white p-8 rounded-2xl shadow-2xl border border-red-200">
             <h2 className="text-2xl font-black text-red-600 mb-2">Not Enough Seats!</h2>
             <p className="text-slate-700">You have <b>{totalStudents}</b> students but only <b>{totalSeats}</b> seats available across all rooms.</p>
             <p className="text-sm mt-4 text-slate-500">Please add more rooms or increase rows/columns.</p>
           </div>
         </div>
      )}

      {roomPlans.map((plan: any, rIndex: number) => (
          <div key={rIndex} className={`p-10 ${rIndex > 0 ? 'page-break-before mt-8 border-t-2 border-dashed border-slate-300' : ''} h-[297mm]`}>
            <div className="text-center mb-6 border-b-2 border-black pb-4">
               <h2 className="text-lg font-bold text-slate-600 uppercase tracking-widest">{formData.schoolName}</h2>
               <h1 className="text-2xl font-black uppercase mt-1">{formData.examTitle}</h1>
               <div className="flex justify-between mt-4 px-4 text-sm font-bold border border-slate-300 bg-slate-50 py-2">
                 <span>Date: {formData.date}</span>
                 <span>Session: {formData.session}</span>
                 <span className="bg-slate-800 text-white px-3 py-0.5 rounded">Room: {plan.roomName || 'Unnamed'}</span>
               </div>
            </div>

            {theme === 'grid' && (
              <>
                <div className="bg-slate-100 border border-slate-300 text-center py-2 mb-6 font-bold tracking-[0.5em] text-slate-500 text-xs">WHITEBOARD / STAGE</div>
                <div className="overflow-x-auto pb-4 flex justify-center">
                  <table className="border-separate border-spacing-3">
                    <tbody>
                      {plan.matrix.map((row: any[], r: number) => (
                        <tr key={r}>
                          {row.map((seat: any, c: number) => (
                            <td key={c} className="border-2 border-slate-300 rounded-md p-2 text-center w-[90px] h-[70px] bg-white relative shadow-sm">
                               <span className="absolute top-1 left-1 text-[7px] text-slate-400 font-bold">R{r+1}C{c+1}</span>
                               {seat ? (
                                 <div className="mt-2 flex flex-col items-center justify-center">
                                   <span className="font-bold text-slate-900 text-sm leading-tight">{seat.roll}</span>
                                   <span className="text-[9px] text-slate-500 truncate w-full uppercase mt-0.5">{seat.name}</span>
                                 </div>
                               ) : (
                                 <span className="text-slate-200 text-xs mt-3 block">EMPTY</span>
                               )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {theme === 'table' && (
              <table className="w-full border-collapse text-sm border border-black mb-8">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-black p-2 w-16 text-center">Seat</th>
                    <th className="border border-black p-2 text-left">Roll Number</th>
                    <th className="border border-black p-2 text-left">Student Name</th>
                    <th className="border border-black p-2 text-center w-24">Class</th>
                    <th className="border border-black p-2 w-32 text-center">Signature</th>
                  </tr>
                </thead>
                <tbody>
                  {plan.list.map((seat: any, i: number) => (
                    <tr key={i}>
                      <td className="border border-black p-2 text-center text-xs font-mono text-slate-500">R{seat.row}C{seat.col}</td>
                      <td className="border border-black p-2 font-bold">{seat.roll}</td>
                      <td className="border border-black p-2 uppercase">{seat.name}</td>
                      <td className="border border-black p-2 text-center">{seat.class}</td>
                      <td className="border border-black p-2"></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {theme === 'compact' && (
              <div className="columns-3 gap-6">
                {plan.list.map((seat: any, i: number) => (
                  <div key={i} className="mb-2 pb-1 border-b border-dashed border-slate-300 flex justify-between items-end break-inside-avoid">
                    <div>
                      <span className="font-bold text-sm block">{seat.roll}</span>
                      <span className="text-[10px] uppercase text-slate-600 block truncate w-24">{seat.name}</span>
                    </div>
                    <span className="text-[9px] font-mono text-slate-400">R{seat.row}C{seat.col}</span>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-12 text-sm text-slate-600 flex justify-between px-8">
              <div className="border-t border-black pt-1 text-center w-40 font-bold text-xs uppercase">
                {plan.invigilator || 'Invigilator Signature'}
              </div>
              <div className="text-xs font-bold text-slate-400">
                Total Allocated: {plan.list.length} / Capacity: {plan.rows * plan.cols}
              </div>
            </div>
          </div>
        ))}
    </div>
  );

  return (
    <ToolLayout
      title="Seating Plan Generator"
      description="Distribute students across multiple rooms automatically."
      form={formContent}
      preview={previewContent}
      onPrint={handlePrint}
      onSaveDraft={handleSaveDraft}
      onReset={handleReset}
    />
  );
}
