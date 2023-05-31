import React from "react";
import { Navigate, Route, Routes as ReactRoutes } from "react-router-dom";
import Migrate from "../pages/migrate/migrate";
import Register from "../pages/register/register";
import RouteCodes from "./route-codes";
import Invite from "../pages/invite/invite";
import Faucets from "../pages/faucets/faucets";

const Routes = () => {
  return (
    <>
      <ReactRoutes>
        <Route path={RouteCodes.register} element={<Register />} />
        <Route path={RouteCodes.migrate} element={<Migrate />} />
        <Route path={RouteCodes.faucets} element={<Faucets />} />
        <Route path={RouteCodes.invite} element={<Invite />} />
        <Route
          path="/"
          element={<Navigate replace to={RouteCodes.register} />}
        />
      </ReactRoutes>
    </>
  );
};

export default Routes;
