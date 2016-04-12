module.exports = function (tabData) {
  // gosh, this is probably gonna be a total mess, huh?
  tabData.split(/\n/)


  // find sections of 4 or 6 lines in a row filled with '-'
  // grab them lines, process them by the index in a row.
  // for stuff like 3b or 12, just pop till u hit a `-` on all rows.
  // if it breaks....whatever!
  // map over the data, replace numbers with notes (just assume eadgbe for now, try to detect later)
  //
}



// e|----------xxxx--------0----------xxxx--------0-----------|
// B|----------xxxx--3--3--0----------xxxx--------0-----------|
// G|----------xxxx--3--3--0----------xxxx--6--6--0-----------|
// D|--3--3--3-xxxx--3--3--0--6--6--6-xxxx--6--6--0-----------|
// A|--3--3--3-xxxx--1--1--0--6--6--6-xxxx--4--4--0-----------|
// E|--1--1--1-xxxx--------0--4--4--4-xxxx--------0-----------|