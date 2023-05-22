const {config} = require('dotenv')

// Find the nearst .env file
function find() {
  const fs = require('fs')
  const path = require('path')
  const cwd = process.cwd()
  const root = path.parse(cwd).root
  let dir = cwd
  while (dir !== root) {
    const envPath = path.join(dir, '.env')
    if (fs.existsSync(envPath)) {
      return envPath
    }
    dir = path.dirname(dir)
  }
  return ''
}

const path = find()

config({
  path,
})
