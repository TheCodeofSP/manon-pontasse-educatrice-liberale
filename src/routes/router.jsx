import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "../layout/Layout.jsx";
import Home from "../pages/Home.jsx";

const About = lazy(() => import("../pages/About.jsx"));
const Process = lazy(() => import("../pages/Process.jsx"));
const Informations = lazy(() => import("../pages/Informations.jsx"));
const Contact = lazy(() => import("../pages/Contact.jsx"));
const Legal = lazy(() => import("../pages/Legal.jsx"));
const Privacy = lazy(() => import("../pages/Privacy.jsx"));
const NotFound = lazy(() => import("../pages/NotFound.jsx"));
const page = (component) => (
  <Suspense
    fallback={
      <p className="route-loading" role="status">
        Chargement…
      </p>
    }
  >
    {component}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: page(<NotFound />),
    children: [
      { index: true, element: <Home /> },
      { path: "me-connaitre", element: page(<About />) },
      { path: "mon-approche", element: page(<Process />) },
      { path: "informations", element: page(<Informations />) },
      { path: "contact", element: page(<Contact />) },
      { path: "mentions-legales", element: page(<Legal />) },
      { path: "confidentialite", element: page(<Privacy />) },
      { path: "about", element: <Navigate to="/me-connaitre" replace /> },
      { path: "process", element: <Navigate to="/mon-approche" replace /> },
      { path: "legal", element: <Navigate to="/mentions-legales" replace /> },
      { path: "privacy", element: <Navigate to="/confidentialite" replace /> },
    ],
  },
  { path: "*", element: page(<NotFound />) },
]);
