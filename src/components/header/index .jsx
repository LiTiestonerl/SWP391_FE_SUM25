import { useState, useEffect } from "react";
import { FiMenu, FiX, FiSun, FiMoon } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/features/userSlice";
import "./Header.css"; 

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

  const navItems = [
    { id: 1, label: "Home", href: "home" },
    { id: 2, label: "Rank", href: "rank" },
    { id: 3, label: "Contact", href: "contact" }, 
    { id: 4, label: "News", href: "news" },
    { id: 5, label: "Membership", href: "membership" },
   
  ];

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleLogout = () => {
    dispatch(logout());
    setShowDropdown(false);
  };

  useEffect(() => {
    document.body.className = isDarkMode ? "dark" : "light";
  }, [isDarkMode]);

  return (
    <>
      <header
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0 flex items-center space-x-2">
              <img
                src="/images/logo.jpg"
                alt="Logo"
                className="h-8 w-auto"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/32";
                }}
              />
              <span className="text-sm font-bold tracking-wide ">
                NoSmoking
              </span>
            </div>

            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.href}
                  className="text-sm font-medium hover:text-blue-500 transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label={isDarkMode ? "lightMode" : "darkMode"}
              >
                {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
              </button>

              {user ? (
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    <img
                      src={
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsVNNgXA9Qlq5GaQtWcqv0eyrFFLBJXWXpnw&s"
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
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                      <a
                        href="#profile"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {"profile"}
                      </a>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {"logout"}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-4">
                  <button
                    onClick={() => navigate("login")}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    {"login"}
                  </button>
                  <button
                    onClick={() => navigate("register")}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {"register"}
                  </button>
                </div>
              )}

              <button
                onClick={toggleMenu}
                className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  {item.label}
                </a>
              ))}
              {!user && (
                <div className="space-y-2">
                  <button
                    onClick={() => navigate("login")}
                    className="w-full px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white"
                  >
                    {"login"}
                  </button>
                  <button
                    onClick={() => navigate("register")}
                    className="w-full px-3 py-2 text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    {"register"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Dòng chạy chữ noSmoke */}
      <div className="marquee-container">
        <div className="marquee-text">
         NOSMOKE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; NOSMOKE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; NOSMOKE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; NOSMOKE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; NOSMOKE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; NOSMOKE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; NOSMOKE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; NOSMOKE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; NOSMOKE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; NOSMOKE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; NOSMOKE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; NOSMOKE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; NOSMOKE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; NOSMOKE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; NOSMOKE
        </div>
      </div>
    </>
  );
};

export default Header;
