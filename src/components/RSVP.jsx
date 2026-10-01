import { useState } from "react";
import "../styles/RSVP.css";

function RSVP() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    guests: "1",
    attending: "yes",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("RSVP :", formData);

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="rsvp">
        <div className="rsvp-success">
          <p className="section-label">MERCI</p>

          <h2>
            Votre réponse
            <br />a bien été enregistrée.
          </h2>

          <p>Nous avons hâte de partager cette journée avec vous.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="rsvp">
      <div className="rsvp-container">
        <div className="rsvp-header">
          <p className="section-label">RSVP</p>

          <h2>
            Serez-vous
            <br />
            des nôtres ?
          </h2>

          <p>Merci de confirmer votre présence avant le 1er juillet 2027.</p>
        </div>

        <form className="rsvp-form" onSubmit={handleSubmit}>
          <label>
            Votre nom
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Votre nom"
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="votre@email.com"
              required
            />
          </label>

          <label>
            Nombre de personnes
            <select
              name="guests"
              value={formData.guests}
              onChange={handleChange}
            >
              <option value="1">1 personne</option>
              <option value="2">2 personnes</option>
              <option value="3">3 personnes</option>
              <option value="4">4 personnes</option>
            </select>
          </label>

          <label>
            Votre réponse
            <select
              name="attending"
              value={formData.attending}
              onChange={handleChange}
            >
              <option value="yes">Oui, je serai présent(e)</option>

              <option value="no">Désolé(e), je ne pourrai pas venir</option>
            </select>
          </label>

          <label>
            Message
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Un petit message pour les mariés..."
              rows="5"
            />
          </label>

          <button type="submit">Confirmer ma présence</button>
        </form>
      </div>
    </section>
  );
}

export default RSVP;
