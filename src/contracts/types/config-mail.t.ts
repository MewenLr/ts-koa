/**
 * @param subject - The subject of the email
 * @param html - The content of the email
 * @param success - Message on success send
*/

type ConfigMailType = {
  subject: string;
  html: string;
  success: string;
}

export default ConfigMailType
