_ = require 'underscore'

Piece = require './piece'

class Bishop extends Piece

  OFFSETS: [16 - 1, 16 + 1, -16 - 1, -16 + 1]

  constructor: (idx, color, board) ->
    @idx = idx
    @color = color
    @board = board
    @moves = []

  calculate: ->
    @addDirectionalMoves @OFFSETS

module.exports = Bishop