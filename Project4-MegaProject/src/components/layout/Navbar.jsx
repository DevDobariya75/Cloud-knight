import { Languages, LogOut, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState, useMemo } from 'react';
import { getEmailFromToken } from '../../utils/tokenUtils';
import { useLoginModal } from '../../context/LoginModalContext';

function Navbar() {
  const { text, language, changeLanguage, languages } = useAppContext();
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const { isLoginModalOpen, openLoginModal, closeLoginModal } = useLoginModal();

  const userEmail = useMemo(() => {
    if (user?.email) return user.email;
    const token = localStorage.getItem("token");
    if (token) return getEmailFromToken(token);
    return null;
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowProfile(false);
  };

  const navClassName = ({ isActive }) =>
    `px-6 py-3 text-base font-bold transition text-slate-700 hover:text-blue-700 ${
      isActive ? 'text-blue-700 border-b-4 border-blue-700' : ''
    }`;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-blue-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-full items-center justify-center gap-6 px-4 py-3 sm:px-6">
          {/* Logo - Left */}
          <div className="absolute left-4 sm:left-6 text-3xl font-bold text-blue-700">
            {text.appName}
          </div>

          {/* Center Navigation */}
          <nav className="flex items-center gap-6">
            <NavLink to="/" className={navClassName}>
              {text.navHome}
            </NavLink>

            {isAuthenticated && (
              <>
                <NavLink to="/assessment" className={navClassName}>
                  {text.navAssessment}
                </NavLink>
                <NavLink to="/history" className={navClassName}>
                  {text.navHistory || 'History'}
                </NavLink>
                <NavLink to="/phc-finder" className={navClassName}>
                  {text.navPhcFinder}
                </NavLink>
              </>
            )}
          </nav>

          {/* Right Side Controls */}
          <div className="absolute right-4 sm:right-6 flex items-center gap-3">
            {/* Language Selector */}
            <div className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-2 py-1.5 text-sm font-semibold text-slate-700">
              <Languages className="h-4 w-4" />
              <select
                id="language-select"
                value={language}
                onChange={(event) => changeLanguage(event.target.value)}
                className="border-0 bg-transparent font-semibold text-slate-700 focus:outline-none cursor-pointer"
              >
                {languages.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Profile Dropdown for Authenticated Users */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="rounded-full bg-blue-100 p-2 text-blue-700 hover:bg-blue-200 transition"
                  title="Profile"
                >
                  <User className="h-5 w-5" />
                </button>

                {showProfile && (
                  <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white ring-1 ring-slate-200 shadow-lg z-50">
                    <div className="border-b border-slate-200 px-4 py-3">
                      <p className="text-xs text-slate-500 font-semibold">Email</p>
                      <p className="text-sm text-slate-900 break-all font-semibold mt-1">{userEmail || "Loading..."}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Login Button for Unauthenticated Users */}
            {!isAuthenticated && (
              <button
                onClick={openLoginModal}
                className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 transition whitespace-nowrap"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;