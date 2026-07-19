import DashboardPreview from "./DashboardPreview";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-blue-100 pt-20 pb-32">

      <div className="max-w-7xl mx-auto px-6 text-center">

        <h1 className="text-5xl md:text-6xl font-bold leading-tight max-w-5xl mx-auto">
          Manage Every Truck,
          <br />
          Trip and Rupee
          <br />
          from One Platform.
        </h1>

        <p className="text-lg text-gray-600 mt-8 max-w-3xl mx-auto leading-8">
          Intelligent fleet operations designed for high-performance logistics.
          Gain absolute clarity, speed, and precision over your entire
          operation.
        </p>

        {/* Buttons */}

        <div className="flex flex-col sm:flex-row justify-center gap-5 mt-12">

          <button className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition">

            Start Free Trial

            <span className="material-symbols-outlined">
              arrow_forward
            </span>

          </button>

          <button className="border border-gray-300 bg-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-100 transition">

            <span className="material-symbols-outlined">
              play_circle
            </span>

            Watch Demo

          </button>

        </div>

        {/* Dashboard */}

        <DashboardPreview />

      </div>

    </section>
  );
};

export default Hero;