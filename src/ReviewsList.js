import React, { useState, useEffect } from "react";
import { fetchReviews } from "./apiService";

const ReviewsList = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getReviews = async () => {
      try {
        const data = await fetchReviews();
        setReviews(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    getReviews();
  }, []);

  if (loading) return <div>Ladataan...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Arvostelut</h1>
      <ul>
        {reviews.map((review) => (
          <li key={review.id}>
            <strong>{review.reviewerName}</strong>
            <br />
            <strong>Arvosana:</strong> {review.rating}
            <br />
            <strong>Kommentti:</strong> {review.comment}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReviewsList;
