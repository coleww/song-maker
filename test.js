var tap = require('tap')
var processor = require('./processTab')
var fs =  require ('fs')
var tab = fs.readFileSync('./sampleTab.txt').toString()

console.log(processor(tab).length)