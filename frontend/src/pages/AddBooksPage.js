import React from "react";
import Sidebar from "../components/Layout/Sidebar"
import AddBook from "../components/Books/AddBook"

const Home = () => {
  return (
    <div >
      <div>
        <Sidebar />
      </div>
      <div className="py-5" style={{ paddingLeft: '20%' }}>
        <AddBook />
      </div>
    </div>
  );
};

export default Home;