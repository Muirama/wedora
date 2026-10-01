import "./App.css";
import Story from "./components/Story";
import Gallery from "./components/Gallery";
import Countdown from "./components/Countdown";
import EventDetails from "./components/EventDetails";
import Location from "./components/Location";
import RSVP from "./components/RSVP";


function App() {
  return (
    <main className="wedding-page">
      <section className="hero">
        <div className="light light-1"></div>
        <div className="light light-2"></div>

        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
        <div className="particle particle-5"></div>

        <div className="hero-content">
          <p className="eyebrow animate-top">NOTRE HISTOIRE COMMENCE</p>

          <h1 className="names">
            <span className="name name-andria">Andria</span>

            <span className="ampersand">&</span>

            <span className="name name-soa">Soa</span>
          </h1>

          <p className="date animate-date">15 AOÛT 2027</p>

          <button className="discover-button animate-button">
            Découvrir notre histoire
          </button>
        </div>
      </section>

      <Story />
      <Gallery />
      <Countdown />
      <EventDetails />
      <Location />
      <RSVP />
    </main>
  );
}

export default App;
