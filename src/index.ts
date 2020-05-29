import app from "./app"
import brokerMQTT from "./broker"

//Express server
app.listen(app.get("port"), () => {
  console.log(` - Server on port ${app.get("port")}`);
});

//MQTT server 
const broker = new brokerMQTT();
broker.listenMQTT();
broker.websocketsMQTT();
