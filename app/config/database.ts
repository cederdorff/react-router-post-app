import mongoose from "mongoose";

const { MONGODB_URL, NODE_ENV } = process.env;

if (!MONGODB_URL) {
  const errorMessage =
    NODE_ENV === "production"
      ? "Please define the MONGODB_URL environment variable — pointing to your full connection string, including database name."
      : "Please define the MONGODB_URL environment variable inside an .env file — pointing to your full connection string, including database name.";
  throw new Error(errorMessage);
}

// Call this function from entry.server.jsx. We reuse an existing Mongoose db
// connection to avoid creating multiple connections in dev mode when Remix
// "purges the require cache" when reloading on file changes.
export default function connectDb() {
  // Reuse the existing Mongoose connection if we have one...
  // https://mongoosejs.com/docs/api/connection.html#connection_Connection-readyState
  const readyState = mongoose.connection.readyState;
  if (readyState > 0) {
    console.log("Mongoose: Re-using existing connection (readyState: %d)", readyState);
    return;
  }

  // If no connection exists yet, set up event logging...
  // https://mongoosejs.com/docs/connections.html#connection-events
  mongoose.connection.on("error", error => {
    console.error("Mongoose: error %s", error);
  });

  for (const event of ["connected", "reconnected", "disconnected", "close"]) {
    mongoose.connection.on(event, () => console.log("Mongoose: %s", event));
  }

  // ...and create a new connection:
  mongoose.connect(MONGODB_URL!).catch(error => {
    console.error(error);
  });
}
