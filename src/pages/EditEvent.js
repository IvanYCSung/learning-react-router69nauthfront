import { useRouteLoaderData } from "react-router-dom";

import EventForm from "../components/EventForm";

function EditEventPage() {
  const data = useRouteLoaderData("event-detail");
  // <EventDetailPage/> and  <EditEventPage /> are at the same level of the nested route and share the same loader. in this case, we use useRouteLoaderData instead of useLoaderData. we also pass id in useRouteLoaderData.
  console.log(data);

  return <EventForm method="patch" event={data.event} />;
}

export default EditEventPage;
