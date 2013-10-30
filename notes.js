to: <pos>
from: <pos>
check: t/f
valid_moves: {}
active_color: w/b
finished: 'checkmate', 'stalemate', 'halfmoves'

board: {
  "a1": {
    "p":                           # the piece code
x    "piece": '♖'                   # the ascii piece
x    "selected": t/f                # is the piece currently selected?
    "last_source": t/f             # source of last move
    "last_target": t/f             # target of last move
x    "legal_target": t/f            # is this a legal dst move?
x    "legal_source": t/f            # is this a legar src move?

    "mate": t/f
    "check": t/f
    "stalemate": t/f
  }
}
