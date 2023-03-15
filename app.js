const express = require("express");
const app = express();
const port = 3001;
app.set("port", port);

const memberRouter = require('./routes/memberController');
app.use('/member',memberRouter);

const poptizenRouter = require('./routes/poptizenController');
app.use('/poptizen',poptizenRouter);

const shopRouter = require('./routes/shopController');
app.use('/shop',shopRouter);

app.listen(port, () => console.log("Listening on", port));

module.exports = app;
