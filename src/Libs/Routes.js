import React from "react";
import { Route, Switch } from "react-router-dom";
import AuthenticatedRoute from "../Components/AuthenticatedRoute";
import UnauthenticatedRoute from "../Components/UnauthenticatedRoute";
import Header from "../Components/Header";
import Home from "../Containers/Home";
import NotFound from "../Containers/NotFound";
import SignIn from "../Containers/SignIn";
import SignUp from "../Containers/SignUp";
import Recipes from "../Containers/Recipes";
import Menu from '../Containers/Menu';
import Pantry from '../Containers/Pantry';
import Shopping from '../Containers/Shopping';

export default function Routes({ appProps }) {
  return (
    <React.Fragment>
      <Header appProps={appProps}/>
      <Switch>
        <UnauthenticatedRoute path="/SignIn" exact component={SignIn} appProps={appProps} />
        <UnauthenticatedRoute path="/SignUp" exact component={SignUp} appProps={appProps} />
        <AuthenticatedRoute path="/" exact component={Home} appProps={appProps} />
        <AuthenticatedRoute path="/Recipes" exact component={Recipes} appProps={appProps} />
        <AuthenticatedRoute path="/Recipes/:id" exact component={Recipes} appProps={appProps} />
        <AuthenticatedRoute path="/Menu" exact component={Menu} appProps={appProps} />
        <AuthenticatedRoute path="/Pantry" exact component={Pantry} appProps={appProps} />
        <AuthenticatedRoute path="/Shopping" exact component={Shopping} appProps={appProps} />
        
        { /* Finally, catch all unmatched routes */ }
        <Route component={NotFound} />
      </Switch>
    </React.Fragment>
  );
}
