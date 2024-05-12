import express from 'express';
import cors from 'cors';
import { createExpressEndpoints } from '@ts-rest/express';
import swaggerUi from 'swagger-ui-express';
import helmet from 'helmet';
import { randomUUID } from 'crypto';
import compression from 'compression';
import { contract } from '@tourni-nx/contract';
import { openApiDocument } from './utils/openapi';
import { router } from './infra/router';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 4000;

const app = express();

app.use(compression());
app.use(helmet());

app.use(
  cors({
    origin(requestOrigin, callback) {
      callback(null, true);
    },
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
app.use('/api-docs.json', (req, res) => res.send(openApiDocument));

createExpressEndpoints(contract, router, app, {
  responseValidation: true,
  logInitialization: false,
  requestValidationErrorHandler: (err, req, res) => {
    return res.status(400).json({
      message: 'Validation failed',
      errors: err.body?.flatten().fieldErrors,
    });
  },
  globalMiddleware: [
    (req, _res, next) => {
      req.requestId = randomUUID();
      next();
    },
  ],
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error, req, res, _next) => {
  console.error({ requestId: req.requestId, error });
  res.status(500).json({
    message: 'Internal server error',
  });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
