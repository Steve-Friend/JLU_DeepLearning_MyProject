var _createClass = function ()
 { function defineProperties(target, props)
  { for (var i = 0; i < props.length; i++)
  { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ChessBoard = function (_React$Component)
 {
	_inherits(ChessBoard, _React$Component);


	function ChessBoard(props)
	{
		_classCallCheck(this, ChessBoard);

		var _this = _possibleConstructorReturn(this, (ChessBoard.__proto__ || Object.getPrototypeOf(ChessBoard)).call(this, props));

		_this.state = { pieces: [["R", "N", "B", "Q", "K", "B", "N", "R"], ["P", "P", "P", "P", "P", "P", "P", "P"], ["1", "1", "1", "1", "1", "1", "1", "1"], ["1", "1", "1", "1", "1", "1", "1", "1"], ["1", "1", "1", "1", "1", "1", "1", "1"], ["1", "1", "1", "1", "1", "1", "1", "1"], ["p", "p", "p", "p", "p", "p", "p", "p"], ["r", "n", "b", "q", "k", "b", "n", "r"]], selected: null, turn: "w" };
		return _this;
	}

	_createClass(ChessBoard,
	[
	{
		key: "castleCheck",
		value: function castleCheck(pieces, fromRank, fromFile, toRank, toFile) {
			return (pieces[fromRank][fromFile] == 'k' || pieces[fromRank][fromFile] == 'K') && (toFile - fromFile) % 2 == 0;
		}
	},
	{
        key: "isPathClear",
        value: function isPathClear(start, end, pieces) {
            const [startX, startY] = start;
            console.log("startchess:" + pieces[startX][startY]);
            const [endX, endY] = end;

            // 计算 x 和 y 方向上的变化量
            const deltaX = endX === startX ? 0 : (endX > startX ? 1 : -1); // 处理水平或垂直方向
            const deltaY = endY === startY ? 0 : (endY > startY ? 1 : -1); // 处理水平或垂直方向

            let x = startX + deltaX;
            let y = startY + deltaY;
            console.log("Piece:" + pieces[x][y]);

            while ( (x !== endX && y !== endY) || (x === endX && y !== endY) || (x !== endX && y === endY)) {
                const targetPiece = pieces[x][y]; // 获取目标位置的棋子

                // 如果目标位置不为空且是己方棋子，返回 false
                if (targetPiece !== "1" &&
                    ((targetPiece === targetPiece.toUpperCase() && pieces[startX][startY] === pieces[startX][startY].toUpperCase()) ||
                     (targetPiece === targetPiece.toLowerCase() && pieces[startX][startY] === pieces[startX][startY].toLowerCase()))) {
                    return false; // 有己方棋子，不能通过
                }


                x += deltaX;
                y += deltaY;
            }

            const targetPiece2 = pieces[x][y];
                        console.log("startX:" + startX + " startY:" + startY + " endX:" + endX + " endY:" + endY + " deltaX:" + deltaX + " deltaY:" + deltaY + "x:" + x + "y:" + y
                        + "targetPiece2:" + targetPiece2 + "startPiece:" + pieces[startX][startY]);
            // 如果目标位置不为空且是己方棋子，返回 false
            if (targetPiece2 !== "1" &&
                ((targetPiece2 === targetPiece2.toUpperCase() && pieces[startX][startY] === pieces[startX][startY].toUpperCase()) ||
                 (targetPiece2 === targetPiece2.toLowerCase() && pieces[startX][startY] === pieces[startX][startY].toLowerCase()))) {

                return false; // 有己方棋子，不能通过
            }

            console.log("路径畅通")
            return true; // 路径畅通
        }

	},
    {
        key: "checkMoveValidity",
        value: function checkMoveValidity(start, end, pieces) {
            const [startX, startY] = start; // 起始位置
            const [endX, endY] = end; // 目标位置
            const piece = pieces[startX][startY]; // 获取起始位置的棋子

            // 检查目标位置是否在棋盘范围内
            if (endX < 0 || endX > 7 || endY < 0 || endY > 7) {
                console.log("超出棋盘")
                return { valid: false }; // 超出棋盘范围
            }

            // 检查是否尝试移动自己的棋子
            const targetPiece = pieces[endX][endY];
            console.log("这里肯定是进来了");
            console.log(startX, startY, endX, endY);
            console.log(pieces);
            console.log("piece:" + piece + "  targetPiece:" + targetPiece);
            if (piece === targetPiece) {
                console.log("不能吃自己")
                return { valid: false }; // 不能吃自己的棋子
            }

            // 检查棋子的移动规则
            switch (piece.toLowerCase()) {
                case 'p': // 兵
                    console.log("到兵?");

                    const direction = piece === 'p' ? -1 : 1; // 黑兵向上（-1），白兵向下（1）
                    const startRank = piece === 'p' ? 6 : 1; // 黑兵初始位置是第 6 排，白兵初始位置是第 1 排
                    const opponentPawnRank = piece === 'p' ? 4 : 3; // 黑兵的过路兵判定排是第 4 排，白兵是第 3 排
//                    if(startX === 1 && startY === 0)
//                    {
//                        return { valid: true, promotion: true };
//                    }

                    // 处理兵的直线移动
                    if (startY === endY) {
                        // 检查是否为第一次移动
                        if (startX === startRank) {
                            // 第一次移动可以走 1 格或 2 格
                            if (endX === startX + direction || endX === startX + 2 * direction) {
                                // 使用 isPathClear 判断路径是否畅通
                                if (this.isPathClear([startX, startY], [endX, endY], pieces)) {
                                    // 检查是否达到升变行
                                    if ((piece === 'p' && endX === 0) || (piece === 'P' && endX === 7)) {
                                        return { valid: true, promotion: true }; // 返回升变标记
                                    }
                                    return { valid: true }; // 正常移动
                                }
                            }
                        } else {
                            // 非第一次移动，只能走 1 格
                            if (endX === startX + direction) {
                                if (this.isPathClear([startX, startY], [endX, endY], pieces)) {
                                    // 检查是否达到升变行
                                    if ((piece === 'p' && endX === 0) || (piece === 'P' && endX === 7)) {
                                        return { valid: true, promotion: true }; // 返回升变标记
                                    }
                                    return { valid: true }; // 正常移动
                                }
                            }
                        }
                    }

                    // 处理兵的斜着吃棋
                    if (Math.abs(startY - endY) === 1 && endX === startX + direction) {
                        const targetPiece = pieces[endX][endY];

                        console.log("targetPiece:bing  " + targetPiece);
                        // 检查目标棋子是否为敌方棋子
                        const isEnemyPiece = (piece === 'p' && targetPiece === targetPiece.toUpperCase() && isNaN(targetPiece)) ||
                                             (piece === 'P' && targetPiece === targetPiece.toLowerCase() && isNaN(targetPiece));

                        if (isEnemyPiece) {
                            // 斜着吃敌方棋子，首先判断路径是否畅通
                            if (this.isPathClear([startX, startY], [endX, endY], pieces)) {
                                // 检查是否达到升变行
                                if ((piece === 'p' && endX === 0) || (piece === 'P' && endX === 7)) {
                                    return { valid: true, promotion: true }; // 返回升变标记
                                }
                                return { valid: true }; // 正常吃棋
                            }
                        }

//                        // 检查是否为过路兵
//                        if (startX === opponentPawnRank) {
//                            // 检查目标位置是否为空
//                            const targetPiece = pieces[endX][endY];
//                            const previousPawnX = piece === 'p' ? 6 : 1; // 对方兵的起始位置
//                            const previousPawnY = endY; // 当前列
//
//                            // 检查上一步棋步是否是对方兵刚刚移动两格
//                            const lastMove = this.getLastMove(); // 需要实现此函数以获取上一步的棋步记录
//                            if (lastMove && lastMove.piece.toLowerCase() === (piece === 'p' ? 'P' : 'p') &&
//                                lastMove.start[0] === previousPawnX && lastMove.end[0] === opponentPawnRank &&
//                                lastMove.end[1] === previousPawnY) {
//                                // 过路兵
//                                return { valid: true, promotion: false, enPassant: true }; // 执行过路兵
//                            }
//                        }
                    }

                    console.log("???");
                    return { valid: false }; // 如果没有满足的条件，返回无效移动





                case 'r': // 车
                    console.log("到车？")
                    if (startX === endX || startY === endY) {
                        // 检查路径是否被阻挡
                        return { valid: this.isPathClear(start, end, pieces)};
                    }
                    return { valid: false };

                case 'n': // 马
                    console.log("到马？");

                    // 检查马的L形移动是否符合规则
                    if ((Math.abs(startX - endX) === 2 && Math.abs(startY - endY) === 1) ||
                        (Math.abs(startX - endX) === 1 && Math.abs(startY - endY) === 2)) {

                        const targetPiece = pieces[endX][endY];

                        // 检查目标位置是否为空或是敌方棋子
                        const isEnemyPiece = (piece === piece.toLowerCase() && targetPiece === targetPiece.toUpperCase()) ||
                                             (piece === piece.toUpperCase() && targetPiece === targetPiece.toLowerCase());

                        if (targetPiece === "1" || isEnemyPiece) {
                            return { valid: true }; // 可以移动到空位或吃敌方棋子
                        }
                    }

                    return { valid: false }; // 不符合规则或目标位置是己方棋子


                case 'b': // 象
                    console.log("到象？")
                    if (Math.abs(startX - endX) === Math.abs(startY - endY)) {
                        return { valid: this.isPathClear(start, end, pieces)}; // 检查路径
                    }
                    return { valid: false };

                case 'q': // 后
                    console.log("到后？")
                    if (Math.abs(startX - endX) === Math.abs(startY - endY) ||
                        startX === endX || startY === endY) {
                        if(this.isPathClear(start, end, pieces))
                        {
                            console.log("?laile?")
                            return { valid: true}; // 检查路径
                        }
                    }
                    return { valid: false };

                case 'k': // 王
                    console.log("到王？")
                    if (Math.abs(startX - endX) <= 1 && Math.abs(startY - endY) <= 1) {
                        return { valid: this.isPathClear(start, end, pieces)}; // 王可以走到相邻的格子
                    }
                    return { valid: false };

                default:
                    console.log("你小子是不是到这了？")
                    return { valid: false }; // 非法棋子
            }
        }
    },

	 {
		key: "getMoveFromAPI",
		value: function getMoveFromAPI(pieces, turn) {
			var _this2 = this;

			var fen = pieces[7].join("") + "/" + pieces[6].join("") + "/" + pieces[5].join("") + "/" + pieces[4].join("") + "/" + pieces[3].join("") + "/" + pieces[2].join("") + "/" + pieces[1].join("") + "/" + pieces[0].join("") + " " + turn + " KQkq - 0 1";
			fen = fen.replace(/\d{2,}/g, function (m) {
				// get all digit combination, contains more than one digit
				return m.split('').reduce(function (sum, v) {
					// split into individual digit
					return sum + Number(v); // parse and add to sum
				}, 0); // set initial value as 0 (sum)
			});
			var data = new FormData();
			data.append('fen', fen);
			console.log("fen: " + fen);
            fetch('/AI', {
                method: 'POST',
                body: data
            }).then(function (r) {
                return r.text();
            }).then(function (r) {
                console.log("r: " + r);

                // Castling logic
                if (r == "e1g1" && pieces[0][4] == 'K' && pieces[0][7] == 'R') {
                    // White king-side castling
                    pieces[0][4] = '1';
                    pieces[0][5] = 'R';
                    pieces[0][6] = 'K';
                    pieces[0][7] = '1';
                } else if (r == "e1c1" && pieces[0][4] == 'K' && pieces[0][0] == 'R') {
                    // White queen-side castling
                    pieces[0][0] = '1';
                    pieces[0][2] = 'K';
                    pieces[0][3] = 'R';
                    pieces[0][4] = '1';
                } else if (r == "e8g8" && pieces[7][4] == 'k' && pieces[7][7] == 'r') {
                    // Black king-side castling
                    pieces[7][4] = '1';
                    pieces[7][5] = 'r';
                    pieces[7][6] = 'k';
                    pieces[7][7] = '1';
                } else if (r == "e8c8" && pieces[7][4] == 'k' && pieces[7][0] == 'r') {
                    // Black queen-side castling
                    pieces[7][0] = '1';
                    pieces[7][2] = 'k';
                    pieces[7][3] = 'r';
                    pieces[7][4] = '1';
                } else {
                    // Normal move logic
                    var file1 = r.charCodeAt(0) - 'a'.charCodeAt(0);
                    var rank1 = r.charCodeAt(1) - '1'.charCodeAt(0);
                    var file2 = r.charCodeAt(2) - 'a'.charCodeAt(0);
                    var rank2 = r.charCodeAt(3) - '1'.charCodeAt(0);

                    const movedPiece = pieces[rank1][file1];

                    // Pawn promotion logic
                    if (movedPiece === 'P' && rank2 === 7) {
                        // White pawn promotion
                        pieces[rank2][file2] = 'Q'; // Promote to queen
                    } else if (movedPiece === 'p' && rank2 === 0) {
                        // Black pawn promotion
                        pieces[rank2][file2] = 'q'; // Promote to queen
                    } else {
                        // Normal move
                        pieces[rank2][file2] = pieces[rank1][file1];
                    }

                    // Clear original position
                    pieces[rank1][file1] = "1";
                }

                // Update turn
                var newTurn = turn == "w" ? "b" : "w";
                _this2.setState({ selected: null, pieces: pieces, turn: newTurn });
            });

		}
	},
	 {
		key: "render",
		value: function render() {
			var _this3 = this;

			return React.createElement(
				"div",
				null,
				" ",
				this.state.pieces.slice().reverse().map(function (row, rowIdx) {
					return React.createElement(
						"div",
						{ key: rowIdx, style: { display: "flex" } },
						" ",
						row.map(function (piece, colIdx)
						{
							return React.createElement(
								"button",
								{
								key: colIdx,
								onClick: function onClick(e) {
										sIdx = _this3.state.selected;
										pieces = _this3.state.pieces.slice();
                                        const turn = _this3.state.turn; // 获取当前轮次

                                        // 检查是否点击了相同的棋子以取消选择
                                        if (sIdx != null && sIdx[0] === colIdx && sIdx[1] === 7 - rowIdx) {
                                            // 取消选择
                                            _this3.setState({ selected: null });
                                            return; // 提前返回，不执行后续逻辑
                                        }

                                        // 检查是否为对方棋子，如果是，返回
                                        const clickedPiece = pieces[7 - rowIdx][colIdx]; // 获取当前点击的棋子
                                        if (turn === "w" && clickedPiece === clickedPiece.toLowerCase() && isNaN(clickedPiece) && sIdx == null) { // 如果当前是白方且点击的是黑方棋子
                                            console.log("wtf");
                                            return; // 不允许点击
                                        } else if (turn === "b" && clickedPiece === clickedPiece.toUpperCase() && isNaN(clickedPiece) && sIdx == null){ // 如果当前是黑方且点击的是白方棋子
                                            console.log("wtf111");
                                            return; // 不允许点击
                                        }

										if (sIdx == null || pieces[sIdx[1]][sIdx[0]] == "1") {
											_this3.setState({ selected: [colIdx, 7 - rowIdx] });
										} else {
										    checkKing = false;
											//castles
											if (sIdx[1] == 0 && sIdx[0] == 4 && colIdx == 6 && pieces[0][4] == 'K' && pieces[0][7] == 'R') {
											    console.log("??:"+pieces[7 - rowIdx][colIdx]);
											    if(!_this3.isPathClear([sIdx[1], sIdx[0]], [0, 6] , pieces))
											        return;
											    checkKing = true;
												pieces[0][4] = '1';
												pieces[0][5] = 'R';
												pieces[0][6] = 'K';
												pieces[0][7] = '1';
											} else if (sIdx[1] == 0 && sIdx[0] == 4 && colIdx == 2 && pieces[0][4] == 'K' && pieces[0][0] == 'R') {
											    console.log("??:"+pieces[7 - rowIdx][colIdx]);
											    console.log("hi:" + _this3.isPathClear([0, 0], [0, 3] , pieces));
											    if(!_this3.isPathClear([sIdx[1], sIdx[0]], [0, 1] , pieces) )
											        return;
											    checkKing = true;
												pieces[0][0] = '1';
												pieces[0][2] = 'K';
												pieces[0][3] = 'R';
												pieces[0][4] = '1';
											} else if (sIdx[1] == 7 && sIdx[0] == 4 && colIdx == 6 && pieces[7][4] == 'k' && pieces[7][7] == 'r') {
											    if(!_this3.isPathClear([sIdx[1], sIdx[0]], [7, 6] , pieces))
											        return;
											    checkKing = true;
												pieces[7][4] = '1';
												pieces[7][5] = 'r';
												pieces[7][6] = 'k';
												pieces[7][7] = '1';
											} else if (sIdx[1] == 7 && sIdx[0] == 4 && colIdx == 2 && pieces[7][4] == 'k'&& pieces[7][0] == 'R') {
											    if(!_this3.isPathClear([sIdx[1], sIdx[0]], [7, 1] , pieces))
											        return;
											    checkKing = true;
												pieces[7][0] = '1';
												pieces[7][2] = 'k';
												pieces[7][3] = 'r';
												pieces[7][4] = '1';
											} else {
											    console.log("进来了？!!!!!!？？");
											    console.log(sIdx[0], sIdx[1], colIdx, 7 - rowIdx, pieces);
											    console.log("什么品种？ + " + pieces[sIdx[1]][sIdx[0]]);
                                                // 检查移动是否合法
                                                h0 = sIdx[0], h1 = sIdx[1], hh = pieces, hc = colIdx, hr = 7 - rowIdx;

                                                var moveResult = _this3.checkMoveValidity([h1, h0], [hr, hc], hh);
                                                console.log("进来了？？？？");
                                                console.log(moveResult);

                                                if (moveResult.valid) {
                                                    checkKing = true;

                                                    // 如果是升变
                                                    if (moveResult.promotion) {
                                                        // 提示用户选择要变成的棋子（这里只示例变成后 Q，其他可以扩展）
                                                        let promotedPiece = piece === 'p' ? 'q' : 'Q'; // 简单地将兵变为后，q 或 Q

                                                        // 将棋子变为后
                                                        pieces[7 - rowIdx][colIdx] = promotedPiece;
                                                    } else {
                                                        // 正常移动
                                                        pieces[7 - rowIdx][colIdx] = pieces[sIdx[1]][sIdx[0]];
                                                    }

                                                    pieces[sIdx[1]][sIdx[0]] = "1"; // 清空原始位置

                                                    // 检查王是否被吃掉
                                                    let whiteKingAlive = pieces.some(row => row.includes('K'));
                                                    let blackKingAlive = pieces.some(row => row.includes('k'));

                                                    if (!whiteKingAlive) {
                                                        alert("黑方胜利！"); // 弹窗提示黑方胜利
                                                    } else if (!blackKingAlive) {
                                                        alert("白方胜利！"); // 弹窗提示白方胜利
                                                    }

                                                }


//                                                console.log("进来了？!!!!!!？？");
//											    console.log(sIdx[0], sIdx[1], colIdx, 7 - rowIdx, pieces);                                      ///normal
//												pieces[7 - rowIdx][colIdx] = pieces[sIdx[1]][sIdx[0]];
//												pieces[sIdx[1]][sIdx[0]] = "1";


											}
											if(checkKing)
											{
											var newTurn = _this3.state.turn == "w" ? "b" : "w";
											_this3.setState({ selected: null, pieces: pieces, turn: newTurn });
											_this3.getMoveFromAPI(pieces, newTurn);
											checkKing = false;
											}

										}
									},
									style: {
									outline: "none",
									 border: "none",
									  width: "100px",
									   height: "100px",
									   background: (_this3.state.selected && _this3.state.selected[0] === colIdx && _this3.state.selected[1] === (7 - rowIdx))
                                    ? "saddlebrown"
                                    : (rowIdx + colIdx) % 2 === 0 ? "gainsboro" : "darkGrey"  } },
								piece != "1" && React.createElement("img", { style: { width: "50px", height: "50px" }, src: "/pngs/" + (piece.toLowerCase() === piece ? piece + "2" : piece) + ".png", alt: "" })
							);
						}),
						" "
					);
				})
			);
		}
	}]);

	return ChessBoard;
}(React.Component);

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(
	"div",
	{ style: { width: "100%", display: "flex", justifyContent: "center" } },
	React.createElement(ChessBoard, null)
));