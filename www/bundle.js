(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
       var iframe = document.createElement('div')
       iframe.innerHTML = '<iframe width="100%" height="100%" class="super-center"  src="https://www.youtube.com/embed/O2ulyJuvU3Q?autoplay=1" frameborder="0" allowfullscreen></iframe>'

      document.body.appendChild(iframe)
}

  var song = JSON.parse(JSON.stringify(the_song))







  var data = e.clipboardData.getData('text/plain');
  try {







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




      // song.instruments.push({
      //   config: {},
      //   melodic: false,
      //   patterns: {
      //     verse: {
      //       probs: [
      //         [1, 0, 0, 0]
      //       ],
      //       currentVersion: 0,
      //       currentTick: 0,
      //       mod: 16,
      //       nexts: [[0]]
      //     }
      //   },
      //   play: function (arg) {
      //     var msg = new SpeechSynthesisUtterance('Hello World');
      //     window.speechSynthesis.speak(msg);
      //   }
      // })











      the_ui = document.createElement('div')
the_ui.id = 'main'
the_ui.className = "super-simple layover"

      sq = seq(song)
console.log(sq)
var msg = document.createElement('h4')
msg.textContent = 'ROCK ON, KEYBOARD CAT!'
the_ui.appendChild(msg)

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
coolSlider.min = 50
coolSlider.max = 300
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



  } catch (e) {
    console.log(e)
    alert('very sorry, something broke, not to worry, refresh the page and perhaps another guitar or bass tab will work better?')
  }
});
},{"./demoSong":2,"./processtab":44,"dj-snazzy-snare":4,"int2freq":5,"merge":16,"openmusic-slider":35,"pick-random":36,"pie-ano":37,"really-hi-hat":38,"scale-select":40,"spiderbite":42,"touch-down-dance":43}],2:[function(require,module,exports){
module.exports={
  instruments: {
        kick: {
      config: {
        freq: 100,
        endFreq: 30,
        attack: 0.000000000000000000001,
        decay: 0.01,
        sustain: 0.12,
        release: 0.13,
        peak: 0.795,
        mid: 0.565,
        end: 0.000000000000000000001
      },
      patterns: {
        verse: {
          probs: [
            [1, 0, 1, 0],
            [1, 0.5, 1, 0],
            [1, 0, 0, 0],

            [1, 1, 0, 1],
            [1, 0.5, 0, 0.975],
            [1, 0.95, 0.1, 1],
            [1, 0.125, 0.01, 0.025],
            [0, 0.015, 0.725, 0.75],
            [1, 0.015, 0.51, 0.01]
          ],
          currentVersion: 0,
          currentTick: 0,
          mod: 2,
          nexts: [[0, 1,4,6], [1, 5, 0, 2], [2, 7, 0],[0, 1, 6, 3], [1, 7, 5, 2], [4, 4, 0],[5,6,7], [2,4,8], [1,3,8]]
        }
      }
    },
    hat: {
      config: {
        peak: 0.971,
        mid: 0.85
      },
      patterns: {
        verse: {
          probs: [
            [0, 0.95, 0, 0.95],
            [0.151, 0.95, 0.151, 0.975],
            [0, 1, 0.25, 0.95],
            [0.31, 0.9725, 0.31, 0.9725],
            [0.9, 0.275, 0.9025, 0.275],
            [0.92, 0.98, 0.12, 0.18],
            [0.31, 0.25, 0.931, 0.925],
            [0, 0.95, 0.925, 0.75],
            [0.931, 0.5, 0.31, 0.931]
          ],
          currentVersion: 0,
          currentTick: 0,
          mod: 1,
          nexts: [[0, 1,2,4,6],  [1, 7, 5, 2], [1, 5, 0, 2], [2, 7,3,1, 0],[0, 1, 6, 3], [2,4,8,5], [4, 4, 0],[5,6,7],[1,3,8]]
        }
      }
    },
    snare: {
      config: {
        freq: 200, // for the triangle oscillator
        noiseattack: 0.000001,
        noisedecay: 0.000001,
        noisesustain: 0.175,
        noiserelease: 0.125,
        noisepeak: 0.12123425,
        noisemid: 0.071341215,
        noiseend: 0.000001,
        triattack: 0.0000001,
        tridecay: 0.00000001,
        trisustain: 0.1175,
        trirelease: 0.125,
        tripeak: 0.1232487,
        trimid: 0.1121375,
        triend: 0.000001
      },
      patterns: {
        verse: {
          probs: [
            [0, 0, 0.975, 0.125],
            [0, 0, 1, 0],
            [0, 0.1, 0.97, 0.1],
            [1, 0.725, 0.21, 0.0125],
            [0, 0.05, 0.9725, 0.075],
            [0.1, 0.75, 0.41, 0.01],
            [0.025, 0.01, 1, 0.025],
            [0, 0.05, 0.9725, 0.75],
            [0, 0.75, 1, 0]
          ],
          currentVersion: 0,
          currentTick: 0,
          mod: 2,
          nexts: [[0, 1,2,4,6],  [1, 7, 5, 2], [2,4,8,5], [0, 1, 6, 3],[5,6,7],[4, 4, 0], [1, 5, 0, 2], [2, 7,3,1, 0],[1,3,8]]

        }
      }
    },
    pp: {
      config: {
        attack: 0.1513,
        decay: 0.1,
        sustain: 0.1513,
        release: 0.125,
        peak: 0.652345,
        mid: 0.423,
        end: 0.0051},
      lead: true,
      melodic: true,
      multi: 1,
      patterns: {
        verse: {
          notes: [],
          probs: [],
          currentVersion: 0,
          currentTick: 0,
          mod: 2,
          nexts: []
        }
      }
    },
    bb: {
      config: {
        attack: 0.0613,
        decay: 0.1,
        sustain: 0.051513,
        release: 0.05135,
        peak: 0.211345,
        mid: 0.109123,
        end: 0.000051},
      melodic: true,
      multi: 2,
      patterns: {
        verse: {
          notes: [],
          probs: [],
          currentVersion: 0,
          currentTick: 0,
          mod: 1,
          nexts: []
        }
      }
    },
    sm: {
      config: {
        attack: 0.3,
        decay: 0.31,
        sustain: 0.213,
        release: 0.215,
        peak: 0.12345,
        mid: 0.0511123,
        end: 0.00000051},
      multi: 2,
      melodic: true,
      patterns: {
        verse: {
          notes: [],
          probs: [],
          currentVersion: 0,
          currentTick: 0,
          mod: 4,
          nexts: []
        }
      }
    }

  },
  current: "verse",
  nexts: {
    verse: ["verse"]
  },
  bpm: 175,
  key: {
    tonic: "D3",
    scale: "major"
  }
}
},{}],3:[function(require,module,exports){
module.exports = function (gainNode, when, adsr) {
  gainNode.gain.exponentialRampToValueAtTime(adsr.peak, when + adsr.attack)
  gainNode.gain.exponentialRampToValueAtTime(adsr.mid, when + adsr.attack + adsr.decay)
  gainNode.gain.setValueAtTime(adsr.mid, when + adsr.sustain + adsr.attack + adsr.decay)
  gainNode.gain.exponentialRampToValueAtTime(adsr.end, when + adsr.sustain + adsr.attack + adsr.decay + adsr.release)
}

},{}],4:[function(require,module,exports){
var makeDistortionCurve = require('make-distortion-curve')
var adsr = require('a-d-s-r')
// yr function should accept an audioContext, and optional params/opts
module.exports = function (ac, opts) {
  // make some audioNodes, connect them, store them on the object
  var audioNodes = {
    noiseBuffer: ac.createBuffer(1, ac.sampleRate, ac.sampleRate),
    noiseFilter: ac.createBiquadFilter(),
    noiseEnvelope: ac.createGain(),
    osc: ac.createOscillator(),
    oscdistortion: ac.createWaveShaper(),
    oscEnvelope: ac.createGain(),
    compressor: ac.createDynamicsCompressor(),
    distortion: ac.createWaveShaper(),
    mainFilter: ac.createBiquadFilter(),
    highFilter: ac.createBiquadFilter(),
    volume: ac.createGain(),
    settings: {
      freq: 200,
      noiseattack: 0.000001,
      noisedecay: 0.000001,
      noisesustain: 0.1175,
      noiserelease: 0.125,
      noisepeak: 0.425,
      noisemid: 0.41215,
      noiseend: 0.000001,
      triattack: 0.0000001,
      tridecay: 0.00000001,
      trisustain: 0.1175,
      trirelease: 0.125,
      tripeak: 0.87,
      trimid: 0.75,
      triend: 0.000001
    }
  }
// set all the things
  var output = audioNodes.noiseBuffer.getChannelData(0)
  for (var i = 0; i < ac.sampleRate; i++) {
    output[i] = Math.random() * 2 - 1
  }

  audioNodes.noiseFilter.type = 'highpass'
  audioNodes.noiseFilter.frequency.setValueAtTime(1000, ac.currentTime)

  audioNodes.noiseEnvelope.gain.setValueAtTime(0.00001, ac.currentTime)

  audioNodes.osc.type = 'triangle'
  audioNodes.oscdistortion.curve = makeDistortionCurve(1000)
  audioNodes.oscdistortion.oversample = '4x'

  audioNodes.oscEnvelope.gain.setValueAtTime(0.00001, ac.currentTime)

  audioNodes.compressor.threshold.value = -15
  audioNodes.compressor.knee.value = 33
  audioNodes.compressor.ratio.value = 5
  audioNodes.compressor.reduction.value = -10
  audioNodes.compressor.attack.value = 0.005
  audioNodes.compressor.release.value = 0.150

  audioNodes.distortion.curve = makeDistortionCurve(222)
  audioNodes.distortion.oversample = '2x'

  audioNodes.mainFilter.type = 'peaking'
  audioNodes.mainFilter.frequency.value = 250
  audioNodes.mainFilter.gain.value = 1.5
  audioNodes.mainFilter.Q.value = 25

  audioNodes.highFilter.type = 'peaking'
  audioNodes.highFilter.frequency.value = 9000
  audioNodes.highFilter.Q.value = 25
// connect the graph
  audioNodes.noiseFilter.connect(audioNodes.noiseEnvelope)
  audioNodes.osc.connect(audioNodes.oscdistortion)
  audioNodes.oscdistortion.connect(audioNodes.oscEnvelope)
  audioNodes.noiseEnvelope.connect(audioNodes.compressor)
  audioNodes.oscEnvelope.connect(audioNodes.compressor)
  audioNodes.compressor.connect(audioNodes.distortion)
  audioNodes.distortion.connect(audioNodes.mainFilter)
  audioNodes.mainFilter.connect(audioNodes.highFilter)
  audioNodes.highFilter.connect(audioNodes.volume)
// start it up
  audioNodes.volume.gain.setValueAtTime(0.5, ac.currentTime)
  audioNodes.osc.start(ac.currentTime)
// READY 2 return THIS THING B) *NICE*
  return {
    connect: function (input) {
      audioNodes.volume.connect(input)
    },
    start: function (when) {
      var noise = ac.createBufferSource()
      noise.buffer = audioNodes.noiseBuffer
      noise.connect(audioNodes.noiseFilter)
      noise.start(when)
      adsr(audioNodes.noiseEnvelope, when, makeADSR('noise', audioNodes.settings))
      adsr(audioNodes.oscEnvelope, when, makeADSR('tri', audioNodes.settings))
      audioNodes.osc.frequency.setValueAtTime(audioNodes.settings.freq, when)
    },
    stop: function (when) {
      audioNodes.osc.stop(when)
    },
    update: function (opts) {
      Object.keys(opts).forEach(function (k) {
        audioNodes.settings[k] = opts[k]
      })
    },
    nodes: function () {
      return audioNodes
    }
  }
}

function makeADSR (type, settings) {
  return Object.keys(settings).filter(function (k) {
    return !!k.match(type)
  }).map(function (k) {
    return k.replace(type, '')
  }).reduce(function (o, k) {
    o[k] = settings[type + k]
    return o
  }, {})
}

},{"a-d-s-r":3,"make-distortion-curve":15}],5:[function(require,module,exports){
var scales = {
  major: [2, 2, 1, 2, 2, 2, 1],
  minor: [2, 1, 2, 2, 1, 2, 2],
  pentMaj: [2, 2, 3, 2, 3],
  pentMin: [3, 2, 2, 3, 2],
  blues: [3, 2, 1, 1, 3, 2]
}

var str2freq = {
  'A0': 27.5000, 'A#0': 29.1352, 'B0': 30.8677, 'C1': 32.7032, 'C#1': 34.6478,
  'D1': 36.7081, 'D#1': 38.8909, 'E1': 41.2034, 'F1': 43.6535, 'F#1': 46.2493,
  'G1': 48.9994, 'G#1': 51.9131, 'A1': 55.0000, 'A#1': 58.2705, 'B1': 61.7354,
  'C2': 65.4064, 'C#2': 69.2957, 'D2': 73.4162, 'D#2': 77.7817, 'E2': 82.4069,
  'F2': 87.3071, 'F#2': 92.4986, 'G2': 97.9989, 'G#2': 103.826, 'A2': 110.000,
  'A#2': 116.541, 'B2': 123.471, 'C3': 130.813, 'C#3': 138.591, 'D3': 146.832,
  'D#3': 155.563, 'E3': 164.814, 'F3': 174.614, 'F#3': 184.997, 'G3': 195.998,
  'G#3': 207.652, 'A3': 220.000, 'A#3': 233.082, 'B3': 246.942, 'C4': 261.626,
  'C#4': 277.183, 'D4': 293.665, 'D#4': 311.127, 'E4': 329.628, 'F4': 349.228,
  'F#4': 369.994, 'G4': 391.995, 'G#4': 415.305, 'A4': 440.000, 'A#4': 466.164,
  'B4': 493.883, 'C5': 523.251, 'C#5': 554.365, 'D5': 587.330, 'D#5': 622.254,
  'E5': 659.255, 'F5': 698.456, 'F#5': 739.989, 'G5': 783.991, 'G#5': 830.609,
  'A5': 880.000, 'A#5': 932.328, 'B5': 987.767, 'C6': 1046.50, 'C#6': 1108.73,
  'D6': 1174.66, 'D#6': 1244.51, 'E6': 1318.51, 'F6': 1396.91, 'F#6': 1479.98,
  'G6': 1567.98, 'G#6': 1661.22, 'A6': 1760.00, 'A#6': 1864.66, 'B6': 1975.53,
  'C7': 2093.00, 'C#7': 2217.46, 'D7': 2349.32, 'D#7': 2489.02, 'E7': 2637.02,
  'F7': 2793.83, 'F#7': 2959.96, 'G7': 3135.96, 'G#7': 3322.44, 'A7': 3520.00,
  'A#7': 3729.31, 'B7': 3951.07, 'C8': 4186.01
}

var notes = Object.keys(str2freq)

function int2freq(intNote, options){
  var index, scale;
  if((index = notes.indexOf(options.tonic)) === -1) throw 'what is up with that tonic?'
  if(!(scale = scales[options.scale])) throw 'what is up with that scale?'
  while (Math.abs(intNote) > scale.length) scale = scale.concat(scale)
  if(intNote >= 0) for (var i = 0; i < intNote; index += scale[i], i+= 1 ){}
  else for (var j = -1; j >= intNote; index -= scale[scale.length + j], j-= 1){}
  return str2freq[notes[index]]
}

module.exports = int2freq
module.exports.scales = Object.keys(scales)
module.exports.notes = Object.keys(notes)
},{}],6:[function(require,module,exports){
/**
 * lodash 4.2.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]';

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = isFlattenable);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a
 * [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792) that affects
 * Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable(value) {
  return isArrayLikeObject(value) && (isArray(value) || isArguments(value));
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 incorrectly makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @type {Function}
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 *  else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(getLength(value)) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 *  else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8 which returns 'object' for typed array and weak map constructors,
  // and PhantomJS 1.9 which returns 'function' for `NodeList` instances.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length,
 *  else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/6.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

module.exports = baseFlatten;

},{}],7:[function(require,module,exports){
/**
 * lodash 4.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

module.exports = baseSlice;

},{}],8:[function(require,module,exports){
/**
 * lodash 4.5.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var SetCache = require('lodash._setcache'),
    createSet = require('lodash._createset');

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes(array, value) {
  return !!array.length && baseIndexOf(array, value, 0) > -1;
}

/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludesWith(array, value, comparator) {
  var index = -1,
      length = array.length;

  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }
  return false;
}

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  if (value !== value) {
    return indexOfNaN(array, fromIndex);
  }
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

/**
 * Gets the index at which the first occurrence of `NaN` is found in `array`.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched `NaN`, else `-1`.
 */
function indexOfNaN(array, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 0 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    var other = array[index];
    if (other !== other) {
      return index;
    }
  }
  return -1;
}

/**
 * Converts `set` to an array.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the converted array.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

/**
 * Checks if `value` is in `cache`.
 *
 * @private
 * @param {Object} cache The set cache to search.
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function cacheHas(cache, value) {
  var map = cache.__data__;
  if (isKeyable(value)) {
    var data = map.__data__,
        hash = typeof value == 'string' ? data.string : data.hash;

    return hash[value] === HASH_UNDEFINED;
  }
  return map.has(value);
}

/**
 * The base implementation of `_.uniqBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 */
function baseUniq(array, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      length = array.length,
      isCommon = true,
      result = [],
      seen = result;

  if (comparator) {
    isCommon = false;
    includes = arrayIncludesWith;
  }
  else if (length >= LARGE_ARRAY_SIZE) {
    var set = iteratee ? null : createSet(array);
    if (set) {
      return setToArray(set);
    }
    isCommon = false;
    includes = cacheHas;
    seen = new SetCache;
  }
  else {
    seen = iteratee ? [] : result;
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    if (isCommon && computed === computed) {
      var seenIndex = seen.length;
      while (seenIndex--) {
        if (seen[seenIndex] === computed) {
          continue outer;
        }
      }
      if (iteratee) {
        seen.push(computed);
      }
      result.push(value);
    }
    else if (!includes(seen, computed, comparator)) {
      if (seen !== result) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return type == 'number' || type == 'boolean' ||
    (type == 'string' && value != '__proto__') || value == null;
}

module.exports = baseUniq;

},{"lodash._createset":9,"lodash._setcache":10}],9:[function(require,module,exports){
(function (global){
/**
 * lodash 4.0.2 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/6.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to determine if values are of the language type `Object`. */
var objectTypes = {
  'function': true,
  'object': true
};

/** Detect free variable `exports`. */
var freeExports = (objectTypes[typeof exports] && exports && !exports.nodeType)
  ? exports
  : undefined;

/** Detect free variable `module`. */
var freeModule = (objectTypes[typeof module] && module && !module.nodeType)
  ? module
  : undefined;

/** Detect free variable `global` from Node.js. */
var freeGlobal = checkGlobal(freeExports && freeModule && typeof global == 'object' && global);

/** Detect free variable `self`. */
var freeSelf = checkGlobal(objectTypes[typeof self] && self);

/** Detect free variable `window`. */
var freeWindow = checkGlobal(objectTypes[typeof window] && window);

/** Detect `this` as the global object. */
var thisGlobal = checkGlobal(objectTypes[typeof this] && this);

/**
 * Used as a reference to the global object.
 *
 * The `this` value is used if it's the global object to avoid Greasemonkey's
 * restricted `window` object, otherwise the `window` object is used.
 */
var root = freeGlobal ||
  ((freeWindow !== (thisGlobal && thisGlobal.window)) && freeWindow) ||
    freeSelf || thisGlobal || Function('return this')();

/**
 * Checks if `value` is a global object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {null|Object} Returns `value` if it's a global object, else `null`.
 */
function checkGlobal(value) {
  return (value && value.Object === Object) ? value : null;
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = Function.prototype.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

/**
 * Creates a set of `values`.
 *
 * @private
 * @param {Array} values The values to add to the set.
 * @returns {Object} Returns the new set.
 */
var createSet = !(Set && new Set([1, 2]).size === 2) ? noop : function(values) {
  return new Set(values);
};

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = object[key];
  return isNative(value) ? value : undefined;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 *  else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8 which returns 'object' for typed array and weak map constructors,
  // and PhantomJS 1.9 which returns 'function' for `NodeList` instances.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/6.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is a native function.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 * @example
 *
 * _.isNative(Array.prototype.push);
 * // => true
 *
 * _.isNative(_);
 * // => false
 */
function isNative(value) {
  if (!isObject(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * A no-operation function that returns `undefined` regardless of the
 * arguments it receives.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * var object = { 'user': 'fred' };
 *
 * _.noop(object) === undefined;
 * // => true
 */
function noop() {
  // No operation performed.
}

module.exports = createSet;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],10:[function(require,module,exports){
(function (global){
/**
 * lodash 4.1.3 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/6.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to determine if values are of the language type `Object`. */
var objectTypes = {
  'function': true,
  'object': true
};

/** Detect free variable `exports`. */
var freeExports = (objectTypes[typeof exports] && exports && !exports.nodeType)
  ? exports
  : undefined;

/** Detect free variable `module`. */
var freeModule = (objectTypes[typeof module] && module && !module.nodeType)
  ? module
  : undefined;

/** Detect free variable `global` from Node.js. */
var freeGlobal = checkGlobal(freeExports && freeModule && typeof global == 'object' && global);

/** Detect free variable `self`. */
var freeSelf = checkGlobal(objectTypes[typeof self] && self);

/** Detect free variable `window`. */
var freeWindow = checkGlobal(objectTypes[typeof window] && window);

/** Detect `this` as the global object. */
var thisGlobal = checkGlobal(objectTypes[typeof this] && this);

/**
 * Used as a reference to the global object.
 *
 * The `this` value is used if it's the global object to avoid Greasemonkey's
 * restricted `window` object, otherwise the `window` object is used.
 */
var root = freeGlobal ||
  ((freeWindow !== (thisGlobal && thisGlobal.window)) && freeWindow) ||
    freeSelf || thisGlobal || Function('return this')();

/**
 * Checks if `value` is a global object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {null|Object} Returns `value` if it's a global object, else `null`.
 */
function checkGlobal(value) {
  return (value && value.Object === Object) ? value : null;
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = Function.prototype.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var splice = arrayProto.splice;

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map'),
    nativeCreate = getNative(Object, 'create');

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @returns {Object} Returns the new hash object.
 */
function Hash() {}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(hash, key) {
  return hashHas(hash, key) && delete hash[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @param {Object} hash The hash to query.
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(hash, key) {
  if (nativeCreate) {
    var result = hash[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(hash, key) ? hash[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @param {Object} hash The hash to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(hash, key) {
  return nativeCreate ? hash[key] !== undefined : hasOwnProperty.call(hash, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 */
function hashSet(hash, key, value) {
  hash[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
}

// Avoid inheriting from `Object.prototype` when possible.
Hash.prototype = nativeCreate ? nativeCreate(null) : objectProto;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function MapCache(values) {
  var index = -1,
      length = values ? values.length : 0;

  this.clear();
  while (++index < length) {
    var entry = values[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': Map ? new Map : [],
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapDelete(key) {
  var data = this.__data__;
  if (isKeyable(key)) {
    return hashDelete(typeof key == 'string' ? data.string : data.hash, key);
  }
  return Map ? data.map['delete'](key) : assocDelete(data.map, key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapGet(key) {
  var data = this.__data__;
  if (isKeyable(key)) {
    return hashGet(typeof key == 'string' ? data.string : data.hash, key);
  }
  return Map ? data.map.get(key) : assocGet(data.map, key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapHas(key) {
  var data = this.__data__;
  if (isKeyable(key)) {
    return hashHas(typeof key == 'string' ? data.string : data.hash, key);
  }
  return Map ? data.map.has(key) : assocHas(data.map, key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapSet(key, value) {
  var data = this.__data__;
  if (isKeyable(key)) {
    hashSet(typeof key == 'string' ? data.string : data.hash, key, value);
  } else if (Map) {
    data.map.set(key, value);
  } else {
    assocSet(data.map, key, value);
  }
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapClear;
MapCache.prototype['delete'] = mapDelete;
MapCache.prototype.get = mapGet;
MapCache.prototype.has = mapHas;
MapCache.prototype.set = mapSet;

/**
 *
 * Creates a set cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values ? values.length : 0;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.push(values[index]);
  }
}

/**
 * Adds `value` to the set cache.
 *
 * @private
 * @name push
 * @memberOf SetCache
 * @param {*} value The value to cache.
 */
function cachePush(value) {
  var map = this.__data__;
  if (isKeyable(value)) {
    var data = map.__data__,
        hash = typeof value == 'string' ? data.string : data.hash;

    hash[value] = HASH_UNDEFINED;
  }
  else {
    map.set(value, HASH_UNDEFINED);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.push = cachePush;

/**
 * Removes `key` and its value from the associative array.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function assocDelete(array, key) {
  var index = assocIndexOf(array, key);
  if (index < 0) {
    return false;
  }
  var lastIndex = array.length - 1;
  if (index == lastIndex) {
    array.pop();
  } else {
    splice.call(array, index, 1);
  }
  return true;
}

/**
 * Gets the associative array value for `key`.
 *
 * @private
 * @param {Array} array The array to query.
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function assocGet(array, key) {
  var index = assocIndexOf(array, key);
  return index < 0 ? undefined : array[index][1];
}

/**
 * Checks if an associative array value for `key` exists.
 *
 * @private
 * @param {Array} array The array to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function assocHas(array, key) {
  return assocIndexOf(array, key) > -1;
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * Sets the associative array `key` to `value`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 */
function assocSet(array, key, value) {
  var index = assocIndexOf(array, key);
  if (index < 0) {
    array.push([key, value]);
  } else {
    array[index][1] = value;
  }
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = object[key];
  return isNative(value) ? value : undefined;
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return type == 'number' || type == 'boolean' ||
    (type == 'string' && value != '__proto__') || value == null;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'user': 'fred' };
 * var other = { 'user': 'fred' };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 *  else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8 which returns 'object' for typed array and weak map constructors,
  // and PhantomJS 1.9 which returns 'function' for `NodeList` instances.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/6.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is a native function.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 * @example
 *
 * _.isNative(Array.prototype.push);
 * // => true
 *
 * _.isNative(_);
 * // => false
 */
function isNative(value) {
  if (!isObject(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

module.exports = SetCache;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],11:[function(require,module,exports){
/**
 * lodash 4.0.5 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
var baseSlice = require('lodash._baseslice');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_SAFE_INTEGER = 9007199254740991,
    MAX_INTEGER = 1.7976931348623157e+308,
    NAN = 0 / 0;

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return value > -1 && value % 1 == 0 && value < length;
}

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeCeil = Math.ceil,
    nativeMax = Math.max;

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a
 * [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792) that affects
 * Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}

/**
 * Creates an array of elements split into groups the length of `size`.
 * If `array` can't be split evenly, the final chunk will be the remaining
 * elements.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to process.
 * @param {number} [size=1] The length of each chunk
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the new array containing chunks.
 * @example
 *
 * _.chunk(['a', 'b', 'c', 'd'], 2);
 * // => [['a', 'b'], ['c', 'd']]
 *
 * _.chunk(['a', 'b', 'c', 'd'], 3);
 * // => [['a', 'b', 'c'], ['d']]
 */
function chunk(array, size, guard) {
  if ((guard ? isIterateeCall(array, size, guard) : size === undefined)) {
    size = 1;
  } else {
    size = nativeMax(toInteger(size), 0);
  }
  var length = array ? array.length : 0;
  if (!length || size < 1) {
    return [];
  }
  var index = 0,
      resIndex = 0,
      result = Array(nativeCeil(length / size));

  while (index < length) {
    result[resIndex++] = baseSlice(array, index, (index += size));
  }
  return result;
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'user': 'fred' };
 * var other = { 'user': 'fred' };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(getLength(value)) && !isFunction(value);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 *  else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8 which returns 'object' for typed array and weak map constructors,
  // and PhantomJS 1.9 which returns 'function' for `NodeList` instances.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length,
 *  else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/6.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 *  else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to an integer.
 *
 * **Note:** This function is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/6.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3');
 * // => 3
 */
function toInteger(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  var remainder = value % 1;
  return value === value ? (remainder ? value - remainder : value) : 0;
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3);
 * // => 3
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3');
 * // => 3
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = isFunction(value.valueOf) ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = chunk;

},{"lodash._baseslice":7}],12:[function(require,module,exports){
/**
 * lodash 3.3.4 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_SAFE_INTEGER = 9007199254740991,
    MAX_INTEGER = 1.7976931348623157e+308,
    NAN = 0 / 0;

/** Used as references for the maximum length and index of an array. */
var MAX_ARRAY_LENGTH = 4294967295;

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return value > -1 && value % 1 == 0 && value < length;
}

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * The base implementation of `_.clamp` which doesn't coerce arguments to numbers.
 *
 * @private
 * @param {number} number The number to clamp.
 * @param {number} [lower] The lower bound.
 * @param {number} upper The upper bound.
 * @returns {number} Returns the clamped number.
 */
function baseClamp(number, lower, upper) {
  if (number === number) {
    if (upper !== undefined) {
      number = number <= upper ? number : upper;
    }
    if (lower !== undefined) {
      number = number >= lower ? number : lower;
    }
  }
  return number;
}

/**
 * The base implementation of `_.fill` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to fill.
 * @param {*} value The value to fill `array` with.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns `array`.
 */
function baseFill(array, value, start, end) {
  var length = array.length;

  start = toInteger(start);
  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = (end === undefined || end > length) ? length : toInteger(end);
  if (end < 0) {
    end += length;
  }
  end = start > end ? 0 : toLength(end);
  while (start < end) {
    array[start++] = value;
  }
  return array;
}

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a
 * [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792) that affects
 * Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}

/**
 * Fills elements of `array` with `value` from `start` up to, but not
 * including, `end`.
 *
 * **Note:** This method mutates `array`.
 *
 * @static
 * @memberOf _
 * @since 3.2.0
 * @category Array
 * @param {Array} array The array to fill.
 * @param {*} value The value to fill `array` with.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns `array`.
 * @example
 *
 * var array = [1, 2, 3];
 *
 * _.fill(array, 'a');
 * console.log(array);
 * // => ['a', 'a', 'a']
 *
 * _.fill(Array(3), 2);
 * // => [2, 2, 2]
 *
 * _.fill([4, 6, 8, 10], '*', 1, 3);
 * // => [4, '*', '*', 10]
 */
function fill(array, value, start, end) {
  var length = array ? array.length : 0;
  if (!length) {
    return [];
  }
  if (start && typeof start != 'number' && isIterateeCall(array, value, start)) {
    start = 0;
    end = length;
  }
  return baseFill(array, value, start, end);
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'user': 'fred' };
 * var other = { 'user': 'fred' };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(getLength(value)) && !isFunction(value);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 *  else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8 which returns 'object' for typed array and weak map constructors,
  // and PhantomJS 1.9 which returns 'function' for `NodeList` instances.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length,
 *  else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 *  else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to an integer.
 *
 * **Note:** This function is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/6.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3');
 * // => 3
 */
function toInteger(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  var remainder = value % 1;
  return value === value ? (remainder ? value - remainder : value) : 0;
}

/**
 * Converts `value` to an integer suitable for use as the length of an
 * array-like object.
 *
 * **Note:** This method is based on
 * [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toLength(3);
 * // => 3
 *
 * _.toLength(Number.MIN_VALUE);
 * // => 0
 *
 * _.toLength(Infinity);
 * // => 4294967295
 *
 * _.toLength('3');
 * // => 3
 */
function toLength(value) {
  return value ? baseClamp(toInteger(value), 0, MAX_ARRAY_LENGTH) : 0;
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3);
 * // => 3
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3');
 * // => 3
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = isFunction(value.valueOf) ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = fill;

},{}],13:[function(require,module,exports){
/**
 * lodash 4.2.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
var baseFlatten = require('lodash._baseflatten');

/**
 * Flattens `array` a single level deep.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flatten([1, [2, [3, [4]], 5]]);
 * // => [1, 2, [3, [4]], 5]
 */
function flatten(array) {
  var length = array ? array.length : 0;
  return length ? baseFlatten(array, 1) : [];
}

module.exports = flatten;

},{"lodash._baseflatten":6}],14:[function(require,module,exports){
/**
 * lodash 4.2.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseUniq = require('lodash._baseuniq');

/**
 * Creates a duplicate-free version of an array, using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
 * for equality comparisons, in which only the first occurrence of each element
 * is kept.
 *
 * @static
 * @memberOf _
 * @category Array
 * @param {Array} array The array to inspect.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * _.uniq([2, 1, 2]);
 * // => [2, 1]
 */
function uniq(array) {
  return (array && array.length)
    ? baseUniq(array)
    : [];
}

module.exports = uniq;

},{"lodash._baseuniq":8}],15:[function(require,module,exports){
module.exports = function(amount) {
  var k = typeof amount === 'number' ? amount : 50,
    n_samples = 44100,
    curve = new Float32Array(n_samples),
    deg = Math.PI / 180,
    i = 0,
    x;
  for ( ; i < n_samples; ++i ) {
    x = i * 2 / n_samples - 1;
    curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
  }
  return curve;
}

},{}],16:[function(require,module,exports){
/*!
 * @name JavaScript/NodeJS Merge v1.2.0
 * @author yeikos
 * @repository https://github.com/yeikos/js.merge

 * Copyright 2014 yeikos - MIT license
 * https://raw.github.com/yeikos/js.merge/master/LICENSE
 */

;(function(isNode) {

	/**
	 * Merge one or more objects 
	 * @param bool? clone
	 * @param mixed,... arguments
	 * @return object
	 */

	var Public = function(clone) {

		return merge(clone === true, false, arguments);

	}, publicName = 'merge';

	/**
	 * Merge two or more objects recursively 
	 * @param bool? clone
	 * @param mixed,... arguments
	 * @return object
	 */

	Public.recursive = function(clone) {

		return merge(clone === true, true, arguments);

	};

	/**
	 * Clone the input removing any reference
	 * @param mixed input
	 * @return mixed
	 */

	Public.clone = function(input) {

		var output = input,
			type = typeOf(input),
			index, size;

		if (type === 'array') {

			output = [];
			size = input.length;

			for (index=0;index<size;++index)

				output[index] = Public.clone(input[index]);

		} else if (type === 'object') {

			output = {};

			for (index in input)

				output[index] = Public.clone(input[index]);

		}

		return output;

	};

	/**
	 * Merge two objects recursively
	 * @param mixed input
	 * @param mixed extend
	 * @return mixed
	 */

	function merge_recursive(base, extend) {

		if (typeOf(base) !== 'object')

			return extend;

		for (var key in extend) {

			if (typeOf(base[key]) === 'object' && typeOf(extend[key]) === 'object') {

				base[key] = merge_recursive(base[key], extend[key]);

			} else {

				base[key] = extend[key];

			}

		}

		return base;

	}

	/**
	 * Merge two or more objects
	 * @param bool clone
	 * @param bool recursive
	 * @param array argv
	 * @return object
	 */

	function merge(clone, recursive, argv) {

		var result = argv[0],
			size = argv.length;

		if (clone || typeOf(result) !== 'object')

			result = {};

		for (var index=0;index<size;++index) {

			var item = argv[index],

				type = typeOf(item);

			if (type !== 'object') continue;

			for (var key in item) {

				var sitem = clone ? Public.clone(item[key]) : item[key];

				if (recursive) {

					result[key] = merge_recursive(result[key], sitem);

				} else {

					result[key] = sitem;

				}

			}

		}

		return result;

	}

	/**
	 * Get type of variable
	 * @param mixed input
	 * @return string
	 *
	 * @see http://jsperf.com/typeofvar
	 */

	function typeOf(input) {

		return ({}).toString.call(input).slice(8, -1).toLowerCase();

	}

	if (isNode) {

		module.exports = Public;

	} else {

		window[publicName] = Public;

	}

})(typeof module === 'object' && module && typeof module.exports === 'object' && module.exports);
},{}],17:[function(require,module,exports){
'use strict'

var CHROMATIC = [ 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B' ]

/**
 * Get the note name (in scientific notation) of the given midi number
 *
 * It uses MIDI's [Tuning Standard](https://en.wikipedia.org/wiki/MIDI_Tuning_Standard)
 * where A4 is 69
 *
 * This method doesn't take into account diatonic spelling. Always the same
 * pitch class is given for the same midi number.
 *
 * @name midi.note
 * @function
 * @param {Integer} midi - the midi number
 * @return {String} the pitch
 *
 * @example
 * var note = require('midi-note')
 * note(69) // => 'A4'
 */
module.exports = function (midi) {
  if (isNaN(midi) || midi < 0 || midi > 127) return null
  var name = CHROMATIC[midi % 12]
  var oct = Math.floor(midi / 12) - 1
  return name + oct
}

},{}],18:[function(require,module,exports){
(function() {

	var noteMap = {};
	var noteNumberMap = [];
	var notes = [ "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B" ];


	for(var i = 0; i < 127; i++) {

		var index = i,
			key = notes[index % 12],
			octave = ((index / 12) | 0) - 1; // MIDI scale starts at octave = -1

		if(key.length === 1) {
			key = key + '-';
		}

		key += octave;

		noteMap[key] = i;
		noteNumberMap[i] = key;

	}


	function getBaseLog(value, base) {
		return Math.log(value) / Math.log(base);
	}


	var MIDIUtils = {

		noteNameToNoteNumber: function(name) {
			return noteMap[name];
		},

		noteNumberToFrequency: function(note) {
			return 440.0 * Math.pow(2, (note - 69.0) / 12.0);
		},

		noteNumberToName: function(note) {
			return noteNumberMap[note];
		},

		frequencyToNoteNumber: function(f) {
			return Math.round(12.0 * getBaseLog(f / 440.0, 2) + 69);
		}

	};


	// Make it compatible for require.js/AMD loader(s)
	if(typeof define === 'function' && define.amd) {
		define(function() { return MIDIUtils; });
	} else if(typeof module !== 'undefined' && module.exports) {
		// And for npm/node.js
		module.exports = MIDIUtils;
	} else {
		this.MIDIUtils = MIDIUtils;
	}


}).call(this);


},{}],19:[function(require,module,exports){
'use strict'

var transpose = require('note-transposer')
var interval = require('note-interval')
var parse = require('music-notation/note/parse')
var parseI = require('music-notation/interval/parse')
var str = require('music-notation/note/str')

var REGEX = /^#{1,7}|b{1,7}$/
var KEYS = { major: 1, minor: 6, ionian: 1, dorian: 2, phrygian: 3, lydian: 4,
  mixolydian: 5, aeolian: 6, locrian: 7 }
var SCALES = [
  '1 2 3 4 5 6 7', '1 2 3b 4 5 6 7b', '1 2b 3b 4 5 6b 7b', '1 2 3 4# 5 6 7',
  '1 2 3 4 5 6 7b', '1 2 3b 4 5 6b 7b', '1 2b 3b 4 5b 6b 7b'
].map(function (g) { return g.split(' ') })

/**
 * Create a key from a string. A key is a string with a tonic and a mode
 *
 * @name key
 * @function
 *
 * @example
 * var key = require('music-key')
 * key('C major') // => 'C major'
 * key('c Major') // => 'C major'
 * key('C') // => 'C major'
 * key('dbb miXolydian') // => 'Dbb mixolydian'
 */
function Key (str) {
  if (/^-?\d$/.exec(str)) {
    return major(+str)
  } else if (REGEX.exec(str)) {
    var dir = str[0] === 'b' ? -1 : 1
    return major(str.length * dir)
  } else {
    var p = Key.parse(str)
    return p ? p.tonic + ' ' + p.mode : null
  }
}
function major (n) { return transpose('C', [n, 0]) + ' major' }

/**
 * Parse a key name
 *
 * @name key.parse
 * @function
 * @param {String} name - the key name
 * @return {Array} an array with the tonic and mode or null if not valid key
 *
 * @example
 * var key = require('music-key')
 * key.parse('C major') // => ['C', 'major']
 * key.parse('fx MINOR') // => ['F##', 'minor']
 * key.parse('Ab mixolydian') // => ['Ab', 'mixolydian']
 * key.parse('f bebop') // => 'null'
 */
Key.parse = function (name) {
  var m, s, t
  if (!name) return null
  s = name.trim().split(/\s+/)
  t = str(parse((s[0])))
  if (s.length === 1) {
    m = s[0].toLowerCase()
    if (KEYS[m]) return k(null, m)
    else if (t) return k(t, 'major')
    else return null
  }
  m = s[1].toLowerCase()
  if (t && KEYS[m]) return k(t, m)
  return null
}

function k (t, m) { return {tonic: t || false, mode: m, alt: KEYS[m]} }

/**
 * Get relative of a key
 *
 * This function is currified, so it can be partially applied (see examples)
 *
 * @name key.relative
 * @function
 * @param {String} relative - the name of the relative mode desired
 * @param {String} key - the key name
 * @return {String} the relative key name or null if the key or the relative name
 * are not valid
 *
 * @example
 * var key = require('music-key')
 * key.relative('minor', 'C major') // => 'A minor'
 * key.relative('major', 'A minor') // => 'C major'
 * key.relative('dorian', 'F major') // => 'G dorian'
 *
 * // partially application
 * var minorOf = key.relative('minor')
 * minorOf('Bb major') // => 'G minor'
 */
Key.relative = function (rel, key) {
  if (arguments.length === 1) return function (k) { return Key.relative(rel, k) }
  var k = Key.parse(key)
  var r = Key.parse(rel)
  if (!k || !k.tonic || !r) return null
  var major = k.mode === 'major' ? k.tonic : transpose(k.tonic, '-' + k.alt)
  return r.mode === 'major' ? major + ' major' : transpose(major, '' + r.alt) + ' ' + rel
}

/**
 * Get the number of alterations of a key
 *
 * @name key.alteratons
 * @function
 * @param {String} name - the key name
 * @return {Integer} the number of alterations or null if not valid key
 *
 * @example
 * var key = require('music-key')
 * key.alterations('C major') // => 0
 * key.alterations('F major') // => -1
 * key.alterations('Eb major') // => -3
 * key.alterations('A major') // => 3
 * key.alterations('nonsense') // => null
 */
Key.alterations = function (key) {
  var k = Key.relative('major', key)
  return k ? parseI(interval('C', k.split(' ')[0]))[0] : null
}

/**
 * Get signature of a key
 *
 * @name key.signature
 * @function
 * @param {String} name - the key name
 * @return {String} a string with the alterations
 *
 * @example
 * var key = require('music-key')
 * key.signature('F major') // => 'b'
 * key.signature('Eb major') // => 'bbb'
 * key.signature('A major') // => '###'
 * key.signature('C major') // => ''
 * key.signature('nonsense') // => null
 */
Key.signature = function (key) {
  var n = Key.alterations(key)
  return n !== null ? new Array(Math.abs(n) + 1).join(n < 0 ? 'b' : '#') : null
}

/**
 * Get a list of altered notes in the appropriate order
 *
 * @name key.altered
 * @function
 * @param {String} name - the key name
 * @return {Array} an array with the altered notes ordered or an empty array
 * if its not a valid key name
 *
 * @example
 * key.altered('F major') // => ['Bb']
 * key.altered('Eb major') // => ['Bb', 'Eb', 'Ab']
 * key.altered('A major') // => ['F#', 'C#', 'G#']
 */
Key.altered = function (k) {
  var a = Key.alterations(k)
  if (a === null) return null
  var notes = []
  var tonic = a > 0 ? 'B' : 'F'
  var interval = a > 0 ? [1, 0] : [-1, 0]
  var l = Math.abs(a)
  for (var i = 0; i < l; i++) {
    tonic = transpose(tonic, interval)
    notes.push(tonic)
  }
  return notes
}

/**
 * Get the scale of a key
 *
 * @name key.scale
 * @function
 *
 * @example
 * var key = require('music-key')
 * key.scale('C major') // => ['C', 'D', 'E', ...]
 */
Key.scale = function (name) {
  var k = Key.parse(name)
  if (!k) return []
  return SCALES[k.alt - 1].map(transpose(k.tonic))
}

module.exports = Key

},{"music-notation/interval/parse":23,"music-notation/note/parse":27,"music-notation/note/str":29,"note-interval":33,"note-transposer":34}],20:[function(require,module,exports){
'use strict'

/**
 * Build an accidentals string from alteration number
 *
 * @name accidentals.str
 * @param {Integer} alteration - the alteration number
 * @return {String} the accidentals string
 *
 * @example
 * var accidentals = require('music-notation/accidentals/str')
 * accidentals(0) // => ''
 * accidentals(1) // => '#'
 * accidentals(2) // => '##'
 * accidentals(-1) // => 'b'
 * accidentals(-2) // => 'bb'
 */
module.exports = function (num) {
  if (num < 0) return Array(-num + 1).join('b')
  else if (num > 0) return Array(num + 1).join('#')
  else return ''
}

},{}],21:[function(require,module,exports){
'use strict'

// map from pitch number to number of fifths and octaves
var BASES = [ [0, 0], [2, -1], [4, -2], [-1, 1], [1, 0], [3, -1], [5, -2] ]

/**
 * Get a pitch in [array notation]() from pitch properties
 *
 * @name array.fromProps
 * @function
 * @param {Integer} step - the step index
 * @param {Integer} alterations - (Optional) the alterations number
 * @param {Integer} octave - (Optional) the octave
 * @param {Integer} duration - (Optional) duration
 * @return {Array} the pitch in array format
 *
 * @example
 * var fromProps = require('music-notation/array/from-props')
 * fromProps([0, 1, 4, 0])
 */
module.exports = function (step, alt, oct, dur) {
  var base = BASES[step]
  alt = alt || 0
  var f = base[0] + 7 * alt
  if (typeof oct === 'undefined') return [f]
  var o = oct + base[1] - 4 * alt
  if (typeof dur === 'undefined') return [f, o]
  else return [f, o, dur]
}

},{}],22:[function(require,module,exports){
'use strict'

// Map from number of fifths to interval number (0-index) and octave
// -1 = fourth, 0 = unison, 1 = fifth, 2 = second, 3 = sixth...
var BASES = [[3, 1], [0, 0], [4, 0], [1, -1], [5, -1], [2, -2], [6, -2], [3, -3]]

/**
 * Get properties from a pitch in array format
 *
 * The properties is an array with the form [number, alteration, octave, duration]
 *
 * @name array.toProps
 * @function
 * @param {Array} array - the pitch in coord format
 * @return {Array} the pitch in property format
 *
 * @example
 * var toProps = require('music-notation/array/to-props')
 * toProps([2, 1, 4]) // => [1, 2, 4]
 */
module.exports = function (arr) {
  if (!Array.isArray(arr)) return null
  var index = (arr[0] + 1) % 7
  if (index < 0) index = 7 + index
  var base = BASES[index]
  var alter = Math.floor((arr[0] + 1) / 7)
  var oct = arr.length === 1 ? null : arr[1] - base[1] + alter * 4
  var dur = arr[2] || null
  return [base[0], alter, oct, dur]
}

},{}],23:[function(require,module,exports){
'use strict'

var memoize = require('../memoize')
var fromProps = require('../array/from-props')
var INTERVAL = require('./regex')
var TYPES = 'PMMPPMM'
var QALT = {
  P: { dddd: -4, ddd: -3, dd: -2, d: -1, P: 0, A: 1, AA: 2, AAA: 3, AAAA: 4 },
  M: { ddd: -4, dd: -3, d: -2, m: -1, M: 0, A: 1, AA: 2, AAA: 3, AAAA: 4 }
}

/**
 * Parse a [interval shorthand notation](https://en.wikipedia.org/wiki/Interval_(music)#Shorthand_notation)
 * to [interval coord notation](https://github.com/danigb/music.array.notation)
 *
 * This function is cached for better performance.
 *
 * @name interval.parse
 * @function
 * @param {String} interval - the interval string
 * @return {Array} the interval in array notation or null if not a valid interval
 *
 * @example
 * var parse = require('music-notation/interval/parse')
 * parse('3m') // => [2, -1, 0]
 * parse('9b') // => [1, -1, 1]
 * parse('-2M') // => [6, -1, -1]
 */
module.exports = memoize(function (str) {
  var m = INTERVAL.exec(str)
  if (!m) return null
  var dir = (m[2] || m[7]) === '-' ? -1 : 1
  var num = +(m[3] || m[8]) - 1
  var q = m[4] || m[6] || ''

  var simple = num % 7

  var alt
  if (q === '') alt = 0
  else if (q[0] === '#') alt = q.length
  else if (q[0] === 'b') alt = -q.length
  else {
    alt = QALT[TYPES[simple]][q]
    if (typeof alt === 'undefined') return null
  }
  var oct = Math.floor(num / 7)
  var arr = fromProps(simple, alt, oct)
  return dir === 1 ? arr : [-arr[0], -arr[1]]
})

},{"../array/from-props":21,"../memoize":26,"./regex":24}],24:[function(require,module,exports){

// shorthand tonal notation (with quality after number)
var TONAL = '([-+]?)(\\d+)(d{1,4}|m|M|P|A{1,4}|b{1,4}|#{1,4}|)'
// strict shorthand notation (with quality before number)
var STRICT = '(AA|A|P|M|m|d|dd)([-+]?)(\\d+)'
var COMPOSE = '(?:(' + TONAL + ')|(' + STRICT + '))'

/**
 * A regex for parse intervals in shorthand notation
 *
 * Three different shorthand notations are supported:
 *
 * - default [direction][number][quality]: the preferred style `3M`, `-5A`
 * - strict: [quality][direction][number], for example: `M3`, `A-5`
 * - altered: [direction][number][alterations]: `3`, `-5#`
 *
 * @name interval.regex
 */
module.exports = new RegExp('^' + COMPOSE + '$')

},{}],25:[function(require,module,exports){
'use strict'

var props = require('../array/to-props')
var cache = {}

/**
 * Get a string with a [shorthand interval notation](https://en.wikipedia.org/wiki/Interval_(music)#Shorthand_notation)
 * from interval in [array notation](https://github.com/danigb/music.array.notation)
 *
 * The returned string has the form: `number + quality` where number is the interval number
 * (positive integer for ascending intervals, negative integer for descending intervals, never 0)
 * and the quality is one of: 'M', 'm', 'P', 'd', 'A' (major, minor, perfect, dimished, augmented)
 *
 * @name interval.str
 * @function
 * @param {Array} interval - the interval in array notation
 * @return {String} the interval string in shorthand notation or null if not valid interval
 *
 * @example
 * var str = require('music-notation/interval/str')
 * str([1, 0, 0]) // => '2M'
 * str([1, 0, 1]) // => '9M'
 */
module.exports = function (arr) {
  if (!Array.isArray(arr) || arr.length !== 2) return null
  var str = '|' + arr[0] + '|' + arr[1]
  return str in cache ? cache[str] : cache[str] = build(arr)
}

var ALTER = {
  P: ['dddd', 'ddd', 'dd', 'd', 'P', 'A', 'AA', 'AAA', 'AAAA'],
  M: ['ddd', 'dd', 'd', 'm', 'M', 'A', 'AA', 'AAA', 'AAAA']
}
var TYPES = 'PMMPPMM'

function build (coord) {
  var p = props(coord)
  var t = TYPES[p[0]]

  var dir, num, alt
  // if its descening, invert number
  if (p[2] < 0) {
    dir = -1
    num = (8 - p[0]) - 7 * (p[2] + 1)
    alt = t === 'P' ? -p[1] : -(p[1] + 1)
  } else {
    dir = 1
    num = p[0] + 1 + 7 * p[2]
    alt = p[1]
  }
  var q = ALTER[t][4 + alt]
  return dir * num + q
}

},{"../array/to-props":22}],26:[function(require,module,exports){
'use strict'

/**
 * A simple and fast memoization function
 *
 * It helps creating functions that convert from string to pitch in array format.
 * Basically it does two things:
 * - ensure the function only receives strings
 * - memoize the result
 *
 * @name memoize
 * @function
 * @private
 */
module.exports = function (fn) {
  var cache = {}
  return function (str) {
    if (typeof str !== 'string') return null
    return (str in cache) ? cache[str] : cache[str] = fn(str)
  }
}

},{}],27:[function(require,module,exports){
'use strict'

var memoize = require('../memoize')
var R = require('./regex')
var BASES = { C: [0, 0], D: [2, -1], E: [4, -2], F: [-1, 1], G: [1, 0], A: [3, -1], B: [5, -2] }

/**
 * Get a pitch in [array notation]()
 * from a string in [scientific pitch notation](https://en.wikipedia.org/wiki/Scientific_pitch_notation)
 *
 * The string to parse must be in the form of: `letter[accidentals][octave]`
 * The accidentals can be up to four # (sharp) or b (flat) or two x (double sharps)
 *
 * This function is cached for better performance.
 *
 * @name note.parse
 * @function
 * @param {String} str - the string to parse
 * @return {Array} the note in array notation or null if not valid note
 *
 * @example
 * var parse = require('music-notation/note/parse')
 * parse('C') // => [ 0 ]
 * parse('c#') // => [ 8 ]
 * parse('c##') // => [ 16 ]
 * parse('Cx') // => [ 16 ] (double sharp)
 * parse('Cb') // => [ -6 ]
 * parse('db') // => [ -4 ]
 * parse('G4') // => [ 2, 3, null ]
 * parse('c#3') // => [ 8, -1, null ]
 */
module.exports = memoize(function (str) {
  var m = R.exec(str)
  if (!m || m[5]) return null

  var base = BASES[m[1].toUpperCase()]
  var alt = m[2].replace(/x/g, '##').length
  if (m[2][0] === 'b') alt *= -1
  var fifths = base[0] + 7 * alt
  if (!m[3]) return [fifths]
  var oct = +m[3] + base[1] - 4 * alt
  var dur = m[4] ? +(m[4].substring(1)) : null
  return [fifths, oct, dur]
})

},{"../memoize":26,"./regex":28}],28:[function(require,module,exports){
'use strict'

/**
 * A regex for matching note strings in scientific notation.
 *
 * The note string should have the form `letter[accidentals][octave][/duration]`
 * where:
 *
 * - letter: (Required) is a letter from A to G either upper or lower case
 * - accidentals: (Optional) can be one or more `b` (flats), `#` (sharps) or `x` (double sharps).
 * They can NOT be mixed.
 * - octave: (Optional) a positive or negative integer
 * - duration: (Optional) anything follows a slash `/` is considered to be the duration
 * - element: (Optional) additionally anything after the duration is considered to
 * be the element name (for example: 'C2 dorian')
 *
 * @name note.regex
 * @example
 * var R = require('music-notation/note/regex')
 * R.exec('c#4') // => ['c#4', 'c', '#', '4', '', '']
 */
module.exports = /^([a-gA-G])(#{1,}|b{1,}|x{1,}|)(-?\d*)(\/\d+|)\s*(.*)\s*$/

},{}],29:[function(require,module,exports){
'use strict'

var props = require('../array/to-props')
var acc = require('../accidentals/str')
var cache = {}

/**
 * Get [scientific pitch notation](https://en.wikipedia.org/wiki/Scientific_pitch_notation) string
 * from pitch in [array notation]()
 *
 * Array length must be 1 or 3 (see array notation documentation)
 *
 * The returned string format is `letter[+ accidentals][+ octave][/duration]` where the letter
 * is always uppercase, and the accidentals, octave and duration are optional.
 *
 * This function is memoized for better perfomance.
 *
 * @name note.str
 * @function
 * @param {Array} arr - the note in array notation
 * @return {String} the note in scientific notation or null if not valid note array
 *
 * @example
 * var str = require('music-notation/note/str')
 * str([0]) // => 'F'
 * str([0, 4]) // => null (its an interval)
 * str([0, 4, null]) // => 'F4'
 * str([0, 4, 2]) // => 'F4/2'
 */
module.exports = function (arr) {
  if (!Array.isArray(arr) || arr.length < 1 || arr.length === 2) return null
  var str = '|' + arr[0] + '|' + arr[1] + '|' + arr[2]
  return str in cache ? cache[str] : cache[str] = build(arr)
}

var LETTER = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
function build (coord) {
  var p = props(coord)
  return LETTER[p[0]] + acc(p[1]) + (p[2] !== null ? p[2] : '') + (p[3] !== null ? '/' + p[3] : '')
}

},{"../accidentals/str":20,"../array/to-props":22}],30:[function(require,module,exports){
'use strict'

function curry (fn, arity) {
  if (arity === 1) return fn
  return function (a, b) {
    if (arguments.length === 1) return function (c) { return fn(a, c) }
    return fn(a, b)
  }
}

/**
 * Decorate a function to work with intervals, notes or pitches in
 * [array notation](https://github.com/danigb/tonal/tree/next/packages/music-notation)
 * with independence of string representations.
 *
 * This is the base of the pluggable notation system of
 * [tonal](https://github.com/danigb/tonal)
 *
 * @name operation
 * @function
 * @param {Function} parse - the parser
 * @param {Function} str - the string builder
 * @param {Function} fn - the operation to decorate
 *
 * @example
 * var parse = require('music-notation/interval/parse')
 * var str = require('music-notation/interval/str')
 * var operation = require('music-notation/operation')(parse, str)
 * var add = operation(function(a, b) { return [a[0] + b[0], a[1] + b[1]] })
 * add('3m', '3M') // => '5P'
 */
module.exports = function op (parse, str, fn) {
  if (arguments.length === 2) return function (f) { return op(parse, str, f) }
  return curry(function (a, b) {
    var ac = parse(a)
    var bc = parse(b)
    if (!ac && !bc) return fn(a, b)
    var v = fn(ac || a, bc || b)
    return str(v) || v
  }, fn.length)
}

},{}],31:[function(require,module,exports){
var note = require('../note/parse')
var interval = require('../interval/parse')

/**
 * Convert a note or interval string to a [pitch in coord notation]()
 *
 * @name pitch.parse
 * @function
 * @param {String} pitch - the note or interval to parse
 * @return {Array} the pitch in array notation
 *
 * @example
 * var parse = require('music-notation/pitch/parse')
 * parse('C2') // => [0, 2, null]
 * parse('5P') // => [1, 0]
 */
module.exports = function (n) { return note(n) || interval(n) }

},{"../interval/parse":23,"../note/parse":27}],32:[function(require,module,exports){
var note = require('../note/str')
var interval = require('../interval/str')

/**
 * Convert a pitch in coordinate notation to string. It deals with notes, pitch
 * classes and intervals.
 *
 * @name pitch.str
 * @funistron
 * @param {Array} pitch - the pitch in array notation
 * @return {String} the pitch string
 *
 * @example
 * var str = require('music-notation/pitch.str')
 * // pitch class
 * str([0]) // => 'C'
 * // interval
 * str([0, 0]) // => '1P'
 * // note
 * str([0, 2, 4]) // => 'C2/4'
 */
module.exports = function (n) { return note(n) || interval(n) }

},{"../interval/str":25,"../note/str":29}],33:[function(require,module,exports){
var parse = require('music-notation/pitch/parse')
var str = require('music-notation/pitch/str')
var notation = require('music-notation/operation')(parse, str)

/**
 * Get the interval between two pitches
 *
 * If one or both are pitch classes, a simple ascending interval is returned
 *
 * This function can be partially applied (see examples)
 *
 * @name note.interval
 * @function
 * @param {String} from - the first note
 * @param {String} to - the second note
 * @return {String} the interval between them
 *
 * @example
 * var interval = require('note-interval')
 * interval('C2', 'D3') // => '9M'
 * interval('D2', 'C2') // => '-2M'
 * interval('D', 'C') // => '7m'
 *
 * @example
 * // partially applied
 * var fromC = interval('C')
 * fromC('D') // => '2M'
 */
module.exports = notation(function (a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) return null
  if (a.length === 1 || b.length === 1) {
    var base = b[0] - a[0]
    return [base, -Math.floor(base * 7 / 12)]
  }
  return [b[0] - a[0], b[1] - a[1]]
})

},{"music-notation/operation":30,"music-notation/pitch/parse":31,"music-notation/pitch/str":32}],34:[function(require,module,exports){
var parse = require('music-notation/pitch/parse')
var str = require('music-notation/pitch/str')
var operation = require('music-notation/operation')(parse, str)

/**
 * Transposes a note by an interval.
 *
 * Given a note and an interval it returns the transposed note. It can be used
 * to add intervals if both parameters are intervals.
 *
 * The order of the parameters is indifferent.
 *
 * This function is currified so it can be used to map arrays of notes.
 *
 * @name transpose
 * @function
 * @param {String|Array} interval - the interval. If its false, the note is not
 * transposed.
 * @param {String|Array} note - the note to transpose
 * @return {String|Array} the note transposed
 *
 * @example
 * var transpose = require('note-transposer')
 * transpose('3m', 'C4') // => 'Eb4'
 * transpose('C4', '3m') // => 'Eb4'
 * tranpose([1, 0, 2], [3, -1, 0]) // => [3, 0, 2]
 * ['C', 'D', 'E'].map(transpose('3M')) // => ['E', 'F#', 'G#']
 */
var transpose = operation(function (i, n) {
  if (i === false) return n
  else if (!Array.isArray(i) || !Array.isArray(n)) return null
  else if (i.length === 1 || n.length === 1) return [n[0] + i[0]]
  var d = i.length === 2 && n.length === 2 ? null : n[2] || i[2]
  return [n[0] + i[0], n[1] + i[1], d]
})

if (typeof module === 'object' && module.exports) module.exports = transpose
if (typeof window !== 'undefined') window.transpose = transpose

},{"music-notation/operation":30,"music-notation/pitch/parse":31,"music-notation/pitch/str":32}],35:[function(require,module,exports){
(function() {

	var setterGetterify = require('setter-getterify');
	var safeRegisterElement = require('safe-register-element');

	// Ideally it would be better to extend the HTMLInputElement prototype but
	// it doesn't seem to be working and I don't get any distinct element at all
	// or I get an "TypeError: 'type' setter called on an object that does not implement interface HTMLInputElement."
	// ... so using just HTMLElement for now
	var proto = Object.create(HTMLElement.prototype);

	proto.createdCallback = function() {

		var that = this;

		// Values
		var properties = {
			min: 0,
			max: 100,
			value: 50,
			step: 1
		};

		setterGetterify(this, properties, {
			afterSetting: function(property, value) {
				updateDisplay(that);
			}
		});
	
		this._properties = properties;

		// Markup
		var slider = document.createElement('input');
		slider.type = 'range';

		var valueSpan = document.createElement('span');

		this._slider = slider;
		this._valueSpan = valueSpan;

		this.appendChild(slider);
		this.appendChild(valueSpan);

		slider.addEventListener('input', function() {
			that.value = slider.value * 1.0;
		});

	};

	
	var sliderAttributes = [ 'min', 'max', 'value', 'step' ];

	proto.attachedCallback = function() {

		var attrs = this.attributes;
		var valueIsThere = false;
	
		for(var i = 0; i < attrs.length; i++) {
			var attr = attrs[i];

			if(attr.name === 'value') {
				valueIsThere = true;
			}

			// Just sending sensible attributes to the slider itself
			if(sliderAttributes.indexOf(attr.name) !== -1) {
				this._properties[attr.name] = attr.value;
			}
		}

		// If not specified, the default value has to be 
		// (min + max) / 2 as the normal slider would do as well.
		if(!valueIsThere) {
			var calculatedValue = (this._properties.min * 1.0 + this._properties.max * 1.0) / 2.0;
			this._properties.value = calculatedValue;
		}

		updateDisplay(this);

	};


	function updateDisplay(compo) {
		compo._valueSpan.innerHTML = compo._properties.value;
		compo._slider.value = compo._properties.value;
		compo._slider.min = compo._properties.min;
		compo._slider.max = compo._properties.max;
		compo._slider.step = compo._properties.step;
	}

	//
	
	var component = {};
	component.prototype = proto;
	component.register = function(name) {
		safeRegisterElement(name, proto);
	};

	if(typeof define === 'function' && define.amd) {
		define(function() { return component; });
	} else if(typeof module !== 'undefined' && module.exports) {
		module.exports = component;
	} else {
		component.register('openmusic-slider'); // automatic registration
	}

}).call(this);



},{"safe-register-element":39,"setter-getterify":41}],36:[function(require,module,exports){
'use strict';
module.exports = function (data, options) {
	options = options || {};
	data = data.slice();

	var count = Number(options.count) || 1;
	var ret = [];

	if (!Array.isArray(data)) {
		throw new TypeError('Expected an array as the first argument');
	}

	if (count > data.length) {
		throw new Error('Count must be lower or the same as the number of picks');
	}

	while (count--) {
		ret.push(data.splice(Math.floor(Math.random() * data.length), 1)[0]);
	}

	return ret;
};

},{}],37:[function(require,module,exports){
var makeDistortionCurve = require('make-distortion-curve')
var MIDIUtils = require('midiutils')
var adsr = require('a-d-s-r')

// yr function should accept an audioContext, and optional params/opts
module.exports = function (ac, opts) {
  // make some audioNodes, connect them, store them on the object
  var audioNodes = {}

  var osc1 = ac.createOscillator()
  var osc2 = ac.createOscillator()
  var osc3 = ac.createOscillator()
  var oscnoise = ac.createOscillator()
  osc1.type = 'triangle'
  osc2.type = 'triangle'
  osc3.type = 'sine'
  oscnoise.type = 'sawtooth'

  // are these tooooo small?
  osc1.detune.value = 0.75 * ((Math.random() * 2) - 1)
  osc2.detune.value = 0.75 * ((Math.random() * 2) - 1)
  osc3.detune.value = 0.3 * ((Math.random() * 2) - 1)

  var leftfilter = ac.createBiquadFilter()
  leftfilter.type = 'lowpass'
  leftfilter.Q.value = 7
  leftfilter.detune.value = 0.75 * ((Math.random() * 2) - 1)
  leftfilter.frequency.setValueAtTime(500, ac.currentTime)

  var rightfilter = ac.createBiquadFilter()
  rightfilter.type = 'lowpass'
  rightfilter.Q.value = 7
  rightfilter.detune.value = 0.75 * ((Math.random() * 2) - 1)
  rightfilter.frequency.setValueAtTime(500, ac.currentTime)


  var noisegain = ac.createGain()
  noisegain.gain.setValueAtTime(0, ac.currentTime)

  var delay = ac.createDelay(0.35)

  var compressor = ac.createDynamicsCompressor()
  compressor.threshold.value = -30
  compressor.knee.value = 33
  compressor.ratio.value = 9
  compressor.reduction.value = -10
  compressor.attack.value = 0.15
  compressor.release.value = 0.35

  var gain = ac.createGain()
  gain.gain.setValueAtTime(0, ac.currentTime)


  var distortion = ac.createWaveShaper()
  distortion.curve = makeDistortionCurve(75)

  var mainfilter = ac.createBiquadFilter()
  mainfilter.type = 'lowpass'
  mainfilter.frequency.setValueAtTime(500, ac.currentTime)

  oscnoise.connect(noisegain)
  osc1.connect(leftfilter)
  osc2.connect(rightfilter)
  leftfilter.connect(compressor)
  rightfilter.connect(compressor)
  osc3.connect(compressor)
  noisegain.connect(delay)
  noisegain.connect(distortion)
  delay.connect(compressor)
  compressor.connect(gain)
  gain.connect(distortion)
  distortion.connect(mainfilter)

  // gotta be a better way to do this... oh well
  audioNodes.oscnoise = oscnoise
  audioNodes.noisegain = noisegain
  audioNodes.osc1 = osc1
  audioNodes.osc2 = osc2
  audioNodes.osc3 = osc3
  audioNodes.leftfilter = leftfilter
  audioNodes.rightfilter = rightfilter
  audioNodes.mainfilter = mainfilter
  audioNodes.gain = gain
  audioNodes.delay = delay
  audioNodes.distortion = distortion
  audioNodes.compressor = compressor

  // gosh i wish there was an audioNode that just did this...
  audioNodes.settings = {
    attack: 0.1,
    decay: 0.05,
    sustain: 0.3,
    release: 0.1,
    peak: 0.5,
    mid: 0.3,
    end: 0.000001
  }

  return {
    connect: function (input) {
      // // this function should call `connect` on yr output nodes with `input` as the arg
      audioNodes.mainfilter.connect(input)

      // just let them buzz forever, deal with "notes" via adsr tricks
      audioNodes.oscnoise.start(ac.currentTime)
      audioNodes.osc1.start(ac.currentTime)
      audioNodes.osc2.start(ac.currentTime)
      audioNodes.osc3.start(ac.currentTime)
    },
    start: function (when) {
      // console.log('start', audioNodes.settings)

      adsr(audioNodes.gain, when, audioNodes.settings)
      // console.log('one')
      var cloned = JSON.parse(JSON.stringify(audioNodes.settings))
      cloned.peak /= 2.0
      cloned.mid /= 2.0
      // console.log('didit', cloned)
      adsr(audioNodes.noisegain, when, cloned)
    },
    stop: function (when) {
      audioNodes.oscnoise.stop(when)
      audioNodes.osc1.stop(when)
      audioNodes.osc2.stop(when)
      audioNodes.osc3.stop(when)
      console.log('whyd u push the piano off the building? not it is broken, forever. gotta make a new one!')
    },
    update: function (opts, when) {
      // available opts:
      // {midiNote: 62, attack: , decay: , sustain: , release: }
      Object.keys(opts).forEach(function (k) {
        var v = opts[k]
        if (k == 'midiNote' || k == 'freq') {
          var freq = k == 'midiNote' ? MIDIUtils.noteNumberToFrequency(v) : v
          audioNodes.leftfilter.frequency.setValueAtTime(freq + (Math.random() * (freq / 2.5)), when)
          audioNodes.rightfilter.frequency.setValueAtTime(freq + (Math.random() * (freq / 2.5)), when)
          audioNodes.mainfilter.frequency.setValueAtTime(freq + (Math.random() * (freq / 3.5)), when)
          audioNodes.oscnoise.frequency.setValueAtTime(freq, when)
          audioNodes.osc1.frequency.setValueAtTime(freq, when)
          audioNodes.osc2.frequency.setValueAtTime(freq, when)
          audioNodes.osc3.frequency.setValueAtTime(freq / 2.0, when)
        } else {
          // just an ADSR value
          audioNodes.settings[k] = v
        }
      })
    },
    nodes: function () {
      // returns an object of `{stringKey: audioNode}` for raw manipulation
      return audioNodes
    }
  }
}
},{"a-d-s-r":3,"make-distortion-curve":15,"midiutils":18}],38:[function(require,module,exports){
var makeDistortionCurve = require('make-distortion-curve')
var adsr = require('a-d-s-r')
// yr function should accept an audioContext, and optional params/opts
module.exports = function (ac, opts) {
  // make some audioNodes, connect them, store them on the object
  var audioNodes = {
    one: ac.createOscillator(),
    two: ac.createOscillator(),
    three: ac.createOscillator(),
    four: ac.createOscillator(),
    five: ac.createOscillator(),
    six: ac.createOscillator(),
    maingain: ac.createGain(),
    distortion: ac.createWaveShaper(),
    bandfilter: ac.createBiquadFilter(),
    highfilter: ac.createBiquadFilter(),
    delay: ac.createDelay(0.05),
    dgain: ac.createGain(),
    envelope: ac.createGain(),
    settings: {
      attack: 0.02,
      decay: 0.03,
      sustain: 0.000001,
      release: 0.3,
      peak: 0.7,
      mid: 0.25,
      end: 0.00001
    }
  }

  audioNodes.one.type = 'square'
  audioNodes.one.frequency.setValueAtTime(80, ac.currentTime)
  audioNodes.two.type = 'square'
  audioNodes.two.frequency.setValueAtTime(115, ac.currentTime)
  audioNodes.three.type = 'square'
  audioNodes.three.frequency.setValueAtTime(165, ac.currentTime)
  audioNodes.four.type = 'square'
  audioNodes.four.frequency.setValueAtTime(250, ac.currentTime)
  audioNodes.five.type = 'square'
  audioNodes.five.frequency.setValueAtTime(340, ac.currentTime)
  audioNodes.six.type = 'square'
  audioNodes.six.frequency.setValueAtTime(420, ac.currentTime)

  audioNodes.maingain.gain.value = 0.75 / 6.0

  audioNodes.distortion.curve = makeDistortionCurve(333)

  audioNodes.bandfilter.type = 'bandpass'
  audioNodes.bandfilter.frequency.setValueAtTime(10420, ac.currentTime)

  audioNodes.highfilter.type = 'highpass'
  audioNodes.highfilter.frequency.setValueAtTime(6660, ac.currentTime)

  audioNodes.dgain.gain.value = 0.5

  audioNodes.envelope.gain.setValueAtTime(0, ac.currentTime)

  audioNodes.one.connect(audioNodes.maingain)
  audioNodes.two.connect(audioNodes.maingain)
  audioNodes.three.connect(audioNodes.maingain)
  audioNodes.four.connect(audioNodes.maingain)
  audioNodes.five.connect(audioNodes.maingain)
  audioNodes.six.connect(audioNodes.maingain)
  audioNodes.maingain.connect(audioNodes.distortion)
  audioNodes.distortion.connect(audioNodes.bandfilter)
  audioNodes.bandfilter.connect(audioNodes.highfilter)
  audioNodes.highfilter.connect(audioNodes.delay)
  audioNodes.delay.connect(audioNodes.dgain)
  audioNodes.dgain.connect(audioNodes.envelope)

  audioNodes.one.start(ac.currentTime)
  audioNodes.two.start(ac.currentTime)
  audioNodes.three.start(ac.currentTime)
  audioNodes.four.start(ac.currentTime)
  audioNodes.five.start(ac.currentTime)
  audioNodes.six.start(ac.currentTime)
  return {
    connect: function (input) {
      audioNodes.envelope.connect(input)
    },
    start: function (when) {
      // //this function should call `start(when)` on yr source nodes. Probably oscillators/samplers i guess, and any LFO too!
      adsr(audioNodes.envelope, when, audioNodes.settings)
    },
    stop: function (when) {
      // // same thing as start but with `stop(when)`
      audioNodes.source.stop(when)
      audioNodes.source.stop(when)
      audioNodes.source.stop(when)
      audioNodes.source.stop(when)
      audioNodes.source.stop(when)
      audioNodes.source.stop(when)
    },
    update: function (opts) {
      // optional: for performing high-level updates on the instrument.
      Object.keys(opts).forEach(function (k) {
        var v = opts[k]
        // ????
      })
    },
    nodes: function () {
      // returns an object of `{stringKey: audioNode}` for raw manipulation
      return audioNodes
    }
  }
}
},{"a-d-s-r":3,"make-distortion-curve":15}],39:[function(require,module,exports){
module.exports = function safeRegistration(name, prototype) {
	try {
		document.registerElement(name, {
			prototype: prototype
		});
	} catch(e) {
		console.log('Exception when registering ' + name + '; perhaps it has been registered already?');
	}
};

},{}],40:[function(require,module,exports){
(function() {
	var proto = Object.create(HTMLElement.prototype)

	proto.createdCallback = function () {
		var that = this
		this.values = {}

		// making web components MWC framework proof.
		this.innerHTML = ''

		function makeOption (val) {
			return '<option value="' + val + '">' + val + '</option>'
		}

		var noteSelect = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"].map(makeOption)
		var scaleSelect = ["major", "minor", "pentMaj", "pentMin"].map(makeOption)
		var templateContents = ['<select class="tonic">'].concat(noteSelect).concat('</select><select class="scale">').concat(scaleSelect).concat('</select>').join('')

		var template = document.createElement('template')
		template.innerHTML = templateContents

		var liveHTML = document.importNode(template.content, true)
		var div = document.createElement('div')
		div.appendChild(liveHTML)

		var tonicSelect = div.querySelector('[class=tonic]')
		var scaleSelect = div.querySelector('[class=scale]')

		tonicSelect.addEventListener('change', function(e) {
			dispatchEvent('tonic', that, {value: e.target.value})
		})

		scaleSelect.addEventListener('change', function(e) {
			dispatchEvent('scale', that, {value: e.target.value})
		})

		this.appendChild(div)
		this.readAttributes()
	}

	function dispatchEvent(type, element, detail) {
		detail = detail || {}

		var ev = new CustomEvent(type, { detail: detail })
		element.dispatchEvent(ev)
	}

	proto.attachedCallback = function() {
	}

	proto.detachedCallback = function() {
	}

	proto.readAttributes = function() {
		var that = this; // ugh defense
		[].forEach(function(attr) {
			that.setValue(attr, that.getAttribute(attr))
		})
	}

	proto.setValue = function(name, value) {
		if(value !== undefined && value !== null) {
			this.values[name] = value
			this.querySelector('[class=' + name + ']').value = value
		}
	}

	proto.getValue = function(name) {
		return this.values[name]
	}

	proto.attributeChangedCallback = function(attr, oldValue, newValue, namespace) {
		this.setValue(attr, newValue)
		var e = new CustomEvent('change', {detail: this.values})
		this.dispatchEvent(e)
	}

	var component = {}
	component.prototype = proto
	component.register = function (name) {
		document.registerElement(name, {prototype: proto})
	}

	if(typeof define === 'function' && define.amd) {
		define(function () { return component })
	} else if(typeof module !== 'undefined' && module.exports) {
		module.exports = component
	} else {
		component.register('openmusic-web-component-template') // automatic registration
	}

}).call(this)

},{}],41:[function(require,module,exports){
module.exports = setterGetterify;


function setterGetterify(object, properties, callbacks) {
	callbacks = callbacks || {};
	var keys = Object.keys(properties);
	keys.forEach(function(key) {
		Object.defineProperty(object, key, makeGetterSetter(properties, key, callbacks));
	});
}


function makeGetterSetter(properties, property, callbacks) {
	var afterSetting = callbacks.afterSetting || function() {};
	return {
		get: function() {
			return getProperty(properties, property);
		},
		set: function(value) {
			setProperty(properties, property, value);
			afterSetting(property, value);
		},
		enumerable: true
	};
}


function getProperty(properties, name) {
	return properties[name];
}


function setProperty(properties, name, value) {
	properties[name] = value;
}



},{}],42:[function(require,module,exports){
function pick (arr) {
  // console.log(arr)
  return arr[~~(Math.random() * arr.length)]
}

function roll (prob) {
  return Math.random() < prob
}

// ADD
// - modulus
// - randos? flipsies?

module.exports = function (currentSong) {
  var interval, globalTick = 0, song = currentSong
  return {
    start: function () {
      if (interval) throw('wtf')
      interval = setInterval(function () {
        globalTick++
        Object.keys(song.instruments).forEach(function (k) {
          var instrument = song.instruments[k]
          var pattern = instrument.patterns[song.current]

          var onItsBeat = globalTick % (pattern.mod || 1) == 0

          if (onItsBeat && roll(pattern.probs[pattern.currentVersion][pattern.currentTick])) {
            instrument.play(pattern.notes ? pick(pattern.notes[pattern.currentVersion][pattern.currentTick]) : undefined)
          }
          if (onItsBeat) pattern.currentTick++
          if (pattern.currentTick == pattern.probs[pattern.currentVersion].length) {
            pattern.currentTick = 0
            pattern.currentVersion = pick(pattern.nexts[pattern.currentVersion])
            if (instrument.lead) {
              // if (nextSong) song = nextSong, nextSong = null
              song.current = pick(song.nexts[song.current])
              if (!song.current) alert('it is over')
            }
          }
        })
      }, 60000.0 / song.bpm)
    },
    stop: function () {
      clearInterval(interval)
      interval = null
    },
    updateSong: function (newSong) {
      song = newSong
    }
  }
}

},{}],43:[function(require,module,exports){
var adsr = require('a-d-s-r')
var makeDistortionCurve = require('make-distortion-curve')
module.exports = function (ac, opts) {
  var audioNodes = {
    osc: ac.createOscillator(),
    gain: ac.createGain(),
    dist: ac.createWaveShaper(),
    filter: ac.createBiquadFilter(),
    settings: {
      freq: 250,
      endFreq: 30,
      attack: 0.000000000000000000001,
      decay: 0.000000000000000000001,
      sustain: 0.12,
      release: 0.13,
      peak: 0.5,
      mid: 0.35,
      end: 0.000000000000000000001
    }
  }

  audioNodes.osc.frequency.setValueAtTime(0.00000001, ac.currentTime)
  audioNodes.osc.start(ac.currentTime)

  audioNodes.gain.gain.setValueAtTime(0.00000001, ac.currentTime)

  audioNodes.dist.curve = makeDistortionCurve(25)

  audioNodes.filter.type = 'lowpass'
  audioNodes.filter.frequency.setValueAtTime(audioNodes.settings.freq * 3.5, ac.currentTime)

  audioNodes.osc.connect(audioNodes.gain)
  audioNodes.gain.connect(audioNodes.dist)
  audioNodes.dist.connect(audioNodes.filter)

  return {
    connect: function (input) {
      audioNodes.filter.connect(input)
    },
    start: function (when) {
      audioNodes.osc.frequency.setValueAtTime(audioNodes.settings.freq, when)
      audioNodes.osc.frequency.exponentialRampToValueAtTime(audioNodes.settings.endFreq, when + audioNodes.settings.attack + audioNodes.settings.decay + audioNodes.settings.sustain + audioNodes.settings.release)
      adsr(audioNodes.gain, when, audioNodes.settings)
    },
    stop: function (when) {
      audioNodes.source.stop(when)
    },
    update: function (opts) {
      Object.keys(opts).forEach(function (k) {
        audioNodes.settings[k] = opts[k]
      })
    },
    nodes: function () {
      return audioNodes
    }
  }
}
},{"a-d-s-r":3,"make-distortion-curve":15}],44:[function(require,module,exports){
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
    // console.log(line)
    // regex from: http://knowles.co.za/parsing-guitar-tab/
    var patt = /([A-Ga-g]{0,1}[#b]{0,1})[\|\]]{0,1}([\-0-9\|\/\^\(\)\\hbpv]+)/;
    if (line.match(patt)) {
      // console.log(line)
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
  // console.log(sections)
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
  // console.log('notes',notes)
  var accidentals = uniq(flatten(notes)).map(function (note) {
    return note.replace(/^\w/, '')
  }).filter(function (e) {return e})
  // console.log(key(accidentals.join('')))
  return key(accidentals.join('')) || "C"
}

function getMiddle (section) {
  var allTheNotesAllLinedUp = uniq(flatten(section).filter(function (e) {return e})).sort()
  // console.log('allthem', allTheNotesAllLinedUp)
  return allTheNotesAllLinedUp[~~(allTheNotesAllLinedUp.length / 2)]
}

function getRootNoteNumber (middle, target) {
  // console.log('getRoot', middle, target)
  // console.log(midinote(middle))
  if (midinote(middle) && midinote(middle).replace(/\d+/, '') == target) {
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
        // if (typeof (diff * multiplier * octaved) !== 'number') console.log(multiplier, octaved, diff, note, root, midinote(note))
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
  // console.log(getKey(allTheNotes))
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



},{"lodash.chunk":11,"lodash.fill":12,"lodash.flatten":13,"lodash.uniq":14,"midi-note":17,"music-key":19}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vLmpzIiwiZGVtb1NvbmcuanNvbiIsIm5vZGVfbW9kdWxlcy9hLWQtcy1yL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2RqLXNuYXp6eS1zbmFyZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9pbnQyZnJlcS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2guX2Jhc2VmbGF0dGVuL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC5fYmFzZXNsaWNlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC5fYmFzZXVuaXEvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLl9jcmVhdGVzZXQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLl9zZXRjYWNoZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2guY2h1bmsvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmZpbGwvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmZsYXR0ZW4vaW5kZXguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLnVuaXEvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbWFrZS1kaXN0b3J0aW9uLWN1cnZlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL21lcmdlL21lcmdlLmpzIiwibm9kZV9tb2R1bGVzL21pZGktbm90ZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9taWRpdXRpbHMvc3JjL01JRElVdGlscy5qcyIsIm5vZGVfbW9kdWxlcy9tdXNpYy1rZXkvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbXVzaWMtbm90YXRpb24vYWNjaWRlbnRhbHMvc3RyLmpzIiwibm9kZV9tb2R1bGVzL211c2ljLW5vdGF0aW9uL2FycmF5L2Zyb20tcHJvcHMuanMiLCJub2RlX21vZHVsZXMvbXVzaWMtbm90YXRpb24vYXJyYXkvdG8tcHJvcHMuanMiLCJub2RlX21vZHVsZXMvbXVzaWMtbm90YXRpb24vaW50ZXJ2YWwvcGFyc2UuanMiLCJub2RlX21vZHVsZXMvbXVzaWMtbm90YXRpb24vaW50ZXJ2YWwvcmVnZXguanMiLCJub2RlX21vZHVsZXMvbXVzaWMtbm90YXRpb24vaW50ZXJ2YWwvc3RyLmpzIiwibm9kZV9tb2R1bGVzL211c2ljLW5vdGF0aW9uL21lbW9pemUuanMiLCJub2RlX21vZHVsZXMvbXVzaWMtbm90YXRpb24vbm90ZS9wYXJzZS5qcyIsIm5vZGVfbW9kdWxlcy9tdXNpYy1ub3RhdGlvbi9ub3RlL3JlZ2V4LmpzIiwibm9kZV9tb2R1bGVzL211c2ljLW5vdGF0aW9uL25vdGUvc3RyLmpzIiwibm9kZV9tb2R1bGVzL211c2ljLW5vdGF0aW9uL29wZXJhdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9tdXNpYy1ub3RhdGlvbi9waXRjaC9wYXJzZS5qcyIsIm5vZGVfbW9kdWxlcy9tdXNpYy1ub3RhdGlvbi9waXRjaC9zdHIuanMiLCJub2RlX21vZHVsZXMvbm90ZS1pbnRlcnZhbC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9ub3RlLXRyYW5zcG9zZXIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvb3Blbm11c2ljLXNsaWRlci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9waWNrLXJhbmRvbS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9waWUtYW5vL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3JlYWxseS1oaS1oYXQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvc2FmZS1yZWdpc3Rlci1lbGVtZW50L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3NjYWxlLXNlbGVjdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9zZXR0ZXItZ2V0dGVyaWZ5L21haW4uanMiLCJub2RlX21vZHVsZXMvc3BpZGVyYml0ZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy90b3VjaC1kb3duLWRhbmNlL2luZGV4LmpzIiwicHJvY2Vzc3RhYi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3VkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQy9NQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDcFFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDNWtCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOWJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFnQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIHByb2MgPSByZXF1aXJlKCcuL3Byb2Nlc3N0YWInKVxud2luZG93LkF1ZGlvQ29udGV4dCA9IHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dFxudmFyIGFjID0gbmV3IEF1ZGlvQ29udGV4dCgpXG52YXIgcGllID0gcmVxdWlyZShcInBpZS1hbm9cIilcbi8vIHZhciB1aSA9IHJlcXVpcmUoJ3dlYi1hdWRpby11aScpLmdlbmVyYXRlXG4gIHZhciBtYWluVm9sdW1lID0gYWMuY3JlYXRlR2FpbigpXG4gIG1haW5Wb2x1bWUuY29ubmVjdChhYy5kZXN0aW5hdGlvbilcbiAgbWFpblZvbHVtZS5nYWluLnNldFZhbHVlQXRUaW1lKDAuNSwgYWMuY3VycmVudFRpbWUpXG52YXIgc3ludGhzID0ge1xuICAgICAgc25hcmU6IHJlcXVpcmUoXCJkai1zbmF6enktc25hcmVcIikoYWMpLFxuICAgIGtpY2s6IHJlcXVpcmUoXCJ0b3VjaC1kb3duLWRhbmNlXCIpKGFjKSxcbiAgICBoYXQ6IHJlcXVpcmUoXCJyZWFsbHktaGktaGF0XCIpKGFjKSxcbiAgYmI6IHBpZShhYyksXG4gIHBwOiBwaWUoYWMpLFxuICBzbTogcGllKGFjKVxufVxucmVxdWlyZSgnc2NhbGUtc2VsZWN0JykucmVnaXN0ZXIoJ3NjYWxlLXNlbGVjdCcpO1xuXG5yZXF1aXJlKCdvcGVubXVzaWMtc2xpZGVyJykucmVnaXN0ZXIoJ29wZW5tdXNpYy1zbGlkZXInKTtcblxuXG5cblxuT2JqZWN0LmtleXMoc3ludGhzKS5mb3JFYWNoKGZ1bmN0aW9uKGlrKSB7XG4gICAgICBzeW50aHNbaWtdLmNvbm5lY3QobWFpblZvbHVtZSlcbiAgICAgIC8vIHZhciB0aGVfbm9kZXMgPSBzeW50aHNbaWtdLm5vZGVzKClcblxuICAgICAgLy8gdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICAvLyBjb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdpbmxpbmUtYmxvY2snXG4gICAgICAvLyBjb250YWluZXIuc3R5bGUudmVydGljYWxBbGlnbiA9ICd0b3AnXG4gICAgICAvLyBPYmplY3Qua2V5cyh0aGVfbm9kZXMpLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgIC8vICAgdmFyIGVsID0gdWkodGhlX25vZGVzW25vZGVdKVxuICAgICAgLy8gICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZWwpXG4gICAgICAvLyB9KVxuICAgICAgLy8gICB0aGVfdWkuYXBwZW5kQ2hpbGQoY29udGFpbmVyKVxuICAgIH0pXG52YXIgc2VxID0gcmVxdWlyZShcInNwaWRlcmJpdGVcIilcblxuXG52YXIgdGhlX3NvbmcgPSByZXF1aXJlKCcuL2RlbW9Tb25nJylcbnZhciBwaWNrID0gcmVxdWlyZSgncGljay1yYW5kb20nKVxudmFyIG1lcmdlID0gcmVxdWlyZSgnbWVyZ2UnKVxudmFyIGludDJmcmVxID0gcmVxdWlyZSgnaW50MmZyZXEnKVxuXG52YXIgc3EsIHRoZV91aVxuXG5kb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ3Bhc3RlJywgZnVuY3Rpb24oZSl7XG5cbiAgaWYgKHNxKSB7XG4gICAgc3Euc3RvcCgpXG4gICAgdGhlX3VpLnJlbW92ZSgpXG59IGVsc2Uge1xuICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdub3RlcycpLnJlbW92ZSgpXG4gICAgICAgdmFyIGlmcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICAgaWZyYW1lLmlubmVySFRNTCA9ICc8aWZyYW1lIHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjEwMCVcIiBjbGFzcz1cInN1cGVyLWNlbnRlclwiICBzcmM9XCJodHRwczovL3d3dy55b3V0dWJlLmNvbS9lbWJlZC9PMnVseUp1dlUzUT9hdXRvcGxheT0xXCIgZnJhbWVib3JkZXI9XCIwXCIgYWxsb3dmdWxsc2NyZWVuPjwvaWZyYW1lPidcblxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChpZnJhbWUpXG59XG5cbiAgdmFyIHNvbmcgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRoZV9zb25nKSlcblxuXG5cblxuXG5cblxuICB2YXIgZGF0YSA9IGUuY2xpcGJvYXJkRGF0YS5nZXREYXRhKCd0ZXh0L3BsYWluJyk7XG4gIHRyeSB7XG5cblxuXG5cblxuXG5cbiAgICB2YXIgc3R1ZmYgPSBwcm9jLnByb2Nlc3NUYWIoZGF0YSwgOClcbiAgICAvLyBjaG9wIHVwIHRoZSBzdHVmZnMgc29tZWhvdywgZGl2aWRlIGFtb25nIHRoZSBpbnN0cnVtZW50c1xuICAgIC8vIGp1c3QgbWFrZSBhIGJhc2UgXCJzb25nXCIgdGhpbmc/XG4gICAgY29uc29sZS5sb2coc3R1ZmYpXG4gICAgaWYgKHN0dWZmLmxlbmd0aCkge1xuICAgICAgdmFyIHJhdGlvbiA9IE1hdGguY2VpbChzdHVmZi5sZW5ndGggLyAzKVxuLy8gT2JqZWN0LmtleXMoc29uZ3MpLmZvckVhY2goZnVuY3Rpb24oc2spIHtcbi8vICAgICBPYmplY3Qua2V5cyhzb25nc1tza10uaW5zdHJ1bWVudHMpLmZvckVhY2goZnVuY3Rpb24oaWspIHtcbi8vICAgICAgICAgc29uZy5pbnN0cnVtZW50c1tpXS5wbGF5ID0gZnVuY3Rpb24gKGFyZykge1xuLy8gICAgICAgICAgIHZhciBjb25maWdzID0gc29uZ3Nbc2tdLmluc3RydW1lbnRzW2lrXS5jb25maWcgfHwge31cbi8vICAgICAgICAgICB2YXIgbXVsdGkgPSBzb25nc1tza10uaW5zdHJ1bWVudHNbaWtdLm11bHRpIHx8IDFcbi8vICAgICAgICAgICB2YXIgbm90ZSA9IHNvbmdzW3NrXS5pbnN0cnVtZW50c1tpa10ubWVsb2RpYyA/IHtmcmVxOiBpbnQyZnJlcShhcmcsIHNvbmdzW3NrXS5rZXkpICogbXVsdGl9IDoge31cblxuLy8gICAgICAgICAgIGluc3RzW2lrXS51cGRhdGUobWVyZ2Uobm90ZSwgY29uZmlncyksIGFjLmN1cnJlbnRUaW1lKVxuLy8gICAgICAgICAgIGluc3RzW2lrXS5zdGFydChhYy5jdXJyZW50VGltZSlcbi8vICAgICAgICAgfVxuLy8gICAgIH0pXG4vLyAgIH0pXG5cblxuICAgICAgT2JqZWN0LmtleXMoc29uZy5pbnN0cnVtZW50cykuZm9yRWFjaChmdW5jdGlvbiAoaSkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhpKVxuICAgICAgICBpZiAoc29uZy5pbnN0cnVtZW50c1tpXS5tZWxvZGljKSB7XG4gICAgICAgICAgc29uZy5pbnN0cnVtZW50c1tpXS5wYXR0ZXJucy52ZXJzZS5ub3RlcyA9IHBpY2soc3R1ZmYsIHtjb3VudDogcmF0aW9ufSlcbiAgICAgICAgICB2YXIgbWF4ID0gc29uZy5pbnN0cnVtZW50c1tpXS5wYXR0ZXJucy52ZXJzZS5ub3Rlcy5sZW5ndGhcbiAgICAgICAgICBzb25nLmluc3RydW1lbnRzW2ldLnBhdHRlcm5zLnZlcnNlLm5leHRzID0gc29uZy5pbnN0cnVtZW50c1tpXS5wYXR0ZXJucy52ZXJzZS5ub3Rlcy5tYXAoZnVuY3Rpb24gKGVod2hhdGV2ZXIsIGVoKSB7XG4gICAgICAgICAgICByZXR1cm4gW35+KE1hdGgucmFuZG9tICogbWF4KSwgZWgsIH5+KE1hdGgucmFuZG9tICogbWF4KV1cbiAgICAgICAgICB9KVxuICAgICAgICAgIHNvbmcuaW5zdHJ1bWVudHNbaV0ucGF0dGVybnMudmVyc2UucHJvYnMgPSBzb25nLmluc3RydW1lbnRzW2ldLnBhdHRlcm5zLnZlcnNlLm5vdGVzLm1hcChmdW5jdGlvbiAocGF0dGVybikge1xuICAgICAgICAgICAgcmV0dXJuIHBhdHRlcm4ubWFwKGZ1bmN0aW9uIChzdGVwKSB7XG4gICAgICAgICAgICAgIHJldHVybiBzdGVwLmxlbmd0aCA/IChNYXRoLnJhbmRvbSgpICogMC4yNSkgKyAwLjUgOiAwXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgc29uZy5pbnN0cnVtZW50c1tpXS5wbGF5ID0gZnVuY3Rpb24gKGFyZykge1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGkpXG4gICAgICAgICAgLy8gY29uc29sZS5sb2coc29uZy5rZXkpXG4gICAgICAgICAgdmFyIGNvbmZpZ3MgPSBzb25nLmluc3RydW1lbnRzW2ldLmNvbmZpZyB8fCB7fVxuICAgICAgICAgIHZhciBtdWx0aSA9IHNvbmcuaW5zdHJ1bWVudHNbaV0ubXVsdGkgfHwgMVxuICAgICAgICAgIHZhciBub3RlID0gc29uZy5pbnN0cnVtZW50c1tpXS5tZWxvZGljID8ge2ZyZXE6IGludDJmcmVxKGFyZywgc29uZy5rZXkpICogbXVsdGl9IDoge31cblxuICAgICAgICAgIHN5bnRoc1tpXS51cGRhdGUobWVyZ2Uobm90ZSwgY29uZmlncyksIGFjLmN1cnJlbnRUaW1lKVxuICAgICAgICAgIHN5bnRoc1tpXS5zdGFydChhYy5jdXJyZW50VGltZSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC8vIGNvbnNvbGUubG9nKHNvbmcuaW5zdHJ1bWVudHNbJ3BwJ10ucGF0dGVybnMudmVyc2UpXG5cblxuXG5cbiAgICAgIC8vIHNvbmcuaW5zdHJ1bWVudHMucHVzaCh7XG4gICAgICAvLyAgIGNvbmZpZzoge30sXG4gICAgICAvLyAgIG1lbG9kaWM6IGZhbHNlLFxuICAgICAgLy8gICBwYXR0ZXJuczoge1xuICAgICAgLy8gICAgIHZlcnNlOiB7XG4gICAgICAvLyAgICAgICBwcm9iczogW1xuICAgICAgLy8gICAgICAgICBbMSwgMCwgMCwgMF1cbiAgICAgIC8vICAgICAgIF0sXG4gICAgICAvLyAgICAgICBjdXJyZW50VmVyc2lvbjogMCxcbiAgICAgIC8vICAgICAgIGN1cnJlbnRUaWNrOiAwLFxuICAgICAgLy8gICAgICAgbW9kOiAxNixcbiAgICAgIC8vICAgICAgIG5leHRzOiBbWzBdXVxuICAgICAgLy8gICAgIH1cbiAgICAgIC8vICAgfSxcbiAgICAgIC8vICAgcGxheTogZnVuY3Rpb24gKGFyZykge1xuICAgICAgLy8gICAgIHZhciBtc2cgPSBuZXcgU3BlZWNoU3ludGhlc2lzVXR0ZXJhbmNlKCdIZWxsbyBXb3JsZCcpO1xuICAgICAgLy8gICAgIHdpbmRvdy5zcGVlY2hTeW50aGVzaXMuc3BlYWsobXNnKTtcbiAgICAgIC8vICAgfVxuICAgICAgLy8gfSlcblxuXG5cblxuXG5cblxuXG5cblxuXG4gICAgICB0aGVfdWkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxudGhlX3VpLmlkID0gJ21haW4nXG50aGVfdWkuY2xhc3NOYW1lID0gXCJzdXBlci1zaW1wbGUgbGF5b3ZlclwiXG5cbiAgICAgIHNxID0gc2VxKHNvbmcpXG5jb25zb2xlLmxvZyhzcSlcbnZhciBtc2cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoNCcpXG5tc2cudGV4dENvbnRlbnQgPSAnUk9DSyBPTiwgS0VZQk9BUkQgQ0FUISdcbnRoZV91aS5hcHBlbmRDaGlsZChtc2cpXG5cbnZhciBzY2FsZVNlbGVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjYWxlLXNlbGVjdCcpXG50aGVfdWkuYXBwZW5kQ2hpbGQoc2NhbGVTZWxlY3QpXG5cblxuc2NhbGVTZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcigndG9uaWMnLCBmdW5jdGlvbihldikge1xuICAvLyBkbyBzb21ldGhpbmdcbiAgdmFyIHRvbmljID0gZXYuZGV0YWlsLnZhbHVlIC8vIHdpbGwgYmUgXCJDXCIgb3IgXCJEI1wiIG9yIHdoYXQgaGF2ZSB5b3VcbiAgc29uZy5rZXkudG9uaWMgPSB0b25pYyArIDNcbiAgLy8gc3Euc3RvcCgpXG4gIHNxLnVwZGF0ZVNvbmcoc29uZylcbiAgLy8gc3Euc3RhcnQoKVxufSk7XG5zY2FsZVNlbGVjdC5hZGRFdmVudExpc3RlbmVyKCdzY2FsZScsIGZ1bmN0aW9uKGV2KSB7XG4gIC8vIGRvIHNvbWV0aGluZywgZm9yIGV4YW1wbGUgbWF5YmU6XG4gIHZhciBzY2FsZSA9IGV2LmRldGFpbC52YWx1ZSAvLyB3aWxsIGJlIFwibWFqb3JcIiBvciBcInBlbnRNYWpcIiBvciB3aGF0IGhhdmUgeW91XG4gIHNvbmcua2V5LnNjYWxlID0gc2NhbGVcbiAgLy8gc3Euc3RvcCgpXG4gIGNvbnNvbGUubG9nKHNxKVxuICBzcS51cGRhdGVTb25nKHNvbmcpXG4gIC8vIHNxLnN0YXJ0KClcbn0pO1xuXG52YXIgY29vbFNsaWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wZW5tdXNpYy1zbGlkZXInKTtcbmNvb2xTbGlkZXIubWluID0gNTBcbmNvb2xTbGlkZXIubWF4ID0gMzAwXG5jb25zb2xlLmxvZyhjb29sU2xpZGVyKVxuY29vbFNsaWRlci52YWx1ZSA9IDMyMFxudGhlX3VpLmFwcGVuZENoaWxkKGNvb2xTbGlkZXIpO1xuXG5jb29sU2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uIChldikge1xuICBjb25zb2xlLmxvZyhldilcbiAgY29uc29sZS5sb2coJ3dob2EnKVxuICBzb25nLmJwbSA9IH5+ZXYudGFyZ2V0LnZhbHVlICogMlxuICBzcS5zdG9wKClcbiAgc3EudXBkYXRlU29uZyhzb25nKVxuICBzcS5zdGFydCgpXG59KVxuXG5cblxuXG5cbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhlX3VpKVxuXG5cblxuXG5cblxuXG5cblxuXG4gICAgICBzcS5zdGFydCgpXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiTk9USElORyBUSEVSRT9cIilcbiAgICAgIC8vIGFsZXJ0KCdjb3VsZCBub3QgZmluZCB5byBkYXRhJylcbiAgICB9XG5cblxuXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmxvZyhlKVxuICAgIGFsZXJ0KCd2ZXJ5IHNvcnJ5LCBzb21ldGhpbmcgYnJva2UsIG5vdCB0byB3b3JyeSwgcmVmcmVzaCB0aGUgcGFnZSBhbmQgcGVyaGFwcyBhbm90aGVyIGd1aXRhciBvciBiYXNzIHRhYiB3aWxsIHdvcmsgYmV0dGVyPycpXG4gIH1cbn0pOyIsIm1vZHVsZS5leHBvcnRzPXtcbiAgaW5zdHJ1bWVudHM6IHtcbiAgICAgICAga2ljazoge1xuICAgICAgY29uZmlnOiB7XG4gICAgICAgIGZyZXE6IDEwMCxcbiAgICAgICAgZW5kRnJlcTogMzAsXG4gICAgICAgIGF0dGFjazogMC4wMDAwMDAwMDAwMDAwMDAwMDAwMDEsXG4gICAgICAgIGRlY2F5OiAwLjAxLFxuICAgICAgICBzdXN0YWluOiAwLjEyLFxuICAgICAgICByZWxlYXNlOiAwLjEzLFxuICAgICAgICBwZWFrOiAwLjc5NSxcbiAgICAgICAgbWlkOiAwLjU2NSxcbiAgICAgICAgZW5kOiAwLjAwMDAwMDAwMDAwMDAwMDAwMDAwMVxuICAgICAgfSxcbiAgICAgIHBhdHRlcm5zOiB7XG4gICAgICAgIHZlcnNlOiB7XG4gICAgICAgICAgcHJvYnM6IFtcbiAgICAgICAgICAgIFsxLCAwLCAxLCAwXSxcbiAgICAgICAgICAgIFsxLCAwLjUsIDEsIDBdLFxuICAgICAgICAgICAgWzEsIDAsIDAsIDBdLFxuXG4gICAgICAgICAgICBbMSwgMSwgMCwgMV0sXG4gICAgICAgICAgICBbMSwgMC41LCAwLCAwLjk3NV0sXG4gICAgICAgICAgICBbMSwgMC45NSwgMC4xLCAxXSxcbiAgICAgICAgICAgIFsxLCAwLjEyNSwgMC4wMSwgMC4wMjVdLFxuICAgICAgICAgICAgWzAsIDAuMDE1LCAwLjcyNSwgMC43NV0sXG4gICAgICAgICAgICBbMSwgMC4wMTUsIDAuNTEsIDAuMDFdXG4gICAgICAgICAgXSxcbiAgICAgICAgICBjdXJyZW50VmVyc2lvbjogMCxcbiAgICAgICAgICBjdXJyZW50VGljazogMCxcbiAgICAgICAgICBtb2Q6IDIsXG4gICAgICAgICAgbmV4dHM6IFtbMCwgMSw0LDZdLCBbMSwgNSwgMCwgMl0sIFsyLCA3LCAwXSxbMCwgMSwgNiwgM10sIFsxLCA3LCA1LCAyXSwgWzQsIDQsIDBdLFs1LDYsN10sIFsyLDQsOF0sIFsxLDMsOF1dXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGhhdDoge1xuICAgICAgY29uZmlnOiB7XG4gICAgICAgIHBlYWs6IDAuOTcxLFxuICAgICAgICBtaWQ6IDAuODVcbiAgICAgIH0sXG4gICAgICBwYXR0ZXJuczoge1xuICAgICAgICB2ZXJzZToge1xuICAgICAgICAgIHByb2JzOiBbXG4gICAgICAgICAgICBbMCwgMC45NSwgMCwgMC45NV0sXG4gICAgICAgICAgICBbMC4xNTEsIDAuOTUsIDAuMTUxLCAwLjk3NV0sXG4gICAgICAgICAgICBbMCwgMSwgMC4yNSwgMC45NV0sXG4gICAgICAgICAgICBbMC4zMSwgMC45NzI1LCAwLjMxLCAwLjk3MjVdLFxuICAgICAgICAgICAgWzAuOSwgMC4yNzUsIDAuOTAyNSwgMC4yNzVdLFxuICAgICAgICAgICAgWzAuOTIsIDAuOTgsIDAuMTIsIDAuMThdLFxuICAgICAgICAgICAgWzAuMzEsIDAuMjUsIDAuOTMxLCAwLjkyNV0sXG4gICAgICAgICAgICBbMCwgMC45NSwgMC45MjUsIDAuNzVdLFxuICAgICAgICAgICAgWzAuOTMxLCAwLjUsIDAuMzEsIDAuOTMxXVxuICAgICAgICAgIF0sXG4gICAgICAgICAgY3VycmVudFZlcnNpb246IDAsXG4gICAgICAgICAgY3VycmVudFRpY2s6IDAsXG4gICAgICAgICAgbW9kOiAxLFxuICAgICAgICAgIG5leHRzOiBbWzAsIDEsMiw0LDZdLCAgWzEsIDcsIDUsIDJdLCBbMSwgNSwgMCwgMl0sIFsyLCA3LDMsMSwgMF0sWzAsIDEsIDYsIDNdLCBbMiw0LDgsNV0sIFs0LCA0LCAwXSxbNSw2LDddLFsxLDMsOF1dXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHNuYXJlOiB7XG4gICAgICBjb25maWc6IHtcbiAgICAgICAgZnJlcTogMjAwLCAvLyBmb3IgdGhlIHRyaWFuZ2xlIG9zY2lsbGF0b3JcbiAgICAgICAgbm9pc2VhdHRhY2s6IDAuMDAwMDAxLFxuICAgICAgICBub2lzZWRlY2F5OiAwLjAwMDAwMSxcbiAgICAgICAgbm9pc2VzdXN0YWluOiAwLjE3NSxcbiAgICAgICAgbm9pc2VyZWxlYXNlOiAwLjEyNSxcbiAgICAgICAgbm9pc2VwZWFrOiAwLjEyMTIzNDI1LFxuICAgICAgICBub2lzZW1pZDogMC4wNzEzNDEyMTUsXG4gICAgICAgIG5vaXNlZW5kOiAwLjAwMDAwMSxcbiAgICAgICAgdHJpYXR0YWNrOiAwLjAwMDAwMDEsXG4gICAgICAgIHRyaWRlY2F5OiAwLjAwMDAwMDAxLFxuICAgICAgICB0cmlzdXN0YWluOiAwLjExNzUsXG4gICAgICAgIHRyaXJlbGVhc2U6IDAuMTI1LFxuICAgICAgICB0cmlwZWFrOiAwLjEyMzI0ODcsXG4gICAgICAgIHRyaW1pZDogMC4xMTIxMzc1LFxuICAgICAgICB0cmllbmQ6IDAuMDAwMDAxXG4gICAgICB9LFxuICAgICAgcGF0dGVybnM6IHtcbiAgICAgICAgdmVyc2U6IHtcbiAgICAgICAgICBwcm9iczogW1xuICAgICAgICAgICAgWzAsIDAsIDAuOTc1LCAwLjEyNV0sXG4gICAgICAgICAgICBbMCwgMCwgMSwgMF0sXG4gICAgICAgICAgICBbMCwgMC4xLCAwLjk3LCAwLjFdLFxuICAgICAgICAgICAgWzEsIDAuNzI1LCAwLjIxLCAwLjAxMjVdLFxuICAgICAgICAgICAgWzAsIDAuMDUsIDAuOTcyNSwgMC4wNzVdLFxuICAgICAgICAgICAgWzAuMSwgMC43NSwgMC40MSwgMC4wMV0sXG4gICAgICAgICAgICBbMC4wMjUsIDAuMDEsIDEsIDAuMDI1XSxcbiAgICAgICAgICAgIFswLCAwLjA1LCAwLjk3MjUsIDAuNzVdLFxuICAgICAgICAgICAgWzAsIDAuNzUsIDEsIDBdXG4gICAgICAgICAgXSxcbiAgICAgICAgICBjdXJyZW50VmVyc2lvbjogMCxcbiAgICAgICAgICBjdXJyZW50VGljazogMCxcbiAgICAgICAgICBtb2Q6IDIsXG4gICAgICAgICAgbmV4dHM6IFtbMCwgMSwyLDQsNl0sICBbMSwgNywgNSwgMl0sIFsyLDQsOCw1XSwgWzAsIDEsIDYsIDNdLFs1LDYsN10sWzQsIDQsIDBdLCBbMSwgNSwgMCwgMl0sIFsyLCA3LDMsMSwgMF0sWzEsMyw4XV1cblxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBwcDoge1xuICAgICAgY29uZmlnOiB7XG4gICAgICAgIGF0dGFjazogMC4xNTEzLFxuICAgICAgICBkZWNheTogMC4xLFxuICAgICAgICBzdXN0YWluOiAwLjE1MTMsXG4gICAgICAgIHJlbGVhc2U6IDAuMTI1LFxuICAgICAgICBwZWFrOiAwLjY1MjM0NSxcbiAgICAgICAgbWlkOiAwLjQyMyxcbiAgICAgICAgZW5kOiAwLjAwNTF9LFxuICAgICAgbGVhZDogdHJ1ZSxcbiAgICAgIG1lbG9kaWM6IHRydWUsXG4gICAgICBtdWx0aTogMSxcbiAgICAgIHBhdHRlcm5zOiB7XG4gICAgICAgIHZlcnNlOiB7XG4gICAgICAgICAgbm90ZXM6IFtdLFxuICAgICAgICAgIHByb2JzOiBbXSxcbiAgICAgICAgICBjdXJyZW50VmVyc2lvbjogMCxcbiAgICAgICAgICBjdXJyZW50VGljazogMCxcbiAgICAgICAgICBtb2Q6IDIsXG4gICAgICAgICAgbmV4dHM6IFtdXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGJiOiB7XG4gICAgICBjb25maWc6IHtcbiAgICAgICAgYXR0YWNrOiAwLjA2MTMsXG4gICAgICAgIGRlY2F5OiAwLjEsXG4gICAgICAgIHN1c3RhaW46IDAuMDUxNTEzLFxuICAgICAgICByZWxlYXNlOiAwLjA1MTM1LFxuICAgICAgICBwZWFrOiAwLjIxMTM0NSxcbiAgICAgICAgbWlkOiAwLjEwOTEyMyxcbiAgICAgICAgZW5kOiAwLjAwMDA1MX0sXG4gICAgICBtZWxvZGljOiB0cnVlLFxuICAgICAgbXVsdGk6IDIsXG4gICAgICBwYXR0ZXJuczoge1xuICAgICAgICB2ZXJzZToge1xuICAgICAgICAgIG5vdGVzOiBbXSxcbiAgICAgICAgICBwcm9iczogW10sXG4gICAgICAgICAgY3VycmVudFZlcnNpb246IDAsXG4gICAgICAgICAgY3VycmVudFRpY2s6IDAsXG4gICAgICAgICAgbW9kOiAxLFxuICAgICAgICAgIG5leHRzOiBbXVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBzbToge1xuICAgICAgY29uZmlnOiB7XG4gICAgICAgIGF0dGFjazogMC4zLFxuICAgICAgICBkZWNheTogMC4zMSxcbiAgICAgICAgc3VzdGFpbjogMC4yMTMsXG4gICAgICAgIHJlbGVhc2U6IDAuMjE1LFxuICAgICAgICBwZWFrOiAwLjEyMzQ1LFxuICAgICAgICBtaWQ6IDAuMDUxMTEyMyxcbiAgICAgICAgZW5kOiAwLjAwMDAwMDUxfSxcbiAgICAgIG11bHRpOiAyLFxuICAgICAgbWVsb2RpYzogdHJ1ZSxcbiAgICAgIHBhdHRlcm5zOiB7XG4gICAgICAgIHZlcnNlOiB7XG4gICAgICAgICAgbm90ZXM6IFtdLFxuICAgICAgICAgIHByb2JzOiBbXSxcbiAgICAgICAgICBjdXJyZW50VmVyc2lvbjogMCxcbiAgICAgICAgICBjdXJyZW50VGljazogMCxcbiAgICAgICAgICBtb2Q6IDQsXG4gICAgICAgICAgbmV4dHM6IFtdXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgfSxcbiAgY3VycmVudDogXCJ2ZXJzZVwiLFxuICBuZXh0czoge1xuICAgIHZlcnNlOiBbXCJ2ZXJzZVwiXVxuICB9LFxuICBicG06IDE3NSxcbiAga2V5OiB7XG4gICAgdG9uaWM6IFwiRDNcIixcbiAgICBzY2FsZTogXCJtYWpvclwiXG4gIH1cbn0iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChnYWluTm9kZSwgd2hlbiwgYWRzcikge1xuICBnYWluTm9kZS5nYWluLmV4cG9uZW50aWFsUmFtcFRvVmFsdWVBdFRpbWUoYWRzci5wZWFrLCB3aGVuICsgYWRzci5hdHRhY2spXG4gIGdhaW5Ob2RlLmdhaW4uZXhwb25lbnRpYWxSYW1wVG9WYWx1ZUF0VGltZShhZHNyLm1pZCwgd2hlbiArIGFkc3IuYXR0YWNrICsgYWRzci5kZWNheSlcbiAgZ2Fpbk5vZGUuZ2Fpbi5zZXRWYWx1ZUF0VGltZShhZHNyLm1pZCwgd2hlbiArIGFkc3Iuc3VzdGFpbiArIGFkc3IuYXR0YWNrICsgYWRzci5kZWNheSlcbiAgZ2Fpbk5vZGUuZ2Fpbi5leHBvbmVudGlhbFJhbXBUb1ZhbHVlQXRUaW1lKGFkc3IuZW5kLCB3aGVuICsgYWRzci5zdXN0YWluICsgYWRzci5hdHRhY2sgKyBhZHNyLmRlY2F5ICsgYWRzci5yZWxlYXNlKVxufVxuIiwidmFyIG1ha2VEaXN0b3J0aW9uQ3VydmUgPSByZXF1aXJlKCdtYWtlLWRpc3RvcnRpb24tY3VydmUnKVxudmFyIGFkc3IgPSByZXF1aXJlKCdhLWQtcy1yJylcbi8vIHlyIGZ1bmN0aW9uIHNob3VsZCBhY2NlcHQgYW4gYXVkaW9Db250ZXh0LCBhbmQgb3B0aW9uYWwgcGFyYW1zL29wdHNcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGFjLCBvcHRzKSB7XG4gIC8vIG1ha2Ugc29tZSBhdWRpb05vZGVzLCBjb25uZWN0IHRoZW0sIHN0b3JlIHRoZW0gb24gdGhlIG9iamVjdFxuICB2YXIgYXVkaW9Ob2RlcyA9IHtcbiAgICBub2lzZUJ1ZmZlcjogYWMuY3JlYXRlQnVmZmVyKDEsIGFjLnNhbXBsZVJhdGUsIGFjLnNhbXBsZVJhdGUpLFxuICAgIG5vaXNlRmlsdGVyOiBhYy5jcmVhdGVCaXF1YWRGaWx0ZXIoKSxcbiAgICBub2lzZUVudmVsb3BlOiBhYy5jcmVhdGVHYWluKCksXG4gICAgb3NjOiBhYy5jcmVhdGVPc2NpbGxhdG9yKCksXG4gICAgb3NjZGlzdG9ydGlvbjogYWMuY3JlYXRlV2F2ZVNoYXBlcigpLFxuICAgIG9zY0VudmVsb3BlOiBhYy5jcmVhdGVHYWluKCksXG4gICAgY29tcHJlc3NvcjogYWMuY3JlYXRlRHluYW1pY3NDb21wcmVzc29yKCksXG4gICAgZGlzdG9ydGlvbjogYWMuY3JlYXRlV2F2ZVNoYXBlcigpLFxuICAgIG1haW5GaWx0ZXI6IGFjLmNyZWF0ZUJpcXVhZEZpbHRlcigpLFxuICAgIGhpZ2hGaWx0ZXI6IGFjLmNyZWF0ZUJpcXVhZEZpbHRlcigpLFxuICAgIHZvbHVtZTogYWMuY3JlYXRlR2FpbigpLFxuICAgIHNldHRpbmdzOiB7XG4gICAgICBmcmVxOiAyMDAsXG4gICAgICBub2lzZWF0dGFjazogMC4wMDAwMDEsXG4gICAgICBub2lzZWRlY2F5OiAwLjAwMDAwMSxcbiAgICAgIG5vaXNlc3VzdGFpbjogMC4xMTc1LFxuICAgICAgbm9pc2VyZWxlYXNlOiAwLjEyNSxcbiAgICAgIG5vaXNlcGVhazogMC40MjUsXG4gICAgICBub2lzZW1pZDogMC40MTIxNSxcbiAgICAgIG5vaXNlZW5kOiAwLjAwMDAwMSxcbiAgICAgIHRyaWF0dGFjazogMC4wMDAwMDAxLFxuICAgICAgdHJpZGVjYXk6IDAuMDAwMDAwMDEsXG4gICAgICB0cmlzdXN0YWluOiAwLjExNzUsXG4gICAgICB0cmlyZWxlYXNlOiAwLjEyNSxcbiAgICAgIHRyaXBlYWs6IDAuODcsXG4gICAgICB0cmltaWQ6IDAuNzUsXG4gICAgICB0cmllbmQ6IDAuMDAwMDAxXG4gICAgfVxuICB9XG4vLyBzZXQgYWxsIHRoZSB0aGluZ3NcbiAgdmFyIG91dHB1dCA9IGF1ZGlvTm9kZXMubm9pc2VCdWZmZXIuZ2V0Q2hhbm5lbERhdGEoMClcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhYy5zYW1wbGVSYXRlOyBpKyspIHtcbiAgICBvdXRwdXRbaV0gPSBNYXRoLnJhbmRvbSgpICogMiAtIDFcbiAgfVxuXG4gIGF1ZGlvTm9kZXMubm9pc2VGaWx0ZXIudHlwZSA9ICdoaWdocGFzcydcbiAgYXVkaW9Ob2Rlcy5ub2lzZUZpbHRlci5mcmVxdWVuY3kuc2V0VmFsdWVBdFRpbWUoMTAwMCwgYWMuY3VycmVudFRpbWUpXG5cbiAgYXVkaW9Ob2Rlcy5ub2lzZUVudmVsb3BlLmdhaW4uc2V0VmFsdWVBdFRpbWUoMC4wMDAwMSwgYWMuY3VycmVudFRpbWUpXG5cbiAgYXVkaW9Ob2Rlcy5vc2MudHlwZSA9ICd0cmlhbmdsZSdcbiAgYXVkaW9Ob2Rlcy5vc2NkaXN0b3J0aW9uLmN1cnZlID0gbWFrZURpc3RvcnRpb25DdXJ2ZSgxMDAwKVxuICBhdWRpb05vZGVzLm9zY2Rpc3RvcnRpb24ub3ZlcnNhbXBsZSA9ICc0eCdcblxuICBhdWRpb05vZGVzLm9zY0VudmVsb3BlLmdhaW4uc2V0VmFsdWVBdFRpbWUoMC4wMDAwMSwgYWMuY3VycmVudFRpbWUpXG5cbiAgYXVkaW9Ob2Rlcy5jb21wcmVzc29yLnRocmVzaG9sZC52YWx1ZSA9IC0xNVxuICBhdWRpb05vZGVzLmNvbXByZXNzb3Iua25lZS52YWx1ZSA9IDMzXG4gIGF1ZGlvTm9kZXMuY29tcHJlc3Nvci5yYXRpby52YWx1ZSA9IDVcbiAgYXVkaW9Ob2Rlcy5jb21wcmVzc29yLnJlZHVjdGlvbi52YWx1ZSA9IC0xMFxuICBhdWRpb05vZGVzLmNvbXByZXNzb3IuYXR0YWNrLnZhbHVlID0gMC4wMDVcbiAgYXVkaW9Ob2Rlcy5jb21wcmVzc29yLnJlbGVhc2UudmFsdWUgPSAwLjE1MFxuXG4gIGF1ZGlvTm9kZXMuZGlzdG9ydGlvbi5jdXJ2ZSA9IG1ha2VEaXN0b3J0aW9uQ3VydmUoMjIyKVxuICBhdWRpb05vZGVzLmRpc3RvcnRpb24ub3ZlcnNhbXBsZSA9ICcyeCdcblxuICBhdWRpb05vZGVzLm1haW5GaWx0ZXIudHlwZSA9ICdwZWFraW5nJ1xuICBhdWRpb05vZGVzLm1haW5GaWx0ZXIuZnJlcXVlbmN5LnZhbHVlID0gMjUwXG4gIGF1ZGlvTm9kZXMubWFpbkZpbHRlci5nYWluLnZhbHVlID0gMS41XG4gIGF1ZGlvTm9kZXMubWFpbkZpbHRlci5RLnZhbHVlID0gMjVcblxuICBhdWRpb05vZGVzLmhpZ2hGaWx0ZXIudHlwZSA9ICdwZWFraW5nJ1xuICBhdWRpb05vZGVzLmhpZ2hGaWx0ZXIuZnJlcXVlbmN5LnZhbHVlID0gOTAwMFxuICBhdWRpb05vZGVzLmhpZ2hGaWx0ZXIuUS52YWx1ZSA9IDI1XG4vLyBjb25uZWN0IHRoZSBncmFwaFxuICBhdWRpb05vZGVzLm5vaXNlRmlsdGVyLmNvbm5lY3QoYXVkaW9Ob2Rlcy5ub2lzZUVudmVsb3BlKVxuICBhdWRpb05vZGVzLm9zYy5jb25uZWN0KGF1ZGlvTm9kZXMub3NjZGlzdG9ydGlvbilcbiAgYXVkaW9Ob2Rlcy5vc2NkaXN0b3J0aW9uLmNvbm5lY3QoYXVkaW9Ob2Rlcy5vc2NFbnZlbG9wZSlcbiAgYXVkaW9Ob2Rlcy5ub2lzZUVudmVsb3BlLmNvbm5lY3QoYXVkaW9Ob2Rlcy5jb21wcmVzc29yKVxuICBhdWRpb05vZGVzLm9zY0VudmVsb3BlLmNvbm5lY3QoYXVkaW9Ob2Rlcy5jb21wcmVzc29yKVxuICBhdWRpb05vZGVzLmNvbXByZXNzb3IuY29ubmVjdChhdWRpb05vZGVzLmRpc3RvcnRpb24pXG4gIGF1ZGlvTm9kZXMuZGlzdG9ydGlvbi5jb25uZWN0KGF1ZGlvTm9kZXMubWFpbkZpbHRlcilcbiAgYXVkaW9Ob2Rlcy5tYWluRmlsdGVyLmNvbm5lY3QoYXVkaW9Ob2Rlcy5oaWdoRmlsdGVyKVxuICBhdWRpb05vZGVzLmhpZ2hGaWx0ZXIuY29ubmVjdChhdWRpb05vZGVzLnZvbHVtZSlcbi8vIHN0YXJ0IGl0IHVwXG4gIGF1ZGlvTm9kZXMudm9sdW1lLmdhaW4uc2V0VmFsdWVBdFRpbWUoMC41LCBhYy5jdXJyZW50VGltZSlcbiAgYXVkaW9Ob2Rlcy5vc2Muc3RhcnQoYWMuY3VycmVudFRpbWUpXG4vLyBSRUFEWSAyIHJldHVybiBUSElTIFRISU5HIEIpICpOSUNFKlxuICByZXR1cm4ge1xuICAgIGNvbm5lY3Q6IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgYXVkaW9Ob2Rlcy52b2x1bWUuY29ubmVjdChpbnB1dClcbiAgICB9LFxuICAgIHN0YXJ0OiBmdW5jdGlvbiAod2hlbikge1xuICAgICAgdmFyIG5vaXNlID0gYWMuY3JlYXRlQnVmZmVyU291cmNlKClcbiAgICAgIG5vaXNlLmJ1ZmZlciA9IGF1ZGlvTm9kZXMubm9pc2VCdWZmZXJcbiAgICAgIG5vaXNlLmNvbm5lY3QoYXVkaW9Ob2Rlcy5ub2lzZUZpbHRlcilcbiAgICAgIG5vaXNlLnN0YXJ0KHdoZW4pXG4gICAgICBhZHNyKGF1ZGlvTm9kZXMubm9pc2VFbnZlbG9wZSwgd2hlbiwgbWFrZUFEU1IoJ25vaXNlJywgYXVkaW9Ob2Rlcy5zZXR0aW5ncykpXG4gICAgICBhZHNyKGF1ZGlvTm9kZXMub3NjRW52ZWxvcGUsIHdoZW4sIG1ha2VBRFNSKCd0cmknLCBhdWRpb05vZGVzLnNldHRpbmdzKSlcbiAgICAgIGF1ZGlvTm9kZXMub3NjLmZyZXF1ZW5jeS5zZXRWYWx1ZUF0VGltZShhdWRpb05vZGVzLnNldHRpbmdzLmZyZXEsIHdoZW4pXG4gICAgfSxcbiAgICBzdG9wOiBmdW5jdGlvbiAod2hlbikge1xuICAgICAgYXVkaW9Ob2Rlcy5vc2Muc3RvcCh3aGVuKVxuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAob3B0cykge1xuICAgICAgT2JqZWN0LmtleXMob3B0cykuZm9yRWFjaChmdW5jdGlvbiAoaykge1xuICAgICAgICBhdWRpb05vZGVzLnNldHRpbmdzW2tdID0gb3B0c1trXVxuICAgICAgfSlcbiAgICB9LFxuICAgIG5vZGVzOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gYXVkaW9Ob2Rlc1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBtYWtlQURTUiAodHlwZSwgc2V0dGluZ3MpIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKHNldHRpbmdzKS5maWx0ZXIoZnVuY3Rpb24gKGspIHtcbiAgICByZXR1cm4gISFrLm1hdGNoKHR5cGUpXG4gIH0pLm1hcChmdW5jdGlvbiAoaykge1xuICAgIHJldHVybiBrLnJlcGxhY2UodHlwZSwgJycpXG4gIH0pLnJlZHVjZShmdW5jdGlvbiAobywgaykge1xuICAgIG9ba10gPSBzZXR0aW5nc1t0eXBlICsga11cbiAgICByZXR1cm4gb1xuICB9LCB7fSlcbn1cbiIsInZhciBzY2FsZXMgPSB7XG4gIG1ham9yOiBbMiwgMiwgMSwgMiwgMiwgMiwgMV0sXG4gIG1pbm9yOiBbMiwgMSwgMiwgMiwgMSwgMiwgMl0sXG4gIHBlbnRNYWo6IFsyLCAyLCAzLCAyLCAzXSxcbiAgcGVudE1pbjogWzMsIDIsIDIsIDMsIDJdLFxuICBibHVlczogWzMsIDIsIDEsIDEsIDMsIDJdXG59XG5cbnZhciBzdHIyZnJlcSA9IHtcbiAgJ0EwJzogMjcuNTAwMCwgJ0EjMCc6IDI5LjEzNTIsICdCMCc6IDMwLjg2NzcsICdDMSc6IDMyLjcwMzIsICdDIzEnOiAzNC42NDc4LFxuICAnRDEnOiAzNi43MDgxLCAnRCMxJzogMzguODkwOSwgJ0UxJzogNDEuMjAzNCwgJ0YxJzogNDMuNjUzNSwgJ0YjMSc6IDQ2LjI0OTMsXG4gICdHMSc6IDQ4Ljk5OTQsICdHIzEnOiA1MS45MTMxLCAnQTEnOiA1NS4wMDAwLCAnQSMxJzogNTguMjcwNSwgJ0IxJzogNjEuNzM1NCxcbiAgJ0MyJzogNjUuNDA2NCwgJ0MjMic6IDY5LjI5NTcsICdEMic6IDczLjQxNjIsICdEIzInOiA3Ny43ODE3LCAnRTInOiA4Mi40MDY5LFxuICAnRjInOiA4Ny4zMDcxLCAnRiMyJzogOTIuNDk4NiwgJ0cyJzogOTcuOTk4OSwgJ0cjMic6IDEwMy44MjYsICdBMic6IDExMC4wMDAsXG4gICdBIzInOiAxMTYuNTQxLCAnQjInOiAxMjMuNDcxLCAnQzMnOiAxMzAuODEzLCAnQyMzJzogMTM4LjU5MSwgJ0QzJzogMTQ2LjgzMixcbiAgJ0QjMyc6IDE1NS41NjMsICdFMyc6IDE2NC44MTQsICdGMyc6IDE3NC42MTQsICdGIzMnOiAxODQuOTk3LCAnRzMnOiAxOTUuOTk4LFxuICAnRyMzJzogMjA3LjY1MiwgJ0EzJzogMjIwLjAwMCwgJ0EjMyc6IDIzMy4wODIsICdCMyc6IDI0Ni45NDIsICdDNCc6IDI2MS42MjYsXG4gICdDIzQnOiAyNzcuMTgzLCAnRDQnOiAyOTMuNjY1LCAnRCM0JzogMzExLjEyNywgJ0U0JzogMzI5LjYyOCwgJ0Y0JzogMzQ5LjIyOCxcbiAgJ0YjNCc6IDM2OS45OTQsICdHNCc6IDM5MS45OTUsICdHIzQnOiA0MTUuMzA1LCAnQTQnOiA0NDAuMDAwLCAnQSM0JzogNDY2LjE2NCxcbiAgJ0I0JzogNDkzLjg4MywgJ0M1JzogNTIzLjI1MSwgJ0MjNSc6IDU1NC4zNjUsICdENSc6IDU4Ny4zMzAsICdEIzUnOiA2MjIuMjU0LFxuICAnRTUnOiA2NTkuMjU1LCAnRjUnOiA2OTguNDU2LCAnRiM1JzogNzM5Ljk4OSwgJ0c1JzogNzgzLjk5MSwgJ0cjNSc6IDgzMC42MDksXG4gICdBNSc6IDg4MC4wMDAsICdBIzUnOiA5MzIuMzI4LCAnQjUnOiA5ODcuNzY3LCAnQzYnOiAxMDQ2LjUwLCAnQyM2JzogMTEwOC43MyxcbiAgJ0Q2JzogMTE3NC42NiwgJ0QjNic6IDEyNDQuNTEsICdFNic6IDEzMTguNTEsICdGNic6IDEzOTYuOTEsICdGIzYnOiAxNDc5Ljk4LFxuICAnRzYnOiAxNTY3Ljk4LCAnRyM2JzogMTY2MS4yMiwgJ0E2JzogMTc2MC4wMCwgJ0EjNic6IDE4NjQuNjYsICdCNic6IDE5NzUuNTMsXG4gICdDNyc6IDIwOTMuMDAsICdDIzcnOiAyMjE3LjQ2LCAnRDcnOiAyMzQ5LjMyLCAnRCM3JzogMjQ4OS4wMiwgJ0U3JzogMjYzNy4wMixcbiAgJ0Y3JzogMjc5My44MywgJ0YjNyc6IDI5NTkuOTYsICdHNyc6IDMxMzUuOTYsICdHIzcnOiAzMzIyLjQ0LCAnQTcnOiAzNTIwLjAwLFxuICAnQSM3JzogMzcyOS4zMSwgJ0I3JzogMzk1MS4wNywgJ0M4JzogNDE4Ni4wMVxufVxuXG52YXIgbm90ZXMgPSBPYmplY3Qua2V5cyhzdHIyZnJlcSlcblxuZnVuY3Rpb24gaW50MmZyZXEoaW50Tm90ZSwgb3B0aW9ucyl7XG4gIHZhciBpbmRleCwgc2NhbGU7XG4gIGlmKChpbmRleCA9IG5vdGVzLmluZGV4T2Yob3B0aW9ucy50b25pYykpID09PSAtMSkgdGhyb3cgJ3doYXQgaXMgdXAgd2l0aCB0aGF0IHRvbmljPydcbiAgaWYoIShzY2FsZSA9IHNjYWxlc1tvcHRpb25zLnNjYWxlXSkpIHRocm93ICd3aGF0IGlzIHVwIHdpdGggdGhhdCBzY2FsZT8nXG4gIHdoaWxlIChNYXRoLmFicyhpbnROb3RlKSA+IHNjYWxlLmxlbmd0aCkgc2NhbGUgPSBzY2FsZS5jb25jYXQoc2NhbGUpXG4gIGlmKGludE5vdGUgPj0gMCkgZm9yICh2YXIgaSA9IDA7IGkgPCBpbnROb3RlOyBpbmRleCArPSBzY2FsZVtpXSwgaSs9IDEgKXt9XG4gIGVsc2UgZm9yICh2YXIgaiA9IC0xOyBqID49IGludE5vdGU7IGluZGV4IC09IHNjYWxlW3NjYWxlLmxlbmd0aCArIGpdLCBqLT0gMSl7fVxuICByZXR1cm4gc3RyMmZyZXFbbm90ZXNbaW5kZXhdXVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGludDJmcmVxXG5tb2R1bGUuZXhwb3J0cy5zY2FsZXMgPSBPYmplY3Qua2V5cyhzY2FsZXMpXG5tb2R1bGUuZXhwb3J0cy5ub3RlcyA9IE9iamVjdC5rZXlzKG5vdGVzKSIsIi8qKlxuICogbG9kYXNoIDQuMi4wIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgalF1ZXJ5IEZvdW5kYXRpb24gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyA8aHR0cHM6Ly9qcXVlcnkub3JnLz5cbiAqIFJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqL1xuXG4vKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFyZ3NUYWcgPSAnW29iamVjdCBBcmd1bWVudHNdJyxcbiAgICBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcbiAgICBnZW5UYWcgPSAnW29iamVjdCBHZW5lcmF0b3JGdW5jdGlvbl0nO1xuXG4vKipcbiAqIEFwcGVuZHMgdGhlIGVsZW1lbnRzIG9mIGB2YWx1ZXNgIHRvIGBhcnJheWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge0FycmF5fSB2YWx1ZXMgVGhlIHZhbHVlcyB0byBhcHBlbmQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gYXJyYXlQdXNoKGFycmF5LCB2YWx1ZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSB2YWx1ZXMubGVuZ3RoLFxuICAgICAgb2Zmc2V0ID0gYXJyYXkubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgYXJyYXlbb2Zmc2V0ICsgaW5kZXhdID0gdmFsdWVzW2luZGV4XTtcbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IG9iamVjdFByb3RvLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmZsYXR0ZW5gIHdpdGggc3VwcG9ydCBmb3IgcmVzdHJpY3RpbmcgZmxhdHRlbmluZy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGZsYXR0ZW4uXG4gKiBAcGFyYW0ge251bWJlcn0gZGVwdGggVGhlIG1heGltdW0gcmVjdXJzaW9uIGRlcHRoLlxuICogQHBhcmFtIHtib29sZWFufSBbcHJlZGljYXRlPWlzRmxhdHRlbmFibGVdIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc1N0cmljdF0gUmVzdHJpY3QgdG8gdmFsdWVzIHRoYXQgcGFzcyBgcHJlZGljYXRlYCBjaGVja3MuXG4gKiBAcGFyYW0ge0FycmF5fSBbcmVzdWx0PVtdXSBUaGUgaW5pdGlhbCByZXN1bHQgdmFsdWUuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBmbGF0dGVuZWQgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIGJhc2VGbGF0dGVuKGFycmF5LCBkZXB0aCwgcHJlZGljYXRlLCBpc1N0cmljdCwgcmVzdWx0KSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuXG4gIHByZWRpY2F0ZSB8fCAocHJlZGljYXRlID0gaXNGbGF0dGVuYWJsZSk7XG4gIHJlc3VsdCB8fCAocmVzdWx0ID0gW10pO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIHZhbHVlID0gYXJyYXlbaW5kZXhdO1xuICAgIGlmIChkZXB0aCA+IDAgJiYgcHJlZGljYXRlKHZhbHVlKSkge1xuICAgICAgaWYgKGRlcHRoID4gMSkge1xuICAgICAgICAvLyBSZWN1cnNpdmVseSBmbGF0dGVuIGFycmF5cyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgICAgICBiYXNlRmxhdHRlbih2YWx1ZSwgZGVwdGggLSAxLCBwcmVkaWNhdGUsIGlzU3RyaWN0LCByZXN1bHQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXJyYXlQdXNoKHJlc3VsdCwgdmFsdWUpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoIWlzU3RyaWN0KSB7XG4gICAgICByZXN1bHRbcmVzdWx0Lmxlbmd0aF0gPSB2YWx1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5wcm9wZXJ0eWAgd2l0aG91dCBzdXBwb3J0IGZvciBkZWVwIHBhdGhzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlUHJvcGVydHkoa2V5KSB7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBvYmplY3Rba2V5XTtcbiAgfTtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBcImxlbmd0aFwiIHByb3BlcnR5IHZhbHVlIG9mIGBvYmplY3RgLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIGlzIHVzZWQgdG8gYXZvaWQgYVxuICogW0pJVCBidWddKGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD0xNDI3OTIpIHRoYXQgYWZmZWN0c1xuICogU2FmYXJpIG9uIGF0IGxlYXN0IGlPUyA4LjEtOC4zIEFSTTY0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgXCJsZW5ndGhcIiB2YWx1ZS5cbiAqL1xudmFyIGdldExlbmd0aCA9IGJhc2VQcm9wZXJ0eSgnbGVuZ3RoJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBmbGF0dGVuYWJsZSBgYXJndW1lbnRzYCBvYmplY3Qgb3IgYXJyYXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgZmxhdHRlbmFibGUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNGbGF0dGVuYWJsZSh2YWx1ZSkge1xuICByZXR1cm4gaXNBcnJheUxpa2VPYmplY3QodmFsdWUpICYmIChpc0FycmF5KHZhbHVlKSB8fCBpc0FyZ3VtZW50cyh2YWx1ZSkpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGxpa2VseSBhbiBgYXJndW1lbnRzYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgY29ycmVjdGx5IGNsYXNzaWZpZWQsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcmd1bWVudHMoWzEsIDIsIDNdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJndW1lbnRzKHZhbHVlKSB7XG4gIC8vIFNhZmFyaSA4LjEgaW5jb3JyZWN0bHkgbWFrZXMgYGFyZ3VtZW50cy5jYWxsZWVgIGVudW1lcmFibGUgaW4gc3RyaWN0IG1vZGUuXG4gIHJldHVybiBpc0FycmF5TGlrZU9iamVjdCh2YWx1ZSkgJiYgaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgJ2NhbGxlZScpICYmXG4gICAgKCFwcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHZhbHVlLCAnY2FsbGVlJykgfHwgb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gYXJnc1RhZyk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhbiBgQXJyYXlgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAdHlwZSB7RnVuY3Rpb259XG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBjb3JyZWN0bHkgY2xhc3NpZmllZCxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZS4gQSB2YWx1ZSBpcyBjb25zaWRlcmVkIGFycmF5LWxpa2UgaWYgaXQnc1xuICogbm90IGEgZnVuY3Rpb24gYW5kIGhhcyBhIGB2YWx1ZS5sZW5ndGhgIHRoYXQncyBhbiBpbnRlZ2VyIGdyZWF0ZXIgdGhhbiBvclxuICogZXF1YWwgdG8gYDBgIGFuZCBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gYE51bWJlci5NQVhfU0FGRV9JTlRFR0VSYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoJ2FiYycpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIGlzTGVuZ3RoKGdldExlbmd0aCh2YWx1ZSkpICYmICFpc0Z1bmN0aW9uKHZhbHVlKTtcbn1cblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLmlzQXJyYXlMaWtlYCBleGNlcHQgdGhhdCBpdCBhbHNvIGNoZWNrcyBpZiBgdmFsdWVgXG4gKiBpcyBhbiBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYXJyYXktbGlrZSBvYmplY3QsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZU9iamVjdChkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlT2JqZWN0KCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5TGlrZU9iamVjdChfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUxpa2VPYmplY3QodmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgaXNBcnJheUxpa2UodmFsdWUpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgRnVuY3Rpb25gIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBjb3JyZWN0bHkgY2xhc3NpZmllZCxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNGdW5jdGlvbihfKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oL2FiYy8pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICAvLyBUaGUgdXNlIG9mIGBPYmplY3QjdG9TdHJpbmdgIGF2b2lkcyBpc3N1ZXMgd2l0aCB0aGUgYHR5cGVvZmAgb3BlcmF0b3JcbiAgLy8gaW4gU2FmYXJpIDggd2hpY2ggcmV0dXJucyAnb2JqZWN0JyBmb3IgdHlwZWQgYXJyYXkgYW5kIHdlYWsgbWFwIGNvbnN0cnVjdG9ycyxcbiAgLy8gYW5kIFBoYW50b21KUyAxLjkgd2hpY2ggcmV0dXJucyAnZnVuY3Rpb24nIGZvciBgTm9kZUxpc3RgIGluc3RhbmNlcy5cbiAgdmFyIHRhZyA9IGlzT2JqZWN0KHZhbHVlKSA/IG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpIDogJyc7XG4gIHJldHVybiB0YWcgPT0gZnVuY1RhZyB8fCB0YWcgPT0gZ2VuVGFnO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBsZW5ndGguXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gaXMgbG9vc2VseSBiYXNlZCBvblxuICogW2BUb0xlbmd0aGBdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLXRvbGVuZ3RoKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGxlbmd0aCxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNMZW5ndGgoMyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0xlbmd0aChOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aChJbmZpbml0eSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNMZW5ndGgoJzMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTGVuZ3RoKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgJiZcbiAgICB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDw9IE1BWF9TQUZFX0lOVEVHRVI7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlXG4gKiBbbGFuZ3VhZ2UgdHlwZV0oaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLWVjbWFzY3JpcHQtbGFuZ3VhZ2UtdHlwZXMpXG4gKiBvZiBgT2JqZWN0YC4gKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KF8ubm9vcCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gISF2YWx1ZSAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLiBBIHZhbHVlIGlzIG9iamVjdC1saWtlIGlmIGl0J3Mgbm90IGBudWxsYFxuICogYW5kIGhhcyBhIGB0eXBlb2ZgIHJlc3VsdCBvZiBcIm9iamVjdFwiLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlRmxhdHRlbjtcbiIsIi8qKlxuICogbG9kYXNoIDQuMC4wIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE2IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTYgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5zbGljZWAgd2l0aG91dCBhbiBpdGVyYXRlZSBjYWxsIGd1YXJkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gc2xpY2UuXG4gKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0PTBdIFRoZSBzdGFydCBwb3NpdGlvbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbZW5kPWFycmF5Lmxlbmd0aF0gVGhlIGVuZCBwb3NpdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgc2xpY2Ugb2YgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gYmFzZVNsaWNlKGFycmF5LCBzdGFydCwgZW5kKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuXG4gIGlmIChzdGFydCA8IDApIHtcbiAgICBzdGFydCA9IC1zdGFydCA+IGxlbmd0aCA/IDAgOiAobGVuZ3RoICsgc3RhcnQpO1xuICB9XG4gIGVuZCA9IGVuZCA+IGxlbmd0aCA/IGxlbmd0aCA6IGVuZDtcbiAgaWYgKGVuZCA8IDApIHtcbiAgICBlbmQgKz0gbGVuZ3RoO1xuICB9XG4gIGxlbmd0aCA9IHN0YXJ0ID4gZW5kID8gMCA6ICgoZW5kIC0gc3RhcnQpID4+PiAwKTtcbiAgc3RhcnQgPj4+PSAwO1xuXG4gIHZhciByZXN1bHQgPSBBcnJheShsZW5ndGgpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHJlc3VsdFtpbmRleF0gPSBhcnJheVtpbmRleCArIHN0YXJ0XTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VTbGljZTtcbiIsIi8qKlxuICogbG9kYXNoIDQuNS4xIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE2IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTYgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cbnZhciBTZXRDYWNoZSA9IHJlcXVpcmUoJ2xvZGFzaC5fc2V0Y2FjaGUnKSxcbiAgICBjcmVhdGVTZXQgPSByZXF1aXJlKCdsb2Rhc2guX2NyZWF0ZXNldCcpO1xuXG4vKiogVXNlZCBhcyB0aGUgc2l6ZSB0byBlbmFibGUgbGFyZ2UgYXJyYXkgb3B0aW1pemF0aW9ucy4gKi9cbnZhciBMQVJHRV9BUlJBWV9TSVpFID0gMjAwO1xuXG4vKiogVXNlZCB0byBzdGFuZC1pbiBmb3IgYHVuZGVmaW5lZGAgaGFzaCB2YWx1ZXMuICovXG52YXIgSEFTSF9VTkRFRklORUQgPSAnX19sb2Rhc2hfaGFzaF91bmRlZmluZWRfXyc7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLmluY2x1ZGVzYCBmb3IgYXJyYXlzIHdpdGhvdXQgc3VwcG9ydCBmb3JcbiAqIHNwZWNpZnlpbmcgYW4gaW5kZXggdG8gc2VhcmNoIGZyb20uXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBzZWFyY2guXG4gKiBAcGFyYW0geyp9IHRhcmdldCBUaGUgdmFsdWUgdG8gc2VhcmNoIGZvci5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdGFyZ2V0YCBpcyBmb3VuZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBhcnJheUluY2x1ZGVzKGFycmF5LCB2YWx1ZSkge1xuICByZXR1cm4gISFhcnJheS5sZW5ndGggJiYgYmFzZUluZGV4T2YoYXJyYXksIHZhbHVlLCAwKSA+IC0xO1xufVxuXG4vKipcbiAqIFRoaXMgZnVuY3Rpb24gaXMgbGlrZSBgYXJyYXlJbmNsdWRlc2AgZXhjZXB0IHRoYXQgaXQgYWNjZXB0cyBhIGNvbXBhcmF0b3IuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBzZWFyY2guXG4gKiBAcGFyYW0geyp9IHRhcmdldCBUaGUgdmFsdWUgdG8gc2VhcmNoIGZvci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNvbXBhcmF0b3IgVGhlIGNvbXBhcmF0b3IgaW52b2tlZCBwZXIgZWxlbWVudC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdGFyZ2V0YCBpcyBmb3VuZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBhcnJheUluY2x1ZGVzV2l0aChhcnJheSwgdmFsdWUsIGNvbXBhcmF0b3IpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBpZiAoY29tcGFyYXRvcih2YWx1ZSwgYXJyYXlbaW5kZXhdKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pbmRleE9mYCB3aXRob3V0IGBmcm9tSW5kZXhgIGJvdW5kcyBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBzZWFyY2guXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZWFyY2ggZm9yLlxuICogQHBhcmFtIHtudW1iZXJ9IGZyb21JbmRleCBUaGUgaW5kZXggdG8gc2VhcmNoIGZyb20uXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSwgZWxzZSBgLTFgLlxuICovXG5mdW5jdGlvbiBiYXNlSW5kZXhPZihhcnJheSwgdmFsdWUsIGZyb21JbmRleCkge1xuICBpZiAodmFsdWUgIT09IHZhbHVlKSB7XG4gICAgcmV0dXJuIGluZGV4T2ZOYU4oYXJyYXksIGZyb21JbmRleCk7XG4gIH1cbiAgdmFyIGluZGV4ID0gZnJvbUluZGV4IC0gMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGlmIChhcnJheVtpbmRleF0gPT09IHZhbHVlKSB7XG4gICAgICByZXR1cm4gaW5kZXg7XG4gICAgfVxuICB9XG4gIHJldHVybiAtMTtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBpbmRleCBhdCB3aGljaCB0aGUgZmlyc3Qgb2NjdXJyZW5jZSBvZiBgTmFOYCBpcyBmb3VuZCBpbiBgYXJyYXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gc2VhcmNoLlxuICogQHBhcmFtIHtudW1iZXJ9IGZyb21JbmRleCBUaGUgaW5kZXggdG8gc2VhcmNoIGZyb20uXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtmcm9tUmlnaHRdIFNwZWNpZnkgaXRlcmF0aW5nIGZyb20gcmlnaHQgdG8gbGVmdC5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIGBOYU5gLCBlbHNlIGAtMWAuXG4gKi9cbmZ1bmN0aW9uIGluZGV4T2ZOYU4oYXJyYXksIGZyb21JbmRleCwgZnJvbVJpZ2h0KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGgsXG4gICAgICBpbmRleCA9IGZyb21JbmRleCArIChmcm9tUmlnaHQgPyAwIDogLTEpO1xuXG4gIHdoaWxlICgoZnJvbVJpZ2h0ID8gaW5kZXgtLSA6ICsraW5kZXggPCBsZW5ndGgpKSB7XG4gICAgdmFyIG90aGVyID0gYXJyYXlbaW5kZXhdO1xuICAgIGlmIChvdGhlciAhPT0gb3RoZXIpIHtcbiAgICAgIHJldHVybiBpbmRleDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIC0xO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGBzZXRgIHRvIGFuIGFycmF5LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gc2V0IFRoZSBzZXQgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgY29udmVydGVkIGFycmF5LlxuICovXG5mdW5jdGlvbiBzZXRUb0FycmF5KHNldCkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IEFycmF5KHNldC5zaXplKTtcblxuICBzZXQuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJlc3VsdFsrK2luZGV4XSA9IHZhbHVlO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBpbiBgY2FjaGVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gY2FjaGUgVGhlIHNldCBjYWNoZSB0byBzZWFyY2guXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZWFyY2ggZm9yLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBmb3VuZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBjYWNoZUhhcyhjYWNoZSwgdmFsdWUpIHtcbiAgdmFyIG1hcCA9IGNhY2hlLl9fZGF0YV9fO1xuICBpZiAoaXNLZXlhYmxlKHZhbHVlKSkge1xuICAgIHZhciBkYXRhID0gbWFwLl9fZGF0YV9fLFxuICAgICAgICBoYXNoID0gdHlwZW9mIHZhbHVlID09ICdzdHJpbmcnID8gZGF0YS5zdHJpbmcgOiBkYXRhLmhhc2g7XG5cbiAgICByZXR1cm4gaGFzaFt2YWx1ZV0gPT09IEhBU0hfVU5ERUZJTkVEO1xuICB9XG4gIHJldHVybiBtYXAuaGFzKHZhbHVlKTtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy51bmlxQnlgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbaXRlcmF0ZWVdIFRoZSBpdGVyYXRlZSBpbnZva2VkIHBlciBlbGVtZW50LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NvbXBhcmF0b3JdIFRoZSBjb21wYXJhdG9yIGludm9rZWQgcGVyIGVsZW1lbnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBkdXBsaWNhdGUgZnJlZSBhcnJheS5cbiAqL1xuZnVuY3Rpb24gYmFzZVVuaXEoYXJyYXksIGl0ZXJhdGVlLCBjb21wYXJhdG9yKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgaW5jbHVkZXMgPSBhcnJheUluY2x1ZGVzLFxuICAgICAgbGVuZ3RoID0gYXJyYXkubGVuZ3RoLFxuICAgICAgaXNDb21tb24gPSB0cnVlLFxuICAgICAgcmVzdWx0ID0gW10sXG4gICAgICBzZWVuID0gcmVzdWx0O1xuXG4gIGlmIChjb21wYXJhdG9yKSB7XG4gICAgaXNDb21tb24gPSBmYWxzZTtcbiAgICBpbmNsdWRlcyA9IGFycmF5SW5jbHVkZXNXaXRoO1xuICB9XG4gIGVsc2UgaWYgKGxlbmd0aCA+PSBMQVJHRV9BUlJBWV9TSVpFKSB7XG4gICAgdmFyIHNldCA9IGl0ZXJhdGVlID8gbnVsbCA6IGNyZWF0ZVNldChhcnJheSk7XG4gICAgaWYgKHNldCkge1xuICAgICAgcmV0dXJuIHNldFRvQXJyYXkoc2V0KTtcbiAgICB9XG4gICAgaXNDb21tb24gPSBmYWxzZTtcbiAgICBpbmNsdWRlcyA9IGNhY2hlSGFzO1xuICAgIHNlZW4gPSBuZXcgU2V0Q2FjaGU7XG4gIH1cbiAgZWxzZSB7XG4gICAgc2VlbiA9IGl0ZXJhdGVlID8gW10gOiByZXN1bHQ7XG4gIH1cbiAgb3V0ZXI6XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIHZhbHVlID0gYXJyYXlbaW5kZXhdLFxuICAgICAgICBjb21wdXRlZCA9IGl0ZXJhdGVlID8gaXRlcmF0ZWUodmFsdWUpIDogdmFsdWU7XG5cbiAgICBpZiAoaXNDb21tb24gJiYgY29tcHV0ZWQgPT09IGNvbXB1dGVkKSB7XG4gICAgICB2YXIgc2VlbkluZGV4ID0gc2Vlbi5sZW5ndGg7XG4gICAgICB3aGlsZSAoc2VlbkluZGV4LS0pIHtcbiAgICAgICAgaWYgKHNlZW5bc2VlbkluZGV4XSA9PT0gY29tcHV0ZWQpIHtcbiAgICAgICAgICBjb250aW51ZSBvdXRlcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGl0ZXJhdGVlKSB7XG4gICAgICAgIHNlZW4ucHVzaChjb21wdXRlZCk7XG4gICAgICB9XG4gICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKCFpbmNsdWRlcyhzZWVuLCBjb21wdXRlZCwgY29tcGFyYXRvcikpIHtcbiAgICAgIGlmIChzZWVuICE9PSByZXN1bHQpIHtcbiAgICAgICAgc2Vlbi5wdXNoKGNvbXB1dGVkKTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBzdWl0YWJsZSBmb3IgdXNlIGFzIHVuaXF1ZSBvYmplY3Qga2V5LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIHN1aXRhYmxlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzS2V5YWJsZSh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuIHR5cGUgPT0gJ251bWJlcicgfHwgdHlwZSA9PSAnYm9vbGVhbicgfHxcbiAgICAodHlwZSA9PSAnc3RyaW5nJyAmJiB2YWx1ZSAhPSAnX19wcm90b19fJykgfHwgdmFsdWUgPT0gbnVsbDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlVW5pcTtcbiIsIi8qKlxuICogbG9kYXNoIDQuMC4yIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgalF1ZXJ5IEZvdW5kYXRpb24gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyA8aHR0cHM6Ly9qcXVlcnkub3JnLz5cbiAqIFJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqL1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgZ2VuVGFnID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJztcblxuLyoqXG4gKiBVc2VkIHRvIG1hdGNoIGBSZWdFeHBgXG4gKiBbc3ludGF4IGNoYXJhY3RlcnNdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLXBhdHRlcm5zKS5cbiAqL1xudmFyIHJlUmVnRXhwQ2hhciA9IC9bXFxcXF4kLiorPygpW1xcXXt9fF0vZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGhvc3QgY29uc3RydWN0b3JzIChTYWZhcmkpLiAqL1xudmFyIHJlSXNIb3N0Q3RvciA9IC9eXFxbb2JqZWN0IC4rP0NvbnN0cnVjdG9yXFxdJC87XG5cbi8qKiBVc2VkIHRvIGRldGVybWluZSBpZiB2YWx1ZXMgYXJlIG9mIHRoZSBsYW5ndWFnZSB0eXBlIGBPYmplY3RgLiAqL1xudmFyIG9iamVjdFR5cGVzID0ge1xuICAnZnVuY3Rpb24nOiB0cnVlLFxuICAnb2JqZWN0JzogdHJ1ZVxufTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYC4gKi9cbnZhciBmcmVlRXhwb3J0cyA9IChvYmplY3RUeXBlc1t0eXBlb2YgZXhwb3J0c10gJiYgZXhwb3J0cyAmJiAhZXhwb3J0cy5ub2RlVHlwZSlcbiAgPyBleHBvcnRzXG4gIDogdW5kZWZpbmVkO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYG1vZHVsZWAuICovXG52YXIgZnJlZU1vZHVsZSA9IChvYmplY3RUeXBlc1t0eXBlb2YgbW9kdWxlXSAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSlcbiAgPyBtb2R1bGVcbiAgOiB1bmRlZmluZWQ7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZUdsb2JhbCA9IGNoZWNrR2xvYmFsKGZyZWVFeHBvcnRzICYmIGZyZWVNb2R1bGUgJiYgdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwpO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHNlbGZgLiAqL1xudmFyIGZyZWVTZWxmID0gY2hlY2tHbG9iYWwob2JqZWN0VHlwZXNbdHlwZW9mIHNlbGZdICYmIHNlbGYpO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHdpbmRvd2AuICovXG52YXIgZnJlZVdpbmRvdyA9IGNoZWNrR2xvYmFsKG9iamVjdFR5cGVzW3R5cGVvZiB3aW5kb3ddICYmIHdpbmRvdyk7XG5cbi8qKiBEZXRlY3QgYHRoaXNgIGFzIHRoZSBnbG9iYWwgb2JqZWN0LiAqL1xudmFyIHRoaXNHbG9iYWwgPSBjaGVja0dsb2JhbChvYmplY3RUeXBlc1t0eXBlb2YgdGhpc10gJiYgdGhpcyk7XG5cbi8qKlxuICogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdC5cbiAqXG4gKiBUaGUgYHRoaXNgIHZhbHVlIGlzIHVzZWQgaWYgaXQncyB0aGUgZ2xvYmFsIG9iamVjdCB0byBhdm9pZCBHcmVhc2Vtb25rZXknc1xuICogcmVzdHJpY3RlZCBgd2luZG93YCBvYmplY3QsIG90aGVyd2lzZSB0aGUgYHdpbmRvd2Agb2JqZWN0IGlzIHVzZWQuXG4gKi9cbnZhciByb290ID0gZnJlZUdsb2JhbCB8fFxuICAoKGZyZWVXaW5kb3cgIT09ICh0aGlzR2xvYmFsICYmIHRoaXNHbG9iYWwud2luZG93KSkgJiYgZnJlZVdpbmRvdykgfHxcbiAgICBmcmVlU2VsZiB8fCB0aGlzR2xvYmFsIHx8IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBnbG9iYWwgb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtudWxsfE9iamVjdH0gUmV0dXJucyBgdmFsdWVgIGlmIGl0J3MgYSBnbG9iYWwgb2JqZWN0LCBlbHNlIGBudWxsYC5cbiAqL1xuZnVuY3Rpb24gY2hlY2tHbG9iYWwodmFsdWUpIHtcbiAgcmV0dXJuICh2YWx1ZSAmJiB2YWx1ZS5PYmplY3QgPT09IE9iamVjdCkgPyB2YWx1ZSA6IG51bGw7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBob3N0IG9iamVjdCBpbiBJRSA8IDkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBob3N0IG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0hvc3RPYmplY3QodmFsdWUpIHtcbiAgLy8gTWFueSBob3N0IG9iamVjdHMgYXJlIGBPYmplY3RgIG9iamVjdHMgdGhhdCBjYW4gY29lcmNlIHRvIHN0cmluZ3NcbiAgLy8gZGVzcGl0ZSBoYXZpbmcgaW1wcm9wZXJseSBkZWZpbmVkIGB0b1N0cmluZ2AgbWV0aG9kcy5cbiAgdmFyIHJlc3VsdCA9IGZhbHNlO1xuICBpZiAodmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUudG9TdHJpbmcgIT0gJ2Z1bmN0aW9uJykge1xuICAgIHRyeSB7XG4gICAgICByZXN1bHQgPSAhISh2YWx1ZSArICcnKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGRlY29tcGlsZWQgc291cmNlIG9mIGZ1bmN0aW9ucy4gKi9cbnZhciBmdW5jVG9TdHJpbmcgPSBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmc7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaWYgYSBtZXRob2QgaXMgbmF0aXZlLiAqL1xudmFyIHJlSXNOYXRpdmUgPSBSZWdFeHAoJ14nICtcbiAgZnVuY1RvU3RyaW5nLmNhbGwoaGFzT3duUHJvcGVydHkpLnJlcGxhY2UocmVSZWdFeHBDaGFyLCAnXFxcXCQmJylcbiAgLnJlcGxhY2UoL2hhc093blByb3BlcnR5fChmdW5jdGlvbikuKj8oPz1cXFxcXFwoKXwgZm9yIC4rPyg/PVxcXFxcXF0pL2csICckMS4qPycpICsgJyQnXG4pO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgU2V0ID0gZ2V0TmF0aXZlKHJvb3QsICdTZXQnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgc2V0IG9mIGB2YWx1ZXNgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSB2YWx1ZXMgVGhlIHZhbHVlcyB0byBhZGQgdG8gdGhlIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG5ldyBzZXQuXG4gKi9cbnZhciBjcmVhdGVTZXQgPSAhKFNldCAmJiBuZXcgU2V0KFsxLCAyXSkuc2l6ZSA9PT0gMikgPyBub29wIDogZnVuY3Rpb24odmFsdWVzKSB7XG4gIHJldHVybiBuZXcgU2V0KHZhbHVlcyk7XG59O1xuXG4vKipcbiAqIEdldHMgdGhlIG5hdGl2ZSBmdW5jdGlvbiBhdCBga2V5YCBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBtZXRob2QgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGZ1bmN0aW9uIGlmIGl0J3MgbmF0aXZlLCBlbHNlIGB1bmRlZmluZWRgLlxuICovXG5mdW5jdGlvbiBnZXROYXRpdmUob2JqZWN0LCBrZXkpIHtcbiAgdmFyIHZhbHVlID0gb2JqZWN0W2tleV07XG4gIHJldHVybiBpc05hdGl2ZSh2YWx1ZSkgPyB2YWx1ZSA6IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBgZnVuY2AgdG8gaXRzIHNvdXJjZSBjb2RlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBwcm9jZXNzLlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgc291cmNlIGNvZGUuXG4gKi9cbmZ1bmN0aW9uIHRvU291cmNlKGZ1bmMpIHtcbiAgaWYgKGZ1bmMgIT0gbnVsbCkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gZnVuY1RvU3RyaW5nLmNhbGwoZnVuYyk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIChmdW5jICsgJycpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gIH1cbiAgcmV0dXJuICcnO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgRnVuY3Rpb25gIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBjb3JyZWN0bHkgY2xhc3NpZmllZCxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNGdW5jdGlvbihfKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oL2FiYy8pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICAvLyBUaGUgdXNlIG9mIGBPYmplY3QjdG9TdHJpbmdgIGF2b2lkcyBpc3N1ZXMgd2l0aCB0aGUgYHR5cGVvZmAgb3BlcmF0b3JcbiAgLy8gaW4gU2FmYXJpIDggd2hpY2ggcmV0dXJucyAnb2JqZWN0JyBmb3IgdHlwZWQgYXJyYXkgYW5kIHdlYWsgbWFwIGNvbnN0cnVjdG9ycyxcbiAgLy8gYW5kIFBoYW50b21KUyAxLjkgd2hpY2ggcmV0dXJucyAnZnVuY3Rpb24nIGZvciBgTm9kZUxpc3RgIGluc3RhbmNlcy5cbiAgdmFyIHRhZyA9IGlzT2JqZWN0KHZhbHVlKSA/IG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpIDogJyc7XG4gIHJldHVybiB0YWcgPT0gZnVuY1RhZyB8fCB0YWcgPT0gZ2VuVGFnO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZVxuICogW2xhbmd1YWdlIHR5cGVdKGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1lY21hc2NyaXB0LWxhbmd1YWdlLXR5cGVzKVxuICogb2YgYE9iamVjdGAuIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChfLm5vb3ApO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuICEhdmFsdWUgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIG5hdGl2ZSBmdW5jdGlvbi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIG5hdGl2ZSBmdW5jdGlvbixcbiAqICBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNOYXRpdmUoQXJyYXkucHJvdG90eXBlLnB1c2gpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNOYXRpdmUoXyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc05hdGl2ZSh2YWx1ZSkge1xuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgcGF0dGVybiA9IChpc0Z1bmN0aW9uKHZhbHVlKSB8fCBpc0hvc3RPYmplY3QodmFsdWUpKSA/IHJlSXNOYXRpdmUgOiByZUlzSG9zdEN0b3I7XG4gIHJldHVybiBwYXR0ZXJuLnRlc3QodG9Tb3VyY2UodmFsdWUpKTtcbn1cblxuLyoqXG4gKiBBIG5vLW9wZXJhdGlvbiBmdW5jdGlvbiB0aGF0IHJldHVybnMgYHVuZGVmaW5lZGAgcmVnYXJkbGVzcyBvZiB0aGVcbiAqIGFyZ3VtZW50cyBpdCByZWNlaXZlcy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDIuMy4wXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAndXNlcic6ICdmcmVkJyB9O1xuICpcbiAqIF8ubm9vcChvYmplY3QpID09PSB1bmRlZmluZWQ7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIG5vb3AoKSB7XG4gIC8vIE5vIG9wZXJhdGlvbiBwZXJmb3JtZWQuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlU2V0O1xuIiwiLyoqXG4gKiBsb2Rhc2ggNC4xLjMgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCBqUXVlcnkgRm91bmRhdGlvbiBhbmQgb3RoZXIgY29udHJpYnV0b3JzIDxodHRwczovL2pxdWVyeS5vcmcvPlxuICogUmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICovXG5cbi8qKiBVc2VkIHRvIHN0YW5kLWluIGZvciBgdW5kZWZpbmVkYCBoYXNoIHZhbHVlcy4gKi9cbnZhciBIQVNIX1VOREVGSU5FRCA9ICdfX2xvZGFzaF9oYXNoX3VuZGVmaW5lZF9fJztcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIGdlblRhZyA9ICdbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXSc7XG5cbi8qKlxuICogVXNlZCB0byBtYXRjaCBgUmVnRXhwYFxuICogW3N5bnRheCBjaGFyYWN0ZXJzXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1wYXR0ZXJucykuXG4gKi9cbnZhciByZVJlZ0V4cENoYXIgPSAvW1xcXFxeJC4qKz8oKVtcXF17fXxdL2c7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBob3N0IGNvbnN0cnVjdG9ycyAoU2FmYXJpKS4gKi9cbnZhciByZUlzSG9zdEN0b3IgPSAvXlxcW29iamVjdCAuKz9Db25zdHJ1Y3RvclxcXSQvO1xuXG4vKiogVXNlZCB0byBkZXRlcm1pbmUgaWYgdmFsdWVzIGFyZSBvZiB0aGUgbGFuZ3VhZ2UgdHlwZSBgT2JqZWN0YC4gKi9cbnZhciBvYmplY3RUeXBlcyA9IHtcbiAgJ2Z1bmN0aW9uJzogdHJ1ZSxcbiAgJ29iamVjdCc6IHRydWVcbn07XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZXhwb3J0c2AuICovXG52YXIgZnJlZUV4cG9ydHMgPSAob2JqZWN0VHlwZXNbdHlwZW9mIGV4cG9ydHNdICYmIGV4cG9ydHMgJiYgIWV4cG9ydHMubm9kZVR5cGUpXG4gID8gZXhwb3J0c1xuICA6IHVuZGVmaW5lZDtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBtb2R1bGVgLiAqL1xudmFyIGZyZWVNb2R1bGUgPSAob2JqZWN0VHlwZXNbdHlwZW9mIG1vZHVsZV0gJiYgbW9kdWxlICYmICFtb2R1bGUubm9kZVR5cGUpXG4gID8gbW9kdWxlXG4gIDogdW5kZWZpbmVkO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVHbG9iYWwgPSBjaGVja0dsb2JhbChmcmVlRXhwb3J0cyAmJiBmcmVlTW9kdWxlICYmIHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBzZWxmYC4gKi9cbnZhciBmcmVlU2VsZiA9IGNoZWNrR2xvYmFsKG9iamVjdFR5cGVzW3R5cGVvZiBzZWxmXSAmJiBzZWxmKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGB3aW5kb3dgLiAqL1xudmFyIGZyZWVXaW5kb3cgPSBjaGVja0dsb2JhbChvYmplY3RUeXBlc1t0eXBlb2Ygd2luZG93XSAmJiB3aW5kb3cpO1xuXG4vKiogRGV0ZWN0IGB0aGlzYCBhcyB0aGUgZ2xvYmFsIG9iamVjdC4gKi9cbnZhciB0aGlzR2xvYmFsID0gY2hlY2tHbG9iYWwob2JqZWN0VHlwZXNbdHlwZW9mIHRoaXNdICYmIHRoaXMpO1xuXG4vKipcbiAqIFVzZWQgYXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QuXG4gKlxuICogVGhlIGB0aGlzYCB2YWx1ZSBpcyB1c2VkIGlmIGl0J3MgdGhlIGdsb2JhbCBvYmplY3QgdG8gYXZvaWQgR3JlYXNlbW9ua2V5J3NcbiAqIHJlc3RyaWN0ZWQgYHdpbmRvd2Agb2JqZWN0LCBvdGhlcndpc2UgdGhlIGB3aW5kb3dgIG9iamVjdCBpcyB1c2VkLlxuICovXG52YXIgcm9vdCA9IGZyZWVHbG9iYWwgfHxcbiAgKChmcmVlV2luZG93ICE9PSAodGhpc0dsb2JhbCAmJiB0aGlzR2xvYmFsLndpbmRvdykpICYmIGZyZWVXaW5kb3cpIHx8XG4gICAgZnJlZVNlbGYgfHwgdGhpc0dsb2JhbCB8fCBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgZ2xvYmFsIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7bnVsbHxPYmplY3R9IFJldHVybnMgYHZhbHVlYCBpZiBpdCdzIGEgZ2xvYmFsIG9iamVjdCwgZWxzZSBgbnVsbGAuXG4gKi9cbmZ1bmN0aW9uIGNoZWNrR2xvYmFsKHZhbHVlKSB7XG4gIHJldHVybiAodmFsdWUgJiYgdmFsdWUuT2JqZWN0ID09PSBPYmplY3QpID8gdmFsdWUgOiBudWxsO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgaG9zdCBvYmplY3QgaW4gSUUgPCA5LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgaG9zdCBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNIb3N0T2JqZWN0KHZhbHVlKSB7XG4gIC8vIE1hbnkgaG9zdCBvYmplY3RzIGFyZSBgT2JqZWN0YCBvYmplY3RzIHRoYXQgY2FuIGNvZXJjZSB0byBzdHJpbmdzXG4gIC8vIGRlc3BpdGUgaGF2aW5nIGltcHJvcGVybHkgZGVmaW5lZCBgdG9TdHJpbmdgIG1ldGhvZHMuXG4gIHZhciByZXN1bHQgPSBmYWxzZTtcbiAgaWYgKHZhbHVlICE9IG51bGwgJiYgdHlwZW9mIHZhbHVlLnRvU3RyaW5nICE9ICdmdW5jdGlvbicpIHtcbiAgICB0cnkge1xuICAgICAgcmVzdWx0ID0gISEodmFsdWUgKyAnJyk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgYXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZSxcbiAgICBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGRlY29tcGlsZWQgc291cmNlIG9mIGZ1bmN0aW9ucy4gKi9cbnZhciBmdW5jVG9TdHJpbmcgPSBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmc7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaWYgYSBtZXRob2QgaXMgbmF0aXZlLiAqL1xudmFyIHJlSXNOYXRpdmUgPSBSZWdFeHAoJ14nICtcbiAgZnVuY1RvU3RyaW5nLmNhbGwoaGFzT3duUHJvcGVydHkpLnJlcGxhY2UocmVSZWdFeHBDaGFyLCAnXFxcXCQmJylcbiAgLnJlcGxhY2UoL2hhc093blByb3BlcnR5fChmdW5jdGlvbikuKj8oPz1cXFxcXFwoKXwgZm9yIC4rPyg/PVxcXFxcXF0pL2csICckMS4qPycpICsgJyQnXG4pO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzcGxpY2UgPSBhcnJheVByb3RvLnNwbGljZTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIE1hcCA9IGdldE5hdGl2ZShyb290LCAnTWFwJyksXG4gICAgbmF0aXZlQ3JlYXRlID0gZ2V0TmF0aXZlKE9iamVjdCwgJ2NyZWF0ZScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBoYXNoIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBuZXcgaGFzaCBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIEhhc2goKSB7fVxuXG4vKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBoYXNoLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gaGFzaCBUaGUgaGFzaCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaGFzaERlbGV0ZShoYXNoLCBrZXkpIHtcbiAgcmV0dXJuIGhhc2hIYXMoaGFzaCwga2V5KSAmJiBkZWxldGUgaGFzaFtrZXldO1xufVxuXG4vKipcbiAqIEdldHMgdGhlIGhhc2ggdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gaGFzaCBUaGUgaGFzaCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBoYXNoR2V0KGhhc2gsIGtleSkge1xuICBpZiAobmF0aXZlQ3JlYXRlKSB7XG4gICAgdmFyIHJlc3VsdCA9IGhhc2hba2V5XTtcbiAgICByZXR1cm4gcmVzdWx0ID09PSBIQVNIX1VOREVGSU5FRCA/IHVuZGVmaW5lZCA6IHJlc3VsdDtcbiAgfVxuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChoYXNoLCBrZXkpID8gaGFzaFtrZXldIDogdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBhIGhhc2ggdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IGhhc2ggVGhlIGhhc2ggdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaGFzaEhhcyhoYXNoLCBrZXkpIHtcbiAgcmV0dXJuIG5hdGl2ZUNyZWF0ZSA/IGhhc2hba2V5XSAhPT0gdW5kZWZpbmVkIDogaGFzT3duUHJvcGVydHkuY2FsbChoYXNoLCBrZXkpO1xufVxuXG4vKipcbiAqIFNldHMgdGhlIGhhc2ggYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IGhhc2ggVGhlIGhhc2ggdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKi9cbmZ1bmN0aW9uIGhhc2hTZXQoaGFzaCwga2V5LCB2YWx1ZSkge1xuICBoYXNoW2tleV0gPSAobmF0aXZlQ3JlYXRlICYmIHZhbHVlID09PSB1bmRlZmluZWQpID8gSEFTSF9VTkRFRklORUQgOiB2YWx1ZTtcbn1cblxuLy8gQXZvaWQgaW5oZXJpdGluZyBmcm9tIGBPYmplY3QucHJvdG90eXBlYCB3aGVuIHBvc3NpYmxlLlxuSGFzaC5wcm90b3R5cGUgPSBuYXRpdmVDcmVhdGUgPyBuYXRpdmVDcmVhdGUobnVsbCkgOiBvYmplY3RQcm90bztcblxuLyoqXG4gKiBDcmVhdGVzIGEgbWFwIGNhY2hlIG9iamVjdCB0byBzdG9yZSBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW3ZhbHVlc10gVGhlIHZhbHVlcyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gTWFwQ2FjaGUodmFsdWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gdmFsdWVzID8gdmFsdWVzLmxlbmd0aCA6IDA7XG5cbiAgdGhpcy5jbGVhcigpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBlbnRyeSA9IHZhbHVlc1tpbmRleF07XG4gICAgdGhpcy5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxufVxuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIG1hcC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICovXG5mdW5jdGlvbiBtYXBDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IHtcbiAgICAnaGFzaCc6IG5ldyBIYXNoLFxuICAgICdtYXAnOiBNYXAgPyBuZXcgTWFwIDogW10sXG4gICAgJ3N0cmluZyc6IG5ldyBIYXNoXG4gIH07XG59XG5cbi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIG1hcC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBtYXBEZWxldGUoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgaWYgKGlzS2V5YWJsZShrZXkpKSB7XG4gICAgcmV0dXJuIGhhc2hEZWxldGUodHlwZW9mIGtleSA9PSAnc3RyaW5nJyA/IGRhdGEuc3RyaW5nIDogZGF0YS5oYXNoLCBrZXkpO1xuICB9XG4gIHJldHVybiBNYXAgPyBkYXRhLm1hcFsnZGVsZXRlJ10oa2V5KSA6IGFzc29jRGVsZXRlKGRhdGEubWFwLCBrZXkpO1xufVxuXG4vKipcbiAqIEdldHMgdGhlIG1hcCB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gbWFwR2V0KGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIGlmIChpc0tleWFibGUoa2V5KSkge1xuICAgIHJldHVybiBoYXNoR2V0KHR5cGVvZiBrZXkgPT0gJ3N0cmluZycgPyBkYXRhLnN0cmluZyA6IGRhdGEuaGFzaCwga2V5KTtcbiAgfVxuICByZXR1cm4gTWFwID8gZGF0YS5tYXAuZ2V0KGtleSkgOiBhc3NvY0dldChkYXRhLm1hcCwga2V5KTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYSBtYXAgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBtYXBIYXMoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgaWYgKGlzS2V5YWJsZShrZXkpKSB7XG4gICAgcmV0dXJuIGhhc2hIYXModHlwZW9mIGtleSA9PSAnc3RyaW5nJyA/IGRhdGEuc3RyaW5nIDogZGF0YS5oYXNoLCBrZXkpO1xuICB9XG4gIHJldHVybiBNYXAgPyBkYXRhLm1hcC5oYXMoa2V5KSA6IGFzc29jSGFzKGRhdGEubWFwLCBrZXkpO1xufVxuXG4vKipcbiAqIFNldHMgdGhlIG1hcCBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBtYXAgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIG1hcFNldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgaWYgKGlzS2V5YWJsZShrZXkpKSB7XG4gICAgaGFzaFNldCh0eXBlb2Yga2V5ID09ICdzdHJpbmcnID8gZGF0YS5zdHJpbmcgOiBkYXRhLmhhc2gsIGtleSwgdmFsdWUpO1xuICB9IGVsc2UgaWYgKE1hcCkge1xuICAgIGRhdGEubWFwLnNldChrZXksIHZhbHVlKTtcbiAgfSBlbHNlIHtcbiAgICBhc3NvY1NldChkYXRhLm1hcCwga2V5LCB2YWx1ZSk7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBNYXBDYWNoZWAuXG5NYXBDYWNoZS5wcm90b3R5cGUuY2xlYXIgPSBtYXBDbGVhcjtcbk1hcENhY2hlLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBtYXBEZWxldGU7XG5NYXBDYWNoZS5wcm90b3R5cGUuZ2V0ID0gbWFwR2V0O1xuTWFwQ2FjaGUucHJvdG90eXBlLmhhcyA9IG1hcEhhcztcbk1hcENhY2hlLnByb3RvdHlwZS5zZXQgPSBtYXBTZXQ7XG5cbi8qKlxuICpcbiAqIENyZWF0ZXMgYSBzZXQgY2FjaGUgb2JqZWN0IHRvIHN0b3JlIHVuaXF1ZSB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW3ZhbHVlc10gVGhlIHZhbHVlcyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gU2V0Q2FjaGUodmFsdWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gdmFsdWVzID8gdmFsdWVzLmxlbmd0aCA6IDA7XG5cbiAgdGhpcy5fX2RhdGFfXyA9IG5ldyBNYXBDYWNoZTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB0aGlzLnB1c2godmFsdWVzW2luZGV4XSk7XG4gIH1cbn1cblxuLyoqXG4gKiBBZGRzIGB2YWx1ZWAgdG8gdGhlIHNldCBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgcHVzaFxuICogQG1lbWJlck9mIFNldENhY2hlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gY2FjaGVQdXNoKHZhbHVlKSB7XG4gIHZhciBtYXAgPSB0aGlzLl9fZGF0YV9fO1xuICBpZiAoaXNLZXlhYmxlKHZhbHVlKSkge1xuICAgIHZhciBkYXRhID0gbWFwLl9fZGF0YV9fLFxuICAgICAgICBoYXNoID0gdHlwZW9mIHZhbHVlID09ICdzdHJpbmcnID8gZGF0YS5zdHJpbmcgOiBkYXRhLmhhc2g7XG5cbiAgICBoYXNoW3ZhbHVlXSA9IEhBU0hfVU5ERUZJTkVEO1xuICB9XG4gIGVsc2Uge1xuICAgIG1hcC5zZXQodmFsdWUsIEhBU0hfVU5ERUZJTkVEKTtcbiAgfVxufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgU2V0Q2FjaGVgLlxuU2V0Q2FjaGUucHJvdG90eXBlLnB1c2ggPSBjYWNoZVB1c2g7XG5cbi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIGFzc29jaWF0aXZlIGFycmF5LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGFzc29jRGVsZXRlKGFycmF5LCBrZXkpIHtcbiAgdmFyIGluZGV4ID0gYXNzb2NJbmRleE9mKGFycmF5LCBrZXkpO1xuICBpZiAoaW5kZXggPCAwKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBsYXN0SW5kZXggPSBhcnJheS5sZW5ndGggLSAxO1xuICBpZiAoaW5kZXggPT0gbGFzdEluZGV4KSB7XG4gICAgYXJyYXkucG9wKCk7XG4gIH0gZWxzZSB7XG4gICAgc3BsaWNlLmNhbGwoYXJyYXksIGluZGV4LCAxKTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBhc3NvY2lhdGl2ZSBhcnJheSB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBhc3NvY0dldChhcnJheSwga2V5KSB7XG4gIHZhciBpbmRleCA9IGFzc29jSW5kZXhPZihhcnJheSwga2V5KTtcbiAgcmV0dXJuIGluZGV4IDwgMCA/IHVuZGVmaW5lZCA6IGFycmF5W2luZGV4XVsxXTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYW4gYXNzb2NpYXRpdmUgYXJyYXkgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGFzc29jSGFzKGFycmF5LCBrZXkpIHtcbiAgcmV0dXJuIGFzc29jSW5kZXhPZihhcnJheSwga2V5KSA+IC0xO1xufVxuXG4vKipcbiAqIEdldHMgdGhlIGluZGV4IGF0IHdoaWNoIHRoZSBga2V5YCBpcyBmb3VuZCBpbiBgYXJyYXlgIG9mIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIHNlYXJjaC5cbiAqIEBwYXJhbSB7Kn0ga2V5IFRoZSBrZXkgdG8gc2VhcmNoIGZvci5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG4gKi9cbmZ1bmN0aW9uIGFzc29jSW5kZXhPZihhcnJheSwga2V5KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG4gIHdoaWxlIChsZW5ndGgtLSkge1xuICAgIGlmIChlcShhcnJheVtsZW5ndGhdWzBdLCBrZXkpKSB7XG4gICAgICByZXR1cm4gbGVuZ3RoO1xuICAgIH1cbiAgfVxuICByZXR1cm4gLTE7XG59XG5cbi8qKlxuICogU2V0cyB0aGUgYXNzb2NpYXRpdmUgYXJyYXkgYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICovXG5mdW5jdGlvbiBhc3NvY1NldChhcnJheSwga2V5LCB2YWx1ZSkge1xuICB2YXIgaW5kZXggPSBhc3NvY0luZGV4T2YoYXJyYXksIGtleSk7XG4gIGlmIChpbmRleCA8IDApIHtcbiAgICBhcnJheS5wdXNoKFtrZXksIHZhbHVlXSk7XG4gIH0gZWxzZSB7XG4gICAgYXJyYXlbaW5kZXhdWzFdID0gdmFsdWU7XG4gIH1cbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBuYXRpdmUgZnVuY3Rpb24gYXQgYGtleWAgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgbWV0aG9kIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBmdW5jdGlvbiBpZiBpdCdzIG5hdGl2ZSwgZWxzZSBgdW5kZWZpbmVkYC5cbiAqL1xuZnVuY3Rpb24gZ2V0TmF0aXZlKG9iamVjdCwga2V5KSB7XG4gIHZhciB2YWx1ZSA9IG9iamVjdFtrZXldO1xuICByZXR1cm4gaXNOYXRpdmUodmFsdWUpID8gdmFsdWUgOiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgc3VpdGFibGUgZm9yIHVzZSBhcyB1bmlxdWUgb2JqZWN0IGtleS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBzdWl0YWJsZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0tleWFibGUodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiB0eXBlID09ICdudW1iZXInIHx8IHR5cGUgPT0gJ2Jvb2xlYW4nIHx8XG4gICAgKHR5cGUgPT0gJ3N0cmluZycgJiYgdmFsdWUgIT0gJ19fcHJvdG9fXycpIHx8IHZhbHVlID09IG51bGw7XG59XG5cbi8qKlxuICogQ29udmVydHMgYGZ1bmNgIHRvIGl0cyBzb3VyY2UgY29kZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHNvdXJjZSBjb2RlLlxuICovXG5mdW5jdGlvbiB0b1NvdXJjZShmdW5jKSB7XG4gIGlmIChmdW5jICE9IG51bGwpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGZ1bmNUb1N0cmluZy5jYWxsKGZ1bmMpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiAoZnVuYyArICcnKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICB9XG4gIHJldHVybiAnJztcbn1cblxuLyoqXG4gKiBQZXJmb3JtcyBhXG4gKiBbYFNhbWVWYWx1ZVplcm9gXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1zYW1ldmFsdWV6ZXJvKVxuICogY29tcGFyaXNvbiBiZXR3ZWVuIHR3byB2YWx1ZXMgdG8gZGV0ZXJtaW5lIGlmIHRoZXkgYXJlIGVxdWl2YWxlbnQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0geyp9IG90aGVyIFRoZSBvdGhlciB2YWx1ZSB0byBjb21wYXJlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ3VzZXInOiAnZnJlZCcgfTtcbiAqIHZhciBvdGhlciA9IHsgJ3VzZXInOiAnZnJlZCcgfTtcbiAqXG4gKiBfLmVxKG9iamVjdCwgb2JqZWN0KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKG9iamVjdCwgb3RoZXIpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKCdhJywgJ2EnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKCdhJywgT2JqZWN0KCdhJykpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKE5hTiwgTmFOKTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gZXEodmFsdWUsIG90aGVyKSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gb3RoZXIgfHwgKHZhbHVlICE9PSB2YWx1ZSAmJiBvdGhlciAhPT0gb3RoZXIpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgRnVuY3Rpb25gIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBjb3JyZWN0bHkgY2xhc3NpZmllZCxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNGdW5jdGlvbihfKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oL2FiYy8pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICAvLyBUaGUgdXNlIG9mIGBPYmplY3QjdG9TdHJpbmdgIGF2b2lkcyBpc3N1ZXMgd2l0aCB0aGUgYHR5cGVvZmAgb3BlcmF0b3JcbiAgLy8gaW4gU2FmYXJpIDggd2hpY2ggcmV0dXJucyAnb2JqZWN0JyBmb3IgdHlwZWQgYXJyYXkgYW5kIHdlYWsgbWFwIGNvbnN0cnVjdG9ycyxcbiAgLy8gYW5kIFBoYW50b21KUyAxLjkgd2hpY2ggcmV0dXJucyAnZnVuY3Rpb24nIGZvciBgTm9kZUxpc3RgIGluc3RhbmNlcy5cbiAgdmFyIHRhZyA9IGlzT2JqZWN0KHZhbHVlKSA/IG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpIDogJyc7XG4gIHJldHVybiB0YWcgPT0gZnVuY1RhZyB8fCB0YWcgPT0gZ2VuVGFnO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZVxuICogW2xhbmd1YWdlIHR5cGVdKGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1lY21hc2NyaXB0LWxhbmd1YWdlLXR5cGVzKVxuICogb2YgYE9iamVjdGAuIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChfLm5vb3ApO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuICEhdmFsdWUgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIG5hdGl2ZSBmdW5jdGlvbi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIG5hdGl2ZSBmdW5jdGlvbixcbiAqICBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNOYXRpdmUoQXJyYXkucHJvdG90eXBlLnB1c2gpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNOYXRpdmUoXyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc05hdGl2ZSh2YWx1ZSkge1xuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgcGF0dGVybiA9IChpc0Z1bmN0aW9uKHZhbHVlKSB8fCBpc0hvc3RPYmplY3QodmFsdWUpKSA/IHJlSXNOYXRpdmUgOiByZUlzSG9zdEN0b3I7XG4gIHJldHVybiBwYXR0ZXJuLnRlc3QodG9Tb3VyY2UodmFsdWUpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTZXRDYWNoZTtcbiIsIi8qKlxuICogbG9kYXNoIDQuMC41IChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgalF1ZXJ5IEZvdW5kYXRpb24gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyA8aHR0cHM6Ly9qcXVlcnkub3JnLz5cbiAqIFJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqL1xudmFyIGJhc2VTbGljZSA9IHJlcXVpcmUoJ2xvZGFzaC5fYmFzZXNsaWNlJyk7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIElORklOSVRZID0gMSAvIDAsXG4gICAgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTEsXG4gICAgTUFYX0lOVEVHRVIgPSAxLjc5NzY5MzEzNDg2MjMxNTdlKzMwOCxcbiAgICBOQU4gPSAwIC8gMDtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIGdlblRhZyA9ICdbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXScsXG4gICAgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXSc7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHdoaXRlc3BhY2UuICovXG52YXIgcmVUcmltID0gL15cXHMrfFxccyskL2c7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBiYWQgc2lnbmVkIGhleGFkZWNpbWFsIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc0JhZEhleCA9IC9eWy0rXTB4WzAtOWEtZl0rJC9pO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgYmluYXJ5IHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc0JpbmFyeSA9IC9eMGJbMDFdKyQvaTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG9jdGFsIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc09jdGFsID0gL14wb1swLTddKyQvaTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IHVuc2lnbmVkIGludGVnZXIgdmFsdWVzLiAqL1xudmFyIHJlSXNVaW50ID0gL14oPzowfFsxLTldXFxkKikkLztcblxuLyoqIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHdpdGhvdXQgYSBkZXBlbmRlbmN5IG9uIGByb290YC4gKi9cbnZhciBmcmVlUGFyc2VJbnQgPSBwYXJzZUludDtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgaW5kZXguXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHBhcmFtIHtudW1iZXJ9IFtsZW5ndGg9TUFYX1NBRkVfSU5URUdFUl0gVGhlIHVwcGVyIGJvdW5kcyBvZiBhIHZhbGlkIGluZGV4LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBpbmRleCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0luZGV4KHZhbHVlLCBsZW5ndGgpIHtcbiAgdmFsdWUgPSAodHlwZW9mIHZhbHVlID09ICdudW1iZXInIHx8IHJlSXNVaW50LnRlc3QodmFsdWUpKSA/ICt2YWx1ZSA6IC0xO1xuICBsZW5ndGggPSBsZW5ndGggPT0gbnVsbCA/IE1BWF9TQUZFX0lOVEVHRVIgOiBsZW5ndGg7XG4gIHJldHVybiB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDwgbGVuZ3RoO1xufVxuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUNlaWwgPSBNYXRoLmNlaWwsXG4gICAgbmF0aXZlTWF4ID0gTWF0aC5tYXg7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ucHJvcGVydHlgIHdpdGhvdXQgc3VwcG9ydCBmb3IgZGVlcCBwYXRocy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVByb3BlcnR5KGtleSkge1xuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG4gIH07XG59XG5cbi8qKlxuICogR2V0cyB0aGUgXCJsZW5ndGhcIiBwcm9wZXJ0eSB2YWx1ZSBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBpcyB1c2VkIHRvIGF2b2lkIGFcbiAqIFtKSVQgYnVnXShodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTQyNzkyKSB0aGF0IGFmZmVjdHNcbiAqIFNhZmFyaSBvbiBhdCBsZWFzdCBpT1MgOC4xLTguMyBBUk02NC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIFwibGVuZ3RoXCIgdmFsdWUuXG4gKi9cbnZhciBnZXRMZW5ndGggPSBiYXNlUHJvcGVydHkoJ2xlbmd0aCcpO1xuXG4vKipcbiAqIENoZWNrcyBpZiB0aGUgZ2l2ZW4gYXJndW1lbnRzIGFyZSBmcm9tIGFuIGl0ZXJhdGVlIGNhbGwuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHBvdGVudGlhbCBpdGVyYXRlZSB2YWx1ZSBhcmd1bWVudC5cbiAqIEBwYXJhbSB7Kn0gaW5kZXggVGhlIHBvdGVudGlhbCBpdGVyYXRlZSBpbmRleCBvciBrZXkgYXJndW1lbnQuXG4gKiBAcGFyYW0geyp9IG9iamVjdCBUaGUgcG90ZW50aWFsIGl0ZXJhdGVlIG9iamVjdCBhcmd1bWVudC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYXJndW1lbnRzIGFyZSBmcm9tIGFuIGl0ZXJhdGVlIGNhbGwsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0l0ZXJhdGVlQ2FsbCh2YWx1ZSwgaW5kZXgsIG9iamVjdCkge1xuICBpZiAoIWlzT2JqZWN0KG9iamVjdCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHR5cGUgPSB0eXBlb2YgaW5kZXg7XG4gIGlmICh0eXBlID09ICdudW1iZXInXG4gICAgICAgID8gKGlzQXJyYXlMaWtlKG9iamVjdCkgJiYgaXNJbmRleChpbmRleCwgb2JqZWN0Lmxlbmd0aCkpXG4gICAgICAgIDogKHR5cGUgPT0gJ3N0cmluZycgJiYgaW5kZXggaW4gb2JqZWN0KVxuICAgICAgKSB7XG4gICAgcmV0dXJuIGVxKG9iamVjdFtpbmRleF0sIHZhbHVlKTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiBlbGVtZW50cyBzcGxpdCBpbnRvIGdyb3VwcyB0aGUgbGVuZ3RoIG9mIGBzaXplYC5cbiAqIElmIGBhcnJheWAgY2FuJ3QgYmUgc3BsaXQgZXZlbmx5LCB0aGUgZmluYWwgY2h1bmsgd2lsbCBiZSB0aGUgcmVtYWluaW5nXG4gKiBlbGVtZW50cy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgQXJyYXlcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBwcm9jZXNzLlxuICogQHBhcmFtIHtudW1iZXJ9IFtzaXplPTFdIFRoZSBsZW5ndGggb2YgZWFjaCBjaHVua1xuICogQHBhcmFtLSB7T2JqZWN0fSBbZ3VhcmRdIEVuYWJsZXMgdXNlIGFzIGFuIGl0ZXJhdGVlIGZvciBtZXRob2RzIGxpa2UgYF8ubWFwYC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGFycmF5IGNvbnRhaW5pbmcgY2h1bmtzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmNodW5rKFsnYScsICdiJywgJ2MnLCAnZCddLCAyKTtcbiAqIC8vID0+IFtbJ2EnLCAnYiddLCBbJ2MnLCAnZCddXVxuICpcbiAqIF8uY2h1bmsoWydhJywgJ2InLCAnYycsICdkJ10sIDMpO1xuICogLy8gPT4gW1snYScsICdiJywgJ2MnXSwgWydkJ11dXG4gKi9cbmZ1bmN0aW9uIGNodW5rKGFycmF5LCBzaXplLCBndWFyZCkge1xuICBpZiAoKGd1YXJkID8gaXNJdGVyYXRlZUNhbGwoYXJyYXksIHNpemUsIGd1YXJkKSA6IHNpemUgPT09IHVuZGVmaW5lZCkpIHtcbiAgICBzaXplID0gMTtcbiAgfSBlbHNlIHtcbiAgICBzaXplID0gbmF0aXZlTWF4KHRvSW50ZWdlcihzaXplKSwgMCk7XG4gIH1cbiAgdmFyIGxlbmd0aCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogMDtcbiAgaWYgKCFsZW5ndGggfHwgc2l6ZSA8IDEpIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgdmFyIGluZGV4ID0gMCxcbiAgICAgIHJlc0luZGV4ID0gMCxcbiAgICAgIHJlc3VsdCA9IEFycmF5KG5hdGl2ZUNlaWwobGVuZ3RoIC8gc2l6ZSkpO1xuXG4gIHdoaWxlIChpbmRleCA8IGxlbmd0aCkge1xuICAgIHJlc3VsdFtyZXNJbmRleCsrXSA9IGJhc2VTbGljZShhcnJheSwgaW5kZXgsIChpbmRleCArPSBzaXplKSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBQZXJmb3JtcyBhXG4gKiBbYFNhbWVWYWx1ZVplcm9gXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1zYW1ldmFsdWV6ZXJvKVxuICogY29tcGFyaXNvbiBiZXR3ZWVuIHR3byB2YWx1ZXMgdG8gZGV0ZXJtaW5lIGlmIHRoZXkgYXJlIGVxdWl2YWxlbnQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0geyp9IG90aGVyIFRoZSBvdGhlciB2YWx1ZSB0byBjb21wYXJlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ3VzZXInOiAnZnJlZCcgfTtcbiAqIHZhciBvdGhlciA9IHsgJ3VzZXInOiAnZnJlZCcgfTtcbiAqXG4gKiBfLmVxKG9iamVjdCwgb2JqZWN0KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKG9iamVjdCwgb3RoZXIpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKCdhJywgJ2EnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKCdhJywgT2JqZWN0KCdhJykpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKE5hTiwgTmFOKTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gZXEodmFsdWUsIG90aGVyKSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gb3RoZXIgfHwgKHZhbHVlICE9PSB2YWx1ZSAmJiBvdGhlciAhPT0gb3RoZXIpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UuIEEgdmFsdWUgaXMgY29uc2lkZXJlZCBhcnJheS1saWtlIGlmIGl0J3NcbiAqIG5vdCBhIGZ1bmN0aW9uIGFuZCBoYXMgYSBgdmFsdWUubGVuZ3RoYCB0aGF0J3MgYW4gaW50ZWdlciBncmVhdGVyIHRoYW4gb3JcbiAqIGVxdWFsIHRvIGAwYCBhbmQgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIGBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUmAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKCdhYmMnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiBpc0xlbmd0aChnZXRMZW5ndGgodmFsdWUpKSAmJiAhaXNGdW5jdGlvbih2YWx1ZSk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBGdW5jdGlvbmAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGNvcnJlY3RseSBjbGFzc2lmaWVkLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0Z1bmN0aW9uKF8pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNGdW5jdGlvbigvYWJjLyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gIC8vIFRoZSB1c2Ugb2YgYE9iamVjdCN0b1N0cmluZ2AgYXZvaWRzIGlzc3VlcyB3aXRoIHRoZSBgdHlwZW9mYCBvcGVyYXRvclxuICAvLyBpbiBTYWZhcmkgOCB3aGljaCByZXR1cm5zICdvYmplY3QnIGZvciB0eXBlZCBhcnJheSBhbmQgd2VhayBtYXAgY29uc3RydWN0b3JzLFxuICAvLyBhbmQgUGhhbnRvbUpTIDEuOSB3aGljaCByZXR1cm5zICdmdW5jdGlvbicgZm9yIGBOb2RlTGlzdGAgaW5zdGFuY2VzLlxuICB2YXIgdGFnID0gaXNPYmplY3QodmFsdWUpID8gb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSkgOiAnJztcbiAgcmV0dXJuIHRhZyA9PSBmdW5jVGFnIHx8IHRhZyA9PSBnZW5UYWc7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGxlbmd0aC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBpcyBsb29zZWx5IGJhc2VkIG9uXG4gKiBbYFRvTGVuZ3RoYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtdG9sZW5ndGgpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgbGVuZ3RoLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0xlbmd0aCgzKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTGVuZ3RoKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzTGVuZ3RoKEluZmluaXR5KTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aCgnMycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNMZW5ndGgodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyAmJlxuICAgIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPD0gTUFYX1NBRkVfSU5URUdFUjtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGVcbiAqIFtsYW5ndWFnZSB0eXBlXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtZWNtYXNjcmlwdC1sYW5ndWFnZS10eXBlcylcbiAqIG9mIGBPYmplY3RgLiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoXy5ub29wKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiAhIXZhbHVlICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgXG4gKiBhbmQgaGFzIGEgYHR5cGVvZmAgcmVzdWx0IG9mIFwib2JqZWN0XCIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdExpa2Uoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc09iamVjdExpa2UobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgU3ltYm9sYCBwcmltaXRpdmUgb3Igb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGNvcnJlY3RseSBjbGFzc2lmaWVkLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1N5bWJvbChTeW1ib2wuaXRlcmF0b3IpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNTeW1ib2woJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTeW1ib2wodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnc3ltYm9sJyB8fFxuICAgIChpc09iamVjdExpa2UodmFsdWUpICYmIG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpID09IHN5bWJvbFRhZyk7XG59XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhbiBpbnRlZ2VyLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIGlzIGxvb3NlbHkgYmFzZWQgb25cbiAqIFtgVG9JbnRlZ2VyYF0oaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLXRvaW50ZWdlcikuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgaW50ZWdlci5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50b0ludGVnZXIoMyk7XG4gKiAvLyA9PiAzXG4gKlxuICogXy50b0ludGVnZXIoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiAwXG4gKlxuICogXy50b0ludGVnZXIoSW5maW5pdHkpO1xuICogLy8gPT4gMS43OTc2OTMxMzQ4NjIzMTU3ZSszMDhcbiAqXG4gKiBfLnRvSW50ZWdlcignMycpO1xuICogLy8gPT4gM1xuICovXG5mdW5jdGlvbiB0b0ludGVnZXIodmFsdWUpIHtcbiAgaWYgKCF2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gMCA/IHZhbHVlIDogMDtcbiAgfVxuICB2YWx1ZSA9IHRvTnVtYmVyKHZhbHVlKTtcbiAgaWYgKHZhbHVlID09PSBJTkZJTklUWSB8fCB2YWx1ZSA9PT0gLUlORklOSVRZKSB7XG4gICAgdmFyIHNpZ24gPSAodmFsdWUgPCAwID8gLTEgOiAxKTtcbiAgICByZXR1cm4gc2lnbiAqIE1BWF9JTlRFR0VSO1xuICB9XG4gIHZhciByZW1haW5kZXIgPSB2YWx1ZSAlIDE7XG4gIHJldHVybiB2YWx1ZSA9PT0gdmFsdWUgPyAocmVtYWluZGVyID8gdmFsdWUgLSByZW1haW5kZXIgOiB2YWx1ZSkgOiAwO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBudW1iZXIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb2Nlc3MuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBudW1iZXIuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udG9OdW1iZXIoMyk7XG4gKiAvLyA9PiAzXG4gKlxuICogXy50b051bWJlcihOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IDVlLTMyNFxuICpcbiAqIF8udG9OdW1iZXIoSW5maW5pdHkpO1xuICogLy8gPT4gSW5maW5pdHlcbiAqXG4gKiBfLnRvTnVtYmVyKCczJyk7XG4gKiAvLyA9PiAzXG4gKi9cbmZ1bmN0aW9uIHRvTnVtYmVyKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKGlzU3ltYm9sKHZhbHVlKSkge1xuICAgIHJldHVybiBOQU47XG4gIH1cbiAgaWYgKGlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHZhciBvdGhlciA9IGlzRnVuY3Rpb24odmFsdWUudmFsdWVPZikgPyB2YWx1ZS52YWx1ZU9mKCkgOiB2YWx1ZTtcbiAgICB2YWx1ZSA9IGlzT2JqZWN0KG90aGVyKSA/IChvdGhlciArICcnKSA6IG90aGVyO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IDAgPyB2YWx1ZSA6ICt2YWx1ZTtcbiAgfVxuICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UocmVUcmltLCAnJyk7XG4gIHZhciBpc0JpbmFyeSA9IHJlSXNCaW5hcnkudGVzdCh2YWx1ZSk7XG4gIHJldHVybiAoaXNCaW5hcnkgfHwgcmVJc09jdGFsLnRlc3QodmFsdWUpKVxuICAgID8gZnJlZVBhcnNlSW50KHZhbHVlLnNsaWNlKDIpLCBpc0JpbmFyeSA/IDIgOiA4KVxuICAgIDogKHJlSXNCYWRIZXgudGVzdCh2YWx1ZSkgPyBOQU4gOiArdmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNodW5rO1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4zLjQgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCBqUXVlcnkgRm91bmRhdGlvbiBhbmQgb3RoZXIgY29udHJpYnV0b3JzIDxodHRwczovL2pxdWVyeS5vcmcvPlxuICogUmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICovXG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIElORklOSVRZID0gMSAvIDAsXG4gICAgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTEsXG4gICAgTUFYX0lOVEVHRVIgPSAxLjc5NzY5MzEzNDg2MjMxNTdlKzMwOCxcbiAgICBOQU4gPSAwIC8gMDtcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdGhlIG1heGltdW0gbGVuZ3RoIGFuZCBpbmRleCBvZiBhbiBhcnJheS4gKi9cbnZhciBNQVhfQVJSQVlfTEVOR1RIID0gNDI5NDk2NzI5NTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIGdlblRhZyA9ICdbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXScsXG4gICAgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXSc7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHdoaXRlc3BhY2UuICovXG52YXIgcmVUcmltID0gL15cXHMrfFxccyskL2c7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBiYWQgc2lnbmVkIGhleGFkZWNpbWFsIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc0JhZEhleCA9IC9eWy0rXTB4WzAtOWEtZl0rJC9pO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgYmluYXJ5IHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc0JpbmFyeSA9IC9eMGJbMDFdKyQvaTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG9jdGFsIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc09jdGFsID0gL14wb1swLTddKyQvaTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IHVuc2lnbmVkIGludGVnZXIgdmFsdWVzLiAqL1xudmFyIHJlSXNVaW50ID0gL14oPzowfFsxLTldXFxkKikkLztcblxuLyoqIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHdpdGhvdXQgYSBkZXBlbmRlbmN5IG9uIGByb290YC4gKi9cbnZhciBmcmVlUGFyc2VJbnQgPSBwYXJzZUludDtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgaW5kZXguXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHBhcmFtIHtudW1iZXJ9IFtsZW5ndGg9TUFYX1NBRkVfSU5URUdFUl0gVGhlIHVwcGVyIGJvdW5kcyBvZiBhIHZhbGlkIGluZGV4LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBpbmRleCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0luZGV4KHZhbHVlLCBsZW5ndGgpIHtcbiAgdmFsdWUgPSAodHlwZW9mIHZhbHVlID09ICdudW1iZXInIHx8IHJlSXNVaW50LnRlc3QodmFsdWUpKSA/ICt2YWx1ZSA6IC0xO1xuICBsZW5ndGggPSBsZW5ndGggPT0gbnVsbCA/IE1BWF9TQUZFX0lOVEVHRVIgOiBsZW5ndGg7XG4gIHJldHVybiB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDwgbGVuZ3RoO1xufVxuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmNsYW1wYCB3aGljaCBkb2Vzbid0IGNvZXJjZSBhcmd1bWVudHMgdG8gbnVtYmVycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IG51bWJlciBUaGUgbnVtYmVyIHRvIGNsYW1wLlxuICogQHBhcmFtIHtudW1iZXJ9IFtsb3dlcl0gVGhlIGxvd2VyIGJvdW5kLlxuICogQHBhcmFtIHtudW1iZXJ9IHVwcGVyIFRoZSB1cHBlciBib3VuZC5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGNsYW1wZWQgbnVtYmVyLlxuICovXG5mdW5jdGlvbiBiYXNlQ2xhbXAobnVtYmVyLCBsb3dlciwgdXBwZXIpIHtcbiAgaWYgKG51bWJlciA9PT0gbnVtYmVyKSB7XG4gICAgaWYgKHVwcGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIG51bWJlciA9IG51bWJlciA8PSB1cHBlciA/IG51bWJlciA6IHVwcGVyO1xuICAgIH1cbiAgICBpZiAobG93ZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgbnVtYmVyID0gbnVtYmVyID49IGxvd2VyID8gbnVtYmVyIDogbG93ZXI7XG4gICAgfVxuICB9XG4gIHJldHVybiBudW1iZXI7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZmlsbGAgd2l0aG91dCBhbiBpdGVyYXRlZSBjYWxsIGd1YXJkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gZmlsbC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGZpbGwgYGFycmF5YCB3aXRoLlxuICogQHBhcmFtIHtudW1iZXJ9IFtzdGFydD0wXSBUaGUgc3RhcnQgcG9zaXRpb24uXG4gKiBAcGFyYW0ge251bWJlcn0gW2VuZD1hcnJheS5sZW5ndGhdIFRoZSBlbmQgcG9zaXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gYmFzZUZpbGwoYXJyYXksIHZhbHVlLCBzdGFydCwgZW5kKSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cbiAgc3RhcnQgPSB0b0ludGVnZXIoc3RhcnQpO1xuICBpZiAoc3RhcnQgPCAwKSB7XG4gICAgc3RhcnQgPSAtc3RhcnQgPiBsZW5ndGggPyAwIDogKGxlbmd0aCArIHN0YXJ0KTtcbiAgfVxuICBlbmQgPSAoZW5kID09PSB1bmRlZmluZWQgfHwgZW5kID4gbGVuZ3RoKSA/IGxlbmd0aCA6IHRvSW50ZWdlcihlbmQpO1xuICBpZiAoZW5kIDwgMCkge1xuICAgIGVuZCArPSBsZW5ndGg7XG4gIH1cbiAgZW5kID0gc3RhcnQgPiBlbmQgPyAwIDogdG9MZW5ndGgoZW5kKTtcbiAgd2hpbGUgKHN0YXJ0IDwgZW5kKSB7XG4gICAgYXJyYXlbc3RhcnQrK10gPSB2YWx1ZTtcbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ucHJvcGVydHlgIHdpdGhvdXQgc3VwcG9ydCBmb3IgZGVlcCBwYXRocy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVByb3BlcnR5KGtleSkge1xuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG4gIH07XG59XG5cbi8qKlxuICogR2V0cyB0aGUgXCJsZW5ndGhcIiBwcm9wZXJ0eSB2YWx1ZSBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBpcyB1c2VkIHRvIGF2b2lkIGFcbiAqIFtKSVQgYnVnXShodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTQyNzkyKSB0aGF0IGFmZmVjdHNcbiAqIFNhZmFyaSBvbiBhdCBsZWFzdCBpT1MgOC4xLTguMyBBUk02NC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIFwibGVuZ3RoXCIgdmFsdWUuXG4gKi9cbnZhciBnZXRMZW5ndGggPSBiYXNlUHJvcGVydHkoJ2xlbmd0aCcpO1xuXG4vKipcbiAqIENoZWNrcyBpZiB0aGUgZ2l2ZW4gYXJndW1lbnRzIGFyZSBmcm9tIGFuIGl0ZXJhdGVlIGNhbGwuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHBvdGVudGlhbCBpdGVyYXRlZSB2YWx1ZSBhcmd1bWVudC5cbiAqIEBwYXJhbSB7Kn0gaW5kZXggVGhlIHBvdGVudGlhbCBpdGVyYXRlZSBpbmRleCBvciBrZXkgYXJndW1lbnQuXG4gKiBAcGFyYW0geyp9IG9iamVjdCBUaGUgcG90ZW50aWFsIGl0ZXJhdGVlIG9iamVjdCBhcmd1bWVudC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYXJndW1lbnRzIGFyZSBmcm9tIGFuIGl0ZXJhdGVlIGNhbGwsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0l0ZXJhdGVlQ2FsbCh2YWx1ZSwgaW5kZXgsIG9iamVjdCkge1xuICBpZiAoIWlzT2JqZWN0KG9iamVjdCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHR5cGUgPSB0eXBlb2YgaW5kZXg7XG4gIGlmICh0eXBlID09ICdudW1iZXInXG4gICAgICAgID8gKGlzQXJyYXlMaWtlKG9iamVjdCkgJiYgaXNJbmRleChpbmRleCwgb2JqZWN0Lmxlbmd0aCkpXG4gICAgICAgIDogKHR5cGUgPT0gJ3N0cmluZycgJiYgaW5kZXggaW4gb2JqZWN0KVxuICAgICAgKSB7XG4gICAgcmV0dXJuIGVxKG9iamVjdFtpbmRleF0sIHZhbHVlKTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogRmlsbHMgZWxlbWVudHMgb2YgYGFycmF5YCB3aXRoIGB2YWx1ZWAgZnJvbSBgc3RhcnRgIHVwIHRvLCBidXQgbm90XG4gKiBpbmNsdWRpbmcsIGBlbmRgLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBtdXRhdGVzIGBhcnJheWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjIuMFxuICogQGNhdGVnb3J5IEFycmF5XG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gZmlsbC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGZpbGwgYGFycmF5YCB3aXRoLlxuICogQHBhcmFtIHtudW1iZXJ9IFtzdGFydD0wXSBUaGUgc3RhcnQgcG9zaXRpb24uXG4gKiBAcGFyYW0ge251bWJlcn0gW2VuZD1hcnJheS5sZW5ndGhdIFRoZSBlbmQgcG9zaXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIGFycmF5ID0gWzEsIDIsIDNdO1xuICpcbiAqIF8uZmlsbChhcnJheSwgJ2EnKTtcbiAqIGNvbnNvbGUubG9nKGFycmF5KTtcbiAqIC8vID0+IFsnYScsICdhJywgJ2EnXVxuICpcbiAqIF8uZmlsbChBcnJheSgzKSwgMik7XG4gKiAvLyA9PiBbMiwgMiwgMl1cbiAqXG4gKiBfLmZpbGwoWzQsIDYsIDgsIDEwXSwgJyonLCAxLCAzKTtcbiAqIC8vID0+IFs0LCAnKicsICcqJywgMTBdXG4gKi9cbmZ1bmN0aW9uIGZpbGwoYXJyYXksIHZhbHVlLCBzdGFydCwgZW5kKSB7XG4gIHZhciBsZW5ndGggPSBhcnJheSA/IGFycmF5Lmxlbmd0aCA6IDA7XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIGlmIChzdGFydCAmJiB0eXBlb2Ygc3RhcnQgIT0gJ251bWJlcicgJiYgaXNJdGVyYXRlZUNhbGwoYXJyYXksIHZhbHVlLCBzdGFydCkpIHtcbiAgICBzdGFydCA9IDA7XG4gICAgZW5kID0gbGVuZ3RoO1xuICB9XG4gIHJldHVybiBiYXNlRmlsbChhcnJheSwgdmFsdWUsIHN0YXJ0LCBlbmQpO1xufVxuXG4vKipcbiAqIFBlcmZvcm1zIGFcbiAqIFtgU2FtZVZhbHVlWmVyb2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLXNhbWV2YWx1ZXplcm8pXG4gKiBjb21wYXJpc29uIGJldHdlZW4gdHdvIHZhbHVlcyB0byBkZXRlcm1pbmUgaWYgdGhleSBhcmUgZXF1aXZhbGVudC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7Kn0gb3RoZXIgVGhlIG90aGVyIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHZhbHVlcyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAndXNlcic6ICdmcmVkJyB9O1xuICogdmFyIG90aGVyID0geyAndXNlcic6ICdmcmVkJyB9O1xuICpcbiAqIF8uZXEob2JqZWN0LCBvYmplY3QpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uZXEob2JqZWN0LCBvdGhlcik7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uZXEoJ2EnLCAnYScpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uZXEoJ2EnLCBPYmplY3QoJ2EnKSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uZXEoTmFOLCBOYU4pO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBlcSh2YWx1ZSwgb3RoZXIpIHtcbiAgcmV0dXJuIHZhbHVlID09PSBvdGhlciB8fCAodmFsdWUgIT09IHZhbHVlICYmIG90aGVyICE9PSBvdGhlcik7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZS4gQSB2YWx1ZSBpcyBjb25zaWRlcmVkIGFycmF5LWxpa2UgaWYgaXQnc1xuICogbm90IGEgZnVuY3Rpb24gYW5kIGhhcyBhIGB2YWx1ZS5sZW5ndGhgIHRoYXQncyBhbiBpbnRlZ2VyIGdyZWF0ZXIgdGhhbiBvclxuICogZXF1YWwgdG8gYDBgIGFuZCBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gYE51bWJlci5NQVhfU0FGRV9JTlRFR0VSYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoJ2FiYycpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIGlzTGVuZ3RoKGdldExlbmd0aCh2YWx1ZSkpICYmICFpc0Z1bmN0aW9uKHZhbHVlKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYEZ1bmN0aW9uYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgY29ycmVjdGx5IGNsYXNzaWZpZWQsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oXyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0Z1bmN0aW9uKC9hYmMvKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcbiAgLy8gVGhlIHVzZSBvZiBgT2JqZWN0I3RvU3RyaW5nYCBhdm9pZHMgaXNzdWVzIHdpdGggdGhlIGB0eXBlb2ZgIG9wZXJhdG9yXG4gIC8vIGluIFNhZmFyaSA4IHdoaWNoIHJldHVybnMgJ29iamVjdCcgZm9yIHR5cGVkIGFycmF5IGFuZCB3ZWFrIG1hcCBjb25zdHJ1Y3RvcnMsXG4gIC8vIGFuZCBQaGFudG9tSlMgMS45IHdoaWNoIHJldHVybnMgJ2Z1bmN0aW9uJyBmb3IgYE5vZGVMaXN0YCBpbnN0YW5jZXMuXG4gIHZhciB0YWcgPSBpc09iamVjdCh2YWx1ZSkgPyBvYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKSA6ICcnO1xuICByZXR1cm4gdGFnID09IGZ1bmNUYWcgfHwgdGFnID09IGdlblRhZztcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgbGVuZ3RoLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIGlzIGxvb3NlbHkgYmFzZWQgb25cbiAqIFtgVG9MZW5ndGhgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy10b2xlbmd0aCkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBsZW5ndGgsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzTGVuZ3RoKDMpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNMZW5ndGgoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNMZW5ndGgoSW5maW5pdHkpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzTGVuZ3RoKCczJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0xlbmd0aCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdudW1iZXInICYmXG4gICAgdmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZSBbbGFuZ3VhZ2UgdHlwZV0oaHR0cHM6Ly9lczUuZ2l0aHViLmlvLyN4OCkgb2YgYE9iamVjdGAuXG4gKiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoXy5ub29wKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiAhIXZhbHVlICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgXG4gKiBhbmQgaGFzIGEgYHR5cGVvZmAgcmVzdWx0IG9mIFwib2JqZWN0XCIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdExpa2Uoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc09iamVjdExpa2UobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgU3ltYm9sYCBwcmltaXRpdmUgb3Igb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGNvcnJlY3RseSBjbGFzc2lmaWVkLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1N5bWJvbChTeW1ib2wuaXRlcmF0b3IpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNTeW1ib2woJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTeW1ib2wodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnc3ltYm9sJyB8fFxuICAgIChpc09iamVjdExpa2UodmFsdWUpICYmIG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpID09IHN5bWJvbFRhZyk7XG59XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhbiBpbnRlZ2VyLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIGlzIGxvb3NlbHkgYmFzZWQgb25cbiAqIFtgVG9JbnRlZ2VyYF0oaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLXRvaW50ZWdlcikuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgaW50ZWdlci5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50b0ludGVnZXIoMyk7XG4gKiAvLyA9PiAzXG4gKlxuICogXy50b0ludGVnZXIoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiAwXG4gKlxuICogXy50b0ludGVnZXIoSW5maW5pdHkpO1xuICogLy8gPT4gMS43OTc2OTMxMzQ4NjIzMTU3ZSszMDhcbiAqXG4gKiBfLnRvSW50ZWdlcignMycpO1xuICogLy8gPT4gM1xuICovXG5mdW5jdGlvbiB0b0ludGVnZXIodmFsdWUpIHtcbiAgaWYgKCF2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gMCA/IHZhbHVlIDogMDtcbiAgfVxuICB2YWx1ZSA9IHRvTnVtYmVyKHZhbHVlKTtcbiAgaWYgKHZhbHVlID09PSBJTkZJTklUWSB8fCB2YWx1ZSA9PT0gLUlORklOSVRZKSB7XG4gICAgdmFyIHNpZ24gPSAodmFsdWUgPCAwID8gLTEgOiAxKTtcbiAgICByZXR1cm4gc2lnbiAqIE1BWF9JTlRFR0VSO1xuICB9XG4gIHZhciByZW1haW5kZXIgPSB2YWx1ZSAlIDE7XG4gIHJldHVybiB2YWx1ZSA9PT0gdmFsdWUgPyAocmVtYWluZGVyID8gdmFsdWUgLSByZW1haW5kZXIgOiB2YWx1ZSkgOiAwO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYW4gaW50ZWdlciBzdWl0YWJsZSBmb3IgdXNlIGFzIHRoZSBsZW5ndGggb2YgYW5cbiAqIGFycmF5LWxpa2Ugb2JqZWN0LlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBpcyBiYXNlZCBvblxuICogW2BUb0xlbmd0aGBdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLXRvbGVuZ3RoKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBpbnRlZ2VyLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvTGVuZ3RoKDMpO1xuICogLy8gPT4gM1xuICpcbiAqIF8udG9MZW5ndGgoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiAwXG4gKlxuICogXy50b0xlbmd0aChJbmZpbml0eSk7XG4gKiAvLyA9PiA0Mjk0OTY3Mjk1XG4gKlxuICogXy50b0xlbmd0aCgnMycpO1xuICogLy8gPT4gM1xuICovXG5mdW5jdGlvbiB0b0xlbmd0aCh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgPyBiYXNlQ2xhbXAodG9JbnRlZ2VyKHZhbHVlKSwgMCwgTUFYX0FSUkFZX0xFTkdUSCkgOiAwO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBudW1iZXIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb2Nlc3MuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBudW1iZXIuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udG9OdW1iZXIoMyk7XG4gKiAvLyA9PiAzXG4gKlxuICogXy50b051bWJlcihOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IDVlLTMyNFxuICpcbiAqIF8udG9OdW1iZXIoSW5maW5pdHkpO1xuICogLy8gPT4gSW5maW5pdHlcbiAqXG4gKiBfLnRvTnVtYmVyKCczJyk7XG4gKiAvLyA9PiAzXG4gKi9cbmZ1bmN0aW9uIHRvTnVtYmVyKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKGlzU3ltYm9sKHZhbHVlKSkge1xuICAgIHJldHVybiBOQU47XG4gIH1cbiAgaWYgKGlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHZhciBvdGhlciA9IGlzRnVuY3Rpb24odmFsdWUudmFsdWVPZikgPyB2YWx1ZS52YWx1ZU9mKCkgOiB2YWx1ZTtcbiAgICB2YWx1ZSA9IGlzT2JqZWN0KG90aGVyKSA/IChvdGhlciArICcnKSA6IG90aGVyO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IDAgPyB2YWx1ZSA6ICt2YWx1ZTtcbiAgfVxuICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UocmVUcmltLCAnJyk7XG4gIHZhciBpc0JpbmFyeSA9IHJlSXNCaW5hcnkudGVzdCh2YWx1ZSk7XG4gIHJldHVybiAoaXNCaW5hcnkgfHwgcmVJc09jdGFsLnRlc3QodmFsdWUpKVxuICAgID8gZnJlZVBhcnNlSW50KHZhbHVlLnNsaWNlKDIpLCBpc0JpbmFyeSA/IDIgOiA4KVxuICAgIDogKHJlSXNCYWRIZXgudGVzdCh2YWx1ZSkgPyBOQU4gOiArdmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZpbGw7XG4iLCIvKipcbiAqIGxvZGFzaCA0LjIuMCAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IGpRdWVyeSBGb3VuZGF0aW9uIGFuZCBvdGhlciBjb250cmlidXRvcnMgPGh0dHBzOi8vanF1ZXJ5Lm9yZy8+XG4gKiBSZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4zIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKi9cbnZhciBiYXNlRmxhdHRlbiA9IHJlcXVpcmUoJ2xvZGFzaC5fYmFzZWZsYXR0ZW4nKTtcblxuLyoqXG4gKiBGbGF0dGVucyBgYXJyYXlgIGEgc2luZ2xlIGxldmVsIGRlZXAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IEFycmF5XG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gZmxhdHRlbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGZsYXR0ZW5lZCBhcnJheS5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5mbGF0dGVuKFsxLCBbMiwgWzMsIFs0XV0sIDVdXSk7XG4gKiAvLyA9PiBbMSwgMiwgWzMsIFs0XV0sIDVdXG4gKi9cbmZ1bmN0aW9uIGZsYXR0ZW4oYXJyYXkpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogMDtcbiAgcmV0dXJuIGxlbmd0aCA/IGJhc2VGbGF0dGVuKGFycmF5LCAxKSA6IFtdO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZsYXR0ZW47XG4iLCIvKipcbiAqIGxvZGFzaCA0LjIuMSAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxNiBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDE2IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG52YXIgYmFzZVVuaXEgPSByZXF1aXJlKCdsb2Rhc2guX2Jhc2V1bmlxJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGR1cGxpY2F0ZS1mcmVlIHZlcnNpb24gb2YgYW4gYXJyYXksIHVzaW5nXG4gKiBbYFNhbWVWYWx1ZVplcm9gXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1zYW1ldmFsdWV6ZXJvKVxuICogZm9yIGVxdWFsaXR5IGNvbXBhcmlzb25zLCBpbiB3aGljaCBvbmx5IHRoZSBmaXJzdCBvY2N1cnJlbmNlIG9mIGVhY2ggZWxlbWVudFxuICogaXMga2VwdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IEFycmF5XG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGR1cGxpY2F0ZSBmcmVlIGFycmF5LlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnVuaXEoWzIsIDEsIDJdKTtcbiAqIC8vID0+IFsyLCAxXVxuICovXG5mdW5jdGlvbiB1bmlxKGFycmF5KSB7XG4gIHJldHVybiAoYXJyYXkgJiYgYXJyYXkubGVuZ3RoKVxuICAgID8gYmFzZVVuaXEoYXJyYXkpXG4gICAgOiBbXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB1bmlxO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihhbW91bnQpIHtcbiAgdmFyIGsgPSB0eXBlb2YgYW1vdW50ID09PSAnbnVtYmVyJyA/IGFtb3VudCA6IDUwLFxuICAgIG5fc2FtcGxlcyA9IDQ0MTAwLFxuICAgIGN1cnZlID0gbmV3IEZsb2F0MzJBcnJheShuX3NhbXBsZXMpLFxuICAgIGRlZyA9IE1hdGguUEkgLyAxODAsXG4gICAgaSA9IDAsXG4gICAgeDtcbiAgZm9yICggOyBpIDwgbl9zYW1wbGVzOyArK2kgKSB7XG4gICAgeCA9IGkgKiAyIC8gbl9zYW1wbGVzIC0gMTtcbiAgICBjdXJ2ZVtpXSA9ICggMyArIGsgKSAqIHggKiAyMCAqIGRlZyAvICggTWF0aC5QSSArIGsgKiBNYXRoLmFicyh4KSApO1xuICB9XG4gIHJldHVybiBjdXJ2ZTtcbn1cbiIsIi8qIVxyXG4gKiBAbmFtZSBKYXZhU2NyaXB0L05vZGVKUyBNZXJnZSB2MS4yLjBcclxuICogQGF1dGhvciB5ZWlrb3NcclxuICogQHJlcG9zaXRvcnkgaHR0cHM6Ly9naXRodWIuY29tL3llaWtvcy9qcy5tZXJnZVxyXG5cclxuICogQ29weXJpZ2h0IDIwMTQgeWVpa29zIC0gTUlUIGxpY2Vuc2VcclxuICogaHR0cHM6Ly9yYXcuZ2l0aHViLmNvbS95ZWlrb3MvanMubWVyZ2UvbWFzdGVyL0xJQ0VOU0VcclxuICovXHJcblxyXG47KGZ1bmN0aW9uKGlzTm9kZSkge1xyXG5cclxuXHQvKipcclxuXHQgKiBNZXJnZSBvbmUgb3IgbW9yZSBvYmplY3RzIFxyXG5cdCAqIEBwYXJhbSBib29sPyBjbG9uZVxyXG5cdCAqIEBwYXJhbSBtaXhlZCwuLi4gYXJndW1lbnRzXHJcblx0ICogQHJldHVybiBvYmplY3RcclxuXHQgKi9cclxuXHJcblx0dmFyIFB1YmxpYyA9IGZ1bmN0aW9uKGNsb25lKSB7XHJcblxyXG5cdFx0cmV0dXJuIG1lcmdlKGNsb25lID09PSB0cnVlLCBmYWxzZSwgYXJndW1lbnRzKTtcclxuXHJcblx0fSwgcHVibGljTmFtZSA9ICdtZXJnZSc7XHJcblxyXG5cdC8qKlxyXG5cdCAqIE1lcmdlIHR3byBvciBtb3JlIG9iamVjdHMgcmVjdXJzaXZlbHkgXHJcblx0ICogQHBhcmFtIGJvb2w/IGNsb25lXHJcblx0ICogQHBhcmFtIG1peGVkLC4uLiBhcmd1bWVudHNcclxuXHQgKiBAcmV0dXJuIG9iamVjdFxyXG5cdCAqL1xyXG5cclxuXHRQdWJsaWMucmVjdXJzaXZlID0gZnVuY3Rpb24oY2xvbmUpIHtcclxuXHJcblx0XHRyZXR1cm4gbWVyZ2UoY2xvbmUgPT09IHRydWUsIHRydWUsIGFyZ3VtZW50cyk7XHJcblxyXG5cdH07XHJcblxyXG5cdC8qKlxyXG5cdCAqIENsb25lIHRoZSBpbnB1dCByZW1vdmluZyBhbnkgcmVmZXJlbmNlXHJcblx0ICogQHBhcmFtIG1peGVkIGlucHV0XHJcblx0ICogQHJldHVybiBtaXhlZFxyXG5cdCAqL1xyXG5cclxuXHRQdWJsaWMuY2xvbmUgPSBmdW5jdGlvbihpbnB1dCkge1xyXG5cclxuXHRcdHZhciBvdXRwdXQgPSBpbnB1dCxcclxuXHRcdFx0dHlwZSA9IHR5cGVPZihpbnB1dCksXHJcblx0XHRcdGluZGV4LCBzaXplO1xyXG5cclxuXHRcdGlmICh0eXBlID09PSAnYXJyYXknKSB7XHJcblxyXG5cdFx0XHRvdXRwdXQgPSBbXTtcclxuXHRcdFx0c2l6ZSA9IGlucHV0Lmxlbmd0aDtcclxuXHJcblx0XHRcdGZvciAoaW5kZXg9MDtpbmRleDxzaXplOysraW5kZXgpXHJcblxyXG5cdFx0XHRcdG91dHB1dFtpbmRleF0gPSBQdWJsaWMuY2xvbmUoaW5wdXRbaW5kZXhdKTtcclxuXHJcblx0XHR9IGVsc2UgaWYgKHR5cGUgPT09ICdvYmplY3QnKSB7XHJcblxyXG5cdFx0XHRvdXRwdXQgPSB7fTtcclxuXHJcblx0XHRcdGZvciAoaW5kZXggaW4gaW5wdXQpXHJcblxyXG5cdFx0XHRcdG91dHB1dFtpbmRleF0gPSBQdWJsaWMuY2xvbmUoaW5wdXRbaW5kZXhdKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIG91dHB1dDtcclxuXHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogTWVyZ2UgdHdvIG9iamVjdHMgcmVjdXJzaXZlbHlcclxuXHQgKiBAcGFyYW0gbWl4ZWQgaW5wdXRcclxuXHQgKiBAcGFyYW0gbWl4ZWQgZXh0ZW5kXHJcblx0ICogQHJldHVybiBtaXhlZFxyXG5cdCAqL1xyXG5cclxuXHRmdW5jdGlvbiBtZXJnZV9yZWN1cnNpdmUoYmFzZSwgZXh0ZW5kKSB7XHJcblxyXG5cdFx0aWYgKHR5cGVPZihiYXNlKSAhPT0gJ29iamVjdCcpXHJcblxyXG5cdFx0XHRyZXR1cm4gZXh0ZW5kO1xyXG5cclxuXHRcdGZvciAodmFyIGtleSBpbiBleHRlbmQpIHtcclxuXHJcblx0XHRcdGlmICh0eXBlT2YoYmFzZVtrZXldKSA9PT0gJ29iamVjdCcgJiYgdHlwZU9mKGV4dGVuZFtrZXldKSA9PT0gJ29iamVjdCcpIHtcclxuXHJcblx0XHRcdFx0YmFzZVtrZXldID0gbWVyZ2VfcmVjdXJzaXZlKGJhc2Vba2V5XSwgZXh0ZW5kW2tleV0pO1xyXG5cclxuXHRcdFx0fSBlbHNlIHtcclxuXHJcblx0XHRcdFx0YmFzZVtrZXldID0gZXh0ZW5kW2tleV07XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBiYXNlO1xyXG5cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIE1lcmdlIHR3byBvciBtb3JlIG9iamVjdHNcclxuXHQgKiBAcGFyYW0gYm9vbCBjbG9uZVxyXG5cdCAqIEBwYXJhbSBib29sIHJlY3Vyc2l2ZVxyXG5cdCAqIEBwYXJhbSBhcnJheSBhcmd2XHJcblx0ICogQHJldHVybiBvYmplY3RcclxuXHQgKi9cclxuXHJcblx0ZnVuY3Rpb24gbWVyZ2UoY2xvbmUsIHJlY3Vyc2l2ZSwgYXJndikge1xyXG5cclxuXHRcdHZhciByZXN1bHQgPSBhcmd2WzBdLFxyXG5cdFx0XHRzaXplID0gYXJndi5sZW5ndGg7XHJcblxyXG5cdFx0aWYgKGNsb25lIHx8IHR5cGVPZihyZXN1bHQpICE9PSAnb2JqZWN0JylcclxuXHJcblx0XHRcdHJlc3VsdCA9IHt9O1xyXG5cclxuXHRcdGZvciAodmFyIGluZGV4PTA7aW5kZXg8c2l6ZTsrK2luZGV4KSB7XHJcblxyXG5cdFx0XHR2YXIgaXRlbSA9IGFyZ3ZbaW5kZXhdLFxyXG5cclxuXHRcdFx0XHR0eXBlID0gdHlwZU9mKGl0ZW0pO1xyXG5cclxuXHRcdFx0aWYgKHR5cGUgIT09ICdvYmplY3QnKSBjb250aW51ZTtcclxuXHJcblx0XHRcdGZvciAodmFyIGtleSBpbiBpdGVtKSB7XHJcblxyXG5cdFx0XHRcdHZhciBzaXRlbSA9IGNsb25lID8gUHVibGljLmNsb25lKGl0ZW1ba2V5XSkgOiBpdGVtW2tleV07XHJcblxyXG5cdFx0XHRcdGlmIChyZWN1cnNpdmUpIHtcclxuXHJcblx0XHRcdFx0XHRyZXN1bHRba2V5XSA9IG1lcmdlX3JlY3Vyc2l2ZShyZXN1bHRba2V5XSwgc2l0ZW0pO1xyXG5cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdFx0XHRcdHJlc3VsdFtrZXldID0gc2l0ZW07XHJcblxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBHZXQgdHlwZSBvZiB2YXJpYWJsZVxyXG5cdCAqIEBwYXJhbSBtaXhlZCBpbnB1dFxyXG5cdCAqIEByZXR1cm4gc3RyaW5nXHJcblx0ICpcclxuXHQgKiBAc2VlIGh0dHA6Ly9qc3BlcmYuY29tL3R5cGVvZnZhclxyXG5cdCAqL1xyXG5cclxuXHRmdW5jdGlvbiB0eXBlT2YoaW5wdXQpIHtcclxuXHJcblx0XHRyZXR1cm4gKHt9KS50b1N0cmluZy5jYWxsKGlucHV0KS5zbGljZSg4LCAtMSkudG9Mb3dlckNhc2UoKTtcclxuXHJcblx0fVxyXG5cclxuXHRpZiAoaXNOb2RlKSB7XHJcblxyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBQdWJsaWM7XHJcblxyXG5cdH0gZWxzZSB7XHJcblxyXG5cdFx0d2luZG93W3B1YmxpY05hbWVdID0gUHVibGljO1xyXG5cclxuXHR9XHJcblxyXG59KSh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzID09PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cyk7IiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBDSFJPTUFUSUMgPSBbICdDJywgJ0RiJywgJ0QnLCAnRWInLCAnRScsICdGJywgJ0diJywgJ0cnLCAnQWInLCAnQScsICdCYicsICdCJyBdXG5cbi8qKlxuICogR2V0IHRoZSBub3RlIG5hbWUgKGluIHNjaWVudGlmaWMgbm90YXRpb24pIG9mIHRoZSBnaXZlbiBtaWRpIG51bWJlclxuICpcbiAqIEl0IHVzZXMgTUlESSdzIFtUdW5pbmcgU3RhbmRhcmRdKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL01JRElfVHVuaW5nX1N0YW5kYXJkKVxuICogd2hlcmUgQTQgaXMgNjlcbiAqXG4gKiBUaGlzIG1ldGhvZCBkb2Vzbid0IHRha2UgaW50byBhY2NvdW50IGRpYXRvbmljIHNwZWxsaW5nLiBBbHdheXMgdGhlIHNhbWVcbiAqIHBpdGNoIGNsYXNzIGlzIGdpdmVuIGZvciB0aGUgc2FtZSBtaWRpIG51bWJlci5cbiAqXG4gKiBAbmFtZSBtaWRpLm5vdGVcbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIHtJbnRlZ2VyfSBtaWRpIC0gdGhlIG1pZGkgbnVtYmVyXG4gKiBAcmV0dXJuIHtTdHJpbmd9IHRoZSBwaXRjaFxuICpcbiAqIEBleGFtcGxlXG4gKiB2YXIgbm90ZSA9IHJlcXVpcmUoJ21pZGktbm90ZScpXG4gKiBub3RlKDY5KSAvLyA9PiAnQTQnXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG1pZGkpIHtcbiAgaWYgKGlzTmFOKG1pZGkpIHx8IG1pZGkgPCAwIHx8IG1pZGkgPiAxMjcpIHJldHVybiBudWxsXG4gIHZhciBuYW1lID0gQ0hST01BVElDW21pZGkgJSAxMl1cbiAgdmFyIG9jdCA9IE1hdGguZmxvb3IobWlkaSAvIDEyKSAtIDFcbiAgcmV0dXJuIG5hbWUgKyBvY3Rcbn1cbiIsIihmdW5jdGlvbigpIHtcblxuXHR2YXIgbm90ZU1hcCA9IHt9O1xuXHR2YXIgbm90ZU51bWJlck1hcCA9IFtdO1xuXHR2YXIgbm90ZXMgPSBbIFwiQ1wiLCBcIkMjXCIsIFwiRFwiLCBcIkQjXCIsIFwiRVwiLCBcIkZcIiwgXCJGI1wiLCBcIkdcIiwgXCJHI1wiLCBcIkFcIiwgXCJBI1wiLCBcIkJcIiBdO1xuXG5cblx0Zm9yKHZhciBpID0gMDsgaSA8IDEyNzsgaSsrKSB7XG5cblx0XHR2YXIgaW5kZXggPSBpLFxuXHRcdFx0a2V5ID0gbm90ZXNbaW5kZXggJSAxMl0sXG5cdFx0XHRvY3RhdmUgPSAoKGluZGV4IC8gMTIpIHwgMCkgLSAxOyAvLyBNSURJIHNjYWxlIHN0YXJ0cyBhdCBvY3RhdmUgPSAtMVxuXG5cdFx0aWYoa2V5Lmxlbmd0aCA9PT0gMSkge1xuXHRcdFx0a2V5ID0ga2V5ICsgJy0nO1xuXHRcdH1cblxuXHRcdGtleSArPSBvY3RhdmU7XG5cblx0XHRub3RlTWFwW2tleV0gPSBpO1xuXHRcdG5vdGVOdW1iZXJNYXBbaV0gPSBrZXk7XG5cblx0fVxuXG5cblx0ZnVuY3Rpb24gZ2V0QmFzZUxvZyh2YWx1ZSwgYmFzZSkge1xuXHRcdHJldHVybiBNYXRoLmxvZyh2YWx1ZSkgLyBNYXRoLmxvZyhiYXNlKTtcblx0fVxuXG5cblx0dmFyIE1JRElVdGlscyA9IHtcblxuXHRcdG5vdGVOYW1lVG9Ob3RlTnVtYmVyOiBmdW5jdGlvbihuYW1lKSB7XG5cdFx0XHRyZXR1cm4gbm90ZU1hcFtuYW1lXTtcblx0XHR9LFxuXG5cdFx0bm90ZU51bWJlclRvRnJlcXVlbmN5OiBmdW5jdGlvbihub3RlKSB7XG5cdFx0XHRyZXR1cm4gNDQwLjAgKiBNYXRoLnBvdygyLCAobm90ZSAtIDY5LjApIC8gMTIuMCk7XG5cdFx0fSxcblxuXHRcdG5vdGVOdW1iZXJUb05hbWU6IGZ1bmN0aW9uKG5vdGUpIHtcblx0XHRcdHJldHVybiBub3RlTnVtYmVyTWFwW25vdGVdO1xuXHRcdH0sXG5cblx0XHRmcmVxdWVuY3lUb05vdGVOdW1iZXI6IGZ1bmN0aW9uKGYpIHtcblx0XHRcdHJldHVybiBNYXRoLnJvdW5kKDEyLjAgKiBnZXRCYXNlTG9nKGYgLyA0NDAuMCwgMikgKyA2OSk7XG5cdFx0fVxuXG5cdH07XG5cblxuXHQvLyBNYWtlIGl0IGNvbXBhdGlibGUgZm9yIHJlcXVpcmUuanMvQU1EIGxvYWRlcihzKVxuXHRpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcblx0XHRkZWZpbmUoZnVuY3Rpb24oKSB7IHJldHVybiBNSURJVXRpbHM7IH0pO1xuXHR9IGVsc2UgaWYodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcblx0XHQvLyBBbmQgZm9yIG5wbS9ub2RlLmpzXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBNSURJVXRpbHM7XG5cdH0gZWxzZSB7XG5cdFx0dGhpcy5NSURJVXRpbHMgPSBNSURJVXRpbHM7XG5cdH1cblxuXG59KS5jYWxsKHRoaXMpO1xuXG4iLCIndXNlIHN0cmljdCdcblxudmFyIHRyYW5zcG9zZSA9IHJlcXVpcmUoJ25vdGUtdHJhbnNwb3NlcicpXG52YXIgaW50ZXJ2YWwgPSByZXF1aXJlKCdub3RlLWludGVydmFsJylcbnZhciBwYXJzZSA9IHJlcXVpcmUoJ211c2ljLW5vdGF0aW9uL25vdGUvcGFyc2UnKVxudmFyIHBhcnNlSSA9IHJlcXVpcmUoJ211c2ljLW5vdGF0aW9uL2ludGVydmFsL3BhcnNlJylcbnZhciBzdHIgPSByZXF1aXJlKCdtdXNpYy1ub3RhdGlvbi9ub3RlL3N0cicpXG5cbnZhciBSRUdFWCA9IC9eI3sxLDd9fGJ7MSw3fSQvXG52YXIgS0VZUyA9IHsgbWFqb3I6IDEsIG1pbm9yOiA2LCBpb25pYW46IDEsIGRvcmlhbjogMiwgcGhyeWdpYW46IDMsIGx5ZGlhbjogNCxcbiAgbWl4b2x5ZGlhbjogNSwgYWVvbGlhbjogNiwgbG9jcmlhbjogNyB9XG52YXIgU0NBTEVTID0gW1xuICAnMSAyIDMgNCA1IDYgNycsICcxIDIgM2IgNCA1IDYgN2InLCAnMSAyYiAzYiA0IDUgNmIgN2InLCAnMSAyIDMgNCMgNSA2IDcnLFxuICAnMSAyIDMgNCA1IDYgN2InLCAnMSAyIDNiIDQgNSA2YiA3YicsICcxIDJiIDNiIDQgNWIgNmIgN2InXG5dLm1hcChmdW5jdGlvbiAoZykgeyByZXR1cm4gZy5zcGxpdCgnICcpIH0pXG5cbi8qKlxuICogQ3JlYXRlIGEga2V5IGZyb20gYSBzdHJpbmcuIEEga2V5IGlzIGEgc3RyaW5nIHdpdGggYSB0b25pYyBhbmQgYSBtb2RlXG4gKlxuICogQG5hbWUga2V5XG4gKiBAZnVuY3Rpb25cbiAqXG4gKiBAZXhhbXBsZVxuICogdmFyIGtleSA9IHJlcXVpcmUoJ211c2ljLWtleScpXG4gKiBrZXkoJ0MgbWFqb3InKSAvLyA9PiAnQyBtYWpvcidcbiAqIGtleSgnYyBNYWpvcicpIC8vID0+ICdDIG1ham9yJ1xuICoga2V5KCdDJykgLy8gPT4gJ0MgbWFqb3InXG4gKiBrZXkoJ2RiYiBtaVhvbHlkaWFuJykgLy8gPT4gJ0RiYiBtaXhvbHlkaWFuJ1xuICovXG5mdW5jdGlvbiBLZXkgKHN0cikge1xuICBpZiAoL14tP1xcZCQvLmV4ZWMoc3RyKSkge1xuICAgIHJldHVybiBtYWpvcigrc3RyKVxuICB9IGVsc2UgaWYgKFJFR0VYLmV4ZWMoc3RyKSkge1xuICAgIHZhciBkaXIgPSBzdHJbMF0gPT09ICdiJyA/IC0xIDogMVxuICAgIHJldHVybiBtYWpvcihzdHIubGVuZ3RoICogZGlyKVxuICB9IGVsc2Uge1xuICAgIHZhciBwID0gS2V5LnBhcnNlKHN0cilcbiAgICByZXR1cm4gcCA/IHAudG9uaWMgKyAnICcgKyBwLm1vZGUgOiBudWxsXG4gIH1cbn1cbmZ1bmN0aW9uIG1ham9yIChuKSB7IHJldHVybiB0cmFuc3Bvc2UoJ0MnLCBbbiwgMF0pICsgJyBtYWpvcicgfVxuXG4vKipcbiAqIFBhcnNlIGEga2V5IG5hbWVcbiAqXG4gKiBAbmFtZSBrZXkucGFyc2VcbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSB0aGUga2V5IG5hbWVcbiAqIEByZXR1cm4ge0FycmF5fSBhbiBhcnJheSB3aXRoIHRoZSB0b25pYyBhbmQgbW9kZSBvciBudWxsIGlmIG5vdCB2YWxpZCBrZXlcbiAqXG4gKiBAZXhhbXBsZVxuICogdmFyIGtleSA9IHJlcXVpcmUoJ211c2ljLWtleScpXG4gKiBrZXkucGFyc2UoJ0MgbWFqb3InKSAvLyA9PiBbJ0MnLCAnbWFqb3InXVxuICoga2V5LnBhcnNlKCdmeCBNSU5PUicpIC8vID0+IFsnRiMjJywgJ21pbm9yJ11cbiAqIGtleS5wYXJzZSgnQWIgbWl4b2x5ZGlhbicpIC8vID0+IFsnQWInLCAnbWl4b2x5ZGlhbiddXG4gKiBrZXkucGFyc2UoJ2YgYmVib3AnKSAvLyA9PiAnbnVsbCdcbiAqL1xuS2V5LnBhcnNlID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgdmFyIG0sIHMsIHRcbiAgaWYgKCFuYW1lKSByZXR1cm4gbnVsbFxuICBzID0gbmFtZS50cmltKCkuc3BsaXQoL1xccysvKVxuICB0ID0gc3RyKHBhcnNlKChzWzBdKSkpXG4gIGlmIChzLmxlbmd0aCA9PT0gMSkge1xuICAgIG0gPSBzWzBdLnRvTG93ZXJDYXNlKClcbiAgICBpZiAoS0VZU1ttXSkgcmV0dXJuIGsobnVsbCwgbSlcbiAgICBlbHNlIGlmICh0KSByZXR1cm4gayh0LCAnbWFqb3InKVxuICAgIGVsc2UgcmV0dXJuIG51bGxcbiAgfVxuICBtID0gc1sxXS50b0xvd2VyQ2FzZSgpXG4gIGlmICh0ICYmIEtFWVNbbV0pIHJldHVybiBrKHQsIG0pXG4gIHJldHVybiBudWxsXG59XG5cbmZ1bmN0aW9uIGsgKHQsIG0pIHsgcmV0dXJuIHt0b25pYzogdCB8fCBmYWxzZSwgbW9kZTogbSwgYWx0OiBLRVlTW21dfSB9XG5cbi8qKlxuICogR2V0IHJlbGF0aXZlIG9mIGEga2V5XG4gKlxuICogVGhpcyBmdW5jdGlvbiBpcyBjdXJyaWZpZWQsIHNvIGl0IGNhbiBiZSBwYXJ0aWFsbHkgYXBwbGllZCAoc2VlIGV4YW1wbGVzKVxuICpcbiAqIEBuYW1lIGtleS5yZWxhdGl2ZVxuICogQGZ1bmN0aW9uXG4gKiBAcGFyYW0ge1N0cmluZ30gcmVsYXRpdmUgLSB0aGUgbmFtZSBvZiB0aGUgcmVsYXRpdmUgbW9kZSBkZXNpcmVkXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5IC0gdGhlIGtleSBuYW1lXG4gKiBAcmV0dXJuIHtTdHJpbmd9IHRoZSByZWxhdGl2ZSBrZXkgbmFtZSBvciBudWxsIGlmIHRoZSBrZXkgb3IgdGhlIHJlbGF0aXZlIG5hbWVcbiAqIGFyZSBub3QgdmFsaWRcbiAqXG4gKiBAZXhhbXBsZVxuICogdmFyIGtleSA9IHJlcXVpcmUoJ211c2ljLWtleScpXG4gKiBrZXkucmVsYXRpdmUoJ21pbm9yJywgJ0MgbWFqb3InKSAvLyA9PiAnQSBtaW5vcidcbiAqIGtleS5yZWxhdGl2ZSgnbWFqb3InLCAnQSBtaW5vcicpIC8vID0+ICdDIG1ham9yJ1xuICoga2V5LnJlbGF0aXZlKCdkb3JpYW4nLCAnRiBtYWpvcicpIC8vID0+ICdHIGRvcmlhbidcbiAqXG4gKiAvLyBwYXJ0aWFsbHkgYXBwbGljYXRpb25cbiAqIHZhciBtaW5vck9mID0ga2V5LnJlbGF0aXZlKCdtaW5vcicpXG4gKiBtaW5vck9mKCdCYiBtYWpvcicpIC8vID0+ICdHIG1pbm9yJ1xuICovXG5LZXkucmVsYXRpdmUgPSBmdW5jdGlvbiAocmVsLCBrZXkpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHJldHVybiBmdW5jdGlvbiAoaykgeyByZXR1cm4gS2V5LnJlbGF0aXZlKHJlbCwgaykgfVxuICB2YXIgayA9IEtleS5wYXJzZShrZXkpXG4gIHZhciByID0gS2V5LnBhcnNlKHJlbClcbiAgaWYgKCFrIHx8ICFrLnRvbmljIHx8ICFyKSByZXR1cm4gbnVsbFxuICB2YXIgbWFqb3IgPSBrLm1vZGUgPT09ICdtYWpvcicgPyBrLnRvbmljIDogdHJhbnNwb3NlKGsudG9uaWMsICctJyArIGsuYWx0KVxuICByZXR1cm4gci5tb2RlID09PSAnbWFqb3InID8gbWFqb3IgKyAnIG1ham9yJyA6IHRyYW5zcG9zZShtYWpvciwgJycgKyByLmFsdCkgKyAnICcgKyByZWxcbn1cblxuLyoqXG4gKiBHZXQgdGhlIG51bWJlciBvZiBhbHRlcmF0aW9ucyBvZiBhIGtleVxuICpcbiAqIEBuYW1lIGtleS5hbHRlcmF0b25zXG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gdGhlIGtleSBuYW1lXG4gKiBAcmV0dXJuIHtJbnRlZ2VyfSB0aGUgbnVtYmVyIG9mIGFsdGVyYXRpb25zIG9yIG51bGwgaWYgbm90IHZhbGlkIGtleVxuICpcbiAqIEBleGFtcGxlXG4gKiB2YXIga2V5ID0gcmVxdWlyZSgnbXVzaWMta2V5JylcbiAqIGtleS5hbHRlcmF0aW9ucygnQyBtYWpvcicpIC8vID0+IDBcbiAqIGtleS5hbHRlcmF0aW9ucygnRiBtYWpvcicpIC8vID0+IC0xXG4gKiBrZXkuYWx0ZXJhdGlvbnMoJ0ViIG1ham9yJykgLy8gPT4gLTNcbiAqIGtleS5hbHRlcmF0aW9ucygnQSBtYWpvcicpIC8vID0+IDNcbiAqIGtleS5hbHRlcmF0aW9ucygnbm9uc2Vuc2UnKSAvLyA9PiBudWxsXG4gKi9cbktleS5hbHRlcmF0aW9ucyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgdmFyIGsgPSBLZXkucmVsYXRpdmUoJ21ham9yJywga2V5KVxuICByZXR1cm4gayA/IHBhcnNlSShpbnRlcnZhbCgnQycsIGsuc3BsaXQoJyAnKVswXSkpWzBdIDogbnVsbFxufVxuXG4vKipcbiAqIEdldCBzaWduYXR1cmUgb2YgYSBrZXlcbiAqXG4gKiBAbmFtZSBrZXkuc2lnbmF0dXJlXG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gdGhlIGtleSBuYW1lXG4gKiBAcmV0dXJuIHtTdHJpbmd9IGEgc3RyaW5nIHdpdGggdGhlIGFsdGVyYXRpb25zXG4gKlxuICogQGV4YW1wbGVcbiAqIHZhciBrZXkgPSByZXF1aXJlKCdtdXNpYy1rZXknKVxuICoga2V5LnNpZ25hdHVyZSgnRiBtYWpvcicpIC8vID0+ICdiJ1xuICoga2V5LnNpZ25hdHVyZSgnRWIgbWFqb3InKSAvLyA9PiAnYmJiJ1xuICoga2V5LnNpZ25hdHVyZSgnQSBtYWpvcicpIC8vID0+ICcjIyMnXG4gKiBrZXkuc2lnbmF0dXJlKCdDIG1ham9yJykgLy8gPT4gJydcbiAqIGtleS5zaWduYXR1cmUoJ25vbnNlbnNlJykgLy8gPT4gbnVsbFxuICovXG5LZXkuc2lnbmF0dXJlID0gZnVuY3Rpb24gKGtleSkge1xuICB2YXIgbiA9IEtleS5hbHRlcmF0aW9ucyhrZXkpXG4gIHJldHVybiBuICE9PSBudWxsID8gbmV3IEFycmF5KE1hdGguYWJzKG4pICsgMSkuam9pbihuIDwgMCA/ICdiJyA6ICcjJykgOiBudWxsXG59XG5cbi8qKlxuICogR2V0IGEgbGlzdCBvZiBhbHRlcmVkIG5vdGVzIGluIHRoZSBhcHByb3ByaWF0ZSBvcmRlclxuICpcbiAqIEBuYW1lIGtleS5hbHRlcmVkXG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gdGhlIGtleSBuYW1lXG4gKiBAcmV0dXJuIHtBcnJheX0gYW4gYXJyYXkgd2l0aCB0aGUgYWx0ZXJlZCBub3RlcyBvcmRlcmVkIG9yIGFuIGVtcHR5IGFycmF5XG4gKiBpZiBpdHMgbm90IGEgdmFsaWQga2V5IG5hbWVcbiAqXG4gKiBAZXhhbXBsZVxuICoga2V5LmFsdGVyZWQoJ0YgbWFqb3InKSAvLyA9PiBbJ0JiJ11cbiAqIGtleS5hbHRlcmVkKCdFYiBtYWpvcicpIC8vID0+IFsnQmInLCAnRWInLCAnQWInXVxuICoga2V5LmFsdGVyZWQoJ0EgbWFqb3InKSAvLyA9PiBbJ0YjJywgJ0MjJywgJ0cjJ11cbiAqL1xuS2V5LmFsdGVyZWQgPSBmdW5jdGlvbiAoaykge1xuICB2YXIgYSA9IEtleS5hbHRlcmF0aW9ucyhrKVxuICBpZiAoYSA9PT0gbnVsbCkgcmV0dXJuIG51bGxcbiAgdmFyIG5vdGVzID0gW11cbiAgdmFyIHRvbmljID0gYSA+IDAgPyAnQicgOiAnRidcbiAgdmFyIGludGVydmFsID0gYSA+IDAgPyBbMSwgMF0gOiBbLTEsIDBdXG4gIHZhciBsID0gTWF0aC5hYnMoYSlcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICB0b25pYyA9IHRyYW5zcG9zZSh0b25pYywgaW50ZXJ2YWwpXG4gICAgbm90ZXMucHVzaCh0b25pYylcbiAgfVxuICByZXR1cm4gbm90ZXNcbn1cblxuLyoqXG4gKiBHZXQgdGhlIHNjYWxlIG9mIGEga2V5XG4gKlxuICogQG5hbWUga2V5LnNjYWxlXG4gKiBAZnVuY3Rpb25cbiAqXG4gKiBAZXhhbXBsZVxuICogdmFyIGtleSA9IHJlcXVpcmUoJ211c2ljLWtleScpXG4gKiBrZXkuc2NhbGUoJ0MgbWFqb3InKSAvLyA9PiBbJ0MnLCAnRCcsICdFJywgLi4uXVxuICovXG5LZXkuc2NhbGUgPSBmdW5jdGlvbiAobmFtZSkge1xuICB2YXIgayA9IEtleS5wYXJzZShuYW1lKVxuICBpZiAoIWspIHJldHVybiBbXVxuICByZXR1cm4gU0NBTEVTW2suYWx0IC0gMV0ubWFwKHRyYW5zcG9zZShrLnRvbmljKSlcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBLZXlcbiIsIid1c2Ugc3RyaWN0J1xuXG4vKipcbiAqIEJ1aWxkIGFuIGFjY2lkZW50YWxzIHN0cmluZyBmcm9tIGFsdGVyYXRpb24gbnVtYmVyXG4gKlxuICogQG5hbWUgYWNjaWRlbnRhbHMuc3RyXG4gKiBAcGFyYW0ge0ludGVnZXJ9IGFsdGVyYXRpb24gLSB0aGUgYWx0ZXJhdGlvbiBudW1iZXJcbiAqIEByZXR1cm4ge1N0cmluZ30gdGhlIGFjY2lkZW50YWxzIHN0cmluZ1xuICpcbiAqIEBleGFtcGxlXG4gKiB2YXIgYWNjaWRlbnRhbHMgPSByZXF1aXJlKCdtdXNpYy1ub3RhdGlvbi9hY2NpZGVudGFscy9zdHInKVxuICogYWNjaWRlbnRhbHMoMCkgLy8gPT4gJydcbiAqIGFjY2lkZW50YWxzKDEpIC8vID0+ICcjJ1xuICogYWNjaWRlbnRhbHMoMikgLy8gPT4gJyMjJ1xuICogYWNjaWRlbnRhbHMoLTEpIC8vID0+ICdiJ1xuICogYWNjaWRlbnRhbHMoLTIpIC8vID0+ICdiYidcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobnVtKSB7XG4gIGlmIChudW0gPCAwKSByZXR1cm4gQXJyYXkoLW51bSArIDEpLmpvaW4oJ2InKVxuICBlbHNlIGlmIChudW0gPiAwKSByZXR1cm4gQXJyYXkobnVtICsgMSkuam9pbignIycpXG4gIGVsc2UgcmV0dXJuICcnXG59XG4iLCIndXNlIHN0cmljdCdcblxuLy8gbWFwIGZyb20gcGl0Y2ggbnVtYmVyIHRvIG51bWJlciBvZiBmaWZ0aHMgYW5kIG9jdGF2ZXNcbnZhciBCQVNFUyA9IFsgWzAsIDBdLCBbMiwgLTFdLCBbNCwgLTJdLCBbLTEsIDFdLCBbMSwgMF0sIFszLCAtMV0sIFs1LCAtMl0gXVxuXG4vKipcbiAqIEdldCBhIHBpdGNoIGluIFthcnJheSBub3RhdGlvbl0oKSBmcm9tIHBpdGNoIHByb3BlcnRpZXNcbiAqXG4gKiBAbmFtZSBhcnJheS5mcm9tUHJvcHNcbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIHtJbnRlZ2VyfSBzdGVwIC0gdGhlIHN0ZXAgaW5kZXhcbiAqIEBwYXJhbSB7SW50ZWdlcn0gYWx0ZXJhdGlvbnMgLSAoT3B0aW9uYWwpIHRoZSBhbHRlcmF0aW9ucyBudW1iZXJcbiAqIEBwYXJhbSB7SW50ZWdlcn0gb2N0YXZlIC0gKE9wdGlvbmFsKSB0aGUgb2N0YXZlXG4gKiBAcGFyYW0ge0ludGVnZXJ9IGR1cmF0aW9uIC0gKE9wdGlvbmFsKSBkdXJhdGlvblxuICogQHJldHVybiB7QXJyYXl9IHRoZSBwaXRjaCBpbiBhcnJheSBmb3JtYXRcbiAqXG4gKiBAZXhhbXBsZVxuICogdmFyIGZyb21Qcm9wcyA9IHJlcXVpcmUoJ211c2ljLW5vdGF0aW9uL2FycmF5L2Zyb20tcHJvcHMnKVxuICogZnJvbVByb3BzKFswLCAxLCA0LCAwXSlcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoc3RlcCwgYWx0LCBvY3QsIGR1cikge1xuICB2YXIgYmFzZSA9IEJBU0VTW3N0ZXBdXG4gIGFsdCA9IGFsdCB8fCAwXG4gIHZhciBmID0gYmFzZVswXSArIDcgKiBhbHRcbiAgaWYgKHR5cGVvZiBvY3QgPT09ICd1bmRlZmluZWQnKSByZXR1cm4gW2ZdXG4gIHZhciBvID0gb2N0ICsgYmFzZVsxXSAtIDQgKiBhbHRcbiAgaWYgKHR5cGVvZiBkdXIgPT09ICd1bmRlZmluZWQnKSByZXR1cm4gW2YsIG9dXG4gIGVsc2UgcmV0dXJuIFtmLCBvLCBkdXJdXG59XG4iLCIndXNlIHN0cmljdCdcblxuLy8gTWFwIGZyb20gbnVtYmVyIG9mIGZpZnRocyB0byBpbnRlcnZhbCBudW1iZXIgKDAtaW5kZXgpIGFuZCBvY3RhdmVcbi8vIC0xID0gZm91cnRoLCAwID0gdW5pc29uLCAxID0gZmlmdGgsIDIgPSBzZWNvbmQsIDMgPSBzaXh0aC4uLlxudmFyIEJBU0VTID0gW1szLCAxXSwgWzAsIDBdLCBbNCwgMF0sIFsxLCAtMV0sIFs1LCAtMV0sIFsyLCAtMl0sIFs2LCAtMl0sIFszLCAtM11dXG5cbi8qKlxuICogR2V0IHByb3BlcnRpZXMgZnJvbSBhIHBpdGNoIGluIGFycmF5IGZvcm1hdFxuICpcbiAqIFRoZSBwcm9wZXJ0aWVzIGlzIGFuIGFycmF5IHdpdGggdGhlIGZvcm0gW251bWJlciwgYWx0ZXJhdGlvbiwgb2N0YXZlLCBkdXJhdGlvbl1cbiAqXG4gKiBAbmFtZSBhcnJheS50b1Byb3BzXG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IC0gdGhlIHBpdGNoIGluIGNvb3JkIGZvcm1hdFxuICogQHJldHVybiB7QXJyYXl9IHRoZSBwaXRjaCBpbiBwcm9wZXJ0eSBmb3JtYXRcbiAqXG4gKiBAZXhhbXBsZVxuICogdmFyIHRvUHJvcHMgPSByZXF1aXJlKCdtdXNpYy1ub3RhdGlvbi9hcnJheS90by1wcm9wcycpXG4gKiB0b1Byb3BzKFsyLCAxLCA0XSkgLy8gPT4gWzEsIDIsIDRdXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGFycikge1xuICBpZiAoIUFycmF5LmlzQXJyYXkoYXJyKSkgcmV0dXJuIG51bGxcbiAgdmFyIGluZGV4ID0gKGFyclswXSArIDEpICUgN1xuICBpZiAoaW5kZXggPCAwKSBpbmRleCA9IDcgKyBpbmRleFxuICB2YXIgYmFzZSA9IEJBU0VTW2luZGV4XVxuICB2YXIgYWx0ZXIgPSBNYXRoLmZsb29yKChhcnJbMF0gKyAxKSAvIDcpXG4gIHZhciBvY3QgPSBhcnIubGVuZ3RoID09PSAxID8gbnVsbCA6IGFyclsxXSAtIGJhc2VbMV0gKyBhbHRlciAqIDRcbiAgdmFyIGR1ciA9IGFyclsyXSB8fCBudWxsXG4gIHJldHVybiBbYmFzZVswXSwgYWx0ZXIsIG9jdCwgZHVyXVxufVxuIiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBtZW1vaXplID0gcmVxdWlyZSgnLi4vbWVtb2l6ZScpXG52YXIgZnJvbVByb3BzID0gcmVxdWlyZSgnLi4vYXJyYXkvZnJvbS1wcm9wcycpXG52YXIgSU5URVJWQUwgPSByZXF1aXJlKCcuL3JlZ2V4JylcbnZhciBUWVBFUyA9ICdQTU1QUE1NJ1xudmFyIFFBTFQgPSB7XG4gIFA6IHsgZGRkZDogLTQsIGRkZDogLTMsIGRkOiAtMiwgZDogLTEsIFA6IDAsIEE6IDEsIEFBOiAyLCBBQUE6IDMsIEFBQUE6IDQgfSxcbiAgTTogeyBkZGQ6IC00LCBkZDogLTMsIGQ6IC0yLCBtOiAtMSwgTTogMCwgQTogMSwgQUE6IDIsIEFBQTogMywgQUFBQTogNCB9XG59XG5cbi8qKlxuICogUGFyc2UgYSBbaW50ZXJ2YWwgc2hvcnRoYW5kIG5vdGF0aW9uXShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9JbnRlcnZhbF8obXVzaWMpI1Nob3J0aGFuZF9ub3RhdGlvbilcbiAqIHRvIFtpbnRlcnZhbCBjb29yZCBub3RhdGlvbl0oaHR0cHM6Ly9naXRodWIuY29tL2RhbmlnYi9tdXNpYy5hcnJheS5ub3RhdGlvbilcbiAqXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIGNhY2hlZCBmb3IgYmV0dGVyIHBlcmZvcm1hbmNlLlxuICpcbiAqIEBuYW1lIGludGVydmFsLnBhcnNlXG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSB7U3RyaW5nfSBpbnRlcnZhbCAtIHRoZSBpbnRlcnZhbCBzdHJpbmdcbiAqIEByZXR1cm4ge0FycmF5fSB0aGUgaW50ZXJ2YWwgaW4gYXJyYXkgbm90YXRpb24gb3IgbnVsbCBpZiBub3QgYSB2YWxpZCBpbnRlcnZhbFxuICpcbiAqIEBleGFtcGxlXG4gKiB2YXIgcGFyc2UgPSByZXF1aXJlKCdtdXNpYy1ub3RhdGlvbi9pbnRlcnZhbC9wYXJzZScpXG4gKiBwYXJzZSgnM20nKSAvLyA9PiBbMiwgLTEsIDBdXG4gKiBwYXJzZSgnOWInKSAvLyA9PiBbMSwgLTEsIDFdXG4gKiBwYXJzZSgnLTJNJykgLy8gPT4gWzYsIC0xLCAtMV1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBtZW1vaXplKGZ1bmN0aW9uIChzdHIpIHtcbiAgdmFyIG0gPSBJTlRFUlZBTC5leGVjKHN0cilcbiAgaWYgKCFtKSByZXR1cm4gbnVsbFxuICB2YXIgZGlyID0gKG1bMl0gfHwgbVs3XSkgPT09ICctJyA/IC0xIDogMVxuICB2YXIgbnVtID0gKyhtWzNdIHx8IG1bOF0pIC0gMVxuICB2YXIgcSA9IG1bNF0gfHwgbVs2XSB8fCAnJ1xuXG4gIHZhciBzaW1wbGUgPSBudW0gJSA3XG5cbiAgdmFyIGFsdFxuICBpZiAocSA9PT0gJycpIGFsdCA9IDBcbiAgZWxzZSBpZiAocVswXSA9PT0gJyMnKSBhbHQgPSBxLmxlbmd0aFxuICBlbHNlIGlmIChxWzBdID09PSAnYicpIGFsdCA9IC1xLmxlbmd0aFxuICBlbHNlIHtcbiAgICBhbHQgPSBRQUxUW1RZUEVTW3NpbXBsZV1dW3FdXG4gICAgaWYgKHR5cGVvZiBhbHQgPT09ICd1bmRlZmluZWQnKSByZXR1cm4gbnVsbFxuICB9XG4gIHZhciBvY3QgPSBNYXRoLmZsb29yKG51bSAvIDcpXG4gIHZhciBhcnIgPSBmcm9tUHJvcHMoc2ltcGxlLCBhbHQsIG9jdClcbiAgcmV0dXJuIGRpciA9PT0gMSA/IGFyciA6IFstYXJyWzBdLCAtYXJyWzFdXVxufSlcbiIsIlxuLy8gc2hvcnRoYW5kIHRvbmFsIG5vdGF0aW9uICh3aXRoIHF1YWxpdHkgYWZ0ZXIgbnVtYmVyKVxudmFyIFRPTkFMID0gJyhbLStdPykoXFxcXGQrKShkezEsNH18bXxNfFB8QXsxLDR9fGJ7MSw0fXwjezEsNH18KSdcbi8vIHN0cmljdCBzaG9ydGhhbmQgbm90YXRpb24gKHdpdGggcXVhbGl0eSBiZWZvcmUgbnVtYmVyKVxudmFyIFNUUklDVCA9ICcoQUF8QXxQfE18bXxkfGRkKShbLStdPykoXFxcXGQrKSdcbnZhciBDT01QT1NFID0gJyg/OignICsgVE9OQUwgKyAnKXwoJyArIFNUUklDVCArICcpKSdcblxuLyoqXG4gKiBBIHJlZ2V4IGZvciBwYXJzZSBpbnRlcnZhbHMgaW4gc2hvcnRoYW5kIG5vdGF0aW9uXG4gKlxuICogVGhyZWUgZGlmZmVyZW50IHNob3J0aGFuZCBub3RhdGlvbnMgYXJlIHN1cHBvcnRlZDpcbiAqXG4gKiAtIGRlZmF1bHQgW2RpcmVjdGlvbl1bbnVtYmVyXVtxdWFsaXR5XTogdGhlIHByZWZlcnJlZCBzdHlsZSBgM01gLCBgLTVBYFxuICogLSBzdHJpY3Q6IFtxdWFsaXR5XVtkaXJlY3Rpb25dW251bWJlcl0sIGZvciBleGFtcGxlOiBgTTNgLCBgQS01YFxuICogLSBhbHRlcmVkOiBbZGlyZWN0aW9uXVtudW1iZXJdW2FsdGVyYXRpb25zXTogYDNgLCBgLTUjYFxuICpcbiAqIEBuYW1lIGludGVydmFsLnJlZ2V4XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gbmV3IFJlZ0V4cCgnXicgKyBDT01QT1NFICsgJyQnKVxuIiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBwcm9wcyA9IHJlcXVpcmUoJy4uL2FycmF5L3RvLXByb3BzJylcbnZhciBjYWNoZSA9IHt9XG5cbi8qKlxuICogR2V0IGEgc3RyaW5nIHdpdGggYSBbc2hvcnRoYW5kIGludGVydmFsIG5vdGF0aW9uXShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9JbnRlcnZhbF8obXVzaWMpI1Nob3J0aGFuZF9ub3RhdGlvbilcbiAqIGZyb20gaW50ZXJ2YWwgaW4gW2FycmF5IG5vdGF0aW9uXShodHRwczovL2dpdGh1Yi5jb20vZGFuaWdiL211c2ljLmFycmF5Lm5vdGF0aW9uKVxuICpcbiAqIFRoZSByZXR1cm5lZCBzdHJpbmcgaGFzIHRoZSBmb3JtOiBgbnVtYmVyICsgcXVhbGl0eWAgd2hlcmUgbnVtYmVyIGlzIHRoZSBpbnRlcnZhbCBudW1iZXJcbiAqIChwb3NpdGl2ZSBpbnRlZ2VyIGZvciBhc2NlbmRpbmcgaW50ZXJ2YWxzLCBuZWdhdGl2ZSBpbnRlZ2VyIGZvciBkZXNjZW5kaW5nIGludGVydmFscywgbmV2ZXIgMClcbiAqIGFuZCB0aGUgcXVhbGl0eSBpcyBvbmUgb2Y6ICdNJywgJ20nLCAnUCcsICdkJywgJ0EnIChtYWpvciwgbWlub3IsIHBlcmZlY3QsIGRpbWlzaGVkLCBhdWdtZW50ZWQpXG4gKlxuICogQG5hbWUgaW50ZXJ2YWwuc3RyXG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSB7QXJyYXl9IGludGVydmFsIC0gdGhlIGludGVydmFsIGluIGFycmF5IG5vdGF0aW9uXG4gKiBAcmV0dXJuIHtTdHJpbmd9IHRoZSBpbnRlcnZhbCBzdHJpbmcgaW4gc2hvcnRoYW5kIG5vdGF0aW9uIG9yIG51bGwgaWYgbm90IHZhbGlkIGludGVydmFsXG4gKlxuICogQGV4YW1wbGVcbiAqIHZhciBzdHIgPSByZXF1aXJlKCdtdXNpYy1ub3RhdGlvbi9pbnRlcnZhbC9zdHInKVxuICogc3RyKFsxLCAwLCAwXSkgLy8gPT4gJzJNJ1xuICogc3RyKFsxLCAwLCAxXSkgLy8gPT4gJzlNJ1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChhcnIpIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KGFycikgfHwgYXJyLmxlbmd0aCAhPT0gMikgcmV0dXJuIG51bGxcbiAgdmFyIHN0ciA9ICd8JyArIGFyclswXSArICd8JyArIGFyclsxXVxuICByZXR1cm4gc3RyIGluIGNhY2hlID8gY2FjaGVbc3RyXSA6IGNhY2hlW3N0cl0gPSBidWlsZChhcnIpXG59XG5cbnZhciBBTFRFUiA9IHtcbiAgUDogWydkZGRkJywgJ2RkZCcsICdkZCcsICdkJywgJ1AnLCAnQScsICdBQScsICdBQUEnLCAnQUFBQSddLFxuICBNOiBbJ2RkZCcsICdkZCcsICdkJywgJ20nLCAnTScsICdBJywgJ0FBJywgJ0FBQScsICdBQUFBJ11cbn1cbnZhciBUWVBFUyA9ICdQTU1QUE1NJ1xuXG5mdW5jdGlvbiBidWlsZCAoY29vcmQpIHtcbiAgdmFyIHAgPSBwcm9wcyhjb29yZClcbiAgdmFyIHQgPSBUWVBFU1twWzBdXVxuXG4gIHZhciBkaXIsIG51bSwgYWx0XG4gIC8vIGlmIGl0cyBkZXNjZW5pbmcsIGludmVydCBudW1iZXJcbiAgaWYgKHBbMl0gPCAwKSB7XG4gICAgZGlyID0gLTFcbiAgICBudW0gPSAoOCAtIHBbMF0pIC0gNyAqIChwWzJdICsgMSlcbiAgICBhbHQgPSB0ID09PSAnUCcgPyAtcFsxXSA6IC0ocFsxXSArIDEpXG4gIH0gZWxzZSB7XG4gICAgZGlyID0gMVxuICAgIG51bSA9IHBbMF0gKyAxICsgNyAqIHBbMl1cbiAgICBhbHQgPSBwWzFdXG4gIH1cbiAgdmFyIHEgPSBBTFRFUlt0XVs0ICsgYWx0XVxuICByZXR1cm4gZGlyICogbnVtICsgcVxufVxuIiwiJ3VzZSBzdHJpY3QnXG5cbi8qKlxuICogQSBzaW1wbGUgYW5kIGZhc3QgbWVtb2l6YXRpb24gZnVuY3Rpb25cbiAqXG4gKiBJdCBoZWxwcyBjcmVhdGluZyBmdW5jdGlvbnMgdGhhdCBjb252ZXJ0IGZyb20gc3RyaW5nIHRvIHBpdGNoIGluIGFycmF5IGZvcm1hdC5cbiAqIEJhc2ljYWxseSBpdCBkb2VzIHR3byB0aGluZ3M6XG4gKiAtIGVuc3VyZSB0aGUgZnVuY3Rpb24gb25seSByZWNlaXZlcyBzdHJpbmdzXG4gKiAtIG1lbW9pemUgdGhlIHJlc3VsdFxuICpcbiAqIEBuYW1lIG1lbW9pemVcbiAqIEBmdW5jdGlvblxuICogQHByaXZhdGVcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZm4pIHtcbiAgdmFyIGNhY2hlID0ge31cbiAgcmV0dXJuIGZ1bmN0aW9uIChzdHIpIHtcbiAgICBpZiAodHlwZW9mIHN0ciAhPT0gJ3N0cmluZycpIHJldHVybiBudWxsXG4gICAgcmV0dXJuIChzdHIgaW4gY2FjaGUpID8gY2FjaGVbc3RyXSA6IGNhY2hlW3N0cl0gPSBmbihzdHIpXG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG52YXIgbWVtb2l6ZSA9IHJlcXVpcmUoJy4uL21lbW9pemUnKVxudmFyIFIgPSByZXF1aXJlKCcuL3JlZ2V4JylcbnZhciBCQVNFUyA9IHsgQzogWzAsIDBdLCBEOiBbMiwgLTFdLCBFOiBbNCwgLTJdLCBGOiBbLTEsIDFdLCBHOiBbMSwgMF0sIEE6IFszLCAtMV0sIEI6IFs1LCAtMl0gfVxuXG4vKipcbiAqIEdldCBhIHBpdGNoIGluIFthcnJheSBub3RhdGlvbl0oKVxuICogZnJvbSBhIHN0cmluZyBpbiBbc2NpZW50aWZpYyBwaXRjaCBub3RhdGlvbl0oaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvU2NpZW50aWZpY19waXRjaF9ub3RhdGlvbilcbiAqXG4gKiBUaGUgc3RyaW5nIHRvIHBhcnNlIG11c3QgYmUgaW4gdGhlIGZvcm0gb2Y6IGBsZXR0ZXJbYWNjaWRlbnRhbHNdW29jdGF2ZV1gXG4gKiBUaGUgYWNjaWRlbnRhbHMgY2FuIGJlIHVwIHRvIGZvdXIgIyAoc2hhcnApIG9yIGIgKGZsYXQpIG9yIHR3byB4IChkb3VibGUgc2hhcnBzKVxuICpcbiAqIFRoaXMgZnVuY3Rpb24gaXMgY2FjaGVkIGZvciBiZXR0ZXIgcGVyZm9ybWFuY2UuXG4gKlxuICogQG5hbWUgbm90ZS5wYXJzZVxuICogQGZ1bmN0aW9uXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIC0gdGhlIHN0cmluZyB0byBwYXJzZVxuICogQHJldHVybiB7QXJyYXl9IHRoZSBub3RlIGluIGFycmF5IG5vdGF0aW9uIG9yIG51bGwgaWYgbm90IHZhbGlkIG5vdGVcbiAqXG4gKiBAZXhhbXBsZVxuICogdmFyIHBhcnNlID0gcmVxdWlyZSgnbXVzaWMtbm90YXRpb24vbm90ZS9wYXJzZScpXG4gKiBwYXJzZSgnQycpIC8vID0+IFsgMCBdXG4gKiBwYXJzZSgnYyMnKSAvLyA9PiBbIDggXVxuICogcGFyc2UoJ2MjIycpIC8vID0+IFsgMTYgXVxuICogcGFyc2UoJ0N4JykgLy8gPT4gWyAxNiBdIChkb3VibGUgc2hhcnApXG4gKiBwYXJzZSgnQ2InKSAvLyA9PiBbIC02IF1cbiAqIHBhcnNlKCdkYicpIC8vID0+IFsgLTQgXVxuICogcGFyc2UoJ0c0JykgLy8gPT4gWyAyLCAzLCBudWxsIF1cbiAqIHBhcnNlKCdjIzMnKSAvLyA9PiBbIDgsIC0xLCBudWxsIF1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBtZW1vaXplKGZ1bmN0aW9uIChzdHIpIHtcbiAgdmFyIG0gPSBSLmV4ZWMoc3RyKVxuICBpZiAoIW0gfHwgbVs1XSkgcmV0dXJuIG51bGxcblxuICB2YXIgYmFzZSA9IEJBU0VTW21bMV0udG9VcHBlckNhc2UoKV1cbiAgdmFyIGFsdCA9IG1bMl0ucmVwbGFjZSgveC9nLCAnIyMnKS5sZW5ndGhcbiAgaWYgKG1bMl1bMF0gPT09ICdiJykgYWx0ICo9IC0xXG4gIHZhciBmaWZ0aHMgPSBiYXNlWzBdICsgNyAqIGFsdFxuICBpZiAoIW1bM10pIHJldHVybiBbZmlmdGhzXVxuICB2YXIgb2N0ID0gK21bM10gKyBiYXNlWzFdIC0gNCAqIGFsdFxuICB2YXIgZHVyID0gbVs0XSA/ICsobVs0XS5zdWJzdHJpbmcoMSkpIDogbnVsbFxuICByZXR1cm4gW2ZpZnRocywgb2N0LCBkdXJdXG59KVxuIiwiJ3VzZSBzdHJpY3QnXG5cbi8qKlxuICogQSByZWdleCBmb3IgbWF0Y2hpbmcgbm90ZSBzdHJpbmdzIGluIHNjaWVudGlmaWMgbm90YXRpb24uXG4gKlxuICogVGhlIG5vdGUgc3RyaW5nIHNob3VsZCBoYXZlIHRoZSBmb3JtIGBsZXR0ZXJbYWNjaWRlbnRhbHNdW29jdGF2ZV1bL2R1cmF0aW9uXWBcbiAqIHdoZXJlOlxuICpcbiAqIC0gbGV0dGVyOiAoUmVxdWlyZWQpIGlzIGEgbGV0dGVyIGZyb20gQSB0byBHIGVpdGhlciB1cHBlciBvciBsb3dlciBjYXNlXG4gKiAtIGFjY2lkZW50YWxzOiAoT3B0aW9uYWwpIGNhbiBiZSBvbmUgb3IgbW9yZSBgYmAgKGZsYXRzKSwgYCNgIChzaGFycHMpIG9yIGB4YCAoZG91YmxlIHNoYXJwcykuXG4gKiBUaGV5IGNhbiBOT1QgYmUgbWl4ZWQuXG4gKiAtIG9jdGF2ZTogKE9wdGlvbmFsKSBhIHBvc2l0aXZlIG9yIG5lZ2F0aXZlIGludGVnZXJcbiAqIC0gZHVyYXRpb246IChPcHRpb25hbCkgYW55dGhpbmcgZm9sbG93cyBhIHNsYXNoIGAvYCBpcyBjb25zaWRlcmVkIHRvIGJlIHRoZSBkdXJhdGlvblxuICogLSBlbGVtZW50OiAoT3B0aW9uYWwpIGFkZGl0aW9uYWxseSBhbnl0aGluZyBhZnRlciB0aGUgZHVyYXRpb24gaXMgY29uc2lkZXJlZCB0b1xuICogYmUgdGhlIGVsZW1lbnQgbmFtZSAoZm9yIGV4YW1wbGU6ICdDMiBkb3JpYW4nKVxuICpcbiAqIEBuYW1lIG5vdGUucmVnZXhcbiAqIEBleGFtcGxlXG4gKiB2YXIgUiA9IHJlcXVpcmUoJ211c2ljLW5vdGF0aW9uL25vdGUvcmVnZXgnKVxuICogUi5leGVjKCdjIzQnKSAvLyA9PiBbJ2MjNCcsICdjJywgJyMnLCAnNCcsICcnLCAnJ11cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSAvXihbYS1nQS1HXSkoI3sxLH18YnsxLH18eHsxLH18KSgtP1xcZCopKFxcL1xcZCt8KVxccyooLiopXFxzKiQvXG4iLCIndXNlIHN0cmljdCdcblxudmFyIHByb3BzID0gcmVxdWlyZSgnLi4vYXJyYXkvdG8tcHJvcHMnKVxudmFyIGFjYyA9IHJlcXVpcmUoJy4uL2FjY2lkZW50YWxzL3N0cicpXG52YXIgY2FjaGUgPSB7fVxuXG4vKipcbiAqIEdldCBbc2NpZW50aWZpYyBwaXRjaCBub3RhdGlvbl0oaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvU2NpZW50aWZpY19waXRjaF9ub3RhdGlvbikgc3RyaW5nXG4gKiBmcm9tIHBpdGNoIGluIFthcnJheSBub3RhdGlvbl0oKVxuICpcbiAqIEFycmF5IGxlbmd0aCBtdXN0IGJlIDEgb3IgMyAoc2VlIGFycmF5IG5vdGF0aW9uIGRvY3VtZW50YXRpb24pXG4gKlxuICogVGhlIHJldHVybmVkIHN0cmluZyBmb3JtYXQgaXMgYGxldHRlclsrIGFjY2lkZW50YWxzXVsrIG9jdGF2ZV1bL2R1cmF0aW9uXWAgd2hlcmUgdGhlIGxldHRlclxuICogaXMgYWx3YXlzIHVwcGVyY2FzZSwgYW5kIHRoZSBhY2NpZGVudGFscywgb2N0YXZlIGFuZCBkdXJhdGlvbiBhcmUgb3B0aW9uYWwuXG4gKlxuICogVGhpcyBmdW5jdGlvbiBpcyBtZW1vaXplZCBmb3IgYmV0dGVyIHBlcmZvbWFuY2UuXG4gKlxuICogQG5hbWUgbm90ZS5zdHJcbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIHtBcnJheX0gYXJyIC0gdGhlIG5vdGUgaW4gYXJyYXkgbm90YXRpb25cbiAqIEByZXR1cm4ge1N0cmluZ30gdGhlIG5vdGUgaW4gc2NpZW50aWZpYyBub3RhdGlvbiBvciBudWxsIGlmIG5vdCB2YWxpZCBub3RlIGFycmF5XG4gKlxuICogQGV4YW1wbGVcbiAqIHZhciBzdHIgPSByZXF1aXJlKCdtdXNpYy1ub3RhdGlvbi9ub3RlL3N0cicpXG4gKiBzdHIoWzBdKSAvLyA9PiAnRidcbiAqIHN0cihbMCwgNF0pIC8vID0+IG51bGwgKGl0cyBhbiBpbnRlcnZhbClcbiAqIHN0cihbMCwgNCwgbnVsbF0pIC8vID0+ICdGNCdcbiAqIHN0cihbMCwgNCwgMl0pIC8vID0+ICdGNC8yJ1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChhcnIpIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KGFycikgfHwgYXJyLmxlbmd0aCA8IDEgfHwgYXJyLmxlbmd0aCA9PT0gMikgcmV0dXJuIG51bGxcbiAgdmFyIHN0ciA9ICd8JyArIGFyclswXSArICd8JyArIGFyclsxXSArICd8JyArIGFyclsyXVxuICByZXR1cm4gc3RyIGluIGNhY2hlID8gY2FjaGVbc3RyXSA6IGNhY2hlW3N0cl0gPSBidWlsZChhcnIpXG59XG5cbnZhciBMRVRURVIgPSBbJ0MnLCAnRCcsICdFJywgJ0YnLCAnRycsICdBJywgJ0InXVxuZnVuY3Rpb24gYnVpbGQgKGNvb3JkKSB7XG4gIHZhciBwID0gcHJvcHMoY29vcmQpXG4gIHJldHVybiBMRVRURVJbcFswXV0gKyBhY2MocFsxXSkgKyAocFsyXSAhPT0gbnVsbCA/IHBbMl0gOiAnJykgKyAocFszXSAhPT0gbnVsbCA/ICcvJyArIHBbM10gOiAnJylcbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG5mdW5jdGlvbiBjdXJyeSAoZm4sIGFyaXR5KSB7XG4gIGlmIChhcml0eSA9PT0gMSkgcmV0dXJuIGZuXG4gIHJldHVybiBmdW5jdGlvbiAoYSwgYikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSByZXR1cm4gZnVuY3Rpb24gKGMpIHsgcmV0dXJuIGZuKGEsIGMpIH1cbiAgICByZXR1cm4gZm4oYSwgYilcbiAgfVxufVxuXG4vKipcbiAqIERlY29yYXRlIGEgZnVuY3Rpb24gdG8gd29yayB3aXRoIGludGVydmFscywgbm90ZXMgb3IgcGl0Y2hlcyBpblxuICogW2FycmF5IG5vdGF0aW9uXShodHRwczovL2dpdGh1Yi5jb20vZGFuaWdiL3RvbmFsL3RyZWUvbmV4dC9wYWNrYWdlcy9tdXNpYy1ub3RhdGlvbilcbiAqIHdpdGggaW5kZXBlbmRlbmNlIG9mIHN0cmluZyByZXByZXNlbnRhdGlvbnMuXG4gKlxuICogVGhpcyBpcyB0aGUgYmFzZSBvZiB0aGUgcGx1Z2dhYmxlIG5vdGF0aW9uIHN5c3RlbSBvZlxuICogW3RvbmFsXShodHRwczovL2dpdGh1Yi5jb20vZGFuaWdiL3RvbmFsKVxuICpcbiAqIEBuYW1lIG9wZXJhdGlvblxuICogQGZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBwYXJzZSAtIHRoZSBwYXJzZXJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHN0ciAtIHRoZSBzdHJpbmcgYnVpbGRlclxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gLSB0aGUgb3BlcmF0aW9uIHRvIGRlY29yYXRlXG4gKlxuICogQGV4YW1wbGVcbiAqIHZhciBwYXJzZSA9IHJlcXVpcmUoJ211c2ljLW5vdGF0aW9uL2ludGVydmFsL3BhcnNlJylcbiAqIHZhciBzdHIgPSByZXF1aXJlKCdtdXNpYy1ub3RhdGlvbi9pbnRlcnZhbC9zdHInKVxuICogdmFyIG9wZXJhdGlvbiA9IHJlcXVpcmUoJ211c2ljLW5vdGF0aW9uL29wZXJhdGlvbicpKHBhcnNlLCBzdHIpXG4gKiB2YXIgYWRkID0gb3BlcmF0aW9uKGZ1bmN0aW9uKGEsIGIpIHsgcmV0dXJuIFthWzBdICsgYlswXSwgYVsxXSArIGJbMV1dIH0pXG4gKiBhZGQoJzNtJywgJzNNJykgLy8gPT4gJzVQJ1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG9wIChwYXJzZSwgc3RyLCBmbikge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiBvcChwYXJzZSwgc3RyLCBmKSB9XG4gIHJldHVybiBjdXJyeShmdW5jdGlvbiAoYSwgYikge1xuICAgIHZhciBhYyA9IHBhcnNlKGEpXG4gICAgdmFyIGJjID0gcGFyc2UoYilcbiAgICBpZiAoIWFjICYmICFiYykgcmV0dXJuIGZuKGEsIGIpXG4gICAgdmFyIHYgPSBmbihhYyB8fCBhLCBiYyB8fCBiKVxuICAgIHJldHVybiBzdHIodikgfHwgdlxuICB9LCBmbi5sZW5ndGgpXG59XG4iLCJ2YXIgbm90ZSA9IHJlcXVpcmUoJy4uL25vdGUvcGFyc2UnKVxudmFyIGludGVydmFsID0gcmVxdWlyZSgnLi4vaW50ZXJ2YWwvcGFyc2UnKVxuXG4vKipcbiAqIENvbnZlcnQgYSBub3RlIG9yIGludGVydmFsIHN0cmluZyB0byBhIFtwaXRjaCBpbiBjb29yZCBub3RhdGlvbl0oKVxuICpcbiAqIEBuYW1lIHBpdGNoLnBhcnNlXG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSB7U3RyaW5nfSBwaXRjaCAtIHRoZSBub3RlIG9yIGludGVydmFsIHRvIHBhcnNlXG4gKiBAcmV0dXJuIHtBcnJheX0gdGhlIHBpdGNoIGluIGFycmF5IG5vdGF0aW9uXG4gKlxuICogQGV4YW1wbGVcbiAqIHZhciBwYXJzZSA9IHJlcXVpcmUoJ211c2ljLW5vdGF0aW9uL3BpdGNoL3BhcnNlJylcbiAqIHBhcnNlKCdDMicpIC8vID0+IFswLCAyLCBudWxsXVxuICogcGFyc2UoJzVQJykgLy8gPT4gWzEsIDBdXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG4pIHsgcmV0dXJuIG5vdGUobikgfHwgaW50ZXJ2YWwobikgfVxuIiwidmFyIG5vdGUgPSByZXF1aXJlKCcuLi9ub3RlL3N0cicpXG52YXIgaW50ZXJ2YWwgPSByZXF1aXJlKCcuLi9pbnRlcnZhbC9zdHInKVxuXG4vKipcbiAqIENvbnZlcnQgYSBwaXRjaCBpbiBjb29yZGluYXRlIG5vdGF0aW9uIHRvIHN0cmluZy4gSXQgZGVhbHMgd2l0aCBub3RlcywgcGl0Y2hcbiAqIGNsYXNzZXMgYW5kIGludGVydmFscy5cbiAqXG4gKiBAbmFtZSBwaXRjaC5zdHJcbiAqIEBmdW5pc3Ryb25cbiAqIEBwYXJhbSB7QXJyYXl9IHBpdGNoIC0gdGhlIHBpdGNoIGluIGFycmF5IG5vdGF0aW9uXG4gKiBAcmV0dXJuIHtTdHJpbmd9IHRoZSBwaXRjaCBzdHJpbmdcbiAqXG4gKiBAZXhhbXBsZVxuICogdmFyIHN0ciA9IHJlcXVpcmUoJ211c2ljLW5vdGF0aW9uL3BpdGNoLnN0cicpXG4gKiAvLyBwaXRjaCBjbGFzc1xuICogc3RyKFswXSkgLy8gPT4gJ0MnXG4gKiAvLyBpbnRlcnZhbFxuICogc3RyKFswLCAwXSkgLy8gPT4gJzFQJ1xuICogLy8gbm90ZVxuICogc3RyKFswLCAyLCA0XSkgLy8gPT4gJ0MyLzQnXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG4pIHsgcmV0dXJuIG5vdGUobikgfHwgaW50ZXJ2YWwobikgfVxuIiwidmFyIHBhcnNlID0gcmVxdWlyZSgnbXVzaWMtbm90YXRpb24vcGl0Y2gvcGFyc2UnKVxudmFyIHN0ciA9IHJlcXVpcmUoJ211c2ljLW5vdGF0aW9uL3BpdGNoL3N0cicpXG52YXIgbm90YXRpb24gPSByZXF1aXJlKCdtdXNpYy1ub3RhdGlvbi9vcGVyYXRpb24nKShwYXJzZSwgc3RyKVxuXG4vKipcbiAqIEdldCB0aGUgaW50ZXJ2YWwgYmV0d2VlbiB0d28gcGl0Y2hlc1xuICpcbiAqIElmIG9uZSBvciBib3RoIGFyZSBwaXRjaCBjbGFzc2VzLCBhIHNpbXBsZSBhc2NlbmRpbmcgaW50ZXJ2YWwgaXMgcmV0dXJuZWRcbiAqXG4gKiBUaGlzIGZ1bmN0aW9uIGNhbiBiZSBwYXJ0aWFsbHkgYXBwbGllZCAoc2VlIGV4YW1wbGVzKVxuICpcbiAqIEBuYW1lIG5vdGUuaW50ZXJ2YWxcbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIHtTdHJpbmd9IGZyb20gLSB0aGUgZmlyc3Qgbm90ZVxuICogQHBhcmFtIHtTdHJpbmd9IHRvIC0gdGhlIHNlY29uZCBub3RlXG4gKiBAcmV0dXJuIHtTdHJpbmd9IHRoZSBpbnRlcnZhbCBiZXR3ZWVuIHRoZW1cbiAqXG4gKiBAZXhhbXBsZVxuICogdmFyIGludGVydmFsID0gcmVxdWlyZSgnbm90ZS1pbnRlcnZhbCcpXG4gKiBpbnRlcnZhbCgnQzInLCAnRDMnKSAvLyA9PiAnOU0nXG4gKiBpbnRlcnZhbCgnRDInLCAnQzInKSAvLyA9PiAnLTJNJ1xuICogaW50ZXJ2YWwoJ0QnLCAnQycpIC8vID0+ICc3bSdcbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gcGFydGlhbGx5IGFwcGxpZWRcbiAqIHZhciBmcm9tQyA9IGludGVydmFsKCdDJylcbiAqIGZyb21DKCdEJykgLy8gPT4gJzJNJ1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IG5vdGF0aW9uKGZ1bmN0aW9uIChhLCBiKSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShhKSB8fCAhQXJyYXkuaXNBcnJheShiKSkgcmV0dXJuIG51bGxcbiAgaWYgKGEubGVuZ3RoID09PSAxIHx8IGIubGVuZ3RoID09PSAxKSB7XG4gICAgdmFyIGJhc2UgPSBiWzBdIC0gYVswXVxuICAgIHJldHVybiBbYmFzZSwgLU1hdGguZmxvb3IoYmFzZSAqIDcgLyAxMildXG4gIH1cbiAgcmV0dXJuIFtiWzBdIC0gYVswXSwgYlsxXSAtIGFbMV1dXG59KVxuIiwidmFyIHBhcnNlID0gcmVxdWlyZSgnbXVzaWMtbm90YXRpb24vcGl0Y2gvcGFyc2UnKVxudmFyIHN0ciA9IHJlcXVpcmUoJ211c2ljLW5vdGF0aW9uL3BpdGNoL3N0cicpXG52YXIgb3BlcmF0aW9uID0gcmVxdWlyZSgnbXVzaWMtbm90YXRpb24vb3BlcmF0aW9uJykocGFyc2UsIHN0cilcblxuLyoqXG4gKiBUcmFuc3Bvc2VzIGEgbm90ZSBieSBhbiBpbnRlcnZhbC5cbiAqXG4gKiBHaXZlbiBhIG5vdGUgYW5kIGFuIGludGVydmFsIGl0IHJldHVybnMgdGhlIHRyYW5zcG9zZWQgbm90ZS4gSXQgY2FuIGJlIHVzZWRcbiAqIHRvIGFkZCBpbnRlcnZhbHMgaWYgYm90aCBwYXJhbWV0ZXJzIGFyZSBpbnRlcnZhbHMuXG4gKlxuICogVGhlIG9yZGVyIG9mIHRoZSBwYXJhbWV0ZXJzIGlzIGluZGlmZmVyZW50LlxuICpcbiAqIFRoaXMgZnVuY3Rpb24gaXMgY3VycmlmaWVkIHNvIGl0IGNhbiBiZSB1c2VkIHRvIG1hcCBhcnJheXMgb2Ygbm90ZXMuXG4gKlxuICogQG5hbWUgdHJhbnNwb3NlXG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSB7U3RyaW5nfEFycmF5fSBpbnRlcnZhbCAtIHRoZSBpbnRlcnZhbC4gSWYgaXRzIGZhbHNlLCB0aGUgbm90ZSBpcyBub3RcbiAqIHRyYW5zcG9zZWQuXG4gKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0gbm90ZSAtIHRoZSBub3RlIHRvIHRyYW5zcG9zZVxuICogQHJldHVybiB7U3RyaW5nfEFycmF5fSB0aGUgbm90ZSB0cmFuc3Bvc2VkXG4gKlxuICogQGV4YW1wbGVcbiAqIHZhciB0cmFuc3Bvc2UgPSByZXF1aXJlKCdub3RlLXRyYW5zcG9zZXInKVxuICogdHJhbnNwb3NlKCczbScsICdDNCcpIC8vID0+ICdFYjQnXG4gKiB0cmFuc3Bvc2UoJ0M0JywgJzNtJykgLy8gPT4gJ0ViNCdcbiAqIHRyYW5wb3NlKFsxLCAwLCAyXSwgWzMsIC0xLCAwXSkgLy8gPT4gWzMsIDAsIDJdXG4gKiBbJ0MnLCAnRCcsICdFJ10ubWFwKHRyYW5zcG9zZSgnM00nKSkgLy8gPT4gWydFJywgJ0YjJywgJ0cjJ11cbiAqL1xudmFyIHRyYW5zcG9zZSA9IG9wZXJhdGlvbihmdW5jdGlvbiAoaSwgbikge1xuICBpZiAoaSA9PT0gZmFsc2UpIHJldHVybiBuXG4gIGVsc2UgaWYgKCFBcnJheS5pc0FycmF5KGkpIHx8ICFBcnJheS5pc0FycmF5KG4pKSByZXR1cm4gbnVsbFxuICBlbHNlIGlmIChpLmxlbmd0aCA9PT0gMSB8fCBuLmxlbmd0aCA9PT0gMSkgcmV0dXJuIFtuWzBdICsgaVswXV1cbiAgdmFyIGQgPSBpLmxlbmd0aCA9PT0gMiAmJiBuLmxlbmd0aCA9PT0gMiA/IG51bGwgOiBuWzJdIHx8IGlbMl1cbiAgcmV0dXJuIFtuWzBdICsgaVswXSwgblsxXSArIGlbMV0sIGRdXG59KVxuXG5pZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMpIG1vZHVsZS5leHBvcnRzID0gdHJhbnNwb3NlXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHdpbmRvdy50cmFuc3Bvc2UgPSB0cmFuc3Bvc2VcbiIsIihmdW5jdGlvbigpIHtcblxuXHR2YXIgc2V0dGVyR2V0dGVyaWZ5ID0gcmVxdWlyZSgnc2V0dGVyLWdldHRlcmlmeScpO1xuXHR2YXIgc2FmZVJlZ2lzdGVyRWxlbWVudCA9IHJlcXVpcmUoJ3NhZmUtcmVnaXN0ZXItZWxlbWVudCcpO1xuXG5cdC8vIElkZWFsbHkgaXQgd291bGQgYmUgYmV0dGVyIHRvIGV4dGVuZCB0aGUgSFRNTElucHV0RWxlbWVudCBwcm90b3R5cGUgYnV0XG5cdC8vIGl0IGRvZXNuJ3Qgc2VlbSB0byBiZSB3b3JraW5nIGFuZCBJIGRvbid0IGdldCBhbnkgZGlzdGluY3QgZWxlbWVudCBhdCBhbGxcblx0Ly8gb3IgSSBnZXQgYW4gXCJUeXBlRXJyb3I6ICd0eXBlJyBzZXR0ZXIgY2FsbGVkIG9uIGFuIG9iamVjdCB0aGF0IGRvZXMgbm90IGltcGxlbWVudCBpbnRlcmZhY2UgSFRNTElucHV0RWxlbWVudC5cIlxuXHQvLyAuLi4gc28gdXNpbmcganVzdCBIVE1MRWxlbWVudCBmb3Igbm93XG5cdHZhciBwcm90byA9IE9iamVjdC5jcmVhdGUoSFRNTEVsZW1lbnQucHJvdG90eXBlKTtcblxuXHRwcm90by5jcmVhdGVkQ2FsbGJhY2sgPSBmdW5jdGlvbigpIHtcblxuXHRcdHZhciB0aGF0ID0gdGhpcztcblxuXHRcdC8vIFZhbHVlc1xuXHRcdHZhciBwcm9wZXJ0aWVzID0ge1xuXHRcdFx0bWluOiAwLFxuXHRcdFx0bWF4OiAxMDAsXG5cdFx0XHR2YWx1ZTogNTAsXG5cdFx0XHRzdGVwOiAxXG5cdFx0fTtcblxuXHRcdHNldHRlckdldHRlcmlmeSh0aGlzLCBwcm9wZXJ0aWVzLCB7XG5cdFx0XHRhZnRlclNldHRpbmc6IGZ1bmN0aW9uKHByb3BlcnR5LCB2YWx1ZSkge1xuXHRcdFx0XHR1cGRhdGVEaXNwbGF5KHRoYXQpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcblx0XHR0aGlzLl9wcm9wZXJ0aWVzID0gcHJvcGVydGllcztcblxuXHRcdC8vIE1hcmt1cFxuXHRcdHZhciBzbGlkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuXHRcdHNsaWRlci50eXBlID0gJ3JhbmdlJztcblxuXHRcdHZhciB2YWx1ZVNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG5cblx0XHR0aGlzLl9zbGlkZXIgPSBzbGlkZXI7XG5cdFx0dGhpcy5fdmFsdWVTcGFuID0gdmFsdWVTcGFuO1xuXG5cdFx0dGhpcy5hcHBlbmRDaGlsZChzbGlkZXIpO1xuXHRcdHRoaXMuYXBwZW5kQ2hpbGQodmFsdWVTcGFuKTtcblxuXHRcdHNsaWRlci5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dGhhdC52YWx1ZSA9IHNsaWRlci52YWx1ZSAqIDEuMDtcblx0XHR9KTtcblxuXHR9O1xuXG5cdFxuXHR2YXIgc2xpZGVyQXR0cmlidXRlcyA9IFsgJ21pbicsICdtYXgnLCAndmFsdWUnLCAnc3RlcCcgXTtcblxuXHRwcm90by5hdHRhY2hlZENhbGxiYWNrID0gZnVuY3Rpb24oKSB7XG5cblx0XHR2YXIgYXR0cnMgPSB0aGlzLmF0dHJpYnV0ZXM7XG5cdFx0dmFyIHZhbHVlSXNUaGVyZSA9IGZhbHNlO1xuXHRcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgYXR0cnMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBhdHRyID0gYXR0cnNbaV07XG5cblx0XHRcdGlmKGF0dHIubmFtZSA9PT0gJ3ZhbHVlJykge1xuXHRcdFx0XHR2YWx1ZUlzVGhlcmUgPSB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBKdXN0IHNlbmRpbmcgc2Vuc2libGUgYXR0cmlidXRlcyB0byB0aGUgc2xpZGVyIGl0c2VsZlxuXHRcdFx0aWYoc2xpZGVyQXR0cmlidXRlcy5pbmRleE9mKGF0dHIubmFtZSkgIT09IC0xKSB7XG5cdFx0XHRcdHRoaXMuX3Byb3BlcnRpZXNbYXR0ci5uYW1lXSA9IGF0dHIudmFsdWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gSWYgbm90IHNwZWNpZmllZCwgdGhlIGRlZmF1bHQgdmFsdWUgaGFzIHRvIGJlIFxuXHRcdC8vIChtaW4gKyBtYXgpIC8gMiBhcyB0aGUgbm9ybWFsIHNsaWRlciB3b3VsZCBkbyBhcyB3ZWxsLlxuXHRcdGlmKCF2YWx1ZUlzVGhlcmUpIHtcblx0XHRcdHZhciBjYWxjdWxhdGVkVmFsdWUgPSAodGhpcy5fcHJvcGVydGllcy5taW4gKiAxLjAgKyB0aGlzLl9wcm9wZXJ0aWVzLm1heCAqIDEuMCkgLyAyLjA7XG5cdFx0XHR0aGlzLl9wcm9wZXJ0aWVzLnZhbHVlID0gY2FsY3VsYXRlZFZhbHVlO1xuXHRcdH1cblxuXHRcdHVwZGF0ZURpc3BsYXkodGhpcyk7XG5cblx0fTtcblxuXG5cdGZ1bmN0aW9uIHVwZGF0ZURpc3BsYXkoY29tcG8pIHtcblx0XHRjb21wby5fdmFsdWVTcGFuLmlubmVySFRNTCA9IGNvbXBvLl9wcm9wZXJ0aWVzLnZhbHVlO1xuXHRcdGNvbXBvLl9zbGlkZXIudmFsdWUgPSBjb21wby5fcHJvcGVydGllcy52YWx1ZTtcblx0XHRjb21wby5fc2xpZGVyLm1pbiA9IGNvbXBvLl9wcm9wZXJ0aWVzLm1pbjtcblx0XHRjb21wby5fc2xpZGVyLm1heCA9IGNvbXBvLl9wcm9wZXJ0aWVzLm1heDtcblx0XHRjb21wby5fc2xpZGVyLnN0ZXAgPSBjb21wby5fcHJvcGVydGllcy5zdGVwO1xuXHR9XG5cblx0Ly9cblx0XG5cdHZhciBjb21wb25lbnQgPSB7fTtcblx0Y29tcG9uZW50LnByb3RvdHlwZSA9IHByb3RvO1xuXHRjb21wb25lbnQucmVnaXN0ZXIgPSBmdW5jdGlvbihuYW1lKSB7XG5cdFx0c2FmZVJlZ2lzdGVyRWxlbWVudChuYW1lLCBwcm90byk7XG5cdH07XG5cblx0aWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG5cdFx0ZGVmaW5lKGZ1bmN0aW9uKCkgeyByZXR1cm4gY29tcG9uZW50OyB9KTtcblx0fSBlbHNlIGlmKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBjb21wb25lbnQ7XG5cdH0gZWxzZSB7XG5cdFx0Y29tcG9uZW50LnJlZ2lzdGVyKCdvcGVubXVzaWMtc2xpZGVyJyk7IC8vIGF1dG9tYXRpYyByZWdpc3RyYXRpb25cblx0fVxuXG59KS5jYWxsKHRoaXMpO1xuXG5cbiIsIid1c2Ugc3RyaWN0Jztcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGRhdGEsIG9wdGlvbnMpIHtcblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cdGRhdGEgPSBkYXRhLnNsaWNlKCk7XG5cblx0dmFyIGNvdW50ID0gTnVtYmVyKG9wdGlvbnMuY291bnQpIHx8IDE7XG5cdHZhciByZXQgPSBbXTtcblxuXHRpZiAoIUFycmF5LmlzQXJyYXkoZGF0YSkpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdFeHBlY3RlZCBhbiBhcnJheSBhcyB0aGUgZmlyc3QgYXJndW1lbnQnKTtcblx0fVxuXG5cdGlmIChjb3VudCA+IGRhdGEubGVuZ3RoKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdDb3VudCBtdXN0IGJlIGxvd2VyIG9yIHRoZSBzYW1lIGFzIHRoZSBudW1iZXIgb2YgcGlja3MnKTtcblx0fVxuXG5cdHdoaWxlIChjb3VudC0tKSB7XG5cdFx0cmV0LnB1c2goZGF0YS5zcGxpY2UoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogZGF0YS5sZW5ndGgpLCAxKVswXSk7XG5cdH1cblxuXHRyZXR1cm4gcmV0O1xufTtcbiIsInZhciBtYWtlRGlzdG9ydGlvbkN1cnZlID0gcmVxdWlyZSgnbWFrZS1kaXN0b3J0aW9uLWN1cnZlJylcbnZhciBNSURJVXRpbHMgPSByZXF1aXJlKCdtaWRpdXRpbHMnKVxudmFyIGFkc3IgPSByZXF1aXJlKCdhLWQtcy1yJylcblxuLy8geXIgZnVuY3Rpb24gc2hvdWxkIGFjY2VwdCBhbiBhdWRpb0NvbnRleHQsIGFuZCBvcHRpb25hbCBwYXJhbXMvb3B0c1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYWMsIG9wdHMpIHtcbiAgLy8gbWFrZSBzb21lIGF1ZGlvTm9kZXMsIGNvbm5lY3QgdGhlbSwgc3RvcmUgdGhlbSBvbiB0aGUgb2JqZWN0XG4gIHZhciBhdWRpb05vZGVzID0ge31cblxuICB2YXIgb3NjMSA9IGFjLmNyZWF0ZU9zY2lsbGF0b3IoKVxuICB2YXIgb3NjMiA9IGFjLmNyZWF0ZU9zY2lsbGF0b3IoKVxuICB2YXIgb3NjMyA9IGFjLmNyZWF0ZU9zY2lsbGF0b3IoKVxuICB2YXIgb3Njbm9pc2UgPSBhYy5jcmVhdGVPc2NpbGxhdG9yKClcbiAgb3NjMS50eXBlID0gJ3RyaWFuZ2xlJ1xuICBvc2MyLnR5cGUgPSAndHJpYW5nbGUnXG4gIG9zYzMudHlwZSA9ICdzaW5lJ1xuICBvc2Nub2lzZS50eXBlID0gJ3Nhd3Rvb3RoJ1xuXG4gIC8vIGFyZSB0aGVzZSB0b29vb28gc21hbGw/XG4gIG9zYzEuZGV0dW5lLnZhbHVlID0gMC43NSAqICgoTWF0aC5yYW5kb20oKSAqIDIpIC0gMSlcbiAgb3NjMi5kZXR1bmUudmFsdWUgPSAwLjc1ICogKChNYXRoLnJhbmRvbSgpICogMikgLSAxKVxuICBvc2MzLmRldHVuZS52YWx1ZSA9IDAuMyAqICgoTWF0aC5yYW5kb20oKSAqIDIpIC0gMSlcblxuICB2YXIgbGVmdGZpbHRlciA9IGFjLmNyZWF0ZUJpcXVhZEZpbHRlcigpXG4gIGxlZnRmaWx0ZXIudHlwZSA9ICdsb3dwYXNzJ1xuICBsZWZ0ZmlsdGVyLlEudmFsdWUgPSA3XG4gIGxlZnRmaWx0ZXIuZGV0dW5lLnZhbHVlID0gMC43NSAqICgoTWF0aC5yYW5kb20oKSAqIDIpIC0gMSlcbiAgbGVmdGZpbHRlci5mcmVxdWVuY3kuc2V0VmFsdWVBdFRpbWUoNTAwLCBhYy5jdXJyZW50VGltZSlcblxuICB2YXIgcmlnaHRmaWx0ZXIgPSBhYy5jcmVhdGVCaXF1YWRGaWx0ZXIoKVxuICByaWdodGZpbHRlci50eXBlID0gJ2xvd3Bhc3MnXG4gIHJpZ2h0ZmlsdGVyLlEudmFsdWUgPSA3XG4gIHJpZ2h0ZmlsdGVyLmRldHVuZS52YWx1ZSA9IDAuNzUgKiAoKE1hdGgucmFuZG9tKCkgKiAyKSAtIDEpXG4gIHJpZ2h0ZmlsdGVyLmZyZXF1ZW5jeS5zZXRWYWx1ZUF0VGltZSg1MDAsIGFjLmN1cnJlbnRUaW1lKVxuXG5cbiAgdmFyIG5vaXNlZ2FpbiA9IGFjLmNyZWF0ZUdhaW4oKVxuICBub2lzZWdhaW4uZ2Fpbi5zZXRWYWx1ZUF0VGltZSgwLCBhYy5jdXJyZW50VGltZSlcblxuICB2YXIgZGVsYXkgPSBhYy5jcmVhdGVEZWxheSgwLjM1KVxuXG4gIHZhciBjb21wcmVzc29yID0gYWMuY3JlYXRlRHluYW1pY3NDb21wcmVzc29yKClcbiAgY29tcHJlc3Nvci50aHJlc2hvbGQudmFsdWUgPSAtMzBcbiAgY29tcHJlc3Nvci5rbmVlLnZhbHVlID0gMzNcbiAgY29tcHJlc3Nvci5yYXRpby52YWx1ZSA9IDlcbiAgY29tcHJlc3Nvci5yZWR1Y3Rpb24udmFsdWUgPSAtMTBcbiAgY29tcHJlc3Nvci5hdHRhY2sudmFsdWUgPSAwLjE1XG4gIGNvbXByZXNzb3IucmVsZWFzZS52YWx1ZSA9IDAuMzVcblxuICB2YXIgZ2FpbiA9IGFjLmNyZWF0ZUdhaW4oKVxuICBnYWluLmdhaW4uc2V0VmFsdWVBdFRpbWUoMCwgYWMuY3VycmVudFRpbWUpXG5cblxuICB2YXIgZGlzdG9ydGlvbiA9IGFjLmNyZWF0ZVdhdmVTaGFwZXIoKVxuICBkaXN0b3J0aW9uLmN1cnZlID0gbWFrZURpc3RvcnRpb25DdXJ2ZSg3NSlcblxuICB2YXIgbWFpbmZpbHRlciA9IGFjLmNyZWF0ZUJpcXVhZEZpbHRlcigpXG4gIG1haW5maWx0ZXIudHlwZSA9ICdsb3dwYXNzJ1xuICBtYWluZmlsdGVyLmZyZXF1ZW5jeS5zZXRWYWx1ZUF0VGltZSg1MDAsIGFjLmN1cnJlbnRUaW1lKVxuXG4gIG9zY25vaXNlLmNvbm5lY3Qobm9pc2VnYWluKVxuICBvc2MxLmNvbm5lY3QobGVmdGZpbHRlcilcbiAgb3NjMi5jb25uZWN0KHJpZ2h0ZmlsdGVyKVxuICBsZWZ0ZmlsdGVyLmNvbm5lY3QoY29tcHJlc3NvcilcbiAgcmlnaHRmaWx0ZXIuY29ubmVjdChjb21wcmVzc29yKVxuICBvc2MzLmNvbm5lY3QoY29tcHJlc3NvcilcbiAgbm9pc2VnYWluLmNvbm5lY3QoZGVsYXkpXG4gIG5vaXNlZ2Fpbi5jb25uZWN0KGRpc3RvcnRpb24pXG4gIGRlbGF5LmNvbm5lY3QoY29tcHJlc3NvcilcbiAgY29tcHJlc3Nvci5jb25uZWN0KGdhaW4pXG4gIGdhaW4uY29ubmVjdChkaXN0b3J0aW9uKVxuICBkaXN0b3J0aW9uLmNvbm5lY3QobWFpbmZpbHRlcilcblxuICAvLyBnb3R0YSBiZSBhIGJldHRlciB3YXkgdG8gZG8gdGhpcy4uLiBvaCB3ZWxsXG4gIGF1ZGlvTm9kZXMub3Njbm9pc2UgPSBvc2Nub2lzZVxuICBhdWRpb05vZGVzLm5vaXNlZ2FpbiA9IG5vaXNlZ2FpblxuICBhdWRpb05vZGVzLm9zYzEgPSBvc2MxXG4gIGF1ZGlvTm9kZXMub3NjMiA9IG9zYzJcbiAgYXVkaW9Ob2Rlcy5vc2MzID0gb3NjM1xuICBhdWRpb05vZGVzLmxlZnRmaWx0ZXIgPSBsZWZ0ZmlsdGVyXG4gIGF1ZGlvTm9kZXMucmlnaHRmaWx0ZXIgPSByaWdodGZpbHRlclxuICBhdWRpb05vZGVzLm1haW5maWx0ZXIgPSBtYWluZmlsdGVyXG4gIGF1ZGlvTm9kZXMuZ2FpbiA9IGdhaW5cbiAgYXVkaW9Ob2Rlcy5kZWxheSA9IGRlbGF5XG4gIGF1ZGlvTm9kZXMuZGlzdG9ydGlvbiA9IGRpc3RvcnRpb25cbiAgYXVkaW9Ob2Rlcy5jb21wcmVzc29yID0gY29tcHJlc3NvclxuXG4gIC8vIGdvc2ggaSB3aXNoIHRoZXJlIHdhcyBhbiBhdWRpb05vZGUgdGhhdCBqdXN0IGRpZCB0aGlzLi4uXG4gIGF1ZGlvTm9kZXMuc2V0dGluZ3MgPSB7XG4gICAgYXR0YWNrOiAwLjEsXG4gICAgZGVjYXk6IDAuMDUsXG4gICAgc3VzdGFpbjogMC4zLFxuICAgIHJlbGVhc2U6IDAuMSxcbiAgICBwZWFrOiAwLjUsXG4gICAgbWlkOiAwLjMsXG4gICAgZW5kOiAwLjAwMDAwMVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBjb25uZWN0OiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgIC8vIC8vIHRoaXMgZnVuY3Rpb24gc2hvdWxkIGNhbGwgYGNvbm5lY3RgIG9uIHlyIG91dHB1dCBub2RlcyB3aXRoIGBpbnB1dGAgYXMgdGhlIGFyZ1xuICAgICAgYXVkaW9Ob2Rlcy5tYWluZmlsdGVyLmNvbm5lY3QoaW5wdXQpXG5cbiAgICAgIC8vIGp1c3QgbGV0IHRoZW0gYnV6eiBmb3JldmVyLCBkZWFsIHdpdGggXCJub3Rlc1wiIHZpYSBhZHNyIHRyaWNrc1xuICAgICAgYXVkaW9Ob2Rlcy5vc2Nub2lzZS5zdGFydChhYy5jdXJyZW50VGltZSlcbiAgICAgIGF1ZGlvTm9kZXMub3NjMS5zdGFydChhYy5jdXJyZW50VGltZSlcbiAgICAgIGF1ZGlvTm9kZXMub3NjMi5zdGFydChhYy5jdXJyZW50VGltZSlcbiAgICAgIGF1ZGlvTm9kZXMub3NjMy5zdGFydChhYy5jdXJyZW50VGltZSlcbiAgICB9LFxuICAgIHN0YXJ0OiBmdW5jdGlvbiAod2hlbikge1xuICAgICAgLy8gY29uc29sZS5sb2coJ3N0YXJ0JywgYXVkaW9Ob2Rlcy5zZXR0aW5ncylcblxuICAgICAgYWRzcihhdWRpb05vZGVzLmdhaW4sIHdoZW4sIGF1ZGlvTm9kZXMuc2V0dGluZ3MpXG4gICAgICAvLyBjb25zb2xlLmxvZygnb25lJylcbiAgICAgIHZhciBjbG9uZWQgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGF1ZGlvTm9kZXMuc2V0dGluZ3MpKVxuICAgICAgY2xvbmVkLnBlYWsgLz0gMi4wXG4gICAgICBjbG9uZWQubWlkIC89IDIuMFxuICAgICAgLy8gY29uc29sZS5sb2coJ2RpZGl0JywgY2xvbmVkKVxuICAgICAgYWRzcihhdWRpb05vZGVzLm5vaXNlZ2Fpbiwgd2hlbiwgY2xvbmVkKVxuICAgIH0sXG4gICAgc3RvcDogZnVuY3Rpb24gKHdoZW4pIHtcbiAgICAgIGF1ZGlvTm9kZXMub3Njbm9pc2Uuc3RvcCh3aGVuKVxuICAgICAgYXVkaW9Ob2Rlcy5vc2MxLnN0b3Aod2hlbilcbiAgICAgIGF1ZGlvTm9kZXMub3NjMi5zdG9wKHdoZW4pXG4gICAgICBhdWRpb05vZGVzLm9zYzMuc3RvcCh3aGVuKVxuICAgICAgY29uc29sZS5sb2coJ3doeWQgdSBwdXNoIHRoZSBwaWFubyBvZmYgdGhlIGJ1aWxkaW5nPyBub3QgaXQgaXMgYnJva2VuLCBmb3JldmVyLiBnb3R0YSBtYWtlIGEgbmV3IG9uZSEnKVxuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAob3B0cywgd2hlbikge1xuICAgICAgLy8gYXZhaWxhYmxlIG9wdHM6XG4gICAgICAvLyB7bWlkaU5vdGU6IDYyLCBhdHRhY2s6ICwgZGVjYXk6ICwgc3VzdGFpbjogLCByZWxlYXNlOiB9XG4gICAgICBPYmplY3Qua2V5cyhvcHRzKS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7XG4gICAgICAgIHZhciB2ID0gb3B0c1trXVxuICAgICAgICBpZiAoayA9PSAnbWlkaU5vdGUnIHx8IGsgPT0gJ2ZyZXEnKSB7XG4gICAgICAgICAgdmFyIGZyZXEgPSBrID09ICdtaWRpTm90ZScgPyBNSURJVXRpbHMubm90ZU51bWJlclRvRnJlcXVlbmN5KHYpIDogdlxuICAgICAgICAgIGF1ZGlvTm9kZXMubGVmdGZpbHRlci5mcmVxdWVuY3kuc2V0VmFsdWVBdFRpbWUoZnJlcSArIChNYXRoLnJhbmRvbSgpICogKGZyZXEgLyAyLjUpKSwgd2hlbilcbiAgICAgICAgICBhdWRpb05vZGVzLnJpZ2h0ZmlsdGVyLmZyZXF1ZW5jeS5zZXRWYWx1ZUF0VGltZShmcmVxICsgKE1hdGgucmFuZG9tKCkgKiAoZnJlcSAvIDIuNSkpLCB3aGVuKVxuICAgICAgICAgIGF1ZGlvTm9kZXMubWFpbmZpbHRlci5mcmVxdWVuY3kuc2V0VmFsdWVBdFRpbWUoZnJlcSArIChNYXRoLnJhbmRvbSgpICogKGZyZXEgLyAzLjUpKSwgd2hlbilcbiAgICAgICAgICBhdWRpb05vZGVzLm9zY25vaXNlLmZyZXF1ZW5jeS5zZXRWYWx1ZUF0VGltZShmcmVxLCB3aGVuKVxuICAgICAgICAgIGF1ZGlvTm9kZXMub3NjMS5mcmVxdWVuY3kuc2V0VmFsdWVBdFRpbWUoZnJlcSwgd2hlbilcbiAgICAgICAgICBhdWRpb05vZGVzLm9zYzIuZnJlcXVlbmN5LnNldFZhbHVlQXRUaW1lKGZyZXEsIHdoZW4pXG4gICAgICAgICAgYXVkaW9Ob2Rlcy5vc2MzLmZyZXF1ZW5jeS5zZXRWYWx1ZUF0VGltZShmcmVxIC8gMi4wLCB3aGVuKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGp1c3QgYW4gQURTUiB2YWx1ZVxuICAgICAgICAgIGF1ZGlvTm9kZXMuc2V0dGluZ3Nba10gPSB2XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSxcbiAgICBub2RlczogZnVuY3Rpb24gKCkge1xuICAgICAgLy8gcmV0dXJucyBhbiBvYmplY3Qgb2YgYHtzdHJpbmdLZXk6IGF1ZGlvTm9kZX1gIGZvciByYXcgbWFuaXB1bGF0aW9uXG4gICAgICByZXR1cm4gYXVkaW9Ob2Rlc1xuICAgIH1cbiAgfVxufSIsInZhciBtYWtlRGlzdG9ydGlvbkN1cnZlID0gcmVxdWlyZSgnbWFrZS1kaXN0b3J0aW9uLWN1cnZlJylcbnZhciBhZHNyID0gcmVxdWlyZSgnYS1kLXMtcicpXG4vLyB5ciBmdW5jdGlvbiBzaG91bGQgYWNjZXB0IGFuIGF1ZGlvQ29udGV4dCwgYW5kIG9wdGlvbmFsIHBhcmFtcy9vcHRzXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChhYywgb3B0cykge1xuICAvLyBtYWtlIHNvbWUgYXVkaW9Ob2RlcywgY29ubmVjdCB0aGVtLCBzdG9yZSB0aGVtIG9uIHRoZSBvYmplY3RcbiAgdmFyIGF1ZGlvTm9kZXMgPSB7XG4gICAgb25lOiBhYy5jcmVhdGVPc2NpbGxhdG9yKCksXG4gICAgdHdvOiBhYy5jcmVhdGVPc2NpbGxhdG9yKCksXG4gICAgdGhyZWU6IGFjLmNyZWF0ZU9zY2lsbGF0b3IoKSxcbiAgICBmb3VyOiBhYy5jcmVhdGVPc2NpbGxhdG9yKCksXG4gICAgZml2ZTogYWMuY3JlYXRlT3NjaWxsYXRvcigpLFxuICAgIHNpeDogYWMuY3JlYXRlT3NjaWxsYXRvcigpLFxuICAgIG1haW5nYWluOiBhYy5jcmVhdGVHYWluKCksXG4gICAgZGlzdG9ydGlvbjogYWMuY3JlYXRlV2F2ZVNoYXBlcigpLFxuICAgIGJhbmRmaWx0ZXI6IGFjLmNyZWF0ZUJpcXVhZEZpbHRlcigpLFxuICAgIGhpZ2hmaWx0ZXI6IGFjLmNyZWF0ZUJpcXVhZEZpbHRlcigpLFxuICAgIGRlbGF5OiBhYy5jcmVhdGVEZWxheSgwLjA1KSxcbiAgICBkZ2FpbjogYWMuY3JlYXRlR2FpbigpLFxuICAgIGVudmVsb3BlOiBhYy5jcmVhdGVHYWluKCksXG4gICAgc2V0dGluZ3M6IHtcbiAgICAgIGF0dGFjazogMC4wMixcbiAgICAgIGRlY2F5OiAwLjAzLFxuICAgICAgc3VzdGFpbjogMC4wMDAwMDEsXG4gICAgICByZWxlYXNlOiAwLjMsXG4gICAgICBwZWFrOiAwLjcsXG4gICAgICBtaWQ6IDAuMjUsXG4gICAgICBlbmQ6IDAuMDAwMDFcbiAgICB9XG4gIH1cblxuICBhdWRpb05vZGVzLm9uZS50eXBlID0gJ3NxdWFyZSdcbiAgYXVkaW9Ob2Rlcy5vbmUuZnJlcXVlbmN5LnNldFZhbHVlQXRUaW1lKDgwLCBhYy5jdXJyZW50VGltZSlcbiAgYXVkaW9Ob2Rlcy50d28udHlwZSA9ICdzcXVhcmUnXG4gIGF1ZGlvTm9kZXMudHdvLmZyZXF1ZW5jeS5zZXRWYWx1ZUF0VGltZSgxMTUsIGFjLmN1cnJlbnRUaW1lKVxuICBhdWRpb05vZGVzLnRocmVlLnR5cGUgPSAnc3F1YXJlJ1xuICBhdWRpb05vZGVzLnRocmVlLmZyZXF1ZW5jeS5zZXRWYWx1ZUF0VGltZSgxNjUsIGFjLmN1cnJlbnRUaW1lKVxuICBhdWRpb05vZGVzLmZvdXIudHlwZSA9ICdzcXVhcmUnXG4gIGF1ZGlvTm9kZXMuZm91ci5mcmVxdWVuY3kuc2V0VmFsdWVBdFRpbWUoMjUwLCBhYy5jdXJyZW50VGltZSlcbiAgYXVkaW9Ob2Rlcy5maXZlLnR5cGUgPSAnc3F1YXJlJ1xuICBhdWRpb05vZGVzLmZpdmUuZnJlcXVlbmN5LnNldFZhbHVlQXRUaW1lKDM0MCwgYWMuY3VycmVudFRpbWUpXG4gIGF1ZGlvTm9kZXMuc2l4LnR5cGUgPSAnc3F1YXJlJ1xuICBhdWRpb05vZGVzLnNpeC5mcmVxdWVuY3kuc2V0VmFsdWVBdFRpbWUoNDIwLCBhYy5jdXJyZW50VGltZSlcblxuICBhdWRpb05vZGVzLm1haW5nYWluLmdhaW4udmFsdWUgPSAwLjc1IC8gNi4wXG5cbiAgYXVkaW9Ob2Rlcy5kaXN0b3J0aW9uLmN1cnZlID0gbWFrZURpc3RvcnRpb25DdXJ2ZSgzMzMpXG5cbiAgYXVkaW9Ob2Rlcy5iYW5kZmlsdGVyLnR5cGUgPSAnYmFuZHBhc3MnXG4gIGF1ZGlvTm9kZXMuYmFuZGZpbHRlci5mcmVxdWVuY3kuc2V0VmFsdWVBdFRpbWUoMTA0MjAsIGFjLmN1cnJlbnRUaW1lKVxuXG4gIGF1ZGlvTm9kZXMuaGlnaGZpbHRlci50eXBlID0gJ2hpZ2hwYXNzJ1xuICBhdWRpb05vZGVzLmhpZ2hmaWx0ZXIuZnJlcXVlbmN5LnNldFZhbHVlQXRUaW1lKDY2NjAsIGFjLmN1cnJlbnRUaW1lKVxuXG4gIGF1ZGlvTm9kZXMuZGdhaW4uZ2Fpbi52YWx1ZSA9IDAuNVxuXG4gIGF1ZGlvTm9kZXMuZW52ZWxvcGUuZ2Fpbi5zZXRWYWx1ZUF0VGltZSgwLCBhYy5jdXJyZW50VGltZSlcblxuICBhdWRpb05vZGVzLm9uZS5jb25uZWN0KGF1ZGlvTm9kZXMubWFpbmdhaW4pXG4gIGF1ZGlvTm9kZXMudHdvLmNvbm5lY3QoYXVkaW9Ob2Rlcy5tYWluZ2FpbilcbiAgYXVkaW9Ob2Rlcy50aHJlZS5jb25uZWN0KGF1ZGlvTm9kZXMubWFpbmdhaW4pXG4gIGF1ZGlvTm9kZXMuZm91ci5jb25uZWN0KGF1ZGlvTm9kZXMubWFpbmdhaW4pXG4gIGF1ZGlvTm9kZXMuZml2ZS5jb25uZWN0KGF1ZGlvTm9kZXMubWFpbmdhaW4pXG4gIGF1ZGlvTm9kZXMuc2l4LmNvbm5lY3QoYXVkaW9Ob2Rlcy5tYWluZ2FpbilcbiAgYXVkaW9Ob2Rlcy5tYWluZ2Fpbi5jb25uZWN0KGF1ZGlvTm9kZXMuZGlzdG9ydGlvbilcbiAgYXVkaW9Ob2Rlcy5kaXN0b3J0aW9uLmNvbm5lY3QoYXVkaW9Ob2Rlcy5iYW5kZmlsdGVyKVxuICBhdWRpb05vZGVzLmJhbmRmaWx0ZXIuY29ubmVjdChhdWRpb05vZGVzLmhpZ2hmaWx0ZXIpXG4gIGF1ZGlvTm9kZXMuaGlnaGZpbHRlci5jb25uZWN0KGF1ZGlvTm9kZXMuZGVsYXkpXG4gIGF1ZGlvTm9kZXMuZGVsYXkuY29ubmVjdChhdWRpb05vZGVzLmRnYWluKVxuICBhdWRpb05vZGVzLmRnYWluLmNvbm5lY3QoYXVkaW9Ob2Rlcy5lbnZlbG9wZSlcblxuICBhdWRpb05vZGVzLm9uZS5zdGFydChhYy5jdXJyZW50VGltZSlcbiAgYXVkaW9Ob2Rlcy50d28uc3RhcnQoYWMuY3VycmVudFRpbWUpXG4gIGF1ZGlvTm9kZXMudGhyZWUuc3RhcnQoYWMuY3VycmVudFRpbWUpXG4gIGF1ZGlvTm9kZXMuZm91ci5zdGFydChhYy5jdXJyZW50VGltZSlcbiAgYXVkaW9Ob2Rlcy5maXZlLnN0YXJ0KGFjLmN1cnJlbnRUaW1lKVxuICBhdWRpb05vZGVzLnNpeC5zdGFydChhYy5jdXJyZW50VGltZSlcbiAgcmV0dXJuIHtcbiAgICBjb25uZWN0OiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgIGF1ZGlvTm9kZXMuZW52ZWxvcGUuY29ubmVjdChpbnB1dClcbiAgICB9LFxuICAgIHN0YXJ0OiBmdW5jdGlvbiAod2hlbikge1xuICAgICAgLy8gLy90aGlzIGZ1bmN0aW9uIHNob3VsZCBjYWxsIGBzdGFydCh3aGVuKWAgb24geXIgc291cmNlIG5vZGVzLiBQcm9iYWJseSBvc2NpbGxhdG9ycy9zYW1wbGVycyBpIGd1ZXNzLCBhbmQgYW55IExGTyB0b28hXG4gICAgICBhZHNyKGF1ZGlvTm9kZXMuZW52ZWxvcGUsIHdoZW4sIGF1ZGlvTm9kZXMuc2V0dGluZ3MpXG4gICAgfSxcbiAgICBzdG9wOiBmdW5jdGlvbiAod2hlbikge1xuICAgICAgLy8gLy8gc2FtZSB0aGluZyBhcyBzdGFydCBidXQgd2l0aCBgc3RvcCh3aGVuKWBcbiAgICAgIGF1ZGlvTm9kZXMuc291cmNlLnN0b3Aod2hlbilcbiAgICAgIGF1ZGlvTm9kZXMuc291cmNlLnN0b3Aod2hlbilcbiAgICAgIGF1ZGlvTm9kZXMuc291cmNlLnN0b3Aod2hlbilcbiAgICAgIGF1ZGlvTm9kZXMuc291cmNlLnN0b3Aod2hlbilcbiAgICAgIGF1ZGlvTm9kZXMuc291cmNlLnN0b3Aod2hlbilcbiAgICAgIGF1ZGlvTm9kZXMuc291cmNlLnN0b3Aod2hlbilcbiAgICB9LFxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKG9wdHMpIHtcbiAgICAgIC8vIG9wdGlvbmFsOiBmb3IgcGVyZm9ybWluZyBoaWdoLWxldmVsIHVwZGF0ZXMgb24gdGhlIGluc3RydW1lbnQuXG4gICAgICBPYmplY3Qua2V5cyhvcHRzKS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7XG4gICAgICAgIHZhciB2ID0gb3B0c1trXVxuICAgICAgICAvLyA/Pz8/XG4gICAgICB9KVxuICAgIH0sXG4gICAgbm9kZXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIHJldHVybnMgYW4gb2JqZWN0IG9mIGB7c3RyaW5nS2V5OiBhdWRpb05vZGV9YCBmb3IgcmF3IG1hbmlwdWxhdGlvblxuICAgICAgcmV0dXJuIGF1ZGlvTm9kZXNcbiAgICB9XG4gIH1cbn0iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNhZmVSZWdpc3RyYXRpb24obmFtZSwgcHJvdG90eXBlKSB7XG5cdHRyeSB7XG5cdFx0ZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KG5hbWUsIHtcblx0XHRcdHByb3RvdHlwZTogcHJvdG90eXBlXG5cdFx0fSk7XG5cdH0gY2F0Y2goZSkge1xuXHRcdGNvbnNvbGUubG9nKCdFeGNlcHRpb24gd2hlbiByZWdpc3RlcmluZyAnICsgbmFtZSArICc7IHBlcmhhcHMgaXQgaGFzIGJlZW4gcmVnaXN0ZXJlZCBhbHJlYWR5PycpO1xuXHR9XG59O1xuIiwiKGZ1bmN0aW9uKCkge1xuXHR2YXIgcHJvdG8gPSBPYmplY3QuY3JlYXRlKEhUTUxFbGVtZW50LnByb3RvdHlwZSlcblxuXHRwcm90by5jcmVhdGVkQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIHRoYXQgPSB0aGlzXG5cdFx0dGhpcy52YWx1ZXMgPSB7fVxuXG5cdFx0Ly8gbWFraW5nIHdlYiBjb21wb25lbnRzIE1XQyBmcmFtZXdvcmsgcHJvb2YuXG5cdFx0dGhpcy5pbm5lckhUTUwgPSAnJ1xuXG5cdFx0ZnVuY3Rpb24gbWFrZU9wdGlvbiAodmFsKSB7XG5cdFx0XHRyZXR1cm4gJzxvcHRpb24gdmFsdWU9XCInICsgdmFsICsgJ1wiPicgKyB2YWwgKyAnPC9vcHRpb24+J1xuXHRcdH1cblxuXHRcdHZhciBub3RlU2VsZWN0ID0gW1wiQ1wiLCBcIkMjXCIsIFwiRFwiLCBcIkQjXCIsIFwiRVwiLCBcIkZcIiwgXCJGI1wiLCBcIkdcIiwgXCJHI1wiLCBcIkFcIiwgXCJBI1wiLCBcIkJcIl0ubWFwKG1ha2VPcHRpb24pXG5cdFx0dmFyIHNjYWxlU2VsZWN0ID0gW1wibWFqb3JcIiwgXCJtaW5vclwiLCBcInBlbnRNYWpcIiwgXCJwZW50TWluXCJdLm1hcChtYWtlT3B0aW9uKVxuXHRcdHZhciB0ZW1wbGF0ZUNvbnRlbnRzID0gWyc8c2VsZWN0IGNsYXNzPVwidG9uaWNcIj4nXS5jb25jYXQobm90ZVNlbGVjdCkuY29uY2F0KCc8L3NlbGVjdD48c2VsZWN0IGNsYXNzPVwic2NhbGVcIj4nKS5jb25jYXQoc2NhbGVTZWxlY3QpLmNvbmNhdCgnPC9zZWxlY3Q+Jykuam9pbignJylcblxuXHRcdHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJylcblx0XHR0ZW1wbGF0ZS5pbm5lckhUTUwgPSB0ZW1wbGF0ZUNvbnRlbnRzXG5cblx0XHR2YXIgbGl2ZUhUTUwgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpXG5cdFx0dmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG5cdFx0ZGl2LmFwcGVuZENoaWxkKGxpdmVIVE1MKVxuXG5cdFx0dmFyIHRvbmljU2VsZWN0ID0gZGl2LnF1ZXJ5U2VsZWN0b3IoJ1tjbGFzcz10b25pY10nKVxuXHRcdHZhciBzY2FsZVNlbGVjdCA9IGRpdi5xdWVyeVNlbGVjdG9yKCdbY2xhc3M9c2NhbGVdJylcblxuXHRcdHRvbmljU2VsZWN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdGRpc3BhdGNoRXZlbnQoJ3RvbmljJywgdGhhdCwge3ZhbHVlOiBlLnRhcmdldC52YWx1ZX0pXG5cdFx0fSlcblxuXHRcdHNjYWxlU2VsZWN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdGRpc3BhdGNoRXZlbnQoJ3NjYWxlJywgdGhhdCwge3ZhbHVlOiBlLnRhcmdldC52YWx1ZX0pXG5cdFx0fSlcblxuXHRcdHRoaXMuYXBwZW5kQ2hpbGQoZGl2KVxuXHRcdHRoaXMucmVhZEF0dHJpYnV0ZXMoKVxuXHR9XG5cblx0ZnVuY3Rpb24gZGlzcGF0Y2hFdmVudCh0eXBlLCBlbGVtZW50LCBkZXRhaWwpIHtcblx0XHRkZXRhaWwgPSBkZXRhaWwgfHwge31cblxuXHRcdHZhciBldiA9IG5ldyBDdXN0b21FdmVudCh0eXBlLCB7IGRldGFpbDogZGV0YWlsIH0pXG5cdFx0ZWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2KVxuXHR9XG5cblx0cHJvdG8uYXR0YWNoZWRDYWxsYmFjayA9IGZ1bmN0aW9uKCkge1xuXHR9XG5cblx0cHJvdG8uZGV0YWNoZWRDYWxsYmFjayA9IGZ1bmN0aW9uKCkge1xuXHR9XG5cblx0cHJvdG8ucmVhZEF0dHJpYnV0ZXMgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgdGhhdCA9IHRoaXM7IC8vIHVnaCBkZWZlbnNlXG5cdFx0W10uZm9yRWFjaChmdW5jdGlvbihhdHRyKSB7XG5cdFx0XHR0aGF0LnNldFZhbHVlKGF0dHIsIHRoYXQuZ2V0QXR0cmlidXRlKGF0dHIpKVxuXHRcdH0pXG5cdH1cblxuXHRwcm90by5zZXRWYWx1ZSA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG5cdFx0aWYodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCkge1xuXHRcdFx0dGhpcy52YWx1ZXNbbmFtZV0gPSB2YWx1ZVxuXHRcdFx0dGhpcy5xdWVyeVNlbGVjdG9yKCdbY2xhc3M9JyArIG5hbWUgKyAnXScpLnZhbHVlID0gdmFsdWVcblx0XHR9XG5cdH1cblxuXHRwcm90by5nZXRWYWx1ZSA9IGZ1bmN0aW9uKG5hbWUpIHtcblx0XHRyZXR1cm4gdGhpcy52YWx1ZXNbbmFtZV1cblx0fVxuXG5cdHByb3RvLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayA9IGZ1bmN0aW9uKGF0dHIsIG9sZFZhbHVlLCBuZXdWYWx1ZSwgbmFtZXNwYWNlKSB7XG5cdFx0dGhpcy5zZXRWYWx1ZShhdHRyLCBuZXdWYWx1ZSlcblx0XHR2YXIgZSA9IG5ldyBDdXN0b21FdmVudCgnY2hhbmdlJywge2RldGFpbDogdGhpcy52YWx1ZXN9KVxuXHRcdHRoaXMuZGlzcGF0Y2hFdmVudChlKVxuXHR9XG5cblx0dmFyIGNvbXBvbmVudCA9IHt9XG5cdGNvbXBvbmVudC5wcm90b3R5cGUgPSBwcm90b1xuXHRjb21wb25lbnQucmVnaXN0ZXIgPSBmdW5jdGlvbiAobmFtZSkge1xuXHRcdGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChuYW1lLCB7cHJvdG90eXBlOiBwcm90b30pXG5cdH1cblxuXHRpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcblx0XHRkZWZpbmUoZnVuY3Rpb24gKCkgeyByZXR1cm4gY29tcG9uZW50IH0pXG5cdH0gZWxzZSBpZih0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuXHRcdG1vZHVsZS5leHBvcnRzID0gY29tcG9uZW50XG5cdH0gZWxzZSB7XG5cdFx0Y29tcG9uZW50LnJlZ2lzdGVyKCdvcGVubXVzaWMtd2ViLWNvbXBvbmVudC10ZW1wbGF0ZScpIC8vIGF1dG9tYXRpYyByZWdpc3RyYXRpb25cblx0fVxuXG59KS5jYWxsKHRoaXMpXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHNldHRlckdldHRlcmlmeTtcblxuXG5mdW5jdGlvbiBzZXR0ZXJHZXR0ZXJpZnkob2JqZWN0LCBwcm9wZXJ0aWVzLCBjYWxsYmFja3MpIHtcblx0Y2FsbGJhY2tzID0gY2FsbGJhY2tzIHx8IHt9O1xuXHR2YXIga2V5cyA9IE9iamVjdC5rZXlzKHByb3BlcnRpZXMpO1xuXHRrZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwga2V5LCBtYWtlR2V0dGVyU2V0dGVyKHByb3BlcnRpZXMsIGtleSwgY2FsbGJhY2tzKSk7XG5cdH0pO1xufVxuXG5cbmZ1bmN0aW9uIG1ha2VHZXR0ZXJTZXR0ZXIocHJvcGVydGllcywgcHJvcGVydHksIGNhbGxiYWNrcykge1xuXHR2YXIgYWZ0ZXJTZXR0aW5nID0gY2FsbGJhY2tzLmFmdGVyU2V0dGluZyB8fCBmdW5jdGlvbigpIHt9O1xuXHRyZXR1cm4ge1xuXHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gZ2V0UHJvcGVydHkocHJvcGVydGllcywgcHJvcGVydHkpO1xuXHRcdH0sXG5cdFx0c2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0c2V0UHJvcGVydHkocHJvcGVydGllcywgcHJvcGVydHksIHZhbHVlKTtcblx0XHRcdGFmdGVyU2V0dGluZyhwcm9wZXJ0eSwgdmFsdWUpO1xuXHRcdH0sXG5cdFx0ZW51bWVyYWJsZTogdHJ1ZVxuXHR9O1xufVxuXG5cbmZ1bmN0aW9uIGdldFByb3BlcnR5KHByb3BlcnRpZXMsIG5hbWUpIHtcblx0cmV0dXJuIHByb3BlcnRpZXNbbmFtZV07XG59XG5cblxuZnVuY3Rpb24gc2V0UHJvcGVydHkocHJvcGVydGllcywgbmFtZSwgdmFsdWUpIHtcblx0cHJvcGVydGllc1tuYW1lXSA9IHZhbHVlO1xufVxuXG5cbiIsImZ1bmN0aW9uIHBpY2sgKGFycikge1xuICAvLyBjb25zb2xlLmxvZyhhcnIpXG4gIHJldHVybiBhcnJbfn4oTWF0aC5yYW5kb20oKSAqIGFyci5sZW5ndGgpXVxufVxuXG5mdW5jdGlvbiByb2xsIChwcm9iKSB7XG4gIHJldHVybiBNYXRoLnJhbmRvbSgpIDwgcHJvYlxufVxuXG4vLyBBRERcbi8vIC0gbW9kdWx1c1xuLy8gLSByYW5kb3M/IGZsaXBzaWVzP1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjdXJyZW50U29uZykge1xuICB2YXIgaW50ZXJ2YWwsIGdsb2JhbFRpY2sgPSAwLCBzb25nID0gY3VycmVudFNvbmdcbiAgcmV0dXJuIHtcbiAgICBzdGFydDogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKGludGVydmFsKSB0aHJvdygnd3RmJylcbiAgICAgIGludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICBnbG9iYWxUaWNrKytcbiAgICAgICAgT2JqZWN0LmtleXMoc29uZy5pbnN0cnVtZW50cykuZm9yRWFjaChmdW5jdGlvbiAoaykge1xuICAgICAgICAgIHZhciBpbnN0cnVtZW50ID0gc29uZy5pbnN0cnVtZW50c1trXVxuICAgICAgICAgIHZhciBwYXR0ZXJuID0gaW5zdHJ1bWVudC5wYXR0ZXJuc1tzb25nLmN1cnJlbnRdXG5cbiAgICAgICAgICB2YXIgb25JdHNCZWF0ID0gZ2xvYmFsVGljayAlIChwYXR0ZXJuLm1vZCB8fCAxKSA9PSAwXG5cbiAgICAgICAgICBpZiAob25JdHNCZWF0ICYmIHJvbGwocGF0dGVybi5wcm9ic1twYXR0ZXJuLmN1cnJlbnRWZXJzaW9uXVtwYXR0ZXJuLmN1cnJlbnRUaWNrXSkpIHtcbiAgICAgICAgICAgIGluc3RydW1lbnQucGxheShwYXR0ZXJuLm5vdGVzID8gcGljayhwYXR0ZXJuLm5vdGVzW3BhdHRlcm4uY3VycmVudFZlcnNpb25dW3BhdHRlcm4uY3VycmVudFRpY2tdKSA6IHVuZGVmaW5lZClcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKG9uSXRzQmVhdCkgcGF0dGVybi5jdXJyZW50VGljaysrXG4gICAgICAgICAgaWYgKHBhdHRlcm4uY3VycmVudFRpY2sgPT0gcGF0dGVybi5wcm9ic1twYXR0ZXJuLmN1cnJlbnRWZXJzaW9uXS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHBhdHRlcm4uY3VycmVudFRpY2sgPSAwXG4gICAgICAgICAgICBwYXR0ZXJuLmN1cnJlbnRWZXJzaW9uID0gcGljayhwYXR0ZXJuLm5leHRzW3BhdHRlcm4uY3VycmVudFZlcnNpb25dKVxuICAgICAgICAgICAgaWYgKGluc3RydW1lbnQubGVhZCkge1xuICAgICAgICAgICAgICAvLyBpZiAobmV4dFNvbmcpIHNvbmcgPSBuZXh0U29uZywgbmV4dFNvbmcgPSBudWxsXG4gICAgICAgICAgICAgIHNvbmcuY3VycmVudCA9IHBpY2soc29uZy5uZXh0c1tzb25nLmN1cnJlbnRdKVxuICAgICAgICAgICAgICBpZiAoIXNvbmcuY3VycmVudCkgYWxlcnQoJ2l0IGlzIG92ZXInKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0sIDYwMDAwLjAgLyBzb25nLmJwbSlcbiAgICB9LFxuICAgIHN0b3A6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpXG4gICAgICBpbnRlcnZhbCA9IG51bGxcbiAgICB9LFxuICAgIHVwZGF0ZVNvbmc6IGZ1bmN0aW9uIChuZXdTb25nKSB7XG4gICAgICBzb25nID0gbmV3U29uZ1xuICAgIH1cbiAgfVxufVxuIiwidmFyIGFkc3IgPSByZXF1aXJlKCdhLWQtcy1yJylcbnZhciBtYWtlRGlzdG9ydGlvbkN1cnZlID0gcmVxdWlyZSgnbWFrZS1kaXN0b3J0aW9uLWN1cnZlJylcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGFjLCBvcHRzKSB7XG4gIHZhciBhdWRpb05vZGVzID0ge1xuICAgIG9zYzogYWMuY3JlYXRlT3NjaWxsYXRvcigpLFxuICAgIGdhaW46IGFjLmNyZWF0ZUdhaW4oKSxcbiAgICBkaXN0OiBhYy5jcmVhdGVXYXZlU2hhcGVyKCksXG4gICAgZmlsdGVyOiBhYy5jcmVhdGVCaXF1YWRGaWx0ZXIoKSxcbiAgICBzZXR0aW5nczoge1xuICAgICAgZnJlcTogMjUwLFxuICAgICAgZW5kRnJlcTogMzAsXG4gICAgICBhdHRhY2s6IDAuMDAwMDAwMDAwMDAwMDAwMDAwMDAxLFxuICAgICAgZGVjYXk6IDAuMDAwMDAwMDAwMDAwMDAwMDAwMDAxLFxuICAgICAgc3VzdGFpbjogMC4xMixcbiAgICAgIHJlbGVhc2U6IDAuMTMsXG4gICAgICBwZWFrOiAwLjUsXG4gICAgICBtaWQ6IDAuMzUsXG4gICAgICBlbmQ6IDAuMDAwMDAwMDAwMDAwMDAwMDAwMDAxXG4gICAgfVxuICB9XG5cbiAgYXVkaW9Ob2Rlcy5vc2MuZnJlcXVlbmN5LnNldFZhbHVlQXRUaW1lKDAuMDAwMDAwMDEsIGFjLmN1cnJlbnRUaW1lKVxuICBhdWRpb05vZGVzLm9zYy5zdGFydChhYy5jdXJyZW50VGltZSlcblxuICBhdWRpb05vZGVzLmdhaW4uZ2Fpbi5zZXRWYWx1ZUF0VGltZSgwLjAwMDAwMDAxLCBhYy5jdXJyZW50VGltZSlcblxuICBhdWRpb05vZGVzLmRpc3QuY3VydmUgPSBtYWtlRGlzdG9ydGlvbkN1cnZlKDI1KVxuXG4gIGF1ZGlvTm9kZXMuZmlsdGVyLnR5cGUgPSAnbG93cGFzcydcbiAgYXVkaW9Ob2Rlcy5maWx0ZXIuZnJlcXVlbmN5LnNldFZhbHVlQXRUaW1lKGF1ZGlvTm9kZXMuc2V0dGluZ3MuZnJlcSAqIDMuNSwgYWMuY3VycmVudFRpbWUpXG5cbiAgYXVkaW9Ob2Rlcy5vc2MuY29ubmVjdChhdWRpb05vZGVzLmdhaW4pXG4gIGF1ZGlvTm9kZXMuZ2Fpbi5jb25uZWN0KGF1ZGlvTm9kZXMuZGlzdClcbiAgYXVkaW9Ob2Rlcy5kaXN0LmNvbm5lY3QoYXVkaW9Ob2Rlcy5maWx0ZXIpXG5cbiAgcmV0dXJuIHtcbiAgICBjb25uZWN0OiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgIGF1ZGlvTm9kZXMuZmlsdGVyLmNvbm5lY3QoaW5wdXQpXG4gICAgfSxcbiAgICBzdGFydDogZnVuY3Rpb24gKHdoZW4pIHtcbiAgICAgIGF1ZGlvTm9kZXMub3NjLmZyZXF1ZW5jeS5zZXRWYWx1ZUF0VGltZShhdWRpb05vZGVzLnNldHRpbmdzLmZyZXEsIHdoZW4pXG4gICAgICBhdWRpb05vZGVzLm9zYy5mcmVxdWVuY3kuZXhwb25lbnRpYWxSYW1wVG9WYWx1ZUF0VGltZShhdWRpb05vZGVzLnNldHRpbmdzLmVuZEZyZXEsIHdoZW4gKyBhdWRpb05vZGVzLnNldHRpbmdzLmF0dGFjayArIGF1ZGlvTm9kZXMuc2V0dGluZ3MuZGVjYXkgKyBhdWRpb05vZGVzLnNldHRpbmdzLnN1c3RhaW4gKyBhdWRpb05vZGVzLnNldHRpbmdzLnJlbGVhc2UpXG4gICAgICBhZHNyKGF1ZGlvTm9kZXMuZ2Fpbiwgd2hlbiwgYXVkaW9Ob2Rlcy5zZXR0aW5ncylcbiAgICB9LFxuICAgIHN0b3A6IGZ1bmN0aW9uICh3aGVuKSB7XG4gICAgICBhdWRpb05vZGVzLnNvdXJjZS5zdG9wKHdoZW4pXG4gICAgfSxcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgICBPYmplY3Qua2V5cyhvcHRzKS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7XG4gICAgICAgIGF1ZGlvTm9kZXMuc2V0dGluZ3Nba10gPSBvcHRzW2tdXG4gICAgICB9KVxuICAgIH0sXG4gICAgbm9kZXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBhdWRpb05vZGVzXG4gICAgfVxuICB9XG59IiwidmFyIG1pZGlub3RlID0gcmVxdWlyZSgnbWlkaS1ub3RlJylcbnZhciB1bmlxID0gcmVxdWlyZSgnbG9kYXNoLnVuaXEnKVxudmFyIGZsYXR0ZW4gPSByZXF1aXJlKCdsb2Rhc2guZmxhdHRlbicpXG52YXIgY2h1bmsgPSByZXF1aXJlKCdsb2Rhc2guY2h1bmsnKVxudmFyIGtleSA9IHJlcXVpcmUoJ211c2ljLWtleScpXG52YXIgZmlsbCA9IHJlcXVpcmUoJ2xvZGFzaC5maWxsJylcblxuXG5mdW5jdGlvbiBnZXRTZWN0aW9ucyAodGFiRGF0YSkge1xuICAvLyBnb3NoLCB0aGlzIGlzIHByb2JhYmx5IGdvbm5hIGJlIGEgdG90YWwgbWVzcywgaHVoP1xuICB2YXIgbGluZXMgPSB0YWJEYXRhLnNwbGl0KC9cXG4vKVxuICB2YXIgc2VjdGlvbnMgPSBbXVxuICB2YXIgY3VycmVudCA9IFtdXG4gIGxpbmVzLmZvckVhY2goZnVuY3Rpb24gKGxpbmUpIHtcbiAgICAvLyBjb25zb2xlLmxvZyhsaW5lKVxuICAgIC8vIHJlZ2V4IGZyb206IGh0dHA6Ly9rbm93bGVzLmNvLnphL3BhcnNpbmctZ3VpdGFyLXRhYi9cbiAgICB2YXIgcGF0dCA9IC8oW0EtR2EtZ117MCwxfVsjYl17MCwxfSlbXFx8XFxdXXswLDF9KFtcXC0wLTlcXHxcXC9cXF5cXChcXClcXFxcaGJwdl0rKS87XG4gICAgaWYgKGxpbmUubWF0Y2gocGF0dCkpIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKGxpbmUpXG4gICAgICBjdXJyZW50LnB1c2gobGluZSlcbiAgICAgIGlmIChjdXJyZW50Lmxlbmd0aCA9PSA2KSB7XG4gICAgICAgIHNlY3Rpb25zLnB1c2goY3VycmVudClcbiAgICAgICAgY3VycmVudCA9IFtdXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChjdXJyZW50Lmxlbmd0aCA9PSA0KSBzZWN0aW9ucy5wdXNoKGN1cnJlbnQpIC8vIHNob3VsZCBjYXRjaCBiYXNzIHRhYnMgaSBndWVzcz9cbiAgICAgIGN1cnJlbnQgPSBbXVxuICAgIH1cbiAgfSlcbiAgLy8gY29uc29sZS5sb2coc2VjdGlvbnMpXG4gIHJldHVybiBzZWN0aW9uc1xufVxuXG52YXIgTUlESV9OT1RFUyA9IFs0MCwgNDUsIDUwLCA1NSwgNTksIDY0XSAvLyBtYXliZSBlYXNpZXIgdG8ga2VlcCB0aGlzIGFsbCBpbiBtaWRpLW5vdGUgbGFuZD9cbmZ1bmN0aW9uIHJlcGxhY2VOb3RlcyAoc2VjdGlvbikge1xuICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShzZWN0aW9uKSkucmV2ZXJzZSgpLm1hcChmdW5jdGlvbiAobGluZSwgaSkge1xuICAgIHZhciByb290ID0gTUlESV9OT1RFU1tpXVxuICAgIHZhciBub3RlcyA9IGxpbmUucmVwbGFjZSgvW15cXGQtXS9nLCAnJykuc3BsaXQoJycpXG4gICAgcmV0dXJuIG5vdGVzLm1hcChmdW5jdGlvbiAobm90ZSkge1xuICAgICAgcmV0dXJuIG5vdGUgIT09ICctJyA/IHJvb3QgKyB+fm5vdGUgOiAnJ1xuICAgIH0pXG4gIH0pLnJldmVyc2UoKVxufVxuXG5mdW5jdGlvbiBnZXRLZXkgKHNlY3Rpb24pIHtcbiAgdmFyIG5vdGVzID0gc2VjdGlvbi5tYXAoZnVuY3Rpb24gKHJvdykge1xuICAgIHJldHVybiByb3cuZmlsdGVyKGZ1bmN0aW9uIChlKSB7cmV0dXJuIGV9KS5tYXAoZnVuY3Rpb24gKG5vdGUpIHtcbiAgICAgIHJldHVybiBtaWRpbm90ZShub3RlKS5yZXBsYWNlKC9cXGQrJC9nLCAnJylcbiAgICB9KVxuICB9KVxuICAvLyBjb25zb2xlLmxvZygnbm90ZXMnLG5vdGVzKVxuICB2YXIgYWNjaWRlbnRhbHMgPSB1bmlxKGZsYXR0ZW4obm90ZXMpKS5tYXAoZnVuY3Rpb24gKG5vdGUpIHtcbiAgICByZXR1cm4gbm90ZS5yZXBsYWNlKC9eXFx3LywgJycpXG4gIH0pLmZpbHRlcihmdW5jdGlvbiAoZSkge3JldHVybiBlfSlcbiAgLy8gY29uc29sZS5sb2coa2V5KGFjY2lkZW50YWxzLmpvaW4oJycpKSlcbiAgcmV0dXJuIGtleShhY2NpZGVudGFscy5qb2luKCcnKSkgfHwgXCJDXCJcbn1cblxuZnVuY3Rpb24gZ2V0TWlkZGxlIChzZWN0aW9uKSB7XG4gIHZhciBhbGxUaGVOb3Rlc0FsbExpbmVkVXAgPSB1bmlxKGZsYXR0ZW4oc2VjdGlvbikuZmlsdGVyKGZ1bmN0aW9uIChlKSB7cmV0dXJuIGV9KSkuc29ydCgpXG4gIC8vIGNvbnNvbGUubG9nKCdhbGx0aGVtJywgYWxsVGhlTm90ZXNBbGxMaW5lZFVwKVxuICByZXR1cm4gYWxsVGhlTm90ZXNBbGxMaW5lZFVwW35+KGFsbFRoZU5vdGVzQWxsTGluZWRVcC5sZW5ndGggLyAyKV1cbn1cblxuZnVuY3Rpb24gZ2V0Um9vdE5vdGVOdW1iZXIgKG1pZGRsZSwgdGFyZ2V0KSB7XG4gIC8vIGNvbnNvbGUubG9nKCdnZXRSb290JywgbWlkZGxlLCB0YXJnZXQpXG4gIC8vIGNvbnNvbGUubG9nKG1pZGlub3RlKG1pZGRsZSkpXG4gIGlmIChtaWRpbm90ZShtaWRkbGUpICYmIG1pZGlub3RlKG1pZGRsZSkucmVwbGFjZSgvXFxkKy8sICcnKSA9PSB0YXJnZXQpIHtcbiAgICByZXR1cm4gbWlkZGxlXG4gIH0gZWxzZSB7XG4gICAgdmFyIGkgPSAxXG4gICAgdmFyIHRoZVJvb3RcbiAgICB3aGlsZSAoaSA8PSAxMikge1xuICAgICAgLy8gY29uc29sZS5sb2cobWlkaW5vdGUobWlkZGxlICsgaSksIG1pZGlub3RlKG1pZGRsZSAtIGkpKVxuICAgICAgaWYgKG1pZGlub3RlKG1pZGRsZSArIGkpLnJlcGxhY2UoL1xcZCsvLCAnJykgPT0gdGFyZ2V0KSB7XG4gICAgICAgIHRoZVJvb3QgPSBtaWRkbGUgKyBpXG4gICAgICAgIGJyZWFrO1xuICAgICAgfSBlbHNlIGlmIChtaWRpbm90ZShtaWRkbGUgLSBpKS5yZXBsYWNlKC9cXGQrLywgJycpID09IHRhcmdldCkge1xuICAgICAgICB0aGVSb290ID0gbWlkZGxlIC0gaVxuICAgICAgICBicmVhaztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGkrK1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhpKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhlUm9vdFxuICB9XG59XG5mdW5jdGlvbiBjb252ZXJ0Tm90ZXNUb0luZGljZXMgKG5vdGVzLCBiZWF0cywgcm9vdE5vdGUpIHtcbiAgLy8gY29udmVydHMgZ3VpdGFyIHN0cmluZ3Mgd29ydGggb2Ygbm90ZXMgaW50byBpbmRleGVzIGFuZCBzdHVmZlxuICB2YXIgZGl2aXNvciA9IH5+KG5vdGVzWzBdLmxlbmd0aCAvIGJlYXRzKVxuICB2YXIgcm9vdCA9IG1pZGlub3RlKHJvb3ROb3RlKVxuICAvLyBjb25zb2xlLmxvZyhyb290KVxuICAvLyAuLi4gbWF5YmUsIGdldCB0aGUgc2NhbGU/XG4gIHJldHVybiBub3Rlcy5tYXAoZnVuY3Rpb24gKHJvdykge1xuICAgIHJldHVybiBjaHVuayhyb3csIGRpdmlzb3IpLm1hcChmdW5jdGlvbiAocGFydCkge1xuICAgICAgcmV0dXJuIHBhcnQuZmlsdGVyKGZ1bmN0aW9uIChuKSB7cmV0dXJuIG59KS5tYXAoZnVuY3Rpb24gKG5vdGUpIHtcblxuICAgICAgICB2YXIgbXVsdGlwbGllciA9IG5vdGUgPiByb290Tm90ZSA/IDEgOiAtMVxuICAgICAgICB2YXIgb2N0YXZlZCA9IE1hdGguYWJzKG5vdGUgLSByb290Tm90ZSkgPj0gMTIgPyA3IDogMVxuICAgICAgICB2YXIgZGlmZiA9IE1hdGguYWJzKG1pZGlub3RlKG5vdGUpLmNoYXJDb2RlQXQoMCkgLSByb290LmNoYXJDb2RlQXQoMCkpXG4gICAgICAgIC8vIGlmICh0eXBlb2YgKGRpZmYgKiBtdWx0aXBsaWVyICogb2N0YXZlZCkgIT09ICdudW1iZXInKSBjb25zb2xlLmxvZyhtdWx0aXBsaWVyLCBvY3RhdmVkLCBkaWZmLCBub3RlLCByb290LCBtaWRpbm90ZShub3RlKSlcbiAgICAgICAgcmV0dXJuIGRpZmYgKiBtdWx0aXBsaWVyICogb2N0YXZlZFxuICAgICAgfSlcbiAgICB9KVxuICB9KS5yZWR1Y2UoZnVuY3Rpb24gKHJlc3VsdCwgcm93KSB7XG4gICAgcmV0dXJuIHJlc3VsdC5tYXAoZnVuY3Rpb24gKHNlY3Rpb24sIGkpIHtcbiAgICAgIHJldHVybiBzZWN0aW9uLmNvbmNhdChyb3dbaV0pXG4gICAgfSlcbiAgfSwgZmlsbChBcnJheShiZWF0cyksIFtdKSlcbn1cblxuZnVuY3Rpb24gcHJvY2Vzc1RhYiAodGFiLCBiZWF0cykge1xuICAvLyBjb25zb2xlLmxvZyh0YWIpXG4gIC8vIGNvbnNvbGUubG9nKGdldFNlY3Rpb25zKHRhYikpXG4gIHZhciBub3RlcyA9IGdldFNlY3Rpb25zKHRhYikubWFwKGZ1bmN0aW9uIChzZWN0aW9uKSB7XG4gICAgLy8gY29uc29sZS5sb2coc2VjdGlvbilcbiAgICByZXR1cm4gcmVwbGFjZU5vdGVzKHNlY3Rpb24pXG4gIH0pXG4gIC8vIHNvbWV0aGluZyBib3JrZWQgaGVyZVxuICAvLyBjb25zb2xlLmxvZyhub3RlcylcbiAgdmFyIGFsbFRoZU5vdGVzID0gbm90ZXMucmVkdWNlKGZ1bmN0aW9uIChhLCBiKSB7cmV0dXJuIGEuY29uY2F0KGIpfSwgW10pXG4gIC8vIGNvbnNvbGUubG9nKHJvb3QpXG4gIC8vIGNvbnNvbGUubG9nKGdldEtleShhbGxUaGVOb3RlcykpXG4gIHZhciByb290ID0gZ2V0Um9vdE5vdGVOdW1iZXIoZ2V0TWlkZGxlKGFsbFRoZU5vdGVzKSwgZ2V0S2V5KGFsbFRoZU5vdGVzKS5yZXBsYWNlKC9cXHNcXHcrLywgJycpKVxuICByZXR1cm4gbm90ZXMubWFwKGZ1bmN0aW9uIChzZWN0aW9uKSB7XG4gICAgcmV0dXJuIGNvbnZlcnROb3Rlc1RvSW5kaWNlcyhzZWN0aW9uLCBiZWF0cywgcm9vdClcbiAgfSlcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGdldFNlY3Rpb25zOiBnZXRTZWN0aW9ucyxcbiAgcmVwbGFjZU5vdGVzOiByZXBsYWNlTm90ZXMsXG4gIGdldEtleTogZ2V0S2V5LFxuICBnZXRNaWRkbGU6IGdldE1pZGRsZSxcbiAgZ2V0Um9vdE5vdGVOdW1iZXI6IGdldFJvb3ROb3RlTnVtYmVyLFxuICBjb252ZXJ0Tm90ZXNUb0luZGljZXM6IGNvbnZlcnROb3Rlc1RvSW5kaWNlcyxcbiAgcHJvY2Vzc1RhYjogcHJvY2Vzc1RhYlxuICAvLyBjb252ZXJ0Tm90ZXNUb01pZGk6IGNvbnZlcnROb3Rlc1RvTWlkaVxufVxuXG5cbiJdfQ==
