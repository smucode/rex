_ = require('underscore')

class Piece

  types:
    PAWN: 1
    KNIGHT: 2
    KING: 3
    BISHOP: 5
    ROOK: 6
    QUEEN: 7

  constructor: ->
    @attacks = []

  canCapture: (idx) ->
    piece = @board._getPieceAt(idx)
    return piece && piece.color != @color

  canMoveTo: (idx) ->
    piece = @board._getPieceAt(idx)
    return !piece && @board.isOnBoard(idx)

  addDirectionalMoves: (directions) ->
    @moves = []
    @checks = []
    @attacks = []
    @pinning = {}
    @behindKing = null

    _.each directions, (direction) =>
      @_addNextDirectionalMove(direction)

    @_removePinnedMoves()
    @_removeMovesNotHelpingCheckedKing()

  _removePinnedMoves: () ->
    if (@color == @board._getCurrentColor())
      pinned = @board.isPinned(@idx)
      if (pinned)
        @moves = _.intersection(@moves, pinned)

  _addNextDirectionalMove: (direction, offset) ->
    offset = offset || 1
    target = @idx + (offset * direction)

    if @canMoveTo(target)
      @moves.push(target)
      @attacks.push(target)
      @_addNextDirectionalMove(direction, ++offset)
    else
      if @canCapture(target)
        @moves.push(target)
        @_checkPinning(target, direction, offset)
        @_checkKingAttacks(target, direction, offset)

      if @board.isOnBoard(target)
        @attacks.push(target)

  _removeMovesNotHelpingCheckedKing: () ->
    if @color == @board._getCurrentColor()
      checkingPieces = @board.getCheckingPieces()
      if checkingPieces.length == 1
        @moves = _.intersection(@moves, checkingPieces[0].checks)
      else if checkingPieces.length > 1
        @moves = []

  _checkKingAttacks: (square, direction, offset) ->
    piece = @board._getPieceAt(square)
    if piece.type == 3
      @checks = []

      @_setMoveBehindKing(direction, offset)
      @_backtrackPinnedMoves(direction, --offset, @checks)

  _checkPinning: (pinned, direction, offset) ->
    target = @idx + ((offset + 1) * direction)
    if @canMoveTo(target)
      @_checkPinning(pinned, direction, ++offset)
    else if @canCapture(target)
      piece = @board._getPieceAt(target)
      if piece.type == 3 && piece.color != @color
        @pinning[pinned] = []
        @_backtrackPinnedMoves(direction, offset, @pinning[pinned])

  _setMoveBehindKing: (direction, offset) ->
    @behindKing = @idx + ((offset + 1) * direction)

  _backtrackPinnedMoves: (direction, offset, arr) ->
    target = @idx + (offset * direction)
    arr.push(target)
    if target != @idx
      @_backtrackPinnedMoves(direction, --offset, arr)

  is: (type) ->
    return @types[type] == @type

module.exports = Piece
