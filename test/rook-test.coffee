_       = require 'underscore'
vows    = require 'vows'
assert  = require 'assert'

Rook  = require '../src/rook'
Board = require '../src/board'

vows
  .describe('Rook').addBatch
    'when creating a board with two rooks':
      topic : new Board('r7/8/8/4r3/8/8/8/8 w KQkq - 0 1')

      'they should be rooks': (topic) ->
        rook = topic._getPiece('a8')
        assert.instanceOf(rook, Rook)
        
        rook = topic._getPiece('e5')
        assert.instanceOf(rook, Rook)
      
      'the rook in the center should have 14 moves': (topic) ->
        rook = topic._getPiece('e5')
        assert.equal(rook.moves.length, 14)
      
      'the rook in the corner should have 14 moves': (topic) ->
        rook = topic._getPiece('a8')
        assert.equal(rook.moves.length, 14)

      'recalculating should give the same answer': (topic) ->
        rook = topic._getPiece('a8')
        rook.calculate()
        assert.equal(rook.moves.length, 14)

    'given a board where rook can only capture':
      topic : new Board('rp6/P7/8/8/8/8/8/8 b KQkq - 0 1')

      'it should have one move': (topic) ->
        rook = topic._getPiece('a8')
        assert.equal(rook.moves.length, 1)

    'given a board with a pinned rook next to the king':
      topic : new Board('r7/8/8/8/8/8/R7/K7 w KQkq - 0 1')

      'it must protect king': (topic) ->
        piece = topic._getPiece('a2')
        assert.equal(piece.moves.length, 6)

    'given a board with a pinned rook':
      topic : new Board('r7/8/8/8/8/R7/8/K7 w KQkq - 0 1')

      'it must protect king': (topic) ->
        piece = topic._getPiece('a3')
        assert.equal(piece.moves.length, 6)

    'given a board with a threathened king':
      topic : new Board('r7/8/8/8/8/8/7R/K7 w KQkq - 0 1')

      'rook to the rescue': (topic) ->
        piece = topic._getPiece('h2')
        assert.equal(piece.moves.length, 1)

  .export(module)