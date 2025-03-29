import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import axios from "axios";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { useNavigate } from "react-router-dom";

ModuleRegistry.registerModules([AllCommunityModule]);

const Kotisivu = ({ clientId, accessToken }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const RATE_LIMIT = 4; // 4 requests per second
  const RESET_TIME = 1000; // 1 second in milliseconds

  const [requestCount, setRequestCount] = useState(0);
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    const timer = setInterval(() => {
      setRequestCount(0);
    }, RESET_TIME);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (clientId && accessToken) {
      const fetchGames = async () => {
        if (requestCount >= RATE_LIMIT) {
          console.log("Pyyntöjen määrä ylittynyt, odotetaan...");
          await delay(1000);
        }

        try {
          const reviewsResponse = await axios.get(
            "http://localhost:8080/api/reviews"
          );
          const reviews = reviewsResponse.data;

          const reviewedGameIds = reviews.map((review) => review.igdbId);

          if (reviewedGameIds.length === 0) {
            setGames([]); // jos ei löydy arvosteluja näytä tyhjä lista
            setLoading(false);
            return;
          }

          // etsi ainoastaan pelejä jotka on arvioitu
          const query = `where id = (${reviewedGameIds.join(
            ","
          )}); fields id, name; limit 10;`;

          await delay(250);

          const gamesResponse = await axios.post(
            "https://cors-anywhere.herokuapp.com/https://api.igdb.com/v4/games",
            query,
            {
              headers: {
                "Client-ID": clientId,
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          );

          const gamesWithReviews = gamesResponse.data.map((game) => {
            const review = reviews.find((r) => r.igdbId === game.id);

            return {
              ...game,
              comment: review ? review.comment : "Ei löytynyt arvostelua",
              date: review ? review.date : "Ei löytynyt päivämäärää",
              rating: review ? review.rating : "Ei löytynyt arvosanaa",
              reviewId: review ? review.reviewid : "Ei löytynyt arvostelu IDtä",
              reviewerName: review ? review.reviewerName : "Anonyymi",
              igdbId: game.id,
            };
          });

          setGames(gamesWithReviews);
          setRequestCount((prevCount) => prevCount + 1);
        } catch (error) {
          console.error("Virhe hakea arvosteltuja pelejä:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchGames();
    }
  }, [clientId, accessToken]);

  useEffect(() => {
    console.log("Päivitetty pyyntöjen määrä:", requestCount);
  }, [requestCount]);

  if (loading) return <p>Ladataan...</p>;

  const columnData = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "name",
      headerName: "Nimi",
      flex: 2,
    },
    {
      field: "comment",
      headerName: "Kommentti",
      flex: 2,
      minWidth: 200,
      wrapText: true,
      autoHeight: true,
      cellStyle: {
        whiteSpace: "normal",
        wordWrap: "break-word",
        lineHeight: "1.2",
      },
    },
    { field: "date", headerName: "Päivämäärä", flex: 1 },
    { field: "rating", headerName: "Arvosana", flex: 0.8 },
    { field: "reviewerName", headerName: "Arvostelijan Nimi", flex: 1 },
    {
      field: "actions",
      headerName: "Toiminnot",
      flex: 1,
      cellRenderer: (params) => {
        return (
          <button onClick={() => navigate(`/Arvostelut/${params.data.igdbId}`)}>
            Näytä kaikki arvostelut
          </button>
        );
      },
    },
  ];

  const onGridReady = (params) => {
    params.api.sizeColumnsToFit();
  };

  return (
    <div
      style={{
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="ag-theme-alpine"
        style={{ width: "80%", minWidth: "600px" }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Kotisivu
        </Typography>
        <AgGridReact
          rowData={games}
          columnDefs={columnData}
          domLayout="autoHeight"
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};

export default Kotisivu;
