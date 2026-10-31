import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-secondary text-white px-5 md:px-8 pt-10 pb-6 border-t border-white/10">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col sm:flex-row justify-between gap-8 pb-8">
          <div>
            <Link to="/" className="text-lg font-bold">eZy Account <span className="text-white/60 font-normal">with JB</span></Link>
            <p className="text-sm text-white/60 mt-3 leading-relaxed">Accounting, explained. Learn with Jayaruwan Bandara.</p>
            <p className="text-xs text-white/50 mt-2">Kandy, Sri Lanka</p>
          </div>
          <nav aria-label="Footer navigation" className="flex flex-wrap items-start gap-x-6 gap-y-4 text-sm text-white/75">
            <Link to="/#courses" className="hover:text-white">Courses</Link>
            <Link to="/#about" className="hover:text-white">About Jayaruwan</Link>
            <Link to="/my-courses" className="hover:text-white">My Courses</Link>
          </nav>
        </div>
        <div className="border-t border-white/10 pt-5 flex flex-wrap justify-between gap-3 text-[11px] text-white/50">
          <p>&copy; {new Date().getFullYear()} eZy Account with JB. All rights reserved.</p>
          <p>A clearer understanding. A stronger foundation.</p>
        </div>
      </div>
    </footer>
  );
}
