import axios from "axios";

const requests = axios.create({
  baseURL: "192.168.126.199:8000",
  headers: {
    "Content-Type": "application/json",
    ContentType: "application/json",
    "content-type": "application/json",
    contenttype: "application/json",
  },
});

export default requests;
