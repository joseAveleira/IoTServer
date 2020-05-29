import { AuthErrorCode, AuthenticateError,Server as Broker } from "aedes";
import { createServer } from "net";
import * as http from "http";
import { createWebSocketStream, Server } from "ws";

class brokerMQTT {
  MQTTport: number = 1883;
  WSport: number = 2000;

  broker = Broker({
    heartbeatInterval: 60000,
    authenticate: (client, username, password, callback) => {
      //console.log(password.toString());
      //var error: AuthenticateError =1
      if (password) {
        if (password.toString() === "broker_@8102") {
          callback(null, true);
        } else {
          const error = new Error() as AuthenticateError;
          error.returnCode = 4;
          console.log("   - Bad username or passowrd");
          callback(error, false);
        }
      }else{
        const error = new Error() as AuthenticateError;
        error.returnCode =5;
        console.log("   -  Not Authorized ");
        callback(error, false);
      }
    },
  });

  public listenMQTT() {
    this.broker.on("publish", (packet, client) => {
      if (client) {
        console.log(
          "   - %s : topic %s : %s",
          client.id,
          packet.topic,
          packet.payload
        );
      }
    });

    // MQTT server
    const MQTTserver = createServer(this.broker.handle);
    MQTTserver.listen(this.MQTTport, () => {
      console.log(` - MQTT on port ${this.MQTTport}`);
    });
  }

  public websocketsMQTT() {
    //WS server

    const serverWS: http.Server = http.createServer();
    const ws: Server = new Server(
      { server: serverWS, port: this.WSport },
      (): void => {
        console.log(` - Websoket MQTT on port ${this.WSport}`);
      }
    );

    ws.on("connection", (conn): void => {
      const stream = createWebSocketStream(conn);
      this.broker.handle(stream);
    });
  }
}

export default brokerMQTT;
