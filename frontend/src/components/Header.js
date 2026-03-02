const Header = () => {
  return (
    <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-white text-indigo-900 w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold shadow-md">
            CET
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-wide">
              College of Engineering Trikkaripur
            </h1>
            <p className="text-slate-300 text-sm">
              Smart Clearance & Registration System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;