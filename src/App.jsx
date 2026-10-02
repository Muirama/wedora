import { useEffect } from "react";

import { startSmoothScroll, stopSmoothScroll } from "./lib/gsap";

import Hero from "./components/Hero";
import Story from "./components/Story";
import Gallery from "./components/Gallery";
import Countdown from "./components/Countdown";
import EventDetails from "./components/EventDetails";
import Location from "./components/Location";
import RSVP from "./components/RSVP";
import Footer from "./components/Footer";

function App() {
  useEffect(() => {
    startSmoothScroll();

    return () => stopSmoothScroll();
  }, []);

  return (
    <main className="wedding-page">
      <Hero />
      <Story />
      <Gallery />
      <Countdown />
      <EventDetails />
      <Location />
      <RSVP />
      <Footer />
    </main>
  );
}

export default App;
