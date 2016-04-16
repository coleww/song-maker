module.exports = function (tabData) {
  // gosh, this is probably gonna be a total mess, huh?
  var lines = tabData.split(/\n/)
  var sections = []



  return sections

  // find sections of 4 or 6 lines in a row filled with '-'
  // grab them lines, process them by the index in a row.
  // for stuff like 3b or 12, just pop till u hit a `-` on all rows.
  // if it breaks....whatever!
  // map over the data, replace numbers with notes (just assume eadgbe for now, try to detect later)
  //
}


// e|----------
// B|----------
// G|----------
// D|--3--3--3-
// A|--3--3--3-
// E|--1--1--1-

var sickPowerChords = [
  ['', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', ''],
  ['', '', 'f', '', '', 'f', '', '', 'f', ''],
  ['', '', 'c', '', '', 'c', '', '', 'c', ''],
  ['', '', 'f', '', '', 'f', '', '', 'f', '']]