/**
 * @param name - The error name
 * @param code - The error code returned by mongodb
 * @param err - An object containing the error information
*/

type ErrRedirectionType = {
  name?: string;
  err?: {
    code: number;
  };
}

export default ErrRedirectionType
