_ = require 'underscore'

Piece = require './piece'

class Knight extends Piece

  DIRECTIONS: [16 - 2, 16 + 2, 32 - 1, 32 + 1, -16 - 2, -16 + 2, -32 - 1, -32 + 1]

  constructor: (idx, color, board) ->
    @idx = idx
    @color = color
    @board = board
    @moves = []

  calculate: ->
    @moves = []
    @checks = []
    @attacks = []
    @pinning = {}
    @behindKing = null

    @_addRegularMoves()
    @_removePinnedMoves()
    @_removeMovesNotHelpingCheckedKing()

  _addRegularMoves: ->
    _.each @DIRECTIONS, (direction) =>
      target = @idx + direction

      if @canMoveTo(target) || @canCapture(target)
        @moves.push(target)

      if @canCapture(target)
        p = @board._getPieceAt(target)
        if p.color != @color && p.type == 3
          @checks = [@idx]

      if @board.isOnBoard(target)
        @attacks.push(target)

module.exports = Knight