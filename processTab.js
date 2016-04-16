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
    var notes = line.replace(/[^\d-]/g, '').split('')
    return notes.map(function (note) {
      return note !== '-' ? root + ~~note : ''
    })
  }).reverse()
}

var midinote = require('midi-note')
var uniq = require('lodash.uniq')
var flatten = require('lodash.flatten')
var key = require('music-key')

function getKey (section) {
  var notes = section.map(function (row) {
    return row.filter(function (e) {return e}).map(function (note) {
      return midinote(note).replace(/\d+$/g, '')
    })
  })
  var accidentals = uniq(flatten(notes)).map(function (note) {
    return note.replace(/^\w/, '')
  }).filter(function (e) {return e})
  return key(accidentals.join(''))
}

// function convertNotesToIndices (notes, beats, key) {
//   // converts guitar strings worth of notes into indexes and stuff
// var divisor = notes[0].length / beats
//   return notes.map(function (row) {
//     return chunk(row, divisor).map(function (part) {
//       return part.filter(function (n) {return n.length}).map(function (note) {

//       })
//     })
//   })
// }


// function convertNotesToMidi (notes, divisor, key) {
//   // eh, wouldn't be toooooo hard to do this....
// }

module.exports = {
  getSections: getSections,
  replaceNotes: replaceNotes,
  getKey: getKey
  // convertNotesToIndices: convertNotesToIndices,
  // convertNotesToMidi: convertNotesToMidi
}


