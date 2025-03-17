import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client"
import cors from "cors"



const prisma = new PrismaClient()
const app = express()
app.use(express.json());
const port = 3000
const SECRET_KEY = "hT9XpzU2Z7yNdD9J7jR1bC5qW1J2sDklFPLV2hOx6pY="

app.use(cors())

app.post('/signup', async (req, res) => {
    const username = req.body['username']
    const email = req.body['email']
    const mobile = req.body['mobile']
    const password = req.body['password']
    const altNo = req.body['altNo']

    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        const user = await prisma.user.create({
            data: {
                username: username,
                mobile: mobile,
                email: email,
                password: hashedPassword,
                alt_mobile: altNo
            }
        })
        res.status(201).json({ message: "User added" })
    } catch (e) {
        console.log(e)
    }
})

app.post('/login', async (req, res) => {
    console.log(req.body)
    const username = req.body["username"]
    const password = req.body["password"]

    const user = await prisma.user.findUnique({ where: { username: username } })
    if (!user) {
        return res.status(401).json({ message: "User doesn't exists" })
    }
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        return res.status(401).json({ message: "Incorrect password" })
    }
    const token = jwt.sign({ userId: user.id, username: user.username, email: user.email }, SECRET_KEY, {
        expiresIn: "1h",
    });

    res.json({ message: "Login successful", token })
})

app.get('/profile', async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) {
        console.log(token)
        return res.status(401).json({ message: "Unauthorized", token })
    }
    try {
        const decoded = jwt.verify(token, SECRET_KEY)
        const user = await prisma.user.findUnique({ where: { username: decoded.username } })
        console.log(user)
        res.json(JSON.parse(JSON.stringify(user)))
    } catch (e) {
        console.log(e)
    }
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})