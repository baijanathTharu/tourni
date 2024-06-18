import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { pollMessages } from './utils/poll-sqs';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 4001;

const app = express();

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

app.get('/ping', (req, res) => {
  res.status(200).send('CODE EXECUTOR is running...');
});

/**
 * poll the sqs for new messages
 */

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

pollMessages();
