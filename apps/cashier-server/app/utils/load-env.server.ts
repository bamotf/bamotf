import fs from 'fs'
import path from 'path'
import {config} from 'dotenv'

function find() {
  var dirs = process.cwd().split(path.sep)

  do {
    var current = dirs.join(path.sep)

    if (!current) {
      break
    }

    var env = path.join(current, '.env')

    if (fs.existsSync(env)) {
      return current
    }

    dirs.pop()
  } while (dirs.length)

  throw new Error('No .env file was found')
}

config({path: find() + '/.env'})
