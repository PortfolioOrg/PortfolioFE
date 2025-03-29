import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Kotisivu from "./pages/Kotisivu";
import axios from "axios";
import Navbar from "./pages/Navbar";
import Etsipelit from "./pages/Etsipelit";
import Arvostelut from "./pages/Arvostelut";
//import React from "react";
//import ReviewsList from "./ReviewsList";
//import logo from "./logo.svg";
//import "./App.css";

//function App() {
//return (
//<div className="App">
//<ReviewsList />
//</div>
//);
//}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [clientId, setClientId] = useState("");
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    const storedClientId = sessionStorage.getItem("clientId");
    const storedAccessToken = sessionStorage.getItem("accessToken");
    const storedIsLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";

    if (storedClientId && storedAccessToken && storedIsLoggedIn) {
      setClientId(storedClientId);
      setAccessToken(storedAccessToken);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async ({ clientId, clientSecret }) => {
    //console.log("Client ID:", clientId);
    //console.log("Client Secret:", clientSecret);

    try {
      const response = await axios.post(
        "https://id.twitch.tv/oauth2/token",
        new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: "client_credentials",
        }),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      const data = response.data;
      //console.log("Access token:", data.access_token);

      setClientId(clientId);
      setAccessToken(data.access_token);

      setIsLoggedIn(true);

      sessionStorage.setItem("clientId", clientId);
      sessionStorage.setItem("accessToken", data.access_token);
      sessionStorage.setItem("isLoggedIn", "true");
    } catch (err) {
      alert(
        //err.response?.data?.message ||
        "Todennus epäonnistui. Tarkista kirjautumistietosi."
      );
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            !isLoggedIn ? (
              <Login onLogin={handleLogin} />
            ) : (
              <Navigate to="/kotisivu" />
            )
          }
        />

        {isLoggedIn && (
          <>
            <Route
              path="/kotisivu"
              element={
                <>
                  <Navbar />
                  <Kotisivu clientId={clientId} accessToken={accessToken} />
                </>
              }
            />
            <Route
              path="/Etsipelit"
              element={
                <>
                  <Navbar />
                  <Etsipelit clientId={clientId} accessToken={accessToken} />
                </>
              }
            />
            <Route
              path="/Arvostelut/:igdbId"
              element={
                <>
                  <Navbar />
                  <Arvostelut />
                </>
              }
            />
          </>
        )}

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
