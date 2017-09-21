import { Meteor } from 'meteor/meteor';  
import express from 'express';

import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';

import bytespeicher from './bytespeicher';
import parkdata from './parken-erf';

import _ from 'lodash';
 
const executableSchema = makeExecutableSchema({
  typeDefs: [
    bytespeicher.schema,
    parkdata.schema,
    `
    type Query {
      sensorStations(
        nickname: String,
        id: String

        limit: Int
      ): [SensorStation]
      parkData: [Parkhaus]
    }

    schema {
      query: Query
    }
    `
  ], 
  resolvers: _.merge(
    bytespeicher.resolver,
    parkdata.resolver
  ),
});


/*
var schema = buildSchema([
  bytespeicher.schema
]);

var root = {
  bytespeicher: bytespeicher.resolver
};*/

export function setupApi() {  
  const app = express();
  app.use('/___graphql', bodyParser.json(), graphqlExpress({
    schema: executableSchema,
  }));

  app.use('/___graphiql', graphiqlExpress({
    endpointURL: '/___graphql',
  }));
  

  WebApp.connectHandlers.use(app);
}