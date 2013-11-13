_ = require 'underscore'

class History

  counter: 0

  constructor: (inital_fen) ->
    @plys = [{
      move: []
      ply: @counter++
      fen: inital_fen
    }]

  current: ->
    @plys[@counter - 1]

  add: (obj) ->
    next_ply = @counter++
    @plys.push _.extend {ply: next_ply}, obj

  back: ->
    @counter -= 2
    @current()

module.exports = History
