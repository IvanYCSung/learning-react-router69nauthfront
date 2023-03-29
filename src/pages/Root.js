import { useEffect } from "react";
import {
  Outlet,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "react-router-dom";

import MainNavigation from "../components/MainNavigation";
import { getTokenDuration } from "../util/auth";

function RootLayout() {
  // const navigation = useNavigation();

  const token = useLoaderData();
  // we do not need to use useRouteLoaderData("root") as the loader is set at <RootLayout> level
  const submit = useSubmit();

  useEffect(() => {
    if (!token) {
      return;
    }

    if (token === "EXPIRED") {
      submit(null, { action: "logout", method: "post" });
      return;
    }

    const tokenDuration = getTokenDuration();
    console.log(tokenDuration);

    setTimeout(() => {
      submit(null, { action: "logout", method: "post" });
      // targeting the <Form> action in MainNavigation.js
    }, tokenDuration);
  }, [token, submit]);
  // we use useEffect here to time an hour as the token from backend only last for an hour for security reason. if the token change or an hour timeout after we submit login form, all the components under <RootLayout> get re-rendered.

  return (
    <>
      <MainNavigation />
      <main>
        {/* {navigation.state === "loading" && <p>Loading...</p>} */}
        <Outlet />
      </main>
    </>
  );
}

export default RootLayout;

// useNavigation can check data status and tranistion. above navigation.state has "idle", "loading" or "submitting" statuses as an indicator.
