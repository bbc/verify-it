#! /usr/bin/env node

const spdxCopyleft = require('spdx-copyleft')
const licenseChecker = require('license-checker')
const licenses = new Set()

licenseChecker.init({
  start: '.'
}, (error, data) => {
  if (error) {
    console.log(error)
    process.exit(1)
  } else {
    const dependencyNames = Object.keys(data)
    dependencyNames.forEach((name) => licenses.add(data[name].licenses.trim()))

    const copyLeftDependencies = dependencyNames
      .filter((id) => spdxCopyleft.indexOf(data[id].licenses) > -1)
      .map((id) => `${id} - ${data[id].licenses}`)

    if (copyLeftDependencies.length > 0) {
      console.error('Copyleft dependencies found:')
      console.log('\t' + copyLeftDependencies.join('\t\n'))
      process.exitCode = 1
    } else {
      console.log('No copyleft dependencies found')
      console.log('Licenses in use:')
      console.log('\t' + [...licenses].sort().join('\n\t'))
    }
  }
})
