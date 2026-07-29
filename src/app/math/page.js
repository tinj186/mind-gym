import GymQuestionPreviewClient from '@/components/math/GymQuestionPreviewClient';
// Import your normal student workout/gym view component as well
import StudentGymView from '@/components/math/StudentGymView'; 

export const dynamic = 'force-dynamic';

export default async function GymPage({ searchParams }) {
  const params = await searchParams;
  const previewId = params.previewId;
  const levelOverride = params.level;

  // 👑 ARCHITECTURAL FORK: If an admin requested a specific question preview
  if (previewId) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <div className="bg-amber-500 text-slate-950 font-black text-center py-2 uppercase text-xs tracking-widest shadow-md">
          ⚠️ STAGE INSPECTOR ACTIVE: Testing Layout for ID [{previewId}]
        </div>
        <GymQuestionPreviewClient initialPreviewId={previewId} />
      </div>
    );
  }

  // 🏋️ STUDENT MODE: Default view when a child is practicing normal syllabus objectives
  return <StudentGymView levelOverride={levelOverride} />;
}