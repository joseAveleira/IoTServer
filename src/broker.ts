import { AuthenticateError, Server as Broker } from "aedes";
import { createServer } from "net";
import { Server as http, createServer as httpCreateServer } from "http";
import { createWebSocketStream, Server } from "ws";
import chalk from "chalk";
import { loginMQTT } from "./controllers/user.controller";

class brokerMQTT {
  MQTTport: number = 1883;
  WSport: number = 2000;
  broker = Broker({
    heartbeatInterval: 60000,
    authenticate: async (client, username, password, callback) => {
      const error = new Error() as AuthenticateError;
      if (password) {
        let logged = await loginMQTT(username, password.toString());
        //console.log(logged);
        if (logged) {
          callback(null, true);
        } else {
          error.returnCode = 4;
          console.log(" - Bad username or passowrd");
          callback(error, false);
        }
      } else {
        error.returnCode = 5;
        console.log(" - Not Authorized ");
        callback(error, false);
      }
    },
    authorizePublish: (client, packet, callback) => {
      const usernameTopic = packet.topic.split("/");
      const usernameId = client.id.split("-");
      if (usernameTopic[0] === usernameId[0]) {
        callback(null);
      } else {
        console.error(
          chalk.red(`  - ${client.id}: publish wrong topic -> ${packet.topic}`)
        );
        return callback(new Error("wrong topic"));
      }
    },
    authorizeSubscribe: (client, sub, callback) => {
      const usernameTopic = sub.topic.split("/");
      const usernameId = client.id.split("-");
      if (usernameTopic[0] === usernameId[0]) {
        sub.qos = 1;
      } else {
        // overwrites subscription
        //sub.topic = 'foo'
        console.error(
          chalk.red(`  - ${client.id}: subscribe wrong topic -> ${sub.topic}`)
        );
        return callback(new Error("wrong topic"));
      }
      callback(null, sub);
    },
  });

  public listenMQTT() {
    this.broker.on("publish", (packet, client) => {
      if (client) {
        console.log(
          `   - ${client.id} \ttopic: ${packet.topic} \tmessage: ${packet.payload}`
        );
      }
    });

    this.broker.on("client", (client) => {
      console.log(`  - Client: ${client.id} connected`);
    });

    // MQTT server
    const MQTTserver = createServer(this.broker.handle);
    MQTTserver.listen(this.MQTTport, () => {
      console.log(` - MQTT on port: ${chalk.yellow(this.MQTTport)}`);
    });
  }

  public websocketsMQTT() {
    //WS server

    const serverWS: http = httpCreateServer();
    const ws: Server = new Server(
      { server: serverWS, port: this.WSport },
      (): void => {
        console.log(` - Websoket MQTT on port: ${chalk.yellow(this.WSport)}`);
      }
    );

    ws.on("connection", (conn): void => {
      const stream = createWebSocketStream(conn);
      this.broker.handle(stream);
    });
  }
}

export default brokerMQTT;
