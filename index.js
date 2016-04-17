var fs = require('fs')
var cheerio = require('cheerio')
var processor = require('./processTab')

// <meta content="Tab (ver 4) by Black Sabbath" property="og:description">

// pre.js-tab-content


fs.readdirSync('./tabs').forEach(function (the_first) {
  try {
    // console.log(the_first)
    $ = cheerio.load(fs.readFileSync('./tabs/' + the_first).toString())
    var tabData = $('pre.js-tab-content').text()
    fs.writeFileSync('./output/' + the_first, JSON.stringify(processor.processTab(tabData, 16)))
  } catch (e) {
    // console.log(e)
  }
})
