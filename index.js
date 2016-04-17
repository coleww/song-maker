var fs = require('fs')
var cheerio = require('cheerio')
var processor = require('./processTab')

// <meta content="Tab (ver 4) by Black Sabbath" property="og:description">

// pre.js-tab-content


var the_first = fs.readdirSync('./tabs')[1]
console.log(the_first)
$ = cheerio.load(fs.readFileSync('./tabs/' + the_first).toString())

var tabData = $('pre.js-tab-content').text()
// var title = $('meta[property="og:description"]').attr('content')
// console.log(title)
fs.writeFileSync('./output/' + the_first, JSON.stringify(processor.processTab(tabData, 16)))