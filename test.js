var tap = require('tap')
var processor = require('./processTab')
var fs =  require ('fs')
var tab = fs.readFileSync('./sampleTab.txt').toString()

tap.equal(24, processor.getSections(tab).length)
var sectionTab = [
  'e|---------------0---------|',
  'B|-----3------3--0---------|',
  'G|-----3------3--0----6--6-|',
  'D|--3--3------3--0----6--6-|',
  'A|--3--1------1--0----4--4-|',
  'E|--1------------0---------|']

var sectionNotes = [
  [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 64, '', '', '', '', '', '', '', '', '' ],
  [ '', '', '', '', '', 62, '', '', '', '', '', '', 62, '', '', 59, '', '', '', '', '', '', '', '', '' ],
  [ '', '', '', '', '', 58, '', '', '', '', '', '', 58, '', '', 55, '', '', '', '', 61, '', '', 61, '' ],
  [ '', '', 53, '', '', 53, '', '', '', '', '', '', 53, '', '', 50, '', '', '', '', 56, '', '', 56, '' ],
  [ '', '', 48, '', '', 46, '', '', '', '', '', '', 46, '', '', 45, '', '', '', '', 49, '', '', 49, '' ],
  [ '', '', 41, '', '', '', '', '', '', '', '', '', '', '', '', 40, '', '', '', '', '', '', '', '', '' ] ]
tap.deepEqual(sectionNotes, processor.replaceNotes(sectionTab))
tap.equal('Eb major', processor.getKey(sectionNotes))
tap.equal(53, processor.getMiddle(sectionNotes))
tap.equal(processor.getRootNoteNumber(40, 'F'), 41)
tap.equal(processor.getRootNoteNumber(40, 'Db'), 37)