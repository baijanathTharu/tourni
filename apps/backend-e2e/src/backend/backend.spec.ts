import { config } from '../config';

describe('GET /ping', () => {
  it('should return a message', async () => {
    const res = await fetch(`${config.BACKEND_URL}/ping`);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual({ message: 'hello from tourni' });
  });
});
