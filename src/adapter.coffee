module = exports: {}

require = (name) ->
  switch name
    when 'underscore' then @_
    when './fen' then Fen
    when './pawn' then Pawn
    when './king' then King
    when './rook' then Rook
    when './piece' then Piece
    when './queen' then Queen
    when './knight' then Knight
    when './bishop' then Bishop
    when './piece_factory' then Factory
