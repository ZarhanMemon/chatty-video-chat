import express from 'express'
import authRoute from './routes/authRoutes.js'
import chatRoute from './routes/chatRoutes.js' // Import the message route
import userRoute from './routes/userRoutes.js' // Import the user route
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'  // deconstructing cookieParser from cookie-parser
import { connectDB } from './lib/db.js' // import the connectDB function
import cors from 'cors' // Import cors for Cross-Origin Resource Sharing
import path from "path"

dotenv.config()          // by using u can access env variables in the code

const app = express()
const PORT = process.env.PORT

const __dirname = path.resolve()


// Add middleware before routes
app.use(express.json({ limit: '10mb' }));// Middleware to parse JSON request bodies
app.use(cookieParser()) // Middleware to parse cookies from the request headers


app.use(
    cors({
    origin: 'http://localhost:5173', // Remove trailing slash
    credentials: true,
}))



// Routes come after middleware
app.use('/api/auth', authRoute)
app.use("/api/users",userRoute)
app.use('/api/chat', chatRoute)

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")))

    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend/dist/index.html"))
    })
}

 
app.listen(PORT, async() => {
    console.log(`Example app listening on port ${PORT}`)
    await connectDB() // Call the connectDB function to connect to MongoDB
})
