var proc = require('./processtab')
window.AudioContext = window.AudioContext || window.webkitAudioContext
var ac = new AudioContext()
var pie = require("pie-ano")
// var ui = require('web-audio-ui').generate
  var mainVolume = ac.createGain()
  mainVolume.connect(ac.destination)
  mainVolume.gain.setValueAtTime(0.5, ac.currentTime)
var synths = {
      snare: require("dj-snazzy-snare")(ac),
    kick: require("touch-down-dance")(ac),
    hat: require("really-hi-hat")(ac),
  bb: pie(ac),
  pp: pie(ac),
  sm: pie(ac)
}
require('scale-select').register('scale-select');

require('openmusic-slider').register('openmusic-slider');




Object.keys(synths).forEach(function(ik) {
      synths[ik].connect(mainVolume)
      // var the_nodes = synths[ik].nodes()

      // var container = document.createElement('div')
      // container.style.display = 'inline-block'
      // container.style.verticalAlign = 'top'
      // Object.keys(the_nodes).forEach(function (node) {
      //   var el = ui(the_nodes[node])
      //   container.appendChild(el)
      // })
      //   the_ui.appendChild(container)
    })
var seq = require("spiderbite")


var the_song = require('./demoSong')
var pick = require('pick-random')
var merge = require('merge')
var int2freq = require('int2freq')

var sq, the_ui

document.body.addEventListener('paste', function(e){

  if (sq) {
    sq.stop()
    the_ui.remove()
} else {
       document.getElementById('notes').remove()

    // document.body.appendChild(the_ui)
}

  var song = JSON.parse(JSON.stringify(the_song))







  var data = e.clipboardData.getData('text/plain');
  // try {

    var stuff = proc.processTab(data, 8)
    // chop up the stuffs somehow, divide among the instruments
    // just make a base "song" thing?
    console.log(stuff)
    if (stuff.length) {
      var ration = Math.ceil(stuff.length / 3)
// Object.keys(songs).forEach(function(sk) {
//     Object.keys(songs[sk].instruments).forEach(function(ik) {
//         song.instruments[i].play = function (arg) {
//           var configs = songs[sk].instruments[ik].config || {}
//           var multi = songs[sk].instruments[ik].multi || 1
//           var note = songs[sk].instruments[ik].melodic ? {freq: int2freq(arg, songs[sk].key) * multi} : {}

//           insts[ik].update(merge(note, configs), ac.currentTime)
//           insts[ik].start(ac.currentTime)
//         }
//     })
//   })


      Object.keys(song.instruments).forEach(function (i) {
        // console.log(i)
        if (song.instruments[i].melodic) {
          song.instruments[i].patterns.verse.notes = pick(stuff, {count: ration})
          var max = song.instruments[i].patterns.verse.notes.length
          song.instruments[i].patterns.verse.nexts = song.instruments[i].patterns.verse.notes.map(function (ehwhatever, eh) {
            return [~~(Math.random * max), eh, ~~(Math.random * max)]
          })
          song.instruments[i].patterns.verse.probs = song.instruments[i].patterns.verse.notes.map(function (pattern) {
            return pattern.map(function (step) {
              return step.length ? (Math.random() * 0.25) + 0.5 : 0
            })
          })
        }
        song.instruments[i].play = function (arg) {
          // console.log(i)
          // console.log(song.key)
          var configs = song.instruments[i].config || {}
          var multi = song.instruments[i].multi || 1
          var note = song.instruments[i].melodic ? {freq: int2freq(arg, song.key) * multi} : {}

          synths[i].update(merge(note, configs), ac.currentTime)
          synths[i].start(ac.currentTime)
        }
      })
      // console.log(song.instruments['pp'].patterns.verse)
















      the_ui = document.createElement('div')


      sq = seq(song)
console.log(sq)
var scaleSelect = document.createElement('scale-select')
the_ui.appendChild(scaleSelect)


scaleSelect.addEventListener('tonic', function(ev) {
  // do something
  var tonic = ev.detail.value // will be "C" or "D#" or what have you
  song.key.tonic = tonic + 3
  // sq.stop()
  sq.updateSong(song)
  // sq.start()
});
scaleSelect.addEventListener('scale', function(ev) {
  // do something, for example maybe:
  var scale = ev.detail.value // will be "major" or "pentMaj" or what have you
  song.key.scale = scale
  // sq.stop()
  console.log(sq)
  sq.updateSong(song)
  // sq.start()
});

var coolSlider = document.createElement('openmusic-slider');
coolSlider.min = 10
coolSlider.max = 640
console.log(coolSlider)
coolSlider.value = 320
the_ui.appendChild(coolSlider);

coolSlider.addEventListener('change', function (ev) {
  console.log(ev)
  console.log('whoa')
  song.bpm = ~~ev.target.value * 2
  sq.stop()
  sq.updateSong(song)
  sq.start()
})



document.body.appendChild(the_ui)










      sq.start()
    } else {
      console.log("NOTHING THERE?")
      // alert('could not find yo data')
    }



  // } catch (e) {
    // console.log(e)
    // alert('very sorry, something broke, not to worry, maybe another guitar or bass tab will work better?')
  // }
});