import React from "react";
import frontImage from "../assets/business-card-front.png";
import backImage from "../assets/business-card-back.png";
import "./BusinessCard.css";

const BusinessCard = () => {
  return (
    <div className="business-card-container" style={styles.container}>
      <div className="business-card" style={styles.card}>
        <div className="card-face front" style={styles.cardFace}>
          <img src={frontImage} alt="Front" style={styles.image} />
        </div>
        <div className="card-face back" style={styles.cardFace}>
          <img src={backImage} alt="Back" style={styles.image} />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "320px",
    height: "200px",
    margin: "60px auto",
    perspective: "1200px",
    pointerEvents: "none", // Prevents all mouse interactions
    userSelect: "none", // Prevents text selection
    WebkitUserSelect: "none", // For Safari
    MozUserSelect: "none", // For Firefox
    msUserSelect: "none", // For IE/Edge
  },
  card: {
    width: "100%",
    height: "100%",
    position: "relative",
    transformStyle: "preserve-3d",
    animation: "rotate3D 10s infinite linear",
    pointerEvents: "none", // Prevents all mouse interactions
  },
  cardFace: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
    pointerEvents: "none", // Prevents all mouse interactions
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    pointerEvents: "none", // Prevents all mouse interactions
    userSelect: "none", // Prevents image selection
    WebkitUserSelect: "none",
    MozUserSelect: "none",
    msUserSelect: "none",
  },
};

export default BusinessCard;
