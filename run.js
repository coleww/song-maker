var bandName = 'pokemon'

var x = require('./fetcher')

x(bandName, function (tabs) {
  console.log('called vack!')
})