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
import ManageRating from "./pages/dashboard-admin/managerating";
import ForgotPasswordPage from "./pages/dashboard-admin/forgot-password";
import NotificationsPage from "./pages/notifications";
import QuitPlanPage from "./pages/quit-plan";
import Footer from "./components/footer";
import Header from "./components/header/index ";
import NewsPage from "./pages/news";
import RankPage from "./components/rank/RankPage";
import CoachesPage from "./components/coaches/CoachesPage";
import BecomeCoachPage from "./components/BecomeCoach/BecomeCoachPage";
import Verify from "./pages/verify";
import ManageAccount from "./pages/dashboard-admin/manageaccount";
import ChatPage from "./pages/chat";
import UserProfile from "./pages/userprofile";
import Membership from "./pages/dashboard-admin/membership";
import MembershipPackages from "./pages/membership-packages/MembershipPackages";
import PaymentResult from "./pages/payment-result/PaymentResult";
import Social from "./pages/social";
import StatusPage from "./pages/status";
import NewsDetailPage from "./pages/newsdetail";
import CigarettePackages from "./pages/dashboard-admin/cigarettepackages";
import CreateNotification from "./pages/dashboard-admin/notification";
import Payment from "./pages/payment-result/Payment";
import Achievement from "./pages/achievement";
import ManageAachiement from "./pages/dashboard-admin/achievement";
import QuitPlanAdmin from "./pages/dashboard-admin/quitplan";
import CoachProfile from "./pages/coachProfile";

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
          path: "/membership",
          element: <MembershipPackages />,
        },
        {
          path: "/quit-plan/*",
          element: <QuitPlanPage />,
        },
        {
          path: "/user-profile",
          element: <UserProfile />,
        },
        {
          path: "/social",
          element: <Social />,
        },
        {
          path: "/status",
          element: <StatusPage />,
        },
        {
          path: "/news/:id",
          element: <NewsDetailPage />,
        },
        {
          path: "/payment",
          element: <Payment />,
        },
        {
          path: "/achievement",
          element: <Achievement />,
        },
        {
          path: "coach/:id",
          element: <CoachProfile />,
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
          path: "managerating",
          element: <ManageRating />,
        },
        {
          path: "manageaccount",
          element: <ManageAccount />,
        },
        {
          path: "membership",
          element: <Membership />,
        },
        {
          path: "cigarettepackages",
          element: <CigarettePackages />,
        },
        {
          path: "achievement",
          element: <ManageAachiement />,
        },
        { path: "notification", element: <CreateNotification /> },
        {
          path: "quitplan",
          element: <QuitPlanAdmin />,
        },

      ],
    },

    {
      path: "/register", //đường dẫn
      element: <RegisterPage />,
    },

    {
      path: "/forgot-password",
      element: <ForgotPasswordPage />,
    },

    {
      path: "/notifications",
      element: <NotificationsPage />,
    },
    {
      path: "/verify",
      element: <Verify />,
    },
    {
      path: "/chat",
      element: <ChatPage />,
    },

    {
      path: "/payment-result",
      element: <PaymentResult />,
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