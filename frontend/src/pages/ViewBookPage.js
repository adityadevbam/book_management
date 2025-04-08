import React from "react";
import Sidebar from "../components/Layout/Sidebar"
import BookDetails from "../components/Books/BookDetails"

const Home = () => {
  return (
    <div >
      <div>
        <Sidebar />
      </div>
      <div className="pt-5 " style={{ paddingLeft: '100px', paddingRight:'10px' }}>
        <BookDetails />
      </div>
    </div>
  );
};

export default Home;