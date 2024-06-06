import { config } from 'dotenv';

config({
  path: '.env',
});

import { getDb } from '@tourni-nx/db';

const IS_LOCAL = process.env.IS_LOCAL;

const db = getDb();

async function incrementTest() {
  await db.test.create({});

  return {
    count: await db.test.count(),
  };
}

export const handler = async () => {
  try {
    const res = await incrementTest();
    console.log('res', res);

    return {
      status: 200,
      data: {
        res,
      },
    };
  } catch (error) {
    const err = (error as Error)?.message;
    console.error('cron failed', err);

    return {
      status: 500,
      error: {
        message: 'cron failed',
        actualError: err,
      },
    };
  }
};

if (IS_LOCAL) {
  handler()
    .then((d) => console.log('done', JSON.stringify(d, null, 2)))
    .catch((e) => {
      console.error('failed', e);
      process.exit(1);
    });
}
