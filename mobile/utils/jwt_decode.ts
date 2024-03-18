/**
 * Decodes a JWT (JSON Web Token) and returns its header, payload, and signature.
 * Returns an object with the decoded header, payload, and signature, or a default object if the token is invalid.
 *
 * @param {string} raw_token - The raw JWT to decode.
 * @returns {{header: object, payload: object, signature: string}} An object containing the decoded header, payload, and signature of the JWT.
 */
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
