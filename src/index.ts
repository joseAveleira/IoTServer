import app from "./app";
import brokerMQTT from "./broker";
import chalk from "chalk";
import "./database";

//Express server
app.listen(app.get("port"), () => {
  console.log(` - Server on port: ${chalk.yellow(app.get("port"))}`);
});

//MQTT server
const broker = new brokerMQTT();
broker.listenMQTT();
broker.websocketsMQTT();
