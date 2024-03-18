import {
  dbAddRoom,
  dbAllRoom,
  dbDeleteRoom,
  dbGetIdRoom,
  dbGetRoomDevice,
  dbUpdateRoom,
} from '../utils/dblite.js'
import { createError } from '../utils/error.js'
export const addRoom = async (req, res, next) => {
  try {
    const room = dbAddRoom.run(req.body.name)
    if (room.changes !== 0) {
      try {
        const newRoom = dbGetIdRoom.get(room.lastInsertRowid)
        return res.status(201).json({ ...newRoom, device: [] })
      } catch (error) {
        next(error)
      }
    }
  } catch (error) {
    next(error)
  }
}
export const getRoomById = async (req, res, next) => {
  try {
    const room = dbGetIdRoom.get(req.params.id)
    if (room) {
      try {
        const device = dbGetRoomDevice.all(room.id)
        return res.status(200).json({ ...room, device })
      } catch (error) {
        next(err)
      }
    } else {
      next(createError(404, 'Otag tapylmady'))
    }
  } catch (error) {
    next(error)
  }
}
export const getAllRooms = (req, res, next) => {
  const rooms = []
  try {
    const allRooms = dbAllRoom.all()
    allRooms.forEach((room) => {
      const device = dbGetRoomDevice.all(room.id)
      rooms.push({ ...room, device })
    })
    return res.status(200).json(rooms)
  } catch (error) {
    next(error)
  }
}
export const deleteRoom = (req, res, next) => {
  try {
    const room = dbDeleteRoom.run(req.params.id)
    if (room.changes !== 0)
      return res.status(200).json('otag ustunlikli posuldy')
    else next(createError(306, 'Otag pozulmady'))
  } catch (error) {
    next(error)
  }
}

export const updateRoom = async (req, res, next) => {
  try {
    const room = dbGetIdRoom.get(req.params.id)
    if (room) {
      const updateRoom = dbUpdateRoom.run(req.body.name, req.params.id)
      if (updateRoom.changes !== 0) {
        try {
          const newRoom = dbGetIdRoom.get(req.params.id)
          console.log(newRoom)
          return res.status(200).json(newRoom)
        } catch (error) {
          next(error)
        }
      }
    } else {
      return res.status(404).json('Otag tapylmady')
    }
  } catch (error) {
    next(error)
  }
}
