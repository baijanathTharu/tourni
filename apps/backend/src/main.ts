import express from 'express';
import cors from 'cors';
import { createExpressEndpoints, initServer } from '@ts-rest/express';
import swaggerUi from 'swagger-ui-express';
import { createTournament } from './infra/tournament-infra';
import { contract } from '@tourni-nx/contract';
import { HTTPStatusCode } from '@ts-rest/core';
import { getStatusCode } from './types';
const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 4000;

const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const s = initServer();

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/ping', (req, res) => {
  res.send({ message: 'Hello API' });
});

const router = s.router(contract, {
  createTournament,
});

createExpressEndpoints(contract, router, app, {
  responseValidation: true,
  logInitialization: false,
  requestValidationErrorHandler: (err, req, res) => {
    return res.status(400).json({
      message: 'Validation failed',
      errors: err.body?.flatten().fieldErrors,
    });
  },
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
