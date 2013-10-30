vows    = require 'vows'
assert  = require 'assert'
_       = require 'underscore'

Rex = require '../src/rex'

vows
  .describe('Rex').addBatch
    'after selecting twice':

      topic: -> new Rex

      'it should call board.move': (topic) ->
        args = null
        topic.board.move = -> args = arguments

        topic.select 'a1'
        topic.select 'c1'

        assert.equal args[0], 'a1'
        assert.equal args[1], 'c1'

        topic.select 'b1'
        topic.select 'd1'

        assert.equal args[0], 'b1'
        assert.equal args[1], 'd1'

    'creating a new Rex':

      topic: -> new Rex

      'state is updated on move': (topic) ->
        state = topic.state

        assert !state.board.e4, 'state.e4 should be undefined'

        topic.select 'e2'
        topic.select 'e4'

        assert state.board.e4, 'state.e4 should be defined'

      'state should contains pieces': (topic) ->
        assert.equal '♙', topic.state.board['c2'].piece

      'state should contain the selected piece if it is valid': (topic) ->
        topic.select 'c2'
        assert topic.state.board['c2'].selected

  .export(module)
