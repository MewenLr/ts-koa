/**
 * @param port - A Port to run the server on
 * @param mongoUri - The mongo uri mongodb://dbuser:dbpass@mongo:27017/dbdev
 * @param jwtSecret - The secret JWT uses to create a signature for the payload
*/

type ConfigServerType = {
  port: number;
  mongoUri: string;
  jwtSecret: string;
}

export default ConfigServerType
