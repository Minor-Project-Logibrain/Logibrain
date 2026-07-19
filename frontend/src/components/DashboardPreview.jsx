const DashboardPreview = () => {
  return (
    <div className="relative mt-20 max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-gray-200">

      {/* Glass Layer */}

      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm z-10"></div>

      <img
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXpKyNuQ2hXXYhBX8nrQJAEFxVQxLKMEzM6ajCJ_Cg5IAe3Q4b8_1jMiHWSL6cvMDJEAmggmsgiFsCWeSG3A8_TJV96_x-tO2Tqhdp6jkoKQ7b0XDP6_qd0dXRsnqo3ZNuZ208ECY-mPtM9Ajns-ZUEM4II9G1cNlkp_UIOBdCj9XAxeTdbgiQlrM-JYHTOnK5On5OIOo5bKyotuNp78Sb-0pfGgkPRUd_ao_lOCpdhNaAP5_jcr8W"
        alt="Dashboard"
        className="relative z-20 w-full object-cover"
      />

    </div>
  );
};

export default DashboardPreview;