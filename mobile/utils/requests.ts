import urls from "@/constants/urls";
import axios from "axios";

const requests = axios.create({
  baseURL: urls.baseURL,
  headers: {
    "Content-Type": "application/json",
    ContentType: "application/json",
    "content-type": "application/json",
    contenttype: "application/json",
    "Accept-Language": "fa-ir",
  },
  timeout: 2000,
});

export default requests;
