(function() {
  var Fen, _;

  _ = require('underscore');

  Fen = (function() {
    Fen.prototype.DEFAULT_BOARD = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

    function Fen(fen) {
      this.pieces = {};
      this.activeColor = null;
      this._parse(fen || this.DEFAULT_BOARD);
    }

    Fen.prototype.move = function(from, to) {
      this._validateMove(from, to);
      this._updateActiveColor();
      this._updateCastling(from, to);
      this._updateEnPassant(from, to);
      this._updateHalfmoveClock(from, to);
      this._updateFullmoveNumber();
      return this._updatePiecePlacement(from, to);
    };

    Fen.prototype.canCastle = function(letter) {
      return _.include(this.castling, letter);
    };

    Fen.prototype._validateMove = function(from, to) {
      var piece;
      piece = this.pieces[from];
      if (!piece) {
        throw new Error('You must select a valid piece to move: ' + from);
      }
    };

    Fen.prototype._updateFullmoveNumber = function() {
      if (this.activeColor === 'w') {
        return this.fullmove++;
      }
    };

    Fen.prototype._updateHalfmoveClock = function(from, to) {
      var piece;
      piece = this.pieces[from];
      if (this._isPawn(piece) || this.pieces[to]) {
        return this.halfmove = 0;
      } else {
        return this.halfmove++;
      }
    };

    Fen.prototype._updateEnPassant = function(from, to) {
      var dir, len, piece;
      piece = this.pieces[from];
      if (this._isPawn(piece)) {
        if (this.enPassant === to) {
          dir = to.charAt(1) - from.charAt(1);
          delete this.pieces[to.charAt(0) + (to.charAt(1) - dir)];
        } else {
          len = to.charAt(1) - from.charAt(1);
          if (Math.abs(len) === 2) {
            this.enPassant = to.charAt(0) + (parseInt(from.charAt(1), 10) + (len / 2));
            return;
          }
        }
      }
      return this.enPassant = '-';
    };

    Fen.prototype._updateCastling = function(from, to) {
      if (!this.castling.length) {
        return false;
      }
      switch (from) {
        case 'a1':
          return this.castling = _.without(this.castling, 'Q');
        case 'a8':
          return this.castling = _.without(this.castling, 'q');
        case 'h1':
          return this.castling = _.without(this.castling, 'K');
        case 'h8':
          return this.castling = _.without(this.castling, 'k');
        case 'e1':
          if (to === 'g1' && _.contains(this.castling, 'K')) {
            this.pieces.f1 = this.pieces.h1;
            delete this.pieces.h1;
          } else if (to === 'c1' && _.contains(this.castling, 'Q')) {
            this.pieces.d1 = this.pieces.a1;
            delete this.pieces.a1;
          }
          return this.castling = _.without(this.castling, 'Q', 'K');
        case 'e8':
          if (to === 'g8' && _.contains(this.castling, 'k')) {
            this.pieces.f8 = this.pieces.h8;
            delete this.pieces.h8;
          } else if (to === 'c8' && _.contains(this.castling, 'q')) {
            this.pieces.d8 = this.pieces.a8;
            delete this.pieces.a8;
          }
          return this.castling = _.without(this.castling, 'q', 'k');
      }
    };

    Fen.prototype._updatePiecePlacement = function(from, to) {
      var piece;
      piece = this.pieces[from];
      delete this.pieces[from];
      if (this._isPawn(piece) && (to.charAt(1) === '1' || to.charAt(1) === '8')) {
        return this.pieces[to] = (piece === 'P' ? 'Q' : 'q');
      } else {
        return this.pieces[to] = piece;
      }
    };

    Fen.prototype._isPawn = function(piece) {
      return piece === 'p' || piece === 'P';
    };

    Fen.prototype._updateActiveColor = function() {
      return this.activeColor = this.activeColor === 'w' ? 'b' : 'w';
    };

    Fen.prototype._parse = function(fen) {
      var arr;
      arr = fen.split ? fen.split(' ') : [];
      if (!arr || arr.length !== 6) {
        throw new Error('A FEN must contain 6 space separated fields: ' + fen);
      }
      this._parsePiecePlacement(arr[0]);
      this._parseActiveColor(arr[1]);
      this._parseCastling(arr[2]);
      this._parseEnPassant(arr[3]);
      this._parseHalfmoveClock(arr[4]);
      return this._parseFullmoveNumber(arr[5]);
    };

    Fen.prototype._parsePiecePlacement = function(str) {
      var arr, files, ranks,
        _this = this;
      arr = str.split('/');
      if (arr.length !== 8) {
        throw new Error('A FEN must contain 8 ranks separated by /: ' + str);
      }
      files = 'abcdefgh';
      ranks = '87654321';
      return _.each(arr, function(rank, rankIdx) {
        var fileIdx;
        fileIdx = 0;
        return _.each(rank.split(''), function(p, i) {
          var an;
          if (!p.match(/[0-8]/)) {
            an = files.charAt(fileIdx) + ranks.charAt(rankIdx);
            _this.pieces[an] = p;
            return fileIdx++;
          } else {
            return fileIdx += parseInt(p, 10);
          }
        });
      });
    };

    Fen.prototype._parseActiveColor = function(col) {
      if (col === 'w' || col === 'b') {
        return this.activeColor = col;
      } else {
        throw new Exception('Illegal active color: ' + col);
      }
    };

    Fen.prototype._parseCastling = function(str) {
      if (str.match(/[kqKQ\-].*/)) {
        return this.castling = str.split('');
      } else {
        throw new Error('Illegal castling string: ' + str);
      }
    };

    Fen.prototype._parseEnPassant = function(str) {
      return this.enPassant = str;
    };

    Fen.prototype._parseHalfmoveClock = function(str) {
      return this.halfmove = parseInt(str, 10);
    };

    Fen.prototype._parseFullmoveNumber = function(str) {
      return this.fullmove = parseInt(str, 10);
    };

    Fen.prototype.toString = function() {
      var fenString;
      fenString = this._readPlacement();
      fenString += ' ' + this._readColourToMove();
      fenString += ' ' + this._readCastling();
      fenString += ' ' + this._readEnPassant();
      fenString += ' ' + this._readHalfMoves();
      fenString += ' ' + this._readFullMoves();
      return fenString;
    };

    Fen.prototype._readPlacement = function() {
      var board, str,
        _this = this;
      str = '';
      board = {};
      _.each(_.range(8, 0, -1), function(rank) {
        var emptyCounter;
        emptyCounter = 0;
        if (!_.isEmpty(str)) {
          str += '/';
        }
        _.each(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'], function(file) {
          var piece, positions, square;
          positions = _.keys(_this.pieces);
          square = file + rank;
          if (_.include(positions, square)) {
            piece = _this.pieces[square];
            str += emptyCounter > 0 ? emptyCounter + piece : piece;
            return emptyCounter = 0;
          } else {
            return emptyCounter++;
          }
        });
        if (emptyCounter) {
          return str += emptyCounter;
        }
      });
      return str;
    };

    Fen.prototype._readColourToMove = function() {
      return this.activeColor;
    };

    Fen.prototype._readCastling = function() {
      if (!this.castling.length) {
        return '-';
      } else {
        return this.castling.join('');
      }
    };

    Fen.prototype._readEnPassant = function() {
      return this.enPassant;
    };

    Fen.prototype._readHalfMoves = function() {
      return this.halfmove;
    };

    Fen.prototype._readFullMoves = function() {
      return this.fullmove;
    };

    return Fen;

  })();

  module.exports = Fen;

}).call(this);

(function() {
  var Piece, _;

  _ = require('underscore');

  Piece = (function() {
    Piece.prototype.types = {
      PAWN: 1,
      KNIGHT: 2,
      KING: 3,
      BISHOP: 5,
      ROOK: 6,
      QUEEN: 7
    };

    function Piece() {
      this.attacks = [];
    }

    Piece.prototype.canCapture = function(idx) {
      var piece;
      piece = this.board._getPieceAt(idx);
      return piece && piece.color !== this.color;
    };

    Piece.prototype.canMoveTo = function(idx) {
      var piece;
      piece = this.board._getPieceAt(idx);
      return !piece && this.board.isOnBoard(idx);
    };

    Piece.prototype.addDirectionalMoves = function(directions) {
      var _this = this;
      this.moves = [];
      this.checks = [];
      this.attacks = [];
      this.pinning = {};
      this.behindKing = null;
      _.each(directions, function(direction) {
        return _this._addNextDirectionalMove(direction);
      });
      this._removePinnedMoves();
      return this._removeMovesNotHelpingCheckedKing();
    };

    Piece.prototype._removePinnedMoves = function() {
      var pinned;
      if (this.color === this.board._getCurrentColor()) {
        pinned = this.board.isPinned(this.idx);
        if (pinned) {
          return this.moves = _.intersection(this.moves, pinned);
        }
      }
    };

    Piece.prototype._addNextDirectionalMove = function(direction, offset) {
      var target;
      offset = offset || 1;
      target = this.idx + (offset * direction);
      if (this.canMoveTo(target)) {
        this.moves.push(target);
        this.attacks.push(target);
        return this._addNextDirectionalMove(direction, ++offset);
      } else {
        if (this.canCapture(target)) {
          this.moves.push(target);
          this._checkPinning(target, direction, offset);
          this._checkKingAttacks(target, direction, offset);
        }
        if (this.board.isOnBoard(target)) {
          return this.attacks.push(target);
        }
      }
    };

    Piece.prototype._removeMovesNotHelpingCheckedKing = function() {
      var checkingPieces;
      if (this.color === this.board._getCurrentColor()) {
        checkingPieces = this.board.getCheckingPieces();
        if (checkingPieces.length === 1) {
          return this.moves = _.intersection(this.moves, checkingPieces[0].checks);
        } else if (checkingPieces.length > 1) {
          return this.moves = [];
        }
      }
    };

    Piece.prototype._checkKingAttacks = function(square, direction, offset) {
      var piece;
      piece = this.board._getPieceAt(square);
      if (piece.type === 3) {
        this.checks = [];
        this._setMoveBehindKing(direction, offset);
        return this._backtrackPinnedMoves(direction, --offset, this.checks);
      }
    };

    Piece.prototype._checkPinning = function(pinned, direction, offset) {
      var piece, target;
      target = this.idx + ((offset + 1) * direction);
      if (this.canMoveTo(target)) {
        return this._checkPinning(pinned, direction, ++offset);
      } else if (this.canCapture(target)) {
        piece = this.board._getPieceAt(target);
        if (piece.type === 3 && piece.color !== this.color) {
          this.pinning[pinned] = [];
          return this._backtrackPinnedMoves(direction, offset, this.pinning[pinned]);
        }
      }
    };

    Piece.prototype._setMoveBehindKing = function(direction, offset) {
      var behind;
      behind = this.idx + ((offset + 1) * direction);
      if (this.canMoveTo(behind)) {
        return this.behindKing = behind;
      }
    };

    Piece.prototype._backtrackPinnedMoves = function(direction, offset, arr) {
      var target;
      target = this.idx + (offset * direction);
      arr.push(target);
      if (target !== this.idx) {
        return this._backtrackPinnedMoves(direction, --offset, arr);
      }
    };

    Piece.prototype.is = function(type) {
      return this.types[type] === this.type;
    };

    return Piece;

  })();

  module.exports = Piece;

}).call(this);

(function() {
  var Piece, Rook, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore');

  Piece = require('./piece');

  Rook = (function(_super) {
    __extends(Rook, _super);

    Rook.prototype.DIRECTIONS = [1, -1, 16, -16];

    function Rook(idx, color, board) {
      this.idx = idx;
      this.color = color;
      this.board = board;
      this.moves = [];
    }

    Rook.prototype.calculate = function() {
      return this.addDirectionalMoves(this.DIRECTIONS);
    };

    return Rook;

  })(Piece);

  module.exports = Rook;

}).call(this);

(function() {
  var Knight, Piece, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore');

  Piece = require('./piece');

  Knight = (function(_super) {
    __extends(Knight, _super);

    Knight.prototype.DIRECTIONS = [16 - 2, 16 + 2, 32 - 1, 32 + 1, -16 - 2, -16 + 2, -32 - 1, -32 + 1];

    function Knight(idx, color, board) {
      this.idx = idx;
      this.color = color;
      this.board = board;
      this.moves = [];
    }

    Knight.prototype.calculate = function() {
      this.moves = [];
      this.checks = [];
      this.attacks = [];
      this.pinning = {};
      this.behindKing = null;
      this._addRegularMoves();
      this._removePinnedMoves();
      return this._removeMovesNotHelpingCheckedKing();
    };

    Knight.prototype._addRegularMoves = function() {
      var _this = this;
      return _.each(this.DIRECTIONS, function(direction) {
        var p, target;
        target = _this.idx + direction;
        if (_this.canMoveTo(target) || _this.canCapture(target)) {
          _this.moves.push(target);
        }
        if (_this.canCapture(target)) {
          p = _this.board._getPieceAt(target);
          if (p.color !== _this.color && p.type === 3) {
            _this.checks = [_this.idx];
          }
        }
        if (_this.board.isOnBoard(target)) {
          return _this.attacks.push(target);
        }
      });
    };

    return Knight;

  })(Piece);

  module.exports = Knight;

}).call(this);

(function() {
  var Bishop, Piece, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore');

  Piece = require('./piece');

  Bishop = (function(_super) {
    __extends(Bishop, _super);

    Bishop.prototype.OFFSETS = [16 - 1, 16 + 1, -16 - 1, -16 + 1];

    function Bishop(idx, color, board) {
      this.idx = idx;
      this.color = color;
      this.board = board;
      this.moves = [];
    }

    Bishop.prototype.calculate = function() {
      return this.addDirectionalMoves(this.OFFSETS);
    };

    return Bishop;

  })(Piece);

  module.exports = Bishop;

}).call(this);

(function() {
  var King, Piece, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore');

  Piece = require('./piece');

  King = (function(_super) {
    __extends(King, _super);

    King.prototype.CASTLE_SQUARES = {
      q: [-1, -2, -3],
      k: [1, 2]
    };

    King.prototype.DIRECTIONS = [-1, 1, 16 - 1, 16, 16 + 1, -16 - 1, -16, -16 + 1];

    function King(idx, color, board) {
      this.idx = idx;
      this.color = color;
      this.board = board;
      this.type = 3;
      this.moves = [];
      this.attacks = [];
      this.behindKing = null;
      this._castlingIdx = this.color === 1 ? 4 : 4 + (16 * 7);
      this._castling = this.color === 1 ? {
        Q: -1,
        K: 1
      } : {
        q: -1,
        k: 1
      };
    }

    King.prototype.calculate = function() {
      this.moves = [];
      this.checks = [];
      this.attacks = [];
      this.pinning = {};
      this._addRegularMoves();
      return this._addCastlingMoves();
    };

    King.prototype.canCastle = function(code, direction) {
      var hasCastlingRights;
      hasCastlingRights = this.idx === this._castlingIdx && this.board.canCastle(code);
      if (!hasCastlingRights) {
        return false;
      }
      return !this._pathToRookIsBlocked(code);
    };

    King.prototype._pathToRookIsBlocked = function(code) {
      var _this = this;
      return _.find(this.CASTLE_SQUARES[code.toLowerCase()], function(offset) {
        var target;
        target = _this.idx + offset;
        return !_this.canMoveTo(target) || _this.isAttacked(target);
      });
    };

    King.prototype.isAttacked = function(idx) {
      return this.board.isAttacked(idx);
    };

    King.prototype.isProtected = function(idx) {
      return this.board.isProtected(idx);
    };

    King.prototype._addRegularMoves = function() {
      var _this = this;
      return _.each(this.DIRECTIONS, function(direction) {
        var target;
        target = _this.idx + direction;
        if (!_this.isSquareBehindCheckedKing(target)) {
          if ((_this.canMoveTo(target) && !_this.isAttacked(target)) || (_this.canCapture(target) && !_this.isProtected(target))) {
            _this.moves.push(target);
          }
        }
        if (_this.board.isOnBoard(target)) {
          return _this.attacks.push(target);
        }
      });
    };

    King.prototype.isSquareBehindCheckedKing = function(square) {
      var currentColor,
        _this = this;
      currentColor = this.board._getCurrentColor();
      return _.detect(this.board._getPieces(currentColor * -1), function(p) {
        return p.behindKing === square;
      });
    };

    King.prototype._addCastlingMoves = function() {
      var _this = this;
      return _.each(this._castling, function(direction, code) {
        if (_this.canCastle(code)) {
          return _this.moves.push(_this.idx + (direction * 2));
        }
      });
    };

    return King;

  })(Piece);

  module.exports = King;

}).call(this);

(function() {
  var Piece, Queen, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore');

  Piece = require('./piece');

  Queen = (function(_super) {
    __extends(Queen, _super);

    Queen.prototype.OFFSETS = [-1, 1, 16 - 1, 16, 16 + 1, -16 - 1, -16, -16 + 1];

    function Queen(idx, color, board) {
      this.idx = idx;
      this.color = color;
      this.board = board;
      this.moves = [];
    }

    Queen.prototype.calculate = function() {
      return this.addDirectionalMoves(this.OFFSETS);
    };

    return Queen;

  })(Piece);

  module.exports = Queen;

}).call(this);

(function() {
  var Pawn, Piece, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore');

  Piece = require('./piece');

  Pawn = (function(_super) {
    __extends(Pawn, _super);

    Pawn.prototype._CAPTURE_DIRECTIONS = [1, -1];

    function Pawn(idx, color, board) {
      this.idx = idx;
      this.color = color;
      this.board = board;
      this.moves = [];
      this.type = 1;
    }

    Pawn.prototype.calculate = function() {
      this.moves = [];
      this.checks = [];
      this.attacks = [];
      this.pinning = {};
      this.behindKing = null;
      this._addRegularMoves();
      this._addCaptureMoves();
      this._removePinnedMoves();
      return this._removeMovesNotHelpingCheckedKing();
    };

    Pawn.prototype.canCaptureEnPassant = function(idx) {
      return this.board.isEnPassant(idx);
    };

    Pawn.prototype._addRegularMoves = function() {
      var square;
      square = this.idx + (this.color * 16);
      if (this.board.isOnBoard(square) && this.board.isEmpty(square)) {
        this.moves.push(square);
        if ((this.color === 1 && this.idx >= 16 && this.idx < 16 + 8) || (this.color === -1 && this.idx >= 96 && this.idx < 96 + 8)) {
          square = this.idx + (this.color * 32);
          if (this.board.isEmpty(square)) {
            return this.moves.push(square);
          }
        }
      }
    };

    Pawn.prototype._addCaptureMoves = function() {
      var _this = this;
      return _.each(this._CAPTURE_DIRECTIONS, function(direction) {
        var p, target;
        target = _this.idx + (_this.color * 16) + direction;
        if (_this.canCapture(target) || _this.canCaptureEnPassant(target)) {
          _this.moves.push(target);
        }
        if (_this.canCapture(target)) {
          p = _this.board._getPieceAt(target);
          if (p.color !== _this.color && p.type === 3) {
            _this.checks = [_this.idx];
          }
        }
        if (_this.board.isOnBoard(target)) {
          return _this.attacks.push(target);
        }
      });
    };

    return Pawn;

  })(Piece);

  module.exports = Pawn;

}).call(this);

(function() {
  var Bishop, Const, Factory, King, Knight, Pawn, Queen, Rook;

  Pawn = require('./pawn');

  King = require('./king');

  Rook = require('./rook');

  Knight = require('./knight');

  Bishop = require('./bishop');

  Queen = require('./queen');

  Const = {
    PAWN: 1,
    KNIGHT: 2,
    KING: 3,
    BISHOP: 5,
    ROOK: 6,
    QUEEN: 7,
    WHITE: 1,
    BLACK: -1
  };

  Factory = (function() {
    function Factory() {}

    Factory.prototype._instanceArr = [null, Pawn, Knight, King, null, Bishop, Rook, Queen];

    Factory.prototype._pieceMap = {
      r: Const.BLACK * Const.ROOK,
      n: Const.BLACK * Const.KNIGHT,
      b: Const.BLACK * Const.BISHOP,
      q: Const.BLACK * Const.QUEEN,
      k: Const.BLACK * Const.KING,
      p: Const.BLACK * Const.PAWN,
      R: Const.WHITE * Const.ROOK,
      N: Const.WHITE * Const.KNIGHT,
      B: Const.WHITE * Const.BISHOP,
      Q: Const.WHITE * Const.QUEEN,
      K: Const.WHITE * Const.KING,
      P: Const.WHITE * Const.PAWN
    };

    Factory.prototype.create = function(charCode, pos, board) {
      var Inst, color, numCode;
      numCode = this._pieceMap[charCode];
      color = numCode > 0 ? Const.WHITE : Const.BLACK;
      Inst = this._instanceArr[Math.abs(numCode)];
      if (Inst) {
        return new Inst(pos, color, board);
      } else {
        throw new Error("Unable to create piece " + charCode);
      }
    };

    return Factory;

  })();

  module.exports = Factory;

}).call(this);

(function() {
  var Backbone, Board, Factory, Fen, _;

  _ = require('underscore');

  Backbone = require('backbone');

  Fen = require('./fen');

  Factory = require('./piece_factory');

  Board = (function() {
    Board.prototype.WHITE = 1;

    Board.prototype.BLACK = -1;

    Board.prototype._state = 'move';

    Board.prototype._files = 'abcdefgh';

    function Board(fen) {
      var _this = this;
      _.extend(this, Backbone.Events);
      this._state = {};
      this._fen = new Fen(fen);
      this._board = new Array(128);
      this.factory = new Factory;
      _.each(this._fen.pieces, function(piece, pos) {
        var idx;
        idx = _this._posToIdx(pos);
        return _this._board[idx] = _this.factory.create(piece, idx, _this);
      });
      this._calculate();
    }

    Board.prototype.move = function(from, to) {
      var source, toIdx;
      source = this._getPiece(from);
      this._verifyMove(source);
      toIdx = this._posToIdx(to);
      this._verifyIndex(source, toIdx);
      this._state = {};
      if (source.canCapture(toIdx) || source.canMoveTo(toIdx)) {
        if (source.is('PAWN') && (toIdx < 9 || toIdx > 111)) {
          this._promotePawn(from, to, source, toIdx);
        } else {
          if (this._fen.enPassant === to) {
            this._moveEnPassant(to, from);
          }
          this._updateArray(from, to);
          this._fen.move(from, to);
        }
      } else {
        throw new Error('unable to move from ' + from + ' to ' + to);
      }
      if (this._fen.halfmove >= 50) {
        this._state.finished = 'halfmoves';
      } else {
        this._calculate();
      }
      this._state.to = to;
      this._state.from = from;
      this._fireEvent();
      return this._state;
    };

    Board.prototype._verifyMove = function(source) {
      if (!source) {
        throw new Error('there is no piece to move');
      }
      if (this._getCurrentColor() !== source.color) {
        throw new Error('cannot move out of order');
      }
    };

    Board.prototype._verifyIndex = function(source, toIdx) {
      if (source.moves.indexOf(toIdx) === -1) {
        throw new Error('there is no piece at ' + this._idxToPos(toIdx) + ': ' + this._fen.toString());
      }
    };

    Board.prototype._promotePawn = function(from, to, source, toIdx) {
      var fidx, pieceType;
      this._fen.move(from, to);
      fidx = this._posToIdx(from);
      this._board[fidx] = null;
      pieceType = source.color === 1 ? 'Q' : 'q';
      this._board[toIdx] = this.factory.create(pieceType, toIdx, this);
      return this._state.promotion = pieceType;
    };

    Board.prototype._moveEnPassant = function(to, from) {
      return this._state.enPassantCapture = to[0] + from[1];
    };

    Board.prototype._fireEvent = function() {
      return this.trigger('move', this._state);
    };

    Board.prototype.onMove = function(f) {
      this.on('move', f);
      return f(this.getState());
    };

    Board.prototype.getState = function() {
      return this._state;
    };

    Board.prototype._calculateValidMoves = function() {
      var m,
        _this = this;
      m = {};
      _.each(this._getPieces(this._getCurrentColor()), function(p) {
        var moves;
        if (p.moves.length > 0) {
          moves = _.map(p.moves, function(move) {
            return _this._idxToPos(move);
          });
          return m[_this._idxToPos(p.idx)] = moves;
        }
      });
      return m;
    };

    Board.prototype._posToIdx = function(pos) {
      var c;
      if (!pos || typeof pos !== 'string' || !pos.match(/[a-h]{1}[0-8]{1}/)) {
        throw new Error('illegal pos ' + pos);
      }
      c = this._files.indexOf(pos[0]);
      return c + ((pos[1] - 1) * 16);
    };

    Board.prototype._idxToPos = function(idx) {
      var file, pos, rank;
      file = idx % 16;
      rank = Math.floor(idx / 16);
      pos = this._files[file] + (rank + 1);
      if (typeof pos !== 'string') {
        throw new Error('illegal idx ' + idx);
      }
      return pos;
    };

    Board.prototype._getPieceAt = function(idx) {
      return this._board[idx];
    };

    Board.prototype._getPieces = function(color) {
      return _.filter(this._board, function(p) {
        if (!color) {
          return p;
        } else {
          return p && p.color === color;
        }
      });
    };

    Board.prototype._getPiece = function(pos) {
      var idx;
      idx = this._posToIdx(pos);
      return this._getPieceAt(idx);
    };

    Board.prototype._getCurrentColor = function() {
      if (this._fen.activeColor === 'w') {
        return this.WHITE;
      } else {
        return this.BLACK;
      }
    };

    Board.prototype._calculate = function() {
      var attacked, currentColor, moves,
        _this = this;
      currentColor = this._getCurrentColor();
      moves = [];
      attacked = [];
      _.each(this._getPieces(currentColor * -1), function(p) {
        p.calculate();
        return attacked = _.union(attacked, p.attacks);
      });
      _.each(this._getPieces(currentColor), function(p) {
        p.calculate();
        moves = moves.concat(p.moves);
        if (p.type === 3 && attacked.indexOf(p.idx) !== -1) {
          return _this._state.check = true;
        }
      });
      if (moves.length === 0) {
        if (this._state.check) {
          this._state.finished = 'checkmate';
        } else {
          this._state.finished = 'stalemate';
        }
      }
      this._state.board = this._fen.pieces;
      this._state.active_color = this._fen.activeColor;
      this._state.valid_moves = this._calculateValidMoves();
      return this._state;
    };

    Board.prototype._updateArray = function(from, to) {
      var fidx, fromPiece, tidx;
      fidx = this._posToIdx(from);
      fromPiece = this._board[fidx];
      this._board[fidx] = null;
      tidx = this._posToIdx(to);
      fromPiece.idx = tidx;
      this._board[tidx] = fromPiece;
      return this._updateCastling(from, to);
    };

    Board.prototype._updateCastling = function(from, to) {
      switch (from) {
        case 'e1':
          if (to === 'g1' && _.contains(this._fen.castling, 'K')) {
            this._board[this._posToIdx('f1')] = this._board[this._posToIdx('h1')];
            this._board[this._posToIdx('f1')].idx = this._posToIdx('f1');
            return this._board[this._posToIdx('h1')] = null;
          } else if (to === 'c1' && _.contains(this._fen.castling, 'Q')) {
            this._board[this._posToIdx('d1')] = this._board[this._posToIdx('a1')];
            this._board[this._posToIdx('d1')].idx = this._posToIdx('d1');
            return this._board[this._posToIdx('a1')] = null;
          }
          break;
        case 'e8':
          if (to === 'g8' && _.contains(this._fen.castling, 'k')) {
            this._board[this._posToIdx('f8')] = this._board[this._posToIdx('h8')];
            this._board[this._posToIdx('f8')].idx = this._posToIdx('f8');
            return this._board[this._posToIdx('h8')] = null;
          } else if (to === 'c8' && _.contains(this._fen.castling, 'q')) {
            this._board[this._posToIdx('d8')] = this._board[this._posToIdx('a8')];
            this._board[this._posToIdx('d8')].idx = this._posToIdx('d8');
            return this._board[this._posToIdx('a8')] = null;
          }
      }
    };

    Board.prototype.getCheckingPieces = function() {
      var currentColor, pieces;
      currentColor = this._getCurrentColor();
      pieces = this._getPieces(currentColor * -1);
      return _.filter(pieces, function(piece) {
        return piece.checks && piece.checks.length > 0;
      });
    };

    Board.prototype.isPinned = function(idx) {
      var currentColor, pieces, pinningPiece;
      currentColor = this._getCurrentColor();
      pieces = this._getPieces(currentColor * -1);
      pinningPiece = _.detect(pieces, function(p) {
        return p.pinning && p.pinning[idx];
      });
      if (pinningPiece) {
        return _(pinningPiece.pinning[idx]).chain().clone().without(idx).union(pinningPiece.idx).value();
      }
    };

    Board.prototype.isAttacked = function(idx) {
      var currentColor;
      currentColor = this._getCurrentColor();
      return _.detect(this._getPieces(currentColor * -1), function(p) {
        var _ref;
        return ((_ref = p.attacks) != null ? _ref.indexOf(idx) : void 0) !== -1;
      });
    };

    Board.prototype.isProtected = function(idx) {
      var currentColor;
      currentColor = this._getCurrentColor();
      return _.detect(this._getPieces(currentColor * -1), function(p) {
        return p.moves.indexOf(idx) !== -1 || p.attacks.indexOf(idx) !== -1;
      });
    };

    Board.prototype.isEmpty = function(idx) {
      return !this._getPieceAt(idx);
    };

    Board.prototype.isOnBoard = function(idx) {
      return idx >= 0 && idx < 127 && (idx & 0x88) === 0;
    };

    Board.prototype.canCastle = function(code) {
      return this._fen.canCastle(code);
    };

    Board.prototype.isEnPassant = function(idx) {
      var ep, epIdx;
      ep = this._fen.enPassant;
      if (ep && ep !== '-') {
        epIdx = this._posToIdx(ep);
        return idx === epIdx;
      }
      return false;
    };

    Board.prototype.getMoves = function(pos) {
      var idx, piece,
        _this = this;
      idx = this._posToIdx(pos);
      piece = this._getPieceAt(idx);
      if (piece && piece.color === this._getCurrentColor()) {
        return _.map(piece.moves, function(idx) {
          return _this._idxToPos(idx);
        });
      }
      return [];
    };

    Board.prototype.toString = function() {
      return this._fen.toString();
    };

    return Board;

  })();

  module.exports = Board;

}).call(this);
