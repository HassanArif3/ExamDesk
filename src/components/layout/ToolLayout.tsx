import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Settings2, Download, Printer, Save, Trash2, HelpCircle } from "lucide-react";

interface ToolLayoutProps {
  title: string;
  description: string;
  form: ReactNode;
  preview: ReactNode;
  onPrint?: () => void;
  onDownload?: () => void;
  onSaveDraft?: () => void;
  onReset?: () => void;
  onSampleData?: () => void;
  children?: ReactNode;
}

export default function ToolLayout({
  title,
  description,
  form,
  preview,
  onPrint,
  onDownload,
  onSaveDraft,
  onReset,
  onSampleData,
  children
}: ToolLayoutProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-16 font-sans">
      {/* Header & Breadcrumbs */}
      <div className="mb-10">
        <nav className="flex text-sm text-slate-500 mb-4 items-center font-medium">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2 opacity-50" />
          <Link to="/tools" className="hover:text-blue-600 transition-colors">Tools</Link>
          <ChevronRight className="h-4 w-4 mx-2 opacity-50" />
          <span className="text-slate-900 font-semibold">{title}</span>
        </nav>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
           <div>
             <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">{title}</h1>
             <p className="text-lg text-slate-600 max-w-2xl font-medium">{description}</p>
           </div>
           <div className="flex flex-wrap gap-2">
             <span className="px-3 py-1 rounded-lg bg-blue-50 border border-blue-100 text-xs font-bold text-blue-700 uppercase tracking-wider">Free Tool</span>
             <span className="px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-100 text-xs font-bold text-emerald-700 uppercase tracking-wider">Print Ready</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
          {form}
        </div>

        {/* Right Column: Preview & Actions */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6 lg:sticky lg:top-28">
          
          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 pl-2">
              <span className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100 tracking-wider uppercase">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Live Preview
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-1.5 pr-1">
              {onSampleData && (
                <button onClick={onSampleData} className="text-sm font-medium px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-colors flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" /> Sample
                </button>
              )}
              {onReset && (
                <button onClick={onReset} className="text-sm font-medium px-3 py-2 text-red-600/80 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors flex items-center gap-2">
                  <Trash2 className="h-4 w-4" /> Clear
                </button>
              )}
              {onSaveDraft && (
                <button onClick={onSaveDraft} className="text-sm font-medium px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-colors flex items-center gap-2">
                  <Save className="h-4 w-4" /> Save
                </button>
              )}
              <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block"></div>
              {onPrint && (
                <button onClick={onPrint} className="text-sm font-bold px-4 py-2 bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 rounded-xl transition-all flex items-center gap-2 shadow-sm">
                  <Printer className="h-4 w-4 text-blue-600" /> Print
                </button>
              )}
              {onDownload && (
                <button onClick={onDownload} className="text-sm font-bold px-5 py-2.5 bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 rounded-xl transition-all flex items-center gap-2">
                  <Download className="h-4 w-4" /> PDF
                </button>
              )}
            </div>
          </div>

          {/* Preview Canvas */}
          <div 
            className="bg-slate-100 rounded-3xl p-4 sm:p-8 md:p-12 border border-slate-200 shadow-inner overflow-auto flex justify-center items-start min-h-[600px] max-h-[800px] no-scrollbar relative"
            style={{
              backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-slate-100/50 to-transparent pointer-events-none rounded-3xl" />
            <div className="relative z-10 transition-all duration-300">
               {preview}
            </div>
          </div>
        </div>
      </div>
      {children && (
        <div className="mt-24 border-t border-slate-200 pt-16">
          {children}
        </div>
      )}
    </div>
  );
}
