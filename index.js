const app = require('express')();
const PORT = 8080;

const general_routes = require("./routes/general.routes");

app.use("/", general_routes);

app.listen(
    PORT,
    () => console.log(`alive on http://localhost:${PORT}`)
)