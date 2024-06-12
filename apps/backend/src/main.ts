import http from 'http';
import express from 'express';
import cors from 'cors';
import { createExpressEndpoints } from '@ts-rest/express';
import swaggerUi from 'swagger-ui-express';
import { Server } from 'socket.io';
import helmet from 'helmet';
import { randomUUID } from 'crypto';
import compression from 'compression';
import { contract } from '@tourni-nx/contract/index';
import { openApiDocument } from './utils/openapi';
import { router } from './infra/router';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 4000;

const app = express();
const server = http.createServer(app);

app.use(compression());
app.use(helmet());

app.use(
  cors({
    origin(requestOrigin, callback) {
      // fix this
      callback(null, true);
    },
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const io = new Server(server, {
  cors: {
    // fix this
    origin(requestOrigin, callback) {
      callback(null, true);
    },
  },
});

// ws connection
io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('practice_problem', async (data) => {
    let code = data.code;
    const fileName = 'two-sum.ts';
    /**
     function main(a: number, b: number) {
      // infinite loop
      let i = 0;
      function t() {
          console.log(i++);
          t();
      }
      t();
    }
     *
     */
    // security issues // sanitize // run code in sandbox mode
    // case 1: input: 2, 3 output: 5
    // case 2: input: 15, 9 output: 24

    // TODO: upload the code file to bucket
    // Run the code in an isolated environment

    code += `
    const out1 = main(2, 3);
    const out2 = main(15, 9);
    console.log(out1);
    console.log(out2);
    `;
    writeFileSync(fileName, code);
    // test cases

    const codePath = join(process.cwd(), fileName);

    const buff = execSync(`tsx ${codePath}`);

    const outs = buff
      .toString()
      .split('\n')
      .filter(Boolean)
      .map((o) => +o);

    const casesResult = [outs[0] === 5, outs[1] === 24];

    // TODO: send an event to the message broker and remove hard coded url
    const res = await fetch('http://localhost:4001/ping');
    if (res.ok) {
      const data = await res.text();
      console.log('from executor', data);
    }

    io.emit('practice_problem_response', {
      casesResult,
      message: 'Test cases ran successfully',
    });
  });

  socket.on('disconnect', () => {
    console.log('client disconnected');
  });
});

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

server.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
