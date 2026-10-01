import "../styles/Gallery.css";

function Gallery() {
  return (
    <section className="gallery">
      <div className="gallery-container">
        <div className="section-header">
          <p className="section-label">NOS SOUVENIRS</p>

          <h2>
            Quelques moments
            <br />
            de notre histoire
          </h2>
        </div>

        <div className="gallery-grid">
          <div className="gallery-item">
            <div className="image-placeholder">Photo 1</div>
          </div>

          <div className="gallery-item">
            <div className="image-placeholder">Photo 2</div>
          </div>

          <div className="gallery-item">
            <div className="image-placeholder">Photo 3</div>
          </div>

          <div className="gallery-item">
            <div className="image-placeholder">Photo 4</div>
          </div>

          <div className="gallery-item">
            <div className="image-placeholder">Photo 5</div>
          </div>

          <div className="gallery-item">
            <div className="image-placeholder">Photo 6</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Gallery;
