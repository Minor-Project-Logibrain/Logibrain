const productLinks = [
  "Features",
  "Solutions",
  "Pricing",
];

const companyLinks = [
  "About",
  "Customers",
  "Careers",
];

const legalLinks = [
  "Privacy Policy",
  "Terms of Service",
  "Cookie Policy",
  "Security",
];

const supportLinks = [
  "Help Center",
  "Sitemap",
  "Status",
];

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-5 gap-10">

        {/* Logo */}

        <div>

          <div className="flex items-center gap-2 mb-5">

            <span className="material-symbols-outlined text-3xl">
              local_shipping
            </span>

            <h2 className="text-2xl font-bold">
              TripFlow
            </h2>

          </div>

          <p className="text-gray-400 leading-7">
            © 2024 TripFlow Fleet Management.
            <br />
            All Rights Reserved.
          </p>

        </div>

        {/* Product */}

        <div>

          <h3 className="font-semibold mb-4">
            Product
          </h3>

          {productLinks.map((item) => (
            <p
              key={item}
              className="text-gray-400 mb-2 hover:text-white cursor-pointer"
            >
              {item}
            </p>
          ))}

        </div>

        {/* Company */}

        <div>

          <h3 className="font-semibold mb-4">
            Company
          </h3>

          {companyLinks.map((item) => (
            <p
              key={item}
              className="text-gray-400 mb-2 hover:text-white cursor-pointer"
            >
              {item}
            </p>
          ))}

        </div>

        {/* Legal */}

        <div>

          <h3 className="font-semibold mb-4">
            Legal
          </h3>

          {legalLinks.map((item) => (
            <p
              key={item}
              className="text-gray-400 mb-2 hover:text-white cursor-pointer"
            >
              {item}
            </p>
          ))}

        </div>

        {/* Support */}

        <div>

          <h3 className="font-semibold mb-4">
            Support
          </h3>

          {supportLinks.map((item) => (
            <p
              key={item}
              className="text-gray-400 mb-2 hover:text-white cursor-pointer"
            >
              {item}
            </p>
          ))}

        </div>

      </div>

    </footer>
  );
};

export default Footer;