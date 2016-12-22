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
    var the_goods = processor.processTab(tabData, 16).filter(function (x) {
      // console.log(x)
      return x.every(function (cell) {
        return cell.length === 0 || cell.every(function (nut) {
          return nut !== undefined
        })
      })
      return typeof x[0][0] === 'number'
    })
    if (the_goods.length) fs.writeFileSync('./output/' + the_first, JSON.stringify(the_goods))
  } catch (e) {
    // console.log(e)
  }
})
