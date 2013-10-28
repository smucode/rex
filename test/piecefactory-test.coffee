_       = require 'underscore'
vows    = require 'vows'
assert  = require 'assert'

Pawn         = require '../src/pawn'
PieceFactory = require '../src/piece_factory'

Factory = new PieceFactory

vows
  .describe('PieceFactory').addBatch
    'given a factory':
      topic : Factory

      'it should be able to create white pawns': (topic) ->
        pawn = topic.create('p')
        assert.instanceOf(pawn, Pawn)

      'it should be able to create black pawns': (topic) ->
        pawn = topic.create('P')
        assert.instanceOf(pawn, Pawn)
  
  .export(module)