import { Meteor } from 'meteor/meteor';  
import { setupApi } from './graphql/setup.jsx'; // import our API

Meteor.startup(() => {  
  setupApi(); 
});