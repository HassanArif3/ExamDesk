import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck, Mail, User, HelpCircle, Layers } from 'lucide-react';

interface MultiStepFormProps {
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
}

export default function MultiStepForm({ onSubmit, loading }: MultiStepFormProps) {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
    companySize: '1-50',
    budget: '$1,000 - $5,000',
    timeline: 'Immediate'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNext = () => {
    if (step === 1 && (!formData.firstName || !formData.lastName || !formData.email)) {
      alert('Please fill out all contact fields.');
      return;
    }
    if (step === 2 && !formData.message) {
      alert('Please enter your inquiry details.');
      return;
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="space-y-6">
      {/* Stepper Header */}
      <div className="flex justify-between items-center mb-6">
        {[1, 2, 3].map((num) => (
          <div key={num} className="flex items-center flex-1 last:flex-initial">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
              step >= num ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
            }`}>
              {num}
            </div>
            {num < 3 && (
              <div className={`h-1 flex-1 mx-2 rounded-full transition-all duration-300 ${
                step > num ? 'bg-blue-600' : 'bg-slate-100'
              }`} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* STEP 1: CONTACT DETAILS */}
        {step === 1 && (
          <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" /> 1. Contact Information
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2">First Name *</label>
                <input 
                  type="text" 
                  name="firstName" 
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 h-12 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm font-semibold text-slate-800" 
                  placeholder="Jane" 
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2">Last Name *</label>
                <input 
                  type="text" 
                  name="lastName" 
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 h-12 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm font-semibold text-slate-800" 
                  placeholder="Doe" 
                  required 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">Work Email *</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 h-12 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm font-semibold text-slate-800" 
                placeholder="jane.doe@company.com" 
                required 
              />
            </div>
            
            <div className="flex justify-end pt-4">
              <button 
                type="button" 
                onClick={handleNext}
                disabled={!formData.firstName || !formData.lastName || !formData.email}
                className="flex items-center gap-2 bg-blue-600 text-white font-bold px-6 h-12 rounded-xl shadow-sm hover:shadow-lg hover:shadow-blue-600/20 hover:-translate-y-0.5 transition-all disabled:opacity-50"
              >
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: INQUIRY SPECIFICATION */}
        {step === 2 && (
          <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-500" /> 2. Inquiry Specification
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">Subject / Department</label>
              <select 
                name="subject" 
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 h-12 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm font-semibold text-slate-800"
              >
                <option>General Inquiry</option>
                <option>Technical Support</option>
                <option>Sales & Enterprise</option>
                <option>Partnerships</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">Detailed Message *</label>
              <textarea 
                name="message" 
                value={formData.message}
                onChange={handleChange}
                rows={4} 
                className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm font-semibold text-slate-800 min-h-[120px] resize-none" 
                placeholder="What parameters or integrations are you seeking?"
                required
              />
            </div>

            <div className="flex justify-between pt-4">
              <button 
                type="button" 
                onClick={handleBack}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-6 h-12 rounded-xl transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button 
                type="button" 
                onClick={handleNext}
                disabled={!formData.message}
                className="flex items-center gap-2 bg-blue-600 text-white font-bold px-6 h-12 rounded-xl shadow-sm hover:shadow-lg hover:shadow-blue-600/20 hover:-translate-y-0.5 transition-all disabled:opacity-50"
              >
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: ORGANIZATION INFO & SUBMIT */}
        {step === 3 && (
          <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-500" /> 3. Organization Details
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2">Company Size</label>
                <select 
                  name="companySize" 
                  value={formData.companySize}
                  onChange={handleChange}
                  className="w-full px-4 h-12 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm font-semibold text-slate-800"
                >
                  <option>1-50</option>
                  <option>51-200</option>
                  <option>201-1000</option>
                  <option>1000+</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2">Estimated Budget</label>
                <select 
                  name="budget" 
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full px-4 h-12 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm font-semibold text-slate-800"
                >
                  <option>$1,000 - $5,000</option>
                  <option>$5,000 - $15,000</option>
                  <option>$15,000+</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">Launch Timeline</label>
              <select 
                name="timeline" 
                value={formData.timeline}
                onChange={handleChange}
                className="w-full px-4 h-12 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm font-semibold text-slate-800"
              >
                <option>Immediate</option>
                <option>1 - 3 Months</option>
                <option>3+ Months</option>
              </select>
            </div>

            <div className="flex justify-between pt-4">
              <button 
                type="button" 
                onClick={handleBack}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-6 h-12 rounded-xl transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 h-12 rounded-xl shadow-sm hover:shadow-lg hover:shadow-emerald-600/20 hover:-translate-y-0.5 transition-all disabled:opacity-50"
              >
                <ShieldCheck className="w-5 h-5" /> {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </div>
        )}

      </form>
    </div>
  );
}
