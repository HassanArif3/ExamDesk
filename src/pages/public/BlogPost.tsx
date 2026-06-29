import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import TableOfContents from '../../components/blog/TableOfContents';

const BLOG_POSTS: Record<string, any> = {
  'how-to-manage-school-exams-efficiently': {
    title: 'How to Manage School Exams Efficiently in 2024',
    author: 'Sarah Admin',
    date: 'Oct 12, 2023',
    category: 'Exam Management',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=1200',
    content: `
      <h2 class="text-3xl font-bold text-slate-900 mt-10 mb-4 tracking-tight">The Challenge of Exam Season</h2>
      <p class="text-lg text-slate-600 leading-relaxed mb-6">Exam season is universally recognized as the most stressful time of the academic year, not just for students, but for administrators and educators. The sheer volume of logistics involved—from seating plans to invigilation schedules—can overwhelm even the most organized teams.</p>
      
      <h2 class="text-3xl font-bold text-slate-900 mt-10 mb-4 tracking-tight">Step 1: Digitize the Date Sheet</h2>
      <p class="text-lg text-slate-600 leading-relaxed mb-6">Gone are the days of manual whiteboard scheduling. Utilizing a digital Date Sheet Generator ensures that there are no overlapping subjects or resource conflicts. A good system will automatically check for duplicate dates and ensure fair spacing between difficult subjects.</p>
      
      <h2 class="text-3xl font-bold text-slate-900 mt-10 mb-4 tracking-tight">Step 2: Automated Seating Plans</h2>
      <p class="text-lg text-slate-600 leading-relaxed mb-6">Assigning seats manually is an unnecessary administrative burden. By leveraging a Seating Plan generator, you can define room capacities, rows, and columns, and let the algorithm distribute students optimally, keeping them spaced out to minimize cheating.</p>
      
      <h2 class="text-3xl font-bold text-slate-900 mt-10 mb-4 tracking-tight">Step 3: Instant Roll Number Slips</h2>
      <p class="text-lg text-slate-600 leading-relaxed mb-6">Students often misplace admit cards. Having a system where administrators can instantly print or reprint professional admit cards on demand saves time and reduces panic on exam day.</p>
      
      <blockquote class="border-l-4 border-blue-600 pl-6 py-2 my-10 bg-slate-50 rounded-r-xl italic text-xl text-slate-700 font-medium">"Automation in exam management isn't about replacing the human element; it's about freeing up humans to focus on the students, not the paperwork."</blockquote>
      
      <h2 class="text-3xl font-bold text-slate-900 mt-10 mb-4 tracking-tight">Conclusion</h2>
      <p class="text-lg text-slate-600 leading-relaxed mb-6">By adopting the right tools, schools can transform exam season from a logistical nightmare into a smooth, well-oiled machine. Consider exploring our suite of tools designed exactly for these challenges.</p>
    `
  },
  'importance-of-automated-result-cards': {
    title: 'The Importance of Automated Result Cards',
    author: 'David EdTech',
    date: 'Nov 05, 2023',
    category: 'Automation',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200',
    content: `
      <h2 class="text-3xl font-bold text-slate-900 mt-10 mb-4 tracking-tight">The Problem with Manual Grading</h2>
      <p class="text-lg text-slate-600 leading-relaxed mb-6">Teachers spend countless hours at the end of every term calculating totals, percentages, and grades manually. This process is not only time-consuming but also highly prone to human error.</p>
      
      <h2 class="text-3xl font-bold text-slate-900 mt-10 mb-4 tracking-tight">Accuracy Guaranteed</h2>
      <p class="text-lg text-slate-600 leading-relaxed mb-6">Automated result cards calculate totals and percentages instantly. This ensures that every student's result is mathematically precise, eliminating the awkward conversations caused by manual calculation errors.</p>
      
      <h2 class="text-3xl font-bold text-slate-900 mt-10 mb-4 tracking-tight">Professional Presentation</h2>
      <p class="text-lg text-slate-600 leading-relaxed mb-6">A result card is often the primary piece of communication between the school and parents. A professionally formatted, standardized result card builds trust and reinforces the school's reputation for excellence.</p>
    `
  },
  'designing-professional-certificates': {
    title: 'Designing Professional School Certificates',
    author: 'Emily Design',
    date: 'Dec 18, 2023',
    category: 'Design & Templates',
    image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&q=80&w=1200',
    content: `
      <h2 class="text-3xl font-bold text-slate-900 mt-10 mb-4 tracking-tight">More Than Just Paper</h2>
      <p class="text-lg text-slate-600 leading-relaxed mb-6">A certificate is a tangible representation of achievement. Whether it's for academic excellence, sports, or participation, the design of the certificate speaks volumes about the value the institution places on the achievement.</p>
      
      <h2 class="text-3xl font-bold text-slate-900 mt-10 mb-4 tracking-tight">Key Elements of a Great Certificate</h2>
      <ul class="list-disc pl-6 space-y-3 text-lg text-slate-600 mb-6">
        <li><strong>Typography:</strong> Use formal serif fonts (like Times New Roman or Playfair Display) for the title and student name, paired with clean sans-serif fonts for the secondary text.</li>
        <li><strong>Borders:</strong> A classic, ornate border instantly elevates a standard piece of paper into a formal document.</li>
        <li><strong>Signatures:</strong> Ensure there is adequate space and proper lines for authorized signatures, such as the Principal or Head of Department.</li>
      </ul>
      
      <h2 class="text-3xl font-bold text-slate-900 mt-10 mb-4 tracking-tight">Using Generators</h2>
      <p class="text-lg text-slate-600 leading-relaxed mb-6">Instead of wrestling with word processors, using a dedicated Certificate Generator allows you to drop in content and immediately receive a print-ready, perfectly formatted PDF.</p>
    `
  }
};

export default function BlogPost() {
  const { id } = useParams();
  const post = id ? BLOG_POSTS[id] : null;

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-sans">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Article not found</h1>
        <Link to="/blog" className="text-blue-600 hover:underline font-medium">Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full font-sans">
      <main className="flex-1 py-16 px-6 lg:px-12 max-w-6xl mx-auto w-full flex gap-8 items-start">
        <TableOfContents />
        
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 bg-white rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden"
        >
          <div className="h-80 sm:h-[28rem] relative group">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
            
            <Link to="/blog" className="absolute top-8 left-8 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-colors z-10 shadow-sm">
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <div className="absolute bottom-8 left-8 right-8 md:bottom-12 md:left-12 md:right-12">
              <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider mb-4 inline-block shadow-sm">
                {post.category}
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 leading-tight tracking-tight drop-shadow-md">
                {post.title}
              </h1>
              <div className="flex items-center gap-6 text-sm font-bold text-slate-200 uppercase tracking-wide">
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-400" /> {post.date}</span>
                <span className="flex items-center gap-2"><User className="w-4 h-4 text-blue-400" /> {post.author}</span>
              </div>
            </div>
          </div>
          
          <div className="p-8 sm:p-12 md:p-16 lg:px-24">
            <div 
              className="prose-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </motion.article>
      </main>
    </div>
  );
}
