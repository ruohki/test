import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

import { BrowserRouter, Link, Route } from 'react-router-dom';

export const Tacos = () => <h1>TACOS</h1>

export default class App extends Component {
  render() {
    return (
      <div>
        <Link to="/test">Tacos</Link>
        
        <Route path="/test" component={Tacos} />
      </div>

    )
  }
}