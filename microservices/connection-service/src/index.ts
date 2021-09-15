import express from "express";
import os from "os";
const port = process.env.PORT;
const mqtt_url = process.env.MQTT;

var app = express();

// define a route handler for the default home page
app.get("/", (req, res) => {
  // render the index template
  res.send("mqtt-service active, host: " + os.hostname());
});

// start the express server
app.listen(port, () => {
  console.log(`server started at http://127.0.0.1:${port}`);
});
