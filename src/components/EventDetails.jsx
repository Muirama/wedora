import "../styles/EventDetails.css";

function EventDetails() {
  return (
    <section className="event-details">
      <div className="event-container">
        <div className="section-header">
          <p className="section-label">LE PROGRAMME</p>

          <h2>
            Un jour à<br />
            partager ensemble
          </h2>
        </div>

        <div className="events">
          <article className="event-card">
            <span className="event-number">01</span>

            <div>
              <p className="event-time">10:00</p>

              <h3>Cérémonie</h3>

              <p>
                Nous vous donnons rendez-vous pour célébrer notre union entourés
                de nos familles et de nos proches.
              </p>
            </div>
          </article>

          <article className="event-card">
            <span className="event-number">02</span>

            <div>
              <p className="event-time">13:00</p>

              <h3>Réception</h3>

              <p>
                Après la cérémonie, retrouvons-nous autour d'un déjeuner pour
                partager ce moment ensemble.
              </p>
            </div>
          </article>

          <article className="event-card">
            <span className="event-number">03</span>

            <div>
              <p className="event-time">19:00</p>

              <h3>Soirée</h3>

              <p>
                La journée se poursuivra avec un dîner, de la musique et une
                soirée pleine de souvenirs.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export default EventDetails;
