/**
 * Creates a new instance of `axios` with a custom configuration.
 * The new instance is assigned to the `requests` variable and exported as the default export.
 *
 * @remarks
 * The custom configuration includes:
 * - A base URL for all requests, taken from the `urls` constant.
 * - A custom `Content-Type` header, set to `application/json`.
 * - A custom `Accept-Language` header, set to `fa-ir`.
 * - A timeout of 2000 milliseconds.
 *
 * @example
 * Import the `requests` variable in another module and use it to make HTTP requests.
 *
 * @returns {object} The new instance of `axios` with the custom configuration.
 */
import urls from "@/constants/urls";
import axios from "axios";

const requests = axios.create({
  baseURL: urls.baseURL,
  headers: {
    "Content-Type": "application/json",
    "content-type": "application/json",
    "Accept-Language": "fa-ir",
  },
  timeout: 2000,
});

export default requests;
