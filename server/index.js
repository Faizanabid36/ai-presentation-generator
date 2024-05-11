const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv');

const mongooseConnection = require("./middleware/mongoose-connection.js");
const presentationRoutes = require("./routes/presentationRoutes.js");
const sectionRoutes = require("./routes/sectionRoutes.js")
const slideRoutes = require("./routes/slideRoutes.js")
const exportRoutes = require("./routes/exportRoutes.js")

dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors({credentials: true}));

app.use("/api/presentation", presentationRoutes)
app.use("/api/section", sectionRoutes)
app.use("/api/slide", slideRoutes)
app.use("/api/export", exportRoutes)

mongooseConnection();

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

