import { Link } from "react-router-dom";
import { GraduationCap, Mail, Phone, MapPin, Twitter, Linkedin, Facebook, Instagram } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0F172A] text-slate-300 font-sans mt-auto border-t border-slate-800">
      <div className="w-full pt-20 pb-12 px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 max-w-7xl mx-auto">
        
        {/* Brand Column */}
        <div className="col-span-1 md:col-span-4 flex flex-col gap-6">
          <Link to="/" className="text-2xl font-bold text-white flex items-center gap-2 tracking-tight">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" strokeWidth={2.5} />
            </div>
            ExamDesk
          </Link>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
            The premium EdTech infrastructure for modern schools. Generate date sheets, result cards, and manage student data with professional, automated tools.
          </p>
          <div className="flex items-center gap-4 mt-2">
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
              <Twitter className="h-4 w-4" />
            </a>
            <a href="https://www.linkedin.com/in/hassanarif-dev" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
              <Linkedin className="h-4 w-4" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>
        
        {/* Links Columns */}
        <div className="col-span-1 md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-semibold mb-2">Free Tools</h4>
            <Link to="/tools/date-sheet" className="text-sm text-slate-400 hover:text-white hover:translate-x-1 transition-all">Date Sheet Generator</Link>
            <Link to="/tools/result-card" className="text-sm text-slate-400 hover:text-white hover:translate-x-1 transition-all">Result Card Creator</Link>
            <Link to="/tools/fee-slip" className="text-sm text-slate-400 hover:text-white hover:translate-x-1 transition-all">Fee Slip Generator</Link>
            <Link to="/tools/paper" className="text-sm text-slate-400 hover:text-white hover:translate-x-1 transition-all">Exam Paper Maker</Link>
            <Link to="/tools/id-card" className="text-sm text-slate-400 hover:text-white hover:translate-x-1 transition-all">Student ID Cards</Link>
          </div>
          
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-semibold mb-2">Company</h4>
            <Link to="/custom-software" className="text-sm text-slate-400 hover:text-white hover:translate-x-1 transition-all">Custom Software</Link>
            <Link to="/blog" className="text-sm text-slate-400 hover:text-white hover:translate-x-1 transition-all">Blog & Resources</Link>
            <Link to="/contact" className="text-sm text-slate-400 hover:text-white hover:translate-x-1 transition-all">Contact Us</Link>
            <Link to="/about" className="text-sm text-slate-400 hover:text-white hover:translate-x-1 transition-all">About ExamDesk</Link>
          </div>
          
          <div className="flex flex-col gap-4 col-span-2 md:col-span-1">
            <h4 className="text-white font-semibold mb-2">Contact Info</h4>
            <div className="flex items-start gap-3 text-sm text-slate-400">
              <Mail className="h-5 w-5 text-blue-500 shrink-0" />
              <a href="mailto:hassanarif4625@gmail.com" className="hover:text-white transition-colors">hassanarif4625@gmail.com</a>
            </div>
            <div className="flex items-start gap-3 text-sm text-slate-400">
              <Phone className="h-5 w-5 text-blue-500 shrink-0" />
              <a href="tel:+923276284969" className="hover:text-white transition-colors">0327 6284969</a>
            </div>
            <div className="flex items-start gap-3 text-sm text-slate-400">
              <MapPin className="h-5 w-5 text-blue-500 shrink-0" />
              <span>Gujrat,<br/>Pakistan</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {currentYear} ExamDesk. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
