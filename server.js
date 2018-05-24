import mongoose from "mongoose"//Skapar en objekthanterare som kommunicerar med databasen, Node.
import express from "express" //Framework att skriva Node.js som hjälper till med att skapa "web application server framework". //Innehåller: router.
import bodyParser from "body-parser"
import cors from "cors"

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(cors())

mongoose.connect(process.env.MONGO_URL || "mongodb://localhost/activities", { useMongoClient: true })

mongoose.Promise = Promise

mongoose.connection.on("error", err => console.error("Connection error:", err))
mongoose.connection.once("open", () => console.log("Connected to mongodb"))

const Activities = mongoose.model("Activities", { //Här sätts mongoose objeketen. Heter "schema"
  activityName: String,
  content: String,
  admissionChildren: Boolean,
  admissionAdults: Boolean,
  mintemp: Number,
  maxtemp: Number,
  weathergroups: [{ type: String }],
  activityLink: String,
  location: String
})

app.get("/activities", (req, res) => {
  Activities.find().then(myActivity => {
  res.json(myActivity)
  })
})

app.post("/activities", (req, res) => {
  const createdActivities = new Activities(req.body)

  createdActivities.save()
    .then(() => { res.status(201).send("congratulation, you update the database ✅ ") })
    .catch(err => { res.status(400).send("ooops, err 🔧") })
})

app.listen(8080, () => {
    console.log("Products API listening on port 8080!")
  }
)
