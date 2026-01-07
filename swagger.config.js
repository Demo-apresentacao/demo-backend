import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Agendamentos',
      version: '1.0.0',
      description: 'Documentação da API gerada automaticamente com Swagger',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Servidor Local',
      },
        {
        url: 'https://urban-backend-4b5e.onrender.com',
        description: 'Servidor de Produção (Render)',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },

  // 🔥 CAMINHO ABSOLUTO (resolve 100% dos casos)
  apis: [path.join(process.cwd(), 'src/routes/**/*.js')],
};

const specs = swaggerJsdoc(options);

export default specs;
