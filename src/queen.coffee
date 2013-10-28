_ = require 'underscore'

Piece = require './piece'

class Queen extends Piece

  OFFSETS: [-1, 1, 16 - 1, 16, 16 + 1, -16 - 1, -16, -16 + 1]

  constructor: (idx, color, board) ->
    @idx = idx
    @color = color
    @board = board
    @moves = []

  calculate: ->
    @addDirectionalMoves @OFFSETS

module.exports = Queen