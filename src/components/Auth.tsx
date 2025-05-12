import React from "react";
import "../css/Auth.css"; // optional, only if you want to separate styles

const Auth = () => {
  const handleAuthClick = () => {
    // Redirect to backend /login endpoint to initiate OAuth
    window.location.href = "http://localhost:8000/login"; // Backend will handle the redirect to the OAuth provider
  };

  return (
    <div className="auth-button" onClick={handleAuthClick}>
      SignUp
    </div>
  );
};

export default Auth;
