_ = require 'underscore'

class History

  constructor: (inital_fen) ->
    @plys = [{
      ply: 0
      move: []
      fen: inital_fen
    }]

  at: (ply) ->
    @plys[ply]

  add: (obj) ->
    next_ply = @plys.length
    @plys.push _.extend {ply: next_ply}, obj

  back: ->
    @plys[@plys.length - 3]

module.exports = History
