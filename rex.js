(function() {var module,require;module={exports:{}},require=function(name){switch(name){case"underscore":return this._;case"./fen":return Fen;case"./pawn":return Pawn;case"./king":return King;case"./rook":return Rook;case"./piece":return Piece;case"./queen":return Queen;case"./knight":return Knight;case"./bishop":return Bishop;case"./piece_factory":return Factory}};var Fen,_;_=require("underscore"),Fen=function(){function Fen(fen){this.pieces={},this.activeColor=null,this._parse(fen||this.DEFAULT_BOARD)}return Fen.prototype.DEFAULT_BOARD="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",Fen.prototype.move=function(from,to){return this._validateMove(from,to),this._updateActiveColor(),this._updateCastling(from,to),this._updateEnPassant(from,to),this._updateHalfmoveClock(from,to),this._updateFullmoveNumber(),this._updatePiecePlacement(from,to)},Fen.prototype.canCastle=function(letter){return _.include(this.castling,letter)},Fen.prototype._validateMove=function(from){var piece;if(piece=this.pieces[from],!piece)throw new Error("You must select a valid piece to move: "+from)},Fen.prototype._updateFullmoveNumber=function(){return"w"===this.activeColor?this.fullmove++:void 0},Fen.prototype._updateHalfmoveClock=function(from,to){var piece;return piece=this.pieces[from],this._isPawn(piece)||this.pieces[to]?this.halfmove=0:this.halfmove++},Fen.prototype._updateEnPassant=function(from,to){var dir,len,piece;if(piece=this.pieces[from],this._isPawn(piece))if(this.enPassant===to)dir=to.charAt(1)-from.charAt(1),delete this.pieces[to.charAt(0)+(to.charAt(1)-dir)];else if(len=to.charAt(1)-from.charAt(1),2===Math.abs(len))return this.enPassant=to.charAt(0)+(parseInt(from.charAt(1),10)+len/2),void 0;return this.enPassant="-"},Fen.prototype._updateCastling=function(from,to){if(!this.castling.length)return!1;switch(from){case"a1":return this.castling=_.without(this.castling,"Q");case"a8":return this.castling=_.without(this.castling,"q");case"h1":return this.castling=_.without(this.castling,"K");case"h8":return this.castling=_.without(this.castling,"k");case"e1":return"g1"===to&&_.contains(this.castling,"K")?(this.pieces.f1=this.pieces.h1,delete this.pieces.h1):"c1"===to&&_.contains(this.castling,"Q")&&(this.pieces.d1=this.pieces.a1,delete this.pieces.a1),this.castling=_.without(this.castling,"Q","K");case"e8":return"g8"===to&&_.contains(this.castling,"k")?(this.pieces.f8=this.pieces.h8,delete this.pieces.h8):"c8"===to&&_.contains(this.castling,"q")&&(this.pieces.d8=this.pieces.a8,delete this.pieces.a8),this.castling=_.without(this.castling,"q","k")}},Fen.prototype._updatePiecePlacement=function(from,to){var piece;return piece=this.pieces[from],delete this.pieces[from],this.pieces[to]=!this._isPawn(piece)||"1"!==to.charAt(1)&&"8"!==to.charAt(1)?piece:"P"===piece?"Q":"q"},Fen.prototype._isPawn=function(piece){return"p"===piece||"P"===piece},Fen.prototype._updateActiveColor=function(){return this.activeColor="w"===this.activeColor?"b":"w"},Fen.prototype._parse=function(fen){var arr;if(arr=fen.split?fen.split(" "):[],!arr||6!==arr.length)throw new Error("A FEN must contain 6 space separated fields: "+fen);return this._parsePiecePlacement(arr[0]),this._parseActiveColor(arr[1]),this._parseCastling(arr[2]),this._parseEnPassant(arr[3]),this._parseHalfmoveClock(arr[4]),this._parseFullmoveNumber(arr[5])},Fen.prototype._parsePiecePlacement=function(str){var arr,files,ranks,_this=this;if(arr=str.split("/"),8!==arr.length)throw new Error("A FEN must contain 8 ranks separated by /: "+str);return files="abcdefgh",ranks="87654321",_.each(arr,function(rank,rankIdx){var fileIdx;return fileIdx=0,_.each(rank.split(""),function(p){var an;return p.match(/[0-8]/)?fileIdx+=parseInt(p,10):(an=files.charAt(fileIdx)+ranks.charAt(rankIdx),_this.pieces[an]=p,fileIdx++)})})},Fen.prototype._parseActiveColor=function(col){if("w"===col||"b"===col)return this.activeColor=col;throw new Exception("Illegal active color: "+col)},Fen.prototype._parseCastling=function(str){if(str.match(/[kqKQ\-].*/))return this.castling=str.split("");throw new Error("Illegal castling string: "+str)},Fen.prototype._parseEnPassant=function(str){return this.enPassant=str},Fen.prototype._parseHalfmoveClock=function(str){return this.halfmove=parseInt(str,10)},Fen.prototype._parseFullmoveNumber=function(str){return this.fullmove=parseInt(str,10)},Fen.prototype.toString=function(){var fenString;return fenString=this._readPlacement(),fenString+=" "+this._readColourToMove(),fenString+=" "+this._readCastling(),fenString+=" "+this._readEnPassant(),fenString+=" "+this._readHalfMoves(),fenString+=" "+this._readFullMoves()},Fen.prototype._readPlacement=function(){var board,str,_this=this;return str="",board={},_.each(_.range(8,0,-1),function(rank){var emptyCounter;return emptyCounter=0,_.isEmpty(str)||(str+="/"),_.each(["a","b","c","d","e","f","g","h"],function(file){var piece,positions,square;return positions=_.keys(_this.pieces),square=file+rank,_.include(positions,square)?(piece=_this.pieces[square],str+=emptyCounter>0?emptyCounter+piece:piece,emptyCounter=0):emptyCounter++}),emptyCounter?str+=emptyCounter:void 0}),str},Fen.prototype._readColourToMove=function(){return this.activeColor},Fen.prototype._readCastling=function(){return this.castling.length?this.castling.join(""):"-"},Fen.prototype._readEnPassant=function(){return this.enPassant},Fen.prototype._readHalfMoves=function(){return this.halfmove},Fen.prototype._readFullMoves=function(){return this.fullmove},Fen}(),module.exports=Fen;var Piece,_;_=require("underscore"),Piece=function(){function Piece(){this.attacks=[]}return Piece.prototype.types={PAWN:1,KNIGHT:2,KING:3,BISHOP:5,ROOK:6,QUEEN:7},Piece.prototype.canCapture=function(idx){var piece;return piece=this.board._getPieceAt(idx),piece&&piece.color!==this.color},Piece.prototype.canMoveTo=function(idx){var piece;return piece=this.board._getPieceAt(idx),!piece&&this.board.isOnBoard(idx)},Piece.prototype.addDirectionalMoves=function(directions){var _this=this;return this.moves=[],this.checks=[],this.attacks=[],this.pinning={},this.behindKing=null,_.each(directions,function(direction){return _this._addNextDirectionalMove(direction)}),this._removePinnedMoves(),this._removeMovesNotHelpingCheckedKing()},Piece.prototype._removePinnedMoves=function(){var pinned;return this.color===this.board._getCurrentColor()&&(pinned=this.board.isPinned(this.idx))?this.moves=_.intersection(this.moves,pinned):void 0},Piece.prototype._addNextDirectionalMove=function(direction,offset){var target;return offset=offset||1,target=this.idx+offset*direction,this.canMoveTo(target)?(this.moves.push(target),this.attacks.push(target),this._addNextDirectionalMove(direction,++offset)):(this.canCapture(target)&&(this.moves.push(target),this._checkPinning(target,direction,offset),this._checkKingAttacks(target,direction,offset)),this.board.isOnBoard(target)?this.attacks.push(target):void 0)},Piece.prototype._removeMovesNotHelpingCheckedKing=function(){var checkingPieces;if(this.color===this.board._getCurrentColor()){if(checkingPieces=this.board.getCheckingPieces(),1===checkingPieces.length)return this.moves=_.intersection(this.moves,checkingPieces[0].checks);if(checkingPieces.length>1)return this.moves=[]}},Piece.prototype._checkKingAttacks=function(square,direction,offset){var piece;return piece=this.board._getPieceAt(square),3===piece.type?(this.checks=[],this._setMoveBehindKing(direction,offset),this._backtrackPinnedMoves(direction,--offset,this.checks)):void 0},Piece.prototype._checkPinning=function(pinned,direction,offset){var piece,target;return target=this.idx+(offset+1)*direction,this.canMoveTo(target)?this._checkPinning(pinned,direction,++offset):this.canCapture(target)&&(piece=this.board._getPieceAt(target),3===piece.type&&piece.color!==this.color)?(this.pinning[pinned]=[],this._backtrackPinnedMoves(direction,offset,this.pinning[pinned])):void 0},Piece.prototype._setMoveBehindKing=function(direction,offset){var behind;return behind=this.idx+(offset+1)*direction,this.canMoveTo(behind)?this.behindKing=behind:void 0},Piece.prototype._backtrackPinnedMoves=function(direction,offset,arr){var target;return target=this.idx+offset*direction,arr.push(target),target!==this.idx?this._backtrackPinnedMoves(direction,--offset,arr):void 0},Piece.prototype.is=function(type){return this.types[type]===this.type},Piece}(),module.exports=Piece;var Piece,Rook,_,__hasProp={}.hasOwnProperty,__extends=function(child,parent){function ctor(){this.constructor=child}for(var key in parent)__hasProp.call(parent,key)&&(child[key]=parent[key]);return ctor.prototype=parent.prototype,child.prototype=new ctor,child.__super__=parent.prototype,child};_=require("underscore"),Piece=require("./piece"),Rook=function(_super){function Rook(idx,color,board){this.idx=idx,this.color=color,this.board=board,this.moves=[]}return __extends(Rook,_super),Rook.prototype.DIRECTIONS=[1,-1,16,-16],Rook.prototype.calculate=function(){return this.addDirectionalMoves(this.DIRECTIONS)},Rook}(Piece),module.exports=Rook;var Knight,Piece,_,__hasProp={}.hasOwnProperty,__extends=function(child,parent){function ctor(){this.constructor=child}for(var key in parent)__hasProp.call(parent,key)&&(child[key]=parent[key]);return ctor.prototype=parent.prototype,child.prototype=new ctor,child.__super__=parent.prototype,child};_=require("underscore"),Piece=require("./piece"),Knight=function(_super){function Knight(idx,color,board){this.idx=idx,this.color=color,this.board=board,this.moves=[]}return __extends(Knight,_super),Knight.prototype.DIRECTIONS=[14,18,31,33,-18,-14,-33,-31],Knight.prototype.calculate=function(){return this.moves=[],this.checks=[],this.attacks=[],this.pinning={},this.behindKing=null,this._addRegularMoves(),this._removePinnedMoves(),this._removeMovesNotHelpingCheckedKing()},Knight.prototype._addRegularMoves=function(){var _this=this;return _.each(this.DIRECTIONS,function(direction){var p,target;return target=_this.idx+direction,(_this.canMoveTo(target)||_this.canCapture(target))&&_this.moves.push(target),_this.canCapture(target)&&(p=_this.board._getPieceAt(target),p.color!==_this.color&&3===p.type&&(_this.checks=[_this.idx])),_this.board.isOnBoard(target)?_this.attacks.push(target):void 0})},Knight}(Piece),module.exports=Knight;var Bishop,Piece,_,__hasProp={}.hasOwnProperty,__extends=function(child,parent){function ctor(){this.constructor=child}for(var key in parent)__hasProp.call(parent,key)&&(child[key]=parent[key]);return ctor.prototype=parent.prototype,child.prototype=new ctor,child.__super__=parent.prototype,child};_=require("underscore"),Piece=require("./piece"),Bishop=function(_super){function Bishop(idx,color,board){this.idx=idx,this.color=color,this.board=board,this.moves=[]}return __extends(Bishop,_super),Bishop.prototype.OFFSETS=[15,17,-17,-15],Bishop.prototype.calculate=function(){return this.addDirectionalMoves(this.OFFSETS)},Bishop}(Piece),module.exports=Bishop;var King,Piece,_,__hasProp={}.hasOwnProperty,__extends=function(child,parent){function ctor(){this.constructor=child}for(var key in parent)__hasProp.call(parent,key)&&(child[key]=parent[key]);return ctor.prototype=parent.prototype,child.prototype=new ctor,child.__super__=parent.prototype,child};_=require("underscore"),Piece=require("./piece"),King=function(_super){function King(idx,color,board){this.idx=idx,this.color=color,this.board=board,this.type=3,this.moves=[],this.attacks=[],this.behindKing=null,this._castlingIdx=1===this.color?4:116,this._castling=1===this.color?{Q:-1,K:1}:{q:-1,k:1}}return __extends(King,_super),King.prototype.CASTLE_SQUARES={q:[-1,-2,-3],k:[1,2]},King.prototype.DIRECTIONS=[-1,1,15,16,17,-17,-16,-15],King.prototype.calculate=function(){return this.moves=[],this.checks=[],this.attacks=[],this.pinning={},this._addRegularMoves(),this._addCastlingMoves()},King.prototype.canCastle=function(code){var hasCastlingRights;return hasCastlingRights=this.idx===this._castlingIdx&&this.board.canCastle(code),hasCastlingRights?!this._pathToRookIsBlocked(code):!1},King.prototype._pathToRookIsBlocked=function(code){var _this=this;return _.find(this.CASTLE_SQUARES[code.toLowerCase()],function(offset){var target;return target=_this.idx+offset,!_this.canMoveTo(target)||_this.isAttacked(target)})},King.prototype.isAttacked=function(idx){return this.board.isAttacked(idx)},King.prototype.isProtected=function(idx){return this.board.isProtected(idx)},King.prototype._addRegularMoves=function(){var _this=this;return _.each(this.DIRECTIONS,function(direction){var target;return target=_this.idx+direction,_this.isSquareBehindCheckedKing(target)||(_this.canMoveTo(target)&&!_this.isAttacked(target)||_this.canCapture(target)&&!_this.isProtected(target))&&_this.moves.push(target),_this.board.isOnBoard(target)?_this.attacks.push(target):void 0})},King.prototype.isSquareBehindCheckedKing=function(square){var currentColor;return currentColor=this.board._getCurrentColor(),_.detect(this.board._getPieces(-1*currentColor),function(p){return p.behindKing===square})},King.prototype._addCastlingMoves=function(){var _this=this;return _.each(this._castling,function(direction,code){return _this.canCastle(code)?_this.moves.push(_this.idx+2*direction):void 0})},King}(Piece),module.exports=King;var Piece,Queen,_,__hasProp={}.hasOwnProperty,__extends=function(child,parent){function ctor(){this.constructor=child}for(var key in parent)__hasProp.call(parent,key)&&(child[key]=parent[key]);return ctor.prototype=parent.prototype,child.prototype=new ctor,child.__super__=parent.prototype,child};_=require("underscore"),Piece=require("./piece"),Queen=function(_super){function Queen(idx,color,board){this.idx=idx,this.color=color,this.board=board,this.moves=[]}return __extends(Queen,_super),Queen.prototype.OFFSETS=[-1,1,15,16,17,-17,-16,-15],Queen.prototype.calculate=function(){return this.addDirectionalMoves(this.OFFSETS)},Queen}(Piece),module.exports=Queen;var Pawn,Piece,_,__hasProp={}.hasOwnProperty,__extends=function(child,parent){function ctor(){this.constructor=child}for(var key in parent)__hasProp.call(parent,key)&&(child[key]=parent[key]);return ctor.prototype=parent.prototype,child.prototype=new ctor,child.__super__=parent.prototype,child};_=require("underscore"),Piece=require("./piece"),Pawn=function(_super){function Pawn(idx,color,board){this.idx=idx,this.color=color,this.board=board,this.moves=[],this.type=1}return __extends(Pawn,_super),Pawn.prototype._CAPTURE_DIRECTIONS=[1,-1],Pawn.prototype.calculate=function(){return this.moves=[],this.checks=[],this.attacks=[],this.pinning={},this.behindKing=null,this._addRegularMoves(),this._addCaptureMoves(),this._removePinnedMoves(),this._removeMovesNotHelpingCheckedKing()},Pawn.prototype.canCaptureEnPassant=function(idx){return this.board.isEnPassant(idx)},Pawn.prototype._addRegularMoves=function(){var square;return square=this.idx+16*this.color,this.board.isOnBoard(square)&&this.board.isEmpty(square)&&(this.moves.push(square),(1===this.color&&this.idx>=16&&this.idx<24||-1===this.color&&this.idx>=96&&this.idx<104)&&(square=this.idx+32*this.color,this.board.isEmpty(square)))?this.moves.push(square):void 0},Pawn.prototype._addCaptureMoves=function(){var _this=this;return _.each(this._CAPTURE_DIRECTIONS,function(direction){var p,target;return target=_this.idx+16*_this.color+direction,(_this.canCapture(target)||_this.canCaptureEnPassant(target))&&_this.moves.push(target),_this.canCapture(target)&&(p=_this.board._getPieceAt(target),p.color!==_this.color&&3===p.type&&(_this.checks=[_this.idx])),_this.board.isOnBoard(target)?_this.attacks.push(target):void 0})},Pawn}(Piece),module.exports=Pawn;var Bishop,Const,Factory,King,Knight,Pawn,Queen,Rook;Pawn=require("./pawn"),King=require("./king"),Rook=require("./rook"),Knight=require("./knight"),Bishop=require("./bishop"),Queen=require("./queen"),Const={PAWN:1,KNIGHT:2,KING:3,BISHOP:5,ROOK:6,QUEEN:7,WHITE:1,BLACK:-1},Factory=function(){function Factory(){}return Factory.prototype._instanceArr=[null,Pawn,Knight,King,null,Bishop,Rook,Queen],Factory.prototype._pieceMap={r:Const.BLACK*Const.ROOK,n:Const.BLACK*Const.KNIGHT,b:Const.BLACK*Const.BISHOP,q:Const.BLACK*Const.QUEEN,k:Const.BLACK*Const.KING,p:Const.BLACK*Const.PAWN,R:Const.WHITE*Const.ROOK,N:Const.WHITE*Const.KNIGHT,B:Const.WHITE*Const.BISHOP,Q:Const.WHITE*Const.QUEEN,K:Const.WHITE*Const.KING,P:Const.WHITE*Const.PAWN},Factory.prototype.create=function(charCode,pos,board){var Inst,color,numCode;if(numCode=this._pieceMap[charCode],color=numCode>0?Const.WHITE:Const.BLACK,Inst=this._instanceArr[Math.abs(numCode)])return new Inst(pos,color,board);throw new Error("Unable to create piece "+charCode)},Factory}(),module.exports=Factory;var Board,Factory,Fen,_;_=require("underscore"),Fen=require("./fen"),Factory=require("./piece_factory"),Board=function(){function Board(fen){var _this=this;this._state={},this._fen=new Fen(fen),this._board=new Array(128),this.factory=new Factory,_.each(this._fen.pieces,function(piece,pos){var idx;return idx=_this._posToIdx(pos),_this._board[idx]=_this.factory.create(piece,idx,_this)}),this._calculate()}return Board.prototype.WHITE=1,Board.prototype.BLACK=-1,Board.prototype._state="move",Board.prototype._files="abcdefgh",Board.prototype.eventHandlers=[],Board.prototype.move=function(from,to){var source,toIdx;if(source=this._getPiece(from),this._verifyMove(source),toIdx=this._posToIdx(to),this._verifyIndex(source,toIdx),this._state={},!source.canCapture(toIdx)&&!source.canMoveTo(toIdx))throw new Error("unable to move from "+from+" to "+to);return source.is("PAWN")&&(9>toIdx||toIdx>111)?this._promotePawn(from,to,source,toIdx):(this._fen.enPassant===to&&this._moveEnPassant(to,from),this._updateArray(from,to),this._fen.move(from,to)),this._fen.halfmove>=50?this._state.finished="halfmoves":this._calculate(),this._state.to=to,this._state.from=from,this._fireEvent(),this._state},Board.prototype._verifyMove=function(source){if(!source)throw new Error("there is no piece to move");if(this._getCurrentColor()!==source.color)throw new Error("cannot move out of order")},Board.prototype._verifyIndex=function(source,toIdx){if(-1===source.moves.indexOf(toIdx))throw new Error("there is no piece at "+this._idxToPos(toIdx)+": "+this._fen.toString())},Board.prototype._promotePawn=function(from,to,source,toIdx){var fidx,pieceType;return this._fen.move(from,to),fidx=this._posToIdx(from),this._board[fidx]=null,pieceType=1===source.color?"Q":"q",this._board[toIdx]=this.factory.create(pieceType,toIdx,this),this._state.promotion=pieceType},Board.prototype._moveEnPassant=function(to,from){return this._state.enPassantCapture=to[0]+from[1]},Board.prototype._fireEvent=function(){var fn,_i,_len,_ref,_results;for(_ref=this.eventHandlers,_results=[],_i=0,_len=_ref.length;_len>_i;_i++)fn=_ref[_i],_results.push(fn(this._state));return _results},Board.prototype.onMove=function(f){return this.eventHandlers.push(f),f(this.getState())},Board.prototype.getState=function(){return this._state},Board.prototype._calculateValidMoves=function(){var m,_this=this;return m={},_.each(this._getPieces(this._getCurrentColor()),function(p){var moves;return p.moves.length>0?(moves=_.map(p.moves,function(move){return _this._idxToPos(move)}),m[_this._idxToPos(p.idx)]=moves):void 0}),m},Board.prototype._posToIdx=function(pos){var c;if(!pos||"string"!=typeof pos||!pos.match(/[a-h]{1}[0-8]{1}/))throw new Error("illegal pos "+pos);return c=this._files.indexOf(pos[0]),c+16*(pos[1]-1)},Board.prototype._idxToPos=function(idx){var file,pos,rank;if(file=idx%16,rank=Math.floor(idx/16),pos=this._files[file]+(rank+1),"string"!=typeof pos)throw new Error("illegal idx "+idx);return pos},Board.prototype._getPieceAt=function(idx){return this._board[idx]},Board.prototype._getPieces=function(color){return _.filter(this._board,function(p){return color?p&&p.color===color:p})},Board.prototype._getPiece=function(pos){var idx;return idx=this._posToIdx(pos),this._getPieceAt(idx)},Board.prototype._getCurrentColor=function(){return"w"===this._fen.activeColor?this.WHITE:this.BLACK},Board.prototype._calculate=function(){var attacked,currentColor,moves,_this=this;return currentColor=this._getCurrentColor(),moves=[],attacked=[],_.each(this._getPieces(-1*currentColor),function(p){return p.calculate(),attacked=_.union(attacked,p.attacks)}),_.each(this._getPieces(currentColor),function(p){return p.calculate(),moves=moves.concat(p.moves),3===p.type&&-1!==attacked.indexOf(p.idx)?_this._state.check=!0:void 0}),0===moves.length&&(this._state.finished=this._state.check?"checkmate":"stalemate"),this._state.board=this._fen.pieces,this._state.active_color=this._fen.activeColor,this._state.valid_moves=this._calculateValidMoves(),this._state},Board.prototype._updateArray=function(from,to){var fidx,fromPiece,tidx;return fidx=this._posToIdx(from),fromPiece=this._board[fidx],this._board[fidx]=null,tidx=this._posToIdx(to),fromPiece.idx=tidx,this._board[tidx]=fromPiece,this._updateCastling(from,to)},Board.prototype._updateCastling=function(from,to){switch(from){case"e1":if("g1"===to&&_.contains(this._fen.castling,"K"))return this._board[this._posToIdx("f1")]=this._board[this._posToIdx("h1")],this._board[this._posToIdx("f1")].idx=this._posToIdx("f1"),this._board[this._posToIdx("h1")]=null;if("c1"===to&&_.contains(this._fen.castling,"Q"))return this._board[this._posToIdx("d1")]=this._board[this._posToIdx("a1")],this._board[this._posToIdx("d1")].idx=this._posToIdx("d1"),this._board[this._posToIdx("a1")]=null;break;case"e8":if("g8"===to&&_.contains(this._fen.castling,"k"))return this._board[this._posToIdx("f8")]=this._board[this._posToIdx("h8")],this._board[this._posToIdx("f8")].idx=this._posToIdx("f8"),this._board[this._posToIdx("h8")]=null;if("c8"===to&&_.contains(this._fen.castling,"q"))return this._board[this._posToIdx("d8")]=this._board[this._posToIdx("a8")],this._board[this._posToIdx("d8")].idx=this._posToIdx("d8"),this._board[this._posToIdx("a8")]=null}},Board.prototype.getCheckingPieces=function(){var currentColor,pieces;return currentColor=this._getCurrentColor(),pieces=this._getPieces(-1*currentColor),_.filter(pieces,function(piece){return piece.checks&&piece.checks.length>0})},Board.prototype.isPinned=function(idx){var currentColor,pieces,pinningPiece;return currentColor=this._getCurrentColor(),pieces=this._getPieces(-1*currentColor),pinningPiece=_.detect(pieces,function(p){return p.pinning&&p.pinning[idx]}),pinningPiece?_(pinningPiece.pinning[idx]).chain().clone().without(idx).union(pinningPiece.idx).value():void 0},Board.prototype.isAttacked=function(idx){var currentColor;return currentColor=this._getCurrentColor(),_.detect(this._getPieces(-1*currentColor),function(p){var _ref;return-1!==(null!=(_ref=p.attacks)?_ref.indexOf(idx):void 0)})},Board.prototype.isProtected=function(idx){var currentColor;return currentColor=this._getCurrentColor(),_.detect(this._getPieces(-1*currentColor),function(p){return-1!==p.moves.indexOf(idx)||-1!==p.attacks.indexOf(idx)})},Board.prototype.isEmpty=function(idx){return!this._getPieceAt(idx)},Board.prototype.isOnBoard=function(idx){return idx>=0&&127>idx&&0===(136&idx)},Board.prototype.canCastle=function(code){return this._fen.canCastle(code)},Board.prototype.isEnPassant=function(idx){var ep,epIdx;return ep=this._fen.enPassant,ep&&"-"!==ep?(epIdx=this._posToIdx(ep),idx===epIdx):!1},Board.prototype.getMoves=function(pos){var idx,piece,_this=this;return idx=this._posToIdx(pos),piece=this._getPieceAt(idx),piece&&piece.color===this._getCurrentColor()?_.map(piece.moves,function(idx){return _this._idxToPos(idx)}):[]},Board.prototype.toString=function(){return this._fen.toString()},Board}(),module.exports=Board,this.Rex={Fen:Fen,Board:Board};}).call(this);