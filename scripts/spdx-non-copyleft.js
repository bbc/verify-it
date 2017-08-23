#! /usr/bin/env node

const spdxCopyleft = require('spdx-copyleft')
const licenseChecker = require('license-checker')

licenseChecker.init({
  start: '.'
}, (error, data) => {
  if (error) {
    console.log(error)
    process.exit(1)
  } else {
    const copyLeftDependencies = Object.keys(data)
      .filter((id) => spdxCopyleft.indexOf(data[id].licenses) > -1)
      .map((id) => `${id} - ${data[id].licenses}`)

    if (copyLeftDependencies.length > 0) {
      console.error('Copyleft dependencies found:')
      console.log(copyLeftDependencies.join('\n'))
      process.exitCode = 1
    } else {
      console.log('No copyleft dependencies found')
    }
  }
})
