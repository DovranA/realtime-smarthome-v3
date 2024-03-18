import db from '../utils/db.js'

export const addTemporal = ({ serial, state }, ip) => {
  const types = ['akylly chyra', 'dugme', 'perde']
  db.query(
    'SELECT serial FROM `device` WHERE serial = ?',
    [serial],
    (err, device) => {
      if (err) {
        return console.log(err)
      }
      if (device.length === 0) {
        db.query(
          'SELECT serial from `temporal` WHERE serial = ?',
          [serial],
          (err, oldTemporal) => {
            console.log('old', oldTemporal)
            if (err) {
              return console.log(err)
            }
            if (oldTemporal.length === 0) {
              const a = serial % 100
              const type_num = (serial - a) / 100 - 1
              db.query(
                'INSERT INTO `temporal`(`serial`, `ip`, `type`, state) values(?,?,?,?)',
                [serial, ip, types[type_num], state],
                (err, newTemporal) => {
                  if (err) {
                    return console.log(err)
                  }
                  if (newTemporal) {
                    return console.log(newTemporal)
                  }
                }
              )
            }
          }
        )
      }
    }
  )
}

export const updateDeviceSerial = ({ serial, state }, callback) => {
  db.query(
    'UPDATE `device` SET state = ? WHERE serial = ?',
    [state, serial],
    (err, device) => {
      if (err) {
        console.log(err)
        callback(err, null)
      }
      if (device) {
        db.query(
          'SELECT id, state FROM `device` WHERE serial = ?',
          [serial],
          (err, updated) => {
            if (err) {
              console.log(err)
              callback(err, null)
            }
            if (updated.length) {
              const { id, state } = updated[0]
              callback(null, { id, state: state === 1 })
            }
          }
        )
      }
    }
  )
}

export const updateDeviceId = ({ id, state }, callback) => {
  db.query(
    'UPDATE `device` SET state = ? WHERE id = ?',
    [state, id],
    (err, device) => {
      if (err) {
        console.log('1', err)
      }
      if (device) {
        db.query(
          'SELECT id, state FROM `device` WHERE id = ?',
          [id],
          (err, updated) => {
            if (err) {
              callback(err, null)
            }
            if (updated) {
              callback(null, updated[0])
            }
          }
        )
      }
    }
  )
}

export const deviceOff = (ip) => {
  db.query('UPDATE `device` SET state = 0 WHERE ip = ?', [ip])
}
