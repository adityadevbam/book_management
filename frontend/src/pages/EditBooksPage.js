import React from "react";
import Sidebar from "../components/Layout/Sidebar"
import EditBook from "../components/Books/EditBook"

const Home = () => {
  return (
    <div >
      <div>
        <Sidebar />
      </div>
      <div className="py-5 " style={{ paddingLeft: '100px', paddingRight:'10px' }}>
        <EditBook />
      </div>
    </div>
  );
};

export default Home;