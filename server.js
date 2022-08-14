require("dotenv").config()
const { PORT = 3000, DATABASE_URL } = process.env
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cors = require("cors")
const morgan = require("morgan")



//database connection

mongoose.connect(DATABASE_URL)
mongoose.connection
    .on("open", () => console.log("you are connected to MongoDB"))
    .on("close", () => console.log("You are disconnected from MongoDB"))
    .on("error", (error) => console.log(error))

// carsForSell model

const CarsSchema = new mongoose.Schema({
    make: String,
    model: String,
    year: String,
    image: String,
    price: String,
    description: String,
})

const Cars = mongoose.model("Cars", CarsSchema)

//middleware
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())

//routes
    
app.get("/", (req, res) => {
    res.send("Sell Your Cars!!")
})
// index cars
app.get("/cars", async (req, res) => {
    try{
        res.json(await Cars.find({}))
    } catch (error) {
        res.status(400).json(error)
    }
  
})

//cars create
app.post("/cars", async (req, res) => {
    try {
        res.json(await Cars.create(req.body))
    } catch (error) {
        res.status(400).json(error)
    }
})

//cars delete
app.delete("/cars/:id", async (req, res) => {
    try{
        res.json(await Cars.findByIdAndDelete(req.params.id))
    }catch (error) {
        res.status(400).json(error)
    }
})

//cars update
app.put("/cars/:id", async (req, res) => {
    try {
        res.json(
            await Cars.findByIdAndUpdate(req.params.id, req.body, {new: true})
        )
    } catch (error) {
        res.status(400).json(error)
    }
})
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`))