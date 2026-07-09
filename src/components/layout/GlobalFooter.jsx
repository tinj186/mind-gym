import Link from 'next/link';

export default function GlobalFooter() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-12 print:hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <Link href="/" className="font-black text-2xl tracking-tighter text-white">
              LEARN<span className="text-blue-500">REPS</span>
            </Link>
            <p className="text-slate-400 text-sm mt-2 font-medium">
              © {new Date().getFullYear()} The Learn Reps. All rights reserved.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-end gap-6 md:gap-8">
            <Link 
              href="/terms-of-service" 
              className="text-sm font-bold text-slate-400 hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
            <Link 
              href="/privacy-policy" 
              className="text-sm font-bold text-slate-400 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/refund-policy" 
              className="text-sm font-bold text-slate-400 hover:text-white transition-colors"
            >
              Refund Policy
            </Link>
            <a 
              href="mailto:hello@thelearnreps.com" 
              className="text-sm font-bold text-slate-400 hover:text-white transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
