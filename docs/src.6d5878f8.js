parcelRequire = (function(e, r, n, t) {
  var i = "function" == typeof parcelRequire && parcelRequire,
    o = "function" == typeof require && require;
  function u(n, t) {
    if (!r[n]) {
      if (!e[n]) {
        var f = "function" == typeof parcelRequire && parcelRequire;
        if (!t && f) return f(n, !0);
        if (i) return i(n, !0);
        if (o && "string" == typeof n) return o(n);
        var c = new Error("Cannot find module '" + n + "'");
        throw ((c.code = "MODULE_NOT_FOUND"), c);
      }
      (p.resolve = function(r) {
        return e[n][1][r] || r;
      }),
        (p.cache = {});
      var l = (r[n] = new u.Module(n));
      e[n][0].call(l.exports, p, l, l.exports, this);
    }
    return r[n].exports;
    function p(e) {
      return u(p.resolve(e));
    }
  }
  (u.isParcelRequire = !0),
    (u.Module = function(e) {
      (this.id = e), (this.bundle = u), (this.exports = {});
    }),
    (u.modules = e),
    (u.cache = r),
    (u.parent = i),
    (u.register = function(r, n) {
      e[r] = [
        function(e, r) {
          r.exports = n;
        },
        {}
      ];
    });
  for (var f = 0; f < n.length; f++) u(n[f]);
  if (n.length) {
    var c = u(n[n.length - 1]);
    "object" == typeof exports && "undefined" != typeof module
      ? (module.exports = c)
      : "function" == typeof define && define.amd
      ? define(function() {
          return c;
        })
      : t && (this[t] = c);
  }
  return u;
})(
  {
    kK4J: [
      function(require, module, exports) {
        "use strict";
        var e, t, n, r;
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (function(e) {
            (e[(e.pawn = 0)] = "pawn"),
              (e[(e.rock = 1)] = "rock"),
              (e[(e.knight = 2)] = "knight"),
              (e[(e.bishop = 3)] = "bishop"),
              (e[(e.queen = 4)] = "queen"),
              (e[(e.king = 5)] = "king");
          })((e = exports.PieceType || (exports.PieceType = {}))),
          (function(e) {
            (e[(e.alone = 0)] = "alone"),
              (e[(e.dancing = 1)] = "dancing"),
              (e[(e.takingOver = 2)] = "takingOver"),
              (e[(e.leavingUnion = 3)] = "leavingUnion");
          })((t = exports.PieceState || (exports.PieceState = {}))),
          (function(e) {
            (e[(e.white = 0)] = "white"), (e[(e.black = 1)] = "black");
          })((n = exports.PlayerColor || (exports.PlayerColor = {}))),
          (function(e) {
            (e[(e.white = 0)] = "white"), (e[(e.black = 1)] = "black");
          })((r = exports.TileColor || (exports.TileColor = {})));
        var i = (function() {
          function e(e, t) {
            if (((this.x = e), (this.y = t), e < 0 || 7 < e || t < 0 || 7 < t))
              throw new Error("Can't initialize Position with x=${x}, y=${y}.");
          }
          return (
            (e.prototype.equals = function(e) {
              return this.x == e.x && this.y == e.y;
            }),
            Object.defineProperty(e.prototype, "isEven", {
              get: function() {
                return (this.x + this.y) % 2 == 0;
              },
              enumerable: !0,
              configurable: !0
            }),
            e
          );
        })();
        exports.Position = i;
        var o = (function() {
          function e(e, t) {
            (this.x = e), (this.y = t);
          }
          return (
            Object.defineProperty(e, "zero", {
              get: function() {
                return new e(0, 0);
              },
              enumerable: !0,
              configurable: !0
            }),
            (e.x = function(t) {
              return new e(t, 0);
            }),
            (e.y = function(t) {
              return new e(0, t);
            }),
            (e.prototype.add = function(t) {
              return new e(this.x + t.x, this.y + t.y);
            }),
            e
          );
        })();
        function s(e) {
          return "abcdefgh"[e.x] + e.y;
        }
        (exports.Vector = o), (exports.chessPosition = s);
        var u = (function() {
          function e(e) {
            this.values = new Array(8);
            for (var t = 0; t < 8; t++) {
              this.values[t] = new Array(8);
              for (var n = 0; n < 8; n++) this.values[t][n] = e(new i(t, n));
            }
          }
          return (
            (e.prototype.get = function(e) {
              return this.values[e.x][e.y];
            }),
            (e.prototype.set = function(e, t) {
              this.values[e.x][e.y] = t;
            }),
            (e.prototype.forEach = function(e) {
              for (var t = 0; t < 8; t++)
                for (var n = 0; n < 8; n++)
                  e(new i(t, n), this.get(new i(t, n)), this);
            }),
            e
          );
        })();
        exports.BoardMap = u;
        var a = (function() {
          function e(e) {
            (this._value = e), (this.subscribers = new Array());
          }
          return (
            Object.defineProperty(e.prototype, "value", {
              get: function() {
                return this._value;
              },
              set: function(e) {
                (this._value = e),
                  this.subscribers.forEach(function(t) {
                    t(e);
                  });
              },
              enumerable: !0,
              configurable: !0
            }),
            (e.prototype.subscribe = function(e) {
              this.subscribers.push(e);
            }),
            e
          );
        })();
        exports.Observable = a;
      },
      {}
    ],
    WM8l: [
      function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 });
        var e = require("./basicTypes"),
          t = (function() {
            function t(t, i, o) {
              (this.color = i),
                (this.stateObs = new e.Observable(e.PieceState.alone)),
                (this.positionObs = new e.Observable(o)),
                (this._type = t);
            }
            return (
              Object.defineProperty(t.prototype, "type", {
                get: function() {
                  return this._type;
                },
                enumerable: !0,
                configurable: !0
              }),
              Object.defineProperty(t.prototype, "position", {
                get: function() {
                  return this.positionObs.value;
                },
                set: function(e) {
                  this.positionObs.value = e;
                },
                enumerable: !0,
                configurable: !0
              }),
              Object.defineProperty(t.prototype, "state", {
                get: function() {
                  return this.stateObs.value;
                },
                set: function(e) {
                  this.stateObs.value = e;
                },
                enumerable: !0,
                configurable: !0
              }),
              (t.prototype.promote = function() {
                if (this._type != e.PieceType.pawn)
                  throw new Error("Only pawns can be promoted.");
                if (this.color == e.PlayerColor.black && 0 != this.position.y)
                  throw new Error("Black pawns may only be promoted in row 0.");
                if (this.color == e.PlayerColor.white && 7 != this.position.y)
                  throw new Error("White pawns may only be promoted in row 7");
                this._type = e.PieceType.queen;
              }),
              t
            );
          })();
        exports.ChessPiece = t;
        var i = (function() {
          function t(t) {
            if (2 != t.length)
              throw new Error(
                "A Pair has exactly two members. Recieved: " + t.length
              );
            var i = t.find(function(t) {
                return t.color == e.PlayerColor.white;
              }),
              o = t.find(function(t) {
                return t.color == e.PlayerColor.black;
              });
            if (null == i)
              throw new Error("You did not supply a white piece to the pair.");
            if (null == o)
              throw new Error("You did not supply a black piece to the pair.");
            (this.white = i), (this.black = o), this.assertIntegrity();
          }
          return (
            (t.prototype.assertIntegrity = function() {
              if (!this.white.position.equals(this.black.position))
                throw new Error("Pieces of a pair must share a Position.");
            }),
            Object.defineProperty(t.prototype, "position", {
              get: function() {
                return this.assertIntegrity(), this.white.position;
              },
              set: function(e) {
                (this.white.position = e), (this.black.position = e);
              },
              enumerable: !0,
              configurable: !0
            }),
            (t.prototype.ofColor = function(t) {
              return t == e.PlayerColor.white ? this.white : this.black;
            }),
            t
          );
        })();
        exports.ChessPair = i;
        var o = (function() {
          function o() {
            (this.pieces = r()), (this.chaining = null);
          }
          return (
            (o.prototype.select = function(e) {
              return null == this.at(e) ? null : new Array(e);
            }),
            (o.prototype.move = function(o, n) {
              var r = this.select(o);
              if (
                (null == r ||
                  r.every(function(e) {
                    return !e.equals(n);
                  }),
                null != this.chaining)
              ) {
                if (!this.chaining.position.equals(o))
                  throw new Error(
                    "A chain is active, move the chaining piece."
                  );
                this.singleMove(this.chaining, n),
                  this._at(o).forEach(function(t) {
                    return (t.state = e.PieceState.dancing);
                  });
              } else {
                var s = this.at(o);
                if (s instanceof t) this.singleMove(s, n);
                else {
                  if (!(s instanceof i))
                    throw new Error("There is no piece at the start position!");
                  this.pairMove(s, n);
                }
              }
            }),
            (o.prototype.pairMove = function(e, t) {
              if (null != this.at(t))
                throw new Error("Pairs may only be moved onto empty squares.");
              e.position = t;
            }),
            (o.prototype.singleMove = function(i, o) {
              var n = this.at(o);
              if (null == n)
                (i.position = o),
                  (i.state = e.PieceState.alone),
                  (this.chaining = null);
              else if (n instanceof t) {
                if (i.color == n.color)
                  throw new Error(
                    "Can't form a union from pieces with the same color."
                  );
                (i.position = o),
                  (i.state = e.PieceState.dancing),
                  (n.state = e.PieceState.dancing),
                  (this.chaining = null);
              } else
                (i.position = o),
                  (i.state = e.PieceState.takingOver),
                  (this.chaining = n.ofColor(i.color)),
                  (this.chaining.state = e.PieceState.leavingUnion);
            }),
            (o.prototype._at = function(e) {
              var t = this;
              return this.pieces.filter(function(i) {
                return i.position.equals(e) && i != t.chaining;
              });
            }),
            (o.prototype.at = function(e) {
              var t = this._at(e);
              switch (t.length) {
                case 0:
                  return null;
                case 1:
                  return t[0];
                case 2:
                  return new i(t);
                case 3:
                  throw new Error(
                    "Selecting a tile with three pieces is not implemented."
                  );
                default:
                  throw new Error(
                    "There are more than 3 pieces on the same tile. This is forbidden."
                  );
              }
            }),
            Object.defineProperty(o.prototype, "chainingPiece", {
              get: function() {
                return this.chaining;
              },
              enumerable: !0,
              configurable: !0
            }),
            o
          );
        })();
        exports.PacoBoard = o;
        var n = [
          e.PieceType.rock,
          e.PieceType.knight,
          e.PieceType.bishop,
          e.PieceType.queen,
          e.PieceType.king,
          e.PieceType.bishop,
          e.PieceType.knight,
          e.PieceType.rock
        ];
        function r() {
          for (var i = new Array(32), o = 0; o < 8; o++) {
            var r = new e.Position(o, 1),
              s = new e.Position(o, 0),
              a = new e.Position(o, 6),
              c = new e.Position(o, 7);
            (i[o] = new t(e.PieceType.pawn, e.PlayerColor.white, r)),
              (i[8 + o] = new t(n[o], e.PlayerColor.white, s)),
              (i[16 + o] = new t(e.PieceType.pawn, e.PlayerColor.black, a)),
              (i[24 + o] = new t(n[o], e.PlayerColor.black, c));
          }
          return i;
        }
      },
      { "./basicTypes": "kK4J" }
    ],
    "+CLV": [
      function(require, module, exports) {
        module.exports = "pawn-w.a61919ce.png";
      },
      {}
    ],
    GbcF: [
      function(require, module, exports) {
        module.exports = "rock-w.015d4766.png";
      },
      {}
    ],
    "+w/F": [
      function(require, module, exports) {
        module.exports = "knight-w.6f736647.png";
      },
      {}
    ],
    qTFf: [
      function(require, module, exports) {
        module.exports = "bishop-w.382fcd4d.png";
      },
      {}
    ],
    MOO4: [
      function(require, module, exports) {
        module.exports = "queen-w.33828565.png";
      },
      {}
    ],
    Yc40: [
      function(require, module, exports) {
        module.exports = "king-w.a4f3122b.png";
      },
      {}
    ],
    "0zfH": [
      function(require, module, exports) {
        module.exports = "pawn-b.1b92f129.png";
      },
      {}
    ],
    toLl: [
      function(require, module, exports) {
        module.exports = "rock-b.fa55503b.png";
      },
      {}
    ],
    wEpy: [
      function(require, module, exports) {
        module.exports = "knight-b.814b8b65.png";
      },
      {}
    ],
    PRPF: [
      function(require, module, exports) {
        module.exports = "bishop-b.656d9b3e.png";
      },
      {}
    ],
    Xs8S: [
      function(require, module, exports) {
        module.exports = "queen-b.e0dcbb15.png";
      },
      {}
    ],
    J1hN: [
      function(require, module, exports) {
        module.exports = "king-b.493c6dad.png";
      },
      {}
    ],
    "7QCb": [
      function(require, module, exports) {
        "use strict";
        var e =
          (this && this.__extends) ||
          (function() {
            var e = function(t, i) {
              return (e =
                Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array &&
                  function(e, t) {
                    e.__proto__ = t;
                  }) ||
                function(e, t) {
                  for (var i in t) t.hasOwnProperty(i) && (e[i] = t[i]);
                })(t, i);
            };
            return function(t, i) {
              function r() {
                this.constructor = t;
              }
              e(t, i),
                (t.prototype =
                  null === i
                    ? Object.create(i)
                    : ((r.prototype = i.prototype), new r()));
            };
          })();
        Object.defineProperty(exports, "__esModule", { value: !0 });
        var t = require("./basicTypes"),
          i = require("./paco"),
          r = require("../assets/pawn-w.png"),
          n = require("../assets/rock-w.png"),
          o = require("../assets/knight-w.png"),
          s = require("../assets/bishop-w.png"),
          c = require("../assets/queen-w.png"),
          a = require("../assets/king-w.png"),
          l = require("../assets/pawn-b.png"),
          u = require("../assets/rock-b.png"),
          p = require("../assets/knight-b.png"),
          h = require("../assets/bishop-b.png"),
          g = require("../assets/queen-b.png"),
          d = require("../assets/king-b.png"),
          f = document.getElementById("output");
        function y(e) {
          var t = document.createElement("p");
          (t.innerHTML = e), f && f.appendChild(t);
        }
        f && (f.innerHTML = "");
        var P = 4491332,
          I = 13434828,
          m = 11184742,
          w = 14540236,
          v = document.getElementById("pixi"),
          b = new PIXI.Application(900, 900, { backgroundColor: I });
        function C() {
          var e = new PIXI.Graphics();
          return e.lineStyle(), e.beginFill(0), e.drawRect(45, 45, 810, 810), e;
        }
        v && ((v.innerHTML = ""), v.appendChild(b.view));
        var T = (function(i) {
            function r(e, r) {
              var n = i.call(this) || this;
              (n.tilePosition = e),
                (n.board = r),
                (n.highlight = !1),
                n.tilePosition.isEven
                  ? (n.tileColor = t.TileColor.black)
                  : (n.tileColor = t.TileColor.white),
                n.determineTint(),
                n.lineStyle(),
                n.beginFill(16777215),
                n.drawRect(0, 0, 100, 100);
              var o = X(e);
              return (
                (n.x = o.x),
                (n.y = o.y),
                n.on("click", function() {
                  return r.onClick(n.tilePosition);
                }),
                (n.interactive = !0),
                (n.interactiveChildren = !1),
                (n.hitArea = new PIXI.Rectangle(0, 0, 100, 100)),
                n
              );
            }
            return (
              e(r, i),
              (r.prototype.determineTint = function() {
                this.highlight
                  ? this.tileColor == t.TileColor.black
                    ? (this.tint = m)
                    : (this.tint = w)
                  : this.tileColor == t.TileColor.white
                  ? (this.tint = I)
                  : (this.tint = P);
              }),
              (r.prototype.clearHighlight = function() {
                (this.highlight = !1), this.determineTint();
              }),
              (r.prototype.setHighlight = function() {
                (this.highlight = !0), this.determineTint();
              }),
              r
            );
          })(PIXI.Graphics),
          S = (function(r) {
            function n() {
              var e = r.call(this) || this;
              return (
                (e._selection = null),
                (e.pacoBoard = new i.PacoBoard()),
                (e.pieces = e.createPieces()),
                (e.tiles = new t.BoardMap(function(t) {
                  return new T(t, e);
                })),
                e.tiles.forEach(function(t, i) {
                  return e.addChild(i);
                }),
                e.pieces.forEach(function(t) {
                  return e.addChild(t.sprite);
                }),
                e.on("mousedown", function() {
                  return console.log("testing");
                }),
                e
              );
            }
            return (
              e(n, r),
              (n.prototype.createPieces = function() {
                return new Map(
                  this.pacoBoard.pieces.map(function(e) {
                    return [e, new q(e)];
                  })
                );
              }),
              (n.prototype.getVisual = function(e) {
                var t = this.pieces.get(e);
                if (null != t) return t;
                throw new Error("Chess Piece is not on Board.");
              }),
              (n.prototype.onClick = function(e) {
                null == this.selection
                  ? this.onBeginSelection(e)
                  : (this.onCommandMove(this.selection, e),
                    null != this.pacoBoard.chainingPiece
                      ? (this.selection = this.pacoBoard.chainingPiece.position)
                      : (this.selection = null));
              }),
              (n.prototype.onCommandMove = function(e, t) {
                try {
                  this.pacoBoard.move(e, t);
                } catch (i) {
                  y("Error while moving: " + i);
                }
              }),
              (n.prototype.onBeginSelection = function(e) {
                var t = this.pacoBoard.select(e);
                null != t && t.length > 0 && (this.selection = e);
              }),
              Object.defineProperty(n.prototype, "selection", {
                get: function() {
                  return this._selection;
                },
                set: function(e) {
                  null != this._selection &&
                    this.tiles.get(this._selection).clearHighlight(),
                    (this._selection = e),
                    null != e && this.tiles.get(e).setHighlight();
                },
                enumerable: !0,
                configurable: !0
              }),
              n
            );
          })(PIXI.Container);
        function k(e) {
          if (e.color == t.PlayerColor.white)
            switch (e.type) {
              case t.PieceType.pawn:
                return PIXI.Sprite.fromImage(r, void 0, 1);
              case t.PieceType.rock:
                return PIXI.Sprite.fromImage(n, void 0, 1);
              case t.PieceType.knight:
                return PIXI.Sprite.fromImage(o, void 0, 1);
              case t.PieceType.bishop:
                return PIXI.Sprite.fromImage(s, void 0, 1);
              case t.PieceType.queen:
                return PIXI.Sprite.fromImage(c, void 0, 1);
              case t.PieceType.king:
                return PIXI.Sprite.fromImage(a, void 0, 1);
              default:
                return e.type;
            }
          else
            switch (e.type) {
              case t.PieceType.pawn:
                return PIXI.Sprite.fromImage(l, void 0, 1);
              case t.PieceType.rock:
                return PIXI.Sprite.fromImage(u, void 0, 1);
              case t.PieceType.knight:
                return PIXI.Sprite.fromImage(p, void 0, 1);
              case t.PieceType.bishop:
                return PIXI.Sprite.fromImage(h, void 0, 1);
              case t.PieceType.queen:
                return PIXI.Sprite.fromImage(g, void 0, 1);
              case t.PieceType.king:
                return PIXI.Sprite.fromImage(d, void 0, 1);
              default:
                return e.type;
            }
        }
        var q = (function() {
          function e(e) {
            var t = this;
            (this.data = e),
              (this.sprite = k(e)),
              e.positionObs.subscribe(function(e) {
                return t.recalculatePosition();
              }),
              e.stateObs.subscribe(function(e) {
                return t.recalculatePosition();
              }),
              this.recalculatePosition();
          }
          return (
            Object.defineProperty(e.prototype, "color", {
              get: function() {
                return this.data.color;
              },
              enumerable: !0,
              configurable: !0
            }),
            Object.defineProperty(e.prototype, "offset", {
              get: function() {
                return this.data.state == t.PieceState.alone
                  ? t.Vector.zero
                  : this.data.state == t.PieceState.dancing
                  ? this.color == t.PlayerColor.white
                    ? t.Vector.x(20)
                    : t.Vector.x(-20)
                  : this.data.state == t.PieceState.takingOver
                  ? this.color == t.PlayerColor.white
                    ? new t.Vector(10, 10)
                    : new t.Vector(-10, 10)
                  : this.data.state == t.PieceState.leavingUnion
                  ? this.color == t.PlayerColor.white
                    ? new t.Vector(30, -10)
                    : new t.Vector(-30, -10)
                  : t.Vector.zero;
              },
              enumerable: !0,
              configurable: !0
            }),
            (e.prototype.recalculatePosition = function() {
              var e = X(this.data.position).add(this.offset);
              (this.sprite.x = e.x), (this.sprite.y = e.y);
            }),
            (e.prototype.isAt = function(e) {
              return this.data.position.x == e.x && this.data.position.y == e.y;
            }),
            e
          );
        })();
        function X(e) {
          return new t.Vector(100 * e.x, 700 - 100 * e.y);
        }
        b.stage.addChild(C());
        var _ = new S();
        (_.x = 50), (_.y = 50), b.stage.addChild(_);
      },
      {
        "./basicTypes": "kK4J",
        "./paco": "WM8l",
        "../assets/pawn-w.png": "+CLV",
        "../assets/rock-w.png": "GbcF",
        "../assets/knight-w.png": "+w/F",
        "../assets/bishop-w.png": "qTFf",
        "../assets/queen-w.png": "MOO4",
        "../assets/king-w.png": "Yc40",
        "../assets/pawn-b.png": "0zfH",
        "../assets/rock-b.png": "toLl",
        "../assets/knight-b.png": "wEpy",
        "../assets/bishop-b.png": "PRPF",
        "../assets/queen-b.png": "Xs8S",
        "../assets/king-b.png": "J1hN"
      }
    ]
  },
  {},
  ["7QCb"],
  null
);
//# sourceMappingURL=/src.b2f0c3be.map