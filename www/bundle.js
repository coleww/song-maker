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
require('document-register-element')
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

document.body.addEventListener('paste', doit);

document.getElementById('theinput').addEventListener('paste', doit)









function doit (e){

  if (sq) {
    sq.stop()
    the_ui.remove()
} else {
       document.getElementById('notes').remove()
       var iframe = document.createElement('div')
       iframe.innerHTML = '<img src="kitty.gif" style="width: 100%; height: 100%;">'

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
coolSlider.min = 100
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
}
},{"./demoSong":2,"./processtab":45,"dj-snazzy-snare":4,"document-register-element":5,"int2freq":6,"merge":17,"openmusic-slider":36,"pick-random":37,"pie-ano":38,"really-hi-hat":39,"scale-select":41,"spiderbite":43,"touch-down-dance":44}],2:[function(require,module,exports){
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
  bpm: 200,
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

},{"a-d-s-r":3,"make-distortion-curve":16}],5:[function(require,module,exports){
/*! (C) WebReflection Mit Style License */
(function(e,t,n,r){"use strict";function rt(e,t){for(var n=0,r=e.length;n<r;n++)vt(e[n],t)}function it(e){for(var t=0,n=e.length,r;t<n;t++)r=e[t],nt(r,b[ot(r)])}function st(e){return function(t){j(t)&&(vt(t,e),rt(t.querySelectorAll(w),e))}}function ot(e){var t=e.getAttribute("is"),n=e.nodeName.toUpperCase(),r=S.call(y,t?v+t.toUpperCase():d+n);return t&&-1<r&&!ut(n,t)?-1:r}function ut(e,t){return-1<w.indexOf(e+'[is="'+t+'"]')}function at(e){var t=e.currentTarget,n=e.attrChange,r=e.attrName,i=e.target;Q&&(!i||i===t)&&t.attributeChangedCallback&&r!=="style"&&e.prevValue!==e.newValue&&t.attributeChangedCallback(r,n===e[a]?null:e.prevValue,n===e[l]?null:e.newValue)}function ft(e){var t=st(e);return function(e){X.push(t,e.target)}}function lt(e){K&&(K=!1,e.currentTarget.removeEventListener(h,lt)),rt((e.target||t).querySelectorAll(w),e.detail===o?o:s),B&&pt()}function ct(e,t){var n=this;q.call(n,e,t),G.call(n,{target:n})}function ht(e,t){D(e,t),et?et.observe(e,z):(J&&(e.setAttribute=ct,e[i]=Z(e),e.addEventListener(p,G)),e.addEventListener(c,at)),e.createdCallback&&Q&&(e.created=!0,e.createdCallback(),e.created=!1)}function pt(){for(var e,t=0,n=F.length;t<n;t++)e=F[t],E.contains(e)||(n--,F.splice(t--,1),vt(e,o))}function dt(e){throw new Error("A "+e+" type is already registered")}function vt(e,t){var n,r=ot(e);-1<r&&(tt(e,b[r]),r=0,t===s&&!e[s]?(e[o]=!1,e[s]=!0,r=1,B&&S.call(F,e)<0&&F.push(e)):t===o&&!e[o]&&(e[s]=!1,e[o]=!0,r=1),r&&(n=e[t+"Callback"])&&n.call(e))}if(r in t)return;var i="__"+r+(Math.random()*1e5>>0),s="attached",o="detached",u="extends",a="ADDITION",f="MODIFICATION",l="REMOVAL",c="DOMAttrModified",h="DOMContentLoaded",p="DOMSubtreeModified",d="<",v="=",m=/^[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+$/,g=["ANNOTATION-XML","COLOR-PROFILE","FONT-FACE","FONT-FACE-SRC","FONT-FACE-URI","FONT-FACE-FORMAT","FONT-FACE-NAME","MISSING-GLYPH"],y=[],b=[],w="",E=t.documentElement,S=y.indexOf||function(e){for(var t=this.length;t--&&this[t]!==e;);return t},x=n.prototype,T=x.hasOwnProperty,N=x.isPrototypeOf,C=n.defineProperty,k=n.getOwnPropertyDescriptor,L=n.getOwnPropertyNames,A=n.getPrototypeOf,O=n.setPrototypeOf,M=!!n.__proto__,_=n.create||function mt(e){return e?(mt.prototype=e,new mt):this},D=O||(M?function(e,t){return e.__proto__=t,e}:L&&k?function(){function e(e,t){for(var n,r=L(t),i=0,s=r.length;i<s;i++)n=r[i],T.call(e,n)||C(e,n,k(t,n))}return function(t,n){do e(t,n);while((n=A(n))&&!N.call(n,t));return t}}():function(e,t){for(var n in t)e[n]=t[n];return e}),P=e.MutationObserver||e.WebKitMutationObserver,H=(e.HTMLElement||e.Element||e.Node).prototype,B=!N.call(H,E),j=B?function(e){return e.nodeType===1}:function(e){return N.call(H,e)},F=B&&[],I=H.cloneNode,q=H.setAttribute,R=H.removeAttribute,U=t.createElement,z=P&&{attributes:!0,characterData:!0,attributeOldValue:!0},W=P||function(e){J=!1,E.removeEventListener(c,W)},X,V=e.requestAnimationFrame||e.webkitRequestAnimationFrame||e.mozRequestAnimationFrame||e.msRequestAnimationFrame||function(e){setTimeout(e,10)},$=!1,J=!0,K=!0,Q=!0,G,Y,Z,et,tt,nt;O||M?(tt=function(e,t){N.call(t,e)||ht(e,t)},nt=ht):(tt=function(e,t){e[i]||(e[i]=n(!0),ht(e,t))},nt=tt),B?(J=!1,function(){var e=k(H,"addEventListener"),t=e.value,n=function(e){var t=new CustomEvent(c,{bubbles:!0});t.attrName=e,t.prevValue=this.getAttribute(e),t.newValue=null,t[l]=t.attrChange=2,R.call(this,e),this.dispatchEvent(t)},r=function(e,t){var n=this.hasAttribute(e),r=n&&this.getAttribute(e),i=new CustomEvent(c,{bubbles:!0});q.call(this,e,t),i.attrName=e,i.prevValue=n?r:null,i.newValue=t,n?i[f]=i.attrChange=1:i[a]=i.attrChange=0,this.dispatchEvent(i)},s=function(e){var t=e.currentTarget,n=t[i],r=e.propertyName,s;n.hasOwnProperty(r)&&(n=n[r],s=new CustomEvent(c,{bubbles:!0}),s.attrName=n.name,s.prevValue=n.value||null,s.newValue=n.value=t[r]||null,s.prevValue==null?s[a]=s.attrChange=0:s[f]=s.attrChange=1,t.dispatchEvent(s))};e.value=function(e,o,u){e===c&&this.attributeChangedCallback&&this.setAttribute!==r&&(this[i]={className:{name:"class",value:this.className}},this.setAttribute=r,this.removeAttribute=n,t.call(this,"propertychange",s)),t.call(this,e,o,u)},C(H,"addEventListener",e)}()):P||(E.addEventListener(c,W),E.setAttribute(i,1),E.removeAttribute(i),J&&(G=function(e){var t=this,n,r,s;if(t===e.target){n=t[i],t[i]=r=Z(t);for(s in r){if(!(s in n))return Y(0,t,s,n[s],r[s],a);if(r[s]!==n[s])return Y(1,t,s,n[s],r[s],f)}for(s in n)if(!(s in r))return Y(2,t,s,n[s],r[s],l)}},Y=function(e,t,n,r,i,s){var o={attrChange:e,currentTarget:t,attrName:n,prevValue:r,newValue:i};o[s]=e,at(o)},Z=function(e){for(var t,n,r={},i=e.attributes,s=0,o=i.length;s<o;s++)t=i[s],n=t.name,n!=="setAttribute"&&(r[n]=t.value);return r})),t[r]=function(n,r){c=n.toUpperCase(),$||($=!0,P?(et=function(e,t){function n(e,t){for(var n=0,r=e.length;n<r;t(e[n++]));}return new P(function(r){for(var i,s,o,u=0,a=r.length;u<a;u++)i=r[u],i.type==="childList"?(n(i.addedNodes,e),n(i.removedNodes,t)):(s=i.target,Q&&s.attributeChangedCallback&&i.attributeName!=="style"&&(o=s.getAttribute(i.attributeName),o!==i.oldValue&&s.attributeChangedCallback(i.attributeName,i.oldValue,o)))})}(st(s),st(o)),et.observe(t,{childList:!0,subtree:!0})):(X=[],V(function E(){while(X.length)X.shift().call(null,X.shift());V(E)}),t.addEventListener("DOMNodeInserted",ft(s)),t.addEventListener("DOMNodeRemoved",ft(o))),t.addEventListener(h,lt),t.addEventListener("readystatechange",lt),t.createElement=function(e,n){var r=U.apply(t,arguments),i=""+e,s=S.call(y,(n?v:d)+(n||i).toUpperCase()),o=-1<s;return n&&(r.setAttribute("is",n=n.toLowerCase()),o&&(o=ut(i.toUpperCase(),n))),Q=!t.createElement.innerHTMLHelper,o&&nt(r,b[s]),r},H.cloneNode=function(e){var t=I.call(this,!!e),n=ot(t);return-1<n&&nt(t,b[n]),e&&it(t.querySelectorAll(w)),t}),-2<S.call(y,v+c)+S.call(y,d+c)&&dt(n);if(!m.test(c)||-1<S.call(g,c))throw new Error("The type "+n+" is invalid");var i=function(){return f?t.createElement(l,c):t.createElement(l)},a=r||x,f=T.call(a,u),l=f?r[u].toUpperCase():c,c,p;return f&&-1<S.call(y,d+l)&&dt(l),p=y.push((f?v:d)+c)-1,w=w.concat(w.length?",":"",f?l+'[is="'+n.toLowerCase()+'"]':l),i.prototype=b[p]=T.call(a,"prototype")?a.prototype:_(H),rt(t.querySelectorAll(w),s),i}})(window,document,Object,"registerElement");
},{}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{"lodash._createset":10,"lodash._setcache":11}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{"lodash._baseslice":8}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

},{"lodash._baseflatten":7}],15:[function(require,module,exports){
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

},{"lodash._baseuniq":9}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
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
},{}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
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


},{}],20:[function(require,module,exports){
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

},{"music-notation/interval/parse":24,"music-notation/note/parse":28,"music-notation/note/str":30,"note-interval":34,"note-transposer":35}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
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

},{}],23:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
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

},{"../array/from-props":22,"../memoize":27,"./regex":25}],25:[function(require,module,exports){

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

},{}],26:[function(require,module,exports){
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

},{"../array/to-props":23}],27:[function(require,module,exports){
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

},{}],28:[function(require,module,exports){
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

},{"../memoize":27,"./regex":29}],29:[function(require,module,exports){
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

},{}],30:[function(require,module,exports){
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

},{"../accidentals/str":21,"../array/to-props":23}],31:[function(require,module,exports){
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

},{}],32:[function(require,module,exports){
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

},{"../interval/parse":24,"../note/parse":28}],33:[function(require,module,exports){
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

},{"../interval/str":26,"../note/str":30}],34:[function(require,module,exports){
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

},{"music-notation/operation":31,"music-notation/pitch/parse":32,"music-notation/pitch/str":33}],35:[function(require,module,exports){
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

},{"music-notation/operation":31,"music-notation/pitch/parse":32,"music-notation/pitch/str":33}],36:[function(require,module,exports){
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



},{"safe-register-element":40,"setter-getterify":42}],37:[function(require,module,exports){
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

},{}],38:[function(require,module,exports){
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
},{"a-d-s-r":3,"make-distortion-curve":16,"midiutils":19}],39:[function(require,module,exports){
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
},{"a-d-s-r":3,"make-distortion-curve":16}],40:[function(require,module,exports){
module.exports = function safeRegistration(name, prototype) {
	try {
		document.registerElement(name, {
			prototype: prototype
		});
	} catch(e) {
		console.log('Exception when registering ' + name + '; perhaps it has been registered already?');
	}
};

},{}],41:[function(require,module,exports){
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

},{}],42:[function(require,module,exports){
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



},{}],43:[function(require,module,exports){
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

},{}],44:[function(require,module,exports){
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
},{"a-d-s-r":3,"make-distortion-curve":16}],45:[function(require,module,exports){
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



},{"lodash.chunk":12,"lodash.fill":13,"lodash.flatten":14,"lodash.uniq":15,"midi-note":18,"music-key":20}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vLmpzIiwiZGVtb1NvbmcuanNvbiIsIm5vZGVfbW9kdWxlcy9hLWQtcy1yL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2RqLXNuYXp6eS1zbmFyZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kb2N1bWVudC1yZWdpc3Rlci1lbGVtZW50L2J1aWxkL2RvY3VtZW50LXJlZ2lzdGVyLWVsZW1lbnQuanMiLCJub2RlX21vZHVsZXMvaW50MmZyZXEvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLl9iYXNlZmxhdHRlbi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2guX2Jhc2VzbGljZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2guX2Jhc2V1bmlxL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC5fY3JlYXRlc2V0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC5fc2V0Y2FjaGUvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmNodW5rL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC5maWxsL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC5mbGF0dGVuL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC51bmlxL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL21ha2UtZGlzdG9ydGlvbi1jdXJ2ZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9tZXJnZS9tZXJnZS5qcyIsIm5vZGVfbW9kdWxlcy9taWRpLW5vdGUvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbWlkaXV0aWxzL3NyYy9NSURJVXRpbHMuanMiLCJub2RlX21vZHVsZXMvbXVzaWMta2V5L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL211c2ljLW5vdGF0aW9uL2FjY2lkZW50YWxzL3N0ci5qcyIsIm5vZGVfbW9kdWxlcy9tdXNpYy1ub3RhdGlvbi9hcnJheS9mcm9tLXByb3BzLmpzIiwibm9kZV9tb2R1bGVzL211c2ljLW5vdGF0aW9uL2FycmF5L3RvLXByb3BzLmpzIiwibm9kZV9tb2R1bGVzL211c2ljLW5vdGF0aW9uL2ludGVydmFsL3BhcnNlLmpzIiwibm9kZV9tb2R1bGVzL211c2ljLW5vdGF0aW9uL2ludGVydmFsL3JlZ2V4LmpzIiwibm9kZV9tb2R1bGVzL211c2ljLW5vdGF0aW9uL2ludGVydmFsL3N0ci5qcyIsIm5vZGVfbW9kdWxlcy9tdXNpYy1ub3RhdGlvbi9tZW1vaXplLmpzIiwibm9kZV9tb2R1bGVzL211c2ljLW5vdGF0aW9uL25vdGUvcGFyc2UuanMiLCJub2RlX21vZHVsZXMvbXVzaWMtbm90YXRpb24vbm90ZS9yZWdleC5qcyIsIm5vZGVfbW9kdWxlcy9tdXNpYy1ub3RhdGlvbi9ub3RlL3N0ci5qcyIsIm5vZGVfbW9kdWxlcy9tdXNpYy1ub3RhdGlvbi9vcGVyYXRpb24uanMiLCJub2RlX21vZHVsZXMvbXVzaWMtbm90YXRpb24vcGl0Y2gvcGFyc2UuanMiLCJub2RlX21vZHVsZXMvbXVzaWMtbm90YXRpb24vcGl0Y2gvc3RyLmpzIiwibm9kZV9tb2R1bGVzL25vdGUtaW50ZXJ2YWwvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbm90ZS10cmFuc3Bvc2VyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL29wZW5tdXNpYy1zbGlkZXIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcGljay1yYW5kb20vaW5kZXguanMiLCJub2RlX21vZHVsZXMvcGllLWFuby9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9yZWFsbHktaGktaGF0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3NhZmUtcmVnaXN0ZXItZWxlbWVudC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9zY2FsZS1zZWxlY3QvaW5kZXguanMiLCJub2RlX21vZHVsZXMvc2V0dGVyLWdldHRlcmlmeS9tYWluLmpzIiwibm9kZV9tb2R1bGVzL3NwaWRlcmJpdGUvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdG91Y2gtZG93bi1kYW5jZS9pbmRleC5qcyIsInByb2Nlc3N0YWIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SEE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDL01BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNwUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM1a0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5YkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMWdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDak1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgcHJvYyA9IHJlcXVpcmUoJy4vcHJvY2Vzc3RhYicpXG53aW5kb3cuQXVkaW9Db250ZXh0ID0gd2luZG93LkF1ZGlvQ29udGV4dCB8fCB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0XG52YXIgYWMgPSBuZXcgQXVkaW9Db250ZXh0KClcbnZhciBwaWUgPSByZXF1aXJlKFwicGllLWFub1wiKVxuLy8gdmFyIHVpID0gcmVxdWlyZSgnd2ViLWF1ZGlvLXVpJykuZ2VuZXJhdGVcbiAgdmFyIG1haW5Wb2x1bWUgPSBhYy5jcmVhdGVHYWluKClcbiAgbWFpblZvbHVtZS5jb25uZWN0KGFjLmRlc3RpbmF0aW9uKVxuICBtYWluVm9sdW1lLmdhaW4uc2V0VmFsdWVBdFRpbWUoMC41LCBhYy5jdXJyZW50VGltZSlcbnZhciBzeW50aHMgPSB7XG4gICAgICBzbmFyZTogcmVxdWlyZShcImRqLXNuYXp6eS1zbmFyZVwiKShhYyksXG4gICAga2ljazogcmVxdWlyZShcInRvdWNoLWRvd24tZGFuY2VcIikoYWMpLFxuICAgIGhhdDogcmVxdWlyZShcInJlYWxseS1oaS1oYXRcIikoYWMpLFxuICBiYjogcGllKGFjKSxcbiAgcHA6IHBpZShhYyksXG4gIHNtOiBwaWUoYWMpXG59XG5yZXF1aXJlKCdkb2N1bWVudC1yZWdpc3Rlci1lbGVtZW50JylcbnJlcXVpcmUoJ3NjYWxlLXNlbGVjdCcpLnJlZ2lzdGVyKCdzY2FsZS1zZWxlY3QnKTtcblxucmVxdWlyZSgnb3Blbm11c2ljLXNsaWRlcicpLnJlZ2lzdGVyKCdvcGVubXVzaWMtc2xpZGVyJyk7XG5cblxuXG5cbk9iamVjdC5rZXlzKHN5bnRocykuZm9yRWFjaChmdW5jdGlvbihpaykge1xuICAgICAgc3ludGhzW2lrXS5jb25uZWN0KG1haW5Wb2x1bWUpXG4gICAgICAvLyB2YXIgdGhlX25vZGVzID0gc3ludGhzW2lrXS5ub2RlcygpXG5cbiAgICAgIC8vIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgLy8gY29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnaW5saW5lLWJsb2NrJ1xuICAgICAgLy8gY29udGFpbmVyLnN0eWxlLnZlcnRpY2FsQWxpZ24gPSAndG9wJ1xuICAgICAgLy8gT2JqZWN0LmtleXModGhlX25vZGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAvLyAgIHZhciBlbCA9IHVpKHRoZV9ub2Rlc1tub2RlXSlcbiAgICAgIC8vICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGVsKVxuICAgICAgLy8gfSlcbiAgICAgIC8vICAgdGhlX3VpLmFwcGVuZENoaWxkKGNvbnRhaW5lcilcbiAgICB9KVxudmFyIHNlcSA9IHJlcXVpcmUoXCJzcGlkZXJiaXRlXCIpXG5cblxudmFyIHRoZV9zb25nID0gcmVxdWlyZSgnLi9kZW1vU29uZycpXG52YXIgcGljayA9IHJlcXVpcmUoJ3BpY2stcmFuZG9tJylcbnZhciBtZXJnZSA9IHJlcXVpcmUoJ21lcmdlJylcbnZhciBpbnQyZnJlcSA9IHJlcXVpcmUoJ2ludDJmcmVxJylcblxudmFyIHNxLCB0aGVfdWlcblxuZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdwYXN0ZScsIGRvaXQpO1xuXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGhlaW5wdXQnKS5hZGRFdmVudExpc3RlbmVyKCdwYXN0ZScsIGRvaXQpXG5cblxuXG5cblxuXG5cblxuXG5mdW5jdGlvbiBkb2l0IChlKXtcblxuICBpZiAoc3EpIHtcbiAgICBzcS5zdG9wKClcbiAgICB0aGVfdWkucmVtb3ZlKClcbn0gZWxzZSB7XG4gICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25vdGVzJykucmVtb3ZlKClcbiAgICAgICB2YXIgaWZyYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgICBpZnJhbWUuaW5uZXJIVE1MID0gJzxpbWcgc3JjPVwia2l0dHkuZ2lmXCIgc3R5bGU9XCJ3aWR0aDogMTAwJTsgaGVpZ2h0OiAxMDAlO1wiPidcblxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChpZnJhbWUpXG59XG5cbiAgdmFyIHNvbmcgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRoZV9zb25nKSlcblxuXG5cblxuXG5cblxuICB2YXIgZGF0YSA9IGUuY2xpcGJvYXJkRGF0YS5nZXREYXRhKCd0ZXh0L3BsYWluJyk7XG4gIHRyeSB7XG5cblxuXG5cblxuXG5cbiAgICB2YXIgc3R1ZmYgPSBwcm9jLnByb2Nlc3NUYWIoZGF0YSwgOClcbiAgICAvLyBjaG9wIHVwIHRoZSBzdHVmZnMgc29tZWhvdywgZGl2aWRlIGFtb25nIHRoZSBpbnN0cnVtZW50c1xuICAgIC8vIGp1c3QgbWFrZSBhIGJhc2UgXCJzb25nXCIgdGhpbmc/XG4gICAgY29uc29sZS5sb2coc3R1ZmYpXG4gICAgaWYgKHN0dWZmLmxlbmd0aCkge1xuICAgICAgdmFyIHJhdGlvbiA9IE1hdGguY2VpbChzdHVmZi5sZW5ndGggLyAzKVxuLy8gT2JqZWN0LmtleXMoc29uZ3MpLmZvckVhY2goZnVuY3Rpb24oc2spIHtcbi8vICAgICBPYmplY3Qua2V5cyhzb25nc1tza10uaW5zdHJ1bWVudHMpLmZvckVhY2goZnVuY3Rpb24oaWspIHtcbi8vICAgICAgICAgc29uZy5pbnN0cnVtZW50c1tpXS5wbGF5ID0gZnVuY3Rpb24gKGFyZykge1xuLy8gICAgICAgICAgIHZhciBjb25maWdzID0gc29uZ3Nbc2tdLmluc3RydW1lbnRzW2lrXS5jb25maWcgfHwge31cbi8vICAgICAgICAgICB2YXIgbXVsdGkgPSBzb25nc1tza10uaW5zdHJ1bWVudHNbaWtdLm11bHRpIHx8IDFcbi8vICAgICAgICAgICB2YXIgbm90ZSA9IHNvbmdzW3NrXS5pbnN0cnVtZW50c1tpa10ubWVsb2RpYyA/IHtmcmVxOiBpbnQyZnJlcShhcmcsIHNvbmdzW3NrXS5rZXkpICogbXVsdGl9IDoge31cblxuLy8gICAgICAgICAgIGluc3RzW2lrXS51cGRhdGUobWVyZ2Uobm90ZSwgY29uZmlncyksIGFjLmN1cnJlbnRUaW1lKVxuLy8gICAgICAgICAgIGluc3RzW2lrXS5zdGFydChhYy5jdXJyZW50VGltZSlcbi8vICAgICAgICAgfVxuLy8gICAgIH0pXG4vLyAgIH0pXG5cblxuICAgICAgT2JqZWN0LmtleXMoc29uZy5pbnN0cnVtZW50cykuZm9yRWFjaChmdW5jdGlvbiAoaSkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhpKVxuICAgICAgICBpZiAoc29uZy5pbnN0cnVtZW50c1tpXS5tZWxvZGljKSB7XG4gICAgICAgICAgc29uZy5pbnN0cnVtZW50c1tpXS5wYXR0ZXJucy52ZXJzZS5ub3RlcyA9IHBpY2soc3R1ZmYsIHtjb3VudDogcmF0aW9ufSlcbiAgICAgICAgICB2YXIgbWF4ID0gc29uZy5pbnN0cnVtZW50c1tpXS5wYXR0ZXJucy52ZXJzZS5ub3Rlcy5sZW5ndGhcbiAgICAgICAgICBzb25nLmluc3RydW1lbnRzW2ldLnBhdHRlcm5zLnZlcnNlLm5leHRzID0gc29uZy5pbnN0cnVtZW50c1tpXS5wYXR0ZXJucy52ZXJzZS5ub3Rlcy5tYXAoZnVuY3Rpb24gKGVod2hhdGV2ZXIsIGVoKSB7XG4gICAgICAgICAgICByZXR1cm4gW35+KE1hdGgucmFuZG9tICogbWF4KSwgZWgsIH5+KE1hdGgucmFuZG9tICogbWF4KV1cbiAgICAgICAgICB9KVxuICAgICAgICAgIHNvbmcuaW5zdHJ1bWVudHNbaV0ucGF0dGVybnMudmVyc2UucHJvYnMgPSBzb25nLmluc3RydW1lbnRzW2ldLnBhdHRlcm5zLnZlcnNlLm5vdGVzLm1hcChmdW5jdGlvbiAocGF0dGVybikge1xuICAgICAgICAgICAgcmV0dXJuIHBhdHRlcm4ubWFwKGZ1bmN0aW9uIChzdGVwKSB7XG4gICAgICAgICAgICAgIHJldHVybiBzdGVwLmxlbmd0aCA/IChNYXRoLnJhbmRvbSgpICogMC4yNSkgKyAwLjUgOiAwXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgc29uZy5pbnN0cnVtZW50c1tpXS5wbGF5ID0gZnVuY3Rpb24gKGFyZykge1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGkpXG4gICAgICAgICAgLy8gY29uc29sZS5sb2coc29uZy5rZXkpXG4gICAgICAgICAgdmFyIGNvbmZpZ3MgPSBzb25nLmluc3RydW1lbnRzW2ldLmNvbmZpZyB8fCB7fVxuICAgICAgICAgIHZhciBtdWx0aSA9IHNvbmcuaW5zdHJ1bWVudHNbaV0ubXVsdGkgfHwgMVxuICAgICAgICAgIHZhciBub3RlID0gc29uZy5pbnN0cnVtZW50c1tpXS5tZWxvZGljID8ge2ZyZXE6IGludDJmcmVxKGFyZywgc29uZy5rZXkpICogbXVsdGl9IDoge31cblxuICAgICAgICAgIHN5bnRoc1tpXS51cGRhdGUobWVyZ2Uobm90ZSwgY29uZmlncyksIGFjLmN1cnJlbnRUaW1lKVxuICAgICAgICAgIHN5bnRoc1tpXS5zdGFydChhYy5jdXJyZW50VGltZSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC8vIGNvbnNvbGUubG9nKHNvbmcuaW5zdHJ1bWVudHNbJ3BwJ10ucGF0dGVybnMudmVyc2UpXG5cblxuXG5cbiAgICAgIC8vIHNvbmcuaW5zdHJ1bWVudHMucHVzaCh7XG4gICAgICAvLyAgIGNvbmZpZzoge30sXG4gICAgICAvLyAgIG1lbG9kaWM6IGZhbHNlLFxuICAgICAgLy8gICBwYXR0ZXJuczoge1xuICAgICAgLy8gICAgIHZlcnNlOiB7XG4gICAgICAvLyAgICAgICBwcm9iczogW1xuICAgICAgLy8gICAgICAgICBbMSwgMCwgMCwgMF1cbiAgICAgIC8vICAgICAgIF0sXG4gICAgICAvLyAgICAgICBjdXJyZW50VmVyc2lvbjogMCxcbiAgICAgIC8vICAgICAgIGN1cnJlbnRUaWNrOiAwLFxuICAgICAgLy8gICAgICAgbW9kOiAxNixcbiAgICAgIC8vICAgICAgIG5leHRzOiBbWzBdXVxuICAgICAgLy8gICAgIH1cbiAgICAgIC8vICAgfSxcbiAgICAgIC8vICAgcGxheTogZnVuY3Rpb24gKGFyZykge1xuICAgICAgLy8gICAgIHZhciBtc2cgPSBuZXcgU3BlZWNoU3ludGhlc2lzVXR0ZXJhbmNlKCdIZWxsbyBXb3JsZCcpO1xuICAgICAgLy8gICAgIHdpbmRvdy5zcGVlY2hTeW50aGVzaXMuc3BlYWsobXNnKTtcbiAgICAgIC8vICAgfVxuICAgICAgLy8gfSlcblxuXG5cblxuXG5cblxuXG5cblxuXG4gICAgICB0aGVfdWkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxudGhlX3VpLmlkID0gJ21haW4nXG50aGVfdWkuY2xhc3NOYW1lID0gXCJzdXBlci1zaW1wbGUgbGF5b3ZlclwiXG5cbiAgICAgIHNxID0gc2VxKHNvbmcpXG5jb25zb2xlLmxvZyhzcSlcbnZhciBtc2cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoNCcpXG5tc2cudGV4dENvbnRlbnQgPSAnUk9DSyBPTiwgS0VZQk9BUkQgQ0FUISdcbnRoZV91aS5hcHBlbmRDaGlsZChtc2cpXG5cbnZhciBzY2FsZVNlbGVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjYWxlLXNlbGVjdCcpXG50aGVfdWkuYXBwZW5kQ2hpbGQoc2NhbGVTZWxlY3QpXG5cblxuc2NhbGVTZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcigndG9uaWMnLCBmdW5jdGlvbihldikge1xuICAvLyBkbyBzb21ldGhpbmdcbiAgdmFyIHRvbmljID0gZXYuZGV0YWlsLnZhbHVlIC8vIHdpbGwgYmUgXCJDXCIgb3IgXCJEI1wiIG9yIHdoYXQgaGF2ZSB5b3VcbiAgc29uZy5rZXkudG9uaWMgPSB0b25pYyArIDNcbiAgLy8gc3Euc3RvcCgpXG4gIHNxLnVwZGF0ZVNvbmcoc29uZylcbiAgLy8gc3Euc3RhcnQoKVxufSk7XG5zY2FsZVNlbGVjdC5hZGRFdmVudExpc3RlbmVyKCdzY2FsZScsIGZ1bmN0aW9uKGV2KSB7XG4gIC8vIGRvIHNvbWV0aGluZywgZm9yIGV4YW1wbGUgbWF5YmU6XG4gIHZhciBzY2FsZSA9IGV2LmRldGFpbC52YWx1ZSAvLyB3aWxsIGJlIFwibWFqb3JcIiBvciBcInBlbnRNYWpcIiBvciB3aGF0IGhhdmUgeW91XG4gIHNvbmcua2V5LnNjYWxlID0gc2NhbGVcbiAgLy8gc3Euc3RvcCgpXG4gIGNvbnNvbGUubG9nKHNxKVxuICBzcS51cGRhdGVTb25nKHNvbmcpXG4gIC8vIHNxLnN0YXJ0KClcbn0pO1xuXG52YXIgY29vbFNsaWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wZW5tdXNpYy1zbGlkZXInKTtcbmNvb2xTbGlkZXIubWluID0gMTAwXG5jb29sU2xpZGVyLm1heCA9IDMwMFxuY29uc29sZS5sb2coY29vbFNsaWRlcilcbmNvb2xTbGlkZXIudmFsdWUgPSAzMjBcbnRoZV91aS5hcHBlbmRDaGlsZChjb29sU2xpZGVyKTtcblxuY29vbFNsaWRlci5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbiAoZXYpIHtcbiAgY29uc29sZS5sb2coZXYpXG4gIGNvbnNvbGUubG9nKCd3aG9hJylcbiAgc29uZy5icG0gPSB+fmV2LnRhcmdldC52YWx1ZSAqIDJcbiAgc3Euc3RvcCgpXG4gIHNxLnVwZGF0ZVNvbmcoc29uZylcbiAgc3Euc3RhcnQoKVxufSlcblxuXG5cblxuXG5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoZV91aSlcblxuXG5cblxuXG5cblxuXG5cblxuICAgICAgc3Euc3RhcnQoKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZyhcIk5PVEhJTkcgVEhFUkU/XCIpXG4gICAgICAvLyBhbGVydCgnY291bGQgbm90IGZpbmQgeW8gZGF0YScpXG4gICAgfVxuXG5cblxuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5sb2coZSlcbiAgICBhbGVydCgndmVyeSBzb3JyeSwgc29tZXRoaW5nIGJyb2tlLCBub3QgdG8gd29ycnksIHJlZnJlc2ggdGhlIHBhZ2UgYW5kIHBlcmhhcHMgYW5vdGhlciBndWl0YXIgb3IgYmFzcyB0YWIgd2lsbCB3b3JrIGJldHRlcj8nKVxuICB9XG59IiwibW9kdWxlLmV4cG9ydHM9e1xuICBpbnN0cnVtZW50czoge1xuICAgICAgICBraWNrOiB7XG4gICAgICBjb25maWc6IHtcbiAgICAgICAgZnJlcTogMTAwLFxuICAgICAgICBlbmRGcmVxOiAzMCxcbiAgICAgICAgYXR0YWNrOiAwLjAwMDAwMDAwMDAwMDAwMDAwMDAwMSxcbiAgICAgICAgZGVjYXk6IDAuMDEsXG4gICAgICAgIHN1c3RhaW46IDAuMTIsXG4gICAgICAgIHJlbGVhc2U6IDAuMTMsXG4gICAgICAgIHBlYWs6IDAuNzk1LFxuICAgICAgICBtaWQ6IDAuNTY1LFxuICAgICAgICBlbmQ6IDAuMDAwMDAwMDAwMDAwMDAwMDAwMDAxXG4gICAgICB9LFxuICAgICAgcGF0dGVybnM6IHtcbiAgICAgICAgdmVyc2U6IHtcbiAgICAgICAgICBwcm9iczogW1xuICAgICAgICAgICAgWzEsIDAsIDEsIDBdLFxuICAgICAgICAgICAgWzEsIDAuNSwgMSwgMF0sXG4gICAgICAgICAgICBbMSwgMCwgMCwgMF0sXG5cbiAgICAgICAgICAgIFsxLCAxLCAwLCAxXSxcbiAgICAgICAgICAgIFsxLCAwLjUsIDAsIDAuOTc1XSxcbiAgICAgICAgICAgIFsxLCAwLjk1LCAwLjEsIDFdLFxuICAgICAgICAgICAgWzEsIDAuMTI1LCAwLjAxLCAwLjAyNV0sXG4gICAgICAgICAgICBbMCwgMC4wMTUsIDAuNzI1LCAwLjc1XSxcbiAgICAgICAgICAgIFsxLCAwLjAxNSwgMC41MSwgMC4wMV1cbiAgICAgICAgICBdLFxuICAgICAgICAgIGN1cnJlbnRWZXJzaW9uOiAwLFxuICAgICAgICAgIGN1cnJlbnRUaWNrOiAwLFxuICAgICAgICAgIG1vZDogMixcbiAgICAgICAgICBuZXh0czogW1swLCAxLDQsNl0sIFsxLCA1LCAwLCAyXSwgWzIsIDcsIDBdLFswLCAxLCA2LCAzXSwgWzEsIDcsIDUsIDJdLCBbNCwgNCwgMF0sWzUsNiw3XSwgWzIsNCw4XSwgWzEsMyw4XV1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgaGF0OiB7XG4gICAgICBjb25maWc6IHtcbiAgICAgICAgcGVhazogMC45NzEsXG4gICAgICAgIG1pZDogMC44NVxuICAgICAgfSxcbiAgICAgIHBhdHRlcm5zOiB7XG4gICAgICAgIHZlcnNlOiB7XG4gICAgICAgICAgcHJvYnM6IFtcbiAgICAgICAgICAgIFswLCAwLjk1LCAwLCAwLjk1XSxcbiAgICAgICAgICAgIFswLjE1MSwgMC45NSwgMC4xNTEsIDAuOTc1XSxcbiAgICAgICAgICAgIFswLCAxLCAwLjI1LCAwLjk1XSxcbiAgICAgICAgICAgIFswLjMxLCAwLjk3MjUsIDAuMzEsIDAuOTcyNV0sXG4gICAgICAgICAgICBbMC45LCAwLjI3NSwgMC45MDI1LCAwLjI3NV0sXG4gICAgICAgICAgICBbMC45MiwgMC45OCwgMC4xMiwgMC4xOF0sXG4gICAgICAgICAgICBbMC4zMSwgMC4yNSwgMC45MzEsIDAuOTI1XSxcbiAgICAgICAgICAgIFswLCAwLjk1LCAwLjkyNSwgMC43NV0sXG4gICAgICAgICAgICBbMC45MzEsIDAuNSwgMC4zMSwgMC45MzFdXG4gICAgICAgICAgXSxcbiAgICAgICAgICBjdXJyZW50VmVyc2lvbjogMCxcbiAgICAgICAgICBjdXJyZW50VGljazogMCxcbiAgICAgICAgICBtb2Q6IDEsXG4gICAgICAgICAgbmV4dHM6IFtbMCwgMSwyLDQsNl0sICBbMSwgNywgNSwgMl0sIFsxLCA1LCAwLCAyXSwgWzIsIDcsMywxLCAwXSxbMCwgMSwgNiwgM10sIFsyLDQsOCw1XSwgWzQsIDQsIDBdLFs1LDYsN10sWzEsMyw4XV1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgc25hcmU6IHtcbiAgICAgIGNvbmZpZzoge1xuICAgICAgICBmcmVxOiAyMDAsIC8vIGZvciB0aGUgdHJpYW5nbGUgb3NjaWxsYXRvclxuICAgICAgICBub2lzZWF0dGFjazogMC4wMDAwMDEsXG4gICAgICAgIG5vaXNlZGVjYXk6IDAuMDAwMDAxLFxuICAgICAgICBub2lzZXN1c3RhaW46IDAuMTc1LFxuICAgICAgICBub2lzZXJlbGVhc2U6IDAuMTI1LFxuICAgICAgICBub2lzZXBlYWs6IDAuMTIxMjM0MjUsXG4gICAgICAgIG5vaXNlbWlkOiAwLjA3MTM0MTIxNSxcbiAgICAgICAgbm9pc2VlbmQ6IDAuMDAwMDAxLFxuICAgICAgICB0cmlhdHRhY2s6IDAuMDAwMDAwMSxcbiAgICAgICAgdHJpZGVjYXk6IDAuMDAwMDAwMDEsXG4gICAgICAgIHRyaXN1c3RhaW46IDAuMTE3NSxcbiAgICAgICAgdHJpcmVsZWFzZTogMC4xMjUsXG4gICAgICAgIHRyaXBlYWs6IDAuMTIzMjQ4NyxcbiAgICAgICAgdHJpbWlkOiAwLjExMjEzNzUsXG4gICAgICAgIHRyaWVuZDogMC4wMDAwMDFcbiAgICAgIH0sXG4gICAgICBwYXR0ZXJuczoge1xuICAgICAgICB2ZXJzZToge1xuICAgICAgICAgIHByb2JzOiBbXG4gICAgICAgICAgICBbMCwgMCwgMC45NzUsIDAuMTI1XSxcbiAgICAgICAgICAgIFswLCAwLCAxLCAwXSxcbiAgICAgICAgICAgIFswLCAwLjEsIDAuOTcsIDAuMV0sXG4gICAgICAgICAgICBbMSwgMC43MjUsIDAuMjEsIDAuMDEyNV0sXG4gICAgICAgICAgICBbMCwgMC4wNSwgMC45NzI1LCAwLjA3NV0sXG4gICAgICAgICAgICBbMC4xLCAwLjc1LCAwLjQxLCAwLjAxXSxcbiAgICAgICAgICAgIFswLjAyNSwgMC4wMSwgMSwgMC4wMjVdLFxuICAgICAgICAgICAgWzAsIDAuMDUsIDAuOTcyNSwgMC43NV0sXG4gICAgICAgICAgICBbMCwgMC43NSwgMSwgMF1cbiAgICAgICAgICBdLFxuICAgICAgICAgIGN1cnJlbnRWZXJzaW9uOiAwLFxuICAgICAgICAgIGN1cnJlbnRUaWNrOiAwLFxuICAgICAgICAgIG1vZDogMixcbiAgICAgICAgICBuZXh0czogW1swLCAxLDIsNCw2XSwgIFsxLCA3LCA1LCAyXSwgWzIsNCw4LDVdLCBbMCwgMSwgNiwgM10sWzUsNiw3XSxbNCwgNCwgMF0sIFsxLCA1LCAwLCAyXSwgWzIsIDcsMywxLCAwXSxbMSwzLDhdXVxuXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHBwOiB7XG4gICAgICBjb25maWc6IHtcbiAgICAgICAgYXR0YWNrOiAwLjE1MTMsXG4gICAgICAgIGRlY2F5OiAwLjEsXG4gICAgICAgIHN1c3RhaW46IDAuMTUxMyxcbiAgICAgICAgcmVsZWFzZTogMC4xMjUsXG4gICAgICAgIHBlYWs6IDAuNjUyMzQ1LFxuICAgICAgICBtaWQ6IDAuNDIzLFxuICAgICAgICBlbmQ6IDAuMDA1MX0sXG4gICAgICBsZWFkOiB0cnVlLFxuICAgICAgbWVsb2RpYzogdHJ1ZSxcbiAgICAgIG11bHRpOiAxLFxuICAgICAgcGF0dGVybnM6IHtcbiAgICAgICAgdmVyc2U6IHtcbiAgICAgICAgICBub3RlczogW10sXG4gICAgICAgICAgcHJvYnM6IFtdLFxuICAgICAgICAgIGN1cnJlbnRWZXJzaW9uOiAwLFxuICAgICAgICAgIGN1cnJlbnRUaWNrOiAwLFxuICAgICAgICAgIG1vZDogMixcbiAgICAgICAgICBuZXh0czogW11cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgYmI6IHtcbiAgICAgIGNvbmZpZzoge1xuICAgICAgICBhdHRhY2s6IDAuMDYxMyxcbiAgICAgICAgZGVjYXk6IDAuMSxcbiAgICAgICAgc3VzdGFpbjogMC4wNTE1MTMsXG4gICAgICAgIHJlbGVhc2U6IDAuMDUxMzUsXG4gICAgICAgIHBlYWs6IDAuMjExMzQ1LFxuICAgICAgICBtaWQ6IDAuMTA5MTIzLFxuICAgICAgICBlbmQ6IDAuMDAwMDUxfSxcbiAgICAgIG1lbG9kaWM6IHRydWUsXG4gICAgICBtdWx0aTogMixcbiAgICAgIHBhdHRlcm5zOiB7XG4gICAgICAgIHZlcnNlOiB7XG4gICAgICAgICAgbm90ZXM6IFtdLFxuICAgICAgICAgIHByb2JzOiBbXSxcbiAgICAgICAgICBjdXJyZW50VmVyc2lvbjogMCxcbiAgICAgICAgICBjdXJyZW50VGljazogMCxcbiAgICAgICAgICBtb2Q6IDEsXG4gICAgICAgICAgbmV4dHM6IFtdXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHNtOiB7XG4gICAgICBjb25maWc6IHtcbiAgICAgICAgYXR0YWNrOiAwLjMsXG4gICAgICAgIGRlY2F5OiAwLjMxLFxuICAgICAgICBzdXN0YWluOiAwLjIxMyxcbiAgICAgICAgcmVsZWFzZTogMC4yMTUsXG4gICAgICAgIHBlYWs6IDAuMTIzNDUsXG4gICAgICAgIG1pZDogMC4wNTExMTIzLFxuICAgICAgICBlbmQ6IDAuMDAwMDAwNTF9LFxuICAgICAgbXVsdGk6IDIsXG4gICAgICBtZWxvZGljOiB0cnVlLFxuICAgICAgcGF0dGVybnM6IHtcbiAgICAgICAgdmVyc2U6IHtcbiAgICAgICAgICBub3RlczogW10sXG4gICAgICAgICAgcHJvYnM6IFtdLFxuICAgICAgICAgIGN1cnJlbnRWZXJzaW9uOiAwLFxuICAgICAgICAgIGN1cnJlbnRUaWNrOiAwLFxuICAgICAgICAgIG1vZDogNCxcbiAgICAgICAgICBuZXh0czogW11cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICB9LFxuICBjdXJyZW50OiBcInZlcnNlXCIsXG4gIG5leHRzOiB7XG4gICAgdmVyc2U6IFtcInZlcnNlXCJdXG4gIH0sXG4gIGJwbTogMjAwLFxuICBrZXk6IHtcbiAgICB0b25pYzogXCJEM1wiLFxuICAgIHNjYWxlOiBcIm1ham9yXCJcbiAgfVxufSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGdhaW5Ob2RlLCB3aGVuLCBhZHNyKSB7XG4gIGdhaW5Ob2RlLmdhaW4uZXhwb25lbnRpYWxSYW1wVG9WYWx1ZUF0VGltZShhZHNyLnBlYWssIHdoZW4gKyBhZHNyLmF0dGFjaylcbiAgZ2Fpbk5vZGUuZ2Fpbi5leHBvbmVudGlhbFJhbXBUb1ZhbHVlQXRUaW1lKGFkc3IubWlkLCB3aGVuICsgYWRzci5hdHRhY2sgKyBhZHNyLmRlY2F5KVxuICBnYWluTm9kZS5nYWluLnNldFZhbHVlQXRUaW1lKGFkc3IubWlkLCB3aGVuICsgYWRzci5zdXN0YWluICsgYWRzci5hdHRhY2sgKyBhZHNyLmRlY2F5KVxuICBnYWluTm9kZS5nYWluLmV4cG9uZW50aWFsUmFtcFRvVmFsdWVBdFRpbWUoYWRzci5lbmQsIHdoZW4gKyBhZHNyLnN1c3RhaW4gKyBhZHNyLmF0dGFjayArIGFkc3IuZGVjYXkgKyBhZHNyLnJlbGVhc2UpXG59XG4iLCJ2YXIgbWFrZURpc3RvcnRpb25DdXJ2ZSA9IHJlcXVpcmUoJ21ha2UtZGlzdG9ydGlvbi1jdXJ2ZScpXG52YXIgYWRzciA9IHJlcXVpcmUoJ2EtZC1zLXInKVxuLy8geXIgZnVuY3Rpb24gc2hvdWxkIGFjY2VwdCBhbiBhdWRpb0NvbnRleHQsIGFuZCBvcHRpb25hbCBwYXJhbXMvb3B0c1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYWMsIG9wdHMpIHtcbiAgLy8gbWFrZSBzb21lIGF1ZGlvTm9kZXMsIGNvbm5lY3QgdGhlbSwgc3RvcmUgdGhlbSBvbiB0aGUgb2JqZWN0XG4gIHZhciBhdWRpb05vZGVzID0ge1xuICAgIG5vaXNlQnVmZmVyOiBhYy5jcmVhdGVCdWZmZXIoMSwgYWMuc2FtcGxlUmF0ZSwgYWMuc2FtcGxlUmF0ZSksXG4gICAgbm9pc2VGaWx0ZXI6IGFjLmNyZWF0ZUJpcXVhZEZpbHRlcigpLFxuICAgIG5vaXNlRW52ZWxvcGU6IGFjLmNyZWF0ZUdhaW4oKSxcbiAgICBvc2M6IGFjLmNyZWF0ZU9zY2lsbGF0b3IoKSxcbiAgICBvc2NkaXN0b3J0aW9uOiBhYy5jcmVhdGVXYXZlU2hhcGVyKCksXG4gICAgb3NjRW52ZWxvcGU6IGFjLmNyZWF0ZUdhaW4oKSxcbiAgICBjb21wcmVzc29yOiBhYy5jcmVhdGVEeW5hbWljc0NvbXByZXNzb3IoKSxcbiAgICBkaXN0b3J0aW9uOiBhYy5jcmVhdGVXYXZlU2hhcGVyKCksXG4gICAgbWFpbkZpbHRlcjogYWMuY3JlYXRlQmlxdWFkRmlsdGVyKCksXG4gICAgaGlnaEZpbHRlcjogYWMuY3JlYXRlQmlxdWFkRmlsdGVyKCksXG4gICAgdm9sdW1lOiBhYy5jcmVhdGVHYWluKCksXG4gICAgc2V0dGluZ3M6IHtcbiAgICAgIGZyZXE6IDIwMCxcbiAgICAgIG5vaXNlYXR0YWNrOiAwLjAwMDAwMSxcbiAgICAgIG5vaXNlZGVjYXk6IDAuMDAwMDAxLFxuICAgICAgbm9pc2VzdXN0YWluOiAwLjExNzUsXG4gICAgICBub2lzZXJlbGVhc2U6IDAuMTI1LFxuICAgICAgbm9pc2VwZWFrOiAwLjQyNSxcbiAgICAgIG5vaXNlbWlkOiAwLjQxMjE1LFxuICAgICAgbm9pc2VlbmQ6IDAuMDAwMDAxLFxuICAgICAgdHJpYXR0YWNrOiAwLjAwMDAwMDEsXG4gICAgICB0cmlkZWNheTogMC4wMDAwMDAwMSxcbiAgICAgIHRyaXN1c3RhaW46IDAuMTE3NSxcbiAgICAgIHRyaXJlbGVhc2U6IDAuMTI1LFxuICAgICAgdHJpcGVhazogMC44NyxcbiAgICAgIHRyaW1pZDogMC43NSxcbiAgICAgIHRyaWVuZDogMC4wMDAwMDFcbiAgICB9XG4gIH1cbi8vIHNldCBhbGwgdGhlIHRoaW5nc1xuICB2YXIgb3V0cHV0ID0gYXVkaW9Ob2Rlcy5ub2lzZUJ1ZmZlci5nZXRDaGFubmVsRGF0YSgwKVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGFjLnNhbXBsZVJhdGU7IGkrKykge1xuICAgIG91dHB1dFtpXSA9IE1hdGgucmFuZG9tKCkgKiAyIC0gMVxuICB9XG5cbiAgYXVkaW9Ob2Rlcy5ub2lzZUZpbHRlci50eXBlID0gJ2hpZ2hwYXNzJ1xuICBhdWRpb05vZGVzLm5vaXNlRmlsdGVyLmZyZXF1ZW5jeS5zZXRWYWx1ZUF0VGltZSgxMDAwLCBhYy5jdXJyZW50VGltZSlcblxuICBhdWRpb05vZGVzLm5vaXNlRW52ZWxvcGUuZ2Fpbi5zZXRWYWx1ZUF0VGltZSgwLjAwMDAxLCBhYy5jdXJyZW50VGltZSlcblxuICBhdWRpb05vZGVzLm9zYy50eXBlID0gJ3RyaWFuZ2xlJ1xuICBhdWRpb05vZGVzLm9zY2Rpc3RvcnRpb24uY3VydmUgPSBtYWtlRGlzdG9ydGlvbkN1cnZlKDEwMDApXG4gIGF1ZGlvTm9kZXMub3NjZGlzdG9ydGlvbi5vdmVyc2FtcGxlID0gJzR4J1xuXG4gIGF1ZGlvTm9kZXMub3NjRW52ZWxvcGUuZ2Fpbi5zZXRWYWx1ZUF0VGltZSgwLjAwMDAxLCBhYy5jdXJyZW50VGltZSlcblxuICBhdWRpb05vZGVzLmNvbXByZXNzb3IudGhyZXNob2xkLnZhbHVlID0gLTE1XG4gIGF1ZGlvTm9kZXMuY29tcHJlc3Nvci5rbmVlLnZhbHVlID0gMzNcbiAgYXVkaW9Ob2Rlcy5jb21wcmVzc29yLnJhdGlvLnZhbHVlID0gNVxuICBhdWRpb05vZGVzLmNvbXByZXNzb3IucmVkdWN0aW9uLnZhbHVlID0gLTEwXG4gIGF1ZGlvTm9kZXMuY29tcHJlc3Nvci5hdHRhY2sudmFsdWUgPSAwLjAwNVxuICBhdWRpb05vZGVzLmNvbXByZXNzb3IucmVsZWFzZS52YWx1ZSA9IDAuMTUwXG5cbiAgYXVkaW9Ob2Rlcy5kaXN0b3J0aW9uLmN1cnZlID0gbWFrZURpc3RvcnRpb25DdXJ2ZSgyMjIpXG4gIGF1ZGlvTm9kZXMuZGlzdG9ydGlvbi5vdmVyc2FtcGxlID0gJzJ4J1xuXG4gIGF1ZGlvTm9kZXMubWFpbkZpbHRlci50eXBlID0gJ3BlYWtpbmcnXG4gIGF1ZGlvTm9kZXMubWFpbkZpbHRlci5mcmVxdWVuY3kudmFsdWUgPSAyNTBcbiAgYXVkaW9Ob2Rlcy5tYWluRmlsdGVyLmdhaW4udmFsdWUgPSAxLjVcbiAgYXVkaW9Ob2Rlcy5tYWluRmlsdGVyLlEudmFsdWUgPSAyNVxuXG4gIGF1ZGlvTm9kZXMuaGlnaEZpbHRlci50eXBlID0gJ3BlYWtpbmcnXG4gIGF1ZGlvTm9kZXMuaGlnaEZpbHRlci5mcmVxdWVuY3kudmFsdWUgPSA5MDAwXG4gIGF1ZGlvTm9kZXMuaGlnaEZpbHRlci5RLnZhbHVlID0gMjVcbi8vIGNvbm5lY3QgdGhlIGdyYXBoXG4gIGF1ZGlvTm9kZXMubm9pc2VGaWx0ZXIuY29ubmVjdChhdWRpb05vZGVzLm5vaXNlRW52ZWxvcGUpXG4gIGF1ZGlvTm9kZXMub3NjLmNvbm5lY3QoYXVkaW9Ob2Rlcy5vc2NkaXN0b3J0aW9uKVxuICBhdWRpb05vZGVzLm9zY2Rpc3RvcnRpb24uY29ubmVjdChhdWRpb05vZGVzLm9zY0VudmVsb3BlKVxuICBhdWRpb05vZGVzLm5vaXNlRW52ZWxvcGUuY29ubmVjdChhdWRpb05vZGVzLmNvbXByZXNzb3IpXG4gIGF1ZGlvTm9kZXMub3NjRW52ZWxvcGUuY29ubmVjdChhdWRpb05vZGVzLmNvbXByZXNzb3IpXG4gIGF1ZGlvTm9kZXMuY29tcHJlc3Nvci5jb25uZWN0KGF1ZGlvTm9kZXMuZGlzdG9ydGlvbilcbiAgYXVkaW9Ob2Rlcy5kaXN0b3J0aW9uLmNvbm5lY3QoYXVkaW9Ob2Rlcy5tYWluRmlsdGVyKVxuICBhdWRpb05vZGVzLm1haW5GaWx0ZXIuY29ubmVjdChhdWRpb05vZGVzLmhpZ2hGaWx0ZXIpXG4gIGF1ZGlvTm9kZXMuaGlnaEZpbHRlci5jb25uZWN0KGF1ZGlvTm9kZXMudm9sdW1lKVxuLy8gc3RhcnQgaXQgdXBcbiAgYXVkaW9Ob2Rlcy52b2x1bWUuZ2Fpbi5zZXRWYWx1ZUF0VGltZSgwLjUsIGFjLmN1cnJlbnRUaW1lKVxuICBhdWRpb05vZGVzLm9zYy5zdGFydChhYy5jdXJyZW50VGltZSlcbi8vIFJFQURZIDIgcmV0dXJuIFRISVMgVEhJTkcgQikgKk5JQ0UqXG4gIHJldHVybiB7XG4gICAgY29ubmVjdDogZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICBhdWRpb05vZGVzLnZvbHVtZS5jb25uZWN0KGlucHV0KVxuICAgIH0sXG4gICAgc3RhcnQ6IGZ1bmN0aW9uICh3aGVuKSB7XG4gICAgICB2YXIgbm9pc2UgPSBhYy5jcmVhdGVCdWZmZXJTb3VyY2UoKVxuICAgICAgbm9pc2UuYnVmZmVyID0gYXVkaW9Ob2Rlcy5ub2lzZUJ1ZmZlclxuICAgICAgbm9pc2UuY29ubmVjdChhdWRpb05vZGVzLm5vaXNlRmlsdGVyKVxuICAgICAgbm9pc2Uuc3RhcnQod2hlbilcbiAgICAgIGFkc3IoYXVkaW9Ob2Rlcy5ub2lzZUVudmVsb3BlLCB3aGVuLCBtYWtlQURTUignbm9pc2UnLCBhdWRpb05vZGVzLnNldHRpbmdzKSlcbiAgICAgIGFkc3IoYXVkaW9Ob2Rlcy5vc2NFbnZlbG9wZSwgd2hlbiwgbWFrZUFEU1IoJ3RyaScsIGF1ZGlvTm9kZXMuc2V0dGluZ3MpKVxuICAgICAgYXVkaW9Ob2Rlcy5vc2MuZnJlcXVlbmN5LnNldFZhbHVlQXRUaW1lKGF1ZGlvTm9kZXMuc2V0dGluZ3MuZnJlcSwgd2hlbilcbiAgICB9LFxuICAgIHN0b3A6IGZ1bmN0aW9uICh3aGVuKSB7XG4gICAgICBhdWRpb05vZGVzLm9zYy5zdG9wKHdoZW4pXG4gICAgfSxcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgICBPYmplY3Qua2V5cyhvcHRzKS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7XG4gICAgICAgIGF1ZGlvTm9kZXMuc2V0dGluZ3Nba10gPSBvcHRzW2tdXG4gICAgICB9KVxuICAgIH0sXG4gICAgbm9kZXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBhdWRpb05vZGVzXG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIG1ha2VBRFNSICh0eXBlLCBzZXR0aW5ncykge1xuICByZXR1cm4gT2JqZWN0LmtleXMoc2V0dGluZ3MpLmZpbHRlcihmdW5jdGlvbiAoaykge1xuICAgIHJldHVybiAhIWsubWF0Y2godHlwZSlcbiAgfSkubWFwKGZ1bmN0aW9uIChrKSB7XG4gICAgcmV0dXJuIGsucmVwbGFjZSh0eXBlLCAnJylcbiAgfSkucmVkdWNlKGZ1bmN0aW9uIChvLCBrKSB7XG4gICAgb1trXSA9IHNldHRpbmdzW3R5cGUgKyBrXVxuICAgIHJldHVybiBvXG4gIH0sIHt9KVxufVxuIiwiLyohIChDKSBXZWJSZWZsZWN0aW9uIE1pdCBTdHlsZSBMaWNlbnNlICovXG4oZnVuY3Rpb24oZSx0LG4scil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gcnQoZSx0KXtmb3IodmFyIG49MCxyPWUubGVuZ3RoO248cjtuKyspdnQoZVtuXSx0KX1mdW5jdGlvbiBpdChlKXtmb3IodmFyIHQ9MCxuPWUubGVuZ3RoLHI7dDxuO3QrKylyPWVbdF0sbnQocixiW290KHIpXSl9ZnVuY3Rpb24gc3QoZSl7cmV0dXJuIGZ1bmN0aW9uKHQpe2oodCkmJih2dCh0LGUpLHJ0KHQucXVlcnlTZWxlY3RvckFsbCh3KSxlKSl9fWZ1bmN0aW9uIG90KGUpe3ZhciB0PWUuZ2V0QXR0cmlidXRlKFwiaXNcIiksbj1lLm5vZGVOYW1lLnRvVXBwZXJDYXNlKCkscj1TLmNhbGwoeSx0P3YrdC50b1VwcGVyQ2FzZSgpOmQrbik7cmV0dXJuIHQmJi0xPHImJiF1dChuLHQpPy0xOnJ9ZnVuY3Rpb24gdXQoZSx0KXtyZXR1cm4tMTx3LmluZGV4T2YoZSsnW2lzPVwiJyt0KydcIl0nKX1mdW5jdGlvbiBhdChlKXt2YXIgdD1lLmN1cnJlbnRUYXJnZXQsbj1lLmF0dHJDaGFuZ2Uscj1lLmF0dHJOYW1lLGk9ZS50YXJnZXQ7USYmKCFpfHxpPT09dCkmJnQuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrJiZyIT09XCJzdHlsZVwiJiZlLnByZXZWYWx1ZSE9PWUubmV3VmFsdWUmJnQuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKHIsbj09PWVbYV0/bnVsbDplLnByZXZWYWx1ZSxuPT09ZVtsXT9udWxsOmUubmV3VmFsdWUpfWZ1bmN0aW9uIGZ0KGUpe3ZhciB0PXN0KGUpO3JldHVybiBmdW5jdGlvbihlKXtYLnB1c2godCxlLnRhcmdldCl9fWZ1bmN0aW9uIGx0KGUpe0smJihLPSExLGUuY3VycmVudFRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKGgsbHQpKSxydCgoZS50YXJnZXR8fHQpLnF1ZXJ5U2VsZWN0b3JBbGwodyksZS5kZXRhaWw9PT1vP286cyksQiYmcHQoKX1mdW5jdGlvbiBjdChlLHQpe3ZhciBuPXRoaXM7cS5jYWxsKG4sZSx0KSxHLmNhbGwobix7dGFyZ2V0Om59KX1mdW5jdGlvbiBodChlLHQpe0QoZSx0KSxldD9ldC5vYnNlcnZlKGUseik6KEomJihlLnNldEF0dHJpYnV0ZT1jdCxlW2ldPVooZSksZS5hZGRFdmVudExpc3RlbmVyKHAsRykpLGUuYWRkRXZlbnRMaXN0ZW5lcihjLGF0KSksZS5jcmVhdGVkQ2FsbGJhY2smJlEmJihlLmNyZWF0ZWQ9ITAsZS5jcmVhdGVkQ2FsbGJhY2soKSxlLmNyZWF0ZWQ9ITEpfWZ1bmN0aW9uIHB0KCl7Zm9yKHZhciBlLHQ9MCxuPUYubGVuZ3RoO3Q8bjt0KyspZT1GW3RdLEUuY29udGFpbnMoZSl8fChuLS0sRi5zcGxpY2UodC0tLDEpLHZ0KGUsbykpfWZ1bmN0aW9uIGR0KGUpe3Rocm93IG5ldyBFcnJvcihcIkEgXCIrZStcIiB0eXBlIGlzIGFscmVhZHkgcmVnaXN0ZXJlZFwiKX1mdW5jdGlvbiB2dChlLHQpe3ZhciBuLHI9b3QoZSk7LTE8ciYmKHR0KGUsYltyXSkscj0wLHQ9PT1zJiYhZVtzXT8oZVtvXT0hMSxlW3NdPSEwLHI9MSxCJiZTLmNhbGwoRixlKTwwJiZGLnB1c2goZSkpOnQ9PT1vJiYhZVtvXSYmKGVbc109ITEsZVtvXT0hMCxyPTEpLHImJihuPWVbdCtcIkNhbGxiYWNrXCJdKSYmbi5jYWxsKGUpKX1pZihyIGluIHQpcmV0dXJuO3ZhciBpPVwiX19cIityKyhNYXRoLnJhbmRvbSgpKjFlNT4+MCkscz1cImF0dGFjaGVkXCIsbz1cImRldGFjaGVkXCIsdT1cImV4dGVuZHNcIixhPVwiQURESVRJT05cIixmPVwiTU9ESUZJQ0FUSU9OXCIsbD1cIlJFTU9WQUxcIixjPVwiRE9NQXR0ck1vZGlmaWVkXCIsaD1cIkRPTUNvbnRlbnRMb2FkZWRcIixwPVwiRE9NU3VidHJlZU1vZGlmaWVkXCIsZD1cIjxcIix2PVwiPVwiLG09L15bQS1aXVtBLVowLTldKig/Oi1bQS1aMC05XSspKyQvLGc9W1wiQU5OT1RBVElPTi1YTUxcIixcIkNPTE9SLVBST0ZJTEVcIixcIkZPTlQtRkFDRVwiLFwiRk9OVC1GQUNFLVNSQ1wiLFwiRk9OVC1GQUNFLVVSSVwiLFwiRk9OVC1GQUNFLUZPUk1BVFwiLFwiRk9OVC1GQUNFLU5BTUVcIixcIk1JU1NJTkctR0xZUEhcIl0seT1bXSxiPVtdLHc9XCJcIixFPXQuZG9jdW1lbnRFbGVtZW50LFM9eS5pbmRleE9mfHxmdW5jdGlvbihlKXtmb3IodmFyIHQ9dGhpcy5sZW5ndGg7dC0tJiZ0aGlzW3RdIT09ZTspO3JldHVybiB0fSx4PW4ucHJvdG90eXBlLFQ9eC5oYXNPd25Qcm9wZXJ0eSxOPXguaXNQcm90b3R5cGVPZixDPW4uZGVmaW5lUHJvcGVydHksaz1uLmdldE93blByb3BlcnR5RGVzY3JpcHRvcixMPW4uZ2V0T3duUHJvcGVydHlOYW1lcyxBPW4uZ2V0UHJvdG90eXBlT2YsTz1uLnNldFByb3RvdHlwZU9mLE09ISFuLl9fcHJvdG9fXyxfPW4uY3JlYXRlfHxmdW5jdGlvbiBtdChlKXtyZXR1cm4gZT8obXQucHJvdG90eXBlPWUsbmV3IG10KTp0aGlzfSxEPU98fChNP2Z1bmN0aW9uKGUsdCl7cmV0dXJuIGUuX19wcm90b19fPXQsZX06TCYmaz9mdW5jdGlvbigpe2Z1bmN0aW9uIGUoZSx0KXtmb3IodmFyIG4scj1MKHQpLGk9MCxzPXIubGVuZ3RoO2k8cztpKyspbj1yW2ldLFQuY2FsbChlLG4pfHxDKGUsbixrKHQsbikpfXJldHVybiBmdW5jdGlvbih0LG4pe2RvIGUodCxuKTt3aGlsZSgobj1BKG4pKSYmIU4uY2FsbChuLHQpKTtyZXR1cm4gdH19KCk6ZnVuY3Rpb24oZSx0KXtmb3IodmFyIG4gaW4gdCllW25dPXRbbl07cmV0dXJuIGV9KSxQPWUuTXV0YXRpb25PYnNlcnZlcnx8ZS5XZWJLaXRNdXRhdGlvbk9ic2VydmVyLEg9KGUuSFRNTEVsZW1lbnR8fGUuRWxlbWVudHx8ZS5Ob2RlKS5wcm90b3R5cGUsQj0hTi5jYWxsKEgsRSksaj1CP2Z1bmN0aW9uKGUpe3JldHVybiBlLm5vZGVUeXBlPT09MX06ZnVuY3Rpb24oZSl7cmV0dXJuIE4uY2FsbChILGUpfSxGPUImJltdLEk9SC5jbG9uZU5vZGUscT1ILnNldEF0dHJpYnV0ZSxSPUgucmVtb3ZlQXR0cmlidXRlLFU9dC5jcmVhdGVFbGVtZW50LHo9UCYme2F0dHJpYnV0ZXM6ITAsY2hhcmFjdGVyRGF0YTohMCxhdHRyaWJ1dGVPbGRWYWx1ZTohMH0sVz1QfHxmdW5jdGlvbihlKXtKPSExLEUucmVtb3ZlRXZlbnRMaXN0ZW5lcihjLFcpfSxYLFY9ZS5yZXF1ZXN0QW5pbWF0aW9uRnJhbWV8fGUud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lfHxlLm1velJlcXVlc3RBbmltYXRpb25GcmFtZXx8ZS5tc1JlcXVlc3RBbmltYXRpb25GcmFtZXx8ZnVuY3Rpb24oZSl7c2V0VGltZW91dChlLDEwKX0sJD0hMSxKPSEwLEs9ITAsUT0hMCxHLFksWixldCx0dCxudDtPfHxNPyh0dD1mdW5jdGlvbihlLHQpe04uY2FsbCh0LGUpfHxodChlLHQpfSxudD1odCk6KHR0PWZ1bmN0aW9uKGUsdCl7ZVtpXXx8KGVbaV09bighMCksaHQoZSx0KSl9LG50PXR0KSxCPyhKPSExLGZ1bmN0aW9uKCl7dmFyIGU9ayhILFwiYWRkRXZlbnRMaXN0ZW5lclwiKSx0PWUudmFsdWUsbj1mdW5jdGlvbihlKXt2YXIgdD1uZXcgQ3VzdG9tRXZlbnQoYyx7YnViYmxlczohMH0pO3QuYXR0ck5hbWU9ZSx0LnByZXZWYWx1ZT10aGlzLmdldEF0dHJpYnV0ZShlKSx0Lm5ld1ZhbHVlPW51bGwsdFtsXT10LmF0dHJDaGFuZ2U9MixSLmNhbGwodGhpcyxlKSx0aGlzLmRpc3BhdGNoRXZlbnQodCl9LHI9ZnVuY3Rpb24oZSx0KXt2YXIgbj10aGlzLmhhc0F0dHJpYnV0ZShlKSxyPW4mJnRoaXMuZ2V0QXR0cmlidXRlKGUpLGk9bmV3IEN1c3RvbUV2ZW50KGMse2J1YmJsZXM6ITB9KTtxLmNhbGwodGhpcyxlLHQpLGkuYXR0ck5hbWU9ZSxpLnByZXZWYWx1ZT1uP3I6bnVsbCxpLm5ld1ZhbHVlPXQsbj9pW2ZdPWkuYXR0ckNoYW5nZT0xOmlbYV09aS5hdHRyQ2hhbmdlPTAsdGhpcy5kaXNwYXRjaEV2ZW50KGkpfSxzPWZ1bmN0aW9uKGUpe3ZhciB0PWUuY3VycmVudFRhcmdldCxuPXRbaV0scj1lLnByb3BlcnR5TmFtZSxzO24uaGFzT3duUHJvcGVydHkocikmJihuPW5bcl0scz1uZXcgQ3VzdG9tRXZlbnQoYyx7YnViYmxlczohMH0pLHMuYXR0ck5hbWU9bi5uYW1lLHMucHJldlZhbHVlPW4udmFsdWV8fG51bGwscy5uZXdWYWx1ZT1uLnZhbHVlPXRbcl18fG51bGwscy5wcmV2VmFsdWU9PW51bGw/c1thXT1zLmF0dHJDaGFuZ2U9MDpzW2ZdPXMuYXR0ckNoYW5nZT0xLHQuZGlzcGF0Y2hFdmVudChzKSl9O2UudmFsdWU9ZnVuY3Rpb24oZSxvLHUpe2U9PT1jJiZ0aGlzLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayYmdGhpcy5zZXRBdHRyaWJ1dGUhPT1yJiYodGhpc1tpXT17Y2xhc3NOYW1lOntuYW1lOlwiY2xhc3NcIix2YWx1ZTp0aGlzLmNsYXNzTmFtZX19LHRoaXMuc2V0QXR0cmlidXRlPXIsdGhpcy5yZW1vdmVBdHRyaWJ1dGU9bix0LmNhbGwodGhpcyxcInByb3BlcnR5Y2hhbmdlXCIscykpLHQuY2FsbCh0aGlzLGUsbyx1KX0sQyhILFwiYWRkRXZlbnRMaXN0ZW5lclwiLGUpfSgpKTpQfHwoRS5hZGRFdmVudExpc3RlbmVyKGMsVyksRS5zZXRBdHRyaWJ1dGUoaSwxKSxFLnJlbW92ZUF0dHJpYnV0ZShpKSxKJiYoRz1mdW5jdGlvbihlKXt2YXIgdD10aGlzLG4scixzO2lmKHQ9PT1lLnRhcmdldCl7bj10W2ldLHRbaV09cj1aKHQpO2ZvcihzIGluIHIpe2lmKCEocyBpbiBuKSlyZXR1cm4gWSgwLHQscyxuW3NdLHJbc10sYSk7aWYocltzXSE9PW5bc10pcmV0dXJuIFkoMSx0LHMsbltzXSxyW3NdLGYpfWZvcihzIGluIG4paWYoIShzIGluIHIpKXJldHVybiBZKDIsdCxzLG5bc10scltzXSxsKX19LFk9ZnVuY3Rpb24oZSx0LG4scixpLHMpe3ZhciBvPXthdHRyQ2hhbmdlOmUsY3VycmVudFRhcmdldDp0LGF0dHJOYW1lOm4scHJldlZhbHVlOnIsbmV3VmFsdWU6aX07b1tzXT1lLGF0KG8pfSxaPWZ1bmN0aW9uKGUpe2Zvcih2YXIgdCxuLHI9e30saT1lLmF0dHJpYnV0ZXMscz0wLG89aS5sZW5ndGg7czxvO3MrKyl0PWlbc10sbj10Lm5hbWUsbiE9PVwic2V0QXR0cmlidXRlXCImJihyW25dPXQudmFsdWUpO3JldHVybiByfSkpLHRbcl09ZnVuY3Rpb24obixyKXtjPW4udG9VcHBlckNhc2UoKSwkfHwoJD0hMCxQPyhldD1mdW5jdGlvbihlLHQpe2Z1bmN0aW9uIG4oZSx0KXtmb3IodmFyIG49MCxyPWUubGVuZ3RoO248cjt0KGVbbisrXSkpO31yZXR1cm4gbmV3IFAoZnVuY3Rpb24ocil7Zm9yKHZhciBpLHMsbyx1PTAsYT1yLmxlbmd0aDt1PGE7dSsrKWk9clt1XSxpLnR5cGU9PT1cImNoaWxkTGlzdFwiPyhuKGkuYWRkZWROb2RlcyxlKSxuKGkucmVtb3ZlZE5vZGVzLHQpKToocz1pLnRhcmdldCxRJiZzLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayYmaS5hdHRyaWJ1dGVOYW1lIT09XCJzdHlsZVwiJiYobz1zLmdldEF0dHJpYnV0ZShpLmF0dHJpYnV0ZU5hbWUpLG8hPT1pLm9sZFZhbHVlJiZzLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhpLmF0dHJpYnV0ZU5hbWUsaS5vbGRWYWx1ZSxvKSkpfSl9KHN0KHMpLHN0KG8pKSxldC5vYnNlcnZlKHQse2NoaWxkTGlzdDohMCxzdWJ0cmVlOiEwfSkpOihYPVtdLFYoZnVuY3Rpb24gRSgpe3doaWxlKFgubGVuZ3RoKVguc2hpZnQoKS5jYWxsKG51bGwsWC5zaGlmdCgpKTtWKEUpfSksdC5hZGRFdmVudExpc3RlbmVyKFwiRE9NTm9kZUluc2VydGVkXCIsZnQocykpLHQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTU5vZGVSZW1vdmVkXCIsZnQobykpKSx0LmFkZEV2ZW50TGlzdGVuZXIoaCxsdCksdC5hZGRFdmVudExpc3RlbmVyKFwicmVhZHlzdGF0ZWNoYW5nZVwiLGx0KSx0LmNyZWF0ZUVsZW1lbnQ9ZnVuY3Rpb24oZSxuKXt2YXIgcj1VLmFwcGx5KHQsYXJndW1lbnRzKSxpPVwiXCIrZSxzPVMuY2FsbCh5LChuP3Y6ZCkrKG58fGkpLnRvVXBwZXJDYXNlKCkpLG89LTE8cztyZXR1cm4gbiYmKHIuc2V0QXR0cmlidXRlKFwiaXNcIixuPW4udG9Mb3dlckNhc2UoKSksbyYmKG89dXQoaS50b1VwcGVyQ2FzZSgpLG4pKSksUT0hdC5jcmVhdGVFbGVtZW50LmlubmVySFRNTEhlbHBlcixvJiZudChyLGJbc10pLHJ9LEguY2xvbmVOb2RlPWZ1bmN0aW9uKGUpe3ZhciB0PUkuY2FsbCh0aGlzLCEhZSksbj1vdCh0KTtyZXR1cm4tMTxuJiZudCh0LGJbbl0pLGUmJml0KHQucXVlcnlTZWxlY3RvckFsbCh3KSksdH0pLC0yPFMuY2FsbCh5LHYrYykrUy5jYWxsKHksZCtjKSYmZHQobik7aWYoIW0udGVzdChjKXx8LTE8Uy5jYWxsKGcsYykpdGhyb3cgbmV3IEVycm9yKFwiVGhlIHR5cGUgXCIrbitcIiBpcyBpbnZhbGlkXCIpO3ZhciBpPWZ1bmN0aW9uKCl7cmV0dXJuIGY/dC5jcmVhdGVFbGVtZW50KGwsYyk6dC5jcmVhdGVFbGVtZW50KGwpfSxhPXJ8fHgsZj1ULmNhbGwoYSx1KSxsPWY/clt1XS50b1VwcGVyQ2FzZSgpOmMsYyxwO3JldHVybiBmJiYtMTxTLmNhbGwoeSxkK2wpJiZkdChsKSxwPXkucHVzaCgoZj92OmQpK2MpLTEsdz13LmNvbmNhdCh3Lmxlbmd0aD9cIixcIjpcIlwiLGY/bCsnW2lzPVwiJytuLnRvTG93ZXJDYXNlKCkrJ1wiXSc6bCksaS5wcm90b3R5cGU9YltwXT1ULmNhbGwoYSxcInByb3RvdHlwZVwiKT9hLnByb3RvdHlwZTpfKEgpLHJ0KHQucXVlcnlTZWxlY3RvckFsbCh3KSxzKSxpfX0pKHdpbmRvdyxkb2N1bWVudCxPYmplY3QsXCJyZWdpc3RlckVsZW1lbnRcIik7IiwidmFyIHNjYWxlcyA9IHtcbiAgbWFqb3I6IFsyLCAyLCAxLCAyLCAyLCAyLCAxXSxcbiAgbWlub3I6IFsyLCAxLCAyLCAyLCAxLCAyLCAyXSxcbiAgcGVudE1hajogWzIsIDIsIDMsIDIsIDNdLFxuICBwZW50TWluOiBbMywgMiwgMiwgMywgMl0sXG4gIGJsdWVzOiBbMywgMiwgMSwgMSwgMywgMl1cbn1cblxudmFyIHN0cjJmcmVxID0ge1xuICAnQTAnOiAyNy41MDAwLCAnQSMwJzogMjkuMTM1MiwgJ0IwJzogMzAuODY3NywgJ0MxJzogMzIuNzAzMiwgJ0MjMSc6IDM0LjY0NzgsXG4gICdEMSc6IDM2LjcwODEsICdEIzEnOiAzOC44OTA5LCAnRTEnOiA0MS4yMDM0LCAnRjEnOiA0My42NTM1LCAnRiMxJzogNDYuMjQ5MyxcbiAgJ0cxJzogNDguOTk5NCwgJ0cjMSc6IDUxLjkxMzEsICdBMSc6IDU1LjAwMDAsICdBIzEnOiA1OC4yNzA1LCAnQjEnOiA2MS43MzU0LFxuICAnQzInOiA2NS40MDY0LCAnQyMyJzogNjkuMjk1NywgJ0QyJzogNzMuNDE2MiwgJ0QjMic6IDc3Ljc4MTcsICdFMic6IDgyLjQwNjksXG4gICdGMic6IDg3LjMwNzEsICdGIzInOiA5Mi40OTg2LCAnRzInOiA5Ny45OTg5LCAnRyMyJzogMTAzLjgyNiwgJ0EyJzogMTEwLjAwMCxcbiAgJ0EjMic6IDExNi41NDEsICdCMic6IDEyMy40NzEsICdDMyc6IDEzMC44MTMsICdDIzMnOiAxMzguNTkxLCAnRDMnOiAxNDYuODMyLFxuICAnRCMzJzogMTU1LjU2MywgJ0UzJzogMTY0LjgxNCwgJ0YzJzogMTc0LjYxNCwgJ0YjMyc6IDE4NC45OTcsICdHMyc6IDE5NS45OTgsXG4gICdHIzMnOiAyMDcuNjUyLCAnQTMnOiAyMjAuMDAwLCAnQSMzJzogMjMzLjA4MiwgJ0IzJzogMjQ2Ljk0MiwgJ0M0JzogMjYxLjYyNixcbiAgJ0MjNCc6IDI3Ny4xODMsICdENCc6IDI5My42NjUsICdEIzQnOiAzMTEuMTI3LCAnRTQnOiAzMjkuNjI4LCAnRjQnOiAzNDkuMjI4LFxuICAnRiM0JzogMzY5Ljk5NCwgJ0c0JzogMzkxLjk5NSwgJ0cjNCc6IDQxNS4zMDUsICdBNCc6IDQ0MC4wMDAsICdBIzQnOiA0NjYuMTY0LFxuICAnQjQnOiA0OTMuODgzLCAnQzUnOiA1MjMuMjUxLCAnQyM1JzogNTU0LjM2NSwgJ0Q1JzogNTg3LjMzMCwgJ0QjNSc6IDYyMi4yNTQsXG4gICdFNSc6IDY1OS4yNTUsICdGNSc6IDY5OC40NTYsICdGIzUnOiA3MzkuOTg5LCAnRzUnOiA3ODMuOTkxLCAnRyM1JzogODMwLjYwOSxcbiAgJ0E1JzogODgwLjAwMCwgJ0EjNSc6IDkzMi4zMjgsICdCNSc6IDk4Ny43NjcsICdDNic6IDEwNDYuNTAsICdDIzYnOiAxMTA4LjczLFxuICAnRDYnOiAxMTc0LjY2LCAnRCM2JzogMTI0NC41MSwgJ0U2JzogMTMxOC41MSwgJ0Y2JzogMTM5Ni45MSwgJ0YjNic6IDE0NzkuOTgsXG4gICdHNic6IDE1NjcuOTgsICdHIzYnOiAxNjYxLjIyLCAnQTYnOiAxNzYwLjAwLCAnQSM2JzogMTg2NC42NiwgJ0I2JzogMTk3NS41MyxcbiAgJ0M3JzogMjA5My4wMCwgJ0MjNyc6IDIyMTcuNDYsICdENyc6IDIzNDkuMzIsICdEIzcnOiAyNDg5LjAyLCAnRTcnOiAyNjM3LjAyLFxuICAnRjcnOiAyNzkzLjgzLCAnRiM3JzogMjk1OS45NiwgJ0c3JzogMzEzNS45NiwgJ0cjNyc6IDMzMjIuNDQsICdBNyc6IDM1MjAuMDAsXG4gICdBIzcnOiAzNzI5LjMxLCAnQjcnOiAzOTUxLjA3LCAnQzgnOiA0MTg2LjAxXG59XG5cbnZhciBub3RlcyA9IE9iamVjdC5rZXlzKHN0cjJmcmVxKVxuXG5mdW5jdGlvbiBpbnQyZnJlcShpbnROb3RlLCBvcHRpb25zKXtcbiAgdmFyIGluZGV4LCBzY2FsZTtcbiAgaWYoKGluZGV4ID0gbm90ZXMuaW5kZXhPZihvcHRpb25zLnRvbmljKSkgPT09IC0xKSB0aHJvdyAnd2hhdCBpcyB1cCB3aXRoIHRoYXQgdG9uaWM/J1xuICBpZighKHNjYWxlID0gc2NhbGVzW29wdGlvbnMuc2NhbGVdKSkgdGhyb3cgJ3doYXQgaXMgdXAgd2l0aCB0aGF0IHNjYWxlPydcbiAgd2hpbGUgKE1hdGguYWJzKGludE5vdGUpID4gc2NhbGUubGVuZ3RoKSBzY2FsZSA9IHNjYWxlLmNvbmNhdChzY2FsZSlcbiAgaWYoaW50Tm90ZSA+PSAwKSBmb3IgKHZhciBpID0gMDsgaSA8IGludE5vdGU7IGluZGV4ICs9IHNjYWxlW2ldLCBpKz0gMSApe31cbiAgZWxzZSBmb3IgKHZhciBqID0gLTE7IGogPj0gaW50Tm90ZTsgaW5kZXggLT0gc2NhbGVbc2NhbGUubGVuZ3RoICsgal0sIGotPSAxKXt9XG4gIHJldHVybiBzdHIyZnJlcVtub3Rlc1tpbmRleF1dXG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW50MmZyZXFcbm1vZHVsZS5leHBvcnRzLnNjYWxlcyA9IE9iamVjdC5rZXlzKHNjYWxlcylcbm1vZHVsZS5leHBvcnRzLm5vdGVzID0gT2JqZWN0LmtleXMobm90ZXMpIiwiLyoqXG4gKiBsb2Rhc2ggNC4yLjAgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCBqUXVlcnkgRm91bmRhdGlvbiBhbmQgb3RoZXIgY29udHJpYnV0b3JzIDxodHRwczovL2pxdWVyeS5vcmcvPlxuICogUmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICovXG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIGdlblRhZyA9ICdbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXSc7XG5cbi8qKlxuICogQXBwZW5kcyB0aGUgZWxlbWVudHMgb2YgYHZhbHVlc2AgdG8gYGFycmF5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7QXJyYXl9IHZhbHVlcyBUaGUgdmFsdWVzIHRvIGFwcGVuZC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBhcnJheVB1c2goYXJyYXksIHZhbHVlcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHZhbHVlcy5sZW5ndGgsXG4gICAgICBvZmZzZXQgPSBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBhcnJheVtvZmZzZXQgKyBpbmRleF0gPSB2YWx1ZXNbaW5kZXhdO1xuICB9XG4gIHJldHVybiBhcnJheTtcbn1cblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHByb3BlcnR5SXNFbnVtZXJhYmxlID0gb2JqZWN0UHJvdG8ucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZmxhdHRlbmAgd2l0aCBzdXBwb3J0IGZvciByZXN0cmljdGluZyBmbGF0dGVuaW5nLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gZmxhdHRlbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBkZXB0aCBUaGUgbWF4aW11bSByZWN1cnNpb24gZGVwdGguXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtwcmVkaWNhdGU9aXNGbGF0dGVuYWJsZV0gVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzU3RyaWN0XSBSZXN0cmljdCB0byB2YWx1ZXMgdGhhdCBwYXNzIGBwcmVkaWNhdGVgIGNoZWNrcy5cbiAqIEBwYXJhbSB7QXJyYXl9IFtyZXN1bHQ9W11dIFRoZSBpbml0aWFsIHJlc3VsdCB2YWx1ZS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGZsYXR0ZW5lZCBhcnJheS5cbiAqL1xuZnVuY3Rpb24gYmFzZUZsYXR0ZW4oYXJyYXksIGRlcHRoLCBwcmVkaWNhdGUsIGlzU3RyaWN0LCByZXN1bHQpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cbiAgcHJlZGljYXRlIHx8IChwcmVkaWNhdGUgPSBpc0ZsYXR0ZW5hYmxlKTtcbiAgcmVzdWx0IHx8IChyZXN1bHQgPSBbXSk7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgdmFsdWUgPSBhcnJheVtpbmRleF07XG4gICAgaWYgKGRlcHRoID4gMCAmJiBwcmVkaWNhdGUodmFsdWUpKSB7XG4gICAgICBpZiAoZGVwdGggPiAxKSB7XG4gICAgICAgIC8vIFJlY3Vyc2l2ZWx5IGZsYXR0ZW4gYXJyYXlzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgICAgIGJhc2VGbGF0dGVuKHZhbHVlLCBkZXB0aCAtIDEsIHByZWRpY2F0ZSwgaXNTdHJpY3QsIHJlc3VsdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhcnJheVB1c2gocmVzdWx0LCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICghaXNTdHJpY3QpIHtcbiAgICAgIHJlc3VsdFtyZXN1bHQubGVuZ3RoXSA9IHZhbHVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnByb3BlcnR5YCB3aXRob3V0IHN1cHBvcnQgZm9yIGRlZXAgcGF0aHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VQcm9wZXJ0eShrZXkpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHJldHVybiBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IG9iamVjdFtrZXldO1xuICB9O1xufVxuXG4vKipcbiAqIEdldHMgdGhlIFwibGVuZ3RoXCIgcHJvcGVydHkgdmFsdWUgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gaXMgdXNlZCB0byBhdm9pZCBhXG4gKiBbSklUIGJ1Z10oaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTE0Mjc5MikgdGhhdCBhZmZlY3RzXG4gKiBTYWZhcmkgb24gYXQgbGVhc3QgaU9TIDguMS04LjMgQVJNNjQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBcImxlbmd0aFwiIHZhbHVlLlxuICovXG52YXIgZ2V0TGVuZ3RoID0gYmFzZVByb3BlcnR5KCdsZW5ndGgnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIGZsYXR0ZW5hYmxlIGBhcmd1bWVudHNgIG9iamVjdCBvciBhcnJheS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBmbGF0dGVuYWJsZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0ZsYXR0ZW5hYmxlKHZhbHVlKSB7XG4gIHJldHVybiBpc0FycmF5TGlrZU9iamVjdCh2YWx1ZSkgJiYgKGlzQXJyYXkodmFsdWUpIHx8IGlzQXJndW1lbnRzKHZhbHVlKSk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGFuIGBhcmd1bWVudHNgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBjb3JyZWN0bHkgY2xhc3NpZmllZCxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcmd1bWVudHMoZnVuY3Rpb24oKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FyZ3VtZW50cyhbMSwgMiwgM10pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcmd1bWVudHModmFsdWUpIHtcbiAgLy8gU2FmYXJpIDguMSBpbmNvcnJlY3RseSBtYWtlcyBgYXJndW1lbnRzLmNhbGxlZWAgZW51bWVyYWJsZSBpbiBzdHJpY3QgbW9kZS5cbiAgcmV0dXJuIGlzQXJyYXlMaWtlT2JqZWN0KHZhbHVlKSAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCAnY2FsbGVlJykgJiZcbiAgICAoIXByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwodmFsdWUsICdjYWxsZWUnKSB8fCBvYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKSA9PSBhcmdzVGFnKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGFuIGBBcnJheWAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEB0eXBlIHtGdW5jdGlvbn1cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGNvcnJlY3RseSBjbGFzc2lmaWVkLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5KGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzQXJyYXkoJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzQXJyYXkoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLiBBIHZhbHVlIGlzIGNvbnNpZGVyZWQgYXJyYXktbGlrZSBpZiBpdCdzXG4gKiBub3QgYSBmdW5jdGlvbiBhbmQgaGFzIGEgYHZhbHVlLmxlbmd0aGAgdGhhdCdzIGFuIGludGVnZXIgZ3JlYXRlciB0aGFuIG9yXG4gKiBlcXVhbCB0byBgMGAgYW5kIGxlc3MgdGhhbiBvciBlcXVhbCB0byBgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZSgnYWJjJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUxpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgaXNMZW5ndGgoZ2V0TGVuZ3RoKHZhbHVlKSkgJiYgIWlzRnVuY3Rpb24odmFsdWUpO1xufVxuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8uaXNBcnJheUxpa2VgIGV4Y2VwdCB0aGF0IGl0IGFsc28gY2hlY2tzIGlmIGB2YWx1ZWBcbiAqIGlzIGFuIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBhcnJheS1saWtlIG9iamVjdCxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheUxpa2VPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlT2JqZWN0KGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2VPYmplY3QoJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzQXJyYXlMaWtlT2JqZWN0KF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5TGlrZU9iamVjdCh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBpc0FycmF5TGlrZSh2YWx1ZSk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBGdW5jdGlvbmAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGNvcnJlY3RseSBjbGFzc2lmaWVkLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0Z1bmN0aW9uKF8pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNGdW5jdGlvbigvYWJjLyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gIC8vIFRoZSB1c2Ugb2YgYE9iamVjdCN0b1N0cmluZ2AgYXZvaWRzIGlzc3VlcyB3aXRoIHRoZSBgdHlwZW9mYCBvcGVyYXRvclxuICAvLyBpbiBTYWZhcmkgOCB3aGljaCByZXR1cm5zICdvYmplY3QnIGZvciB0eXBlZCBhcnJheSBhbmQgd2VhayBtYXAgY29uc3RydWN0b3JzLFxuICAvLyBhbmQgUGhhbnRvbUpTIDEuOSB3aGljaCByZXR1cm5zICdmdW5jdGlvbicgZm9yIGBOb2RlTGlzdGAgaW5zdGFuY2VzLlxuICB2YXIgdGFnID0gaXNPYmplY3QodmFsdWUpID8gb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSkgOiAnJztcbiAgcmV0dXJuIHRhZyA9PSBmdW5jVGFnIHx8IHRhZyA9PSBnZW5UYWc7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGxlbmd0aC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBpcyBsb29zZWx5IGJhc2VkIG9uXG4gKiBbYFRvTGVuZ3RoYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtdG9sZW5ndGgpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgbGVuZ3RoLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0xlbmd0aCgzKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTGVuZ3RoKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzTGVuZ3RoKEluZmluaXR5KTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aCgnMycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNMZW5ndGgodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyAmJlxuICAgIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPD0gTUFYX1NBRkVfSU5URUdFUjtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGVcbiAqIFtsYW5ndWFnZSB0eXBlXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtZWNtYXNjcmlwdC1sYW5ndWFnZS10eXBlcylcbiAqIG9mIGBPYmplY3RgLiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoXy5ub29wKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiAhIXZhbHVlICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgXG4gKiBhbmQgaGFzIGEgYHR5cGVvZmAgcmVzdWx0IG9mIFwib2JqZWN0XCIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdExpa2Uoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc09iamVjdExpa2UobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VGbGF0dGVuO1xuIiwiLyoqXG4gKiBsb2Rhc2ggNC4wLjAgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTYgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4zIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNiBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnNsaWNlYCB3aXRob3V0IGFuIGl0ZXJhdGVlIGNhbGwgZ3VhcmQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBzbGljZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9MF0gVGhlIHN0YXJ0IHBvc2l0aW9uLlxuICogQHBhcmFtIHtudW1iZXJ9IFtlbmQ9YXJyYXkubGVuZ3RoXSBUaGUgZW5kIHBvc2l0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBzbGljZSBvZiBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBiYXNlU2xpY2UoYXJyYXksIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cbiAgaWYgKHN0YXJ0IDwgMCkge1xuICAgIHN0YXJ0ID0gLXN0YXJ0ID4gbGVuZ3RoID8gMCA6IChsZW5ndGggKyBzdGFydCk7XG4gIH1cbiAgZW5kID0gZW5kID4gbGVuZ3RoID8gbGVuZ3RoIDogZW5kO1xuICBpZiAoZW5kIDwgMCkge1xuICAgIGVuZCArPSBsZW5ndGg7XG4gIH1cbiAgbGVuZ3RoID0gc3RhcnQgPiBlbmQgPyAwIDogKChlbmQgLSBzdGFydCkgPj4+IDApO1xuICBzdGFydCA+Pj49IDA7XG5cbiAgdmFyIHJlc3VsdCA9IEFycmF5KGxlbmd0aCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgcmVzdWx0W2luZGV4XSA9IGFycmF5W2luZGV4ICsgc3RhcnRdO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVNsaWNlO1xuIiwiLyoqXG4gKiBsb2Rhc2ggNC41LjEgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTYgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4zIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNiBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xudmFyIFNldENhY2hlID0gcmVxdWlyZSgnbG9kYXNoLl9zZXRjYWNoZScpLFxuICAgIGNyZWF0ZVNldCA9IHJlcXVpcmUoJ2xvZGFzaC5fY3JlYXRlc2V0Jyk7XG5cbi8qKiBVc2VkIGFzIHRoZSBzaXplIHRvIGVuYWJsZSBsYXJnZSBhcnJheSBvcHRpbWl6YXRpb25zLiAqL1xudmFyIExBUkdFX0FSUkFZX1NJWkUgPSAyMDA7XG5cbi8qKiBVc2VkIHRvIHN0YW5kLWluIGZvciBgdW5kZWZpbmVkYCBoYXNoIHZhbHVlcy4gKi9cbnZhciBIQVNIX1VOREVGSU5FRCA9ICdfX2xvZGFzaF9oYXNoX3VuZGVmaW5lZF9fJztcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8uaW5jbHVkZXNgIGZvciBhcnJheXMgd2l0aG91dCBzdXBwb3J0IGZvclxuICogc3BlY2lmeWluZyBhbiBpbmRleCB0byBzZWFyY2ggZnJvbS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIHNlYXJjaC5cbiAqIEBwYXJhbSB7Kn0gdGFyZ2V0IFRoZSB2YWx1ZSB0byBzZWFyY2ggZm9yLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB0YXJnZXRgIGlzIGZvdW5kLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGFycmF5SW5jbHVkZXMoYXJyYXksIHZhbHVlKSB7XG4gIHJldHVybiAhIWFycmF5Lmxlbmd0aCAmJiBiYXNlSW5kZXhPZihhcnJheSwgdmFsdWUsIDApID4gLTE7XG59XG5cbi8qKlxuICogVGhpcyBmdW5jdGlvbiBpcyBsaWtlIGBhcnJheUluY2x1ZGVzYCBleGNlcHQgdGhhdCBpdCBhY2NlcHRzIGEgY29tcGFyYXRvci5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIHNlYXJjaC5cbiAqIEBwYXJhbSB7Kn0gdGFyZ2V0IFRoZSB2YWx1ZSB0byBzZWFyY2ggZm9yLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY29tcGFyYXRvciBUaGUgY29tcGFyYXRvciBpbnZva2VkIHBlciBlbGVtZW50LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB0YXJnZXRgIGlzIGZvdW5kLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGFycmF5SW5jbHVkZXNXaXRoKGFycmF5LCB2YWx1ZSwgY29tcGFyYXRvcikge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGlmIChjb21wYXJhdG9yKHZhbHVlLCBhcnJheVtpbmRleF0pKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmluZGV4T2ZgIHdpdGhvdXQgYGZyb21JbmRleGAgYm91bmRzIGNoZWNrcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIHNlYXJjaC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNlYXJjaCBmb3IuXG4gKiBAcGFyYW0ge251bWJlcn0gZnJvbUluZGV4IFRoZSBpbmRleCB0byBzZWFyY2ggZnJvbS5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJbmRleE9mKGFycmF5LCB2YWx1ZSwgZnJvbUluZGV4KSB7XG4gIGlmICh2YWx1ZSAhPT0gdmFsdWUpIHtcbiAgICByZXR1cm4gaW5kZXhPZk5hTihhcnJheSwgZnJvbUluZGV4KTtcbiAgfVxuICB2YXIgaW5kZXggPSBmcm9tSW5kZXggLSAxLFxuICAgICAgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgaWYgKGFycmF5W2luZGV4XSA9PT0gdmFsdWUpIHtcbiAgICAgIHJldHVybiBpbmRleDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIC0xO1xufVxuXG4vKipcbiAqIEdldHMgdGhlIGluZGV4IGF0IHdoaWNoIHRoZSBmaXJzdCBvY2N1cnJlbmNlIG9mIGBOYU5gIGlzIGZvdW5kIGluIGBhcnJheWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBzZWFyY2guXG4gKiBAcGFyYW0ge251bWJlcn0gZnJvbUluZGV4IFRoZSBpbmRleCB0byBzZWFyY2ggZnJvbS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Zyb21SaWdodF0gU3BlY2lmeSBpdGVyYXRpbmcgZnJvbSByaWdodCB0byBsZWZ0LlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG1hdGNoZWQgYE5hTmAsIGVsc2UgYC0xYC5cbiAqL1xuZnVuY3Rpb24gaW5kZXhPZk5hTihhcnJheSwgZnJvbUluZGV4LCBmcm9tUmlnaHQpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aCxcbiAgICAgIGluZGV4ID0gZnJvbUluZGV4ICsgKGZyb21SaWdodCA/IDAgOiAtMSk7XG5cbiAgd2hpbGUgKChmcm9tUmlnaHQgPyBpbmRleC0tIDogKytpbmRleCA8IGxlbmd0aCkpIHtcbiAgICB2YXIgb3RoZXIgPSBhcnJheVtpbmRleF07XG4gICAgaWYgKG90aGVyICE9PSBvdGhlcikge1xuICAgICAgcmV0dXJuIGluZGV4O1xuICAgIH1cbiAgfVxuICByZXR1cm4gLTE7XG59XG5cbi8qKlxuICogQ29udmVydHMgYHNldGAgdG8gYW4gYXJyYXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzZXQgVGhlIHNldCB0byBjb252ZXJ0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIHNldFRvQXJyYXkoc2V0KSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gQXJyYXkoc2V0LnNpemUpO1xuXG4gIHNldC5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmVzdWx0WysraW5kZXhdID0gdmFsdWU7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGluIGBjYWNoZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBjYWNoZSBUaGUgc2V0IGNhY2hlIHRvIHNlYXJjaC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNlYXJjaCBmb3IuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGZvdW5kLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGNhY2hlSGFzKGNhY2hlLCB2YWx1ZSkge1xuICB2YXIgbWFwID0gY2FjaGUuX19kYXRhX187XG4gIGlmIChpc0tleWFibGUodmFsdWUpKSB7XG4gICAgdmFyIGRhdGEgPSBtYXAuX19kYXRhX18sXG4gICAgICAgIGhhc2ggPSB0eXBlb2YgdmFsdWUgPT0gJ3N0cmluZycgPyBkYXRhLnN0cmluZyA6IGRhdGEuaGFzaDtcblxuICAgIHJldHVybiBoYXNoW3ZhbHVlXSA9PT0gSEFTSF9VTkRFRklORUQ7XG4gIH1cbiAgcmV0dXJuIG1hcC5oYXModmFsdWUpO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnVuaXFCeWAgd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtpdGVyYXRlZV0gVGhlIGl0ZXJhdGVlIGludm9rZWQgcGVyIGVsZW1lbnQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY29tcGFyYXRvcl0gVGhlIGNvbXBhcmF0b3IgaW52b2tlZCBwZXIgZWxlbWVudC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGR1cGxpY2F0ZSBmcmVlIGFycmF5LlxuICovXG5mdW5jdGlvbiBiYXNlVW5pcShhcnJheSwgaXRlcmF0ZWUsIGNvbXBhcmF0b3IpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBpbmNsdWRlcyA9IGFycmF5SW5jbHVkZXMsXG4gICAgICBsZW5ndGggPSBhcnJheS5sZW5ndGgsXG4gICAgICBpc0NvbW1vbiA9IHRydWUsXG4gICAgICByZXN1bHQgPSBbXSxcbiAgICAgIHNlZW4gPSByZXN1bHQ7XG5cbiAgaWYgKGNvbXBhcmF0b3IpIHtcbiAgICBpc0NvbW1vbiA9IGZhbHNlO1xuICAgIGluY2x1ZGVzID0gYXJyYXlJbmNsdWRlc1dpdGg7XG4gIH1cbiAgZWxzZSBpZiAobGVuZ3RoID49IExBUkdFX0FSUkFZX1NJWkUpIHtcbiAgICB2YXIgc2V0ID0gaXRlcmF0ZWUgPyBudWxsIDogY3JlYXRlU2V0KGFycmF5KTtcbiAgICBpZiAoc2V0KSB7XG4gICAgICByZXR1cm4gc2V0VG9BcnJheShzZXQpO1xuICAgIH1cbiAgICBpc0NvbW1vbiA9IGZhbHNlO1xuICAgIGluY2x1ZGVzID0gY2FjaGVIYXM7XG4gICAgc2VlbiA9IG5ldyBTZXRDYWNoZTtcbiAgfVxuICBlbHNlIHtcbiAgICBzZWVuID0gaXRlcmF0ZWUgPyBbXSA6IHJlc3VsdDtcbiAgfVxuICBvdXRlcjpcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgdmFsdWUgPSBhcnJheVtpbmRleF0sXG4gICAgICAgIGNvbXB1dGVkID0gaXRlcmF0ZWUgPyBpdGVyYXRlZSh2YWx1ZSkgOiB2YWx1ZTtcblxuICAgIGlmIChpc0NvbW1vbiAmJiBjb21wdXRlZCA9PT0gY29tcHV0ZWQpIHtcbiAgICAgIHZhciBzZWVuSW5kZXggPSBzZWVuLmxlbmd0aDtcbiAgICAgIHdoaWxlIChzZWVuSW5kZXgtLSkge1xuICAgICAgICBpZiAoc2VlbltzZWVuSW5kZXhdID09PSBjb21wdXRlZCkge1xuICAgICAgICAgIGNvbnRpbnVlIG91dGVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaXRlcmF0ZWUpIHtcbiAgICAgICAgc2Vlbi5wdXNoKGNvbXB1dGVkKTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoIWluY2x1ZGVzKHNlZW4sIGNvbXB1dGVkLCBjb21wYXJhdG9yKSkge1xuICAgICAgaWYgKHNlZW4gIT09IHJlc3VsdCkge1xuICAgICAgICBzZWVuLnB1c2goY29tcHV0ZWQpO1xuICAgICAgfVxuICAgICAgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHN1aXRhYmxlIGZvciB1c2UgYXMgdW5pcXVlIG9iamVjdCBrZXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgc3VpdGFibGUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNLZXlhYmxlKHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gdHlwZSA9PSAnbnVtYmVyJyB8fCB0eXBlID09ICdib29sZWFuJyB8fFxuICAgICh0eXBlID09ICdzdHJpbmcnICYmIHZhbHVlICE9ICdfX3Byb3RvX18nKSB8fCB2YWx1ZSA9PSBudWxsO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VVbmlxO1xuIiwiLyoqXG4gKiBsb2Rhc2ggNC4wLjIgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCBqUXVlcnkgRm91bmRhdGlvbiBhbmQgb3RoZXIgY29udHJpYnV0b3JzIDxodHRwczovL2pxdWVyeS5vcmcvPlxuICogUmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICovXG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcbiAgICBnZW5UYWcgPSAnW29iamVjdCBHZW5lcmF0b3JGdW5jdGlvbl0nO1xuXG4vKipcbiAqIFVzZWQgdG8gbWF0Y2ggYFJlZ0V4cGBcbiAqIFtzeW50YXggY2hhcmFjdGVyc10oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtcGF0dGVybnMpLlxuICovXG52YXIgcmVSZWdFeHBDaGFyID0gL1tcXFxcXiQuKis/KClbXFxde318XS9nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaG9zdCBjb25zdHJ1Y3RvcnMgKFNhZmFyaSkuICovXG52YXIgcmVJc0hvc3RDdG9yID0gL15cXFtvYmplY3QgLis/Q29uc3RydWN0b3JcXF0kLztcblxuLyoqIFVzZWQgdG8gZGV0ZXJtaW5lIGlmIHZhbHVlcyBhcmUgb2YgdGhlIGxhbmd1YWdlIHR5cGUgYE9iamVjdGAuICovXG52YXIgb2JqZWN0VHlwZXMgPSB7XG4gICdmdW5jdGlvbic6IHRydWUsXG4gICdvYmplY3QnOiB0cnVlXG59O1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGV4cG9ydHNgLiAqL1xudmFyIGZyZWVFeHBvcnRzID0gKG9iamVjdFR5cGVzW3R5cGVvZiBleHBvcnRzXSAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlKVxuICA/IGV4cG9ydHNcbiAgOiB1bmRlZmluZWQ7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYC4gKi9cbnZhciBmcmVlTW9kdWxlID0gKG9iamVjdFR5cGVzW3R5cGVvZiBtb2R1bGVdICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlKVxuICA/IG1vZHVsZVxuICA6IHVuZGVmaW5lZDtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBnbG9iYWxgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlR2xvYmFsID0gY2hlY2tHbG9iYWwoZnJlZUV4cG9ydHMgJiYgZnJlZU1vZHVsZSAmJiB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbCk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgc2VsZmAuICovXG52YXIgZnJlZVNlbGYgPSBjaGVja0dsb2JhbChvYmplY3RUeXBlc1t0eXBlb2Ygc2VsZl0gJiYgc2VsZik7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgd2luZG93YC4gKi9cbnZhciBmcmVlV2luZG93ID0gY2hlY2tHbG9iYWwob2JqZWN0VHlwZXNbdHlwZW9mIHdpbmRvd10gJiYgd2luZG93KTtcblxuLyoqIERldGVjdCBgdGhpc2AgYXMgdGhlIGdsb2JhbCBvYmplY3QuICovXG52YXIgdGhpc0dsb2JhbCA9IGNoZWNrR2xvYmFsKG9iamVjdFR5cGVzW3R5cGVvZiB0aGlzXSAmJiB0aGlzKTtcblxuLyoqXG4gKiBVc2VkIGFzIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0LlxuICpcbiAqIFRoZSBgdGhpc2AgdmFsdWUgaXMgdXNlZCBpZiBpdCdzIHRoZSBnbG9iYWwgb2JqZWN0IHRvIGF2b2lkIEdyZWFzZW1vbmtleSdzXG4gKiByZXN0cmljdGVkIGB3aW5kb3dgIG9iamVjdCwgb3RoZXJ3aXNlIHRoZSBgd2luZG93YCBvYmplY3QgaXMgdXNlZC5cbiAqL1xudmFyIHJvb3QgPSBmcmVlR2xvYmFsIHx8XG4gICgoZnJlZVdpbmRvdyAhPT0gKHRoaXNHbG9iYWwgJiYgdGhpc0dsb2JhbC53aW5kb3cpKSAmJiBmcmVlV2luZG93KSB8fFxuICAgIGZyZWVTZWxmIHx8IHRoaXNHbG9iYWwgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIGdsb2JhbCBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge251bGx8T2JqZWN0fSBSZXR1cm5zIGB2YWx1ZWAgaWYgaXQncyBhIGdsb2JhbCBvYmplY3QsIGVsc2UgYG51bGxgLlxuICovXG5mdW5jdGlvbiBjaGVja0dsb2JhbCh2YWx1ZSkge1xuICByZXR1cm4gKHZhbHVlICYmIHZhbHVlLk9iamVjdCA9PT0gT2JqZWN0KSA/IHZhbHVlIDogbnVsbDtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIGhvc3Qgb2JqZWN0IGluIElFIDwgOS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIGhvc3Qgb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSG9zdE9iamVjdCh2YWx1ZSkge1xuICAvLyBNYW55IGhvc3Qgb2JqZWN0cyBhcmUgYE9iamVjdGAgb2JqZWN0cyB0aGF0IGNhbiBjb2VyY2UgdG8gc3RyaW5nc1xuICAvLyBkZXNwaXRlIGhhdmluZyBpbXByb3Blcmx5IGRlZmluZWQgYHRvU3RyaW5nYCBtZXRob2RzLlxuICB2YXIgcmVzdWx0ID0gZmFsc2U7XG4gIGlmICh2YWx1ZSAhPSBudWxsICYmIHR5cGVvZiB2YWx1ZS50b1N0cmluZyAhPSAnZnVuY3Rpb24nKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJlc3VsdCA9ICEhKHZhbHVlICsgJycpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZ1bmNUb1N0cmluZyA9IEZ1bmN0aW9uLnByb3RvdHlwZS50b1N0cmluZztcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBpZiBhIG1ldGhvZCBpcyBuYXRpdmUuICovXG52YXIgcmVJc05hdGl2ZSA9IFJlZ0V4cCgnXicgK1xuICBmdW5jVG9TdHJpbmcuY2FsbChoYXNPd25Qcm9wZXJ0eSkucmVwbGFjZShyZVJlZ0V4cENoYXIsICdcXFxcJCYnKVxuICAucmVwbGFjZSgvaGFzT3duUHJvcGVydHl8KGZ1bmN0aW9uKS4qPyg/PVxcXFxcXCgpfCBmb3IgLis/KD89XFxcXFxcXSkvZywgJyQxLio/JykgKyAnJCdcbik7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBTZXQgPSBnZXROYXRpdmUocm9vdCwgJ1NldCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBzZXQgb2YgYHZhbHVlc2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IHZhbHVlcyBUaGUgdmFsdWVzIHRvIGFkZCB0byB0aGUgc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbmV3IHNldC5cbiAqL1xudmFyIGNyZWF0ZVNldCA9ICEoU2V0ICYmIG5ldyBTZXQoWzEsIDJdKS5zaXplID09PSAyKSA/IG5vb3AgOiBmdW5jdGlvbih2YWx1ZXMpIHtcbiAgcmV0dXJuIG5ldyBTZXQodmFsdWVzKTtcbn07XG5cbi8qKlxuICogR2V0cyB0aGUgbmF0aXZlIGZ1bmN0aW9uIGF0IGBrZXlgIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIG1ldGhvZCB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZnVuY3Rpb24gaWYgaXQncyBuYXRpdmUsIGVsc2UgYHVuZGVmaW5lZGAuXG4gKi9cbmZ1bmN0aW9uIGdldE5hdGl2ZShvYmplY3QsIGtleSkge1xuICB2YXIgdmFsdWUgPSBvYmplY3Rba2V5XTtcbiAgcmV0dXJuIGlzTmF0aXZlKHZhbHVlKSA/IHZhbHVlIDogdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGBmdW5jYCB0byBpdHMgc291cmNlIGNvZGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHByb2Nlc3MuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBzb3VyY2UgY29kZS5cbiAqL1xuZnVuY3Rpb24gdG9Tb3VyY2UoZnVuYykge1xuICBpZiAoZnVuYyAhPSBudWxsKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBmdW5jVG9TdHJpbmcuY2FsbChmdW5jKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gKGZ1bmMgKyAnJyk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgfVxuICByZXR1cm4gJyc7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBGdW5jdGlvbmAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGNvcnJlY3RseSBjbGFzc2lmaWVkLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0Z1bmN0aW9uKF8pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNGdW5jdGlvbigvYWJjLyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gIC8vIFRoZSB1c2Ugb2YgYE9iamVjdCN0b1N0cmluZ2AgYXZvaWRzIGlzc3VlcyB3aXRoIHRoZSBgdHlwZW9mYCBvcGVyYXRvclxuICAvLyBpbiBTYWZhcmkgOCB3aGljaCByZXR1cm5zICdvYmplY3QnIGZvciB0eXBlZCBhcnJheSBhbmQgd2VhayBtYXAgY29uc3RydWN0b3JzLFxuICAvLyBhbmQgUGhhbnRvbUpTIDEuOSB3aGljaCByZXR1cm5zICdmdW5jdGlvbicgZm9yIGBOb2RlTGlzdGAgaW5zdGFuY2VzLlxuICB2YXIgdGFnID0gaXNPYmplY3QodmFsdWUpID8gb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSkgOiAnJztcbiAgcmV0dXJuIHRhZyA9PSBmdW5jVGFnIHx8IHRhZyA9PSBnZW5UYWc7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlXG4gKiBbbGFuZ3VhZ2UgdHlwZV0oaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLWVjbWFzY3JpcHQtbGFuZ3VhZ2UtdHlwZXMpXG4gKiBvZiBgT2JqZWN0YC4gKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KF8ubm9vcCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gISF2YWx1ZSAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgbmF0aXZlIGZ1bmN0aW9uLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgbmF0aXZlIGZ1bmN0aW9uLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc05hdGl2ZShBcnJheS5wcm90b3R5cGUucHVzaCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc05hdGl2ZShfKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTmF0aXZlKHZhbHVlKSB7XG4gIGlmICghaXNPYmplY3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBwYXR0ZXJuID0gKGlzRnVuY3Rpb24odmFsdWUpIHx8IGlzSG9zdE9iamVjdCh2YWx1ZSkpID8gcmVJc05hdGl2ZSA6IHJlSXNIb3N0Q3RvcjtcbiAgcmV0dXJuIHBhdHRlcm4udGVzdCh0b1NvdXJjZSh2YWx1ZSkpO1xufVxuXG4vKipcbiAqIEEgbm8tb3BlcmF0aW9uIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBgdW5kZWZpbmVkYCByZWdhcmRsZXNzIG9mIHRoZVxuICogYXJndW1lbnRzIGl0IHJlY2VpdmVzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMi4zLjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICd1c2VyJzogJ2ZyZWQnIH07XG4gKlxuICogXy5ub29wKG9iamVjdCkgPT09IHVuZGVmaW5lZDtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gbm9vcCgpIHtcbiAgLy8gTm8gb3BlcmF0aW9uIHBlcmZvcm1lZC5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVTZXQ7XG4iLCIvKipcbiAqIGxvZGFzaCA0LjEuMyAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IGpRdWVyeSBGb3VuZGF0aW9uIGFuZCBvdGhlciBjb250cmlidXRvcnMgPGh0dHBzOi8vanF1ZXJ5Lm9yZy8+XG4gKiBSZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4zIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKi9cblxuLyoqIFVzZWQgdG8gc3RhbmQtaW4gZm9yIGB1bmRlZmluZWRgIGhhc2ggdmFsdWVzLiAqL1xudmFyIEhBU0hfVU5ERUZJTkVEID0gJ19fbG9kYXNoX2hhc2hfdW5kZWZpbmVkX18nO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgZ2VuVGFnID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJztcblxuLyoqXG4gKiBVc2VkIHRvIG1hdGNoIGBSZWdFeHBgXG4gKiBbc3ludGF4IGNoYXJhY3RlcnNdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLXBhdHRlcm5zKS5cbiAqL1xudmFyIHJlUmVnRXhwQ2hhciA9IC9bXFxcXF4kLiorPygpW1xcXXt9fF0vZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGhvc3QgY29uc3RydWN0b3JzIChTYWZhcmkpLiAqL1xudmFyIHJlSXNIb3N0Q3RvciA9IC9eXFxbb2JqZWN0IC4rP0NvbnN0cnVjdG9yXFxdJC87XG5cbi8qKiBVc2VkIHRvIGRldGVybWluZSBpZiB2YWx1ZXMgYXJlIG9mIHRoZSBsYW5ndWFnZSB0eXBlIGBPYmplY3RgLiAqL1xudmFyIG9iamVjdFR5cGVzID0ge1xuICAnZnVuY3Rpb24nOiB0cnVlLFxuICAnb2JqZWN0JzogdHJ1ZVxufTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYC4gKi9cbnZhciBmcmVlRXhwb3J0cyA9IChvYmplY3RUeXBlc1t0eXBlb2YgZXhwb3J0c10gJiYgZXhwb3J0cyAmJiAhZXhwb3J0cy5ub2RlVHlwZSlcbiAgPyBleHBvcnRzXG4gIDogdW5kZWZpbmVkO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYG1vZHVsZWAuICovXG52YXIgZnJlZU1vZHVsZSA9IChvYmplY3RUeXBlc1t0eXBlb2YgbW9kdWxlXSAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSlcbiAgPyBtb2R1bGVcbiAgOiB1bmRlZmluZWQ7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZUdsb2JhbCA9IGNoZWNrR2xvYmFsKGZyZWVFeHBvcnRzICYmIGZyZWVNb2R1bGUgJiYgdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwpO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHNlbGZgLiAqL1xudmFyIGZyZWVTZWxmID0gY2hlY2tHbG9iYWwob2JqZWN0VHlwZXNbdHlwZW9mIHNlbGZdICYmIHNlbGYpO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHdpbmRvd2AuICovXG52YXIgZnJlZVdpbmRvdyA9IGNoZWNrR2xvYmFsKG9iamVjdFR5cGVzW3R5cGVvZiB3aW5kb3ddICYmIHdpbmRvdyk7XG5cbi8qKiBEZXRlY3QgYHRoaXNgIGFzIHRoZSBnbG9iYWwgb2JqZWN0LiAqL1xudmFyIHRoaXNHbG9iYWwgPSBjaGVja0dsb2JhbChvYmplY3RUeXBlc1t0eXBlb2YgdGhpc10gJiYgdGhpcyk7XG5cbi8qKlxuICogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdC5cbiAqXG4gKiBUaGUgYHRoaXNgIHZhbHVlIGlzIHVzZWQgaWYgaXQncyB0aGUgZ2xvYmFsIG9iamVjdCB0byBhdm9pZCBHcmVhc2Vtb25rZXknc1xuICogcmVzdHJpY3RlZCBgd2luZG93YCBvYmplY3QsIG90aGVyd2lzZSB0aGUgYHdpbmRvd2Agb2JqZWN0IGlzIHVzZWQuXG4gKi9cbnZhciByb290ID0gZnJlZUdsb2JhbCB8fFxuICAoKGZyZWVXaW5kb3cgIT09ICh0aGlzR2xvYmFsICYmIHRoaXNHbG9iYWwud2luZG93KSkgJiYgZnJlZVdpbmRvdykgfHxcbiAgICBmcmVlU2VsZiB8fCB0aGlzR2xvYmFsIHx8IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBnbG9iYWwgb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtudWxsfE9iamVjdH0gUmV0dXJucyBgdmFsdWVgIGlmIGl0J3MgYSBnbG9iYWwgb2JqZWN0LCBlbHNlIGBudWxsYC5cbiAqL1xuZnVuY3Rpb24gY2hlY2tHbG9iYWwodmFsdWUpIHtcbiAgcmV0dXJuICh2YWx1ZSAmJiB2YWx1ZS5PYmplY3QgPT09IE9iamVjdCkgPyB2YWx1ZSA6IG51bGw7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBob3N0IG9iamVjdCBpbiBJRSA8IDkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBob3N0IG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0hvc3RPYmplY3QodmFsdWUpIHtcbiAgLy8gTWFueSBob3N0IG9iamVjdHMgYXJlIGBPYmplY3RgIG9iamVjdHMgdGhhdCBjYW4gY29lcmNlIHRvIHN0cmluZ3NcbiAgLy8gZGVzcGl0ZSBoYXZpbmcgaW1wcm9wZXJseSBkZWZpbmVkIGB0b1N0cmluZ2AgbWV0aG9kcy5cbiAgdmFyIHJlc3VsdCA9IGZhbHNlO1xuICBpZiAodmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUudG9TdHJpbmcgIT0gJ2Z1bmN0aW9uJykge1xuICAgIHRyeSB7XG4gICAgICByZXN1bHQgPSAhISh2YWx1ZSArICcnKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBhcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlLFxuICAgIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZ1bmNUb1N0cmluZyA9IEZ1bmN0aW9uLnByb3RvdHlwZS50b1N0cmluZztcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBpZiBhIG1ldGhvZCBpcyBuYXRpdmUuICovXG52YXIgcmVJc05hdGl2ZSA9IFJlZ0V4cCgnXicgK1xuICBmdW5jVG9TdHJpbmcuY2FsbChoYXNPd25Qcm9wZXJ0eSkucmVwbGFjZShyZVJlZ0V4cENoYXIsICdcXFxcJCYnKVxuICAucmVwbGFjZSgvaGFzT3duUHJvcGVydHl8KGZ1bmN0aW9uKS4qPyg/PVxcXFxcXCgpfCBmb3IgLis/KD89XFxcXFxcXSkvZywgJyQxLio/JykgKyAnJCdcbik7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHNwbGljZSA9IGFycmF5UHJvdG8uc3BsaWNlO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgTWFwID0gZ2V0TmF0aXZlKHJvb3QsICdNYXAnKSxcbiAgICBuYXRpdmVDcmVhdGUgPSBnZXROYXRpdmUoT2JqZWN0LCAnY3JlYXRlJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGhhc2ggb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG5ldyBoYXNoIG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gSGFzaCgpIHt9XG5cbi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIGhhc2guXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBoYXNoIFRoZSBoYXNoIHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBoYXNoRGVsZXRlKGhhc2gsIGtleSkge1xuICByZXR1cm4gaGFzaEhhcyhoYXNoLCBrZXkpICYmIGRlbGV0ZSBoYXNoW2tleV07XG59XG5cbi8qKlxuICogR2V0cyB0aGUgaGFzaCB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBoYXNoIFRoZSBoYXNoIHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGhhc2hHZXQoaGFzaCwga2V5KSB7XG4gIGlmIChuYXRpdmVDcmVhdGUpIHtcbiAgICB2YXIgcmVzdWx0ID0gaGFzaFtrZXldO1xuICAgIHJldHVybiByZXN1bHQgPT09IEhBU0hfVU5ERUZJTkVEID8gdW5kZWZpbmVkIDogcmVzdWx0O1xuICB9XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGhhc2gsIGtleSkgPyBoYXNoW2tleV0gOiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgaGFzaCB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gaGFzaCBUaGUgaGFzaCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBoYXNoSGFzKGhhc2gsIGtleSkge1xuICByZXR1cm4gbmF0aXZlQ3JlYXRlID8gaGFzaFtrZXldICE9PSB1bmRlZmluZWQgOiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGhhc2gsIGtleSk7XG59XG5cbi8qKlxuICogU2V0cyB0aGUgaGFzaCBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gaGFzaCBUaGUgaGFzaCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqL1xuZnVuY3Rpb24gaGFzaFNldChoYXNoLCBrZXksIHZhbHVlKSB7XG4gIGhhc2hba2V5XSA9IChuYXRpdmVDcmVhdGUgJiYgdmFsdWUgPT09IHVuZGVmaW5lZCkgPyBIQVNIX1VOREVGSU5FRCA6IHZhbHVlO1xufVxuXG4vLyBBdm9pZCBpbmhlcml0aW5nIGZyb20gYE9iamVjdC5wcm90b3R5cGVgIHdoZW4gcG9zc2libGUuXG5IYXNoLnByb3RvdHlwZSA9IG5hdGl2ZUNyZWF0ZSA/IG5hdGl2ZUNyZWF0ZShudWxsKSA6IG9iamVjdFByb3RvO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBtYXAgY2FjaGUgb2JqZWN0IHRvIHN0b3JlIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbdmFsdWVzXSBUaGUgdmFsdWVzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBNYXBDYWNoZSh2YWx1ZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSB2YWx1ZXMgPyB2YWx1ZXMubGVuZ3RoIDogMDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gdmFsdWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgbWFwLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKi9cbmZ1bmN0aW9uIG1hcENsZWFyKCkge1xuICB0aGlzLl9fZGF0YV9fID0ge1xuICAgICdoYXNoJzogbmV3IEhhc2gsXG4gICAgJ21hcCc6IE1hcCA/IG5ldyBNYXAgOiBbXSxcbiAgICAnc3RyaW5nJzogbmV3IEhhc2hcbiAgfTtcbn1cblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgbWFwLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIG1hcERlbGV0ZShrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICBpZiAoaXNLZXlhYmxlKGtleSkpIHtcbiAgICByZXR1cm4gaGFzaERlbGV0ZSh0eXBlb2Yga2V5ID09ICdzdHJpbmcnID8gZGF0YS5zdHJpbmcgOiBkYXRhLmhhc2gsIGtleSk7XG4gIH1cbiAgcmV0dXJuIE1hcCA/IGRhdGEubWFwWydkZWxldGUnXShrZXkpIDogYXNzb2NEZWxldGUoZGF0YS5tYXAsIGtleSk7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgbWFwIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBtYXBHZXQoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgaWYgKGlzS2V5YWJsZShrZXkpKSB7XG4gICAgcmV0dXJuIGhhc2hHZXQodHlwZW9mIGtleSA9PSAnc3RyaW5nJyA/IGRhdGEuc3RyaW5nIDogZGF0YS5oYXNoLCBrZXkpO1xuICB9XG4gIHJldHVybiBNYXAgPyBkYXRhLm1hcC5nZXQoa2V5KSA6IGFzc29jR2V0KGRhdGEubWFwLCBrZXkpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBhIG1hcCB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIG1hcEhhcyhrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICBpZiAoaXNLZXlhYmxlKGtleSkpIHtcbiAgICByZXR1cm4gaGFzaEhhcyh0eXBlb2Yga2V5ID09ICdzdHJpbmcnID8gZGF0YS5zdHJpbmcgOiBkYXRhLmhhc2gsIGtleSk7XG4gIH1cbiAgcmV0dXJuIE1hcCA/IGRhdGEubWFwLmhhcyhrZXkpIDogYXNzb2NIYXMoZGF0YS5tYXAsIGtleSk7XG59XG5cbi8qKlxuICogU2V0cyB0aGUgbWFwIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG1hcCBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gbWFwU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICBpZiAoaXNLZXlhYmxlKGtleSkpIHtcbiAgICBoYXNoU2V0KHR5cGVvZiBrZXkgPT0gJ3N0cmluZycgPyBkYXRhLnN0cmluZyA6IGRhdGEuaGFzaCwga2V5LCB2YWx1ZSk7XG4gIH0gZWxzZSBpZiAoTWFwKSB7XG4gICAgZGF0YS5tYXAuc2V0KGtleSwgdmFsdWUpO1xuICB9IGVsc2Uge1xuICAgIGFzc29jU2V0KGRhdGEubWFwLCBrZXksIHZhbHVlKTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYE1hcENhY2hlYC5cbk1hcENhY2hlLnByb3RvdHlwZS5jbGVhciA9IG1hcENsZWFyO1xuTWFwQ2FjaGUucHJvdG90eXBlWydkZWxldGUnXSA9IG1hcERlbGV0ZTtcbk1hcENhY2hlLnByb3RvdHlwZS5nZXQgPSBtYXBHZXQ7XG5NYXBDYWNoZS5wcm90b3R5cGUuaGFzID0gbWFwSGFzO1xuTWFwQ2FjaGUucHJvdG90eXBlLnNldCA9IG1hcFNldDtcblxuLyoqXG4gKlxuICogQ3JlYXRlcyBhIHNldCBjYWNoZSBvYmplY3QgdG8gc3RvcmUgdW5pcXVlIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbdmFsdWVzXSBUaGUgdmFsdWVzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBTZXRDYWNoZSh2YWx1ZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSB2YWx1ZXMgPyB2YWx1ZXMubGVuZ3RoIDogMDtcblxuICB0aGlzLl9fZGF0YV9fID0gbmV3IE1hcENhY2hlO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHRoaXMucHVzaCh2YWx1ZXNbaW5kZXhdKTtcbiAgfVxufVxuXG4vKipcbiAqIEFkZHMgYHZhbHVlYCB0byB0aGUgc2V0IGNhY2hlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBwdXNoXG4gKiBAbWVtYmVyT2YgU2V0Q2FjaGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBjYWNoZVB1c2godmFsdWUpIHtcbiAgdmFyIG1hcCA9IHRoaXMuX19kYXRhX187XG4gIGlmIChpc0tleWFibGUodmFsdWUpKSB7XG4gICAgdmFyIGRhdGEgPSBtYXAuX19kYXRhX18sXG4gICAgICAgIGhhc2ggPSB0eXBlb2YgdmFsdWUgPT0gJ3N0cmluZycgPyBkYXRhLnN0cmluZyA6IGRhdGEuaGFzaDtcblxuICAgIGhhc2hbdmFsdWVdID0gSEFTSF9VTkRFRklORUQ7XG4gIH1cbiAgZWxzZSB7XG4gICAgbWFwLnNldCh2YWx1ZSwgSEFTSF9VTkRFRklORUQpO1xuICB9XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBTZXRDYWNoZWAuXG5TZXRDYWNoZS5wcm90b3R5cGUucHVzaCA9IGNhY2hlUHVzaDtcblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgYXNzb2NpYXRpdmUgYXJyYXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYXNzb2NEZWxldGUoYXJyYXksIGtleSkge1xuICB2YXIgaW5kZXggPSBhc3NvY0luZGV4T2YoYXJyYXksIGtleSk7XG4gIGlmIChpbmRleCA8IDApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIGxhc3RJbmRleCA9IGFycmF5Lmxlbmd0aCAtIDE7XG4gIGlmIChpbmRleCA9PSBsYXN0SW5kZXgpIHtcbiAgICBhcnJheS5wb3AoKTtcbiAgfSBlbHNlIHtcbiAgICBzcGxpY2UuY2FsbChhcnJheSwgaW5kZXgsIDEpO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqIEdldHMgdGhlIGFzc29jaWF0aXZlIGFycmF5IHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGFzc29jR2V0KGFycmF5LCBrZXkpIHtcbiAgdmFyIGluZGV4ID0gYXNzb2NJbmRleE9mKGFycmF5LCBrZXkpO1xuICByZXR1cm4gaW5kZXggPCAwID8gdW5kZWZpbmVkIDogYXJyYXlbaW5kZXhdWzFdO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBhbiBhc3NvY2lhdGl2ZSBhcnJheSB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYXNzb2NIYXMoYXJyYXksIGtleSkge1xuICByZXR1cm4gYXNzb2NJbmRleE9mKGFycmF5LCBrZXkpID4gLTE7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgaW5kZXggYXQgd2hpY2ggdGhlIGBrZXlgIGlzIGZvdW5kIGluIGBhcnJheWAgb2Yga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gc2VhcmNoLlxuICogQHBhcmFtIHsqfSBrZXkgVGhlIGtleSB0byBzZWFyY2ggZm9yLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG1hdGNoZWQgdmFsdWUsIGVsc2UgYC0xYC5cbiAqL1xuZnVuY3Rpb24gYXNzb2NJbmRleE9mKGFycmF5LCBrZXkpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcbiAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgaWYgKGVxKGFycmF5W2xlbmd0aF1bMF0sIGtleSkpIHtcbiAgICAgIHJldHVybiBsZW5ndGg7XG4gICAgfVxuICB9XG4gIHJldHVybiAtMTtcbn1cblxuLyoqXG4gKiBTZXRzIHRoZSBhc3NvY2lhdGl2ZSBhcnJheSBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKi9cbmZ1bmN0aW9uIGFzc29jU2V0KGFycmF5LCBrZXksIHZhbHVlKSB7XG4gIHZhciBpbmRleCA9IGFzc29jSW5kZXhPZihhcnJheSwga2V5KTtcbiAgaWYgKGluZGV4IDwgMCkge1xuICAgIGFycmF5LnB1c2goW2tleSwgdmFsdWVdKTtcbiAgfSBlbHNlIHtcbiAgICBhcnJheVtpbmRleF1bMV0gPSB2YWx1ZTtcbiAgfVxufVxuXG4vKipcbiAqIEdldHMgdGhlIG5hdGl2ZSBmdW5jdGlvbiBhdCBga2V5YCBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBtZXRob2QgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGZ1bmN0aW9uIGlmIGl0J3MgbmF0aXZlLCBlbHNlIGB1bmRlZmluZWRgLlxuICovXG5mdW5jdGlvbiBnZXROYXRpdmUob2JqZWN0LCBrZXkpIHtcbiAgdmFyIHZhbHVlID0gb2JqZWN0W2tleV07XG4gIHJldHVybiBpc05hdGl2ZSh2YWx1ZSkgPyB2YWx1ZSA6IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBzdWl0YWJsZSBmb3IgdXNlIGFzIHVuaXF1ZSBvYmplY3Qga2V5LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIHN1aXRhYmxlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzS2V5YWJsZSh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuIHR5cGUgPT0gJ251bWJlcicgfHwgdHlwZSA9PSAnYm9vbGVhbicgfHxcbiAgICAodHlwZSA9PSAnc3RyaW5nJyAmJiB2YWx1ZSAhPSAnX19wcm90b19fJykgfHwgdmFsdWUgPT0gbnVsbDtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBgZnVuY2AgdG8gaXRzIHNvdXJjZSBjb2RlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBwcm9jZXNzLlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgc291cmNlIGNvZGUuXG4gKi9cbmZ1bmN0aW9uIHRvU291cmNlKGZ1bmMpIHtcbiAgaWYgKGZ1bmMgIT0gbnVsbCkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gZnVuY1RvU3RyaW5nLmNhbGwoZnVuYyk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIChmdW5jICsgJycpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gIH1cbiAgcmV0dXJuICcnO1xufVxuXG4vKipcbiAqIFBlcmZvcm1zIGFcbiAqIFtgU2FtZVZhbHVlWmVyb2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLXNhbWV2YWx1ZXplcm8pXG4gKiBjb21wYXJpc29uIGJldHdlZW4gdHdvIHZhbHVlcyB0byBkZXRlcm1pbmUgaWYgdGhleSBhcmUgZXF1aXZhbGVudC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7Kn0gb3RoZXIgVGhlIG90aGVyIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHZhbHVlcyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAndXNlcic6ICdmcmVkJyB9O1xuICogdmFyIG90aGVyID0geyAndXNlcic6ICdmcmVkJyB9O1xuICpcbiAqIF8uZXEob2JqZWN0LCBvYmplY3QpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uZXEob2JqZWN0LCBvdGhlcik7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uZXEoJ2EnLCAnYScpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uZXEoJ2EnLCBPYmplY3QoJ2EnKSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uZXEoTmFOLCBOYU4pO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBlcSh2YWx1ZSwgb3RoZXIpIHtcbiAgcmV0dXJuIHZhbHVlID09PSBvdGhlciB8fCAodmFsdWUgIT09IHZhbHVlICYmIG90aGVyICE9PSBvdGhlcik7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBGdW5jdGlvbmAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGNvcnJlY3RseSBjbGFzc2lmaWVkLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0Z1bmN0aW9uKF8pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNGdW5jdGlvbigvYWJjLyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gIC8vIFRoZSB1c2Ugb2YgYE9iamVjdCN0b1N0cmluZ2AgYXZvaWRzIGlzc3VlcyB3aXRoIHRoZSBgdHlwZW9mYCBvcGVyYXRvclxuICAvLyBpbiBTYWZhcmkgOCB3aGljaCByZXR1cm5zICdvYmplY3QnIGZvciB0eXBlZCBhcnJheSBhbmQgd2VhayBtYXAgY29uc3RydWN0b3JzLFxuICAvLyBhbmQgUGhhbnRvbUpTIDEuOSB3aGljaCByZXR1cm5zICdmdW5jdGlvbicgZm9yIGBOb2RlTGlzdGAgaW5zdGFuY2VzLlxuICB2YXIgdGFnID0gaXNPYmplY3QodmFsdWUpID8gb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSkgOiAnJztcbiAgcmV0dXJuIHRhZyA9PSBmdW5jVGFnIHx8IHRhZyA9PSBnZW5UYWc7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlXG4gKiBbbGFuZ3VhZ2UgdHlwZV0oaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLWVjbWFzY3JpcHQtbGFuZ3VhZ2UtdHlwZXMpXG4gKiBvZiBgT2JqZWN0YC4gKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KF8ubm9vcCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gISF2YWx1ZSAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgbmF0aXZlIGZ1bmN0aW9uLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgbmF0aXZlIGZ1bmN0aW9uLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc05hdGl2ZShBcnJheS5wcm90b3R5cGUucHVzaCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc05hdGl2ZShfKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTmF0aXZlKHZhbHVlKSB7XG4gIGlmICghaXNPYmplY3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBwYXR0ZXJuID0gKGlzRnVuY3Rpb24odmFsdWUpIHx8IGlzSG9zdE9iamVjdCh2YWx1ZSkpID8gcmVJc05hdGl2ZSA6IHJlSXNIb3N0Q3RvcjtcbiAgcmV0dXJuIHBhdHRlcm4udGVzdCh0b1NvdXJjZSh2YWx1ZSkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNldENhY2hlO1xuIiwiLyoqXG4gKiBsb2Rhc2ggNC4wLjUgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCBqUXVlcnkgRm91bmRhdGlvbiBhbmQgb3RoZXIgY29udHJpYnV0b3JzIDxodHRwczovL2pxdWVyeS5vcmcvPlxuICogUmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICovXG52YXIgYmFzZVNsaWNlID0gcmVxdWlyZSgnbG9kYXNoLl9iYXNlc2xpY2UnKTtcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgSU5GSU5JVFkgPSAxIC8gMCxcbiAgICBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MSxcbiAgICBNQVhfSU5URUdFUiA9IDEuNzk3NjkzMTM0ODYyMzE1N2UrMzA4LFxuICAgIE5BTiA9IDAgLyAwO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgZ2VuVGFnID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJyxcbiAgICBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJztcblxuLyoqIFVzZWQgdG8gbWF0Y2ggbGVhZGluZyBhbmQgdHJhaWxpbmcgd2hpdGVzcGFjZS4gKi9cbnZhciByZVRyaW0gPSAvXlxccyt8XFxzKyQvZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGJhZCBzaWduZWQgaGV4YWRlY2ltYWwgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzQmFkSGV4ID0gL15bLStdMHhbMC05YS1mXSskL2k7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBiaW5hcnkgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzQmluYXJ5ID0gL14wYlswMV0rJC9pO1xuXG4vKiogVXNlZCB0byBkZXRlY3Qgb2N0YWwgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzT2N0YWwgPSAvXjBvWzAtN10rJC9pO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgdW5zaWduZWQgaW50ZWdlciB2YWx1ZXMuICovXG52YXIgcmVJc1VpbnQgPSAvXig/OjB8WzEtOV1cXGQqKSQvO1xuXG4vKiogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgd2l0aG91dCBhIGRlcGVuZGVuY3kgb24gYHJvb3RgLiAqL1xudmFyIGZyZWVQYXJzZUludCA9IHBhcnNlSW50O1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBpbmRleC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcGFyYW0ge251bWJlcn0gW2xlbmd0aD1NQVhfU0FGRV9JTlRFR0VSXSBUaGUgdXBwZXIgYm91bmRzIG9mIGEgdmFsaWQgaW5kZXguXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGluZGV4LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSW5kZXgodmFsdWUsIGxlbmd0aCkge1xuICB2YWx1ZSA9ICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgfHwgcmVJc1VpbnQudGVzdCh2YWx1ZSkpID8gK3ZhbHVlIDogLTE7XG4gIGxlbmd0aCA9IGxlbmd0aCA9PSBudWxsID8gTUFYX1NBRkVfSU5URUdFUiA6IGxlbmd0aDtcbiAgcmV0dXJuIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPCBsZW5ndGg7XG59XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlQ2VpbCA9IE1hdGguY2VpbCxcbiAgICBuYXRpdmVNYXggPSBNYXRoLm1heDtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5wcm9wZXJ0eWAgd2l0aG91dCBzdXBwb3J0IGZvciBkZWVwIHBhdGhzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlUHJvcGVydHkoa2V5KSB7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBvYmplY3Rba2V5XTtcbiAgfTtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBcImxlbmd0aFwiIHByb3BlcnR5IHZhbHVlIG9mIGBvYmplY3RgLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIGlzIHVzZWQgdG8gYXZvaWQgYVxuICogW0pJVCBidWddKGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD0xNDI3OTIpIHRoYXQgYWZmZWN0c1xuICogU2FmYXJpIG9uIGF0IGxlYXN0IGlPUyA4LjEtOC4zIEFSTTY0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgXCJsZW5ndGhcIiB2YWx1ZS5cbiAqL1xudmFyIGdldExlbmd0aCA9IGJhc2VQcm9wZXJ0eSgnbGVuZ3RoJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIHRoZSBnaXZlbiBhcmd1bWVudHMgYXJlIGZyb20gYW4gaXRlcmF0ZWUgY2FsbC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgcG90ZW50aWFsIGl0ZXJhdGVlIHZhbHVlIGFyZ3VtZW50LlxuICogQHBhcmFtIHsqfSBpbmRleCBUaGUgcG90ZW50aWFsIGl0ZXJhdGVlIGluZGV4IG9yIGtleSBhcmd1bWVudC5cbiAqIEBwYXJhbSB7Kn0gb2JqZWN0IFRoZSBwb3RlbnRpYWwgaXRlcmF0ZWUgb2JqZWN0IGFyZ3VtZW50LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBhcmd1bWVudHMgYXJlIGZyb20gYW4gaXRlcmF0ZWUgY2FsbCxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSXRlcmF0ZWVDYWxsKHZhbHVlLCBpbmRleCwgb2JqZWN0KSB7XG4gIGlmICghaXNPYmplY3Qob2JqZWN0KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgdHlwZSA9IHR5cGVvZiBpbmRleDtcbiAgaWYgKHR5cGUgPT0gJ251bWJlcidcbiAgICAgICAgPyAoaXNBcnJheUxpa2Uob2JqZWN0KSAmJiBpc0luZGV4KGluZGV4LCBvYmplY3QubGVuZ3RoKSlcbiAgICAgICAgOiAodHlwZSA9PSAnc3RyaW5nJyAmJiBpbmRleCBpbiBvYmplY3QpXG4gICAgICApIHtcbiAgICByZXR1cm4gZXEob2JqZWN0W2luZGV4XSwgdmFsdWUpO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIGVsZW1lbnRzIHNwbGl0IGludG8gZ3JvdXBzIHRoZSBsZW5ndGggb2YgYHNpemVgLlxuICogSWYgYGFycmF5YCBjYW4ndCBiZSBzcGxpdCBldmVubHksIHRoZSBmaW5hbCBjaHVuayB3aWxsIGJlIHRoZSByZW1haW5pbmdcbiAqIGVsZW1lbnRzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBBcnJheVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIHByb2Nlc3MuXG4gKiBAcGFyYW0ge251bWJlcn0gW3NpemU9MV0gVGhlIGxlbmd0aCBvZiBlYWNoIGNodW5rXG4gKiBAcGFyYW0tIHtPYmplY3R9IFtndWFyZF0gRW5hYmxlcyB1c2UgYXMgYW4gaXRlcmF0ZWUgZm9yIG1ldGhvZHMgbGlrZSBgXy5tYXBgLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgYXJyYXkgY29udGFpbmluZyBjaHVua3MuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uY2h1bmsoWydhJywgJ2InLCAnYycsICdkJ10sIDIpO1xuICogLy8gPT4gW1snYScsICdiJ10sIFsnYycsICdkJ11dXG4gKlxuICogXy5jaHVuayhbJ2EnLCAnYicsICdjJywgJ2QnXSwgMyk7XG4gKiAvLyA9PiBbWydhJywgJ2InLCAnYyddLCBbJ2QnXV1cbiAqL1xuZnVuY3Rpb24gY2h1bmsoYXJyYXksIHNpemUsIGd1YXJkKSB7XG4gIGlmICgoZ3VhcmQgPyBpc0l0ZXJhdGVlQ2FsbChhcnJheSwgc2l6ZSwgZ3VhcmQpIDogc2l6ZSA9PT0gdW5kZWZpbmVkKSkge1xuICAgIHNpemUgPSAxO1xuICB9IGVsc2Uge1xuICAgIHNpemUgPSBuYXRpdmVNYXgodG9JbnRlZ2VyKHNpemUpLCAwKTtcbiAgfVxuICB2YXIgbGVuZ3RoID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwO1xuICBpZiAoIWxlbmd0aCB8fCBzaXplIDwgMSkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICB2YXIgaW5kZXggPSAwLFxuICAgICAgcmVzSW5kZXggPSAwLFxuICAgICAgcmVzdWx0ID0gQXJyYXkobmF0aXZlQ2VpbChsZW5ndGggLyBzaXplKSk7XG5cbiAgd2hpbGUgKGluZGV4IDwgbGVuZ3RoKSB7XG4gICAgcmVzdWx0W3Jlc0luZGV4KytdID0gYmFzZVNsaWNlKGFycmF5LCBpbmRleCwgKGluZGV4ICs9IHNpemUpKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIFBlcmZvcm1zIGFcbiAqIFtgU2FtZVZhbHVlWmVyb2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLXNhbWV2YWx1ZXplcm8pXG4gKiBjb21wYXJpc29uIGJldHdlZW4gdHdvIHZhbHVlcyB0byBkZXRlcm1pbmUgaWYgdGhleSBhcmUgZXF1aXZhbGVudC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7Kn0gb3RoZXIgVGhlIG90aGVyIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHZhbHVlcyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAndXNlcic6ICdmcmVkJyB9O1xuICogdmFyIG90aGVyID0geyAndXNlcic6ICdmcmVkJyB9O1xuICpcbiAqIF8uZXEob2JqZWN0LCBvYmplY3QpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uZXEob2JqZWN0LCBvdGhlcik7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uZXEoJ2EnLCAnYScpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uZXEoJ2EnLCBPYmplY3QoJ2EnKSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uZXEoTmFOLCBOYU4pO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBlcSh2YWx1ZSwgb3RoZXIpIHtcbiAgcmV0dXJuIHZhbHVlID09PSBvdGhlciB8fCAodmFsdWUgIT09IHZhbHVlICYmIG90aGVyICE9PSBvdGhlcik7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZS4gQSB2YWx1ZSBpcyBjb25zaWRlcmVkIGFycmF5LWxpa2UgaWYgaXQnc1xuICogbm90IGEgZnVuY3Rpb24gYW5kIGhhcyBhIGB2YWx1ZS5sZW5ndGhgIHRoYXQncyBhbiBpbnRlZ2VyIGdyZWF0ZXIgdGhhbiBvclxuICogZXF1YWwgdG8gYDBgIGFuZCBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gYE51bWJlci5NQVhfU0FGRV9JTlRFR0VSYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoJ2FiYycpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIGlzTGVuZ3RoKGdldExlbmd0aCh2YWx1ZSkpICYmICFpc0Z1bmN0aW9uKHZhbHVlKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYEZ1bmN0aW9uYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgY29ycmVjdGx5IGNsYXNzaWZpZWQsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oXyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0Z1bmN0aW9uKC9hYmMvKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcbiAgLy8gVGhlIHVzZSBvZiBgT2JqZWN0I3RvU3RyaW5nYCBhdm9pZHMgaXNzdWVzIHdpdGggdGhlIGB0eXBlb2ZgIG9wZXJhdG9yXG4gIC8vIGluIFNhZmFyaSA4IHdoaWNoIHJldHVybnMgJ29iamVjdCcgZm9yIHR5cGVkIGFycmF5IGFuZCB3ZWFrIG1hcCBjb25zdHJ1Y3RvcnMsXG4gIC8vIGFuZCBQaGFudG9tSlMgMS45IHdoaWNoIHJldHVybnMgJ2Z1bmN0aW9uJyBmb3IgYE5vZGVMaXN0YCBpbnN0YW5jZXMuXG4gIHZhciB0YWcgPSBpc09iamVjdCh2YWx1ZSkgPyBvYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKSA6ICcnO1xuICByZXR1cm4gdGFnID09IGZ1bmNUYWcgfHwgdGFnID09IGdlblRhZztcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgbGVuZ3RoLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIGlzIGxvb3NlbHkgYmFzZWQgb25cbiAqIFtgVG9MZW5ndGhgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy10b2xlbmd0aCkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBsZW5ndGgsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzTGVuZ3RoKDMpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNMZW5ndGgoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNMZW5ndGgoSW5maW5pdHkpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzTGVuZ3RoKCczJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0xlbmd0aCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdudW1iZXInICYmXG4gICAgdmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZVxuICogW2xhbmd1YWdlIHR5cGVdKGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1lY21hc2NyaXB0LWxhbmd1YWdlLXR5cGVzKVxuICogb2YgYE9iamVjdGAuIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChfLm5vb3ApO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuICEhdmFsdWUgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS4gQSB2YWx1ZSBpcyBvYmplY3QtbGlrZSBpZiBpdCdzIG5vdCBgbnVsbGBcbiAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZSh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gISF2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBTeW1ib2xgIHByaW1pdGl2ZSBvciBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgY29ycmVjdGx5IGNsYXNzaWZpZWQsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzU3ltYm9sKFN5bWJvbC5pdGVyYXRvcik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1N5bWJvbCgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N5bWJvbCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdzeW1ib2wnIHx8XG4gICAgKGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gc3ltYm9sVGFnKTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGFuIGludGVnZXIuXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gaXMgbG9vc2VseSBiYXNlZCBvblxuICogW2BUb0ludGVnZXJgXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtdG9pbnRlZ2VyKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBpbnRlZ2VyLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvSW50ZWdlcigzKTtcbiAqIC8vID0+IDNcbiAqXG4gKiBfLnRvSW50ZWdlcihOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IDBcbiAqXG4gKiBfLnRvSW50ZWdlcihJbmZpbml0eSk7XG4gKiAvLyA9PiAxLjc5NzY5MzEzNDg2MjMxNTdlKzMwOFxuICpcbiAqIF8udG9JbnRlZ2VyKCczJyk7XG4gKiAvLyA9PiAzXG4gKi9cbmZ1bmN0aW9uIHRvSW50ZWdlcih2YWx1ZSkge1xuICBpZiAoIXZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSAwID8gdmFsdWUgOiAwO1xuICB9XG4gIHZhbHVlID0gdG9OdW1iZXIodmFsdWUpO1xuICBpZiAodmFsdWUgPT09IElORklOSVRZIHx8IHZhbHVlID09PSAtSU5GSU5JVFkpIHtcbiAgICB2YXIgc2lnbiA9ICh2YWx1ZSA8IDAgPyAtMSA6IDEpO1xuICAgIHJldHVybiBzaWduICogTUFYX0lOVEVHRVI7XG4gIH1cbiAgdmFyIHJlbWFpbmRlciA9IHZhbHVlICUgMTtcbiAgcmV0dXJuIHZhbHVlID09PSB2YWx1ZSA/IChyZW1haW5kZXIgPyB2YWx1ZSAtIHJlbWFpbmRlciA6IHZhbHVlKSA6IDA7XG59XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIG51bWJlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIG51bWJlci5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50b051bWJlcigzKTtcbiAqIC8vID0+IDNcbiAqXG4gKiBfLnRvTnVtYmVyKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gNWUtMzI0XG4gKlxuICogXy50b051bWJlcihJbmZpbml0eSk7XG4gKiAvLyA9PiBJbmZpbml0eVxuICpcbiAqIF8udG9OdW1iZXIoJzMnKTtcbiAqIC8vID0+IDNcbiAqL1xuZnVuY3Rpb24gdG9OdW1iZXIodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJykge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBpZiAoaXNTeW1ib2wodmFsdWUpKSB7XG4gICAgcmV0dXJuIE5BTjtcbiAgfVxuICBpZiAoaXNPYmplY3QodmFsdWUpKSB7XG4gICAgdmFyIG90aGVyID0gaXNGdW5jdGlvbih2YWx1ZS52YWx1ZU9mKSA/IHZhbHVlLnZhbHVlT2YoKSA6IHZhbHVlO1xuICAgIHZhbHVlID0gaXNPYmplY3Qob3RoZXIpID8gKG90aGVyICsgJycpIDogb3RoZXI7XG4gIH1cbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gMCA/IHZhbHVlIDogK3ZhbHVlO1xuICB9XG4gIHZhbHVlID0gdmFsdWUucmVwbGFjZShyZVRyaW0sICcnKTtcbiAgdmFyIGlzQmluYXJ5ID0gcmVJc0JpbmFyeS50ZXN0KHZhbHVlKTtcbiAgcmV0dXJuIChpc0JpbmFyeSB8fCByZUlzT2N0YWwudGVzdCh2YWx1ZSkpXG4gICAgPyBmcmVlUGFyc2VJbnQodmFsdWUuc2xpY2UoMiksIGlzQmluYXJ5ID8gMiA6IDgpXG4gICAgOiAocmVJc0JhZEhleC50ZXN0KHZhbHVlKSA/IE5BTiA6ICt2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2h1bms7XG4iLCIvKipcbiAqIGxvZGFzaCAzLjMuNCAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IGpRdWVyeSBGb3VuZGF0aW9uIGFuZCBvdGhlciBjb250cmlidXRvcnMgPGh0dHBzOi8vanF1ZXJ5Lm9yZy8+XG4gKiBSZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4zIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKi9cblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgSU5GSU5JVFkgPSAxIC8gMCxcbiAgICBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MSxcbiAgICBNQVhfSU5URUdFUiA9IDEuNzk3NjkzMTM0ODYyMzE1N2UrMzA4LFxuICAgIE5BTiA9IDAgLyAwO1xuXG4vKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB0aGUgbWF4aW11bSBsZW5ndGggYW5kIGluZGV4IG9mIGFuIGFycmF5LiAqL1xudmFyIE1BWF9BUlJBWV9MRU5HVEggPSA0Mjk0OTY3Mjk1O1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgZ2VuVGFnID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJyxcbiAgICBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJztcblxuLyoqIFVzZWQgdG8gbWF0Y2ggbGVhZGluZyBhbmQgdHJhaWxpbmcgd2hpdGVzcGFjZS4gKi9cbnZhciByZVRyaW0gPSAvXlxccyt8XFxzKyQvZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGJhZCBzaWduZWQgaGV4YWRlY2ltYWwgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzQmFkSGV4ID0gL15bLStdMHhbMC05YS1mXSskL2k7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBiaW5hcnkgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzQmluYXJ5ID0gL14wYlswMV0rJC9pO1xuXG4vKiogVXNlZCB0byBkZXRlY3Qgb2N0YWwgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzT2N0YWwgPSAvXjBvWzAtN10rJC9pO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgdW5zaWduZWQgaW50ZWdlciB2YWx1ZXMuICovXG52YXIgcmVJc1VpbnQgPSAvXig/OjB8WzEtOV1cXGQqKSQvO1xuXG4vKiogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgd2l0aG91dCBhIGRlcGVuZGVuY3kgb24gYHJvb3RgLiAqL1xudmFyIGZyZWVQYXJzZUludCA9IHBhcnNlSW50O1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBpbmRleC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcGFyYW0ge251bWJlcn0gW2xlbmd0aD1NQVhfU0FGRV9JTlRFR0VSXSBUaGUgdXBwZXIgYm91bmRzIG9mIGEgdmFsaWQgaW5kZXguXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGluZGV4LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSW5kZXgodmFsdWUsIGxlbmd0aCkge1xuICB2YWx1ZSA9ICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgfHwgcmVJc1VpbnQudGVzdCh2YWx1ZSkpID8gK3ZhbHVlIDogLTE7XG4gIGxlbmd0aCA9IGxlbmd0aCA9PSBudWxsID8gTUFYX1NBRkVfSU5URUdFUiA6IGxlbmd0aDtcbiAgcmV0dXJuIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPCBsZW5ndGg7XG59XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZSBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uY2xhbXBgIHdoaWNoIGRvZXNuJ3QgY29lcmNlIGFyZ3VtZW50cyB0byBudW1iZXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtYmVyIFRoZSBudW1iZXIgdG8gY2xhbXAuXG4gKiBAcGFyYW0ge251bWJlcn0gW2xvd2VyXSBUaGUgbG93ZXIgYm91bmQuXG4gKiBAcGFyYW0ge251bWJlcn0gdXBwZXIgVGhlIHVwcGVyIGJvdW5kLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgY2xhbXBlZCBudW1iZXIuXG4gKi9cbmZ1bmN0aW9uIGJhc2VDbGFtcChudW1iZXIsIGxvd2VyLCB1cHBlcikge1xuICBpZiAobnVtYmVyID09PSBudW1iZXIpIHtcbiAgICBpZiAodXBwZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgbnVtYmVyID0gbnVtYmVyIDw9IHVwcGVyID8gbnVtYmVyIDogdXBwZXI7XG4gICAgfVxuICAgIGlmIChsb3dlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBudW1iZXIgPSBudW1iZXIgPj0gbG93ZXIgPyBudW1iZXIgOiBsb3dlcjtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bWJlcjtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5maWxsYCB3aXRob3V0IGFuIGl0ZXJhdGVlIGNhbGwgZ3VhcmQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBmaWxsLlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gZmlsbCBgYXJyYXlgIHdpdGguXG4gKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0PTBdIFRoZSBzdGFydCBwb3NpdGlvbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbZW5kPWFycmF5Lmxlbmd0aF0gVGhlIGVuZCBwb3NpdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBiYXNlRmlsbChhcnJheSwgdmFsdWUsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcblxuICBzdGFydCA9IHRvSW50ZWdlcihzdGFydCk7XG4gIGlmIChzdGFydCA8IDApIHtcbiAgICBzdGFydCA9IC1zdGFydCA+IGxlbmd0aCA/IDAgOiAobGVuZ3RoICsgc3RhcnQpO1xuICB9XG4gIGVuZCA9IChlbmQgPT09IHVuZGVmaW5lZCB8fCBlbmQgPiBsZW5ndGgpID8gbGVuZ3RoIDogdG9JbnRlZ2VyKGVuZCk7XG4gIGlmIChlbmQgPCAwKSB7XG4gICAgZW5kICs9IGxlbmd0aDtcbiAgfVxuICBlbmQgPSBzdGFydCA+IGVuZCA/IDAgOiB0b0xlbmd0aChlbmQpO1xuICB3aGlsZSAoc3RhcnQgPCBlbmQpIHtcbiAgICBhcnJheVtzdGFydCsrXSA9IHZhbHVlO1xuICB9XG4gIHJldHVybiBhcnJheTtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5wcm9wZXJ0eWAgd2l0aG91dCBzdXBwb3J0IGZvciBkZWVwIHBhdGhzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlUHJvcGVydHkoa2V5KSB7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBvYmplY3Rba2V5XTtcbiAgfTtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBcImxlbmd0aFwiIHByb3BlcnR5IHZhbHVlIG9mIGBvYmplY3RgLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIGlzIHVzZWQgdG8gYXZvaWQgYVxuICogW0pJVCBidWddKGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD0xNDI3OTIpIHRoYXQgYWZmZWN0c1xuICogU2FmYXJpIG9uIGF0IGxlYXN0IGlPUyA4LjEtOC4zIEFSTTY0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgXCJsZW5ndGhcIiB2YWx1ZS5cbiAqL1xudmFyIGdldExlbmd0aCA9IGJhc2VQcm9wZXJ0eSgnbGVuZ3RoJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIHRoZSBnaXZlbiBhcmd1bWVudHMgYXJlIGZyb20gYW4gaXRlcmF0ZWUgY2FsbC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgcG90ZW50aWFsIGl0ZXJhdGVlIHZhbHVlIGFyZ3VtZW50LlxuICogQHBhcmFtIHsqfSBpbmRleCBUaGUgcG90ZW50aWFsIGl0ZXJhdGVlIGluZGV4IG9yIGtleSBhcmd1bWVudC5cbiAqIEBwYXJhbSB7Kn0gb2JqZWN0IFRoZSBwb3RlbnRpYWwgaXRlcmF0ZWUgb2JqZWN0IGFyZ3VtZW50LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBhcmd1bWVudHMgYXJlIGZyb20gYW4gaXRlcmF0ZWUgY2FsbCxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSXRlcmF0ZWVDYWxsKHZhbHVlLCBpbmRleCwgb2JqZWN0KSB7XG4gIGlmICghaXNPYmplY3Qob2JqZWN0KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgdHlwZSA9IHR5cGVvZiBpbmRleDtcbiAgaWYgKHR5cGUgPT0gJ251bWJlcidcbiAgICAgICAgPyAoaXNBcnJheUxpa2Uob2JqZWN0KSAmJiBpc0luZGV4KGluZGV4LCBvYmplY3QubGVuZ3RoKSlcbiAgICAgICAgOiAodHlwZSA9PSAnc3RyaW5nJyAmJiBpbmRleCBpbiBvYmplY3QpXG4gICAgICApIHtcbiAgICByZXR1cm4gZXEob2JqZWN0W2luZGV4XSwgdmFsdWUpO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBGaWxscyBlbGVtZW50cyBvZiBgYXJyYXlgIHdpdGggYHZhbHVlYCBmcm9tIGBzdGFydGAgdXAgdG8sIGJ1dCBub3RcbiAqIGluY2x1ZGluZywgYGVuZGAuXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIG11dGF0ZXMgYGFycmF5YC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMi4wXG4gKiBAY2F0ZWdvcnkgQXJyYXlcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBmaWxsLlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gZmlsbCBgYXJyYXlgIHdpdGguXG4gKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0PTBdIFRoZSBzdGFydCBwb3NpdGlvbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbZW5kPWFycmF5Lmxlbmd0aF0gVGhlIGVuZCBwb3NpdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgYXJyYXkgPSBbMSwgMiwgM107XG4gKlxuICogXy5maWxsKGFycmF5LCAnYScpO1xuICogY29uc29sZS5sb2coYXJyYXkpO1xuICogLy8gPT4gWydhJywgJ2EnLCAnYSddXG4gKlxuICogXy5maWxsKEFycmF5KDMpLCAyKTtcbiAqIC8vID0+IFsyLCAyLCAyXVxuICpcbiAqIF8uZmlsbChbNCwgNiwgOCwgMTBdLCAnKicsIDEsIDMpO1xuICogLy8gPT4gWzQsICcqJywgJyonLCAxMF1cbiAqL1xuZnVuY3Rpb24gZmlsbChhcnJheSwgdmFsdWUsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogMDtcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgaWYgKHN0YXJ0ICYmIHR5cGVvZiBzdGFydCAhPSAnbnVtYmVyJyAmJiBpc0l0ZXJhdGVlQ2FsbChhcnJheSwgdmFsdWUsIHN0YXJ0KSkge1xuICAgIHN0YXJ0ID0gMDtcbiAgICBlbmQgPSBsZW5ndGg7XG4gIH1cbiAgcmV0dXJuIGJhc2VGaWxsKGFycmF5LCB2YWx1ZSwgc3RhcnQsIGVuZCk7XG59XG5cbi8qKlxuICogUGVyZm9ybXMgYVxuICogW2BTYW1lVmFsdWVaZXJvYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtc2FtZXZhbHVlemVybylcbiAqIGNvbXBhcmlzb24gYmV0d2VlbiB0d28gdmFsdWVzIHRvIGRldGVybWluZSBpZiB0aGV5IGFyZSBlcXVpdmFsZW50LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICd1c2VyJzogJ2ZyZWQnIH07XG4gKiB2YXIgb3RoZXIgPSB7ICd1c2VyJzogJ2ZyZWQnIH07XG4gKlxuICogXy5lcShvYmplY3QsIG9iamVjdCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5lcShvYmplY3QsIG90aGVyKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5lcSgnYScsICdhJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5lcSgnYScsIE9iamVjdCgnYScpKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5lcShOYU4sIE5hTik7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGVxKHZhbHVlLCBvdGhlcikge1xuICByZXR1cm4gdmFsdWUgPT09IG90aGVyIHx8ICh2YWx1ZSAhPT0gdmFsdWUgJiYgb3RoZXIgIT09IG90aGVyKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLiBBIHZhbHVlIGlzIGNvbnNpZGVyZWQgYXJyYXktbGlrZSBpZiBpdCdzXG4gKiBub3QgYSBmdW5jdGlvbiBhbmQgaGFzIGEgYHZhbHVlLmxlbmd0aGAgdGhhdCdzIGFuIGludGVnZXIgZ3JlYXRlciB0aGFuIG9yXG4gKiBlcXVhbCB0byBgMGAgYW5kIGxlc3MgdGhhbiBvciBlcXVhbCB0byBgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZSgnYWJjJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUxpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgaXNMZW5ndGgoZ2V0TGVuZ3RoKHZhbHVlKSkgJiYgIWlzRnVuY3Rpb24odmFsdWUpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgRnVuY3Rpb25gIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBjb3JyZWN0bHkgY2xhc3NpZmllZCxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNGdW5jdGlvbihfKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oL2FiYy8pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICAvLyBUaGUgdXNlIG9mIGBPYmplY3QjdG9TdHJpbmdgIGF2b2lkcyBpc3N1ZXMgd2l0aCB0aGUgYHR5cGVvZmAgb3BlcmF0b3JcbiAgLy8gaW4gU2FmYXJpIDggd2hpY2ggcmV0dXJucyAnb2JqZWN0JyBmb3IgdHlwZWQgYXJyYXkgYW5kIHdlYWsgbWFwIGNvbnN0cnVjdG9ycyxcbiAgLy8gYW5kIFBoYW50b21KUyAxLjkgd2hpY2ggcmV0dXJucyAnZnVuY3Rpb24nIGZvciBgTm9kZUxpc3RgIGluc3RhbmNlcy5cbiAgdmFyIHRhZyA9IGlzT2JqZWN0KHZhbHVlKSA/IG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpIDogJyc7XG4gIHJldHVybiB0YWcgPT0gZnVuY1RhZyB8fCB0YWcgPT0gZ2VuVGFnO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBsZW5ndGguXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gaXMgbG9vc2VseSBiYXNlZCBvblxuICogW2BUb0xlbmd0aGBdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLXRvbGVuZ3RoKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGxlbmd0aCxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNMZW5ndGgoMyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0xlbmd0aChOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aChJbmZpbml0eSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNMZW5ndGgoJzMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTGVuZ3RoKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgJiZcbiAgICB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDw9IE1BWF9TQUZFX0lOVEVHRVI7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlIFtsYW5ndWFnZSB0eXBlXShodHRwczovL2VzNS5naXRodWIuaW8vI3g4KSBvZiBgT2JqZWN0YC5cbiAqIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChfLm5vb3ApO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuICEhdmFsdWUgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS4gQSB2YWx1ZSBpcyBvYmplY3QtbGlrZSBpZiBpdCdzIG5vdCBgbnVsbGBcbiAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZSh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gISF2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBTeW1ib2xgIHByaW1pdGl2ZSBvciBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgY29ycmVjdGx5IGNsYXNzaWZpZWQsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzU3ltYm9sKFN5bWJvbC5pdGVyYXRvcik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1N5bWJvbCgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N5bWJvbCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdzeW1ib2wnIHx8XG4gICAgKGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gc3ltYm9sVGFnKTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGFuIGludGVnZXIuXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gaXMgbG9vc2VseSBiYXNlZCBvblxuICogW2BUb0ludGVnZXJgXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtdG9pbnRlZ2VyKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBpbnRlZ2VyLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvSW50ZWdlcigzKTtcbiAqIC8vID0+IDNcbiAqXG4gKiBfLnRvSW50ZWdlcihOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IDBcbiAqXG4gKiBfLnRvSW50ZWdlcihJbmZpbml0eSk7XG4gKiAvLyA9PiAxLjc5NzY5MzEzNDg2MjMxNTdlKzMwOFxuICpcbiAqIF8udG9JbnRlZ2VyKCczJyk7XG4gKiAvLyA9PiAzXG4gKi9cbmZ1bmN0aW9uIHRvSW50ZWdlcih2YWx1ZSkge1xuICBpZiAoIXZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSAwID8gdmFsdWUgOiAwO1xuICB9XG4gIHZhbHVlID0gdG9OdW1iZXIodmFsdWUpO1xuICBpZiAodmFsdWUgPT09IElORklOSVRZIHx8IHZhbHVlID09PSAtSU5GSU5JVFkpIHtcbiAgICB2YXIgc2lnbiA9ICh2YWx1ZSA8IDAgPyAtMSA6IDEpO1xuICAgIHJldHVybiBzaWduICogTUFYX0lOVEVHRVI7XG4gIH1cbiAgdmFyIHJlbWFpbmRlciA9IHZhbHVlICUgMTtcbiAgcmV0dXJuIHZhbHVlID09PSB2YWx1ZSA/IChyZW1haW5kZXIgPyB2YWx1ZSAtIHJlbWFpbmRlciA6IHZhbHVlKSA6IDA7XG59XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhbiBpbnRlZ2VyIHN1aXRhYmxlIGZvciB1c2UgYXMgdGhlIGxlbmd0aCBvZiBhblxuICogYXJyYXktbGlrZSBvYmplY3QuXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGlzIGJhc2VkIG9uXG4gKiBbYFRvTGVuZ3RoYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtdG9sZW5ndGgpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgY29udmVydGVkIGludGVnZXIuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udG9MZW5ndGgoMyk7XG4gKiAvLyA9PiAzXG4gKlxuICogXy50b0xlbmd0aChOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IDBcbiAqXG4gKiBfLnRvTGVuZ3RoKEluZmluaXR5KTtcbiAqIC8vID0+IDQyOTQ5NjcyOTVcbiAqXG4gKiBfLnRvTGVuZ3RoKCczJyk7XG4gKiAvLyA9PiAzXG4gKi9cbmZ1bmN0aW9uIHRvTGVuZ3RoKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSA/IGJhc2VDbGFtcCh0b0ludGVnZXIodmFsdWUpLCAwLCBNQVhfQVJSQVlfTEVOR1RIKSA6IDA7XG59XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIG51bWJlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIG51bWJlci5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50b051bWJlcigzKTtcbiAqIC8vID0+IDNcbiAqXG4gKiBfLnRvTnVtYmVyKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gNWUtMzI0XG4gKlxuICogXy50b051bWJlcihJbmZpbml0eSk7XG4gKiAvLyA9PiBJbmZpbml0eVxuICpcbiAqIF8udG9OdW1iZXIoJzMnKTtcbiAqIC8vID0+IDNcbiAqL1xuZnVuY3Rpb24gdG9OdW1iZXIodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJykge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBpZiAoaXNTeW1ib2wodmFsdWUpKSB7XG4gICAgcmV0dXJuIE5BTjtcbiAgfVxuICBpZiAoaXNPYmplY3QodmFsdWUpKSB7XG4gICAgdmFyIG90aGVyID0gaXNGdW5jdGlvbih2YWx1ZS52YWx1ZU9mKSA/IHZhbHVlLnZhbHVlT2YoKSA6IHZhbHVlO1xuICAgIHZhbHVlID0gaXNPYmplY3Qob3RoZXIpID8gKG90aGVyICsgJycpIDogb3RoZXI7XG4gIH1cbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gMCA/IHZhbHVlIDogK3ZhbHVlO1xuICB9XG4gIHZhbHVlID0gdmFsdWUucmVwbGFjZShyZVRyaW0sICcnKTtcbiAgdmFyIGlzQmluYXJ5ID0gcmVJc0JpbmFyeS50ZXN0KHZhbHVlKTtcbiAgcmV0dXJuIChpc0JpbmFyeSB8fCByZUlzT2N0YWwudGVzdCh2YWx1ZSkpXG4gICAgPyBmcmVlUGFyc2VJbnQodmFsdWUuc2xpY2UoMiksIGlzQmluYXJ5ID8gMiA6IDgpXG4gICAgOiAocmVJc0JhZEhleC50ZXN0KHZhbHVlKSA/IE5BTiA6ICt2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZmlsbDtcbiIsIi8qKlxuICogbG9kYXNoIDQuMi4wIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgalF1ZXJ5IEZvdW5kYXRpb24gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyA8aHR0cHM6Ly9qcXVlcnkub3JnLz5cbiAqIFJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqL1xudmFyIGJhc2VGbGF0dGVuID0gcmVxdWlyZSgnbG9kYXNoLl9iYXNlZmxhdHRlbicpO1xuXG4vKipcbiAqIEZsYXR0ZW5zIGBhcnJheWAgYSBzaW5nbGUgbGV2ZWwgZGVlcC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgQXJyYXlcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBmbGF0dGVuLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgZmxhdHRlbmVkIGFycmF5LlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmZsYXR0ZW4oWzEsIFsyLCBbMywgWzRdXSwgNV1dKTtcbiAqIC8vID0+IFsxLCAyLCBbMywgWzRdXSwgNV1cbiAqL1xuZnVuY3Rpb24gZmxhdHRlbihhcnJheSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwO1xuICByZXR1cm4gbGVuZ3RoID8gYmFzZUZsYXR0ZW4oYXJyYXksIDEpIDogW107XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZmxhdHRlbjtcbiIsIi8qKlxuICogbG9kYXNoIDQuMi4xIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE2IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTYgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cbnZhciBiYXNlVW5pcSA9IHJlcXVpcmUoJ2xvZGFzaC5fYmFzZXVuaXEnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZHVwbGljYXRlLWZyZWUgdmVyc2lvbiBvZiBhbiBhcnJheSwgdXNpbmdcbiAqIFtgU2FtZVZhbHVlWmVyb2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLXNhbWV2YWx1ZXplcm8pXG4gKiBmb3IgZXF1YWxpdHkgY29tcGFyaXNvbnMsIGluIHdoaWNoIG9ubHkgdGhlIGZpcnN0IG9jY3VycmVuY2Ugb2YgZWFjaCBlbGVtZW50XG4gKiBpcyBrZXB0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgQXJyYXlcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgZHVwbGljYXRlIGZyZWUgYXJyYXkuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udW5pcShbMiwgMSwgMl0pO1xuICogLy8gPT4gWzIsIDFdXG4gKi9cbmZ1bmN0aW9uIHVuaXEoYXJyYXkpIHtcbiAgcmV0dXJuIChhcnJheSAmJiBhcnJheS5sZW5ndGgpXG4gICAgPyBiYXNlVW5pcShhcnJheSlcbiAgICA6IFtdO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHVuaXE7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGFtb3VudCkge1xuICB2YXIgayA9IHR5cGVvZiBhbW91bnQgPT09ICdudW1iZXInID8gYW1vdW50IDogNTAsXG4gICAgbl9zYW1wbGVzID0gNDQxMDAsXG4gICAgY3VydmUgPSBuZXcgRmxvYXQzMkFycmF5KG5fc2FtcGxlcyksXG4gICAgZGVnID0gTWF0aC5QSSAvIDE4MCxcbiAgICBpID0gMCxcbiAgICB4O1xuICBmb3IgKCA7IGkgPCBuX3NhbXBsZXM7ICsraSApIHtcbiAgICB4ID0gaSAqIDIgLyBuX3NhbXBsZXMgLSAxO1xuICAgIGN1cnZlW2ldID0gKCAzICsgayApICogeCAqIDIwICogZGVnIC8gKCBNYXRoLlBJICsgayAqIE1hdGguYWJzKHgpICk7XG4gIH1cbiAgcmV0dXJuIGN1cnZlO1xufVxuIiwiLyohXHJcbiAqIEBuYW1lIEphdmFTY3JpcHQvTm9kZUpTIE1lcmdlIHYxLjIuMFxyXG4gKiBAYXV0aG9yIHllaWtvc1xyXG4gKiBAcmVwb3NpdG9yeSBodHRwczovL2dpdGh1Yi5jb20veWVpa29zL2pzLm1lcmdlXHJcblxyXG4gKiBDb3B5cmlnaHQgMjAxNCB5ZWlrb3MgLSBNSVQgbGljZW5zZVxyXG4gKiBodHRwczovL3Jhdy5naXRodWIuY29tL3llaWtvcy9qcy5tZXJnZS9tYXN0ZXIvTElDRU5TRVxyXG4gKi9cclxuXHJcbjsoZnVuY3Rpb24oaXNOb2RlKSB7XHJcblxyXG5cdC8qKlxyXG5cdCAqIE1lcmdlIG9uZSBvciBtb3JlIG9iamVjdHMgXHJcblx0ICogQHBhcmFtIGJvb2w/IGNsb25lXHJcblx0ICogQHBhcmFtIG1peGVkLC4uLiBhcmd1bWVudHNcclxuXHQgKiBAcmV0dXJuIG9iamVjdFxyXG5cdCAqL1xyXG5cclxuXHR2YXIgUHVibGljID0gZnVuY3Rpb24oY2xvbmUpIHtcclxuXHJcblx0XHRyZXR1cm4gbWVyZ2UoY2xvbmUgPT09IHRydWUsIGZhbHNlLCBhcmd1bWVudHMpO1xyXG5cclxuXHR9LCBwdWJsaWNOYW1lID0gJ21lcmdlJztcclxuXHJcblx0LyoqXHJcblx0ICogTWVyZ2UgdHdvIG9yIG1vcmUgb2JqZWN0cyByZWN1cnNpdmVseSBcclxuXHQgKiBAcGFyYW0gYm9vbD8gY2xvbmVcclxuXHQgKiBAcGFyYW0gbWl4ZWQsLi4uIGFyZ3VtZW50c1xyXG5cdCAqIEByZXR1cm4gb2JqZWN0XHJcblx0ICovXHJcblxyXG5cdFB1YmxpYy5yZWN1cnNpdmUgPSBmdW5jdGlvbihjbG9uZSkge1xyXG5cclxuXHRcdHJldHVybiBtZXJnZShjbG9uZSA9PT0gdHJ1ZSwgdHJ1ZSwgYXJndW1lbnRzKTtcclxuXHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogQ2xvbmUgdGhlIGlucHV0IHJlbW92aW5nIGFueSByZWZlcmVuY2VcclxuXHQgKiBAcGFyYW0gbWl4ZWQgaW5wdXRcclxuXHQgKiBAcmV0dXJuIG1peGVkXHJcblx0ICovXHJcblxyXG5cdFB1YmxpYy5jbG9uZSA9IGZ1bmN0aW9uKGlucHV0KSB7XHJcblxyXG5cdFx0dmFyIG91dHB1dCA9IGlucHV0LFxyXG5cdFx0XHR0eXBlID0gdHlwZU9mKGlucHV0KSxcclxuXHRcdFx0aW5kZXgsIHNpemU7XHJcblxyXG5cdFx0aWYgKHR5cGUgPT09ICdhcnJheScpIHtcclxuXHJcblx0XHRcdG91dHB1dCA9IFtdO1xyXG5cdFx0XHRzaXplID0gaW5wdXQubGVuZ3RoO1xyXG5cclxuXHRcdFx0Zm9yIChpbmRleD0wO2luZGV4PHNpemU7KytpbmRleClcclxuXHJcblx0XHRcdFx0b3V0cHV0W2luZGV4XSA9IFB1YmxpYy5jbG9uZShpbnB1dFtpbmRleF0pO1xyXG5cclxuXHRcdH0gZWxzZSBpZiAodHlwZSA9PT0gJ29iamVjdCcpIHtcclxuXHJcblx0XHRcdG91dHB1dCA9IHt9O1xyXG5cclxuXHRcdFx0Zm9yIChpbmRleCBpbiBpbnB1dClcclxuXHJcblx0XHRcdFx0b3V0cHV0W2luZGV4XSA9IFB1YmxpYy5jbG9uZShpbnB1dFtpbmRleF0pO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gb3V0cHV0O1xyXG5cclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBNZXJnZSB0d28gb2JqZWN0cyByZWN1cnNpdmVseVxyXG5cdCAqIEBwYXJhbSBtaXhlZCBpbnB1dFxyXG5cdCAqIEBwYXJhbSBtaXhlZCBleHRlbmRcclxuXHQgKiBAcmV0dXJuIG1peGVkXHJcblx0ICovXHJcblxyXG5cdGZ1bmN0aW9uIG1lcmdlX3JlY3Vyc2l2ZShiYXNlLCBleHRlbmQpIHtcclxuXHJcblx0XHRpZiAodHlwZU9mKGJhc2UpICE9PSAnb2JqZWN0JylcclxuXHJcblx0XHRcdHJldHVybiBleHRlbmQ7XHJcblxyXG5cdFx0Zm9yICh2YXIga2V5IGluIGV4dGVuZCkge1xyXG5cclxuXHRcdFx0aWYgKHR5cGVPZihiYXNlW2tleV0pID09PSAnb2JqZWN0JyAmJiB0eXBlT2YoZXh0ZW5kW2tleV0pID09PSAnb2JqZWN0Jykge1xyXG5cclxuXHRcdFx0XHRiYXNlW2tleV0gPSBtZXJnZV9yZWN1cnNpdmUoYmFzZVtrZXldLCBleHRlbmRba2V5XSk7XHJcblxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdFx0XHRiYXNlW2tleV0gPSBleHRlbmRba2V5XTtcclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGJhc2U7XHJcblxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogTWVyZ2UgdHdvIG9yIG1vcmUgb2JqZWN0c1xyXG5cdCAqIEBwYXJhbSBib29sIGNsb25lXHJcblx0ICogQHBhcmFtIGJvb2wgcmVjdXJzaXZlXHJcblx0ICogQHBhcmFtIGFycmF5IGFyZ3ZcclxuXHQgKiBAcmV0dXJuIG9iamVjdFxyXG5cdCAqL1xyXG5cclxuXHRmdW5jdGlvbiBtZXJnZShjbG9uZSwgcmVjdXJzaXZlLCBhcmd2KSB7XHJcblxyXG5cdFx0dmFyIHJlc3VsdCA9IGFyZ3ZbMF0sXHJcblx0XHRcdHNpemUgPSBhcmd2Lmxlbmd0aDtcclxuXHJcblx0XHRpZiAoY2xvbmUgfHwgdHlwZU9mKHJlc3VsdCkgIT09ICdvYmplY3QnKVxyXG5cclxuXHRcdFx0cmVzdWx0ID0ge307XHJcblxyXG5cdFx0Zm9yICh2YXIgaW5kZXg9MDtpbmRleDxzaXplOysraW5kZXgpIHtcclxuXHJcblx0XHRcdHZhciBpdGVtID0gYXJndltpbmRleF0sXHJcblxyXG5cdFx0XHRcdHR5cGUgPSB0eXBlT2YoaXRlbSk7XHJcblxyXG5cdFx0XHRpZiAodHlwZSAhPT0gJ29iamVjdCcpIGNvbnRpbnVlO1xyXG5cclxuXHRcdFx0Zm9yICh2YXIga2V5IGluIGl0ZW0pIHtcclxuXHJcblx0XHRcdFx0dmFyIHNpdGVtID0gY2xvbmUgPyBQdWJsaWMuY2xvbmUoaXRlbVtrZXldKSA6IGl0ZW1ba2V5XTtcclxuXHJcblx0XHRcdFx0aWYgKHJlY3Vyc2l2ZSkge1xyXG5cclxuXHRcdFx0XHRcdHJlc3VsdFtrZXldID0gbWVyZ2VfcmVjdXJzaXZlKHJlc3VsdFtrZXldLCBzaXRlbSk7XHJcblxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHRcdFx0cmVzdWx0W2tleV0gPSBzaXRlbTtcclxuXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEdldCB0eXBlIG9mIHZhcmlhYmxlXHJcblx0ICogQHBhcmFtIG1peGVkIGlucHV0XHJcblx0ICogQHJldHVybiBzdHJpbmdcclxuXHQgKlxyXG5cdCAqIEBzZWUgaHR0cDovL2pzcGVyZi5jb20vdHlwZW9mdmFyXHJcblx0ICovXHJcblxyXG5cdGZ1bmN0aW9uIHR5cGVPZihpbnB1dCkge1xyXG5cclxuXHRcdHJldHVybiAoe30pLnRvU3RyaW5nLmNhbGwoaW5wdXQpLnNsaWNlKDgsIC0xKS50b0xvd2VyQ2FzZSgpO1xyXG5cclxuXHR9XHJcblxyXG5cdGlmIChpc05vZGUpIHtcclxuXHJcblx0XHRtb2R1bGUuZXhwb3J0cyA9IFB1YmxpYztcclxuXHJcblx0fSBlbHNlIHtcclxuXHJcblx0XHR3aW5kb3dbcHVibGljTmFtZV0gPSBQdWJsaWM7XHJcblxyXG5cdH1cclxuXHJcbn0pKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZSAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzKTsiLCIndXNlIHN0cmljdCdcblxudmFyIENIUk9NQVRJQyA9IFsgJ0MnLCAnRGInLCAnRCcsICdFYicsICdFJywgJ0YnLCAnR2InLCAnRycsICdBYicsICdBJywgJ0JiJywgJ0InIF1cblxuLyoqXG4gKiBHZXQgdGhlIG5vdGUgbmFtZSAoaW4gc2NpZW50aWZpYyBub3RhdGlvbikgb2YgdGhlIGdpdmVuIG1pZGkgbnVtYmVyXG4gKlxuICogSXQgdXNlcyBNSURJJ3MgW1R1bmluZyBTdGFuZGFyZF0oaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTUlESV9UdW5pbmdfU3RhbmRhcmQpXG4gKiB3aGVyZSBBNCBpcyA2OVxuICpcbiAqIFRoaXMgbWV0aG9kIGRvZXNuJ3QgdGFrZSBpbnRvIGFjY291bnQgZGlhdG9uaWMgc3BlbGxpbmcuIEFsd2F5cyB0aGUgc2FtZVxuICogcGl0Y2ggY2xhc3MgaXMgZ2l2ZW4gZm9yIHRoZSBzYW1lIG1pZGkgbnVtYmVyLlxuICpcbiAqIEBuYW1lIG1pZGkubm90ZVxuICogQGZ1bmN0aW9uXG4gKiBAcGFyYW0ge0ludGVnZXJ9IG1pZGkgLSB0aGUgbWlkaSBudW1iZXJcbiAqIEByZXR1cm4ge1N0cmluZ30gdGhlIHBpdGNoXG4gKlxuICogQGV4YW1wbGVcbiAqIHZhciBub3RlID0gcmVxdWlyZSgnbWlkaS1ub3RlJylcbiAqIG5vdGUoNjkpIC8vID0+ICdBNCdcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobWlkaSkge1xuICBpZiAoaXNOYU4obWlkaSkgfHwgbWlkaSA8IDAgfHwgbWlkaSA+IDEyNykgcmV0dXJuIG51bGxcbiAgdmFyIG5hbWUgPSBDSFJPTUFUSUNbbWlkaSAlIDEyXVxuICB2YXIgb2N0ID0gTWF0aC5mbG9vcihtaWRpIC8gMTIpIC0gMVxuICByZXR1cm4gbmFtZSArIG9jdFxufVxuIiwiKGZ1bmN0aW9uKCkge1xuXG5cdHZhciBub3RlTWFwID0ge307XG5cdHZhciBub3RlTnVtYmVyTWFwID0gW107XG5cdHZhciBub3RlcyA9IFsgXCJDXCIsIFwiQyNcIiwgXCJEXCIsIFwiRCNcIiwgXCJFXCIsIFwiRlwiLCBcIkYjXCIsIFwiR1wiLCBcIkcjXCIsIFwiQVwiLCBcIkEjXCIsIFwiQlwiIF07XG5cblxuXHRmb3IodmFyIGkgPSAwOyBpIDwgMTI3OyBpKyspIHtcblxuXHRcdHZhciBpbmRleCA9IGksXG5cdFx0XHRrZXkgPSBub3Rlc1tpbmRleCAlIDEyXSxcblx0XHRcdG9jdGF2ZSA9ICgoaW5kZXggLyAxMikgfCAwKSAtIDE7IC8vIE1JREkgc2NhbGUgc3RhcnRzIGF0IG9jdGF2ZSA9IC0xXG5cblx0XHRpZihrZXkubGVuZ3RoID09PSAxKSB7XG5cdFx0XHRrZXkgPSBrZXkgKyAnLSc7XG5cdFx0fVxuXG5cdFx0a2V5ICs9IG9jdGF2ZTtcblxuXHRcdG5vdGVNYXBba2V5XSA9IGk7XG5cdFx0bm90ZU51bWJlck1hcFtpXSA9IGtleTtcblxuXHR9XG5cblxuXHRmdW5jdGlvbiBnZXRCYXNlTG9nKHZhbHVlLCBiYXNlKSB7XG5cdFx0cmV0dXJuIE1hdGgubG9nKHZhbHVlKSAvIE1hdGgubG9nKGJhc2UpO1xuXHR9XG5cblxuXHR2YXIgTUlESVV0aWxzID0ge1xuXG5cdFx0bm90ZU5hbWVUb05vdGVOdW1iZXI6IGZ1bmN0aW9uKG5hbWUpIHtcblx0XHRcdHJldHVybiBub3RlTWFwW25hbWVdO1xuXHRcdH0sXG5cblx0XHRub3RlTnVtYmVyVG9GcmVxdWVuY3k6IGZ1bmN0aW9uKG5vdGUpIHtcblx0XHRcdHJldHVybiA0NDAuMCAqIE1hdGgucG93KDIsIChub3RlIC0gNjkuMCkgLyAxMi4wKTtcblx0XHR9LFxuXG5cdFx0bm90ZU51bWJlclRvTmFtZTogZnVuY3Rpb24obm90ZSkge1xuXHRcdFx0cmV0dXJuIG5vdGVOdW1iZXJNYXBbbm90ZV07XG5cdFx0fSxcblxuXHRcdGZyZXF1ZW5jeVRvTm90ZU51bWJlcjogZnVuY3Rpb24oZikge1xuXHRcdFx0cmV0dXJuIE1hdGgucm91bmQoMTIuMCAqIGdldEJhc2VMb2coZiAvIDQ0MC4wLCAyKSArIDY5KTtcblx0XHR9XG5cblx0fTtcblxuXG5cdC8vIE1ha2UgaXQgY29tcGF0aWJsZSBmb3IgcmVxdWlyZS5qcy9BTUQgbG9hZGVyKHMpXG5cdGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuXHRcdGRlZmluZShmdW5jdGlvbigpIHsgcmV0dXJuIE1JRElVdGlsczsgfSk7XG5cdH0gZWxzZSBpZih0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuXHRcdC8vIEFuZCBmb3IgbnBtL25vZGUuanNcblx0XHRtb2R1bGUuZXhwb3J0cyA9IE1JRElVdGlscztcblx0fSBlbHNlIHtcblx0XHR0aGlzLk1JRElVdGlscyA9IE1JRElVdGlscztcblx0fVxuXG5cbn0pLmNhbGwodGhpcyk7XG5cbiIsIid1c2Ugc3RyaWN0J1xuXG52YXIgdHJhbnNwb3NlID0gcmVxdWlyZSgnbm90ZS10cmFuc3Bvc2VyJylcbnZhciBpbnRlcnZhbCA9IHJlcXVpcmUoJ25vdGUtaW50ZXJ2YWwnKVxudmFyIHBhcnNlID0gcmVxdWlyZSgnbXVzaWMtbm90YXRpb24vbm90ZS9wYXJzZScpXG52YXIgcGFyc2VJID0gcmVxdWlyZSgnbXVzaWMtbm90YXRpb24vaW50ZXJ2YWwvcGFyc2UnKVxudmFyIHN0ciA9IHJlcXVpcmUoJ211c2ljLW5vdGF0aW9uL25vdGUvc3RyJylcblxudmFyIFJFR0VYID0gL14jezEsN318YnsxLDd9JC9cbnZhciBLRVlTID0geyBtYWpvcjogMSwgbWlub3I6IDYsIGlvbmlhbjogMSwgZG9yaWFuOiAyLCBwaHJ5Z2lhbjogMywgbHlkaWFuOiA0LFxuICBtaXhvbHlkaWFuOiA1LCBhZW9saWFuOiA2LCBsb2NyaWFuOiA3IH1cbnZhciBTQ0FMRVMgPSBbXG4gICcxIDIgMyA0IDUgNiA3JywgJzEgMiAzYiA0IDUgNiA3YicsICcxIDJiIDNiIDQgNSA2YiA3YicsICcxIDIgMyA0IyA1IDYgNycsXG4gICcxIDIgMyA0IDUgNiA3YicsICcxIDIgM2IgNCA1IDZiIDdiJywgJzEgMmIgM2IgNCA1YiA2YiA3Yidcbl0ubWFwKGZ1bmN0aW9uIChnKSB7IHJldHVybiBnLnNwbGl0KCcgJykgfSlcblxuLyoqXG4gKiBDcmVhdGUgYSBrZXkgZnJvbSBhIHN0cmluZy4gQSBrZXkgaXMgYSBzdHJpbmcgd2l0aCBhIHRvbmljIGFuZCBhIG1vZGVcbiAqXG4gKiBAbmFtZSBrZXlcbiAqIEBmdW5jdGlvblxuICpcbiAqIEBleGFtcGxlXG4gKiB2YXIga2V5ID0gcmVxdWlyZSgnbXVzaWMta2V5JylcbiAqIGtleSgnQyBtYWpvcicpIC8vID0+ICdDIG1ham9yJ1xuICoga2V5KCdjIE1ham9yJykgLy8gPT4gJ0MgbWFqb3InXG4gKiBrZXkoJ0MnKSAvLyA9PiAnQyBtYWpvcidcbiAqIGtleSgnZGJiIG1pWG9seWRpYW4nKSAvLyA9PiAnRGJiIG1peG9seWRpYW4nXG4gKi9cbmZ1bmN0aW9uIEtleSAoc3RyKSB7XG4gIGlmICgvXi0/XFxkJC8uZXhlYyhzdHIpKSB7XG4gICAgcmV0dXJuIG1ham9yKCtzdHIpXG4gIH0gZWxzZSBpZiAoUkVHRVguZXhlYyhzdHIpKSB7XG4gICAgdmFyIGRpciA9IHN0clswXSA9PT0gJ2InID8gLTEgOiAxXG4gICAgcmV0dXJuIG1ham9yKHN0ci5sZW5ndGggKiBkaXIpXG4gIH0gZWxzZSB7XG4gICAgdmFyIHAgPSBLZXkucGFyc2Uoc3RyKVxuICAgIHJldHVybiBwID8gcC50b25pYyArICcgJyArIHAubW9kZSA6IG51bGxcbiAgfVxufVxuZnVuY3Rpb24gbWFqb3IgKG4pIHsgcmV0dXJuIHRyYW5zcG9zZSgnQycsIFtuLCAwXSkgKyAnIG1ham9yJyB9XG5cbi8qKlxuICogUGFyc2UgYSBrZXkgbmFtZVxuICpcbiAqIEBuYW1lIGtleS5wYXJzZVxuICogQGZ1bmN0aW9uXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIHRoZSBrZXkgbmFtZVxuICogQHJldHVybiB7QXJyYXl9IGFuIGFycmF5IHdpdGggdGhlIHRvbmljIGFuZCBtb2RlIG9yIG51bGwgaWYgbm90IHZhbGlkIGtleVxuICpcbiAqIEBleGFtcGxlXG4gKiB2YXIga2V5ID0gcmVxdWlyZSgnbXVzaWMta2V5JylcbiAqIGtleS5wYXJzZSgnQyBtYWpvcicpIC8vID0+IFsnQycsICdtYWpvciddXG4gKiBrZXkucGFyc2UoJ2Z4IE1JTk9SJykgLy8gPT4gWydGIyMnLCAnbWlub3InXVxuICoga2V5LnBhcnNlKCdBYiBtaXhvbHlkaWFuJykgLy8gPT4gWydBYicsICdtaXhvbHlkaWFuJ11cbiAqIGtleS5wYXJzZSgnZiBiZWJvcCcpIC8vID0+ICdudWxsJ1xuICovXG5LZXkucGFyc2UgPSBmdW5jdGlvbiAobmFtZSkge1xuICB2YXIgbSwgcywgdFxuICBpZiAoIW5hbWUpIHJldHVybiBudWxsXG4gIHMgPSBuYW1lLnRyaW0oKS5zcGxpdCgvXFxzKy8pXG4gIHQgPSBzdHIocGFyc2UoKHNbMF0pKSlcbiAgaWYgKHMubGVuZ3RoID09PSAxKSB7XG4gICAgbSA9IHNbMF0udG9Mb3dlckNhc2UoKVxuICAgIGlmIChLRVlTW21dKSByZXR1cm4gayhudWxsLCBtKVxuICAgIGVsc2UgaWYgKHQpIHJldHVybiBrKHQsICdtYWpvcicpXG4gICAgZWxzZSByZXR1cm4gbnVsbFxuICB9XG4gIG0gPSBzWzFdLnRvTG93ZXJDYXNlKClcbiAgaWYgKHQgJiYgS0VZU1ttXSkgcmV0dXJuIGsodCwgbSlcbiAgcmV0dXJuIG51bGxcbn1cblxuZnVuY3Rpb24gayAodCwgbSkgeyByZXR1cm4ge3RvbmljOiB0IHx8IGZhbHNlLCBtb2RlOiBtLCBhbHQ6IEtFWVNbbV19IH1cblxuLyoqXG4gKiBHZXQgcmVsYXRpdmUgb2YgYSBrZXlcbiAqXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIGN1cnJpZmllZCwgc28gaXQgY2FuIGJlIHBhcnRpYWxseSBhcHBsaWVkIChzZWUgZXhhbXBsZXMpXG4gKlxuICogQG5hbWUga2V5LnJlbGF0aXZlXG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSB7U3RyaW5nfSByZWxhdGl2ZSAtIHRoZSBuYW1lIG9mIHRoZSByZWxhdGl2ZSBtb2RlIGRlc2lyZWRcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgLSB0aGUga2V5IG5hbWVcbiAqIEByZXR1cm4ge1N0cmluZ30gdGhlIHJlbGF0aXZlIGtleSBuYW1lIG9yIG51bGwgaWYgdGhlIGtleSBvciB0aGUgcmVsYXRpdmUgbmFtZVxuICogYXJlIG5vdCB2YWxpZFxuICpcbiAqIEBleGFtcGxlXG4gKiB2YXIga2V5ID0gcmVxdWlyZSgnbXVzaWMta2V5JylcbiAqIGtleS5yZWxhdGl2ZSgnbWlub3InLCAnQyBtYWpvcicpIC8vID0+ICdBIG1pbm9yJ1xuICoga2V5LnJlbGF0aXZlKCdtYWpvcicsICdBIG1pbm9yJykgLy8gPT4gJ0MgbWFqb3InXG4gKiBrZXkucmVsYXRpdmUoJ2RvcmlhbicsICdGIG1ham9yJykgLy8gPT4gJ0cgZG9yaWFuJ1xuICpcbiAqIC8vIHBhcnRpYWxseSBhcHBsaWNhdGlvblxuICogdmFyIG1pbm9yT2YgPSBrZXkucmVsYXRpdmUoJ21pbm9yJylcbiAqIG1pbm9yT2YoJ0JiIG1ham9yJykgLy8gPT4gJ0cgbWlub3InXG4gKi9cbktleS5yZWxhdGl2ZSA9IGZ1bmN0aW9uIChyZWwsIGtleSkge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkgcmV0dXJuIGZ1bmN0aW9uIChrKSB7IHJldHVybiBLZXkucmVsYXRpdmUocmVsLCBrKSB9XG4gIHZhciBrID0gS2V5LnBhcnNlKGtleSlcbiAgdmFyIHIgPSBLZXkucGFyc2UocmVsKVxuICBpZiAoIWsgfHwgIWsudG9uaWMgfHwgIXIpIHJldHVybiBudWxsXG4gIHZhciBtYWpvciA9IGsubW9kZSA9PT0gJ21ham9yJyA/IGsudG9uaWMgOiB0cmFuc3Bvc2Uoay50b25pYywgJy0nICsgay5hbHQpXG4gIHJldHVybiByLm1vZGUgPT09ICdtYWpvcicgPyBtYWpvciArICcgbWFqb3InIDogdHJhbnNwb3NlKG1ham9yLCAnJyArIHIuYWx0KSArICcgJyArIHJlbFxufVxuXG4vKipcbiAqIEdldCB0aGUgbnVtYmVyIG9mIGFsdGVyYXRpb25zIG9mIGEga2V5XG4gKlxuICogQG5hbWUga2V5LmFsdGVyYXRvbnNcbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSB0aGUga2V5IG5hbWVcbiAqIEByZXR1cm4ge0ludGVnZXJ9IHRoZSBudW1iZXIgb2YgYWx0ZXJhdGlvbnMgb3IgbnVsbCBpZiBub3QgdmFsaWQga2V5XG4gKlxuICogQGV4YW1wbGVcbiAqIHZhciBrZXkgPSByZXF1aXJlKCdtdXNpYy1rZXknKVxuICoga2V5LmFsdGVyYXRpb25zKCdDIG1ham9yJykgLy8gPT4gMFxuICoga2V5LmFsdGVyYXRpb25zKCdGIG1ham9yJykgLy8gPT4gLTFcbiAqIGtleS5hbHRlcmF0aW9ucygnRWIgbWFqb3InKSAvLyA9PiAtM1xuICoga2V5LmFsdGVyYXRpb25zKCdBIG1ham9yJykgLy8gPT4gM1xuICoga2V5LmFsdGVyYXRpb25zKCdub25zZW5zZScpIC8vID0+IG51bGxcbiAqL1xuS2V5LmFsdGVyYXRpb25zID0gZnVuY3Rpb24gKGtleSkge1xuICB2YXIgayA9IEtleS5yZWxhdGl2ZSgnbWFqb3InLCBrZXkpXG4gIHJldHVybiBrID8gcGFyc2VJKGludGVydmFsKCdDJywgay5zcGxpdCgnICcpWzBdKSlbMF0gOiBudWxsXG59XG5cbi8qKlxuICogR2V0IHNpZ25hdHVyZSBvZiBhIGtleVxuICpcbiAqIEBuYW1lIGtleS5zaWduYXR1cmVcbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSB0aGUga2V5IG5hbWVcbiAqIEByZXR1cm4ge1N0cmluZ30gYSBzdHJpbmcgd2l0aCB0aGUgYWx0ZXJhdGlvbnNcbiAqXG4gKiBAZXhhbXBsZVxuICogdmFyIGtleSA9IHJlcXVpcmUoJ211c2ljLWtleScpXG4gKiBrZXkuc2lnbmF0dXJlKCdGIG1ham9yJykgLy8gPT4gJ2InXG4gKiBrZXkuc2lnbmF0dXJlKCdFYiBtYWpvcicpIC8vID0+ICdiYmInXG4gKiBrZXkuc2lnbmF0dXJlKCdBIG1ham9yJykgLy8gPT4gJyMjIydcbiAqIGtleS5zaWduYXR1cmUoJ0MgbWFqb3InKSAvLyA9PiAnJ1xuICoga2V5LnNpZ25hdHVyZSgnbm9uc2Vuc2UnKSAvLyA9PiBudWxsXG4gKi9cbktleS5zaWduYXR1cmUgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHZhciBuID0gS2V5LmFsdGVyYXRpb25zKGtleSlcbiAgcmV0dXJuIG4gIT09IG51bGwgPyBuZXcgQXJyYXkoTWF0aC5hYnMobikgKyAxKS5qb2luKG4gPCAwID8gJ2InIDogJyMnKSA6IG51bGxcbn1cblxuLyoqXG4gKiBHZXQgYSBsaXN0IG9mIGFsdGVyZWQgbm90ZXMgaW4gdGhlIGFwcHJvcHJpYXRlIG9yZGVyXG4gKlxuICogQG5hbWUga2V5LmFsdGVyZWRcbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSB0aGUga2V5IG5hbWVcbiAqIEByZXR1cm4ge0FycmF5fSBhbiBhcnJheSB3aXRoIHRoZSBhbHRlcmVkIG5vdGVzIG9yZGVyZWQgb3IgYW4gZW1wdHkgYXJyYXlcbiAqIGlmIGl0cyBub3QgYSB2YWxpZCBrZXkgbmFtZVxuICpcbiAqIEBleGFtcGxlXG4gKiBrZXkuYWx0ZXJlZCgnRiBtYWpvcicpIC8vID0+IFsnQmInXVxuICoga2V5LmFsdGVyZWQoJ0ViIG1ham9yJykgLy8gPT4gWydCYicsICdFYicsICdBYiddXG4gKiBrZXkuYWx0ZXJlZCgnQSBtYWpvcicpIC8vID0+IFsnRiMnLCAnQyMnLCAnRyMnXVxuICovXG5LZXkuYWx0ZXJlZCA9IGZ1bmN0aW9uIChrKSB7XG4gIHZhciBhID0gS2V5LmFsdGVyYXRpb25zKGspXG4gIGlmIChhID09PSBudWxsKSByZXR1cm4gbnVsbFxuICB2YXIgbm90ZXMgPSBbXVxuICB2YXIgdG9uaWMgPSBhID4gMCA/ICdCJyA6ICdGJ1xuICB2YXIgaW50ZXJ2YWwgPSBhID4gMCA/IFsxLCAwXSA6IFstMSwgMF1cbiAgdmFyIGwgPSBNYXRoLmFicyhhKVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGw7IGkrKykge1xuICAgIHRvbmljID0gdHJhbnNwb3NlKHRvbmljLCBpbnRlcnZhbClcbiAgICBub3Rlcy5wdXNoKHRvbmljKVxuICB9XG4gIHJldHVybiBub3Rlc1xufVxuXG4vKipcbiAqIEdldCB0aGUgc2NhbGUgb2YgYSBrZXlcbiAqXG4gKiBAbmFtZSBrZXkuc2NhbGVcbiAqIEBmdW5jdGlvblxuICpcbiAqIEBleGFtcGxlXG4gKiB2YXIga2V5ID0gcmVxdWlyZSgnbXVzaWMta2V5JylcbiAqIGtleS5zY2FsZSgnQyBtYWpvcicpIC8vID0+IFsnQycsICdEJywgJ0UnLCAuLi5dXG4gKi9cbktleS5zY2FsZSA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIHZhciBrID0gS2V5LnBhcnNlKG5hbWUpXG4gIGlmICghaykgcmV0dXJuIFtdXG4gIHJldHVybiBTQ0FMRVNbay5hbHQgLSAxXS5tYXAodHJhbnNwb3NlKGsudG9uaWMpKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEtleVxuIiwiJ3VzZSBzdHJpY3QnXG5cbi8qKlxuICogQnVpbGQgYW4gYWNjaWRlbnRhbHMgc3RyaW5nIGZyb20gYWx0ZXJhdGlvbiBudW1iZXJcbiAqXG4gKiBAbmFtZSBhY2NpZGVudGFscy5zdHJcbiAqIEBwYXJhbSB7SW50ZWdlcn0gYWx0ZXJhdGlvbiAtIHRoZSBhbHRlcmF0aW9uIG51bWJlclxuICogQHJldHVybiB7U3RyaW5nfSB0aGUgYWNjaWRlbnRhbHMgc3RyaW5nXG4gKlxuICogQGV4YW1wbGVcbiAqIHZhciBhY2NpZGVudGFscyA9IHJlcXVpcmUoJ211c2ljLW5vdGF0aW9uL2FjY2lkZW50YWxzL3N0cicpXG4gKiBhY2NpZGVudGFscygwKSAvLyA9PiAnJ1xuICogYWNjaWRlbnRhbHMoMSkgLy8gPT4gJyMnXG4gKiBhY2NpZGVudGFscygyKSAvLyA9PiAnIyMnXG4gKiBhY2NpZGVudGFscygtMSkgLy8gPT4gJ2InXG4gKiBhY2NpZGVudGFscygtMikgLy8gPT4gJ2JiJ1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChudW0pIHtcbiAgaWYgKG51bSA8IDApIHJldHVybiBBcnJheSgtbnVtICsgMSkuam9pbignYicpXG4gIGVsc2UgaWYgKG51bSA+IDApIHJldHVybiBBcnJheShudW0gKyAxKS5qb2luKCcjJylcbiAgZWxzZSByZXR1cm4gJydcbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG4vLyBtYXAgZnJvbSBwaXRjaCBudW1iZXIgdG8gbnVtYmVyIG9mIGZpZnRocyBhbmQgb2N0YXZlc1xudmFyIEJBU0VTID0gWyBbMCwgMF0sIFsyLCAtMV0sIFs0LCAtMl0sIFstMSwgMV0sIFsxLCAwXSwgWzMsIC0xXSwgWzUsIC0yXSBdXG5cbi8qKlxuICogR2V0IGEgcGl0Y2ggaW4gW2FycmF5IG5vdGF0aW9uXSgpIGZyb20gcGl0Y2ggcHJvcGVydGllc1xuICpcbiAqIEBuYW1lIGFycmF5LmZyb21Qcm9wc1xuICogQGZ1bmN0aW9uXG4gKiBAcGFyYW0ge0ludGVnZXJ9IHN0ZXAgLSB0aGUgc3RlcCBpbmRleFxuICogQHBhcmFtIHtJbnRlZ2VyfSBhbHRlcmF0aW9ucyAtIChPcHRpb25hbCkgdGhlIGFsdGVyYXRpb25zIG51bWJlclxuICogQHBhcmFtIHtJbnRlZ2VyfSBvY3RhdmUgLSAoT3B0aW9uYWwpIHRoZSBvY3RhdmVcbiAqIEBwYXJhbSB7SW50ZWdlcn0gZHVyYXRpb24gLSAoT3B0aW9uYWwpIGR1cmF0aW9uXG4gKiBAcmV0dXJuIHtBcnJheX0gdGhlIHBpdGNoIGluIGFycmF5IGZvcm1hdFxuICpcbiAqIEBleGFtcGxlXG4gKiB2YXIgZnJvbVByb3BzID0gcmVxdWlyZSgnbXVzaWMtbm90YXRpb24vYXJyYXkvZnJvbS1wcm9wcycpXG4gKiBmcm9tUHJvcHMoWzAsIDEsIDQsIDBdKVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChzdGVwLCBhbHQsIG9jdCwgZHVyKSB7XG4gIHZhciBiYXNlID0gQkFTRVNbc3RlcF1cbiAgYWx0ID0gYWx0IHx8IDBcbiAgdmFyIGYgPSBiYXNlWzBdICsgNyAqIGFsdFxuICBpZiAodHlwZW9mIG9jdCA9PT0gJ3VuZGVmaW5lZCcpIHJldHVybiBbZl1cbiAgdmFyIG8gPSBvY3QgKyBiYXNlWzFdIC0gNCAqIGFsdFxuICBpZiAodHlwZW9mIGR1ciA9PT0gJ3VuZGVmaW5lZCcpIHJldHVybiBbZiwgb11cbiAgZWxzZSByZXR1cm4gW2YsIG8sIGR1cl1cbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG4vLyBNYXAgZnJvbSBudW1iZXIgb2YgZmlmdGhzIHRvIGludGVydmFsIG51bWJlciAoMC1pbmRleCkgYW5kIG9jdGF2ZVxuLy8gLTEgPSBmb3VydGgsIDAgPSB1bmlzb24sIDEgPSBmaWZ0aCwgMiA9IHNlY29uZCwgMyA9IHNpeHRoLi4uXG52YXIgQkFTRVMgPSBbWzMsIDFdLCBbMCwgMF0sIFs0LCAwXSwgWzEsIC0xXSwgWzUsIC0xXSwgWzIsIC0yXSwgWzYsIC0yXSwgWzMsIC0zXV1cblxuLyoqXG4gKiBHZXQgcHJvcGVydGllcyBmcm9tIGEgcGl0Y2ggaW4gYXJyYXkgZm9ybWF0XG4gKlxuICogVGhlIHByb3BlcnRpZXMgaXMgYW4gYXJyYXkgd2l0aCB0aGUgZm9ybSBbbnVtYmVyLCBhbHRlcmF0aW9uLCBvY3RhdmUsIGR1cmF0aW9uXVxuICpcbiAqIEBuYW1lIGFycmF5LnRvUHJvcHNcbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgLSB0aGUgcGl0Y2ggaW4gY29vcmQgZm9ybWF0XG4gKiBAcmV0dXJuIHtBcnJheX0gdGhlIHBpdGNoIGluIHByb3BlcnR5IGZvcm1hdFxuICpcbiAqIEBleGFtcGxlXG4gKiB2YXIgdG9Qcm9wcyA9IHJlcXVpcmUoJ211c2ljLW5vdGF0aW9uL2FycmF5L3RvLXByb3BzJylcbiAqIHRvUHJvcHMoWzIsIDEsIDRdKSAvLyA9PiBbMSwgMiwgNF1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYXJyKSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShhcnIpKSByZXR1cm4gbnVsbFxuICB2YXIgaW5kZXggPSAoYXJyWzBdICsgMSkgJSA3XG4gIGlmIChpbmRleCA8IDApIGluZGV4ID0gNyArIGluZGV4XG4gIHZhciBiYXNlID0gQkFTRVNbaW5kZXhdXG4gIHZhciBhbHRlciA9IE1hdGguZmxvb3IoKGFyclswXSArIDEpIC8gNylcbiAgdmFyIG9jdCA9IGFyci5sZW5ndGggPT09IDEgPyBudWxsIDogYXJyWzFdIC0gYmFzZVsxXSArIGFsdGVyICogNFxuICB2YXIgZHVyID0gYXJyWzJdIHx8IG51bGxcbiAgcmV0dXJuIFtiYXNlWzBdLCBhbHRlciwgb2N0LCBkdXJdXG59XG4iLCIndXNlIHN0cmljdCdcblxudmFyIG1lbW9pemUgPSByZXF1aXJlKCcuLi9tZW1vaXplJylcbnZhciBmcm9tUHJvcHMgPSByZXF1aXJlKCcuLi9hcnJheS9mcm9tLXByb3BzJylcbnZhciBJTlRFUlZBTCA9IHJlcXVpcmUoJy4vcmVnZXgnKVxudmFyIFRZUEVTID0gJ1BNTVBQTU0nXG52YXIgUUFMVCA9IHtcbiAgUDogeyBkZGRkOiAtNCwgZGRkOiAtMywgZGQ6IC0yLCBkOiAtMSwgUDogMCwgQTogMSwgQUE6IDIsIEFBQTogMywgQUFBQTogNCB9LFxuICBNOiB7IGRkZDogLTQsIGRkOiAtMywgZDogLTIsIG06IC0xLCBNOiAwLCBBOiAxLCBBQTogMiwgQUFBOiAzLCBBQUFBOiA0IH1cbn1cblxuLyoqXG4gKiBQYXJzZSBhIFtpbnRlcnZhbCBzaG9ydGhhbmQgbm90YXRpb25dKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0ludGVydmFsXyhtdXNpYykjU2hvcnRoYW5kX25vdGF0aW9uKVxuICogdG8gW2ludGVydmFsIGNvb3JkIG5vdGF0aW9uXShodHRwczovL2dpdGh1Yi5jb20vZGFuaWdiL211c2ljLmFycmF5Lm5vdGF0aW9uKVxuICpcbiAqIFRoaXMgZnVuY3Rpb24gaXMgY2FjaGVkIGZvciBiZXR0ZXIgcGVyZm9ybWFuY2UuXG4gKlxuICogQG5hbWUgaW50ZXJ2YWwucGFyc2VcbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIHtTdHJpbmd9IGludGVydmFsIC0gdGhlIGludGVydmFsIHN0cmluZ1xuICogQHJldHVybiB7QXJyYXl9IHRoZSBpbnRlcnZhbCBpbiBhcnJheSBub3RhdGlvbiBvciBudWxsIGlmIG5vdCBhIHZhbGlkIGludGVydmFsXG4gKlxuICogQGV4YW1wbGVcbiAqIHZhciBwYXJzZSA9IHJlcXVpcmUoJ211c2ljLW5vdGF0aW9uL2ludGVydmFsL3BhcnNlJylcbiAqIHBhcnNlKCczbScpIC8vID0+IFsyLCAtMSwgMF1cbiAqIHBhcnNlKCc5YicpIC8vID0+IFsxLCAtMSwgMV1cbiAqIHBhcnNlKCctMk0nKSAvLyA9PiBbNiwgLTEsIC0xXVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IG1lbW9pemUoZnVuY3Rpb24gKHN0cikge1xuICB2YXIgbSA9IElOVEVSVkFMLmV4ZWMoc3RyKVxuICBpZiAoIW0pIHJldHVybiBudWxsXG4gIHZhciBkaXIgPSAobVsyXSB8fCBtWzddKSA9PT0gJy0nID8gLTEgOiAxXG4gIHZhciBudW0gPSArKG1bM10gfHwgbVs4XSkgLSAxXG4gIHZhciBxID0gbVs0XSB8fCBtWzZdIHx8ICcnXG5cbiAgdmFyIHNpbXBsZSA9IG51bSAlIDdcblxuICB2YXIgYWx0XG4gIGlmIChxID09PSAnJykgYWx0ID0gMFxuICBlbHNlIGlmIChxWzBdID09PSAnIycpIGFsdCA9IHEubGVuZ3RoXG4gIGVsc2UgaWYgKHFbMF0gPT09ICdiJykgYWx0ID0gLXEubGVuZ3RoXG4gIGVsc2Uge1xuICAgIGFsdCA9IFFBTFRbVFlQRVNbc2ltcGxlXV1bcV1cbiAgICBpZiAodHlwZW9mIGFsdCA9PT0gJ3VuZGVmaW5lZCcpIHJldHVybiBudWxsXG4gIH1cbiAgdmFyIG9jdCA9IE1hdGguZmxvb3IobnVtIC8gNylcbiAgdmFyIGFyciA9IGZyb21Qcm9wcyhzaW1wbGUsIGFsdCwgb2N0KVxuICByZXR1cm4gZGlyID09PSAxID8gYXJyIDogWy1hcnJbMF0sIC1hcnJbMV1dXG59KVxuIiwiXG4vLyBzaG9ydGhhbmQgdG9uYWwgbm90YXRpb24gKHdpdGggcXVhbGl0eSBhZnRlciBudW1iZXIpXG52YXIgVE9OQUwgPSAnKFstK10/KShcXFxcZCspKGR7MSw0fXxtfE18UHxBezEsNH18YnsxLDR9fCN7MSw0fXwpJ1xuLy8gc3RyaWN0IHNob3J0aGFuZCBub3RhdGlvbiAod2l0aCBxdWFsaXR5IGJlZm9yZSBudW1iZXIpXG52YXIgU1RSSUNUID0gJyhBQXxBfFB8TXxtfGR8ZGQpKFstK10/KShcXFxcZCspJ1xudmFyIENPTVBPU0UgPSAnKD86KCcgKyBUT05BTCArICcpfCgnICsgU1RSSUNUICsgJykpJ1xuXG4vKipcbiAqIEEgcmVnZXggZm9yIHBhcnNlIGludGVydmFscyBpbiBzaG9ydGhhbmQgbm90YXRpb25cbiAqXG4gKiBUaHJlZSBkaWZmZXJlbnQgc2hvcnRoYW5kIG5vdGF0aW9ucyBhcmUgc3VwcG9ydGVkOlxuICpcbiAqIC0gZGVmYXVsdCBbZGlyZWN0aW9uXVtudW1iZXJdW3F1YWxpdHldOiB0aGUgcHJlZmVycmVkIHN0eWxlIGAzTWAsIGAtNUFgXG4gKiAtIHN0cmljdDogW3F1YWxpdHldW2RpcmVjdGlvbl1bbnVtYmVyXSwgZm9yIGV4YW1wbGU6IGBNM2AsIGBBLTVgXG4gKiAtIGFsdGVyZWQ6IFtkaXJlY3Rpb25dW251bWJlcl1bYWx0ZXJhdGlvbnNdOiBgM2AsIGAtNSNgXG4gKlxuICogQG5hbWUgaW50ZXJ2YWwucmVnZXhcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBuZXcgUmVnRXhwKCdeJyArIENPTVBPU0UgKyAnJCcpXG4iLCIndXNlIHN0cmljdCdcblxudmFyIHByb3BzID0gcmVxdWlyZSgnLi4vYXJyYXkvdG8tcHJvcHMnKVxudmFyIGNhY2hlID0ge31cblxuLyoqXG4gKiBHZXQgYSBzdHJpbmcgd2l0aCBhIFtzaG9ydGhhbmQgaW50ZXJ2YWwgbm90YXRpb25dKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0ludGVydmFsXyhtdXNpYykjU2hvcnRoYW5kX25vdGF0aW9uKVxuICogZnJvbSBpbnRlcnZhbCBpbiBbYXJyYXkgbm90YXRpb25dKGh0dHBzOi8vZ2l0aHViLmNvbS9kYW5pZ2IvbXVzaWMuYXJyYXkubm90YXRpb24pXG4gKlxuICogVGhlIHJldHVybmVkIHN0cmluZyBoYXMgdGhlIGZvcm06IGBudW1iZXIgKyBxdWFsaXR5YCB3aGVyZSBudW1iZXIgaXMgdGhlIGludGVydmFsIG51bWJlclxuICogKHBvc2l0aXZlIGludGVnZXIgZm9yIGFzY2VuZGluZyBpbnRlcnZhbHMsIG5lZ2F0aXZlIGludGVnZXIgZm9yIGRlc2NlbmRpbmcgaW50ZXJ2YWxzLCBuZXZlciAwKVxuICogYW5kIHRoZSBxdWFsaXR5IGlzIG9uZSBvZjogJ00nLCAnbScsICdQJywgJ2QnLCAnQScgKG1ham9yLCBtaW5vciwgcGVyZmVjdCwgZGltaXNoZWQsIGF1Z21lbnRlZClcbiAqXG4gKiBAbmFtZSBpbnRlcnZhbC5zdHJcbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIHtBcnJheX0gaW50ZXJ2YWwgLSB0aGUgaW50ZXJ2YWwgaW4gYXJyYXkgbm90YXRpb25cbiAqIEByZXR1cm4ge1N0cmluZ30gdGhlIGludGVydmFsIHN0cmluZyBpbiBzaG9ydGhhbmQgbm90YXRpb24gb3IgbnVsbCBpZiBub3QgdmFsaWQgaW50ZXJ2YWxcbiAqXG4gKiBAZXhhbXBsZVxuICogdmFyIHN0ciA9IHJlcXVpcmUoJ211c2ljLW5vdGF0aW9uL2ludGVydmFsL3N0cicpXG4gKiBzdHIoWzEsIDAsIDBdKSAvLyA9PiAnMk0nXG4gKiBzdHIoWzEsIDAsIDFdKSAvLyA9PiAnOU0nXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGFycikge1xuICBpZiAoIUFycmF5LmlzQXJyYXkoYXJyKSB8fCBhcnIubGVuZ3RoICE9PSAyKSByZXR1cm4gbnVsbFxuICB2YXIgc3RyID0gJ3wnICsgYXJyWzBdICsgJ3wnICsgYXJyWzFdXG4gIHJldHVybiBzdHIgaW4gY2FjaGUgPyBjYWNoZVtzdHJdIDogY2FjaGVbc3RyXSA9IGJ1aWxkKGFycilcbn1cblxudmFyIEFMVEVSID0ge1xuICBQOiBbJ2RkZGQnLCAnZGRkJywgJ2RkJywgJ2QnLCAnUCcsICdBJywgJ0FBJywgJ0FBQScsICdBQUFBJ10sXG4gIE06IFsnZGRkJywgJ2RkJywgJ2QnLCAnbScsICdNJywgJ0EnLCAnQUEnLCAnQUFBJywgJ0FBQUEnXVxufVxudmFyIFRZUEVTID0gJ1BNTVBQTU0nXG5cbmZ1bmN0aW9uIGJ1aWxkIChjb29yZCkge1xuICB2YXIgcCA9IHByb3BzKGNvb3JkKVxuICB2YXIgdCA9IFRZUEVTW3BbMF1dXG5cbiAgdmFyIGRpciwgbnVtLCBhbHRcbiAgLy8gaWYgaXRzIGRlc2NlbmluZywgaW52ZXJ0IG51bWJlclxuICBpZiAocFsyXSA8IDApIHtcbiAgICBkaXIgPSAtMVxuICAgIG51bSA9ICg4IC0gcFswXSkgLSA3ICogKHBbMl0gKyAxKVxuICAgIGFsdCA9IHQgPT09ICdQJyA/IC1wWzFdIDogLShwWzFdICsgMSlcbiAgfSBlbHNlIHtcbiAgICBkaXIgPSAxXG4gICAgbnVtID0gcFswXSArIDEgKyA3ICogcFsyXVxuICAgIGFsdCA9IHBbMV1cbiAgfVxuICB2YXIgcSA9IEFMVEVSW3RdWzQgKyBhbHRdXG4gIHJldHVybiBkaXIgKiBudW0gKyBxXG59XG4iLCIndXNlIHN0cmljdCdcblxuLyoqXG4gKiBBIHNpbXBsZSBhbmQgZmFzdCBtZW1vaXphdGlvbiBmdW5jdGlvblxuICpcbiAqIEl0IGhlbHBzIGNyZWF0aW5nIGZ1bmN0aW9ucyB0aGF0IGNvbnZlcnQgZnJvbSBzdHJpbmcgdG8gcGl0Y2ggaW4gYXJyYXkgZm9ybWF0LlxuICogQmFzaWNhbGx5IGl0IGRvZXMgdHdvIHRoaW5nczpcbiAqIC0gZW5zdXJlIHRoZSBmdW5jdGlvbiBvbmx5IHJlY2VpdmVzIHN0cmluZ3NcbiAqIC0gbWVtb2l6ZSB0aGUgcmVzdWx0XG4gKlxuICogQG5hbWUgbWVtb2l6ZVxuICogQGZ1bmN0aW9uXG4gKiBAcHJpdmF0ZVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChmbikge1xuICB2YXIgY2FjaGUgPSB7fVxuICByZXR1cm4gZnVuY3Rpb24gKHN0cikge1xuICAgIGlmICh0eXBlb2Ygc3RyICE9PSAnc3RyaW5nJykgcmV0dXJuIG51bGxcbiAgICByZXR1cm4gKHN0ciBpbiBjYWNoZSkgPyBjYWNoZVtzdHJdIDogY2FjaGVbc3RyXSA9IGZuKHN0cilcbiAgfVxufVxuIiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBtZW1vaXplID0gcmVxdWlyZSgnLi4vbWVtb2l6ZScpXG52YXIgUiA9IHJlcXVpcmUoJy4vcmVnZXgnKVxudmFyIEJBU0VTID0geyBDOiBbMCwgMF0sIEQ6IFsyLCAtMV0sIEU6IFs0LCAtMl0sIEY6IFstMSwgMV0sIEc6IFsxLCAwXSwgQTogWzMsIC0xXSwgQjogWzUsIC0yXSB9XG5cbi8qKlxuICogR2V0IGEgcGl0Y2ggaW4gW2FycmF5IG5vdGF0aW9uXSgpXG4gKiBmcm9tIGEgc3RyaW5nIGluIFtzY2llbnRpZmljIHBpdGNoIG5vdGF0aW9uXShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9TY2llbnRpZmljX3BpdGNoX25vdGF0aW9uKVxuICpcbiAqIFRoZSBzdHJpbmcgdG8gcGFyc2UgbXVzdCBiZSBpbiB0aGUgZm9ybSBvZjogYGxldHRlclthY2NpZGVudGFsc11bb2N0YXZlXWBcbiAqIFRoZSBhY2NpZGVudGFscyBjYW4gYmUgdXAgdG8gZm91ciAjIChzaGFycCkgb3IgYiAoZmxhdCkgb3IgdHdvIHggKGRvdWJsZSBzaGFycHMpXG4gKlxuICogVGhpcyBmdW5jdGlvbiBpcyBjYWNoZWQgZm9yIGJldHRlciBwZXJmb3JtYW5jZS5cbiAqXG4gKiBAbmFtZSBub3RlLnBhcnNlXG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgLSB0aGUgc3RyaW5nIHRvIHBhcnNlXG4gKiBAcmV0dXJuIHtBcnJheX0gdGhlIG5vdGUgaW4gYXJyYXkgbm90YXRpb24gb3IgbnVsbCBpZiBub3QgdmFsaWQgbm90ZVxuICpcbiAqIEBleGFtcGxlXG4gKiB2YXIgcGFyc2UgPSByZXF1aXJlKCdtdXNpYy1ub3RhdGlvbi9ub3RlL3BhcnNlJylcbiAqIHBhcnNlKCdDJykgLy8gPT4gWyAwIF1cbiAqIHBhcnNlKCdjIycpIC8vID0+IFsgOCBdXG4gKiBwYXJzZSgnYyMjJykgLy8gPT4gWyAxNiBdXG4gKiBwYXJzZSgnQ3gnKSAvLyA9PiBbIDE2IF0gKGRvdWJsZSBzaGFycClcbiAqIHBhcnNlKCdDYicpIC8vID0+IFsgLTYgXVxuICogcGFyc2UoJ2RiJykgLy8gPT4gWyAtNCBdXG4gKiBwYXJzZSgnRzQnKSAvLyA9PiBbIDIsIDMsIG51bGwgXVxuICogcGFyc2UoJ2MjMycpIC8vID0+IFsgOCwgLTEsIG51bGwgXVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IG1lbW9pemUoZnVuY3Rpb24gKHN0cikge1xuICB2YXIgbSA9IFIuZXhlYyhzdHIpXG4gIGlmICghbSB8fCBtWzVdKSByZXR1cm4gbnVsbFxuXG4gIHZhciBiYXNlID0gQkFTRVNbbVsxXS50b1VwcGVyQ2FzZSgpXVxuICB2YXIgYWx0ID0gbVsyXS5yZXBsYWNlKC94L2csICcjIycpLmxlbmd0aFxuICBpZiAobVsyXVswXSA9PT0gJ2InKSBhbHQgKj0gLTFcbiAgdmFyIGZpZnRocyA9IGJhc2VbMF0gKyA3ICogYWx0XG4gIGlmICghbVszXSkgcmV0dXJuIFtmaWZ0aHNdXG4gIHZhciBvY3QgPSArbVszXSArIGJhc2VbMV0gLSA0ICogYWx0XG4gIHZhciBkdXIgPSBtWzRdID8gKyhtWzRdLnN1YnN0cmluZygxKSkgOiBudWxsXG4gIHJldHVybiBbZmlmdGhzLCBvY3QsIGR1cl1cbn0pXG4iLCIndXNlIHN0cmljdCdcblxuLyoqXG4gKiBBIHJlZ2V4IGZvciBtYXRjaGluZyBub3RlIHN0cmluZ3MgaW4gc2NpZW50aWZpYyBub3RhdGlvbi5cbiAqXG4gKiBUaGUgbm90ZSBzdHJpbmcgc2hvdWxkIGhhdmUgdGhlIGZvcm0gYGxldHRlclthY2NpZGVudGFsc11bb2N0YXZlXVsvZHVyYXRpb25dYFxuICogd2hlcmU6XG4gKlxuICogLSBsZXR0ZXI6IChSZXF1aXJlZCkgaXMgYSBsZXR0ZXIgZnJvbSBBIHRvIEcgZWl0aGVyIHVwcGVyIG9yIGxvd2VyIGNhc2VcbiAqIC0gYWNjaWRlbnRhbHM6IChPcHRpb25hbCkgY2FuIGJlIG9uZSBvciBtb3JlIGBiYCAoZmxhdHMpLCBgI2AgKHNoYXJwcykgb3IgYHhgIChkb3VibGUgc2hhcnBzKS5cbiAqIFRoZXkgY2FuIE5PVCBiZSBtaXhlZC5cbiAqIC0gb2N0YXZlOiAoT3B0aW9uYWwpIGEgcG9zaXRpdmUgb3IgbmVnYXRpdmUgaW50ZWdlclxuICogLSBkdXJhdGlvbjogKE9wdGlvbmFsKSBhbnl0aGluZyBmb2xsb3dzIGEgc2xhc2ggYC9gIGlzIGNvbnNpZGVyZWQgdG8gYmUgdGhlIGR1cmF0aW9uXG4gKiAtIGVsZW1lbnQ6IChPcHRpb25hbCkgYWRkaXRpb25hbGx5IGFueXRoaW5nIGFmdGVyIHRoZSBkdXJhdGlvbiBpcyBjb25zaWRlcmVkIHRvXG4gKiBiZSB0aGUgZWxlbWVudCBuYW1lIChmb3IgZXhhbXBsZTogJ0MyIGRvcmlhbicpXG4gKlxuICogQG5hbWUgbm90ZS5yZWdleFxuICogQGV4YW1wbGVcbiAqIHZhciBSID0gcmVxdWlyZSgnbXVzaWMtbm90YXRpb24vbm90ZS9yZWdleCcpXG4gKiBSLmV4ZWMoJ2MjNCcpIC8vID0+IFsnYyM0JywgJ2MnLCAnIycsICc0JywgJycsICcnXVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IC9eKFthLWdBLUddKSgjezEsfXxiezEsfXx4ezEsfXwpKC0/XFxkKikoXFwvXFxkK3wpXFxzKiguKilcXHMqJC9cbiIsIid1c2Ugc3RyaWN0J1xuXG52YXIgcHJvcHMgPSByZXF1aXJlKCcuLi9hcnJheS90by1wcm9wcycpXG52YXIgYWNjID0gcmVxdWlyZSgnLi4vYWNjaWRlbnRhbHMvc3RyJylcbnZhciBjYWNoZSA9IHt9XG5cbi8qKlxuICogR2V0IFtzY2llbnRpZmljIHBpdGNoIG5vdGF0aW9uXShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9TY2llbnRpZmljX3BpdGNoX25vdGF0aW9uKSBzdHJpbmdcbiAqIGZyb20gcGl0Y2ggaW4gW2FycmF5IG5vdGF0aW9uXSgpXG4gKlxuICogQXJyYXkgbGVuZ3RoIG11c3QgYmUgMSBvciAzIChzZWUgYXJyYXkgbm90YXRpb24gZG9jdW1lbnRhdGlvbilcbiAqXG4gKiBUaGUgcmV0dXJuZWQgc3RyaW5nIGZvcm1hdCBpcyBgbGV0dGVyWysgYWNjaWRlbnRhbHNdWysgb2N0YXZlXVsvZHVyYXRpb25dYCB3aGVyZSB0aGUgbGV0dGVyXG4gKiBpcyBhbHdheXMgdXBwZXJjYXNlLCBhbmQgdGhlIGFjY2lkZW50YWxzLCBvY3RhdmUgYW5kIGR1cmF0aW9uIGFyZSBvcHRpb25hbC5cbiAqXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIG1lbW9pemVkIGZvciBiZXR0ZXIgcGVyZm9tYW5jZS5cbiAqXG4gKiBAbmFtZSBub3RlLnN0clxuICogQGZ1bmN0aW9uXG4gKiBAcGFyYW0ge0FycmF5fSBhcnIgLSB0aGUgbm90ZSBpbiBhcnJheSBub3RhdGlvblxuICogQHJldHVybiB7U3RyaW5nfSB0aGUgbm90ZSBpbiBzY2llbnRpZmljIG5vdGF0aW9uIG9yIG51bGwgaWYgbm90IHZhbGlkIG5vdGUgYXJyYXlcbiAqXG4gKiBAZXhhbXBsZVxuICogdmFyIHN0ciA9IHJlcXVpcmUoJ211c2ljLW5vdGF0aW9uL25vdGUvc3RyJylcbiAqIHN0cihbMF0pIC8vID0+ICdGJ1xuICogc3RyKFswLCA0XSkgLy8gPT4gbnVsbCAoaXRzIGFuIGludGVydmFsKVxuICogc3RyKFswLCA0LCBudWxsXSkgLy8gPT4gJ0Y0J1xuICogc3RyKFswLCA0LCAyXSkgLy8gPT4gJ0Y0LzInXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGFycikge1xuICBpZiAoIUFycmF5LmlzQXJyYXkoYXJyKSB8fCBhcnIubGVuZ3RoIDwgMSB8fCBhcnIubGVuZ3RoID09PSAyKSByZXR1cm4gbnVsbFxuICB2YXIgc3RyID0gJ3wnICsgYXJyWzBdICsgJ3wnICsgYXJyWzFdICsgJ3wnICsgYXJyWzJdXG4gIHJldHVybiBzdHIgaW4gY2FjaGUgPyBjYWNoZVtzdHJdIDogY2FjaGVbc3RyXSA9IGJ1aWxkKGFycilcbn1cblxudmFyIExFVFRFUiA9IFsnQycsICdEJywgJ0UnLCAnRicsICdHJywgJ0EnLCAnQiddXG5mdW5jdGlvbiBidWlsZCAoY29vcmQpIHtcbiAgdmFyIHAgPSBwcm9wcyhjb29yZClcbiAgcmV0dXJuIExFVFRFUltwWzBdXSArIGFjYyhwWzFdKSArIChwWzJdICE9PSBudWxsID8gcFsyXSA6ICcnKSArIChwWzNdICE9PSBudWxsID8gJy8nICsgcFszXSA6ICcnKVxufVxuIiwiJ3VzZSBzdHJpY3QnXG5cbmZ1bmN0aW9uIGN1cnJ5IChmbiwgYXJpdHkpIHtcbiAgaWYgKGFyaXR5ID09PSAxKSByZXR1cm4gZm5cbiAgcmV0dXJuIGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHJldHVybiBmdW5jdGlvbiAoYykgeyByZXR1cm4gZm4oYSwgYykgfVxuICAgIHJldHVybiBmbihhLCBiKVxuICB9XG59XG5cbi8qKlxuICogRGVjb3JhdGUgYSBmdW5jdGlvbiB0byB3b3JrIHdpdGggaW50ZXJ2YWxzLCBub3RlcyBvciBwaXRjaGVzIGluXG4gKiBbYXJyYXkgbm90YXRpb25dKGh0dHBzOi8vZ2l0aHViLmNvbS9kYW5pZ2IvdG9uYWwvdHJlZS9uZXh0L3BhY2thZ2VzL211c2ljLW5vdGF0aW9uKVxuICogd2l0aCBpbmRlcGVuZGVuY2Ugb2Ygc3RyaW5nIHJlcHJlc2VudGF0aW9ucy5cbiAqXG4gKiBUaGlzIGlzIHRoZSBiYXNlIG9mIHRoZSBwbHVnZ2FibGUgbm90YXRpb24gc3lzdGVtIG9mXG4gKiBbdG9uYWxdKGh0dHBzOi8vZ2l0aHViLmNvbS9kYW5pZ2IvdG9uYWwpXG4gKlxuICogQG5hbWUgb3BlcmF0aW9uXG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHBhcnNlIC0gdGhlIHBhcnNlclxuICogQHBhcmFtIHtGdW5jdGlvbn0gc3RyIC0gdGhlIHN0cmluZyBidWlsZGVyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiAtIHRoZSBvcGVyYXRpb24gdG8gZGVjb3JhdGVcbiAqXG4gKiBAZXhhbXBsZVxuICogdmFyIHBhcnNlID0gcmVxdWlyZSgnbXVzaWMtbm90YXRpb24vaW50ZXJ2YWwvcGFyc2UnKVxuICogdmFyIHN0ciA9IHJlcXVpcmUoJ211c2ljLW5vdGF0aW9uL2ludGVydmFsL3N0cicpXG4gKiB2YXIgb3BlcmF0aW9uID0gcmVxdWlyZSgnbXVzaWMtbm90YXRpb24vb3BlcmF0aW9uJykocGFyc2UsIHN0cilcbiAqIHZhciBhZGQgPSBvcGVyYXRpb24oZnVuY3Rpb24oYSwgYikgeyByZXR1cm4gW2FbMF0gKyBiWzBdLCBhWzFdICsgYlsxXV0gfSlcbiAqIGFkZCgnM20nLCAnM00nKSAvLyA9PiAnNVAnXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gb3AgKHBhcnNlLCBzdHIsIGZuKSB7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyKSByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIG9wKHBhcnNlLCBzdHIsIGYpIH1cbiAgcmV0dXJuIGN1cnJ5KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgdmFyIGFjID0gcGFyc2UoYSlcbiAgICB2YXIgYmMgPSBwYXJzZShiKVxuICAgIGlmICghYWMgJiYgIWJjKSByZXR1cm4gZm4oYSwgYilcbiAgICB2YXIgdiA9IGZuKGFjIHx8IGEsIGJjIHx8IGIpXG4gICAgcmV0dXJuIHN0cih2KSB8fCB2XG4gIH0sIGZuLmxlbmd0aClcbn1cbiIsInZhciBub3RlID0gcmVxdWlyZSgnLi4vbm90ZS9wYXJzZScpXG52YXIgaW50ZXJ2YWwgPSByZXF1aXJlKCcuLi9pbnRlcnZhbC9wYXJzZScpXG5cbi8qKlxuICogQ29udmVydCBhIG5vdGUgb3IgaW50ZXJ2YWwgc3RyaW5nIHRvIGEgW3BpdGNoIGluIGNvb3JkIG5vdGF0aW9uXSgpXG4gKlxuICogQG5hbWUgcGl0Y2gucGFyc2VcbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIHtTdHJpbmd9IHBpdGNoIC0gdGhlIG5vdGUgb3IgaW50ZXJ2YWwgdG8gcGFyc2VcbiAqIEByZXR1cm4ge0FycmF5fSB0aGUgcGl0Y2ggaW4gYXJyYXkgbm90YXRpb25cbiAqXG4gKiBAZXhhbXBsZVxuICogdmFyIHBhcnNlID0gcmVxdWlyZSgnbXVzaWMtbm90YXRpb24vcGl0Y2gvcGFyc2UnKVxuICogcGFyc2UoJ0MyJykgLy8gPT4gWzAsIDIsIG51bGxdXG4gKiBwYXJzZSgnNVAnKSAvLyA9PiBbMSwgMF1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobikgeyByZXR1cm4gbm90ZShuKSB8fCBpbnRlcnZhbChuKSB9XG4iLCJ2YXIgbm90ZSA9IHJlcXVpcmUoJy4uL25vdGUvc3RyJylcbnZhciBpbnRlcnZhbCA9IHJlcXVpcmUoJy4uL2ludGVydmFsL3N0cicpXG5cbi8qKlxuICogQ29udmVydCBhIHBpdGNoIGluIGNvb3JkaW5hdGUgbm90YXRpb24gdG8gc3RyaW5nLiBJdCBkZWFscyB3aXRoIG5vdGVzLCBwaXRjaFxuICogY2xhc3NlcyBhbmQgaW50ZXJ2YWxzLlxuICpcbiAqIEBuYW1lIHBpdGNoLnN0clxuICogQGZ1bmlzdHJvblxuICogQHBhcmFtIHtBcnJheX0gcGl0Y2ggLSB0aGUgcGl0Y2ggaW4gYXJyYXkgbm90YXRpb25cbiAqIEByZXR1cm4ge1N0cmluZ30gdGhlIHBpdGNoIHN0cmluZ1xuICpcbiAqIEBleGFtcGxlXG4gKiB2YXIgc3RyID0gcmVxdWlyZSgnbXVzaWMtbm90YXRpb24vcGl0Y2guc3RyJylcbiAqIC8vIHBpdGNoIGNsYXNzXG4gKiBzdHIoWzBdKSAvLyA9PiAnQydcbiAqIC8vIGludGVydmFsXG4gKiBzdHIoWzAsIDBdKSAvLyA9PiAnMVAnXG4gKiAvLyBub3RlXG4gKiBzdHIoWzAsIDIsIDRdKSAvLyA9PiAnQzIvNCdcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobikgeyByZXR1cm4gbm90ZShuKSB8fCBpbnRlcnZhbChuKSB9XG4iLCJ2YXIgcGFyc2UgPSByZXF1aXJlKCdtdXNpYy1ub3RhdGlvbi9waXRjaC9wYXJzZScpXG52YXIgc3RyID0gcmVxdWlyZSgnbXVzaWMtbm90YXRpb24vcGl0Y2gvc3RyJylcbnZhciBub3RhdGlvbiA9IHJlcXVpcmUoJ211c2ljLW5vdGF0aW9uL29wZXJhdGlvbicpKHBhcnNlLCBzdHIpXG5cbi8qKlxuICogR2V0IHRoZSBpbnRlcnZhbCBiZXR3ZWVuIHR3byBwaXRjaGVzXG4gKlxuICogSWYgb25lIG9yIGJvdGggYXJlIHBpdGNoIGNsYXNzZXMsIGEgc2ltcGxlIGFzY2VuZGluZyBpbnRlcnZhbCBpcyByZXR1cm5lZFxuICpcbiAqIFRoaXMgZnVuY3Rpb24gY2FuIGJlIHBhcnRpYWxseSBhcHBsaWVkIChzZWUgZXhhbXBsZXMpXG4gKlxuICogQG5hbWUgbm90ZS5pbnRlcnZhbFxuICogQGZ1bmN0aW9uXG4gKiBAcGFyYW0ge1N0cmluZ30gZnJvbSAtIHRoZSBmaXJzdCBub3RlXG4gKiBAcGFyYW0ge1N0cmluZ30gdG8gLSB0aGUgc2Vjb25kIG5vdGVcbiAqIEByZXR1cm4ge1N0cmluZ30gdGhlIGludGVydmFsIGJldHdlZW4gdGhlbVxuICpcbiAqIEBleGFtcGxlXG4gKiB2YXIgaW50ZXJ2YWwgPSByZXF1aXJlKCdub3RlLWludGVydmFsJylcbiAqIGludGVydmFsKCdDMicsICdEMycpIC8vID0+ICc5TSdcbiAqIGludGVydmFsKCdEMicsICdDMicpIC8vID0+ICctMk0nXG4gKiBpbnRlcnZhbCgnRCcsICdDJykgLy8gPT4gJzdtJ1xuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBwYXJ0aWFsbHkgYXBwbGllZFxuICogdmFyIGZyb21DID0gaW50ZXJ2YWwoJ0MnKVxuICogZnJvbUMoJ0QnKSAvLyA9PiAnMk0nXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gbm90YXRpb24oZnVuY3Rpb24gKGEsIGIpIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KGEpIHx8ICFBcnJheS5pc0FycmF5KGIpKSByZXR1cm4gbnVsbFxuICBpZiAoYS5sZW5ndGggPT09IDEgfHwgYi5sZW5ndGggPT09IDEpIHtcbiAgICB2YXIgYmFzZSA9IGJbMF0gLSBhWzBdXG4gICAgcmV0dXJuIFtiYXNlLCAtTWF0aC5mbG9vcihiYXNlICogNyAvIDEyKV1cbiAgfVxuICByZXR1cm4gW2JbMF0gLSBhWzBdLCBiWzFdIC0gYVsxXV1cbn0pXG4iLCJ2YXIgcGFyc2UgPSByZXF1aXJlKCdtdXNpYy1ub3RhdGlvbi9waXRjaC9wYXJzZScpXG52YXIgc3RyID0gcmVxdWlyZSgnbXVzaWMtbm90YXRpb24vcGl0Y2gvc3RyJylcbnZhciBvcGVyYXRpb24gPSByZXF1aXJlKCdtdXNpYy1ub3RhdGlvbi9vcGVyYXRpb24nKShwYXJzZSwgc3RyKVxuXG4vKipcbiAqIFRyYW5zcG9zZXMgYSBub3RlIGJ5IGFuIGludGVydmFsLlxuICpcbiAqIEdpdmVuIGEgbm90ZSBhbmQgYW4gaW50ZXJ2YWwgaXQgcmV0dXJucyB0aGUgdHJhbnNwb3NlZCBub3RlLiBJdCBjYW4gYmUgdXNlZFxuICogdG8gYWRkIGludGVydmFscyBpZiBib3RoIHBhcmFtZXRlcnMgYXJlIGludGVydmFscy5cbiAqXG4gKiBUaGUgb3JkZXIgb2YgdGhlIHBhcmFtZXRlcnMgaXMgaW5kaWZmZXJlbnQuXG4gKlxuICogVGhpcyBmdW5jdGlvbiBpcyBjdXJyaWZpZWQgc28gaXQgY2FuIGJlIHVzZWQgdG8gbWFwIGFycmF5cyBvZiBub3Rlcy5cbiAqXG4gKiBAbmFtZSB0cmFuc3Bvc2VcbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IGludGVydmFsIC0gdGhlIGludGVydmFsLiBJZiBpdHMgZmFsc2UsIHRoZSBub3RlIGlzIG5vdFxuICogdHJhbnNwb3NlZC5cbiAqIEBwYXJhbSB7U3RyaW5nfEFycmF5fSBub3RlIC0gdGhlIG5vdGUgdG8gdHJhbnNwb3NlXG4gKiBAcmV0dXJuIHtTdHJpbmd8QXJyYXl9IHRoZSBub3RlIHRyYW5zcG9zZWRcbiAqXG4gKiBAZXhhbXBsZVxuICogdmFyIHRyYW5zcG9zZSA9IHJlcXVpcmUoJ25vdGUtdHJhbnNwb3NlcicpXG4gKiB0cmFuc3Bvc2UoJzNtJywgJ0M0JykgLy8gPT4gJ0ViNCdcbiAqIHRyYW5zcG9zZSgnQzQnLCAnM20nKSAvLyA9PiAnRWI0J1xuICogdHJhbnBvc2UoWzEsIDAsIDJdLCBbMywgLTEsIDBdKSAvLyA9PiBbMywgMCwgMl1cbiAqIFsnQycsICdEJywgJ0UnXS5tYXAodHJhbnNwb3NlKCczTScpKSAvLyA9PiBbJ0UnLCAnRiMnLCAnRyMnXVxuICovXG52YXIgdHJhbnNwb3NlID0gb3BlcmF0aW9uKGZ1bmN0aW9uIChpLCBuKSB7XG4gIGlmIChpID09PSBmYWxzZSkgcmV0dXJuIG5cbiAgZWxzZSBpZiAoIUFycmF5LmlzQXJyYXkoaSkgfHwgIUFycmF5LmlzQXJyYXkobikpIHJldHVybiBudWxsXG4gIGVsc2UgaWYgKGkubGVuZ3RoID09PSAxIHx8IG4ubGVuZ3RoID09PSAxKSByZXR1cm4gW25bMF0gKyBpWzBdXVxuICB2YXIgZCA9IGkubGVuZ3RoID09PSAyICYmIG4ubGVuZ3RoID09PSAyID8gbnVsbCA6IG5bMl0gfHwgaVsyXVxuICByZXR1cm4gW25bMF0gKyBpWzBdLCBuWzFdICsgaVsxXSwgZF1cbn0pXG5cbmlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cykgbW9kdWxlLmV4cG9ydHMgPSB0cmFuc3Bvc2VcbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykgd2luZG93LnRyYW5zcG9zZSA9IHRyYW5zcG9zZVxuIiwiKGZ1bmN0aW9uKCkge1xuXG5cdHZhciBzZXR0ZXJHZXR0ZXJpZnkgPSByZXF1aXJlKCdzZXR0ZXItZ2V0dGVyaWZ5Jyk7XG5cdHZhciBzYWZlUmVnaXN0ZXJFbGVtZW50ID0gcmVxdWlyZSgnc2FmZS1yZWdpc3Rlci1lbGVtZW50Jyk7XG5cblx0Ly8gSWRlYWxseSBpdCB3b3VsZCBiZSBiZXR0ZXIgdG8gZXh0ZW5kIHRoZSBIVE1MSW5wdXRFbGVtZW50IHByb3RvdHlwZSBidXRcblx0Ly8gaXQgZG9lc24ndCBzZWVtIHRvIGJlIHdvcmtpbmcgYW5kIEkgZG9uJ3QgZ2V0IGFueSBkaXN0aW5jdCBlbGVtZW50IGF0IGFsbFxuXHQvLyBvciBJIGdldCBhbiBcIlR5cGVFcnJvcjogJ3R5cGUnIHNldHRlciBjYWxsZWQgb24gYW4gb2JqZWN0IHRoYXQgZG9lcyBub3QgaW1wbGVtZW50IGludGVyZmFjZSBIVE1MSW5wdXRFbGVtZW50LlwiXG5cdC8vIC4uLiBzbyB1c2luZyBqdXN0IEhUTUxFbGVtZW50IGZvciBub3dcblx0dmFyIHByb3RvID0gT2JqZWN0LmNyZWF0ZShIVE1MRWxlbWVudC5wcm90b3R5cGUpO1xuXG5cdHByb3RvLmNyZWF0ZWRDYWxsYmFjayA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0dmFyIHRoYXQgPSB0aGlzO1xuXG5cdFx0Ly8gVmFsdWVzXG5cdFx0dmFyIHByb3BlcnRpZXMgPSB7XG5cdFx0XHRtaW46IDAsXG5cdFx0XHRtYXg6IDEwMCxcblx0XHRcdHZhbHVlOiA1MCxcblx0XHRcdHN0ZXA6IDFcblx0XHR9O1xuXG5cdFx0c2V0dGVyR2V0dGVyaWZ5KHRoaXMsIHByb3BlcnRpZXMsIHtcblx0XHRcdGFmdGVyU2V0dGluZzogZnVuY3Rpb24ocHJvcGVydHksIHZhbHVlKSB7XG5cdFx0XHRcdHVwZGF0ZURpc3BsYXkodGhhdCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFxuXHRcdHRoaXMuX3Byb3BlcnRpZXMgPSBwcm9wZXJ0aWVzO1xuXG5cdFx0Ly8gTWFya3VwXG5cdFx0dmFyIHNsaWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG5cdFx0c2xpZGVyLnR5cGUgPSAncmFuZ2UnO1xuXG5cdFx0dmFyIHZhbHVlU3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcblxuXHRcdHRoaXMuX3NsaWRlciA9IHNsaWRlcjtcblx0XHR0aGlzLl92YWx1ZVNwYW4gPSB2YWx1ZVNwYW47XG5cblx0XHR0aGlzLmFwcGVuZENoaWxkKHNsaWRlcik7XG5cdFx0dGhpcy5hcHBlbmRDaGlsZCh2YWx1ZVNwYW4pO1xuXG5cdFx0c2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZnVuY3Rpb24oKSB7XG5cdFx0XHR0aGF0LnZhbHVlID0gc2xpZGVyLnZhbHVlICogMS4wO1xuXHRcdH0pO1xuXG5cdH07XG5cblx0XG5cdHZhciBzbGlkZXJBdHRyaWJ1dGVzID0gWyAnbWluJywgJ21heCcsICd2YWx1ZScsICdzdGVwJyBdO1xuXG5cdHByb3RvLmF0dGFjaGVkQ2FsbGJhY2sgPSBmdW5jdGlvbigpIHtcblxuXHRcdHZhciBhdHRycyA9IHRoaXMuYXR0cmlidXRlcztcblx0XHR2YXIgdmFsdWVJc1RoZXJlID0gZmFsc2U7XG5cdFxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBhdHRycy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGF0dHIgPSBhdHRyc1tpXTtcblxuXHRcdFx0aWYoYXR0ci5uYW1lID09PSAndmFsdWUnKSB7XG5cdFx0XHRcdHZhbHVlSXNUaGVyZSA9IHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEp1c3Qgc2VuZGluZyBzZW5zaWJsZSBhdHRyaWJ1dGVzIHRvIHRoZSBzbGlkZXIgaXRzZWxmXG5cdFx0XHRpZihzbGlkZXJBdHRyaWJ1dGVzLmluZGV4T2YoYXR0ci5uYW1lKSAhPT0gLTEpIHtcblx0XHRcdFx0dGhpcy5fcHJvcGVydGllc1thdHRyLm5hbWVdID0gYXR0ci52YWx1ZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBJZiBub3Qgc3BlY2lmaWVkLCB0aGUgZGVmYXVsdCB2YWx1ZSBoYXMgdG8gYmUgXG5cdFx0Ly8gKG1pbiArIG1heCkgLyAyIGFzIHRoZSBub3JtYWwgc2xpZGVyIHdvdWxkIGRvIGFzIHdlbGwuXG5cdFx0aWYoIXZhbHVlSXNUaGVyZSkge1xuXHRcdFx0dmFyIGNhbGN1bGF0ZWRWYWx1ZSA9ICh0aGlzLl9wcm9wZXJ0aWVzLm1pbiAqIDEuMCArIHRoaXMuX3Byb3BlcnRpZXMubWF4ICogMS4wKSAvIDIuMDtcblx0XHRcdHRoaXMuX3Byb3BlcnRpZXMudmFsdWUgPSBjYWxjdWxhdGVkVmFsdWU7XG5cdFx0fVxuXG5cdFx0dXBkYXRlRGlzcGxheSh0aGlzKTtcblxuXHR9O1xuXG5cblx0ZnVuY3Rpb24gdXBkYXRlRGlzcGxheShjb21wbykge1xuXHRcdGNvbXBvLl92YWx1ZVNwYW4uaW5uZXJIVE1MID0gY29tcG8uX3Byb3BlcnRpZXMudmFsdWU7XG5cdFx0Y29tcG8uX3NsaWRlci52YWx1ZSA9IGNvbXBvLl9wcm9wZXJ0aWVzLnZhbHVlO1xuXHRcdGNvbXBvLl9zbGlkZXIubWluID0gY29tcG8uX3Byb3BlcnRpZXMubWluO1xuXHRcdGNvbXBvLl9zbGlkZXIubWF4ID0gY29tcG8uX3Byb3BlcnRpZXMubWF4O1xuXHRcdGNvbXBvLl9zbGlkZXIuc3RlcCA9IGNvbXBvLl9wcm9wZXJ0aWVzLnN0ZXA7XG5cdH1cblxuXHQvL1xuXHRcblx0dmFyIGNvbXBvbmVudCA9IHt9O1xuXHRjb21wb25lbnQucHJvdG90eXBlID0gcHJvdG87XG5cdGNvbXBvbmVudC5yZWdpc3RlciA9IGZ1bmN0aW9uKG5hbWUpIHtcblx0XHRzYWZlUmVnaXN0ZXJFbGVtZW50KG5hbWUsIHByb3RvKTtcblx0fTtcblxuXHRpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcblx0XHRkZWZpbmUoZnVuY3Rpb24oKSB7IHJldHVybiBjb21wb25lbnQ7IH0pO1xuXHR9IGVsc2UgaWYodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGNvbXBvbmVudDtcblx0fSBlbHNlIHtcblx0XHRjb21wb25lbnQucmVnaXN0ZXIoJ29wZW5tdXNpYy1zbGlkZXInKTsgLy8gYXV0b21hdGljIHJlZ2lzdHJhdGlvblxuXHR9XG5cbn0pLmNhbGwodGhpcyk7XG5cblxuIiwiJ3VzZSBzdHJpY3QnO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZGF0YSwgb3B0aW9ucykge1xuXHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblx0ZGF0YSA9IGRhdGEuc2xpY2UoKTtcblxuXHR2YXIgY291bnQgPSBOdW1iZXIob3B0aW9ucy5jb3VudCkgfHwgMTtcblx0dmFyIHJldCA9IFtdO1xuXG5cdGlmICghQXJyYXkuaXNBcnJheShkYXRhKSkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIGFuIGFycmF5IGFzIHRoZSBmaXJzdCBhcmd1bWVudCcpO1xuXHR9XG5cblx0aWYgKGNvdW50ID4gZGF0YS5sZW5ndGgpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0NvdW50IG11c3QgYmUgbG93ZXIgb3IgdGhlIHNhbWUgYXMgdGhlIG51bWJlciBvZiBwaWNrcycpO1xuXHR9XG5cblx0d2hpbGUgKGNvdW50LS0pIHtcblx0XHRyZXQucHVzaChkYXRhLnNwbGljZShNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBkYXRhLmxlbmd0aCksIDEpWzBdKTtcblx0fVxuXG5cdHJldHVybiByZXQ7XG59O1xuIiwidmFyIG1ha2VEaXN0b3J0aW9uQ3VydmUgPSByZXF1aXJlKCdtYWtlLWRpc3RvcnRpb24tY3VydmUnKVxudmFyIE1JRElVdGlscyA9IHJlcXVpcmUoJ21pZGl1dGlscycpXG52YXIgYWRzciA9IHJlcXVpcmUoJ2EtZC1zLXInKVxuXG4vLyB5ciBmdW5jdGlvbiBzaG91bGQgYWNjZXB0IGFuIGF1ZGlvQ29udGV4dCwgYW5kIG9wdGlvbmFsIHBhcmFtcy9vcHRzXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChhYywgb3B0cykge1xuICAvLyBtYWtlIHNvbWUgYXVkaW9Ob2RlcywgY29ubmVjdCB0aGVtLCBzdG9yZSB0aGVtIG9uIHRoZSBvYmplY3RcbiAgdmFyIGF1ZGlvTm9kZXMgPSB7fVxuXG4gIHZhciBvc2MxID0gYWMuY3JlYXRlT3NjaWxsYXRvcigpXG4gIHZhciBvc2MyID0gYWMuY3JlYXRlT3NjaWxsYXRvcigpXG4gIHZhciBvc2MzID0gYWMuY3JlYXRlT3NjaWxsYXRvcigpXG4gIHZhciBvc2Nub2lzZSA9IGFjLmNyZWF0ZU9zY2lsbGF0b3IoKVxuICBvc2MxLnR5cGUgPSAndHJpYW5nbGUnXG4gIG9zYzIudHlwZSA9ICd0cmlhbmdsZSdcbiAgb3NjMy50eXBlID0gJ3NpbmUnXG4gIG9zY25vaXNlLnR5cGUgPSAnc2F3dG9vdGgnXG5cbiAgLy8gYXJlIHRoZXNlIHRvb29vbyBzbWFsbD9cbiAgb3NjMS5kZXR1bmUudmFsdWUgPSAwLjc1ICogKChNYXRoLnJhbmRvbSgpICogMikgLSAxKVxuICBvc2MyLmRldHVuZS52YWx1ZSA9IDAuNzUgKiAoKE1hdGgucmFuZG9tKCkgKiAyKSAtIDEpXG4gIG9zYzMuZGV0dW5lLnZhbHVlID0gMC4zICogKChNYXRoLnJhbmRvbSgpICogMikgLSAxKVxuXG4gIHZhciBsZWZ0ZmlsdGVyID0gYWMuY3JlYXRlQmlxdWFkRmlsdGVyKClcbiAgbGVmdGZpbHRlci50eXBlID0gJ2xvd3Bhc3MnXG4gIGxlZnRmaWx0ZXIuUS52YWx1ZSA9IDdcbiAgbGVmdGZpbHRlci5kZXR1bmUudmFsdWUgPSAwLjc1ICogKChNYXRoLnJhbmRvbSgpICogMikgLSAxKVxuICBsZWZ0ZmlsdGVyLmZyZXF1ZW5jeS5zZXRWYWx1ZUF0VGltZSg1MDAsIGFjLmN1cnJlbnRUaW1lKVxuXG4gIHZhciByaWdodGZpbHRlciA9IGFjLmNyZWF0ZUJpcXVhZEZpbHRlcigpXG4gIHJpZ2h0ZmlsdGVyLnR5cGUgPSAnbG93cGFzcydcbiAgcmlnaHRmaWx0ZXIuUS52YWx1ZSA9IDdcbiAgcmlnaHRmaWx0ZXIuZGV0dW5lLnZhbHVlID0gMC43NSAqICgoTWF0aC5yYW5kb20oKSAqIDIpIC0gMSlcbiAgcmlnaHRmaWx0ZXIuZnJlcXVlbmN5LnNldFZhbHVlQXRUaW1lKDUwMCwgYWMuY3VycmVudFRpbWUpXG5cblxuICB2YXIgbm9pc2VnYWluID0gYWMuY3JlYXRlR2FpbigpXG4gIG5vaXNlZ2Fpbi5nYWluLnNldFZhbHVlQXRUaW1lKDAsIGFjLmN1cnJlbnRUaW1lKVxuXG4gIHZhciBkZWxheSA9IGFjLmNyZWF0ZURlbGF5KDAuMzUpXG5cbiAgdmFyIGNvbXByZXNzb3IgPSBhYy5jcmVhdGVEeW5hbWljc0NvbXByZXNzb3IoKVxuICBjb21wcmVzc29yLnRocmVzaG9sZC52YWx1ZSA9IC0zMFxuICBjb21wcmVzc29yLmtuZWUudmFsdWUgPSAzM1xuICBjb21wcmVzc29yLnJhdGlvLnZhbHVlID0gOVxuICBjb21wcmVzc29yLnJlZHVjdGlvbi52YWx1ZSA9IC0xMFxuICBjb21wcmVzc29yLmF0dGFjay52YWx1ZSA9IDAuMTVcbiAgY29tcHJlc3Nvci5yZWxlYXNlLnZhbHVlID0gMC4zNVxuXG4gIHZhciBnYWluID0gYWMuY3JlYXRlR2FpbigpXG4gIGdhaW4uZ2Fpbi5zZXRWYWx1ZUF0VGltZSgwLCBhYy5jdXJyZW50VGltZSlcblxuXG4gIHZhciBkaXN0b3J0aW9uID0gYWMuY3JlYXRlV2F2ZVNoYXBlcigpXG4gIGRpc3RvcnRpb24uY3VydmUgPSBtYWtlRGlzdG9ydGlvbkN1cnZlKDc1KVxuXG4gIHZhciBtYWluZmlsdGVyID0gYWMuY3JlYXRlQmlxdWFkRmlsdGVyKClcbiAgbWFpbmZpbHRlci50eXBlID0gJ2xvd3Bhc3MnXG4gIG1haW5maWx0ZXIuZnJlcXVlbmN5LnNldFZhbHVlQXRUaW1lKDUwMCwgYWMuY3VycmVudFRpbWUpXG5cbiAgb3Njbm9pc2UuY29ubmVjdChub2lzZWdhaW4pXG4gIG9zYzEuY29ubmVjdChsZWZ0ZmlsdGVyKVxuICBvc2MyLmNvbm5lY3QocmlnaHRmaWx0ZXIpXG4gIGxlZnRmaWx0ZXIuY29ubmVjdChjb21wcmVzc29yKVxuICByaWdodGZpbHRlci5jb25uZWN0KGNvbXByZXNzb3IpXG4gIG9zYzMuY29ubmVjdChjb21wcmVzc29yKVxuICBub2lzZWdhaW4uY29ubmVjdChkZWxheSlcbiAgbm9pc2VnYWluLmNvbm5lY3QoZGlzdG9ydGlvbilcbiAgZGVsYXkuY29ubmVjdChjb21wcmVzc29yKVxuICBjb21wcmVzc29yLmNvbm5lY3QoZ2FpbilcbiAgZ2Fpbi5jb25uZWN0KGRpc3RvcnRpb24pXG4gIGRpc3RvcnRpb24uY29ubmVjdChtYWluZmlsdGVyKVxuXG4gIC8vIGdvdHRhIGJlIGEgYmV0dGVyIHdheSB0byBkbyB0aGlzLi4uIG9oIHdlbGxcbiAgYXVkaW9Ob2Rlcy5vc2Nub2lzZSA9IG9zY25vaXNlXG4gIGF1ZGlvTm9kZXMubm9pc2VnYWluID0gbm9pc2VnYWluXG4gIGF1ZGlvTm9kZXMub3NjMSA9IG9zYzFcbiAgYXVkaW9Ob2Rlcy5vc2MyID0gb3NjMlxuICBhdWRpb05vZGVzLm9zYzMgPSBvc2MzXG4gIGF1ZGlvTm9kZXMubGVmdGZpbHRlciA9IGxlZnRmaWx0ZXJcbiAgYXVkaW9Ob2Rlcy5yaWdodGZpbHRlciA9IHJpZ2h0ZmlsdGVyXG4gIGF1ZGlvTm9kZXMubWFpbmZpbHRlciA9IG1haW5maWx0ZXJcbiAgYXVkaW9Ob2Rlcy5nYWluID0gZ2FpblxuICBhdWRpb05vZGVzLmRlbGF5ID0gZGVsYXlcbiAgYXVkaW9Ob2Rlcy5kaXN0b3J0aW9uID0gZGlzdG9ydGlvblxuICBhdWRpb05vZGVzLmNvbXByZXNzb3IgPSBjb21wcmVzc29yXG5cbiAgLy8gZ29zaCBpIHdpc2ggdGhlcmUgd2FzIGFuIGF1ZGlvTm9kZSB0aGF0IGp1c3QgZGlkIHRoaXMuLi5cbiAgYXVkaW9Ob2Rlcy5zZXR0aW5ncyA9IHtcbiAgICBhdHRhY2s6IDAuMSxcbiAgICBkZWNheTogMC4wNSxcbiAgICBzdXN0YWluOiAwLjMsXG4gICAgcmVsZWFzZTogMC4xLFxuICAgIHBlYWs6IDAuNSxcbiAgICBtaWQ6IDAuMyxcbiAgICBlbmQ6IDAuMDAwMDAxXG4gIH1cblxuICByZXR1cm4ge1xuICAgIGNvbm5lY3Q6IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgLy8gLy8gdGhpcyBmdW5jdGlvbiBzaG91bGQgY2FsbCBgY29ubmVjdGAgb24geXIgb3V0cHV0IG5vZGVzIHdpdGggYGlucHV0YCBhcyB0aGUgYXJnXG4gICAgICBhdWRpb05vZGVzLm1haW5maWx0ZXIuY29ubmVjdChpbnB1dClcblxuICAgICAgLy8ganVzdCBsZXQgdGhlbSBidXp6IGZvcmV2ZXIsIGRlYWwgd2l0aCBcIm5vdGVzXCIgdmlhIGFkc3IgdHJpY2tzXG4gICAgICBhdWRpb05vZGVzLm9zY25vaXNlLnN0YXJ0KGFjLmN1cnJlbnRUaW1lKVxuICAgICAgYXVkaW9Ob2Rlcy5vc2MxLnN0YXJ0KGFjLmN1cnJlbnRUaW1lKVxuICAgICAgYXVkaW9Ob2Rlcy5vc2MyLnN0YXJ0KGFjLmN1cnJlbnRUaW1lKVxuICAgICAgYXVkaW9Ob2Rlcy5vc2MzLnN0YXJ0KGFjLmN1cnJlbnRUaW1lKVxuICAgIH0sXG4gICAgc3RhcnQ6IGZ1bmN0aW9uICh3aGVuKSB7XG4gICAgICAvLyBjb25zb2xlLmxvZygnc3RhcnQnLCBhdWRpb05vZGVzLnNldHRpbmdzKVxuXG4gICAgICBhZHNyKGF1ZGlvTm9kZXMuZ2Fpbiwgd2hlbiwgYXVkaW9Ob2Rlcy5zZXR0aW5ncylcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdvbmUnKVxuICAgICAgdmFyIGNsb25lZCA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoYXVkaW9Ob2Rlcy5zZXR0aW5ncykpXG4gICAgICBjbG9uZWQucGVhayAvPSAyLjBcbiAgICAgIGNsb25lZC5taWQgLz0gMi4wXG4gICAgICAvLyBjb25zb2xlLmxvZygnZGlkaXQnLCBjbG9uZWQpXG4gICAgICBhZHNyKGF1ZGlvTm9kZXMubm9pc2VnYWluLCB3aGVuLCBjbG9uZWQpXG4gICAgfSxcbiAgICBzdG9wOiBmdW5jdGlvbiAod2hlbikge1xuICAgICAgYXVkaW9Ob2Rlcy5vc2Nub2lzZS5zdG9wKHdoZW4pXG4gICAgICBhdWRpb05vZGVzLm9zYzEuc3RvcCh3aGVuKVxuICAgICAgYXVkaW9Ob2Rlcy5vc2MyLnN0b3Aod2hlbilcbiAgICAgIGF1ZGlvTm9kZXMub3NjMy5zdG9wKHdoZW4pXG4gICAgICBjb25zb2xlLmxvZygnd2h5ZCB1IHB1c2ggdGhlIHBpYW5vIG9mZiB0aGUgYnVpbGRpbmc/IG5vdCBpdCBpcyBicm9rZW4sIGZvcmV2ZXIuIGdvdHRhIG1ha2UgYSBuZXcgb25lIScpXG4gICAgfSxcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIChvcHRzLCB3aGVuKSB7XG4gICAgICAvLyBhdmFpbGFibGUgb3B0czpcbiAgICAgIC8vIHttaWRpTm90ZTogNjIsIGF0dGFjazogLCBkZWNheTogLCBzdXN0YWluOiAsIHJlbGVhc2U6IH1cbiAgICAgIE9iamVjdC5rZXlzKG9wdHMpLmZvckVhY2goZnVuY3Rpb24gKGspIHtcbiAgICAgICAgdmFyIHYgPSBvcHRzW2tdXG4gICAgICAgIGlmIChrID09ICdtaWRpTm90ZScgfHwgayA9PSAnZnJlcScpIHtcbiAgICAgICAgICB2YXIgZnJlcSA9IGsgPT0gJ21pZGlOb3RlJyA/IE1JRElVdGlscy5ub3RlTnVtYmVyVG9GcmVxdWVuY3kodikgOiB2XG4gICAgICAgICAgYXVkaW9Ob2Rlcy5sZWZ0ZmlsdGVyLmZyZXF1ZW5jeS5zZXRWYWx1ZUF0VGltZShmcmVxICsgKE1hdGgucmFuZG9tKCkgKiAoZnJlcSAvIDIuNSkpLCB3aGVuKVxuICAgICAgICAgIGF1ZGlvTm9kZXMucmlnaHRmaWx0ZXIuZnJlcXVlbmN5LnNldFZhbHVlQXRUaW1lKGZyZXEgKyAoTWF0aC5yYW5kb20oKSAqIChmcmVxIC8gMi41KSksIHdoZW4pXG4gICAgICAgICAgYXVkaW9Ob2Rlcy5tYWluZmlsdGVyLmZyZXF1ZW5jeS5zZXRWYWx1ZUF0VGltZShmcmVxICsgKE1hdGgucmFuZG9tKCkgKiAoZnJlcSAvIDMuNSkpLCB3aGVuKVxuICAgICAgICAgIGF1ZGlvTm9kZXMub3Njbm9pc2UuZnJlcXVlbmN5LnNldFZhbHVlQXRUaW1lKGZyZXEsIHdoZW4pXG4gICAgICAgICAgYXVkaW9Ob2Rlcy5vc2MxLmZyZXF1ZW5jeS5zZXRWYWx1ZUF0VGltZShmcmVxLCB3aGVuKVxuICAgICAgICAgIGF1ZGlvTm9kZXMub3NjMi5mcmVxdWVuY3kuc2V0VmFsdWVBdFRpbWUoZnJlcSwgd2hlbilcbiAgICAgICAgICBhdWRpb05vZGVzLm9zYzMuZnJlcXVlbmN5LnNldFZhbHVlQXRUaW1lKGZyZXEgLyAyLjAsIHdoZW4pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8ganVzdCBhbiBBRFNSIHZhbHVlXG4gICAgICAgICAgYXVkaW9Ob2Rlcy5zZXR0aW5nc1trXSA9IHZcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9LFxuICAgIG5vZGVzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyByZXR1cm5zIGFuIG9iamVjdCBvZiBge3N0cmluZ0tleTogYXVkaW9Ob2RlfWAgZm9yIHJhdyBtYW5pcHVsYXRpb25cbiAgICAgIHJldHVybiBhdWRpb05vZGVzXG4gICAgfVxuICB9XG59IiwidmFyIG1ha2VEaXN0b3J0aW9uQ3VydmUgPSByZXF1aXJlKCdtYWtlLWRpc3RvcnRpb24tY3VydmUnKVxudmFyIGFkc3IgPSByZXF1aXJlKCdhLWQtcy1yJylcbi8vIHlyIGZ1bmN0aW9uIHNob3VsZCBhY2NlcHQgYW4gYXVkaW9Db250ZXh0LCBhbmQgb3B0aW9uYWwgcGFyYW1zL29wdHNcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGFjLCBvcHRzKSB7XG4gIC8vIG1ha2Ugc29tZSBhdWRpb05vZGVzLCBjb25uZWN0IHRoZW0sIHN0b3JlIHRoZW0gb24gdGhlIG9iamVjdFxuICB2YXIgYXVkaW9Ob2RlcyA9IHtcbiAgICBvbmU6IGFjLmNyZWF0ZU9zY2lsbGF0b3IoKSxcbiAgICB0d286IGFjLmNyZWF0ZU9zY2lsbGF0b3IoKSxcbiAgICB0aHJlZTogYWMuY3JlYXRlT3NjaWxsYXRvcigpLFxuICAgIGZvdXI6IGFjLmNyZWF0ZU9zY2lsbGF0b3IoKSxcbiAgICBmaXZlOiBhYy5jcmVhdGVPc2NpbGxhdG9yKCksXG4gICAgc2l4OiBhYy5jcmVhdGVPc2NpbGxhdG9yKCksXG4gICAgbWFpbmdhaW46IGFjLmNyZWF0ZUdhaW4oKSxcbiAgICBkaXN0b3J0aW9uOiBhYy5jcmVhdGVXYXZlU2hhcGVyKCksXG4gICAgYmFuZGZpbHRlcjogYWMuY3JlYXRlQmlxdWFkRmlsdGVyKCksXG4gICAgaGlnaGZpbHRlcjogYWMuY3JlYXRlQmlxdWFkRmlsdGVyKCksXG4gICAgZGVsYXk6IGFjLmNyZWF0ZURlbGF5KDAuMDUpLFxuICAgIGRnYWluOiBhYy5jcmVhdGVHYWluKCksXG4gICAgZW52ZWxvcGU6IGFjLmNyZWF0ZUdhaW4oKSxcbiAgICBzZXR0aW5nczoge1xuICAgICAgYXR0YWNrOiAwLjAyLFxuICAgICAgZGVjYXk6IDAuMDMsXG4gICAgICBzdXN0YWluOiAwLjAwMDAwMSxcbiAgICAgIHJlbGVhc2U6IDAuMyxcbiAgICAgIHBlYWs6IDAuNyxcbiAgICAgIG1pZDogMC4yNSxcbiAgICAgIGVuZDogMC4wMDAwMVxuICAgIH1cbiAgfVxuXG4gIGF1ZGlvTm9kZXMub25lLnR5cGUgPSAnc3F1YXJlJ1xuICBhdWRpb05vZGVzLm9uZS5mcmVxdWVuY3kuc2V0VmFsdWVBdFRpbWUoODAsIGFjLmN1cnJlbnRUaW1lKVxuICBhdWRpb05vZGVzLnR3by50eXBlID0gJ3NxdWFyZSdcbiAgYXVkaW9Ob2Rlcy50d28uZnJlcXVlbmN5LnNldFZhbHVlQXRUaW1lKDExNSwgYWMuY3VycmVudFRpbWUpXG4gIGF1ZGlvTm9kZXMudGhyZWUudHlwZSA9ICdzcXVhcmUnXG4gIGF1ZGlvTm9kZXMudGhyZWUuZnJlcXVlbmN5LnNldFZhbHVlQXRUaW1lKDE2NSwgYWMuY3VycmVudFRpbWUpXG4gIGF1ZGlvTm9kZXMuZm91ci50eXBlID0gJ3NxdWFyZSdcbiAgYXVkaW9Ob2Rlcy5mb3VyLmZyZXF1ZW5jeS5zZXRWYWx1ZUF0VGltZSgyNTAsIGFjLmN1cnJlbnRUaW1lKVxuICBhdWRpb05vZGVzLmZpdmUudHlwZSA9ICdzcXVhcmUnXG4gIGF1ZGlvTm9kZXMuZml2ZS5mcmVxdWVuY3kuc2V0VmFsdWVBdFRpbWUoMzQwLCBhYy5jdXJyZW50VGltZSlcbiAgYXVkaW9Ob2Rlcy5zaXgudHlwZSA9ICdzcXVhcmUnXG4gIGF1ZGlvTm9kZXMuc2l4LmZyZXF1ZW5jeS5zZXRWYWx1ZUF0VGltZSg0MjAsIGFjLmN1cnJlbnRUaW1lKVxuXG4gIGF1ZGlvTm9kZXMubWFpbmdhaW4uZ2Fpbi52YWx1ZSA9IDAuNzUgLyA2LjBcblxuICBhdWRpb05vZGVzLmRpc3RvcnRpb24uY3VydmUgPSBtYWtlRGlzdG9ydGlvbkN1cnZlKDMzMylcblxuICBhdWRpb05vZGVzLmJhbmRmaWx0ZXIudHlwZSA9ICdiYW5kcGFzcydcbiAgYXVkaW9Ob2Rlcy5iYW5kZmlsdGVyLmZyZXF1ZW5jeS5zZXRWYWx1ZUF0VGltZSgxMDQyMCwgYWMuY3VycmVudFRpbWUpXG5cbiAgYXVkaW9Ob2Rlcy5oaWdoZmlsdGVyLnR5cGUgPSAnaGlnaHBhc3MnXG4gIGF1ZGlvTm9kZXMuaGlnaGZpbHRlci5mcmVxdWVuY3kuc2V0VmFsdWVBdFRpbWUoNjY2MCwgYWMuY3VycmVudFRpbWUpXG5cbiAgYXVkaW9Ob2Rlcy5kZ2Fpbi5nYWluLnZhbHVlID0gMC41XG5cbiAgYXVkaW9Ob2Rlcy5lbnZlbG9wZS5nYWluLnNldFZhbHVlQXRUaW1lKDAsIGFjLmN1cnJlbnRUaW1lKVxuXG4gIGF1ZGlvTm9kZXMub25lLmNvbm5lY3QoYXVkaW9Ob2Rlcy5tYWluZ2FpbilcbiAgYXVkaW9Ob2Rlcy50d28uY29ubmVjdChhdWRpb05vZGVzLm1haW5nYWluKVxuICBhdWRpb05vZGVzLnRocmVlLmNvbm5lY3QoYXVkaW9Ob2Rlcy5tYWluZ2FpbilcbiAgYXVkaW9Ob2Rlcy5mb3VyLmNvbm5lY3QoYXVkaW9Ob2Rlcy5tYWluZ2FpbilcbiAgYXVkaW9Ob2Rlcy5maXZlLmNvbm5lY3QoYXVkaW9Ob2Rlcy5tYWluZ2FpbilcbiAgYXVkaW9Ob2Rlcy5zaXguY29ubmVjdChhdWRpb05vZGVzLm1haW5nYWluKVxuICBhdWRpb05vZGVzLm1haW5nYWluLmNvbm5lY3QoYXVkaW9Ob2Rlcy5kaXN0b3J0aW9uKVxuICBhdWRpb05vZGVzLmRpc3RvcnRpb24uY29ubmVjdChhdWRpb05vZGVzLmJhbmRmaWx0ZXIpXG4gIGF1ZGlvTm9kZXMuYmFuZGZpbHRlci5jb25uZWN0KGF1ZGlvTm9kZXMuaGlnaGZpbHRlcilcbiAgYXVkaW9Ob2Rlcy5oaWdoZmlsdGVyLmNvbm5lY3QoYXVkaW9Ob2Rlcy5kZWxheSlcbiAgYXVkaW9Ob2Rlcy5kZWxheS5jb25uZWN0KGF1ZGlvTm9kZXMuZGdhaW4pXG4gIGF1ZGlvTm9kZXMuZGdhaW4uY29ubmVjdChhdWRpb05vZGVzLmVudmVsb3BlKVxuXG4gIGF1ZGlvTm9kZXMub25lLnN0YXJ0KGFjLmN1cnJlbnRUaW1lKVxuICBhdWRpb05vZGVzLnR3by5zdGFydChhYy5jdXJyZW50VGltZSlcbiAgYXVkaW9Ob2Rlcy50aHJlZS5zdGFydChhYy5jdXJyZW50VGltZSlcbiAgYXVkaW9Ob2Rlcy5mb3VyLnN0YXJ0KGFjLmN1cnJlbnRUaW1lKVxuICBhdWRpb05vZGVzLmZpdmUuc3RhcnQoYWMuY3VycmVudFRpbWUpXG4gIGF1ZGlvTm9kZXMuc2l4LnN0YXJ0KGFjLmN1cnJlbnRUaW1lKVxuICByZXR1cm4ge1xuICAgIGNvbm5lY3Q6IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgYXVkaW9Ob2Rlcy5lbnZlbG9wZS5jb25uZWN0KGlucHV0KVxuICAgIH0sXG4gICAgc3RhcnQ6IGZ1bmN0aW9uICh3aGVuKSB7XG4gICAgICAvLyAvL3RoaXMgZnVuY3Rpb24gc2hvdWxkIGNhbGwgYHN0YXJ0KHdoZW4pYCBvbiB5ciBzb3VyY2Ugbm9kZXMuIFByb2JhYmx5IG9zY2lsbGF0b3JzL3NhbXBsZXJzIGkgZ3Vlc3MsIGFuZCBhbnkgTEZPIHRvbyFcbiAgICAgIGFkc3IoYXVkaW9Ob2Rlcy5lbnZlbG9wZSwgd2hlbiwgYXVkaW9Ob2Rlcy5zZXR0aW5ncylcbiAgICB9LFxuICAgIHN0b3A6IGZ1bmN0aW9uICh3aGVuKSB7XG4gICAgICAvLyAvLyBzYW1lIHRoaW5nIGFzIHN0YXJ0IGJ1dCB3aXRoIGBzdG9wKHdoZW4pYFxuICAgICAgYXVkaW9Ob2Rlcy5zb3VyY2Uuc3RvcCh3aGVuKVxuICAgICAgYXVkaW9Ob2Rlcy5zb3VyY2Uuc3RvcCh3aGVuKVxuICAgICAgYXVkaW9Ob2Rlcy5zb3VyY2Uuc3RvcCh3aGVuKVxuICAgICAgYXVkaW9Ob2Rlcy5zb3VyY2Uuc3RvcCh3aGVuKVxuICAgICAgYXVkaW9Ob2Rlcy5zb3VyY2Uuc3RvcCh3aGVuKVxuICAgICAgYXVkaW9Ob2Rlcy5zb3VyY2Uuc3RvcCh3aGVuKVxuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAob3B0cykge1xuICAgICAgLy8gb3B0aW9uYWw6IGZvciBwZXJmb3JtaW5nIGhpZ2gtbGV2ZWwgdXBkYXRlcyBvbiB0aGUgaW5zdHJ1bWVudC5cbiAgICAgIE9iamVjdC5rZXlzKG9wdHMpLmZvckVhY2goZnVuY3Rpb24gKGspIHtcbiAgICAgICAgdmFyIHYgPSBvcHRzW2tdXG4gICAgICAgIC8vID8/Pz9cbiAgICAgIH0pXG4gICAgfSxcbiAgICBub2RlczogZnVuY3Rpb24gKCkge1xuICAgICAgLy8gcmV0dXJucyBhbiBvYmplY3Qgb2YgYHtzdHJpbmdLZXk6IGF1ZGlvTm9kZX1gIGZvciByYXcgbWFuaXB1bGF0aW9uXG4gICAgICByZXR1cm4gYXVkaW9Ob2Rlc1xuICAgIH1cbiAgfVxufSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc2FmZVJlZ2lzdHJhdGlvbihuYW1lLCBwcm90b3R5cGUpIHtcblx0dHJ5IHtcblx0XHRkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQobmFtZSwge1xuXHRcdFx0cHJvdG90eXBlOiBwcm90b3R5cGVcblx0XHR9KTtcblx0fSBjYXRjaChlKSB7XG5cdFx0Y29uc29sZS5sb2coJ0V4Y2VwdGlvbiB3aGVuIHJlZ2lzdGVyaW5nICcgKyBuYW1lICsgJzsgcGVyaGFwcyBpdCBoYXMgYmVlbiByZWdpc3RlcmVkIGFscmVhZHk/Jyk7XG5cdH1cbn07XG4iLCIoZnVuY3Rpb24oKSB7XG5cdHZhciBwcm90byA9IE9iamVjdC5jcmVhdGUoSFRNTEVsZW1lbnQucHJvdG90eXBlKVxuXG5cdHByb3RvLmNyZWF0ZWRDYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgdGhhdCA9IHRoaXNcblx0XHR0aGlzLnZhbHVlcyA9IHt9XG5cblx0XHQvLyBtYWtpbmcgd2ViIGNvbXBvbmVudHMgTVdDIGZyYW1ld29yayBwcm9vZi5cblx0XHR0aGlzLmlubmVySFRNTCA9ICcnXG5cblx0XHRmdW5jdGlvbiBtYWtlT3B0aW9uICh2YWwpIHtcblx0XHRcdHJldHVybiAnPG9wdGlvbiB2YWx1ZT1cIicgKyB2YWwgKyAnXCI+JyArIHZhbCArICc8L29wdGlvbj4nXG5cdFx0fVxuXG5cdFx0dmFyIG5vdGVTZWxlY3QgPSBbXCJDXCIsIFwiQyNcIiwgXCJEXCIsIFwiRCNcIiwgXCJFXCIsIFwiRlwiLCBcIkYjXCIsIFwiR1wiLCBcIkcjXCIsIFwiQVwiLCBcIkEjXCIsIFwiQlwiXS5tYXAobWFrZU9wdGlvbilcblx0XHR2YXIgc2NhbGVTZWxlY3QgPSBbXCJtYWpvclwiLCBcIm1pbm9yXCIsIFwicGVudE1halwiLCBcInBlbnRNaW5cIl0ubWFwKG1ha2VPcHRpb24pXG5cdFx0dmFyIHRlbXBsYXRlQ29udGVudHMgPSBbJzxzZWxlY3QgY2xhc3M9XCJ0b25pY1wiPiddLmNvbmNhdChub3RlU2VsZWN0KS5jb25jYXQoJzwvc2VsZWN0PjxzZWxlY3QgY2xhc3M9XCJzY2FsZVwiPicpLmNvbmNhdChzY2FsZVNlbGVjdCkuY29uY2F0KCc8L3NlbGVjdD4nKS5qb2luKCcnKVxuXG5cdFx0dmFyIHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKVxuXHRcdHRlbXBsYXRlLmlubmVySFRNTCA9IHRlbXBsYXRlQ29udGVudHNcblxuXHRcdHZhciBsaXZlSFRNTCA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSlcblx0XHR2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jylcblx0XHRkaXYuYXBwZW5kQ2hpbGQobGl2ZUhUTUwpXG5cblx0XHR2YXIgdG9uaWNTZWxlY3QgPSBkaXYucXVlcnlTZWxlY3RvcignW2NsYXNzPXRvbmljXScpXG5cdFx0dmFyIHNjYWxlU2VsZWN0ID0gZGl2LnF1ZXJ5U2VsZWN0b3IoJ1tjbGFzcz1zY2FsZV0nKVxuXG5cdFx0dG9uaWNTZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oZSkge1xuXHRcdFx0ZGlzcGF0Y2hFdmVudCgndG9uaWMnLCB0aGF0LCB7dmFsdWU6IGUudGFyZ2V0LnZhbHVlfSlcblx0XHR9KVxuXG5cdFx0c2NhbGVTZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oZSkge1xuXHRcdFx0ZGlzcGF0Y2hFdmVudCgnc2NhbGUnLCB0aGF0LCB7dmFsdWU6IGUudGFyZ2V0LnZhbHVlfSlcblx0XHR9KVxuXG5cdFx0dGhpcy5hcHBlbmRDaGlsZChkaXYpXG5cdFx0dGhpcy5yZWFkQXR0cmlidXRlcygpXG5cdH1cblxuXHRmdW5jdGlvbiBkaXNwYXRjaEV2ZW50KHR5cGUsIGVsZW1lbnQsIGRldGFpbCkge1xuXHRcdGRldGFpbCA9IGRldGFpbCB8fCB7fVxuXG5cdFx0dmFyIGV2ID0gbmV3IEN1c3RvbUV2ZW50KHR5cGUsIHsgZGV0YWlsOiBkZXRhaWwgfSlcblx0XHRlbGVtZW50LmRpc3BhdGNoRXZlbnQoZXYpXG5cdH1cblxuXHRwcm90by5hdHRhY2hlZENhbGxiYWNrID0gZnVuY3Rpb24oKSB7XG5cdH1cblxuXHRwcm90by5kZXRhY2hlZENhbGxiYWNrID0gZnVuY3Rpb24oKSB7XG5cdH1cblxuXHRwcm90by5yZWFkQXR0cmlidXRlcyA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciB0aGF0ID0gdGhpczsgLy8gdWdoIGRlZmVuc2Vcblx0XHRbXS5mb3JFYWNoKGZ1bmN0aW9uKGF0dHIpIHtcblx0XHRcdHRoYXQuc2V0VmFsdWUoYXR0ciwgdGhhdC5nZXRBdHRyaWJ1dGUoYXR0cikpXG5cdFx0fSlcblx0fVxuXG5cdHByb3RvLnNldFZhbHVlID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcblx0XHRpZih2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsKSB7XG5cdFx0XHR0aGlzLnZhbHVlc1tuYW1lXSA9IHZhbHVlXG5cdFx0XHR0aGlzLnF1ZXJ5U2VsZWN0b3IoJ1tjbGFzcz0nICsgbmFtZSArICddJykudmFsdWUgPSB2YWx1ZVxuXHRcdH1cblx0fVxuXG5cdHByb3RvLmdldFZhbHVlID0gZnVuY3Rpb24obmFtZSkge1xuXHRcdHJldHVybiB0aGlzLnZhbHVlc1tuYW1lXVxuXHR9XG5cblx0cHJvdG8uYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrID0gZnVuY3Rpb24oYXR0ciwgb2xkVmFsdWUsIG5ld1ZhbHVlLCBuYW1lc3BhY2UpIHtcblx0XHR0aGlzLnNldFZhbHVlKGF0dHIsIG5ld1ZhbHVlKVxuXHRcdHZhciBlID0gbmV3IEN1c3RvbUV2ZW50KCdjaGFuZ2UnLCB7ZGV0YWlsOiB0aGlzLnZhbHVlc30pXG5cdFx0dGhpcy5kaXNwYXRjaEV2ZW50KGUpXG5cdH1cblxuXHR2YXIgY29tcG9uZW50ID0ge31cblx0Y29tcG9uZW50LnByb3RvdHlwZSA9IHByb3RvXG5cdGNvbXBvbmVudC5yZWdpc3RlciA9IGZ1bmN0aW9uIChuYW1lKSB7XG5cdFx0ZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KG5hbWUsIHtwcm90b3R5cGU6IHByb3RvfSlcblx0fVxuXG5cdGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuXHRcdGRlZmluZShmdW5jdGlvbiAoKSB7IHJldHVybiBjb21wb25lbnQgfSlcblx0fSBlbHNlIGlmKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBjb21wb25lbnRcblx0fSBlbHNlIHtcblx0XHRjb21wb25lbnQucmVnaXN0ZXIoJ29wZW5tdXNpYy13ZWItY29tcG9uZW50LXRlbXBsYXRlJykgLy8gYXV0b21hdGljIHJlZ2lzdHJhdGlvblxuXHR9XG5cbn0pLmNhbGwodGhpcylcbiIsIm1vZHVsZS5leHBvcnRzID0gc2V0dGVyR2V0dGVyaWZ5O1xuXG5cbmZ1bmN0aW9uIHNldHRlckdldHRlcmlmeShvYmplY3QsIHByb3BlcnRpZXMsIGNhbGxiYWNrcykge1xuXHRjYWxsYmFja3MgPSBjYWxsYmFja3MgfHwge307XG5cdHZhciBrZXlzID0gT2JqZWN0LmtleXMocHJvcGVydGllcyk7XG5cdGtleXMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCBrZXksIG1ha2VHZXR0ZXJTZXR0ZXIocHJvcGVydGllcywga2V5LCBjYWxsYmFja3MpKTtcblx0fSk7XG59XG5cblxuZnVuY3Rpb24gbWFrZUdldHRlclNldHRlcihwcm9wZXJ0aWVzLCBwcm9wZXJ0eSwgY2FsbGJhY2tzKSB7XG5cdHZhciBhZnRlclNldHRpbmcgPSBjYWxsYmFja3MuYWZ0ZXJTZXR0aW5nIHx8IGZ1bmN0aW9uKCkge307XG5cdHJldHVybiB7XG5cdFx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBnZXRQcm9wZXJ0eShwcm9wZXJ0aWVzLCBwcm9wZXJ0eSk7XG5cdFx0fSxcblx0XHRzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRzZXRQcm9wZXJ0eShwcm9wZXJ0aWVzLCBwcm9wZXJ0eSwgdmFsdWUpO1xuXHRcdFx0YWZ0ZXJTZXR0aW5nKHByb3BlcnR5LCB2YWx1ZSk7XG5cdFx0fSxcblx0XHRlbnVtZXJhYmxlOiB0cnVlXG5cdH07XG59XG5cblxuZnVuY3Rpb24gZ2V0UHJvcGVydHkocHJvcGVydGllcywgbmFtZSkge1xuXHRyZXR1cm4gcHJvcGVydGllc1tuYW1lXTtcbn1cblxuXG5mdW5jdGlvbiBzZXRQcm9wZXJ0eShwcm9wZXJ0aWVzLCBuYW1lLCB2YWx1ZSkge1xuXHRwcm9wZXJ0aWVzW25hbWVdID0gdmFsdWU7XG59XG5cblxuIiwiZnVuY3Rpb24gcGljayAoYXJyKSB7XG4gIC8vIGNvbnNvbGUubG9nKGFycilcbiAgcmV0dXJuIGFyclt+fihNYXRoLnJhbmRvbSgpICogYXJyLmxlbmd0aCldXG59XG5cbmZ1bmN0aW9uIHJvbGwgKHByb2IpIHtcbiAgcmV0dXJuIE1hdGgucmFuZG9tKCkgPCBwcm9iXG59XG5cbi8vIEFERFxuLy8gLSBtb2R1bHVzXG4vLyAtIHJhbmRvcz8gZmxpcHNpZXM/XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGN1cnJlbnRTb25nKSB7XG4gIHZhciBpbnRlcnZhbCwgZ2xvYmFsVGljayA9IDAsIHNvbmcgPSBjdXJyZW50U29uZ1xuICByZXR1cm4ge1xuICAgIHN0YXJ0OiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoaW50ZXJ2YWwpIHRocm93KCd3dGYnKVxuICAgICAgaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGdsb2JhbFRpY2srK1xuICAgICAgICBPYmplY3Qua2V5cyhzb25nLmluc3RydW1lbnRzKS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7XG4gICAgICAgICAgdmFyIGluc3RydW1lbnQgPSBzb25nLmluc3RydW1lbnRzW2tdXG4gICAgICAgICAgdmFyIHBhdHRlcm4gPSBpbnN0cnVtZW50LnBhdHRlcm5zW3NvbmcuY3VycmVudF1cblxuICAgICAgICAgIHZhciBvbkl0c0JlYXQgPSBnbG9iYWxUaWNrICUgKHBhdHRlcm4ubW9kIHx8IDEpID09IDBcblxuICAgICAgICAgIGlmIChvbkl0c0JlYXQgJiYgcm9sbChwYXR0ZXJuLnByb2JzW3BhdHRlcm4uY3VycmVudFZlcnNpb25dW3BhdHRlcm4uY3VycmVudFRpY2tdKSkge1xuICAgICAgICAgICAgaW5zdHJ1bWVudC5wbGF5KHBhdHRlcm4ubm90ZXMgPyBwaWNrKHBhdHRlcm4ubm90ZXNbcGF0dGVybi5jdXJyZW50VmVyc2lvbl1bcGF0dGVybi5jdXJyZW50VGlja10pIDogdW5kZWZpbmVkKVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAob25JdHNCZWF0KSBwYXR0ZXJuLmN1cnJlbnRUaWNrKytcbiAgICAgICAgICBpZiAocGF0dGVybi5jdXJyZW50VGljayA9PSBwYXR0ZXJuLnByb2JzW3BhdHRlcm4uY3VycmVudFZlcnNpb25dLmxlbmd0aCkge1xuICAgICAgICAgICAgcGF0dGVybi5jdXJyZW50VGljayA9IDBcbiAgICAgICAgICAgIHBhdHRlcm4uY3VycmVudFZlcnNpb24gPSBwaWNrKHBhdHRlcm4ubmV4dHNbcGF0dGVybi5jdXJyZW50VmVyc2lvbl0pXG4gICAgICAgICAgICBpZiAoaW5zdHJ1bWVudC5sZWFkKSB7XG4gICAgICAgICAgICAgIC8vIGlmIChuZXh0U29uZykgc29uZyA9IG5leHRTb25nLCBuZXh0U29uZyA9IG51bGxcbiAgICAgICAgICAgICAgc29uZy5jdXJyZW50ID0gcGljayhzb25nLm5leHRzW3NvbmcuY3VycmVudF0pXG4gICAgICAgICAgICAgIGlmICghc29uZy5jdXJyZW50KSBhbGVydCgnaXQgaXMgb3ZlcicpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSwgNjAwMDAuMCAvIHNvbmcuYnBtKVxuICAgIH0sXG4gICAgc3RvcDogZnVuY3Rpb24gKCkge1xuICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbClcbiAgICAgIGludGVydmFsID0gbnVsbFxuICAgIH0sXG4gICAgdXBkYXRlU29uZzogZnVuY3Rpb24gKG5ld1NvbmcpIHtcbiAgICAgIHNvbmcgPSBuZXdTb25nXG4gICAgfVxuICB9XG59XG4iLCJ2YXIgYWRzciA9IHJlcXVpcmUoJ2EtZC1zLXInKVxudmFyIG1ha2VEaXN0b3J0aW9uQ3VydmUgPSByZXF1aXJlKCdtYWtlLWRpc3RvcnRpb24tY3VydmUnKVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYWMsIG9wdHMpIHtcbiAgdmFyIGF1ZGlvTm9kZXMgPSB7XG4gICAgb3NjOiBhYy5jcmVhdGVPc2NpbGxhdG9yKCksXG4gICAgZ2FpbjogYWMuY3JlYXRlR2FpbigpLFxuICAgIGRpc3Q6IGFjLmNyZWF0ZVdhdmVTaGFwZXIoKSxcbiAgICBmaWx0ZXI6IGFjLmNyZWF0ZUJpcXVhZEZpbHRlcigpLFxuICAgIHNldHRpbmdzOiB7XG4gICAgICBmcmVxOiAyNTAsXG4gICAgICBlbmRGcmVxOiAzMCxcbiAgICAgIGF0dGFjazogMC4wMDAwMDAwMDAwMDAwMDAwMDAwMDEsXG4gICAgICBkZWNheTogMC4wMDAwMDAwMDAwMDAwMDAwMDAwMDEsXG4gICAgICBzdXN0YWluOiAwLjEyLFxuICAgICAgcmVsZWFzZTogMC4xMyxcbiAgICAgIHBlYWs6IDAuNSxcbiAgICAgIG1pZDogMC4zNSxcbiAgICAgIGVuZDogMC4wMDAwMDAwMDAwMDAwMDAwMDAwMDFcbiAgICB9XG4gIH1cblxuICBhdWRpb05vZGVzLm9zYy5mcmVxdWVuY3kuc2V0VmFsdWVBdFRpbWUoMC4wMDAwMDAwMSwgYWMuY3VycmVudFRpbWUpXG4gIGF1ZGlvTm9kZXMub3NjLnN0YXJ0KGFjLmN1cnJlbnRUaW1lKVxuXG4gIGF1ZGlvTm9kZXMuZ2Fpbi5nYWluLnNldFZhbHVlQXRUaW1lKDAuMDAwMDAwMDEsIGFjLmN1cnJlbnRUaW1lKVxuXG4gIGF1ZGlvTm9kZXMuZGlzdC5jdXJ2ZSA9IG1ha2VEaXN0b3J0aW9uQ3VydmUoMjUpXG5cbiAgYXVkaW9Ob2Rlcy5maWx0ZXIudHlwZSA9ICdsb3dwYXNzJ1xuICBhdWRpb05vZGVzLmZpbHRlci5mcmVxdWVuY3kuc2V0VmFsdWVBdFRpbWUoYXVkaW9Ob2Rlcy5zZXR0aW5ncy5mcmVxICogMy41LCBhYy5jdXJyZW50VGltZSlcblxuICBhdWRpb05vZGVzLm9zYy5jb25uZWN0KGF1ZGlvTm9kZXMuZ2FpbilcbiAgYXVkaW9Ob2Rlcy5nYWluLmNvbm5lY3QoYXVkaW9Ob2Rlcy5kaXN0KVxuICBhdWRpb05vZGVzLmRpc3QuY29ubmVjdChhdWRpb05vZGVzLmZpbHRlcilcblxuICByZXR1cm4ge1xuICAgIGNvbm5lY3Q6IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgYXVkaW9Ob2Rlcy5maWx0ZXIuY29ubmVjdChpbnB1dClcbiAgICB9LFxuICAgIHN0YXJ0OiBmdW5jdGlvbiAod2hlbikge1xuICAgICAgYXVkaW9Ob2Rlcy5vc2MuZnJlcXVlbmN5LnNldFZhbHVlQXRUaW1lKGF1ZGlvTm9kZXMuc2V0dGluZ3MuZnJlcSwgd2hlbilcbiAgICAgIGF1ZGlvTm9kZXMub3NjLmZyZXF1ZW5jeS5leHBvbmVudGlhbFJhbXBUb1ZhbHVlQXRUaW1lKGF1ZGlvTm9kZXMuc2V0dGluZ3MuZW5kRnJlcSwgd2hlbiArIGF1ZGlvTm9kZXMuc2V0dGluZ3MuYXR0YWNrICsgYXVkaW9Ob2Rlcy5zZXR0aW5ncy5kZWNheSArIGF1ZGlvTm9kZXMuc2V0dGluZ3Muc3VzdGFpbiArIGF1ZGlvTm9kZXMuc2V0dGluZ3MucmVsZWFzZSlcbiAgICAgIGFkc3IoYXVkaW9Ob2Rlcy5nYWluLCB3aGVuLCBhdWRpb05vZGVzLnNldHRpbmdzKVxuICAgIH0sXG4gICAgc3RvcDogZnVuY3Rpb24gKHdoZW4pIHtcbiAgICAgIGF1ZGlvTm9kZXMuc291cmNlLnN0b3Aod2hlbilcbiAgICB9LFxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKG9wdHMpIHtcbiAgICAgIE9iamVjdC5rZXlzKG9wdHMpLmZvckVhY2goZnVuY3Rpb24gKGspIHtcbiAgICAgICAgYXVkaW9Ob2Rlcy5zZXR0aW5nc1trXSA9IG9wdHNba11cbiAgICAgIH0pXG4gICAgfSxcbiAgICBub2RlczogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGF1ZGlvTm9kZXNcbiAgICB9XG4gIH1cbn0iLCJ2YXIgbWlkaW5vdGUgPSByZXF1aXJlKCdtaWRpLW5vdGUnKVxudmFyIHVuaXEgPSByZXF1aXJlKCdsb2Rhc2gudW5pcScpXG52YXIgZmxhdHRlbiA9IHJlcXVpcmUoJ2xvZGFzaC5mbGF0dGVuJylcbnZhciBjaHVuayA9IHJlcXVpcmUoJ2xvZGFzaC5jaHVuaycpXG52YXIga2V5ID0gcmVxdWlyZSgnbXVzaWMta2V5JylcbnZhciBmaWxsID0gcmVxdWlyZSgnbG9kYXNoLmZpbGwnKVxuXG5cbmZ1bmN0aW9uIGdldFNlY3Rpb25zICh0YWJEYXRhKSB7XG4gIC8vIGdvc2gsIHRoaXMgaXMgcHJvYmFibHkgZ29ubmEgYmUgYSB0b3RhbCBtZXNzLCBodWg/XG4gIHZhciBsaW5lcyA9IHRhYkRhdGEuc3BsaXQoL1xcbi8pXG4gIHZhciBzZWN0aW9ucyA9IFtdXG4gIHZhciBjdXJyZW50ID0gW11cbiAgbGluZXMuZm9yRWFjaChmdW5jdGlvbiAobGluZSkge1xuICAgIC8vIGNvbnNvbGUubG9nKGxpbmUpXG4gICAgLy8gcmVnZXggZnJvbTogaHR0cDovL2tub3dsZXMuY28uemEvcGFyc2luZy1ndWl0YXItdGFiL1xuICAgIHZhciBwYXR0ID0gLyhbQS1HYS1nXXswLDF9WyNiXXswLDF9KVtcXHxcXF1dezAsMX0oW1xcLTAtOVxcfFxcL1xcXlxcKFxcKVxcXFxoYnB2XSspLztcbiAgICBpZiAobGluZS5tYXRjaChwYXR0KSkge1xuICAgICAgLy8gY29uc29sZS5sb2cobGluZSlcbiAgICAgIGN1cnJlbnQucHVzaChsaW5lKVxuICAgICAgaWYgKGN1cnJlbnQubGVuZ3RoID09IDYpIHtcbiAgICAgICAgc2VjdGlvbnMucHVzaChjdXJyZW50KVxuICAgICAgICBjdXJyZW50ID0gW11cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGN1cnJlbnQubGVuZ3RoID09IDQpIHNlY3Rpb25zLnB1c2goY3VycmVudCkgLy8gc2hvdWxkIGNhdGNoIGJhc3MgdGFicyBpIGd1ZXNzP1xuICAgICAgY3VycmVudCA9IFtdXG4gICAgfVxuICB9KVxuICAvLyBjb25zb2xlLmxvZyhzZWN0aW9ucylcbiAgcmV0dXJuIHNlY3Rpb25zXG59XG5cbnZhciBNSURJX05PVEVTID0gWzQwLCA0NSwgNTAsIDU1LCA1OSwgNjRdIC8vIG1heWJlIGVhc2llciB0byBrZWVwIHRoaXMgYWxsIGluIG1pZGktbm90ZSBsYW5kP1xuZnVuY3Rpb24gcmVwbGFjZU5vdGVzIChzZWN0aW9uKSB7XG4gIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHNlY3Rpb24pKS5yZXZlcnNlKCkubWFwKGZ1bmN0aW9uIChsaW5lLCBpKSB7XG4gICAgdmFyIHJvb3QgPSBNSURJX05PVEVTW2ldXG4gICAgdmFyIG5vdGVzID0gbGluZS5yZXBsYWNlKC9bXlxcZC1dL2csICcnKS5zcGxpdCgnJylcbiAgICByZXR1cm4gbm90ZXMubWFwKGZ1bmN0aW9uIChub3RlKSB7XG4gICAgICByZXR1cm4gbm90ZSAhPT0gJy0nID8gcm9vdCArIH5+bm90ZSA6ICcnXG4gICAgfSlcbiAgfSkucmV2ZXJzZSgpXG59XG5cbmZ1bmN0aW9uIGdldEtleSAoc2VjdGlvbikge1xuICB2YXIgbm90ZXMgPSBzZWN0aW9uLm1hcChmdW5jdGlvbiAocm93KSB7XG4gICAgcmV0dXJuIHJvdy5maWx0ZXIoZnVuY3Rpb24gKGUpIHtyZXR1cm4gZX0pLm1hcChmdW5jdGlvbiAobm90ZSkge1xuICAgICAgcmV0dXJuIG1pZGlub3RlKG5vdGUpLnJlcGxhY2UoL1xcZCskL2csICcnKVxuICAgIH0pXG4gIH0pXG4gIC8vIGNvbnNvbGUubG9nKCdub3Rlcycsbm90ZXMpXG4gIHZhciBhY2NpZGVudGFscyA9IHVuaXEoZmxhdHRlbihub3RlcykpLm1hcChmdW5jdGlvbiAobm90ZSkge1xuICAgIHJldHVybiBub3RlLnJlcGxhY2UoL15cXHcvLCAnJylcbiAgfSkuZmlsdGVyKGZ1bmN0aW9uIChlKSB7cmV0dXJuIGV9KVxuICAvLyBjb25zb2xlLmxvZyhrZXkoYWNjaWRlbnRhbHMuam9pbignJykpKVxuICByZXR1cm4ga2V5KGFjY2lkZW50YWxzLmpvaW4oJycpKSB8fCBcIkNcIlxufVxuXG5mdW5jdGlvbiBnZXRNaWRkbGUgKHNlY3Rpb24pIHtcbiAgdmFyIGFsbFRoZU5vdGVzQWxsTGluZWRVcCA9IHVuaXEoZmxhdHRlbihzZWN0aW9uKS5maWx0ZXIoZnVuY3Rpb24gKGUpIHtyZXR1cm4gZX0pKS5zb3J0KClcbiAgLy8gY29uc29sZS5sb2coJ2FsbHRoZW0nLCBhbGxUaGVOb3Rlc0FsbExpbmVkVXApXG4gIHJldHVybiBhbGxUaGVOb3Rlc0FsbExpbmVkVXBbfn4oYWxsVGhlTm90ZXNBbGxMaW5lZFVwLmxlbmd0aCAvIDIpXVxufVxuXG5mdW5jdGlvbiBnZXRSb290Tm90ZU51bWJlciAobWlkZGxlLCB0YXJnZXQpIHtcbiAgLy8gY29uc29sZS5sb2coJ2dldFJvb3QnLCBtaWRkbGUsIHRhcmdldClcbiAgLy8gY29uc29sZS5sb2cobWlkaW5vdGUobWlkZGxlKSlcbiAgaWYgKG1pZGlub3RlKG1pZGRsZSkgJiYgbWlkaW5vdGUobWlkZGxlKS5yZXBsYWNlKC9cXGQrLywgJycpID09IHRhcmdldCkge1xuICAgIHJldHVybiBtaWRkbGVcbiAgfSBlbHNlIHtcbiAgICB2YXIgaSA9IDFcbiAgICB2YXIgdGhlUm9vdFxuICAgIHdoaWxlIChpIDw9IDEyKSB7XG4gICAgICAvLyBjb25zb2xlLmxvZyhtaWRpbm90ZShtaWRkbGUgKyBpKSwgbWlkaW5vdGUobWlkZGxlIC0gaSkpXG4gICAgICBpZiAobWlkaW5vdGUobWlkZGxlICsgaSkucmVwbGFjZSgvXFxkKy8sICcnKSA9PSB0YXJnZXQpIHtcbiAgICAgICAgdGhlUm9vdCA9IG1pZGRsZSArIGlcbiAgICAgICAgYnJlYWs7XG4gICAgICB9IGVsc2UgaWYgKG1pZGlub3RlKG1pZGRsZSAtIGkpLnJlcGxhY2UoL1xcZCsvLCAnJykgPT0gdGFyZ2V0KSB7XG4gICAgICAgIHRoZVJvb3QgPSBtaWRkbGUgLSBpXG4gICAgICAgIGJyZWFrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaSsrXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGkpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGVSb290XG4gIH1cbn1cbmZ1bmN0aW9uIGNvbnZlcnROb3Rlc1RvSW5kaWNlcyAobm90ZXMsIGJlYXRzLCByb290Tm90ZSkge1xuICAvLyBjb252ZXJ0cyBndWl0YXIgc3RyaW5ncyB3b3J0aCBvZiBub3RlcyBpbnRvIGluZGV4ZXMgYW5kIHN0dWZmXG4gIHZhciBkaXZpc29yID0gfn4obm90ZXNbMF0ubGVuZ3RoIC8gYmVhdHMpXG4gIHZhciByb290ID0gbWlkaW5vdGUocm9vdE5vdGUpXG4gIC8vIGNvbnNvbGUubG9nKHJvb3QpXG4gIC8vIC4uLiBtYXliZSwgZ2V0IHRoZSBzY2FsZT9cbiAgcmV0dXJuIG5vdGVzLm1hcChmdW5jdGlvbiAocm93KSB7XG4gICAgcmV0dXJuIGNodW5rKHJvdywgZGl2aXNvcikubWFwKGZ1bmN0aW9uIChwYXJ0KSB7XG4gICAgICByZXR1cm4gcGFydC5maWx0ZXIoZnVuY3Rpb24gKG4pIHtyZXR1cm4gbn0pLm1hcChmdW5jdGlvbiAobm90ZSkge1xuXG4gICAgICAgIHZhciBtdWx0aXBsaWVyID0gbm90ZSA+IHJvb3ROb3RlID8gMSA6IC0xXG4gICAgICAgIHZhciBvY3RhdmVkID0gTWF0aC5hYnMobm90ZSAtIHJvb3ROb3RlKSA+PSAxMiA/IDcgOiAxXG4gICAgICAgIHZhciBkaWZmID0gTWF0aC5hYnMobWlkaW5vdGUobm90ZSkuY2hhckNvZGVBdCgwKSAtIHJvb3QuY2hhckNvZGVBdCgwKSlcbiAgICAgICAgLy8gaWYgKHR5cGVvZiAoZGlmZiAqIG11bHRpcGxpZXIgKiBvY3RhdmVkKSAhPT0gJ251bWJlcicpIGNvbnNvbGUubG9nKG11bHRpcGxpZXIsIG9jdGF2ZWQsIGRpZmYsIG5vdGUsIHJvb3QsIG1pZGlub3RlKG5vdGUpKVxuICAgICAgICByZXR1cm4gZGlmZiAqIG11bHRpcGxpZXIgKiBvY3RhdmVkXG4gICAgICB9KVxuICAgIH0pXG4gIH0pLnJlZHVjZShmdW5jdGlvbiAocmVzdWx0LCByb3cpIHtcbiAgICByZXR1cm4gcmVzdWx0Lm1hcChmdW5jdGlvbiAoc2VjdGlvbiwgaSkge1xuICAgICAgcmV0dXJuIHNlY3Rpb24uY29uY2F0KHJvd1tpXSlcbiAgICB9KVxuICB9LCBmaWxsKEFycmF5KGJlYXRzKSwgW10pKVxufVxuXG5mdW5jdGlvbiBwcm9jZXNzVGFiICh0YWIsIGJlYXRzKSB7XG4gIC8vIGNvbnNvbGUubG9nKHRhYilcbiAgLy8gY29uc29sZS5sb2coZ2V0U2VjdGlvbnModGFiKSlcbiAgdmFyIG5vdGVzID0gZ2V0U2VjdGlvbnModGFiKS5tYXAoZnVuY3Rpb24gKHNlY3Rpb24pIHtcbiAgICAvLyBjb25zb2xlLmxvZyhzZWN0aW9uKVxuICAgIHJldHVybiByZXBsYWNlTm90ZXMoc2VjdGlvbilcbiAgfSlcbiAgLy8gc29tZXRoaW5nIGJvcmtlZCBoZXJlXG4gIC8vIGNvbnNvbGUubG9nKG5vdGVzKVxuICB2YXIgYWxsVGhlTm90ZXMgPSBub3Rlcy5yZWR1Y2UoZnVuY3Rpb24gKGEsIGIpIHtyZXR1cm4gYS5jb25jYXQoYil9LCBbXSlcbiAgLy8gY29uc29sZS5sb2cocm9vdClcbiAgLy8gY29uc29sZS5sb2coZ2V0S2V5KGFsbFRoZU5vdGVzKSlcbiAgdmFyIHJvb3QgPSBnZXRSb290Tm90ZU51bWJlcihnZXRNaWRkbGUoYWxsVGhlTm90ZXMpLCBnZXRLZXkoYWxsVGhlTm90ZXMpLnJlcGxhY2UoL1xcc1xcdysvLCAnJykpXG4gIHJldHVybiBub3Rlcy5tYXAoZnVuY3Rpb24gKHNlY3Rpb24pIHtcbiAgICByZXR1cm4gY29udmVydE5vdGVzVG9JbmRpY2VzKHNlY3Rpb24sIGJlYXRzLCByb290KVxuICB9KVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZ2V0U2VjdGlvbnM6IGdldFNlY3Rpb25zLFxuICByZXBsYWNlTm90ZXM6IHJlcGxhY2VOb3RlcyxcbiAgZ2V0S2V5OiBnZXRLZXksXG4gIGdldE1pZGRsZTogZ2V0TWlkZGxlLFxuICBnZXRSb290Tm90ZU51bWJlcjogZ2V0Um9vdE5vdGVOdW1iZXIsXG4gIGNvbnZlcnROb3Rlc1RvSW5kaWNlczogY29udmVydE5vdGVzVG9JbmRpY2VzLFxuICBwcm9jZXNzVGFiOiBwcm9jZXNzVGFiXG4gIC8vIGNvbnZlcnROb3Rlc1RvTWlkaTogY29udmVydE5vdGVzVG9NaWRpXG59XG5cblxuIl19
