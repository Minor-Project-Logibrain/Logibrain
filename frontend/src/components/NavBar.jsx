const navLinks = [
  "Features",
  "Solutions",
  "Pricing",
  "Customers",
  "Resources",
  "About",
];
import logo from "../assets/logo.png";
const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}

        <div className="flex items-center gap-3">
  <img
    src={logo}
    alt="TripFlow Logo"
    className="h-10 w-auto object-contain"
  />
  <h2 className="text-2xl font-bold">TripFlow</h2>
</div>

        {/* Navigation */}

        <nav className="hidden md:flex gap-8">

          {navLinks.map((item) => (
            <a
              key={item}
              href="#"
              className={`transition ${
                item === "Features"
                  ? "text-blue-600 border-b-2 border-blue-600 pb-1 font-semibold"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              {item}
            </a>
          ))}

        </nav>

        {/* Buttons */}

        <div className="flex items-center gap-4">

          <button className="hidden md:block text-gray-600 hover:text-blue-600">
            Login
          </button>

          <button className="bg-black text-white px-5 py-2 rounded-lg hover:opacity-90 transition">
            Get Started
          </button>

        </div>

      </div>
    </header>
  );
};

export default Navbar;