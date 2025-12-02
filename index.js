const express = require('express');
const app = express();
const PORT = 8080;
const path = require('path');
const cors = require('cors');

const user_routes = require("./routes/user.routes");
const general_routes = require("./routes/general.routes");
const upload_routes = require("./routes/upload.routes");

app.use((req, res, next) => {
    console.log(`[Petición Recibida] ${req.method} ${req.originalUrl}`);
    next();
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/user", user_routes);
app.use("/upload", upload_routes); 
app.use("/", general_routes);

app.listen(
    PORT,
    '0.0.0.0',
    () => console.log(`Servidor vivo en http://0.0.0.0:${PORT}`)
);