import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/public/Home';
import ToolsIndex from './pages/tools/ToolsIndex';
// Import tool pages
import DateSheetGenerator from './pages/tools/DateSheetGenerator';
import ResultCardGenerator from './pages/tools/ResultCardGenerator';
import SeatingPlanGenerator from './pages/tools/SeatingPlanGenerator';
import RollNumberSlipGenerator from './pages/tools/RollNumberSlipGenerator';
import AttendanceSheetGenerator from './pages/tools/AttendanceSheetGenerator';
import FeeSlipGenerator from './pages/tools/FeeSlipGenerator';
import CertificateGenerator from './pages/tools/CertificateGenerator';
import CustomSoftware from './pages/public/CustomSoftware';
import Contact from './pages/public/Contact';
import BlogList from './pages/public/BlogList';
import BlogPost from './pages/public/BlogPost';

// Placeholders for others
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
    <h1 className="text-3xl font-bold text-slate-900 mb-4">{title}</h1>
    <p className="text-slate-600">This page is currently under construction.</p>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="tools" element={<ToolsIndex />} />
          
          {/* Detailed Implementations */}
          <Route path="tools/date-sheet" element={<DateSheetGenerator />} />
          <Route path="tools/result-card" element={<ResultCardGenerator />} />
          <Route path="tools/seating-plan" element={<SeatingPlanGenerator />} />
          <Route path="tools/roll-number" element={<RollNumberSlipGenerator />} />
          <Route path="tools/attendance" element={<AttendanceSheetGenerator />} />
          <Route path="tools/fee-slip" element={<FeeSlipGenerator />} />
          <Route path="tools/certificate" element={<CertificateGenerator />} />

          {/* Public Pages */}
          <Route path="custom-software" element={<CustomSoftware />} />
          <Route path="blog" element={<BlogList />} />
          <Route path="blog/:id" element={<BlogPost />} />
          <Route path="contact" element={<Contact />} />
          
          <Route path="*" element={<PlaceholderPage title="404 - Page Not Found" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
