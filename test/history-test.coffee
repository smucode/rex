_       = require 'underscore'
vows    = require 'vows'
assert  = require 'assert'

History = require '../src/history'
Fen     = require '../src/fen'

assert_ply = (a, b) ->
  assert.equal a.ply, b.ply
  assert.equal a.fen, b.fen
  assert.equal a.move[0], b.move[0]
  assert.equal a.move[1], b.move[1]

vows
  .describe('History').addBatch
    'when creating a board with empty ctor':

      topic: new History('initial_fen')

      'first entry should be initial fen': (topic) ->
        assert_ply topic.at(0),
          ply: 0
          move: []
          fen: 'initial_fen'

      'insert new items': (topic) ->
        topic.add({
          'move': ['e2', 'e3'],
          'fen': 'foo'
        })

        assert_ply topic.at(1),
          ply: 1
          move: ['e2', 'e3']
          fen: 'foo'

  .export(module)
