import React from "react";
import Sidebar from "../components/Layout/Sidebar"
import Collection from "../components/Books/Collection"

const Home = () => {
  return (
    <div >
      <div>
        <Sidebar />
      </div>
      <div style={{ paddingLeft: '79px' }}>
        <Collection />
      </div>
    </div>
  );
};

export default Home;
