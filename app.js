const express = require("express");
const app = express();
const port = 3001;
app.set("port", port);

const memberRouter = require('./routes/memberController');
app.use('/member',memberRouter);

app.listen(port, () => console.log("Listening on", port));

module.exports = app;
