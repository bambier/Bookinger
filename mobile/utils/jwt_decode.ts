export default function jwt_decode(raw_token: string) {
  const token = raw_token.split(".");
  try {
    return {
      header: JSON.parse(atob(token[0])),
      payload: JSON.parse(atob(token[1])),
      signature: token[2],
    };
  } catch {
    console.error("Token Is Invalid.");
    console.info("You are not hacker but we are!");
    return {
      header: null,
      payload: {},
      signature: null,
    };
  }
}
