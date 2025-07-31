// Header.jsx
import { useState, useEffect } from "react";
import { FiMenu, FiX, FiSun, FiMoon } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/features/userSlice";
import NotificationBell from "../notifications/notificationBell";
import { fetchUserNotifications } from "../../services/notificationService";
import "./header.css";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // ✅ Mặc định là trắng
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const userId =
    user?.id ||
    user?.user?.id ||
    Number(localStorage.getItem("accountId")) ||
    null;

  const navItems = [
    { id: 1, label: "Home", href: "home" },
    { id: 2, label: "Social", href: "social" },
    { id: 3, label: "Rank", href: "rank" },
    { id: 4, label: "Coaches", href: "coaches" },
    { id: 5, label: "News", href: "news" },
    { id: 6, label: "Membership", href: "membership" },
    { id: 7, label: "Quit Plan", href: "quit-plan" },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleLogout = () => {
    dispatch(logout());
    setShowDropdown(false);
  };

  useEffect(() => {
    if (userId) {
      fetchUserNotifications(userId).then((data) => {
        setNotifications(data || []);
      });
    }
  }, [userId]);

  useEffect(() => {
    document.body.className = isDarkMode ? "dark" : "light";
  }, [isDarkMode]);

  return (
    <>
      <header
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
              <img
                src="/images/logo.jpg"
                alt="Logo"
                className="h-8 w-auto"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/32";
                }}
              />
              <span className="text-sm font-bold tracking-wide">
                NoSmoking
              </span>
            </Link>

            <nav className="hidden md:flex space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.href}
                  className="text-sm font-medium hover:text-blue-400 transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              {/* ✅ Chỉ hiện chuông nếu đã login */}
              {user && (
                <NotificationBell
                  notifications={notifications}
                  isDarkMode={isDarkMode}
                />
              )}

              {/* 🌙 Chuyển theme */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
              </button>

              {user ? (
                <div className="relative">
                  <button onClick={toggleDropdown} className="flex items-center">
                    <img
                      src={
                        localStorage.getItem("custom_avatar") ||
                        user?.avatar ||
                        "/images/avatar.jpg"
                      }
                      alt={user?.fullName}
                      className="h-8 w-8 rounded-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/32";
                      }}
                    />
                  </button>
                  {showDropdown && (
                    <div
                      className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ${
                        isDarkMode ? "bg-gray-800" : "bg-white"
                      } ring-1 ring-black ring-opacity-5 z-50`}
                    >
                      {user?.role === "ADMIN" && (
                        <Link
                          to="/dashboard/overview"
                          onClick={() => setShowDropdown(false)}
                          className={`block px-4 py-2 text-sm ${
                            isDarkMode
                              ? "text-gray-200 hover:bg-gray-700"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          Dashboard
                        </Link>
                      )}

                      <Link
                        to="/user-profile"
                        onClick={() => setShowDropdown(false)}
                        className={`block px-4 py-2 text-sm ${
                          isDarkMode
                            ? "text-gray-200 hover:bg-gray-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        Profile
                      </Link>

                      <button
                        onClick={handleLogout}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          isDarkMode
                            ? "text-gray-200 hover:bg-gray-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-4">
                  <button
                    onClick={() => navigate("login")}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate("register")}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Register
                  </button>
                </div>
              )}

              <button
                onClick={toggleMenu}
                className="md:hidden p-2 rounded-md focus:outline-none"
              >
                {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile nav */}
          <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {!user && (
                <div className="space-y-2">
                  <button
                    onClick={() => navigate("login")}
                    className={`w-full px-3 py-2 text-base font-medium ${
                      isDarkMode
                        ? "text-white hover:text-blue-300"
                        : "text-gray-700 hover:text-gray-900"
                    }`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate("register")}
                    className="w-full px-3 py-2 text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Marquee chạy ngang */}
      <div className="marquee-container dark">
        <div className="marquee-text text-white">
          NOSMOKE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; NOSMOKE
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; NOSMOKE
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; NOSMOKE
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; NOSMOKE
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; NOSMOKE
        </div>
      </div>
    </>
  );
};

export default Header;
