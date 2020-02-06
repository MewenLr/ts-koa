/**
 * @param msg - A message returning information about the request
 * @param doc - The doc returned by mongo
 * @param token - The JWT created to store user data
*/

type ResBodyType = {
  msg: string;
  doc?: object;
  token?: string;
}

export default ResBodyType
