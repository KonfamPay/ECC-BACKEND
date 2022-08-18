const express = require("express");
const app = express();
const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`The app is now listening on port ${4000}`));
