_       = require 'underscore'
vows    = require 'vows'
assert  = require 'assert'

Queen = require '../src/queen'
Board = require '../src/board'

vows
  .describe('Queen').addBatch
    'when creating a board with two queens':
      topic : new Board('q7/8/8/4q3/8/8/8/8 w KQkq - 0 1')

      'they should be queens': (topic) ->
        piece = topic._getPiece('a8')
        assert.instanceOf(piece, Queen)
        piece = topic._getPiece('e5')
        assert.instanceOf(piece, Queen)

      'the queen in the center should have 27 moves': (topic) ->
        piece = topic._getPiece('e5')
        assert.equal(piece.moves.length, 27)

      'the queen in the corner should have 21 moves': (topic) ->
        piece = topic._getPiece('a8')
        assert.equal(piece.moves.length, 21)

    'given a board':
      topic : new Board('qp6/1P6/P7/8/8/8/8/8 w KQkq - 0 1')

      'the queen should have three moves': (topic) ->
        piece = topic._getPiece('a8')
        assert.equal(piece.moves.length, 3)
  
  .export(module)