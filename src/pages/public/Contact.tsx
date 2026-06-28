import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { CheckCircle2, MapPin, Mail, Phone, ArrowRight } from 'lucide-react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setSubmitted(true);
        reset();
      } else {
        alert("Server error. Please try again.");
      }
    } catch (e) {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-grow pt-24 md:pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto w-full">
      {/* Contact Hero */}
      <section className="text-center mb-16 md:mb-24 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-32 bg-blue-400/20 blur-[100px] rounded-full pointer-events-none"></div>
        <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-bold tracking-widest uppercase text-sm mb-6 shadow-sm relative z-10">
          Support & Sales
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight relative z-10">Get in Touch</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium relative z-10">Our specialized team is ready to assist you with any inquiries regarding our professional assessment infrastructure.</p>
      </section>

      {/* 2-Column Contact Layout */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-24">
        {/* Left: Contact Form */}
        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 border-b border-slate-100 pb-4">Send a Message</h2>
          {submitted ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Message Sent!</h3>
              <p className="text-slate-600 font-medium">Thank you for reaching out. We will get back to you shortly.</p>
              <button onClick={() => setSubmitted(false)} className="mt-8 text-blue-600 font-bold hover:underline">Send another message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-bold text-slate-600 mb-2">First Name</label>
                  <input id="firstName" {...register("firstName", { required: "Required" })} type="text" className="edtech-input bg-slate-50 border-slate-200" placeholder="Jane" />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-bold text-slate-600 mb-2">Last Name</label>
                  <input id="lastName" {...register("lastName", { required: "Required" })} type="text" className="edtech-input bg-slate-50 border-slate-200" placeholder="Doe" />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-slate-600 mb-2">Work Email</label>
                <input id="email" {...register("email", { required: "Required" })} type="email" className="edtech-input bg-slate-50 border-slate-200" placeholder="jane.doe@institution.edu" />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-bold text-slate-600 mb-2">Subject</label>
                <select id="subject" {...register("subject")} className="edtech-input bg-slate-50 border-slate-200">
                  <option>General Inquiry</option>
                  <option>Technical Support</option>
                  <option>Sales & Enterprise</option>
                  <option>Partnerships</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-bold text-slate-600 mb-2">Message</label>
                <textarea id="message" {...register("message", { required: "Required" })} rows={4} className="edtech-input bg-slate-50 border-slate-200 min-h-[120px] py-3 resize-none" placeholder="How can we help you?"></textarea>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold h-12 rounded-xl shadow-sm hover:shadow-lg hover:shadow-blue-600/20 hover:-translate-y-0.5 transition-all disabled:opacity-50 mt-4">
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          )}
        </div>

        {/* Right: Office Details */}
        <div className="space-y-8">
          <div className="bg-slate-900 text-white rounded-3xl p-10 shadow-lg relative overflow-hidden flex flex-col justify-center h-full">
            <div className="absolute inset-0 z-0 opacity-40">
              <div className="bg-cover bg-center w-full h-full" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200')" }}></div>
              <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>
            </div>
            
            <div className="relative z-10 border border-white/10 bg-white/5 p-8 rounded-2xl backdrop-blur-md">
              <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider rounded-full mb-6 border border-blue-500/30">Headquarters</span>
              <h3 className="text-3xl font-black mb-8">Global Office</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
                    <MapPin className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-bold text-lg mb-1">Gujrat</p>
                    <p className="text-slate-400 font-medium leading-relaxed">Pakistan</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
                    <Mail className="h-5 w-5 text-blue-400" />
                  </div>
                  <a href="mailto:hassanarif4625@gmail.com" className="font-medium text-lg hover:text-blue-300 transition-colors">hassanarif4625@gmail.com</a>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
                    <Phone className="h-5 w-5 text-blue-400" />
                  </div>
                  <a href="tel:+923276284969" className="font-medium text-lg hover:text-blue-300 transition-colors">0327 6284969</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mb-32">
        <div className="text-center mb-12">
           <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Frequently Asked Questions</h2>
           <p className="text-slate-600 font-medium">Quick answers to common inquiries.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-blue-200 transition-colors">
            <h4 className="text-lg font-bold text-slate-900 mb-2">What are your support hours?</h4>
            <p className="text-slate-600 font-medium leading-relaxed">Our dedicated enterprise support team is available 24/7. Standard tier support operates Monday through Friday, 9 AM to 6 PM EST.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-blue-200 transition-colors">
            <h4 className="text-lg font-bold text-slate-900 mb-2">Do you offer custom integrations?</h4>
            <p className="text-slate-600 font-medium leading-relaxed">Yes, our engineering team routinely builds custom bridges to legacy SIS and LMS platforms for our enterprise partners.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-blue-200 transition-colors">
            <h4 className="text-lg font-bold text-slate-900 mb-2">How do I schedule a demo?</h4>
            <p className="text-slate-600 font-medium leading-relaxed">Please select "Sales & Enterprise" in the contact form above, and an account executive will reach out within one business day.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-blue-200 transition-colors">
            <h4 className="text-lg font-bold text-slate-900 mb-2">Where can I find API documentation?</h4>
            <p className="text-slate-600 font-medium leading-relaxed">Comprehensive technical documentation is available to all registered users via their administrative dashboard.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden shadow-xl shadow-blue-900/10">
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Require Tailored Solutions?</h2>
          <p className="text-xl mb-10 text-blue-100 font-medium leading-relaxed">Discover how ExamDesk can architect custom assessment software specifically designed for your institution's unique pedagogical frameworks.</p>
          <Link to="/custom-software" className="inline-flex items-center justify-center bg-white text-blue-600 font-bold px-8 py-4 rounded-xl shadow-sm hover:shadow-xl hover:scale-105 transition-all group">
            Explore Custom Software
            <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
      </section>
    </main>
  );
}
