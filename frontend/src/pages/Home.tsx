import Features from '../components/Features';
import Hero from '../components/Hero';
import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <div>
      <Navbar />
      <main className="">
        <Hero />
        <div className="">
          <Features />
        </div>
      </main>
    </div>
  );
};

export default Home;
