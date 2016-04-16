var ugs = require('ultimate-guitar-scraper')
var request = require('request')
var async = require('async')
var worker = require('work-ethic')
var fs = require('fs')


// this is mostly code for fetching data from UGS, the actual logic is in `./processTab.js`


module.exports = function (bandName, cb) {

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
                    function writeTabs (tabs) {
                      tabs.forEach(function (tab, i) {
                          fs.writeFileSync('./tabs/' + bandName + i, tab)
                      })
                    }
                  ], cb)
}

function search (bandName, cb) {
  console.log('searching')
  ugs.search({
    bandName: bandName,
    page: 1, // for a band with lotsa songs, this will only return the A's probably lol
    type: ['tabs'],
  }, function(error, tabs) {
    console.log('got it')
    if (error) {
      cb(error);
    } else {
      cb(null, tabs);
    }
  })
}

function fetchTabs (tabs, cb) {
  console.log('fetching')
  var urls = tabs.map(function (tab) {return tab.url})
  var tabData = []
  worker(urls, function (url) {
    // called once every 5 seconds
    fetchTab(url, function (data) {
      console.log('.')
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

