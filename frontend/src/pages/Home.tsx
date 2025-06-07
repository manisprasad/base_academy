
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
// import Courses from './pages/Courses';
import VideoSection from '../components/VideoSection';
// import Testimonials from './components/Testimonials';
// import ContactModal from './components/ContactModal';
// import Footer from './components/Footer';




function Home() {
  return (
    <div className="overflow-x-hidden p-3"   style={{
        // background: 'linear-gradient(120deg, #f0f9ff 0%, #e0f2fe 40%, #f5d0fe 100%)',
      }}>
        <Navbar/> 
        <Hero/>
        <VideoSection/>
      
 
      {/* <ContactModal /> */}
      {/* <Footer /> */}

    </div>
  );
}

export default Home;