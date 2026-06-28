import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, GraduationCap, LayoutGrid } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "../../lib/utils";
import { TOOLS } from "../../data/toolsData";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsToolsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Custom Software", path: "/custom-software" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav 
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 font-sans",
        scrolled 
          ? "bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm py-3" 
          : "bg-white/50 backdrop-blur-sm border-b border-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link to="/" className="text-2xl font-bold text-slate-900 flex items-center gap-2 tracking-tight group">
            <div className="bg-blue-600 p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors">
              <GraduationCap className="h-6 w-6 text-white" strokeWidth={2.5} />
            </div>
            ExamDesk
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex gap-1 items-center">
            <Link
              to="/"
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                location.pathname === "/"
                  ? "text-blue-600 bg-blue-50"
                  : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
              )}
            >
              Home
            </Link>

            {/* Tools Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsToolsOpen(!isToolsOpen)}
                className={cn(
                  "flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all gap-1",
                  location.pathname.startsWith("/tools")
                    ? "text-blue-600 bg-blue-50"
                    : "text-slate-600 hover:text-blue-600 hover:bg-slate-50",
                  isToolsOpen && "text-blue-600 bg-blue-50"
                )}
              >
                Tools
                <ChevronDown className={cn("h-4 w-4 transition-transform", isToolsOpen && "rotate-180")} />
              </button>

              {isToolsOpen && (
                <div className="absolute left-0 mt-2 w-72 origin-top-left rounded-2xl bg-white p-3 shadow-xl border border-slate-100 focus:outline-none z-50 animate-in fade-in slide-in-from-top-2">
                  <Link
                    to="/tools"
                    onClick={() => setIsToolsOpen(false)}
                    className="flex items-center rounded-xl px-4 py-3 text-sm font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors mb-2"
                  >
                    <LayoutGrid className="mr-2 h-4 w-4" />
                    View All Tools
                  </Link>
                  <div className="grid grid-cols-1 gap-1">
                    {TOOLS.slice(0, 6).map((tool) => (
                      <Link
                        key={tool.id}
                        to={tool.path}
                        onClick={() => setIsToolsOpen(false)}
                        className="block rounded-xl px-4 py-2.5 text-sm text-slate-600 font-medium hover:bg-slate-50 hover:text-blue-600 transition-colors"
                      >
                        {tool.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {navLinks.slice(1).map((link) => {
              const isActive = location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "text-blue-600 bg-blue-50"
                      : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="hidden md:flex items-center">
          <Link
            to="/tools"
            className="bg-blue-600 text-white font-medium text-sm px-6 py-2.5 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 transition-all duration-300"
          >
            Use Free Tools
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors focus:outline-none"
          >
            <span className="sr-only">Open main menu</span>
            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white absolute top-full left-0 w-full shadow-lg">
          <div className="space-y-1 px-6 pb-6 pt-4">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className={cn(
                "block rounded-xl px-4 py-3 text-base font-medium transition-colors",
                location.pathname === "/" ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              Home
            </Link>
            
            <Link
              to="/tools"
              onClick={() => setIsOpen(false)}
              className={cn(
                "block rounded-xl px-4 py-3 text-base font-medium transition-colors",
                location.pathname.startsWith("/tools") ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              All Tools
            </Link>

            {navLinks.slice(1).map((link) => {
               const isActive = location.pathname.startsWith(link.path);
               return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block rounded-xl px-4 py-3 text-base font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  {link.name}
                </Link>
               )
            })}
            <Link
              to="/tools"
              onClick={() => setIsOpen(false)}
              className="mt-6 block w-full rounded-xl bg-blue-600 px-4 py-3.5 text-center text-base font-bold text-white shadow-md hover:bg-blue-700 transition-colors"
            >
              Explore Free Tools
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
