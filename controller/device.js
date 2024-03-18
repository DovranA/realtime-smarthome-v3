import {
  dbActiveDevice,
  dbAddDevice,
  dbAllDevice,
  dbAllTemporal,
  dbDeleteDevice,
  dbDeleteTemporal,
  dbGetIdDevice,
  dbGetSerialDevice,
  dbUpdateDevice,
} from '../utils/dblite.js'
import { createError } from '../utils/error.js'
export const addDevice = async (req, res, next) => {
  const { id, name, device_type, serial, state, ip } = req.body
  // const firstDevice = dbGetSerialDevice.all(serial)
  // console.log(Number(req.params.id))
  // console.log(firstDevice[0].roomId)
  // console.log(firstDevice[0].roomId !== Number(req.params.id))
  // if (firstDevice[0].roomId !== Number(req.params.id)) {
  //   return res.status(400).json('bu enjam bilelikde bir otagda bolmaly')
  // }
  try {
    const device = dbAddDevice.run(
      name,
      device_type,
      serial,
      ip,
      state,
      req.params.id
    )
    if (device.changes !== 0) {
      try {
        dbDeleteTemporal.run(id)
        const newDevice = dbGetIdDevice.get(device.lastInsertRowid)
        const { roomId, ...dev } = newDevice
        return res.status(200).json(dev)
      } catch (error) {
        next(error)
      }
    }
  } catch (error) {
    next(error)
  }
}

export const newDevices = async (req, res, next) => {
  try {
    const temporal = dbAllTemporal.all()
    if (temporal.length) {
      return res.status(200).json(temporal)
    } else {
      return res.status(200).json([])
    }
  } catch (error) {
    next(error)
  }
}

export const allDevices = async (req, res, next) => {
  try {
    const device = dbAllDevice.all()
    if (device.length) {
      return res.status(200).json(device)
    } else {
      return res.status(404).json([])
    }
  } catch (error) {
    next(error)
  }
}

export const activeDevice = async (req, res, next) => {
  try {
    const active = dbActiveDevice.all()
    return res.status(200).json(active)
  } catch (error) {
    next(error)
  }
}

export const deleteDevice = async (req, res, next) => {
  try {
    const device = dbDeleteDevice.run(req.params.id)
    if (device.changes !== 0) {
      return res.status(200).json('Device Deleted')
    } else {
      next(createError(400, 'Device Not Deleted'))
    }
  } catch (error) {
    next(error)
  }
}

export const updateDevice = (req, res, next) => {
  const { name, id } = req.body
  try {
    const updatedDevice = dbUpdateDevice.run(name, req.params.id, id)
    if (updatedDevice.changes !== 0) {
      const device = dbGetIdDevice.get(updatedDevice.lastInsertRowid)
      return res.status(200).json(device)
    } else {
      next(createError(304, 'Device Not Updated'))
    }
  } catch (error) {
    next(error)
  }
}
