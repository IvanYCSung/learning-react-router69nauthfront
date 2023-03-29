import { Suspense } from "react";
import { useLoaderData, json, defer, Await } from "react-router-dom";

import EventsList from "../components/EventsList";

function EventsPage() {
  // const events = useLoaderData();
  // because below return a response object in the fetch function, useLoaderData will give us the data that is part of the response

  const { events } = useLoaderData(); // promise data is because we use defer. otherwise normal loader returns parsed data automatically.
  console.log(events);

  return (
    <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
      <Await resolve={events}>
        {(loadedEvents) => <EventsList events={loadedEvents} />}
      </Await>
    </Suspense>
  );
  // since we defer the data, we use <Await> to await the data. in <Await>, we pass a function in.
  // <Suspense> give fallback when we are waiting data to arrive
}

export default EventsPage;

// hook - useLoaderData can access the cloest loader data.

// to access useLoaderData data in the component, we use "events" property.

// we can also not use useLoaderData() to access loader data here and to access in EventsList.js. in this case, we do not need to events property to pass loader data

async function loadEvents() {
  const response = await fetch("http://localhost:8080/events");

  if (!response.ok) {
    // return { isError: true, message: "Could not fetch events" };
    // return a normal object made by us as loader functions can return any type of data, but we usually throw the error to the closest error element route.

    // throw new Response(JSON.stringify({ message: "Could not fetch event." }), {
    //   status: 500,
    // });
    // to add data into response. however we can use json() provided by react router dom to JSON.stringify data, like below
    throw json({ message: "Could not fetch event." }, { status: 500 });
  } else {
    // const resData = await response.json();
    // console.log(resData);
    // return resData;
    // loader automatically extracts data and return the response object, so we do not need to handle the response from the backend.

    const resData = await response.json();
    return resData.events;
    // if we use loader, it will turn promise to normal onject for us so we only need to return reponse. we are using defer in loader, we need to parse the data.
  }
}

// we export this function from App.js and re-import into App.js in order to make the code neater

// json() can replace new Response() and we do not need to JSON.stringify() data here and JSON.parse() data in the end-use component

export function loader() {
  return defer({
    events: loadEvents(),
  });
}

// defer accept objects. we call the async function loadEvents() in the object and it returns a promise. a normal loader can parse promise for us, so we do not need to wait, but defer is used here.
