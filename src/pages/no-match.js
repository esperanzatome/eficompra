import React, {Component} from 'react';
const { Link } = require("react-router-dom");

export default class NoMatch extends Component {
 
    render() {  
   
      return (
        <div className='noMatch'>
        <h2>We couldn't find that page</h2>
        <Link to= "/">Return to Homepage</Link>
        </div>
      )
    }
}