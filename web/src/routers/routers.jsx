import React from "react";
import { Route, Routes } from "react-router-dom";
import routesList from "./routes.jsx";
import HomePage from "../pages/Others/homePage/homePage";

const Routers = () => {
  const node = routesList?.map((d) => {
    if (d.children) {
      return d.children.map((v) => <Route path={v.path} element={v.component} key={v.path} />);
    }
    return <Route path={d.path} element={d.component} key={d.path} />;
  });

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {node}
        <Route exact path="/" element={<HomePage />} />
      </Routes>
    </React.Suspense>
  );
};

export default Routers;
