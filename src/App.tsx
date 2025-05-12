import React, { useEffect, useState } from "react";
import "./App.css";
import ResumeForm from "./components/ResumeForm";
import Auth from "./components/Auth";
import { BrowserRouter as Router } from "react-router-dom";

const App: React.FC = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    photo: "",
  });

  useEffect(() => {
    // Check the URL query parameters and set user data
    const params = new URLSearchParams(window.location.search);
    const name = params.get("name");
    const email = params.get("email");
    const photo = params.get("photo");
    if (photo) {
      setUserData({
        name: name || "",
        email: email || "",
        photo,
      });
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <div className="header">
          Resume Analyzer
          <div className="auth-container">
            {userData.photo ? (
              <div
                className="profile-photo-container"
                onClick={() =>
                  (window.location.href = "http://localhost:8000/login")
                }
              >
                <img
                  src={userData.photo}
                  alt="User Profile"
                  className="profile-photo"
                  title={userData.name}
                />
              </div>
            ) : (
              <Auth />
            )}
          </div>
        </div>
        <ResumeForm />
      </div>
    </Router>
  );
};

export default App;
