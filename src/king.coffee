_ = require 'underscore'

Piece = require './piece'

class King extends Piece

  CASTLE_SQUARES: { q: [-1, -2, -3], k: [1, 2] }
  DIRECTIONS: [-1, 1, 16 - 1, 16, 16 + 1, -16 - 1, -16, -16 + 1]

  constructor: (idx, color, board) ->
    @idx = idx
    @color = color
    @board = board

    @type = 3
    @moves = []
    @attacks = []
    @behindKing = null

    @_castlingIdx = if @color == 1 then 4 else (4 + (16 * 7))
    @_castling = if @color == 1 then {Q: -1, K: 1} else {q: -1, k: 1}

  calculate: ->
    @moves = []
    @checks = []
    @attacks = []
    @pinning = {}

    @_addRegularMoves()
    @_addCastlingMoves()

  _canCastle: (code, direction) ->
    # @idx is @_castlingIdx and # surplus?
    hasCastlingRights = @idx is @_castlingIdx and @board.canCastle(code)
    return false if not hasCastlingRights or @isAttacked(@idx)
    return !@_pathToRookIsBlocked(code)

  _pathToRookIsBlocked: (code) ->
    return _.find @CASTLE_SQUARES[code.toLowerCase()], (offset) =>
      target = @idx + offset
      return !@canMoveTo(target) || @isAttacked(target)

  isAttacked: (idx) ->
    @board.isAttacked(idx)

  isProtected: (idx) ->
    @board.isProtected(idx)

  _addRegularMoves: ->
    _.each @DIRECTIONS, (direction) =>
      target = @idx + direction
      if !@isSquareBehindCheckedKing(target)
        if (@canMoveTo(target) && !@isAttacked(target)) || (@canCapture(target) && !@isProtected(target))
          @moves.push(target)

      if @board.isOnBoard(target)
        @attacks.push(target)

  isSquareBehindCheckedKing: (square)->
    currentColor = @board._getCurrentColor()
    return _.detect @board._getPieces(currentColor * -1), (p) =>
      return p.behindKing == square

  _addCastlingMoves: ->
    _.each @_castling, (direction, code) =>
      if @_canCastle(code, direction)
        @moves.push @idx + (direction * 2)

module.exports = King
