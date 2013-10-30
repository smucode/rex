_       = require 'underscore'
vows    = require 'vows'
assert  = require 'assert'

Piece   = require '../src/piece'
Board   = require '../src/board'
King    = require '../src/king'
Pawn    = require '../src/pawn'
Rook    = require '../src/rook'
Queen   = require '../src/queen'

vows
  .describe('Board').addBatch
    'when creating a board with empty ctor':

      topic : new Board()

      'it should not be null': (topic) ->
        assert.notEqual(null, topic)

      'number of white pieces should be 16': (topic) ->
        assert.equal(topic._getPieces(1).length, 16)

      'number of black pieces should be 16': (topic) ->
        assert.equal(topic._getPieces(-1).length, 16)

      'the piece at a2 should have some moves': (topic) ->
        moves = topic.getMoves('a2')
        assert.equal(moves.length, 2)

      'only the active color should have moves': (topic) ->
        moves = topic.getMoves('a2')
        assert.equal(moves.length, 2)

        moves = topic.getMoves('a7')
        assert.equal(moves.length, 0)

      'erroneous move should throw': (topic) ->
        assert.throws () ->
          topic.move('a1', 'b8')

    'creating a board with the initial configuration':
      topic : new Board

      'white should be able to move d2 -> d4': (topic) ->
        topic.move('d2', 'd4')

      'white should not be able to move e2 -> e4': (topic) ->
        assert.throws () ->
          topic.move('e2', 'e4')

      'black should be able to move e7 -> e5': (topic) ->
        topic.move('e7', 'e5')

      'white should be able to capture pawn at e5': (topic) ->
        topic.move('d4', 'e5')

      'black should not able to move pawn at e5': (topic) ->
        assert.throws ->
          topic.move('e5', 'e4')

    'testing scolars mate':
      topic : new Board

      'scholars mate should cause mate': (topic) ->
        topic.move('e2', 'e4')
        topic.move('e7', 'e5')
        topic.move('d1', 'h5')
        topic.move('b8', 'c6')
        topic.move('f1', 'c4')
        topic.move('g8', 'f6')
        move = topic.move('h5', 'f7')

        allMoves = _(topic._getPieces(-1)).chain().map((p) ->
          p.moves
        ).flatten().value().length

        assert.equal(allMoves, 0)
        assert.equal(move.finished, 'checkmate')

    'a board where pawn can promote':
      topic : new Board('6r1/P6P/8/8/8/8/8/8 w KQkq - 0 1')

      'should be promoted to queen': (topic) ->
        move = topic.move('a7', 'a8')
        p = topic._getPiece('a8')

        assert.equal(move.promotion, 'Q')
        assert.equal(p.moves.length, 20)

    'a board where pawn can capture and promote':
      topic : new Board('6r1/P6P/8/8/8/8/8/8 w KQkq - 0 1')

      'should be promoted to queen': (topic) ->
        move = topic.move('h7', 'g8')
        p = topic._getPiece('g8')
        assert.equal(p.moves.length, 21)
        assert.equal(move.promotion, 'Q')

    'a board where no piece can move':
      topic : new Board('k7/2Q5/8/8/8/8/8/8 b KQkq - 0 1')

      'is stalemate': (topic) ->
        p = topic._getPiece('a8')
        assert.equal(p.moves.length, 0)
        assert.equal(topic.getState().finished, 'stalemate')

    'a board where king is attacked':
      topic : new Board('k7/Q7/8/8/8/8/8/8 b KQkq - 0 1')

      'is in check': (topic) ->
        p = topic._getPiece('a8')
        assert.equal(p.moves.length, 1)
        assert.isTrue(topic.getState().check)

    'a board with no real move in 49 moves':
      topic : new Board('k7/8/8/8/8/8/8/P7 b - - 49 1')

      'should be finished due to halfmoves': (topic) ->
        topic.move('a8', 'b8')
        assert.equal(topic.getState().finished, 'halfmoves')

    'creating a board':
      topic : new Board('p6R/p7/p2p5/p7/8/8/8/k6Q w KQkq - 0 1')

      'it should contain 2 white pieces': (topic) ->
        assert.equal(topic._getPieces(1).length, 2)

      'it should contain 6 black pieces': (topic) ->
        assert.equal(topic._getPieces(-1).length, 6)

      'a1 should contain a king': (topic) ->
        assert.instanceOf(topic._getPiece('a1'), King)

      'a8 should contain a pawn': (topic) ->
        assert.instanceOf(topic._getPiece('a8'), Pawn)

      'h1 should contain a queen': (topic) ->
        assert.instanceOf(topic._getPiece('h1'), Queen)

      'h8 should contain a rook': (topic) ->
        assert.instanceOf(topic._getPiece('h8'), Rook)

      'd6 should contain a piece': (topic) ->
        assert.instanceOf(topic._getPiece('d6'), Pawn)

      'a7 should contain a piece': (topic) ->
        assert.instanceOf(topic._getPiece('a7'), Pawn)

      'a6 should contain a piece': (topic) ->
        assert.instanceOf(topic._getPiece('a6'), Pawn)

      'a5 should contain a piece': (topic) ->
        assert.instanceOf(topic._getPiece('a5'), Pawn)

    'when resolving pos to idx':
      topic : new Board

      'a1 should resolve to 0': (topic) ->
        assert.equal(topic._posToIdx('a1'), 0)

      'a2 should resolve to 16': (topic) ->
        assert.equal(topic._posToIdx('a2'), 16)

      'b1 should resolve to 1': (topic) ->
        assert.equal(topic._posToIdx('b1'), 1)

      'b2 should resolve to 17': (topic) ->
        assert.equal(topic._posToIdx('b2'), 17)

      'a9 should throw': (topic) ->
        assert.throws ->
          topic._posToIdx('a9')

      'x6 should throw': (topic) ->
        assert.throws ->
          topic._posToIdx('x6')

    'testing move':
      topic : new Board

      'a3a4 should throw': (topic) ->
        assert.throws ->
          topic.move('a3', 'a4')

      'a2a3 should work': (topic) ->
        move = topic.move('a2', 'a3')
        assert.ok(move)

    'when resolving idx to pos':
      topic : new Board

      '0 should resolve to a1': (topic) ->
        assert.equal(topic._idxToPos(0), 'a1')

      '16 should resolve to a2': (topic) ->
        assert.equal(topic._idxToPos(16), 'a2')

      'b1 should resolve to 1': (topic) ->
        assert.equal(topic._idxToPos(1), 'b1')

      'b2 should resolve to 17': (topic) ->
        assert.equal(topic._idxToPos(17), 'b2')

      '15 should throw': (topic) ->
        assert.throws ->
          topic._idxToPos('15')

    'given a board where white can castle kingside':
      topic: new Board('8/8/8/8/8/8/8/4K2R w K - 0 1')

      'castling should update internal board representation': (topic) ->
        topic.move('e1', 'g1')

        assert.instanceOf(topic._board[topic._posToIdx('g1')], King)
        assert.instanceOf(topic._board[topic._posToIdx('f1')], Rook)

    'given a default board to test events':
      topic:
        new Board

      'registering event should fire immediately': (topic) ->
        state = null
        topic.onMove (s) ->
          state = s

        assert.equal(state.active_color, 'w')
        assert.equal(_.size(state.board), 32)
        assert.equal(_.size(state.valid_moves), 10)

      'moving a piece should fire event': (topic) ->
        state = false
        topic.onMove (s) ->
          state = s

        topic.move 'd2', 'd4'

        assert.equal 'b', state.active_color
        assert.equal 32, _.size(state.board)
        assert.equal 10, _.size(state.valid_moves)
        assert.equal 'd2', state.from
        assert.equal 'd4', state.to

    'given a edgecase board':
      topic: new Board('r6r/1pk2np1/2p2p2/1p2p3/4P3/P1N1P1K1/1PP3P1/3R3R w - - 2 20')

      'assert move is valid': (topic) ->
        topic.move('h1', 'h8')

  .export(module)
