import Server from 'socket.io'
import {} from '../controller/socket.js'
import {
  db,
  dbAddTemporal,
  dbGetSerialDevice,
  dbGetSerialTemporal,
  dbGetTypes,
  dbStatusDevice,
  dbUpdateIdDevice,
} from '../utils/dblite.js'
export const socket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  })
  io.on('connection', (socket) => {
    const ip = socket.handshake.address.replace('::ffff:', '')
    console.log('A user connected', ip)
    if (socket.handshake.query.type === 'device') {
      socket.on('error', (error) => {
        console.log(error)
      })
      socket.on('initialize', (data) => {
        const { type, serial } = data
        socket.serial = serial
        dbStatusDevice.run('ON', socket.serial)
        try {
          const devices = dbGetSerialDevice.all(serial)
          console.log(devices)
          if (devices.length) {
            io.sockets.emit('getId', { serial, devices })
          } else {
            const temporal = dbGetSerialTemporal.all(serial)
            console.log(temporal)
            if (temporal.length) {
            } else {
              const types = dbGetTypes.get(type)
              const addTemporal = (n, id, serial, type) => {
                for (let i = 0; i < n; i++) {
                  dbAddTemporal.run(ip, id, '0', serial, type)
                }
              }
              if (types.type === '2relay1dimmer') {
                console.log('test')
                addTemporal(types.relay, types.id, serial, 'relay')
                addTemporal(types.dimmer, types.id, serial, 'dimmer')
              }
              // if (types.type === 'stove') {
              //   console.log('test')
              // }
            }
          }
        } catch (error) {
          console.log(error)
        }

        // addTemporal(data, socket.handshake.address.replace('::ffff:', ''))
        // socket.serial = data.serial
        console.log(data)
      })

      socket.on('warning', (data) => {
        console.log(data)
        io.sockets.emit('warningMessage', data)
        if (data === 'water') {
          console.log('water stoper')
        }
      })
      socket.on('deviceSend', async (data) => {
        console.log('d', data)
        const { id, state } = data
        io.sockets.emit('userReceiver', data)
        try {
          const setState = dbUpdateIdDevice.run(state, id)
          if (setState.changes !== 0) {
            io.sockets.emit('userReceiver', data)
          }
        } catch (error) {
          console.log(error)
        }
      })
    }

    socket.on('blindUp', async (data) => {
      console.log('blindUp')
      io.sockets.emit('blind', { command: 'up' })
    })
    socket.on('blindDown', async (data) => {
      console.log('blindDown')

      io.sockets.emit('blind', { command: 'down' })
    })

    if (socket.handshake.query.type === 'user') {
      console.log('user')
      socket.on('stoveSend', (data) => {
        // console.log(data)
        io.sockets.emit('stove', data)
      })
      socket.on('userSend', async (data) => {
        const { state, id } = data
        try {
          const setState = dbUpdateIdDevice.run(state, id)
          if (setState.changes !== 0) {
            console.log(data)
            io.sockets.emit('deviceReceiver', data)
            io.sockets.emit('userReceiver', data)
          }
        } catch (error) {
          console.log(error)
        }
      })
    }
    socket.on('message', (data) => {
      console.log(data)
    })
    socket.on('disconnect', () => {
      console.log(
        'A user disconnected',
        socket.handshake.address.replace('::ffff:', '')
      )
      dbStatusDevice.run('OFF', socket.serial)
      //   if (socket.handshake.query.type === 'device') {
      //     updateDeviceSerial(
      //       { serial: socket.serial, state: 0 },
      //       (err, result) => {
      //         if (err) {
      //           console.error('Error:', err)
      //         } else {
      //           io.sockets.emit('userReceiver', result)
      //         }
      //       }
      //     )
      //   }
    })
  })
}
