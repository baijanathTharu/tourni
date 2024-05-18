import { initQueryClient } from '@ts-rest/react-query';
import { contract } from '@tourni-nx/contract/index';

export const client = initQueryClient(contract, {
  baseUrl: import.meta.env.VITE_BACKEND_URL,
  baseHeaders: {},
  // api?: () => ... // <- Optional Custom API Fetcher (see below)
});
