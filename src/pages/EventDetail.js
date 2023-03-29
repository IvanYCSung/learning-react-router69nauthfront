// import { useParams } from "react-router-dom";
import { Suspense } from "react";
import {
  useRouteLoaderData,
  json,
  redirect,
  defer,
  Await,
} from "react-router-dom";

import EventItem from "../components/EventItem";
import EventsList from "../components/EventsList";
import { getAuthToken } from "../util/auth";

function EventDetailPage() {
  // const params = useParams();

  const { event, events } = useRouteLoaderData("event-detail");
  // <EventDetailPage/> and  <EditEventPage /> are at the same level of the nested route and share the same loader. in this case, we use useRouteLoaderData instead of useLoaderData. we also pass id in useRouteLoaderData.

  return (
    <>
      <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
        <Await resolve={event}>
          {(loadedEvent) => <EventItem event={loadedEvent} />}
        </Await>
      </Suspense>
      <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
        <Await resolve={events}>
          {(loadedEvents) => <EventsList events={loadedEvents} />}
        </Await>
      </Suspense>
    </>
  );
}

export default EventDetailPage;

// <Suspense fallback={loading...}> for <EventItem> will not appear as we await loadEvent in defer below. the data will arrive before the page is rendered.
// <Suspense> needs to wrap these two defer separately. if we wrap them together, it will wait until loadEvent and loadEvents data both arrive before the page is rendered.

// we use eventId as the path in App.js, so to extract the id we enter params.eventId

async function loadEvent(id) {
  const response = await fetch("http://localhost:8080/events/" + id);

  if (!response.ok) {
    throw json(
      { message: "Could not fetch details for selected event." },
      { status: 500 }
    );
  } else {
    const resData = await response.json();
    return resData.event;
  }
}

async function loadEvents() {
  const response = await fetch("http://localhost:8080/events");

  if (!response.ok) {
    throw json({ message: "Could not fetch event." }, { status: 500 });
  } else {
    const resData = await response.json();
    return resData.events;
  }
}

export async function loader({ request, params }) {
  const id = params.eventId;
  console.log(id);

  return defer({
    event: await loadEvent(id), // add await here in order to wait this piece data to arrive before the page is rendered
    events: loadEvents(), // no await, page is rendered first and data arrives later
  });
}
// we cannot use useParams in not JSX code, so we use this way to extract params. the loader function gets passed an object in, request and params. request can access url and params can access route values.

export async function action({ params, request }) {
  const eventId = params.eventId;
  const token = getAuthToken();

  const response = await fetch("http://localhost:8080/events/" + eventId, {
    method: request.method, // request.method is from the data we pass into submit() in EventItem.js
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  if (!response.ok) {
    throw json({ message: "Could not delete event." }, { status: 500 });
  }

  return redirect("/events");
}
