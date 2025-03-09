import { server } from "./server.js";
import { connectDB } from "./config/database.js";

function main() {
  server();
  connectDB();
}
main();
