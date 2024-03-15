import dotenv from 'dotenv';

dotenv.config();

import { createServer } from './server';

async function startServer() {
  const server = createServer();
  const port = process.env.PORT || '3000';

  try {
    await server.listen(port);
    server.log.info(`Server listening on port ${port}`);
  } catch (error) {
    server.log.error('Error starting server:', error);
    process.exit(1);
  }
}

startServer();
