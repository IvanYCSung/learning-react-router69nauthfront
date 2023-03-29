import { RouterProvider, createBrowserRouter } from "react-router-dom";
import EditEventPage from "./pages/EditEvent";
import EventDetailPage, {
  loader as eventDetailLoader,
  action as deleteEventAction,
} from "./pages/EventDetail";
import EventsPage, { loader as eventsLoader } from "./pages/Events";
import HomePage from "./pages/Home";
import NewEventPage from "./pages/NewEvent";
import RootLayout from "./pages/Root";
import EventsRootLayout from "./pages/EventsRoot";
import ErrorPage from "./pages/Error";
import { action as manipulateEventAction } from "./components/EventForm";
import NewsletterPage, { action as newsletterAction } from "./pages/Newsletter";
import AuthenticationPage, {
  action as authAction,
} from "./pages/Authentication";
import { action as logoutAction } from "./pages/Logout";
import { checkAuthLoader, tokenLoader } from "./util/auth";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    id: "root",
    loader: tokenLoader,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "events",
        element: <EventsRootLayout />,
        children: [
          {
            index: true,
            element: <EventsPage />,
            loader: eventsLoader,
            // loader: async () => {
            //   const response = await fetch("http://localhost:8080/events");

            //   if (!response.ok) {
            //     // handling error
            //   } else {
            //     const resData = await response.json();
            //     console.log(resData);
            //     return resData.events;
            //   }
            // }
            // in the real world, we do not put the whole function in loader, it makes code messy. Instead, we put the function with the component, in this case <EventPage/> / Events.js, and export the function and then re-import to this component.
          },
          {
            path: ":eventId",
            id: "event-detail",
            loader: eventDetailLoader,
            children: [
              {
                index: true,
                element: <EventDetailPage />,
                action: deleteEventAction,
              },
              {
                path: "edit",
                element: <EditEventPage />,
                action: manipulateEventAction,
                loader: checkAuthLoader,
              },
            ],
          },
          // above nested route is created for sharing loader, no element is required.
          // to share loader funtction, we need to add id route definition and useRouteLoaderData in the components, not useLoaderData anymore.
          {
            path: "new",
            element: <NewEventPage />,
            action: manipulateEventAction,
            loader: checkAuthLoader,
          },
        ],
      },
      { path: "auth", element: <AuthenticationPage />, action: authAction },
      {
        path: "newsletter",
        element: <NewsletterPage />,
        action: newsletterAction,
      },
      {
        path: "logout",
        action: logoutAction,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

// router definition - loader receives functions and will be triggered before the route gets rendered. the loader function returns data that is to be used in the route.

// loader can take async function and convert promise data to resolved data, so we don't need to worry about handling promise data. it can also any kind of data even Response() object.

// we can use useLoaderData() in all the components in the nested route where the loader is, but cannot use in higher level.

// In loader functions, it all happenes in brower, so we can use broswer functions such as local storage, cookies...etc or JS code, but not React hooks. React hooks can only be used in JSX.

// loader function can throw errors to error element route. in above case, loader function throws errors from events route and the errors will bubble up to the root route level to display in Error.js.

// router definition - action receives functions. like loader, we usually put the action function with the component where we use it.

// we use tokenLoader in the root route is becuase we want to re-render all the components using token in order to show login/logout differece in the webpages, such as MainNavigation.js. we could also use useContext ro solve this issue.

// we add checkAuthLoader in edit and new paths as we do not want users to enter url to access these pages.
