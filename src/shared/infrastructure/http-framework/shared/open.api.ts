import config from '@/shared/infrastructure/config';

const { project, swagger } = config;

export default {
  routePrefix: `${swagger.html}`,
  exposeRoute: swagger.isPublic === 'true',
  swagger: {
    info: {
      title: project.name,
      description: `.ENV: ${project.mode}`.toUpperCase(),
      version: '1.0.0'
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here'
    },
    host: `http://${project.host}:${project.port}`,
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [{ name: 'User', description: 'User Service Endpoints' }],
    definitions: {},
    securityDefinitions: {}
  }
};
