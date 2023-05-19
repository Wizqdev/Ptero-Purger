const express = require('express');
const app = require('./Src/Api/purger');
const settings = require('./settings.json');
const PORT = settings.web.port;



app.enable("trust proxy")
app.set('views',"./Src/View");
app.set('view engine','ejs');
app.use("/assets", express.static("./Src/Assets"))



app.get("/", (req, res) => {
    res.render("purge.ejs",{ settings: settings });
});
  













app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});