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
