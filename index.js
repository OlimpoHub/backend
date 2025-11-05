const express = require('express');
const app = express();
const PORT = 8080;

const auth_routes = require("./routes/auth.routes");
const general_routes = require("./routes/general.routes");

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/auth", auth_routes);
app.use("/", general_routes);

app.listen(
    PORT,
    () => console.log(`alive on http://localhost:${PORT}`)
)