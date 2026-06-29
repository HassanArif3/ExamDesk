import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TOOLS } from "../../data/toolsData";
import * as Icons from "lucide-react";

export function CanvasParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles: Array<{ x: number; y: number; vx: number; vy: number; r: number }> = [];
    const count = 25;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 2.5 + 1
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(37, 99, 235, 0.12)';

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

export function AnimatedCounter({ target, duration = 1500, suffix = "" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [target, duration]);

  return <span>{count}{suffix}</span>;
}

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 md:pt-24 pb-32">
        <CanvasParticles />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[400px] w-[600px] rounded-full bg-blue-500/20 opacity-40 blur-[120px]"></div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-bold mb-6 backdrop-blur-sm shadow-sm">
                <Icons.Sparkles className="h-4 w-4" />
                <span>The #1 toolkit for modern educators</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
                Free School Exam & <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Admin Tools
                </span>
              </h1>
              <p className="text-xl text-slate-600 mb-10 font-medium leading-relaxed max-w-lg">
                Generate professional date sheets, seating plans, roll number slips, result cards, and attendance sheets — ready to print in minutes. No Excel required.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/tools"
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-blue-500/20 hover:shadow-xl transition-all gap-2 hover:-translate-y-0.5"
                >
                  Explore All Tools
                  <Icons.ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/tools/date-sheet"
                  className="inline-flex items-center justify-center rounded-xl bg-white border border-slate-200 px-8 py-4 text-base font-bold text-slate-700 shadow-sm hover:bg-slate-50 hover:shadow-md transition-all"
                >
                  Create Date Sheet
                </Link>
              </div>
              
              <div className="mt-12 flex flex-wrap items-center gap-6 text-sm text-slate-600 font-bold">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-full bg-emerald-100"><Icons.Check className="h-4 w-4 text-emerald-600" /></div>
                  100% Free
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-full bg-emerald-100"><Icons.Check className="h-4 w-4 text-emerald-600" /></div>
                  Print Ready
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-full bg-emerald-100"><Icons.Check className="h-4 w-4 text-emerald-600" /></div>
                  PDF Export
                </div>
              </div>
            </motion.div>

            {/* Hero Visual Mockup */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block perspective-1000"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/30 to-indigo-400/20 rounded-3xl transform rotate-3 scale-105 -z-10 blur-xl"></div>
              <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden relative transform rotate-y-[-5deg] rotate-x-[5deg]">
                {/* Simulated App Header */}
                <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  </div>
                  <div className="text-xs font-bold text-slate-600 bg-white px-4 py-1.5 rounded-full border border-slate-200 shadow-sm flex items-center gap-2">
                    <Icons.LayoutTemplate className="h-3 w-3 text-blue-600" />
                    Date Sheet Generator
                  </div>
                  <div className="w-12"></div>
                </div>
                {/* Simulated Document Preview */}
                <div className="p-8 bg-slate-100/50">
                  <div className="bg-white shadow-md border border-slate-200 rounded-lg aspect-[1/1.4] p-8 flex flex-col relative mx-auto max-w-sm">
                     {/* Document Content Simulation */}
                    <div className="text-center border-b-2 border-slate-900 pb-4 mb-6">
                      <div className="flex justify-center mb-2"><Icons.GraduationCap className="h-8 w-8 text-blue-600" /></div>
                      <h3 className="text-lg font-black text-slate-900 uppercase tracking-wide">Cambridge High School</h3>
                      <p className="text-xs font-bold text-slate-500 mt-1 uppercase">Final Term Examination 2024</p>
                    </div>
                    <div className="space-y-4 flex-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex gap-4 items-center border-b border-slate-100 pb-3">
                           <div className="h-3 w-16 bg-slate-200 rounded-sm"></div>
                           <div className="h-3 w-24 bg-blue-100 rounded-sm"></div>
                           <div className="h-3 flex-1 bg-slate-100 rounded-sm"></div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-auto flex justify-between pt-6 border-t border-slate-200">
                      <div className="flex flex-col items-center">
                         <div className="h-px w-20 bg-slate-400 mb-2"></div>
                         <div className="h-2 w-16 bg-slate-200 rounded-sm"></div>
                      </div>
                      <div className="flex flex-col items-center">
                         <div className="h-px w-20 bg-slate-400 mb-2"></div>
                         <div className="h-2 w-16 bg-slate-200 rounded-sm"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Badges */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="absolute top-16 -left-8 bg-white px-5 py-3 rounded-2xl shadow-xl border border-slate-200 flex items-center gap-3 backdrop-blur-md"
                >
                  <div className="bg-red-50 p-2 rounded-xl text-red-500">
                    <Icons.FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">PDF Ready</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Export in 1-click</div>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                  className="absolute bottom-24 -right-8 bg-white px-5 py-3 rounded-2xl shadow-xl border border-slate-200 flex items-center gap-3 backdrop-blur-md"
                >
                  <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
                    <Icons.Printer className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Print Friendly</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">A4 Optimized Layout</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats/Trust Section */}
      <section className="py-10 bg-white/40 backdrop-blur-sm border-y border-slate-200/50 relative z-20 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center justify-center text-center space-y-2">
               <div className="p-3 bg-blue-100 rounded-2xl text-blue-600 mb-2"><Icons.School className="h-6 w-6" /></div>
               <div className="text-3xl font-black text-slate-900"><AnimatedCounter target={10} suffix="+" /></div>
               <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">School Tools</div>
            </div>
            <div className="flex flex-col items-center justify-center text-center space-y-2">
               <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-600 mb-2"><Icons.FileCheck className="h-6 w-6" /></div>
               <div className="text-3xl font-black text-slate-900"><AnimatedCounter target={100} suffix="%" /></div>
               <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Print Ready</div>
            </div>
            <div className="flex flex-col items-center justify-center text-center space-y-2">
               <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600 mb-2"><Icons.Download className="h-6 w-6" /></div>
               <div className="text-3xl font-black text-slate-900"><AnimatedCounter target={100} suffix="% Free" /></div>
               <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">PDF Export</div>
            </div>
            <div className="flex flex-col items-center justify-center text-center space-y-2">
               <div className="p-3 bg-amber-100 rounded-2xl text-amber-600 mb-2"><Icons.Smartphone className="h-6 w-6" /></div>
               <div className="text-3xl font-black text-slate-900"><AnimatedCounter target={100} suffix="% Mobile" /></div>
               <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Friendly UI</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid Section */}
      <section className="py-24 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Essential Admin Tools</h2>
            <p className="text-lg text-slate-600 font-medium leading-relaxed">Everything you need to manage your school's examination and administrative processes, all in one premium suite.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TOOLS.map((tool, index) => {
              const Icon = Icons[tool.icon as keyof typeof Icons] as React.ElementType;
              return (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link 
                    to={tool.path}
                    className="group flex flex-col h-full bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="absolute -top-6 -right-6 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-300 transform group-hover:scale-110">
                       <Icon className="h-40 w-40" />
                    </div>
                    
                    <div className="flex items-center justify-between mb-6 relative z-10">
                       <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-blue-50 text-blue-600 shadow-sm border border-blue-100">
                         <Icon className="h-7 w-7" />
                       </div>
                       <span className="text-[10px] font-bold uppercase tracking-wider py-1 px-3 bg-slate-100 rounded-full text-slate-600 border border-slate-200">Free Tool</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 mb-3 relative z-10 group-hover:text-blue-600 transition-colors">{tool.title}</h3>
                    <p className="text-sm text-slate-600 font-medium mb-8 flex-1 relative z-10 leading-relaxed">{tool.description}</p>
                    
                    <div className="mt-auto flex items-center justify-between text-blue-600 text-sm font-bold relative z-10 pt-4 border-t border-slate-100 group-hover:border-blue-100 transition-colors">
                      <span>Use Template</span>
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                         <Icons.ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 bg-white/40 backdrop-blur-md border-y border-slate-200/50 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-500/5 -skew-x-12 transform translate-x-1/4"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">How It Works</h2>
            <p className="text-lg text-slate-600 font-medium leading-relaxed">Generate professional documents in three simple steps. No design skills or complex software required.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 -translate-y-1/2 z-0"></div>
            
            {[
              { step: "01", title: "Select a Tool", desc: "Choose from our suite of specialized educational tools designed for schools.", icon: "MousePointerClick" },
              { step: "02", title: "Enter Details", desc: "Fill in the required information or simply paste data from your spreadsheet.", icon: "Keyboard" },
              { step: "03", title: "Download PDF", desc: "Instantly generate and download a print-ready, professional PDF document.", icon: "Download" }
            ].map((item, i) => {
              const Icon = Icons[item.icon as keyof typeof Icons] as React.ElementType;
              return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.2 }}
                  className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative z-10 flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold mb-6 shadow-md border-4 border-white shadow-blue-500/20">
                    <Icon className="w-8 h-8" />
                  </div>
                  <div className="text-blue-600 font-bold text-xs mb-2 uppercase tracking-widest">Step {item.step}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">{item.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Custom Software CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-500/5"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4"></div>
        
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 md:p-16 shadow-xl text-center overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-blue-100 shadow-sm transform -rotate-3">
                 <Icons.Code2 className="h-10 w-10 text-blue-600 transform rotate-3" />
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Need a Custom School Management System?</h2>
              <p className="text-lg text-slate-600 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
                We architect bespoke educational software encompassing admissions, academics, finance, HR, and parent portals tailored exactly to your institution's workflow.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/custom-software"
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-blue-500/20 hover:shadow-xl hover:-translate-y-0.5 hover:bg-blue-700 transition-all"
                >
                  Request Custom System
                </Link>
                <Link
                  to="/custom-software#features"
                  className="inline-flex items-center justify-center rounded-xl bg-white border border-slate-200 px-8 py-4 text-base font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-all"
                >
                  View Features
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
