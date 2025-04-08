import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiChevronDown, FiBell, FiMessageSquare } from "react-icons/fi";
import "../../styles/Header.css";
import book1 from "../../assets/book1.svg";
import book2 from "../../assets/book2.svg";
import book3 from "../../assets/book3.svg";
import book4 from "../../assets/book4.svg";
import book5 from "../../assets/book5.svg";

const books = [book1, book2, book3, book4, book5];

const Header = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const getInitials = (name) =>
    name ? name.split(" ").map((n) => n[0]).join("").toUpperCase() : "U";

  const getColorFromName = (name) => {
    const colors = ["#667eea", "#764ba2", "#36CFC9", "#7B68EE", "#FF85C0"];
    if (!name) return colors[0];
    const charCodeSum = name.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[charCodeSum % colors.length];
  };

  const quotes = [
    {
      text: "There is more treasure in books than in all the pirate's loot on Treasure Island.",
      author: "Walt Disney",
    },
    {
      text: "Books are a uniquely portable magic that can transport you anywhere instantly.",
      author: "Stephen King",
    },
    {
      text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
      author: "Dr. Seuss",
    },
    {
      text: "A reader lives a thousand lives before he dies. The man who never reads lives only one.",
      author: "George R.R. Martin",
    },
  ];

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [transition, setTransition] = useState("slide-in");

  useEffect(() => {
    const interval = setInterval(() => {
      setTransition("slide-out");
      setTimeout(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
        setTransition("slide-in");
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, [quotes.length]);

  return (
    <div className="header-container-hyfn">
      {/* Top Navigation */}
      <div className="top-nav-hyfn">
        <div className="search-container-hyfn">
          <div className="search-bar-hyfn">
            <FiSearch className="search-icon-hyfn" />
            <input type="text" placeholder="Search books, authors..." />
            <div className="search-dropdown-hyfn">
              <span>All</span>
              <FiChevronDown className="dropdown-icon-hyfn" />
            </div>
          </div>
        </div>

        <div className="user-actions-hyfn">
          <button className="action-btn-hyfn">
            <FiBell className="icon-hyfn" />
            <span className="notification-badge-hyfn">3</span>
          </button>
          <button className="action-btn-hyfn">
            <FiMessageSquare className="icon-hyfn" />
          </button>

          <div className="user-profile-hyfn" onClick={() => navigate("/account")}>
            {user?.avatar? (
              <img
              src={`${process.env.REACT_APP_BACKEND_URL}/${user.avatar}`}
              alt="Profile"
              className="profile-image-hyfn"
            />
            
            ) : (
              <div
                className="profile-initials-hyfn"
                style={{ backgroundColor: getColorFromName(user?.name) }}
              >
                {getInitials(user?.name)}
              </div>
            )}
            <span className="user-name-hyfn">{user?.name || "Guest"}</span>
            <FiChevronDown className="dropdown-icon-hyfn" />
          </div>
        </div>
      </div>

      {/* Header Content */}
      <div className="header-content-hyfn">
        <div className="quote-slider-hyfn">
          <div className={`quote-slide-hyfn ${transition}`}>
            <h3 className="quote-title-hyfn">Today's Inspiration</h3>
            <p className="quote-text-hyfn">"{quotes[currentQuoteIndex].text}"</p>
            <p className="quote-author-hyfn">- {quotes[currentQuoteIndex].author}</p>
          </div>
          <div className="quote-pagination-hyfn">
            {quotes.map((_, index) => (
              <div
                key={index}
                className={`dot-hyfn ${index === currentQuoteIndex ? "active-hyfn" : ""}`}
                onClick={() => {
                  setTransition(index > currentQuoteIndex ? "slide-in" : "slide-out");
                  setTimeout(() => {
                    setCurrentQuoteIndex(index);
                    setTransition("slide-in");
                  }, 500);
                }}
              />
            ))}
          </div>
        </div>

        <div className="new-arrivals-card-hyfn">
          <div className="section-label-hyfn">New Arrivals</div>
          <div className="books-scroller-hyfn">
            {books.map((book, index) => (
              <div key={index} className="book-card-hyfn">
                <img src={book} alt={`Book ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
