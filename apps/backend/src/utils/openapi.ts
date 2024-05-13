import { contract } from '@tourni-nx/contract/index';
import { generateOpenApi } from '@ts-rest/open-api';

export const openApiDocument = generateOpenApi(
  contract,
  {
    info: {
      title: 'Tourni API',
      version: '0.0.1',
    },
    components: {
      securitySchemes: {
        BasicAuth: {
          type: 'http',
          scheme: 'basic',
        },
      },
    },
  },
  {
    setOperationId: true,
  }
);
