_       = require 'underscore'
vows    = require 'vows'
assert  = require 'assert'

Board = require '../src/board'

vows
  .describe('Pawn').addBatch
    'given a board with a pawn':
      topic : new Board('8/p7/8/8/8/8/p1p5/1P6 w KQkq - 0 1')

      'it should have two valid moves': (topic) ->
        pawn = topic._getPiece('a7')
        assert.equal(pawn.moves.length, 2)

      'recalculating should provide the same answer': (topic) ->
        pawn = topic._getPiece('a7')
        pawn.calculate()
        assert.equal(pawn.moves.length, 2)

    'given a board with a pawn who can capture':
      topic : new Board('8/1p6/P1P5/8/8/8/8/8 w KQkq - 0 1')

      'it should have four valid moves': (topic) ->
        pawn = topic._getPiece('b7')
        assert.equal(pawn.moves.length, 4)

    'given a board with a pawn who can capture en passant':
      topic : new Board('8/8/8/Pp6/8/8/8/8 w KQkq b6 0 1')

      'it should have two valid moves': (topic) ->
        pawn = topic._getPiece('a5')
        assert.equal(pawn.moves.length, 2)

      'capturing enpassant should give correct status': (topic) ->
        status = topic.move('a5', 'b6')
        assert.equal(status.enPassantCapture, 'b5')

    'given a board with a pinned pawn':
      topic : new Board('r7/8/8/8/8/1p6/P7/K7 w KQkq - 0 1')

      'it should have two moves': (topic) ->
        piece = topic._getPiece('a2')
        assert.equal(piece.moves.length, 2)

    'given a board with a attacked king':
      topic : new Board('r7/1PP5/8/8/8/8/8/K7 w KQkq - 0 1')

      'pawn at b7 to the rescue': (topic) ->
        piece = topic._getPiece('b7')
        assert.equal(piece.moves.length, 1)

      'pawn at c7 cannot move': (topic) ->
        piece = topic._getPiece('c7')
        assert.equal(piece.moves.length, 0)

    'given a board with a king attacked by queen':
      topic : new Board('8/8/8/8/8/8/q1P5/KP6 w KQkq - 0 1')

      'pawn at b1 to the rescue': (topic) ->
        piece = topic._getPiece('b1')
        assert.equal(piece.moves.length, 1)

      'pawn at c2 cannot move': (topic) ->
        piece = topic._getPiece('c2')
        assert.equal(piece.moves.length, 0)

    'given a board where king is in checked by pawn':
      topic : new Board('kb6/1P6/8/8/8/8/8/8 b KQkq - 0 1')

      'only king should be able to move': (topic) ->
        bishop = topic._getPiece('b8')
        assert.equal(bishop.moves.length, 0)

  .export(module)