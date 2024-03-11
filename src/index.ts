import fastify from 'fastify';
import { Pool } from 'pg';

import { userController } from '../src/modules/users/users.controller';

const app = fastify({ logger: true });

const pool = new Pool({
  connectionString: 'your-postgres-connection-string',
});

app.decorate('pg', pool);

app.get(userController);

const start = async () => {
  try {
    await app.listen(3000);
  } catch (err) {
    app.log.error(err);
    app.exit(1);
  }
};

start();
