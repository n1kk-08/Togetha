import mongoose from "mongoose";

type ConnectionObject = {
    isConnected? : number
}

const connection: ConnectionObject = {};

async function dbConnect() : Promise<void> {
    if(connection.isConnected){
        console.log("Already connected to database")
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        })
        connection.isConnected = db.connections[0].readyState

        console.log("DB connected")
    } catch (error) {
        console.error("DB connection failed", error)
        throw error 
    }
}

export default dbConnect;
