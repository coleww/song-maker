var midinote = require('midi-note')
var uniq = require('lodash.uniq')
var flatten = require('lodash.flatten')
var chunk = require('lodash.chunk')
var key = require('music-key')
var fill = require('lodash.fill')


function getSections (tabData) {
  // gosh, this is probably gonna be a total mess, huh?
  var lines = tabData.split(/\n/)
  var sections = []
  var current = []
  lines.forEach(function (line) {
    //
    // regex from: http://knowles.co.za/parsing-guitar-tab/
    var patt = /([A-Ga-g]{0,1}[#b]{0,1})[\|\]]([\-0-9\|\/\^\(\)\\hbpv]+)/;
    if (line.match(patt)) {
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

function getKey (section) {
  var notes = section.map(function (row) {
    return row.filter(function (e) {return e}).map(function (note) {
      return midinote(note).replace(/\d+$/g, '')
    })
  })
  var accidentals = uniq(flatten(notes)).map(function (note) {
    return note.replace(/^\w/, '')
  }).filter(function (e) {return e})
  // console.log(key(accidentals.join('')))
  return key(accidentals.join(''))
}

function getMiddle (section) {
  var allTheNotesAllLinedUp = uniq(flatten(section).filter(function (e) {return e})).sort()
  return allTheNotesAllLinedUp[~~(allTheNotesAllLinedUp.length / 2)]
}

function getRootNoteNumber (middle, target) {
  // console.log('getRoot', middle, target)
  if (midinote(middle).replace(/\d+/, '') == target) {
    return middle
  } else {
    var i = 1
    var theRoot
    while (i <= 12) {
      // console.log(midinote(middle + i), midinote(middle - i))
      if (midinote(middle + i).replace(/\d+/, '') == target) {
        theRoot = middle + i
        break;
      } else if (midinote(middle - i).replace(/\d+/, '') == target) {
        theRoot = middle - i
        break;
      } else {
        i++
        // console.log(i)
      }
    }
    return theRoot
  }
}
function convertNotesToIndices (notes, beats, rootNote) {
  // converts guitar strings worth of notes into indexes and stuff
  var divisor = ~~(notes[0].length / beats)
  var root = midinote(rootNote)
  // console.log(root)
  // ... maybe, get the scale?
  return notes.map(function (row) {
    return chunk(row, divisor).map(function (part) {
      return part.filter(function (n) {return n}).map(function (note) {

        var multiplier = note > rootNote ? 1 : -1
        var octaved = Math.abs(note - rootNote) >= 12 ? 7 : 1
        var diff = Math.abs(midinote(note).charCodeAt(0) - root.charCodeAt(0))
        if (typeof (diff * multiplier * octaved) !== 'number') console.log(multiplier, octaved, diff, note, root, midinote(note))
        return diff * multiplier * octaved
      })
    })
  }).reduce(function (result, row) {
    return result.map(function (section, i) {
      return section.concat(row[i])
    })
  }, fill(Array(beats), []))
}

function processTab (tab, beats) {
  // console.log(tab)
  // console.log(getSections(tab))
  var notes = getSections(tab).map(function (section) {
    // console.log(section)
    return replaceNotes(section)
  })
  // something borked here
  // console.log(notes)
  var allTheNotes = notes.reduce(function (a, b) {return a.concat(b)}, [])
  // console.log(root)
  var root = getRootNoteNumber(getMiddle(allTheNotes), getKey(allTheNotes).replace(/\s\w+/, ''))
  return notes.map(function (section) {
    return convertNotesToIndices(section, beats, root)
  })
}

module.exports = {
  getSections: getSections,
  replaceNotes: replaceNotes,
  getKey: getKey,
  getMiddle: getMiddle,
  getRootNoteNumber: getRootNoteNumber,
  convertNotesToIndices: convertNotesToIndices,
  processTab: processTab
  // convertNotesToMidi: convertNotesToMidi
}


