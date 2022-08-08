import React from "react";
import { Navigate, Route, Routes as ReactRoutes } from "react-router-dom";
import Migrate from "../pages/migrate/migrate";
import Register from "../pages/register/register";
import RouteCodes from "./route-codes";

const Routes = () => {
  return (
    <>
      <ReactRoutes>
        <Route path={RouteCodes.register} element={<Register />} />
        <Route path={RouteCodes.migrate} element={<Migrate />} />
        <Route
          path="/"
          element={<Navigate replace to={RouteCodes.register} />}
        />
      </ReactRoutes>
    </>
  );
};

export default Routes;
