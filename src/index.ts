import dotenv from 'dotenv';
import { createServer } from './server';

dotenv.config();

async function startServer() {
  const server = createServer();
  const port = process.env.PORT || '3000';
  const host = '0.0.0.0';

  try {
    await server.listen(port, host);
    server.log.info(`Server listening on port ${port}`);
  } catch (error) {
    server.log.error('Error starting server:', error);
    process.exit(1);
  }
}

startServer();
