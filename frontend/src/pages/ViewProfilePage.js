import React from "react";
import Sidebar from "../components/Layout/Sidebar"
import ViewProfile from "../components/Profile/ViewProfile"

const Home = () => {
  return (
    <div >
      <div>
        <Sidebar />
      </div>
      <div className="pt-5" style={{ paddingLeft: '79px' }}>
        <ViewProfile />
      </div>
    </div>
  );
};

export default Home;