import React from "react";
import { Link } from "react-router-dom";
import { TOOLS } from "../../data/toolsData";
import * as Icons from "lucide-react";
import { motion } from "motion/react";

export default function ToolsIndex() {
  return (
    <div className="py-16 font-sans relative z-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        
        <div className="text-center max-w-3xl mx-auto mb-20 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-32 bg-blue-400/20 blur-[100px] rounded-full pointer-events-none"></div>
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-bold tracking-widest uppercase text-sm mb-6 shadow-sm">
            School Management Suite
          </span>
          <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Free Administrative Tools</h1>
          <p className="text-xl text-slate-600 font-medium leading-relaxed">
            A comprehensive suite of premium educational utilities designed to save hours of manual formatting for schools, teachers, and exam controllers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {TOOLS.map((tool, index) => {
            const Icon = Icons[tool.icon as keyof typeof Icons] as React.ElementType;
            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
              >
                <Link 
                  to={tool.path}
                  className="group block h-full bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-50/0 group-hover:from-blue-50/50 group-hover:to-transparent transition-all duration-300"></div>
                  
                  <div className="relative z-10 flex items-start justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${tool.bgColor} ${tool.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-7 w-7" strokeWidth={2} />
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 uppercase tracking-wider border border-slate-200 group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">
                      {tool.category}
                    </span>
                  </div>
                  <h3 className="relative z-10 text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{tool.title}</h3>
                  <p className="relative z-10 text-slate-600 font-medium leading-relaxed">{tool.description}</p>
                  
                  <div className="relative z-10 mt-8 flex items-center text-blue-600 font-bold text-sm tracking-wide group-hover:gap-2 transition-all">
                    Open Tool <Icons.ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
