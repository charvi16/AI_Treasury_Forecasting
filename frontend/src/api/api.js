// import axios from "axios";

// export const API = axios.create({
//   baseURL: "http://127.0.0.1:8000"
// });

// export const getForecastData = () => API.get("/forecast");
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const API = axios.create({
  baseURL: API_BASE
});

export const getForecastData = () => API.get("/forecast");
