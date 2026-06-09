import { prisma } from '@/lib/db';
import { SYLLABUS_DATA } from '@/lib/syllabus';
import DivisionBadge from '@/components/math/DivisionBadge';
import MathDashboardClient from '@/components/math/MathDashboardClient';

export default async function MathWingDashboard() {
  // Placeholder for session-based student selection
  const studentId = "default-student"; 
  
  const profile = await prisma.studentProfile.findUnique({
    where: { id: studentId },
    include: { mastery: true }
  });

  // If no profile exists, the DivisionBadge's automated check will trigger the modal
  const currentLevel = profile?.primaryLevel || "";
  const syllabus = SYLLABUS_DATA[currentLevel] || [];
  const masteryData = profile?.mastery || [];

  return (
    <div className="min-h-screen bg-white">
      {/* Gym Header */}
      <header className="p-6 flex justify-between items-center border-b border-slate-50 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] block">Mathematics Wing</span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter">Neuro-Trainer Dashboard</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <DivisionBadge studentId={studentId} currentLevel={currentLevel} />
        </div>
      </header>

      {/* Main Dashboard Interaction Layer */}
      <MathDashboardClient 
        studentId={studentId}
        syllabus={syllabus} 
        masteryData={masteryData} 
      />
    </div>
  );
}
