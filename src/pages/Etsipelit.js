import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Typography,
  Grid,
} from "@mui/material";

const SearchGames = ({ clientId, accessToken }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);

  const [reviewerName, setReviewerName] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState("");
  const RATE_LIMIT = 4;
  const RESET_TIME = 1000;

  const [requestCount, setRequestCount] = useState(0);
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const backend_url = "http://localhost:8080/api/reviews";

  useEffect(() => {
    const timer = setInterval(() => {
      setRequestCount(0);
    }, RESET_TIME);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (searchTerm.length < 3) return;

    const fetchGames = async () => {
      if (requestCount >= RATE_LIMIT) {
        alert("Pyyntöjen määrä ylittynyt, odotetaan...");
        await delay(1000);
      }

      setLoading(true);
      setError(null);
      try {
        await delay(250);

        const response = await axios.post(
          "https://cors-anywhere.herokuapp.com/https://api.igdb.com/v4/games",
          `search "${searchTerm}"; fields id, name, summary; limit 10;`,
          {
            headers: {
              "Client-ID": clientId,
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        setGames(response.data);
        setRequestCount((prevCount) => prevCount + 1);
      } catch (error) {
        setError("Virhe pelien hakemisessa");
        console.error("Virhe pelien hakemisessa:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [searchTerm, clientId, accessToken]);

  const handleReviewSubmit = async () => {
    if (!selectedGame) return alert("Valitse peli ensin!");

    const newReview = {
      igdbId: selectedGame.id,
      reviewerName: reviewerName,
      comment: reviewComment,
      rating: reviewRating,
    };

    try {
      await axios.post(`${backend_url}/add`, newReview);
      alert("Arvostelu lähetetty onnistuneesti!");
      setReviewerName("");
      setReviewComment("");
      setReviewRating("");
    } catch (error) {
      console.error("Virhe arvostelun lähettämisessä:", error);
      alert("Arvostelun lähetys epäonnistui, yritä uudestaan.");
    }
  };

  return (
    <Container maxWidth="md">
      <TextField
        fullWidth
        label="Etsi peli"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        margin="normal"
      />

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={2} mt={2}>
        {games.map((game) => (
          <Grid item xs={12} sm={6} md={4} key={game.id}>
            <Card
              onClick={() => setSelectedGame(game)}
              style={{
                cursor: "pointer",
                border:
                  selectedGame?.id === game.id ? "2px solid blue" : "none",
              }}
            >
              <CardContent>
                <Typography variant="h6">{game.name}</Typography>
                <Typography variant="body2">{game.summary}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {selectedGame && (
        <>
          <Typography variant="h5" mt={3}>
            Arvostellaan: {selectedGame.name}
          </Typography>

          <TextField
            fullWidth
            label="Arvostelijan Nimi"
            variant="outlined"
            value={reviewerName}
            onChange={(e) => setReviewerName(e.target.value)}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Arvostelun Kommentti"
            variant="outlined"
            multiline
            rows={4}
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Arvosana (0-5)"
            type="number"
            variant="outlined"
            value={reviewRating}
            onChange={(e) => setReviewRating(e.target.value)}
            margin="normal"
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleReviewSubmit}
            sx={{ mt: 2 }}
          >
            Lähetä Arvostelu
          </Button>
        </>
      )}
    </Container>
  );
};

export default SearchGames;
