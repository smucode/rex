_       = require 'underscore'
vows    = require 'vows'
assert  = require 'assert'

King  = require '../src/king'
Board = require '../src/board'

vows
  .describe('King').addBatch
    'when creating a board with two kings':
      topic : new Board('k7/8/8/4k3/8/8/8/8 w KQkq - 0 1')

      'they should be kings': (topic) ->
        king = topic._getPiece('a8')
        assert.instanceOf(king, King)

        king = topic._getPiece('e5')
        assert.instanceOf(king, King)

      'the king in the center should have eight moves': (topic) ->
        king = topic._getPiece('e5')
        assert.equal(king.moves.length, 8)

      'the king in the corner should have three moves': (topic) ->
        king = topic._getPiece('a8')
        assert.equal(king.moves.length, 3)

      'recalculating should give the same answer': (topic) ->
        king = topic._getPiece('a8')
        king.calculate()
        assert.equal(king.moves.length, 3)

    'given a board':
      topic : new Board('kp6/P7/8/8/8/8/8/8 b KQkq - 0 1')

      'the king should have two moves': (topic) ->
        king = topic._getPiece('a8')
        assert.equal(king.moves.length, 2)

    'white king with free path to rooks and full castling rights':
      topic : new Board('r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1')

      'should have 4 moves': (topic) ->
        piece = topic._getPiece('e1')
        assert.equal(piece.moves.length, 4)

    'black king with free path to rooks and full castling rights':
      topic : new Board('r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R b KQkq - 0 1')

      'should have 4 moves': (topic) ->
        piece = topic._getPiece('e8')
        assert.equal(piece.moves.length, 4)

    'white king with free path to the rooks and no castling rights':
      topic : new Board('r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w - - 0 1')

      'white king should have 2 moves': (topic) ->
        piece = topic._getPiece('e1')
        assert.equal(piece.moves.length, 2)

    'black king with free path to the rooks and no castling rights':
      topic : new Board('r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R b - - 0 1')

      'black king should have 2 moves': (topic) ->
        piece = topic._getPiece('e8')
        assert.equal(piece.moves.length, 2)

    'two of three moves are threathened by opponent':
      topic : new Board('k7/8/8/8/8/8/8/1R2K2R b - - 0 1')

      'king should have one move': (topic) ->
        piece = topic._getPiece('a8')
        assert.equal(piece.moves.length, 1)

    'king can not capture piece that is protected by queen':
      topic : new Board('kB6/p7/8/8/8/8/8/1Q6 b - - 0 1')

      'so it should have no moves': (topic) ->
        piece = topic._getPiece('a8')
        assert.equal(piece.moves.length, 0)

    'king can not capture piece that is protected by pawn':
      topic : new Board('kB6/p1P5/8/8/8/8/8/8 b - - 0 1')

      'so it should have one move': (topic) ->
        piece = topic._getPiece('a8')
        assert.equal(piece.moves.length, 1)

    'king can not capture piece that is protected by knight':
      topic : new Board('kB6/p7/N7/8/8/8/8/8 b - - 0 1')

      'so it should have one move': (topic) ->
        piece = topic._getPiece('a8')
        assert.equal(piece.moves.length, 1)

    'king can not capture piece that is protected by opponent king':
      topic : new Board('kBK5/p7/8/8/8/8/8/8 b - - 0 1')

      'so it should have no moves': (topic) ->
        piece = topic._getPiece('a8')
        assert.equal(piece.moves.length, 0)

    'king can not capture piece that is protected by rook':
      topic : new Board('kB6/p7/8/8/8/8/8/1R6 b - - 0 1')

      'so it should have no moves': (topic) ->
        piece = topic._getPiece('a8')
        assert.equal(piece.moves.length, 0)

    'king with blocked path and full castling':
      topic : new Board()

      'should have no moves': (topic) ->
        piece = topic._getPiece('e1')
        assert.equal(piece.moves.length, 0)

    'king on the first line with no pawns in front':
      topic : new Board('rnbqkbnr/pppppppp/8/8/8/8/8/RNBQKBNR w KQkq - 0 1')

      'should have three moves': (topic) ->
        piece = topic._getPiece('e1')
        assert.equal(piece.moves.length, 3)

    'king with path to rook attacked':
      topic : new Board('1r4r1/8/8/8/8/8/2PPPP2/R3K2R w KQkq - 0 1')

      'should have two moves': (topic) ->
        piece = topic._getPiece('e1')
        assert.equal(piece.moves.length, 2)

    'king should not be able to put himself in check':
      topic : new Board('8/8/8/8/8/8/p7/K7 w KQkq - 0 1')

      'king should have two moves': (topic) ->
        piece = topic._getPiece('a1')
        assert.equal(piece.moves.length, 2)

    'checked king must get out of check':
      topic : new Board('r7/8/8/8/8/8/K7/8 w KQkq - 0 1')

      'king should have 1 move': (topic) ->
        piece = topic._getPiece('a2')
        assert.equal(piece.moves.length, 3)

    'checked king can go to square pawn can move to but not capture':
      topic : new Board('8/8/8/8/8/8/q2p4/2K5 w KQkq - 0 1')

      'king should have 1 move': (topic) ->
        piece = topic._getPiece('c1')
        assert.equal(piece.moves.length, 1)

    'king cannot castle when he is in check': ->
      board = new Board('r4rk1/p1p2ppp/bpn1p3/3BP3/1b1P1B1P/2N5/PPPQ1P1P/R3K1q1 w Q - 0 15')
      assert.equal board._getPiece('e1').moves.length, 0
      assert.equal board._state.finished, 'checkmate'

  .export(module)
