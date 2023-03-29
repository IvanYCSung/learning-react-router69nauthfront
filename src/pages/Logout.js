import { redirect } from "react-router-dom";

export function action() {
  localStorage.removeItem("token");
  localStorage.removeItem("expiration");
  return redirect("/");
}

// we could do normal button click handler with localStorage.removeItem, we use React route here to create a blank page just for localStorage.removeItem.
