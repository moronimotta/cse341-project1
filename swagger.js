const swaggerAutogen = require('swagger-autogen')();  

const doc = {
  info: {
    title: 'CSE 341 Project API',
    description: 'Webservice for weeks 3-4'
  },
  host: 'localhost:8080',
  schemes: ['http']
};

const outputFile = './swagger.json';
const routes = ['./routes/index.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc)