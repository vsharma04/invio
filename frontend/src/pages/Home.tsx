import Features from '../components/Features';
import Hero from '../components/Hero';
import Navbar from '../components/Navbar';
import Pricing from '../components/Pricing';

const Home = () => {
  return (
    <div>
      <Navbar />
      <main className="">
        <Hero />
        <div className="">
          <Features />
        </div>
        <Pricing />
      </main>
    </div>
  );
};

export default Home;
