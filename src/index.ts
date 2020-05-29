import express from "express";
import { Server as Broker } from "aedes";
import { createServer } from "net";
import * as http from "http";
import { createWebSocketStream, Server } from "ws";

const MQTTport: number = 1883;
const WSport: number = 2000;
const expressPort: number = 3000;

const broker = Broker({
  heartbeatInterval: 60000,
});


broker.on("publish", (packet, client) => {
  if (client) {
    console.log("%s : topic %s : %s", client.id, packet.topic, packet.payload);
  }
});

// Initializations
const app: express.Application = express();

// Settings
app.set("port", process.env.PORT || expressPort);

//ws server

const serverws: http.Server = http.createServer();
const ws: Server = new Server({ server: serverws, port: WSport });
ws.on("connection", (conn): void => {
  const stream = createWebSocketStream(conn);
  broker.handle(stream);
});

// MQTT server
const server = createServer(broker.handle);
server.listen(MQTTport);

//test Express
app.get("/", (req, res) => {
  res.send("Hello Worlds!");
});

//Express server
app.listen(app.get("port"), () => {
  console.log(`server on port ${app.get("port")}`);
});
