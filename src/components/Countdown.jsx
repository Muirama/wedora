import { useEffect, useState } from "react";
import "../styles/Countdown.css";

function Countdown() {
  const weddingDate = new Date("2027-08-15T14:00:00");

  const calculateTimeLeft = () => {
    const difference = weddingDate - new Date();

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),

      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),

      minutes: Math.floor((difference / (1000 * 60)) % 60),

      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="countdown">
      <div className="countdown-container">
        <p className="section-label">LE GRAND JOUR</p>

        <h2>Plus que...</h2>

        <div className="countdown-grid">
          <div className="countdown-item">
            <strong>{timeLeft.days}</strong>
            <span>JOURS</span>
          </div>

          <div className="countdown-item">
            <strong>{timeLeft.hours}</strong>
            <span>HEURES</span>
          </div>

          <div className="countdown-item">
            <strong>{timeLeft.minutes}</strong>
            <span>MINUTES</span>
          </div>

          <div className="countdown-item">
            <strong>{timeLeft.seconds}</strong>
            <span>SECONDES</span>
          </div>
        </div>

        <p className="countdown-date">15 AOÛT 2027</p>
      </div>
    </section>
  );
}

export default Countdown;
