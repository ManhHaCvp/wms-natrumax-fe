import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 3000,
  header: {
    "Content-Type": "application/json",
  },
});

export default instance;
