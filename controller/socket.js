import {
  dbAddTemporal,
  dbGetIdTemporal,
  dbGetSerialDevice,
  dbGetSerialTemporal,
  dbUpdateIdDevice,
  dbUpdateSerialDevice,
} from '../utils/dblite.js'

export const addTemporal = ({ serial, type }, callback) => {
  try {
    const device = dbGetSerialDevice.get(serial)
    if (!device) {
      try {
        const temporal = dbGetSerialTemporal.get(serial)
        if (!temporal) {
          try {
            const addedTemporal = dbAddTemporal.run(serial, ip, type, state)
            if (addedTemporal.changes !== 0) {
              try {
                const newTemporal = dbGetIdTemporal.get(
                  addedTemporal.lastInsertRowid
                )
                callback(null, newTemporal)
              } catch (error) {
                callback(error, null)
              }
            }
            callback(null)
          } catch (error) {
            callback(error, null)
          }
        }
      } catch (error) {
        callback(error, null)
      }
    }
  } catch (error) {
    return console.log(error)
  }
}

export const updateDeviceSerial = ({ serial, state }, callback) => {
  try {
    const updateDevice = dbUpdateSerialDevice.run(state, serial)
    if (updateDevice.changes !== 0) {
      const device = dbGetSerialDevice.get(serial)
      const { id, state } = device
      callback(null, { id, state })
    } else {
      console.log('first')
    }
  } catch (error) {
    console.log(error)
    callback(err, null)
  }
}

export const updateDeviceId = ({ id, state }, callback) => {
  try {
    const updateDevice = dbUpdateIdDevice.run(state, id)
    if (updateDevice !== 0) {
      const device = dbGetIdDevice.get(id)
      if (device) {
        const { id, serial, state } = device
        callback(null, { id, serial, state })
      }
    }
  } catch (error) {
    callback(err, null)
  }
}

// export const deviceOff = (ip) => {
//   try {
//     dbOffDevice.run(ip)
//   } catch (error) {
//     console.log(error)
//   }
// }
