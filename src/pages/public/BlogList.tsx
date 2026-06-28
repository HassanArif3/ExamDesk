import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

const BLOG_POSTS = [
  {
    id: 'how-to-manage-school-exams-efficiently',
    title: 'How to Manage School Exams Efficiently in 2024',
    excerpt: 'Discover the best practices for setting up examination schedules, seating plans, and avoiding common administration bottlenecks.',
    author: 'Sarah Admin',
    date: 'Oct 12, 2023',
    category: 'Exam Management',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'importance-of-automated-result-cards',
    title: 'The Importance of Automated Result Cards',
    excerpt: 'Why manual result compilation is hurting your school\'s productivity, and how automated result cards can save teachers hundreds of hours.',
    author: 'David EdTech',
    date: 'Nov 05, 2023',
    category: 'Automation',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'designing-professional-certificates',
    title: 'Designing Professional School Certificates',
    excerpt: 'A guide to creating award certificates that students will actually want to frame. Typography, margins, and paper choice matter.',
    author: 'Emily Design',
    date: 'Dec 18, 2023',
    category: 'Design & Templates',
    image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&q=80&w=800'
  }
];

export default function BlogList() {
  return (
    <div className="flex flex-col w-full font-sans">
      
      {/* Hero Section */}
      <section className="bg-[#0b1c30] text-white pt-32 pb-20 px-6 lg:px-12 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-blue-500/10 blur-[100px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 font-bold tracking-widest uppercase text-sm mb-6">
            Resources & Guides
          </span>
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">ExamDesk Blog</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto font-medium">
            Insights, guides, and best practices for school administrators and educators.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {BLOG_POSTS.map((post, index) => (
            <motion.article 
              key={post.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              <div className="h-56 overflow-hidden relative">
                 <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur text-slate-900 text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-sm">
                   {post.category}
                 </div>
                 <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-xs font-bold text-slate-500 mb-4 uppercase tracking-wide">
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-blue-500" /> {post.date}</span>
                  <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-blue-500" /> {post.author}</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-3 line-clamp-2 leading-tight tracking-tight group-hover:text-blue-600 transition-colors">
                  <Link to={`/blog/${post.id}`} className="focus:outline-none">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-slate-600 mb-8 line-clamp-3 font-medium leading-relaxed flex-1">
                  {post.excerpt}
                </p>
                <Link to={`/blog/${post.id}`} className="text-blue-600 font-bold flex items-center gap-2 hover:text-blue-700 transition-colors mt-auto w-fit group/link">
                  Read Article <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

    </div>
  );
}
