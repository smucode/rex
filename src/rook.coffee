_ = require 'underscore'

Piece = require './piece'

class Rook extends Piece

  DIRECTIONS: [1, -1, 16, -16]
  
  constructor: (idx, color, board) ->
    @idx = idx
    @color = color
    @board = board
    @moves = []

  calculate: ->
    @addDirectionalMoves @DIRECTIONS

module.exports = Rook