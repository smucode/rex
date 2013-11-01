_ = require 'underscore'

Board = require './board'

class Rex

  _pieces:
    P: '♙', R: '♖', N: '♘', B: '♗', Q: '♕', K: '♔'
    p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚'

  squares: [7..0].reduce (m, f) ->
    files = 'abcdefgh'.split('')
    for r in [0..7]
      m.push
        pos: files[r] + (f+1)
        col: if (r + f) % 2 is 1 then 'b' else 'w'
    m
  , []

  constructor: (fen) ->
    @state = {}
    @select = @_curry
    @board = new Board fen
    @_updateState()

  _updateState: (opts = {}) ->
    state = @board.getState()

    @state.board = _.reduce @squares, (board, square) =>
      board[square.pos] =
        pos: square.pos
        col: square.col

      if state.board[square.pos]
        board[square.pos].code = state.board[square.pos]
        board[square.pos].piece = @_pieces[state.board[square.pos]]
        board[square.pos].selected = opts.selected is square.pos
        board[square.pos].source = not opts.selected and state.valid_moves[square.pos] and true

      if opts.selected
        board[square.pos].target = _.contains state.valid_moves[opts.selected], square.pos

      board
    , {}

  _move: (src, dst) ->
    if src is dst or _.contains @board.getState().valid_moves[src], dst
      @board.move src, dst unless src is dst
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
  # ok  "selected": t/f                # is the piece currently selected?
  #     "last_source": t/f             # source of last move
  #     "last_target": t/f             # target of last move
  # ok  "target": t/f                  # is this a legal dst move?
  # ok  "source": t/f                  # is this a legar src move?

  #     "mate": t/f
  #     "check": t/f
  #     "stalemate": t/f
  #   }
  # }

module.exports = Rex
