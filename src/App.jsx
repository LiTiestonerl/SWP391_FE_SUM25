import React from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import RegisterPage from "./pages/register";
import LoginPage from "./pages/login";
import Dashbroad from "./components/dashbroad/index.";
import { persistor, store } from "./redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import OverviewPage from "./pages/dashboard-admin/overview";
import ManageProduct from "./pages/dashboard-admin/product";
import ManageUser from "./pages/dashboard-admin/user";
import MembershipPage from "./pages/membership";
import NotificationsPage from "./pages/notifications";

import Footer from "./components/footer";
import Header from "./components/header/index ";
import NewsPage from "./pages/news";
import RankPage from "./components/rank/RankPage";
import CoachesPage from "./components/coaches/CoachesPage";
import BecomeCoachPage from "./components/BecomeCoach/BecomeCoachPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/", //đường dẫn
      element: (
        <>
          <Header />
          <Outlet />
          <Footer />
        </>
      ),
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "home",
          element: <HomePage />,
        },
        {
          path: "rank",
          element: <RankPage />,
        },
        {
          path: "news",
          element: <NewsPage />,
        },
        {
          path: "coaches",
          element: <CoachesPage />,
        },
        {
          path: "/becomecoach",
          element: <BecomeCoachPage />,
        },

        {
          path: "membership",
          element: <MembershipPage />,
        },
      ], //element show lên cho giao diện
    },
    {
      path: "/login", //đường dẫn
      element: <LoginPage />,
    },
    {
      path: "/dashboard", //đường dẫn
      element: <Dashbroad />,
      children: [
        {
          path: "overview",
          element: <OverviewPage />,
        },
        {
          path: "product",
          element: <ManageProduct />,
        },
        {
          path: "user",
          element: <ManageUser />,
        },
      ],
    },

    {
      path: "/register", //đường dẫn
      element: <RegisterPage />,
    },

    {
      path: "/notifications",
      element: <NotificationsPage />,
    },
  ]);
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <RouterProvider router={router} />
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;
