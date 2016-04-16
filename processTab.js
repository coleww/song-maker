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

var STRING_NOTES = ['e', 'a', 'd', 'g', 'b', 'e']
var ALL_NOTES = ['e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b', 'c', 'c#', 'd', 'd#']
ALL_NOTES = ALL_NOTES.concat(ALL_NOTES).concat(ALL_NOTES) // if yr guitar has more than 30 frets i dont want yr song anyways
function replaceNotes (section) {
  return section.reverse().map(function (line, i) {
    var root = STRING_NOTES[i]
    var rootIndex = ALL_NOTES.indexOf(root)
    var notes = line.replace(/[^\d-]/g, '').split('-')
    return notes.map(function (note) {
      return note.length ? ALL_NOTES[rootIndex + ~~note] : note
    })
  }).reverse()
}

module.exports = {
  getSections: getSections,
  replaceNotes: replaceNotes
}