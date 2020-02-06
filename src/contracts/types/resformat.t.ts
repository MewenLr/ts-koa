/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * @param code - The http code status of the response
 * @param msg - A message returning information about the request
 * @param doc - The document fetched in mongodb
 * @param err - An optional object containing information about response error
*/

type ResFormatType = {
  code: number;
  msg: string;
  doc?: any;
  err?: object;
}

export default ResFormatType
