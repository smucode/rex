_ = require 'underscore'

Piece = require './piece'

class Pawn extends Piece

  _CAPTURE_DIRECTIONS: [1, -1]

  constructor: (idx, color, board) ->
    @idx = idx
    @color = color
    @board = board
    @moves = []
    @type = 1

  calculate: () ->
    @moves = []
    @checks = []
    @attacks = []
    @pinning = {}
    @behindKing = null
    
    @_addRegularMoves()
    @_addCaptureMoves()
    @_removePinnedMoves()
    @_removeMovesNotHelpingCheckedKing()

  canCaptureEnPassant: (idx) ->
    return @board.isEnPassant(idx)

  _addRegularMoves: () ->
    square = @idx + (@color * 16)
    if @board.isOnBoard(square) && @board.isEmpty(square)
      @moves.push(square)
      if (@color == 1 && @idx >= 16 && @idx < 16 + 8) || (@color == -1 && @idx >= 96 && @idx < 96 + 8)
        square = @idx + (@color * 32)
        if @board.isEmpty(square)
          @moves.push(square)

  _addCaptureMoves: () ->
    _.each @_CAPTURE_DIRECTIONS, (direction) =>
      target = @idx + (@color * 16) + direction
      if @canCapture(target) || @canCaptureEnPassant(target)
        @moves.push(target)

      if @canCapture(target)
        p = @board._getPieceAt(target)
        if p.color != @color && p.type == 3
          @checks = [@idx]

      if @board.isOnBoard(target)
        @attacks.push(target)

module.exports = Pawn