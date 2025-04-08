import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "../../styles/QuoteSlider.css";

const QuoteSlider = () => {
  const quotes = [
    {
      text: "There is more treasure in books than in all the pirate's loot on Treasure Island.",
      author: "Walt Disney"
    },
    {
      text: "Books are a uniquely portable magic that can transport you anywhere instantly.",
      author: "Stephen King"
    },
    {
      text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
      author: "Dr. Seuss"
    },
    {
      text: "A reader lives a thousand lives before he dies. The man who never reads lives only one.",
      author: "George R.R. Martin"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitionDirection, setTransitionDirection] = useState("slide-in");
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance every 5 seconds
  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setTransitionDirection("slide-in");
        setCurrentIndex((prev) => (prev + 1) % quotes.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, quotes.length]);

  const goToNext = () => {
    setIsAutoPlaying(false);
    setTransitionDirection("slide-in");
    setCurrentIndex((prev) => (prev + 1) % quotes.length);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume auto-play after 10s
  };

  const goToPrev = () => {
    setIsAutoPlaying(false);
    setTransitionDirection("slide-out");
    setCurrentIndex((prev) => (prev - 1 + quotes.length) % quotes.length);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume auto-play after 10s
  };

  const goToIndex = (index) => {
    setIsAutoPlaying(false);
    setTransitionDirection(index > currentIndex ? "slide-in" : "slide-out");
    setCurrentIndex(index);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume auto-play after 10s
  };

  return (
    <div className="quote-slider-container">
      <div className="slider-controls">
        <button className="slider-arrow prev" onClick={goToPrev}>
          <FiChevronLeft />
        </button>
        
        <div className={`quote-slide ${transitionDirection}`}>
          <h3 className="quote-title">Today's Inspiration</h3>
          <p className="quote-text">"{quotes[currentIndex].text}"</p>
          <p className="quote-author">- {quotes[currentIndex].author}</p>
        </div>
        
        <button className="slider-arrow next" onClick={goToNext}>
          <FiChevronRight />
        </button>
      </div>

      <div className="slider-dots">
        {quotes.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => goToIndex(index)}
            aria-label={`Go to quote ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default QuoteSlider;