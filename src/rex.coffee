_ = require 'underscore'

Board = require './board'

module.exports = class Rex

  _pieces:
    P: '♙', R: '♖', N: '♘', B: '♗', Q: '♕', K: '♔'
    p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚'

  constructor: (fen) ->
    @state = {}
    @select = @_curry
    @board = new Board fen
    @_updateState()

  _updateState: (opts = {}) ->
    @state.board = _.reduce @board.getState().board, (board, piece, pos) =>
      board[pos] =
        code: piece
        piece: @_pieces[piece]
        selected: pos is opts.selected
      board
    , {}

  _move: (src, dst) ->
    @board.move src, dst
    @_updateState()
    @select = @_curry

  _curry: (src) ->
    if @board.getState().valid_moves[src]
      @_updateState(selected: src)
      @select = _.bind @_move, @, src

  # to: <pos>
  # from: <pos>
  # check: t/f
  # valid_moves: {}
  # active_color: w/b
  # finished: 'checkmate', 'stalemate', 'halfmoves'

  # board: {
  #   "a1": {
  # ok  "code":                        # the piece code
  # ok  "piece": '♖'                   # the ascii piece
  # x   "selected": t/f                # is the piece currently selected?
  #     "last_source": t/f             # source of last move
  #     "last_target": t/f             # target of last move
  # x   "legal_target": t/f            # is this a legal dst move?
  # x   "legal_source": t/f            # is this a legar src move?

  #     "mate": t/f
  #     "check": t/f
  #     "stalemate": t/f
  #   }
  # }
