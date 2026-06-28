import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { LayoutTemplate, Plus, Trash2 } from 'lucide-react';
import ToolLayout from '../../components/layout/ToolLayout';
import { useDraft } from '../../hooks/useDraft';
import { usePrintDocument } from '../../hooks/usePrintDocument';

export default function FeeSlipGenerator() {
  const [draft, setDraft, clearDraft] = useDraft<any>('draft_feeslip', null);
  const [theme, setTheme] = useState<'bank' | 'compact'>('bank');
  const { componentRef, handlePrint } = usePrintDocument('Fee_Slip');

  const { register, control, watch, reset } = useForm({
    defaultValues: draft || {
      schoolName: 'Global International School',
      bankName: 'National Bank Ltd',
      accountNo: 'xxxx-xxxx-xxxx',
      feeMonth: 'April 2024',
      dueDate: new Date().toISOString().split('T')[0],
      studentName: 'John Doe',
      rollNo: '101',
      className: 'Grade 10',
      section: 'A',
      feeItems: [
        { desc: 'Tuition Fee', amount: 3500 },
        { desc: 'Computer/Lab Fee', amount: 500 },
        { desc: 'Transport Fee', amount: 0 },
        { desc: 'Arrears', amount: 0 },
      ],
      discount: 0,
      fine: 0,
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: "feeItems" });
  const formData = watch();

  const handleSaveDraft = () => setDraft(formData);
  const handleReset = () => { clearDraft(); reset(); };

  const calculateTotal = () => {
    const itemsTotal = formData.feeItems?.reduce((sum: number, item: any) => sum + (Number(item.amount) || 0), 0) || 0;
    const fine = Number(formData.fine) || 0;
    const discount = Number(formData.discount) || 0;
    return itemsTotal + fine - discount;
  };
  const totalAmount = calculateTotal();

  const formContent = (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Institution Details</h3>
        <input {...register("schoolName")} className="edtech-input bg-slate-50 border-slate-200" placeholder="School Name" />
        <div className="grid grid-cols-2 gap-3">
          <input {...register("bankName")} className="edtech-input bg-slate-50 border-slate-200" placeholder="Bank Name" />
          <input {...register("accountNo")} className="edtech-input bg-slate-50 border-slate-200" placeholder="Account No" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Student & Billing</h3>
        <div className="grid grid-cols-2 gap-3">
          <input {...register("studentName")} className="col-span-2 sm:col-span-1 edtech-input bg-slate-50 border-slate-200" placeholder="Student Name" />
          <input {...register("rollNo")} className="col-span-2 sm:col-span-1 edtech-input bg-slate-50 border-slate-200" placeholder="Roll No" />
          <input {...register("className")} className="edtech-input bg-slate-50 border-slate-200" placeholder="Class" />
          <input {...register("section")} className="edtech-input bg-slate-50 border-slate-200" placeholder="Section" />
          <input {...register("feeMonth")} className="col-span-2 edtech-input bg-slate-50 border-slate-200" placeholder="Fee Month (e.g. April)" />
          <div className="col-span-2">
            <label className="text-xs font-bold text-slate-600 mb-1 block">Due Date</label>
            <input type="date" {...register("dueDate")} className="edtech-input bg-slate-50 border-slate-200 w-full" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
          <h3 className="text-lg font-bold text-slate-900">Fee Breakup</h3>
          <button type="button" onClick={() => append({ desc: '', amount: 0 })} className="text-sm flex items-center text-blue-600 font-bold hover:text-blue-700 transition-colors bg-blue-50 px-3 py-1.5 rounded-lg">
            <Plus className="h-4 w-4 mr-1" /> Add Item
          </button>
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-center group bg-slate-50 p-2 rounded-xl border border-slate-200">
              <input {...register(`feeItems.${index}.desc`)} className="flex-1 edtech-input min-h-[40px] py-2 bg-white border-slate-200" placeholder="Description" />
              <input type="number" {...register(`feeItems.${index}.amount`)} className="w-24 sm:w-32 edtech-input min-h-[40px] py-2 bg-white border-slate-200 font-medium" placeholder="Amount" />
              <button type="button" onClick={() => remove(index)} className="text-red-400 hover:text-red-600 p-2 transition-colors bg-red-50 rounded-lg opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
          
          <div className="pt-4 border-t border-slate-100 mt-4 space-y-3">
            <div className="flex gap-3 items-center justify-end">
              <span className="text-sm font-bold text-slate-600">Late Fee / Fine:</span>
              <input type="number" {...register("fine")} className="w-24 sm:w-32 edtech-input min-h-[40px] py-2 bg-slate-50 border-slate-200 font-medium" />
            </div>
            <div className="flex gap-3 items-center justify-end">
              <span className="text-sm font-bold text-slate-600">Discount:</span>
              <input type="number" {...register("discount")} className="w-24 sm:w-32 edtech-input min-h-[40px] py-2 bg-slate-50 border-slate-200 font-medium text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
         <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2"><LayoutTemplate className="h-5 w-5 text-blue-600" /> Theme Selection</h3>
         <div className="flex gap-4">
            <button type="button" onClick={() => setTheme('bank')} className={`flex-1 py-3 px-4 rounded-xl border text-sm font-bold transition-all ${theme === 'bank' ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}>Bank 3-Part Form</button>
            <button type="button" onClick={() => setTheme('compact')} className={`flex-1 py-3 px-4 rounded-xl border text-sm font-bold transition-all ${theme === 'compact' ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}>Compact 2-Part</button>
         </div>
      </div>
    </div>
  );

  const SlipSection = ({ title }: { title: string }) => (
    <div className="flex-1 border-r border-dashed border-slate-400 last:border-r-0 px-6 py-4 flex flex-col">
      <div className="text-center mb-4 border-b pb-2 border-black">
        <h2 className="font-bold uppercase tracking-wider">{formData.schoolName}</h2>
        <div className="text-xs uppercase bg-black text-white inline-block px-2 py-0.5 mt-1 font-bold">{title}</div>
        <div className="text-xs mt-1 font-medium">{formData.bankName} - {formData.accountNo}</div>
      </div>
      
      <div className="space-y-1 mb-4 text-xs font-semibold">
        <div className="flex justify-between"><span className="text-slate-500">Student:</span> <span>{formData.studentName || '-'}</span></div>
        <div className="flex justify-between"><span className="text-slate-500">Roll/Class:</span> <span>{formData.rollNo} / {formData.className}-{formData.section}</span></div>
        <div className="flex justify-between"><span className="text-slate-500">Month:</span> <span>{formData.feeMonth}</span></div>
        <div className="flex justify-between"><span className="text-slate-500">Due Date:</span> <span className="text-red-600">{formData.dueDate}</span></div>
      </div>

      <table className="w-full text-xs border-collapse mb-4 flex-1">
        <thead>
          <tr className="border-b-2 border-black">
            <th className="text-left py-1">Description</th>
            <th className="text-right py-1">Amount</th>
          </tr>
        </thead>
        <tbody>
          {formData.feeItems?.map((item: any, i: number) => (
            <tr key={i} className="border-b border-slate-200">
              <td className="py-1">{item.desc}</td>
              <td className="py-1 text-right">{item.amount || '0'}</td>
            </tr>
          ))}
          {Number(formData.fine) > 0 && (
            <tr className="border-b border-slate-200">
              <td className="py-1">Fine/Late Fee</td>
              <td className="py-1 text-right">{formData.fine}</td>
            </tr>
          )}
          {Number(formData.discount) > 0 && (
            <tr className="border-b border-slate-200">
              <td className="py-1">Discount</td>
              <td className="py-1 text-right text-red-600">-{formData.discount}</td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr className="font-bold border-t-2 border-black">
            <td className="py-2">TOTAL PAYABLE</td>
            <td className="py-2 text-right text-sm">{totalAmount}</td>
          </tr>
        </tfoot>
      </table>

      <div className="mt-auto pt-6 flex justify-between text-[10px] font-bold text-slate-500">
        <div className="border-t border-black w-20 text-center pt-1">Cashier</div>
        <div className="border-t border-black w-20 text-center pt-1">Officer</div>
      </div>
    </div>
  );

  const previewContent = (
    <div className={`bg-white shadow-xl relative origin-top scale-[0.5] sm:scale-[0.7] md:scale-90 lg:scale-100 ${theme === 'bank' ? 'w-[297mm] min-h-[210mm]' : 'w-[210mm] min-h-[148mm]'}`} ref={componentRef}>
      {theme === 'bank' ? (
        // Bank Layout (Landscape A4, 3 copies)
        <div className="w-full h-full p-4 flex">
           <SlipSection title="Bank Copy" />
           <SlipSection title="School Copy" />
           <SlipSection title="Student Copy" />
        </div>
      ) : (
        // Compact Layout (A5 / Half Page, 2 copies)
        <div className="w-full h-full p-4 flex">
           <SlipSection title="School Copy" />
           <SlipSection title="Student Copy" />
        </div>
      )}
    </div>
  );

  return (
    <ToolLayout
      title="Fee Slip Generator"
      description="Create automated multi-part fee vouchers for bank deposits."
      form={formContent}
      preview={previewContent}
      onPrint={handlePrint}
      onSaveDraft={handleSaveDraft}
      onReset={handleReset}
    />
  );
}
