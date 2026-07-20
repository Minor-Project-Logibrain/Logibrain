import Navbar from "../components/NavBar";
import Hero from "../components/Hero";
import Trust from "../components/Trust";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
      <Navbar />

      <main className="pt-[80px]">
        <Hero />
        <Trust />
      </main>

      <Footer />
    </>
  );
};

export default Home;