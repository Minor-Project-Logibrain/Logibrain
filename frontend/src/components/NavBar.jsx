const navLinks = [
  "Features",
  "Solutions",
  "Pricing",
  "Customers",
  "Resources",
  "About",
];
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}

        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="LogiBrain Logo"
            className="h-10 w-auto object-contain"
          />
          <h2 className="text-2xl font-bold text-slate-900">LogiBrain</h2>
        </Link>

        {/* Navigation */}

        <nav className="hidden md:flex gap-8">

          {navLinks.map((item) => (
            <a
              key={item}
              href="#"
              className={`transition font-medium ${item === "Features"
                ? "text-blue-600 font-semibold"
                : "text-slate-600 hover:text-blue-600"
                }`}
            >
              {item}
            </a>
          ))}

        </nav>

        {/* Buttons */}

        <div className="flex items-center gap-4">


          <Link to='/ask-role' className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition shadow-sm">
            Get Started
          </Link>

        </div>

      </div>
    </header>
  );
};

export default Navbar;