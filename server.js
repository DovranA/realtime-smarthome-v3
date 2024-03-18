import express from 'express'
import http from 'http'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import path from 'path'
const app = express()
dotenv.config()
app.use(cors())
app.use(morgan('tiny'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
import deviceRouter from './routes/device.js'
import roomRouter from './routes/room.js'
import { socket } from './socket.io/socket.js'
import { dbAddTemporal, dbGetTypes } from './utils/dblite.js'
app.use('/api/device', deviceRouter)
app.use('/api/room', roomRouter)
// const fileUrl = new URL('./public/test.html', import.meta.url)
// app.use('/public', express.static(path.dirname('./public')))
// app.get('/', (req, res) => {
//   res.sendFile(fileUrl.pathname)
// })
// console.log(path.basename)
const server = http.createServer(app)
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500
  const errorMessage = err.message || 'Something went wrong!'
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    // stack: err.stack,
  })
})

socket(server)
server.listen(8000, '0.0.0.0', () => {
  console.log('server is ranning')
})
