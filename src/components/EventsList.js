// import { useLoaderData } from "react-router-dom";
import { Link } from "react-router-dom";

import classes from "./EventsList.module.css";

// function EventsList() {
//   const events = useLoaderData();
// }
// we can also use useLoaderData() in this component, insteading of passing loader data through Event.js

function EventsList({ events }) {
  return (
    <div className={classes.events}>
      <h1>All Events</h1>
      <ul className={classes.list}>
        {events.map((event) => (
          <li key={event.id} className={classes.item}>
            <Link to={`/events/${event.id}`}>
              <img src={event.image} alt={event.title} />
              <div className={classes.content}>
                <h2>{event.title}</h2>
                <time>{event.date}</time>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EventsList;
