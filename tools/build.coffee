fs   = require 'fs'
lazy = require 'lazy'
_    = require 'underscore'

file = fs.readFileSync 'target/rex.js'
arr = file.toString().split '\n'

res = ""

start = """
(function() {
  var _ = this._ || require('underscore');
  var Backbone = this.Backbone || require('backbone');
"""

end = """
  var rex = {
    Fen: Fen,
    Board: Board
  }
  if (typeof module !== 'undefined') {
    module.exports = rex;
  } else {
    this.rex = rex;
  }
}).call(this)
"""

filter = (line) ->
  line = line.toString()
  unless line is '0'
    unless line.indexOf('require') != -1
      unless line.indexOf('module.exports') != -1
        res += ('  ' + line + '\n')

_.each arr, filter

fs.writeFileSync 'rex.js', start + res + end