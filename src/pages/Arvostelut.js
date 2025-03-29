import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Typography } from "@mui/material";
import { AgGridReact } from "ag-grid-react";

const Arvostelut = () => {
  const { igdbId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gameName, setGameName] = useState("");

  const RATE_LIMIT = 4;
  const RESET_TIME = 1000;

  const [requestCount, setRequestCount] = useState(0);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    const timer = setInterval(() => {
      setRequestCount(0);
    }, RESET_TIME);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      if (requestCount >= RATE_LIMIT) {
        alert("Pyyntöjen määrä ylittynyt, odotetaan...");
        await delay(1000);
      }

      try {
        await delay(250);

        const response = await axios.get(
          `http://localhost:8080/api/reviews/game/${igdbId}`
        );
        setReviews(response.data);
        setRequestCount((prevCount) => prevCount + 1);
        console.log("Current request count:", requestCount + 1);
      } catch (error) {
        console.error("Arvostelujen hakemisessa ilmeni virhe:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [igdbId]);

  if (loading) return <p>Ladataan arvosteluja...</p>;

  const columnData = [
    {
      field: "reviewerName",
      headerName: "Arvostelijan Nimi",
      flex: 2,
      minWidth: 150,
      maxWidth: 300,
    },
    {
      field: "rating",
      headerName: "Arvosana",
      flex: 1,
      minWidth: 150,
      maxWidth: 300,
    },
    {
      field: "comment",
      headerName: "Kommentti",
      flex: 3,
      wrapText: true,
      autoHeight: true,
      cellStyle: {
        whiteSpace: "normal",
        wordWrap: "break-word",
        lineHeight: "1.2",
      },
      minWidth: 250,
      maxWidth: 600,
    },

    // {
    //   field: "date",
    //   headerName: "Päivämäärä",
    //   flex: 1,
    //   minWidth: 150,
    // },
  ];

  const onGridReady = (params) => {
    params.api.sizeColumnsToFit();
  };

  return (
    <div
      style={{
        height: "56vh",
        width: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Arvostelut pelille (ID: {igdbId})
      </Typography>
      <div
        className="ag-theme-alpine"
        style={{
          width: "80%",
          minWidth: "600px",
          maxWidth: "1200px",
          marginLeft: "auto",
          marginRight: "auto",
          height: "500px",
        }}
      >
        <AgGridReact
          rowData={reviews}
          columnDefs={columnData}
          domLayout="autoHeight"
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};

export default Arvostelut;
