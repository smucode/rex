vows    = require 'vows'
assert  = require 'assert'
_       = require 'underscore'

Rex = require '../src/rex'

vows
  .describe('Rex').addBatch
    'after selecting twice':

      'it should call board.move': ->
        rex = new Rex
        args = null
        rex.board.move = -> args = arguments

        rex.select 'e2'
        rex.select 'e4'

        assert.equal 'e2', args[0]
        assert.equal 'e4', args[1]

    'creating a new Rex':

      'state is updated on move': ->
        rex = new Rex

        state = rex.state

        assert not state.board.e4.piece, 'e4 should be empty'

        rex.select 'e2'
        rex.select 'e4'

        assert state.board.e4.piece, 'e4 should not be empty'

      'state should contains pieces': ->
        rex = new Rex
        assert.equal '♙', rex.state.board['c2'].piece

      'state should contain the selected piece if it is valid': ->
        rex = new Rex
        rex.select 'c2'
        assert rex.state.board['c2'].selected

      'state should only select the selected piece': ->
        rex = new Rex
        rex.select 'c2'
        assert not rex.state.board['e2'].selected

      'state should not contain the selected piece if it is invalid': ->
        rex = new Rex
        rex.select 'a8'
        assert !rex.state.board['a8'].selected

      'state should contain legal source moves': ->
        rex = new Rex
        assert rex.state.board['c2'].source
        assert not rex.state.board['a8'].source

      'state should contain legal target moves': ->
        rex = new Rex
        rex.select 'c2'
        assert rex.state.board['c3']?.target
        assert not rex.state.board['c3'].source

      'selecting the same piece twice should deselect it': ->
        rex = new Rex
        rex.select 'c2'
        rex.select 'c2'
        assert not rex.state.board['c2'].selected

      'selecting a invalid target should not change state': ->
        rex = new Rex
        rex.select 'c2'
        rex.select 'h7'
        assert rex.state.board['c2'].selected

      'should expose active color': ->
        rex = new Rex

        assert.equal rex.state.active_color, 'w'

        rex.select 'e2'
        rex.select 'e4'

        assert.equal rex.state.active_color, 'b'

      'should expose last move': ->
        rex = new Rex

        rex.select 'e2'
        rex.select 'e4'

        assert rex.state.board['e2'].last_source
        assert rex.state.board['e4'].last_target

      # 'expose move event and verify state'

  .export(module)
