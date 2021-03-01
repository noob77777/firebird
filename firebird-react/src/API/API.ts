import axios from "axios";
import { FIREBIRD_SERVER } from "../constants";

const API = axios.create({
  baseURL: FIREBIRD_SERVER,
  timeout: 1000,
});

export default API;
