_       = require 'underscore'
vows    = require 'vows'
assert  = require 'assert'

Piece = require '../src/piece'
Board = require '../src/board'

vows
  .describe('Piece').addBatch
    'given a crazy board setup':

      topic: new Board('rnbqkbnr/pppppppp/8/8/8/8/PPPqPPPP/RNBQKBNR w KQkq - 0 1')
    
      'pawns should not be able to move': (topic) ->
        p = topic._getPiece('a2')
        assert.equal(p.moves.length, 0)

      'king should be able to capture': (topic) ->
        p = topic._getPiece('e1')
        assert.equal(p.moves.length, 1)

  .export(module)