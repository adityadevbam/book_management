import React from "react";
import Sidebar from "../components/Layout/Sidebar"
import EditProfile from "../components/Profile/EditProfile"

const Home = () => {
  return (
    <div >
      <div>
        <Sidebar />
      </div>
      <div className="pt-5" style={{ paddingLeft: '79px' }}>
        <EditProfile />
      </div>
    </div>
  );
};

export default Home;