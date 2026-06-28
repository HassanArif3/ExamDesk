import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ShieldCheck, Users, Banknote, FileCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function CustomSoftware() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const { register, handleSubmit, reset } = useForm();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, subject: 'Custom Software Inquiry' })
      });
      if (res.ok) {
        setSubmitted(true);
        showToast('Inquiry submitted successfully!');
        reset();
      } else {
        showToast("Server error. Please try again.");
      }
    } catch (e) {
      showToast("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col relative w-full font-sans">
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-lg z-50 text-sm font-bold animate-in fade-in slide-in-from-top-4">
          {toastMessage}
        </div>
      )}

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 px-6 md:px-12 overflow-hidden">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-400/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-400/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-bold text-xs uppercase tracking-widest shadow-sm">
                <ShieldCheck className="h-4 w-4" />
                Enterprise Grade Solutions
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight tracking-tight">
                Custom School Management <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">System Development</span>
              </h1>
              <p className="text-xl text-slate-600 font-medium max-w-xl leading-relaxed">
                Streamline your institution's operations with bespoke software tailored exactly to your workflows. From admissions to alumni management, build a unified digital ecosystem.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <a href="#inquiry" className="bg-blue-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 transition-all duration-300 flex items-center gap-2">
                  Start Your Project
                  <ArrowRight className="h-5 w-5" />
                </a>
                <a href="#features" className="bg-white border border-slate-200 text-slate-700 font-bold px-8 py-4 rounded-xl hover:bg-slate-50 transition-colors duration-300 flex items-center gap-2 shadow-sm">
                  Explore Features
                </a>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative h-[600px] rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-200/50 group"
            >
              <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors duration-500 z-10"></div>
              <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200" alt="Modern dashboard interface" className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700" />
            </motion.div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section id="features" className="py-24 px-6 md:px-12 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Architected for Academic Excellence</h2>
              <p className="text-xl text-slate-600 font-medium">Modular, scalable features designed to handle the complexities of modern educational institutions.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto md:auto-rows-[280px]">
              {/* Large Feature Card */}
              <div className="md:col-span-2 bg-slate-50 rounded-3xl p-10 shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:bg-blue-600/10 transition-colors"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6 shadow-sm">
                    <Users className="h-7 w-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Comprehensive Student Management</h3>
                  <p className="text-slate-600 font-medium max-w-lg leading-relaxed">End-to-end lifecycle tracking from inquiry to graduation. Manage attendance, behavior records, health info, and academic progression in one unified profile.</p>
                </div>
              </div>
              
              {/* Small Feature Card */}
              <div className="bg-slate-50 rounded-3xl p-10 shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 shadow-sm">
                  <Banknote className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">Fee Management</h3>
                <p className="text-slate-600 font-medium leading-relaxed">Automated invoicing, secure payment gateways, and real-time financial reporting.</p>
              </div>
              
              {/* Small Feature Card */}
              <div className="bg-slate-50 rounded-3xl p-10 shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-6 shadow-sm">
                  <FileCheck className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">Advanced Exam System</h3>
                <p className="text-slate-600 font-medium leading-relaxed">Secure scheduling, gradebook automation, and detailed analytical report cards.</p>
              </div>
              
              {/* Medium Feature Card */}
              <div className="md:col-span-2 bg-slate-900 rounded-3xl p-10 shadow-xl border border-slate-800 hover:shadow-2xl transition-all duration-300 text-white relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:bg-blue-500/20 transition-colors"></div>
                <div className="w-14 h-14 rounded-2xl bg-white/10 text-white flex items-center justify-center mb-6 backdrop-blur-md">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Interactive Parent Portal</h3>
                <p className="text-slate-300 font-medium max-w-xl leading-relaxed">Keep stakeholders engaged with real-time updates on attendance, grades, assignments, and direct communication channels with educators.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Inquiry Form Section */}
        <section id="inquiry" className="py-24 px-6 md:px-12 relative">
          <div className="absolute inset-0 bg-blue-50/50 z-0 pointer-events-none"></div>
          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-14 shadow-xl border border-slate-200">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Request a Custom Proposal</h2>
                <p className="text-lg text-slate-600 font-medium max-w-2xl mx-auto">Tell us about your institution's specific needs, and our technical architects will prepare a comprehensive development roadmap.</p>
              </div>
              
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                    <CheckCircle2 className="h-12 w-12" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Request Received!</h3>
                  <p className="text-slate-600 text-lg mb-8 font-medium">Our engineering team will contact you within 24 hours to discuss your school's requirements.</p>
                  <button onClick={() => setSubmitted(false)} className="px-8 py-3.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors shadow-sm">Submit another inquiry</button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="font-bold text-sm text-slate-700">School / Institution Name</label>
                      <input required {...register("schoolName")} type="text" className="edtech-input" placeholder="e.g. Oakridge International" />
                    </div>
                    <div className="space-y-2">
                      <label className="font-bold text-sm text-slate-700">City / Location</label>
                      <input {...register("city")} type="text" className="edtech-input" placeholder="e.g. London" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="font-bold text-sm text-slate-700">Email Address</label>
                      <input required {...register("email")} type="email" className="edtech-input" placeholder="Contact email" />
                    </div>
                    <div className="space-y-2">
                      <label className="font-bold text-sm text-slate-700">Phone Number</label>
                      <input required {...register("phone")} type="text" className="edtech-input" placeholder="Contact phone" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="font-bold text-sm text-slate-700">Total Number of Students</label>
                      <select {...register("numberOfStudents")} className="edtech-input">
                        <option>Less than 500</option>
                        <option>500 - 1,000</option>
                        <option>1,000 - 5,000</option>
                        <option>5,000+</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="font-bold text-sm text-slate-700">Estimated Budget Timeline</label>
                      <select {...register("budgetRange")} className="edtech-input">
                        <option>Immediate (1-3 months)</option>
                        <option>Planning phase (3-6 months)</option>
                        <option>Evaluating (6+ months)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="font-bold text-sm text-slate-700">Required Core Features</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                      {['Admissions', 'Academics', 'Finance/HR', 'Portals'].map(feature => (
                        <label key={feature} className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative flex items-center justify-center">
                            <input type="checkbox" value={feature} {...register("requiredFeatures")} className="peer w-5 h-5 border-2 border-slate-300 rounded appearance-none checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer shadow-sm" />
                            <CheckCircle2 className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" strokeWidth={3} />
                          </div>
                          <span className="font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">{feature}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="font-bold text-sm text-slate-700">Additional Details / Specific Requirements</label>
                    <textarea required {...register("message")} rows={5} className="edtech-input min-h-[120px] py-4 resize-none" placeholder="Briefly describe any legacy systems you need to migrate from, or specific custom workflows..."></textarea>
                  </div>

                  <button disabled={loading} type="submit" className="w-full bg-blue-600 text-white font-bold text-lg px-8 py-5 rounded-xl hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/20 transition-all duration-300 mt-6 disabled:opacity-50 flex justify-center items-center gap-2">
                    {loading ? 'Submitting...' : 'Submit Inquiry'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 px-6 md:px-12 relative">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Frequently Asked Questions</h2>
              <p className="text-xl text-slate-600 font-medium">Common queries regarding our custom development process.</p>
            </div>
            <div className="space-y-6">
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-3">How long does custom development take?</h3>
                <p className="text-slate-600 font-medium leading-relaxed">Timeline varies based on module requirements. A core system (Student, Staff, Basic Finance) typically takes 3-4 months, while full enterprise deployments with custom portals and legacy data migration may take 6-8 months.</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-3">Can you integrate with our existing accounting software?</h3>
                <p className="text-slate-600 font-medium leading-relaxed">Yes. We build custom APIs to ensure seamless two-way data sync with standard accounting platforms like QuickBooks, Xero, or existing enterprise ERPs.</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-3">Where is the data hosted and is it secure?</h3>
                <p className="text-slate-600 font-medium leading-relaxed">We deploy on secure cloud infrastructure (AWS/Azure) within your preferred region to comply with local data residency laws. All systems feature role-based access control and bank-level encryption at rest and in transit.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
