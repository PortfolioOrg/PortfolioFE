import React, { useState } from "react";
import { TextField, Button, Typography, Box, Container } from "@mui/material";

const Login = ({ onLogin }) => {
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onLogin({ clientId, clientSecret });
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f4f6f8",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          padding: 3,
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h6"
          component="h2"
          gutterBottom
          sx={{ textAlign: "center" }}
        >
          Account Creation
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          paragraph
          sx={{ textAlign: "left" }}
        >
          In order to use API, you must have a Twitch Account.
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          paragraph
          sx={{ textAlign: "left" }}
        >
          <strong>Steps to get started:</strong>
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          paragraph
          sx={{ textAlign: "left" }}
        >
          1.{" "}
          <a
            href="https://www.twitch.tv/signup"
            target="_blank"
            rel="noopener noreferrer"
          >
            Sign Up with Twitch
          </a>{" "}
          for a free account.
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          paragraph
          sx={{ textAlign: "left" }}
        >
          2. Ensure you have{" "}
          <a
            href="https://www.twitch.tv/settings/security"
            target="_blank"
            rel="noopener noreferrer"
          >
            <strong>Two Factor Authentication</strong>
          </a>{" "}
          enabled.
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          paragraph
          sx={{ textAlign: "left" }}
        >
          3. Register your application in the{" "}
          <a
            href="https://dev.twitch.tv/console/apps"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitch Developer Portal
          </a>
          .
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          paragraph
          sx={{ textAlign: "left" }}
        >
          4. The OAuth Redirect URL field is not used by IGDB. Please add{" "}
          <code>localhost</code> to continue.
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          paragraph
          sx={{ textAlign: "left" }}
        >
          5.{" "}
          <a
            href="https://dev.twitch.tv/console/apps"
            target="_blank"
            rel="noopener noreferrer"
          >
            Manage
          </a>{" "}
          your newly created application and generate a{" "}
          <strong>Client Secret</strong> by pressing [New Secret].
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          paragraph
          sx={{ textAlign: "left" }}
        >
          6. Take note of the <strong>Client ID</strong> and{" "}
          <strong>Client Secret</strong>.
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          paragraph
          sx={{ textAlign: "left" }}
        >
          The IGDB.com API is free for non-commercial usage under the terms of
          the{" "}
          <a
            href="https://www.twitch.tv/p/en/legal/developer-agreement/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitch Developer Service Agreement
          </a>
          .
        </Typography>

        <Typography variant="h4" component="h1" gutterBottom>
          IGDB Login
        </Typography>

        <TextField
          label="Client ID"
          variant="outlined"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          sx={{ marginBottom: 2 }}
          fullWidth
        />

        <TextField
          label="Client Secret"
          type="password"
          variant="outlined"
          value={clientSecret}
          onChange={(e) => setClientSecret(e.target.value)}
          sx={{ marginBottom: 2 }}
          fullWidth
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ padding: "10px 20px", fontSize: "16px" }}
          fullWidth
        >
          Login
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
