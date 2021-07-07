const express = require('express')
const cors = require('cors')
const app = express()
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const tagRoute = require("./routes/tags")

dotenv.config();

const PORT = process.env.PORT || 5000

app.use(express.json());
app.use(cors())

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true
  })
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));


app.use("/api/posts", postRoute);
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/tags", tagRoute);




app.listen(PORT, () => {
  console.log('Started')

})