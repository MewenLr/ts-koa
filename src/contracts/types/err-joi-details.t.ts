/**
 * @param type - The error type
 * @param key - The key of the field causing the error
 * @param context - An object containing the error information
*/

type ErrJoiDetailsType = {
  type: string;
  context: {
    key: string;
  };
}

export default ErrJoiDetailsType
