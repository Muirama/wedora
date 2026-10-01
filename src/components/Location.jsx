import "../styles/Location.css";

function Location() {
  return (
    <section className="location">
      <div className="location-container">
        <div className="location-content">
          <p className="section-label">LE LIEU</p>

          <h2>
            Nous nous
            <br />
            retrouverons ici.
          </h2>

          <div className="location-info">
            <h3>Le Jardin des Roses</h3>

            <p>
              25 Avenue de l'Indépendance
              <br />
              Antananarivo, Madagascar
            </p>

            <p>
              Samedi 15 août 2027
              <br />À partir de 10h00
            </p>
          </div>

          <a
            href="https://www.google.com/maps"
            target="_blank"
            rel="noreferrer"
            className="map-button"
          >
            Ouvrir dans Google Maps
          </a>
        </div>

        <div className="map-placeholder">
          <span>CARTE</span>
        </div>
      </div>
    </section>
  );
}

export default Location;
