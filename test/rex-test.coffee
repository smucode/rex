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

      'should expose checkmate': ->
        rex = new Rex 'rnbqkbnr/ppp2ppp/8/3pp3/6P1/5P2/PPPPP2P/RNBQKBNR w KQkq e6 0 3'

        rex.select 'a2'
        rex.select 'a3'
        rex.select 'd8'
        rex.select 'h4'

        assert rex.state.board['e1'].checkmate
        assert.equal rex.state.finished, 'checkmate'

      'should expose check': ->
        rex = new Rex 'rnb1kbnr/pppp1ppp/5q2/8/4Pp2/8/PPPPK1PP/RNBQ1BNR w kq - 0 4'

        rex.select 'e2'
        rex.select 'd3'
        rex.select 'f6'
        rex.select 'd6'

        assert rex.state.board['d3'].check
        assert rex.state.check


      # 'expose move event and verify state'

  .export(module)
