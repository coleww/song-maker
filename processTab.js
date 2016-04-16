function getSections (tabData) {
  // gosh, this is probably gonna be a total mess, huh?
  var lines = tabData.split(/\n/)
  var sections = []
  var current = []
  lines.forEach(function (line) {
    // this regex is...probably good enough
    if (line.match(/\w+-+\w+-+\w+-+/)) {
      current.push(line)
      if (current.length == 6) {
        sections.push(current)
        current = []
      }
    } else {
      if (current.length == 4) sections.push(current) // should catch bass tabs i guess?
      current = []
    }
  })
  return sections
}

var MIDI_NOTES = [40, 45, 50, 55, 59, 64] // maybe easier to keep this all in midi-note land?
function replaceNotes (section) {
  return JSON.parse(JSON.stringify(section)).reverse().map(function (line, i) {
    var root = MIDI_NOTES[i]
    var notes = line.replace(/[^\d-]/g, '').split('-')
    return notes.map(function (note) {
      return note.length ? root + ~~note : note
    })
  }).reverse()
}


function convertNotesToIndices (notes, divisor, key) {
  // converts guitar strings worth of notes into indexes and stuff
  return notes.map(function (row) {
    return splitUp(row, divisor).map(function (part) {
      return part.filter(function (n) {return n.length}).map(function (note) {

      })
    })
  })
}


function convertNotesToMidi (notes, divisor, key) {
  // eh, wouldn't be toooooo hard to do this....
}

module.exports = {
  getSections: getSections,
  replaceNotes: replaceNotes,
  convertNotesToIndices: convertNotesToIndices,
  convertNotesToMidi: convertNotesToMidi
}



// http://stackoverflow.com/a/8188682
function splitUp(arr, n) {
    var rest = arr.length % n, // how much to divide
        restUsed = rest, // to keep track of the division over the elements
        partLength = Math.floor(arr.length / n),
        result = [];

    for(var i = 0; i < arr.length; i += partLength) {
        var end = partLength + i,
            add = false;

        if(rest !== 0 && restUsed) { // should add one element for the division
            end++;
            restUsed--; // we've used one division element now
            add = true;
        }

        result.push(arr.slice(i, end)); // part of the array

        if(add) {
            i++; // also increment i in the case we added an extra element for division
        }
    }

    return result;
}