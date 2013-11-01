_ = require 'underscore'

class Fen

  DEFAULT_BOARD: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

  constructor: (fen) ->
    @pieces = {}
    @activeColor = null
    @_parse(fen || @DEFAULT_BOARD)

  # public

  move: (from, to) ->
    @_validateMove from, to
    @_updateActiveColor()
    @_updateCastling from, to
    @_updateEnPassant from, to
    @_updateHalfmoveClock from, to
    @_updateFullmoveNumber()
    @_updatePiecePlacement from, to

  canCastle: (letter) ->
    _.include(@castling, letter)

  # private

  _validateMove: (from, to) ->
    piece = @pieces[from]
    if (!piece)
      throw new Error('You must select a valid piece to move: ' + from)

  _updateFullmoveNumber: ->
    if (@activeColor == 'w')
      @fullmove++

  _updateHalfmoveClock: (from, to) ->
    piece = @pieces[from]
    if @_isPawn(piece) || @pieces[to]
      @halfmove = 0
    else
      @halfmove++

  _updateEnPassant: (from, to) ->
    piece = @pieces[from]
    if (@_isPawn(piece))
      if (@enPassant == to)
        dir = to.charAt(1) - from.charAt(1)
        delete @pieces[to.charAt(0) + (to.charAt(1) - dir)]
      else
        len = to.charAt(1) - from.charAt(1)
        if (Math.abs(len) == 2)
          @enPassant = to.charAt(0) + (parseInt(from.charAt(1), 10) + (len / 2))
          return
    @enPassant = '-'

  _updateCastling: (from, to) ->
    if (!@castling.length)
      return false

    switch (from)
      when 'a1'
        @castling = _.without(@castling, 'Q')
      when 'a8'
        @castling = _.without(@castling, 'q')
      when 'h1'
        @castling = _.without(@castling, 'K')
      when 'h8'
        @castling = _.without(@castling, 'k')
      when 'e1'
        if (to == 'g1' && _.contains(@castling, 'K'))
          @pieces.f1 = @pieces.h1
          delete @pieces.h1
        else if (to == 'c1' && _.contains(@castling, 'Q'))
          @pieces.d1 = @pieces.a1
          delete @pieces.a1
        @castling = _.without(@castling, 'Q', 'K')
      when 'e8'
        if (to == 'g8' && _.contains(@castling, 'k'))
          @pieces.f8 = @pieces.h8
          delete @pieces.h8
        else if (to == 'c8' && _.contains(@castling, 'q'))
          @pieces.d8 = @pieces.a8
          delete @pieces.a8
        @castling = _.without(@castling, 'q', 'k')

  _updatePiecePlacement: (from, to) ->
    piece = @pieces[from]
    delete(@pieces[from]) # dafuq

    if (@_isPawn(piece) && (to.charAt(1) ==  '1' || to.charAt(1) == '8'))
      @pieces[to] = (if piece == 'P' then 'Q' else 'q')
    else
      @pieces[to] = piece

  _isPawn: (piece) ->
    piece == 'p' || piece == 'P'

  _updateActiveColor: ->
    @activeColor = if @activeColor == 'w' then 'b' else 'w'

  _parse: (fen) ->
    arr = if fen.split then fen.split(' ') else []
    if (!arr || arr.length != 6)
      throw new Error('A FEN must contain 6 space separated fields: ' + fen)

    @_parsePiecePlacement(arr[0])
    @_parseActiveColor(arr[1])
    @_parseCastling(arr[2])
    @_parseEnPassant(arr[3])
    @_parseHalfmoveClock(arr[4])
    @_parseFullmoveNumber(arr[5])

  _parsePiecePlacement: (str) ->
    arr = str.split('/')
    if (arr.length != 8)
      throw new Error('A FEN must contain 8 ranks separated by /: ' + str)

    files = 'abcdefgh'
    ranks = '87654321'
    _.each arr, (rank, rankIdx) =>
      fileIdx = 0
      _.each rank.split(''), (p, i) =>
        if (!p.match(/[0-8]/))
          an = files.charAt(fileIdx) + ranks.charAt(rankIdx)
          @pieces[an] = p
          fileIdx++
        else
          fileIdx += parseInt(p, 10)

  _parseActiveColor: (col) ->
    if (col == 'w' || col == 'b')
      @activeColor = col
    else
      throw new Exception('Illegal active color: ' + col)

  _parseCastling: (str) ->
    if str.match(/[kqKQ\-].*/)
      @castling = str.split ''
    else
      throw new Error('Illegal castling string: ' + str)

  _parseEnPassant: (str) ->
    @enPassant = str

  _parseHalfmoveClock: (str) ->
    @halfmove = parseInt(str, 10)

  _parseFullmoveNumber: (str) ->
    @fullmove = parseInt(str, 10)

  toString: () ->
    fenString = @_readPlacement()
    fenString += ' ' + @_readColourToMove()
    fenString += ' ' + @_readCastling()
    fenString += ' ' + @_readEnPassant()
    fenString += ' ' + @_readHalfMoves()
    fenString += ' ' + @_readFullMoves()
    fenString

  _readPlacement: ->
    str = ''
    board = {}
    _.each _.range(8, 0, -1), (rank) =>
      emptyCounter = 0
      if(!_.isEmpty(str))
        str += '/'
      _.each ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'], (file) =>
        positions = _.keys(@pieces)
        square = file + rank
        if (_.include(positions, square))
          piece = @pieces[square]
          str += if emptyCounter > 0 then emptyCounter + piece else piece
          emptyCounter = 0
        else
          emptyCounter++

      if (emptyCounter)
        str += emptyCounter

    str

  _readColourToMove: ->
    @activeColor

  _readCastling: ->
    if !@castling.length then '-' else @castling.join('')

  _readEnPassant: () ->
    return @enPassant

  _readHalfMoves: ->
    return @halfmove

  _readFullMoves: ->
    return @fullmove

module.exports = Fen
