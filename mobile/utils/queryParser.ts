/**
 * Parses a query string and returns an object containing the key-value pairs.
 * Returns an empty object if the query string is invalid.
 *
 * @param {string} queryStr - The query string to parse.
 * @returns {{[key: string]: string}} An object containing the key-value pairs of the query string.
 */
export default function queryParser(queryStr: string) {
  try {
    const str = queryStr.substring(1);
    const querys = str.split("&");
    const dicter: { [key: string]: string } = {};
    querys.forEach((query) => {
      const parsedQuery = query.split("=");
      if (parsedQuery[0] && parsedQuery[1]) {
        dicter[parsedQuery[0]] = parsedQuery[1];
      }
    });

    return dicter;
  } catch {
    return {};
  }
}
