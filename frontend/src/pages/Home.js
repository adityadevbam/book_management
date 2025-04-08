import React from "react";
import Sidebar from "../components/Layout/Sidebar"
import Header from "../components/Layout/Header"
import BookList from "../components/Books/BooksList"
import Footer from "../components/Layout/Footer"

const Home = () => {
  return (
    <div style={{background: '#F3F3F7' }} >
      <div>
        <Sidebar />
      </div>
      <div style={{ paddingLeft: '79px' }}>
        <Header />
        <BookList />
        <Footer />
      </div>
    </div>
  );
};

export default Home;
