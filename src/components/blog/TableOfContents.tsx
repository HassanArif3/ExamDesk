import React, { useState, useEffect } from 'react';

interface HeaderItem {
  id: string;
  text: string;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<HeaderItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Query all h2 headings in the article
    const headingElements = Array.from(document.querySelectorAll('article h2'));
    
    const items: HeaderItem[] = headingElements.map((el, index) => {
      const id = el.id || `heading-${index}`;
      el.id = id; // ensure the element has the ID set for target scrolling
      return {
        id,
        text: el.textContent || ''
      };
    });

    setHeadings(items);

    // Track active heading on scroll
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry) {
          setActiveId(visibleEntry.target.id);
        }
      },
      { rootMargin: '-10% 0px -70% 0px', threshold: 0.1 }
    );

    headingElements.forEach((el) => observer.observe(el));

    return () => {
      headingElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  if (headings.length === 0) return null;

  return (
    <div 
      className="hidden lg:block sticky top-28 self-start w-64 bg-slate-50 border border-slate-200 rounded-2xl p-6 mr-8"
      style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}
    >
      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Table of Contents</h4>
      <ul className="space-y-3">
        {headings.map((h) => {
          const isActive = activeId === h.id;
          return (
            <li key={h.id}>
              <a 
                href={`#${h.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`block text-sm font-semibold transition-all duration-200 border-l-2 pl-3 ${
                  isActive 
                    ? 'text-blue-600 border-blue-600 font-bold translate-x-1' 
                    : 'text-slate-500 border-transparent hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
