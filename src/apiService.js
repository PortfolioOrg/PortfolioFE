import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

export const fetchReviews = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/reviews`);
    return response.data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};
