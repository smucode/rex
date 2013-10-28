_        = require 'underscore'

Fen     = require './fen'
Factory = require './piece_factory'

class Board

  WHITE: 1
  BLACK: -1

  _state: 'move'
  _files: 'abcdefgh'

  eventHandlers: []

  constructor: (fen) ->
    @_state = {}
    @_fen = new Fen(fen)
    @_board = new Array(128)
    @factory = new Factory

    _.each @_fen.pieces, (piece, pos) =>
      idx = @_posToIdx(pos)
      @_board[idx] = @factory.create(piece, idx, this)

    @_calculate()

  move: (from, to) ->
    source = @_getPiece(from)
    @_verifyMove(source)

    toIdx = @_posToIdx(to)
    @_verifyIndex(source, toIdx)

    @_state = {}

    if (source.canCapture(toIdx) || source.canMoveTo(toIdx))
      if (source.is('PAWN') && (toIdx < 9 || toIdx > 111))
        @_promotePawn(from, to, source, toIdx)
      else
        if @_fen.enPassant == to
          @_moveEnPassant(to, from)
        @_updateArray(from, to)
        @_fen.move(from, to)
    else
      throw new Error('unable to move from ' + from + ' to ' + to)

    if @_fen.halfmove >= 50
      @_state.finished = 'halfmoves'
    else
      @_calculate()

    @_state.to = to
    @_state.from = from

    @_fireEvent()

    return @_state

  _verifyMove: (source) ->
    if !source
      throw new Error('there is no piece to move')

    if @_getCurrentColor() != source.color
      throw new Error('cannot move out of order')

  _verifyIndex: (source, toIdx) ->
    if source.moves.indexOf(toIdx) == -1
      throw new Error('there is no piece at ' + @_idxToPos(toIdx) + ': ' + @_fen.toString())

  _promotePawn: (from, to, source, toIdx) ->
    @_fen.move(from, to)

    fidx = @_posToIdx(from)
    @_board[fidx] = null

    pieceType = if source.color == 1 then 'Q' else 'q'

    @_board[toIdx] = @factory.create(pieceType, toIdx, this)
    @_state.promotion = pieceType

  _moveEnPassant: (to, from) ->
    @_state.enPassantCapture = to[0] + from[1]

  _fireEvent: ->
    for fn in @eventHandlers
      fn @_state

  onMove: (f) ->
    @eventHandlers.push f
    f @getState()

  getState: ->
    @_state

  _calculateValidMoves: ->
    m = {}
    _.each @_getPieces(@_getCurrentColor()), (p) =>
      if (p.moves.length > 0)
        moves = _.map p.moves, (move) =>
          @_idxToPos(move)
        m[@_idxToPos(p.idx)] = moves
    return m

  _posToIdx: (pos) ->
    if (!pos || typeof pos != 'string' || !pos.match(/[a-h]{1}[0-8]{1}/))
      throw new Error('illegal pos ' + pos)
    c = @_files.indexOf(pos[0])
    return c + ((pos[1] - 1) * 16)

  _idxToPos: (idx) ->
    file = idx % 16
    rank = Math.floor(idx / 16)
    pos = @_files[file] + (rank + 1)
    if (typeof pos != 'string')
      throw new Error('illegal idx ' + idx)
    pos

  _getPieceAt: (idx) ->
    @_board[idx]

  _getPieces: (color) ->
    return _.filter @_board, (p) ->
      if (!color)
        return p
      else
        return p && p.color == color

  _getPiece: (pos) ->
    idx = @_posToIdx(pos)
    @_getPieceAt(idx)

  _getCurrentColor: ->
    if @_fen.activeColor == 'w' then @WHITE else @BLACK

  _calculate: ->
    currentColor = @_getCurrentColor()

    moves = []
    attacked = []

    _.each @_getPieces(currentColor * -1), (p) ->
      p.calculate()
      attacked = _.union(attacked, p.attacks)

    _.each @_getPieces(currentColor), (p) =>
      p.calculate()
      moves = moves.concat(p.moves)
      if (p.type == 3 && attacked.indexOf(p.idx) != -1)
        @_state.check = true

    if (moves.length == 0)
      if (@_state.check)
        @_state.finished = 'checkmate'
      else
        @_state.finished = 'stalemate'

    @_state.board = @_fen.pieces
    @_state.active_color = @_fen.activeColor
    @_state.valid_moves = @_calculateValidMoves()

    @_state

  _updateArray: (from, to) ->
    fidx = @_posToIdx(from)
    fromPiece = @_board[fidx]
    @_board[fidx] = null

    tidx = @_posToIdx(to)
    fromPiece.idx = tidx
    @_board[tidx] = fromPiece

    @_updateCastling(from, to)

  _updateCastling: (from, to) ->
    switch (from)
      when 'e1'
        if (to == 'g1' && _.contains(@_fen.castling, 'K'))
          @_board[@_posToIdx('f1')] = @_board[@_posToIdx('h1')]
          @_board[@_posToIdx('f1')].idx = @_posToIdx('f1')
          @_board[@_posToIdx('h1')] = null
        else if (to == 'c1' && _.contains(@_fen.castling, 'Q'))
          @_board[@_posToIdx('d1')] = @_board[@_posToIdx('a1')]
          @_board[@_posToIdx('d1')].idx = @_posToIdx('d1')
          @_board[@_posToIdx('a1')] = null
      when 'e8'
        if (to == 'g8' && _.contains(@_fen.castling, 'k'))
          @_board[@_posToIdx('f8')] = @_board[@_posToIdx('h8')]
          @_board[@_posToIdx('f8')].idx = @_posToIdx('f8')
          @_board[@_posToIdx('h8')] = null
        else if (to == 'c8' && _.contains(@_fen.castling, 'q'))
          @_board[@_posToIdx('d8')] = @_board[@_posToIdx('a8')]
          @_board[@_posToIdx('d8')].idx = @_posToIdx('d8')
          @_board[@_posToIdx('a8')] = null

  getCheckingPieces: ->
    currentColor = @_getCurrentColor()
    pieces = @_getPieces(currentColor * -1)
    return _.filter pieces, (piece) ->
      return piece.checks && piece.checks.length > 0

  isPinned: (idx) ->
    currentColor = @_getCurrentColor()
    pieces = @_getPieces(currentColor * -1)

    pinningPiece = _.detect pieces, (p) ->
      return p.pinning && p.pinning[idx]

    if (pinningPiece)
      return _(pinningPiece.pinning[idx]).chain().clone().without(idx).union(pinningPiece.idx).value()

  isAttacked: (idx) ->
    currentColor = @_getCurrentColor()
    return _.detect @_getPieces(currentColor * -1), (p) ->
      return p.attacks?.indexOf(idx) != -1 # TODO: port -> added ?

  isProtected: (idx) ->
    currentColor = @_getCurrentColor()
    return _.detect @_getPieces(currentColor * -1), (p) ->
      return p.moves.indexOf(idx) != -1 || p.attacks.indexOf(idx) != -1

  isEmpty: (idx) ->
    return !@_getPieceAt(idx)

  isOnBoard: (idx) ->
    return idx >= 0 && idx < 127 && (idx & 0x88) == 0

  canCastle: (code) ->
    return @_fen.canCastle(code)

  isEnPassant: (idx) ->
    ep = @_fen.enPassant
    if (ep && ep != '-')
      epIdx = @_posToIdx(ep)
      return idx == epIdx
    return false

  getMoves: (pos) ->
    idx = @_posToIdx(pos)
    piece = @_getPieceAt(idx)
    if (piece && piece.color == @_getCurrentColor())
      return _.map piece.moves, (idx) =>
        return @_idxToPos(idx)
    return []

  toString: () ->
    return @_fen.toString()

module.exports = Board
