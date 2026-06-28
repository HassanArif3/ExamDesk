import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { LayoutTemplate } from 'lucide-react';
import ToolLayout from '../../components/layout/ToolLayout';
import { useDraft } from '../../hooks/useDraft';
import { usePrintDocument } from '../../hooks/usePrintDocument';

export default function CertificateGenerator() {
  const [draft, setDraft, clearDraft] = useDraft<any>('draft_certificate', null);
  const [theme, setTheme] = useState<'elegant' | 'modern' | 'minimal'>('elegant');
  const { componentRef, handlePrint } = usePrintDocument('Certificate');

  const { register, watch, reset } = useForm({
    defaultValues: draft || {
      schoolName: 'Oxford International Academy',
      title: 'CERTIFICATE OF ACHIEVEMENT',
      subtitle: 'This is proudly presented to',
      studentName: 'Eleanor Shellstrop',
      bodyText: 'for outstanding academic performance and exemplary conduct during the academic session of 2023-2024. Your dedication to excellence sets a standard for all.',
      date: new Date().toISOString().split('T')[0],
      signature1Title: 'Class Teacher',
      signature2Title: 'Principal',
    }
  });

  const formData = watch();

  const handleSaveDraft = () => setDraft(formData);
  const handleReset = () => { clearDraft(); reset(); };

  const formContent = (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Institution Details</h3>
        <input {...register("schoolName")} className="edtech-input bg-slate-50 border-slate-200" placeholder="School Name" />
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Certificate Content</h3>
        <input {...register("title")} className="edtech-input bg-slate-50 border-slate-200 font-bold" placeholder="e.g. CERTIFICATE OF APPRECIATION" />
        <input {...register("subtitle")} className="edtech-input bg-slate-50 border-slate-200" placeholder="e.g. This is proudly presented to" />
        <input {...register("studentName")} className="edtech-input bg-slate-50 border-slate-200 text-lg font-bold" placeholder="Student Name" />
        <textarea {...register("bodyText")} rows={4} className="edtech-input bg-slate-50 border-slate-200 min-h-[100px] py-3 resize-none" placeholder="Reason for certificate..."></textarea>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Footer Details</h3>
        <input type="date" {...register("date")} className="edtech-input bg-slate-50 border-slate-200" />
        <div className="grid grid-cols-2 gap-3">
          <input {...register("signature1Title")} className="edtech-input bg-slate-50 border-slate-200" placeholder="Left Signature Title" />
          <input {...register("signature2Title")} className="edtech-input bg-slate-50 border-slate-200" placeholder="Right Signature Title" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
         <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2"><LayoutTemplate className="h-5 w-5 text-blue-600" /> Theme Selection</h3>
         <div className="flex gap-4">
            <button type="button" onClick={() => setTheme('elegant')} className={`flex-1 py-3 px-2 text-sm font-bold rounded-xl border transition-all ${theme === 'elegant' ? 'border-amber-600 bg-amber-50 text-amber-700 shadow-sm' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}>Elegant Gold</button>
            <button type="button" onClick={() => setTheme('modern')} className={`flex-1 py-3 px-2 text-sm font-bold rounded-xl border transition-all ${theme === 'modern' ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}>Modern Blue</button>
            <button type="button" onClick={() => setTheme('minimal')} className={`flex-1 py-3 px-2 text-sm font-bold rounded-xl border transition-all ${theme === 'minimal' ? 'border-slate-800 bg-slate-100 text-slate-900 shadow-sm' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}>Minimal</button>
         </div>
      </div>
    </div>
  );

  const renderElegant = () => (
    <div className="w-[297mm] h-[210mm] bg-white p-8 relative">
      <div className="absolute inset-4 border-[12px] border-double border-amber-600/30 rounded-xl pointer-events-none"></div>
      <div className="absolute inset-6 border border-amber-800/20 rounded-lg pointer-events-none"></div>
      
      <div className="h-full flex flex-col items-center text-center px-24 py-12">
        <h2 className="text-xl font-bold uppercase tracking-[0.3em] text-slate-500 mb-8">{formData.schoolName}</h2>
        
        <h1 className="text-6xl font-serif text-amber-700 mb-6 uppercase tracking-wider">{formData.title}</h1>
        
        <p className="text-lg italic text-slate-600 mb-8">{formData.subtitle}</p>
        
        <h3 className="text-5xl font-serif font-bold text-slate-900 mb-8 pb-4 border-b-2 border-amber-200 min-w-[500px]">
          {formData.studentName || 'Student Name'}
        </h3>
        
        <p className="text-lg text-slate-700 leading-relaxed max-w-3xl mb-auto">
          {formData.bodyText}
        </p>

        <div className="w-full flex justify-between items-end mt-16 px-12">
          <div className="text-center w-48">
            <div className="border-b border-black pb-2 mb-2 font-medium">{formData.date}</div>
            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Date</div>
          </div>
          
          <div className="w-24 h-24 rounded-full border-4 border-amber-600 border-double flex items-center justify-center text-amber-600 bg-amber-50 rotate-12 opacity-80">
            <span className="font-serif text-xs font-bold text-center leading-tight">OFFICIAL<br/>SEAL</span>
          </div>

          <div className="text-center w-48">
            <div className="border-b border-black h-8 mb-2"></div>
            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">{formData.signature2Title}</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderModern = () => (
    <div className="w-[297mm] h-[210mm] bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-[210mm] bg-primary-900 skew-x-[-15deg] -ml-20"></div>
      <div className="absolute top-0 left-0 w-8 h-[210mm] bg-secondary-500 skew-x-[-15deg] ml-40"></div>
      
      <div className="relative h-full flex flex-col pl-64 pr-24 py-16">
        <div className="text-right mb-16">
          <h2 className="text-2xl font-black uppercase tracking-tight text-primary-900">{formData.schoolName}</h2>
        </div>
        
        <div className="mb-8">
          <h1 className="text-5xl font-black text-slate-900 mb-2 uppercase tracking-tight">{formData.title}</h1>
          <div className="w-24 h-2 bg-secondary-500"></div>
        </div>
        
        <p className="text-lg text-slate-500 font-medium mb-4 uppercase tracking-widest">{formData.subtitle}</p>
        
        <h3 className="text-5xl font-bold text-primary-800 mb-8">{formData.studentName || 'Student Name'}</h3>
        
        <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mb-auto">
          {formData.bodyText}
        </p>

        <div className="w-full flex justify-between items-end mt-16 pt-8 border-t-2 border-slate-200">
          <div>
            <div className="font-bold text-slate-900 text-lg mb-1">{formData.date}</div>
            <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">Award Date</div>
          </div>
          
          <div className="flex gap-16 text-right">
            <div>
              <div className="w-48 border-b-2 border-slate-800 h-10 mb-2"></div>
              <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">{formData.signature1Title}</div>
            </div>
            <div>
              <div className="w-48 border-b-2 border-slate-800 h-10 mb-2"></div>
              <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">{formData.signature2Title}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMinimal = () => (
    <div className="w-[297mm] h-[210mm] bg-white p-16">
      <div className="h-full border border-slate-200 p-16 flex flex-col justify-center text-center">
        <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-slate-400 mb-12">{formData.schoolName}</h2>
        
        <h1 className="text-4xl font-light text-slate-900 mb-12 uppercase tracking-widest">{formData.title}</h1>
        
        <p className="text-sm text-slate-500 uppercase tracking-widest mb-6">{formData.subtitle}</p>
        
        <h3 className="text-4xl font-medium text-slate-900 mb-8">
          {formData.studentName || 'Student Name'}
        </h3>
        
        <p className="text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto mb-24 font-light">
          {formData.bodyText}
        </p>

        <div className="w-full flex justify-between px-24 text-sm uppercase tracking-widest text-slate-400">
          <div className="text-center w-48">
            <div className="border-t border-slate-300 pt-4 mt-8">{formData.date}</div>
          </div>
          <div className="text-center w-48">
            <div className="border-t border-slate-300 pt-4 mt-8">{formData.signature2Title}</div>
          </div>
        </div>
      </div>
    </div>
  );

  const previewContent = (
    <div className="shadow-xl relative origin-top scale-[0.5] sm:scale-[0.7] md:scale-90 lg:scale-100 w-[297mm] min-h-[210mm]" ref={componentRef}>
      {theme === 'elegant' && renderElegant()}
      {theme === 'modern' && renderModern()}
      {theme === 'minimal' && renderMinimal()}
    </div>
  );

  return (
    <ToolLayout
      title="Certificate Maker"
      description="Design beautiful achievement and participation certificates instantly."
      form={formContent}
      preview={previewContent}
      onPrint={handlePrint}
      onSaveDraft={handleSaveDraft}
      onReset={handleReset}
    />
  );
}
