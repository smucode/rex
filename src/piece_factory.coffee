Pawn   = require './pawn'
King   = require './king'
Rook   = require './rook'
Knight = require './knight'
Bishop = require './bishop'
Queen  = require './queen'

Const =
  PAWN: 1
  KNIGHT: 2
  KING: 3
  BISHOP: 5
  ROOK: 6
  QUEEN: 7
  WHITE: 1
  BLACK: -1

class Factory
  _instanceArr: [
    null,
    Pawn,
    Knight,
    King,
    null,
    Bishop,
    Rook,
    Queen
  ]
  
  _pieceMap:
    r: Const.BLACK * Const.ROOK
    n: Const.BLACK * Const.KNIGHT
    b: Const.BLACK * Const.BISHOP
    q: Const.BLACK * Const.QUEEN
    k: Const.BLACK * Const.KING
    p: Const.BLACK * Const.PAWN
    R: Const.WHITE * Const.ROOK
    N: Const.WHITE * Const.KNIGHT
    B: Const.WHITE * Const.BISHOP
    Q: Const.WHITE * Const.QUEEN
    K: Const.WHITE * Const.KING
    P: Const.WHITE * Const.PAWN
  
  create: (charCode, pos, board) ->
    numCode = @_pieceMap[charCode]
    color = if numCode > 0 then Const.WHITE else Const.BLACK
    Inst = @_instanceArr[Math.abs(numCode)]
    if (Inst)
      return new Inst(pos, color, board)
    else
      throw new Error("Unable to create piece #{charCode}")

module.exports = Factory