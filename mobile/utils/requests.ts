import axios from "axios";
import urls from "@/constants/urls";

const requests = axios.create({
  baseURL: urls.baseURL,
  headers: {
    "Content-Type": "application/json",
    ContentType: "application/json",
    "content-type": "application/json",
    contenttype: "application/json",
  },
});

export default requests;
