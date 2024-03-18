import Database from 'better-sqlite3'
export const db = Database('mydatabase.db')
console.log('Database Connected')
db.exec(
  'CREATE TABLE IF NOT EXISTS `room` ( `id` INTEGER PRIMARY KEY AUTOINCREMENT, `name` TEXT NOT NULL, `image` TEXT DEFAULT NULL)'
)
db.exec(
  "CREATE TABLE IF NOT EXISTS `device` ( `id` INTEGER PRIMARY KEY AUTOINCREMENT, `name` TEXT NOT NULL,`device_type` TEXT NOT NULL,`serial` INTEGER NOT NULL,`ip` TEXT NOT NULL,`state` INTEGER NOT NULL DEFAULT '0',`roomId` INTEGER NOT NULL,`command` TEXT DEFAULT NULL, FOREIGN KEY (roomId) REFERENCES room(id) ON DELETE CASCADE)"
)
db.exec(
  "CREATE TABLE IF NOT EXISTS `types` (  id INTEGER,  `type` TEXT,  `relay` INTEGER DEFAULT '0',  `dimmer` INTEGER DEFAULT '0',  PRIMARY KEY('id'));"
)
db.exec(
  "CREATE TABLE IF NOT EXISTS `temporal` ( `id` INTEGER PRIMARY KEY AUTOINCREMENT, `serial` INTEGER NOT NULL, `ip` TEXT DEFAULT NULL, `type` TEXT DEFAULT NULL, `state` INTEGER NOT NULL DEFAULT '0')"
)
db.exec(
  'CREATE TABLE IF NOT EXISTS `stove` ( `id` INTEGER PRIMARY KEY AUTOINCREMENT, `cooker` TEXT NOT NULL, `value` TEXT DEFAULT NULL)'
)

export const dbAddRoom = db.prepare('INSERT INTO `room`(`name`) VALUES(?)')
export const dbGetIdRoom = db.prepare('SELECT * FROM `room` WHERE id = ?')
export const dbGetRoomDevice = db.prepare(
  'SELECT `id`, `name`, `device_type`, `serial`, `state` FROM `device` WHERE roomId = ?'
)
export const dbAllRoom = db.prepare('SELECT * FROM `room`')
export const dbDeleteRoom = db.prepare('DELETE FROM `room` WHERE id = ?')
export const dbUpdateRoom = db.prepare(
  'UPDATE `room` SET `name` = ? WHERE id = ?'
)
export const dbAllTemporal = db.prepare('SELECT * FROM `temporal`')
export const dbAddTemporal = db.prepare(
  'INSERT INTO temporal( ip, type, state, serial, device_type) values(?,?,?,?,?)'
)
export const dbGetSerialTemporal = db.prepare(
  'SELECT * from `temporal` WHERE serial = ?'
)
export const dbGetIdTemporal = db.prepare(
  'SELECT * from `temporal` WHERE serial = ?'
)
export const dbDeleteTemporal = db.prepare(
  'DELETE FROM `temporal` WHERE id = ?'
)

export const dbAddDevice = db.prepare(
  'INSERT INTO `device`(`name`, `device_type`, `serial`, `ip`, `state`, `roomId`) VALUES(?,?,?,?,?,?)'
)
export const dbAllDevice = db.prepare('SELECT * FROM device')
export const dbDeleteDevice = db.prepare('DELETE FROM `device` WHERE id = ?')
export const dbUpdateDevice = db.prepare(
  'UPDATE `device` SET name = ?, roomId = ? WHERE id = ?'
)
export const dbActiveDevice = db.prepare(
  'SELECT * FROM `device` WHERE state = 1'
)
export const dbGetSerialDevice = db.prepare(
  'SELECT * FROM `device` WHERE serial = ?'
)
export const dbGetIdDevice = db.prepare('SELECT * FROM `device` WHERE id = ?')
export const dbUpdateSerialDevice = db.prepare(
  'UPDATE `device` SET state = ? WHERE serial = ?'
)
export const dbUpdateIdDevice = db.prepare(
  'UPDATE `device` SET state = ? WHERE id = ?'
)

export const dbStatusDevice = db.prepare(
  'UPDATE `device` SET status = ? WHERE serial = ?'
)
export const dbGetTypes = db.prepare('SELECT * FROM types WHERE type = ?')
process.on('exit', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message)
    } else {
      console.log('Closed the database connection')
    }
  })
})
