import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import LoadFile from "./containers/LoadFile";
import Load from "./containers/Load";
import AppliedRoute from "./components/AppliedRoute";
import NewFile from "./containers/NewFile";
import Files from "./containers/Files";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";

export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <UnauthenticatedRoute path="/login" exact component={Login} props={childProps} />
    <UnauthenticatedRoute path="/load" exact component={Load} props={childProps} />
    <UnauthenticatedRoute path="/load/:id" exact component={LoadFile} props={childProps} />
    <AuthenticatedRoute path="/files/new" exact component={NewFile} props={childProps} />
    <AuthenticatedRoute path="/files/:id" exact component={Files} props={childProps} />
    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>;