var ugs = require('ultimate-guitar-scraper')
var request = require('request')
var async = require('async')
var worker = require('work-ethic')
var fs = require('fs')
var cheerio = require('cheerio')


// this is mostly code for fetching data from UGS, the actual logic is in `./processTab.js`


module.exports = function (bandName, cb) {
  var dirName = bandName.replace(/\s/g, '_')
  fs.mkdirSync(dirName)
        // A-SINK-RONOUS PROGRAMMING!!!!!!!!!!!!!!!!!!!!!!!
        //                        ___
        //                      .' _ '.
        //                     / /` `\ \
        //                     | |   [__]
        //                     | |    {{
        //                     | |    }}
        //                  _  | |  _ {{
        //      ___________<_>_| |_<_>}}________
        //          .=======^=(___)=^={{====.
        //         / .----------------}}---. \
        //        / /                 {{    \ \
        //       / /                  }}     \ \
        //      (  '========================='  )
        // jgs   '-----------------------------'
  async.waterfall([
                    async.apply(search, bandName),
                    fetchTabs,
                    processTabs
                  ], cb)
}

function search (bandName, cb) {
  ugs.search({
    bandName: bandName,
    page: 1, // for a band with lotsa songs, this will only return the A's probably lol
    type: ['tabs'],
  }, function(error, tabs) {
    if (error) {
      cb(error);
    } else {
      cb(null, tabs);
    }
  })
}

function fetchTabs (tabs, cb) {
  var urls = tabs.map(function (tab) {return tab.url})
  var tabData = []
  worker(urls, function (url) {
    // called once every 5 seconds
    fetchTab(url, function (data) {
      tabData.push(data)
    })
  }, function () {
    // called once all the data has been fetched
    cb(null, tabData)
  }, 5000)
}

function fetchTab (url, cb) {
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      cb(body) // Show the HTML for the Google homepage.
    }
  })
}

function processTabs (tabs, cb) {
  // TODO
  tabs.forEach(function (tab) {

  })
  // cb(null, ???)
}

function processTab (tabData, cb) {
  var $ = cheerio.load(tabData)
  var tab = $('pre.js-tab-content').text()
  // TODO
}
