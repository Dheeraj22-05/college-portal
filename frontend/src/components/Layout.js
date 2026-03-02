import Header from "./Header";
import Navbar from "./Navbar";
import NotificationBar from "./NotificationBar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-slate-50 to-blue-50">

      {/* Top Header */}
      <Header />

      {/* Navigation */}
      <Navbar />

      {/* Notification */}
      <NotificationBar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-10 py-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-center py-5 text-sm">
        © 2026 College of Engineering Trikkaripur
      </footer>

    </div>
  );
};

export default Layout;