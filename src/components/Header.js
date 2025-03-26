import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import { useHistory } from 'react-router-dom';
import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const history = useHistory();
  const [username, setUsername] = useState("");
  
  useEffect(() => {
    // Get username from localStorage
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      setUsername(""); // Clear username if not found in localStorage
    }
  }, [localStorage.getItem("username")]); // Re-run effect when username in localStorage changes

  const logout = () => {
    // Clear all localStorage data
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("balance");
    localStorage.clear(); // Clear any other data
    
    setUsername(""); // Clear username state
    history.push("/");
    window.location.reload(); // Force a page reload to clear all states
  };

  if (hasHiddenAuthButtons) {
    return (
      <Box className="header">
        <Box className="header-title">
          <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={() => history.push("/")}
        >
          Back to explore
        </Button>
      </Box>
    );
  }

  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
      {children}
      {username ? (
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar alt={username} src="avatar.png" />
          <p>{username}</p>
          <Button variant="text" onClick={logout}>
            LOGOUT
          </Button>
        </Stack>
      ) : (
        <Stack direction="row" spacing={2}>
          <Button
            variant="text"
            onClick={() => history.push("/login")}
          >
            LOGIN
          </Button>
          <Button
            variant="contained"
            onClick={() => history.push("/register")}
          >
            REGISTER
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default Header;
