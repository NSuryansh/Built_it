import express from "express"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
const app = express()
const port = 3000

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})