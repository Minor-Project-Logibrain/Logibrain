const companies = [
  {
    icon: "domain",
    name: "ConstructCo",
  },
  {
    icon: "landscape",
    name: "MineTech",
  },
  {
    icon: "flight_takeoff",
    name: "GlobalLogistics",
  },
  {
    icon: "local_shipping",
    name: "FastFreight",
  },
];

const Trust = () => {
  return (
    <section className="py-20 bg-white border-t border-b border-gray-200">

      <div className="max-w-7xl mx-auto px-6">

        <p className="text-center uppercase tracking-widest text-sm text-gray-500 mb-12">
          Trusted by Modern Transport Businesses
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">

          {companies.map((company) => (
            <div
              key={company.name}
              className="flex flex-col items-center gap-3 grayscale hover:grayscale-0 transition"
            >
              <span className="material-symbols-outlined text-5xl">
                {company.icon}
              </span>

              <h3 className="font-semibold text-lg">
                {company.name}
              </h3>
            </div>
          ))}

        </div>

      </div>

    </section>
  );
};

export default Trust;