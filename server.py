from flask import Flask, request, send_from_directory, render_template
import chess
from numba.cuda.printimpl import print_item
from sqlalchemy import false

import encoder
import torch
import AlphaZeroNetwork

app = Flask(__name__, static_url_path='', static_folder='static')


import chess

def is_valid_move(piece, start, end, board):
    """根据棋子的类型和规则检查移动是否合法"""
    direction = end - start
    start_row, start_col = divmod(start, 8)
    end_row, end_col = divmod(end, 8)

    if piece.piece_type == chess.PAWN:
        # 黑方兵的走法
        if start_col == end_col:  # 向前一步
            return end == start + 8
        elif abs(start_col - end_col) == 1:  # 吃子
            return end == start + 9 or end == start + 7

    elif piece.piece_type == chess.ROOK:
        return (start_row == end_row or start_col == end_col) and not obstructed(start, end, board)

    elif piece.piece_type == chess.KNIGHT:

        # 马的合法移动：L形移动

        knight_moves = [

            (2, 1), (2, -1), (-2, 1), (-2, -1),  # 两步横一竖

            (1, 2), (1, -2), (-1, 2), (-1, -2)  # 一步横两竖

        ]

        for dx, dy in knight_moves:

            if (start_row + dy == end_row) and (start_col + dx == end_col):

                # 确保目标格子没有同色棋子

                return not (board.piece_at(end) and board.piece_at(end).color == piece.color)

    elif piece.piece_type == chess.BISHOP:
        return abs(start_row - end_row) == abs(start_col - end_col) and not obstructed(start, end, board)

    elif piece.piece_type == chess.QUEEN:
        return (abs(start_row - end_row) == abs(start_col - end_col) or start_row == end_row or start_col == end_col) and not obstructed(start, end, board)

    elif piece.piece_type == chess.KING:
        return abs(start_row - end_row) <= 1 and abs(start_col - end_col) <= 1

    return False

def obstructed(start, end, board):
    """检查两个方格之间是否有其他棋子阻挡"""
    start_row, start_col = divmod(start, 8)
    end_row, end_col = divmod(end, 8)

    if start_row == end_row:  # 横向移动
        step = 1 if end_col > start_col else -1
        for col in range(start_col + step, end_col, step):
            if board.piece_at(start_row * 8 + col):
                return True
    elif start_col == end_col:  # 纵向移动
        step = 1 if end_row > start_row else -1
        for row in range(start_row + step, end_row, step):
            if board.piece_at(row * 8 + start_col):
                return True
    else:  # 斜向移动
        row_step = 1 if end_row > start_row else -1
        col_step = 1 if end_col > start_col else -1
        row, col = start_row + row_step, start_col + col_step
        while (row != end_row) and (col != end_col):
            if board.piece_at(row * 8 + col):
                return True
            row += row_step
            col += col_step

    return False

def can_capture_king(board, color):
    """检查指定颜色的棋子是否能吃掉对方国王"""
    opponent_color = chess.WHITE if color == chess.BLACK else chess.BLACK
    king_square = board.king(opponent_color)

    # 获取所有指定颜色棋子的位置
    for square in range(64):
        piece = board.piece_at(square)
        if piece and piece.color == color:  # 检查是否是指定颜色的棋子
            if is_valid_move(piece, square, king_square, board):  # 检查是否能走到国王位置
                # 返回合法的吃掉国王的走法
                return chess.Move(square, king_square)

    # 如果没有找到合法的吃掉国王的走法
    return False



# 修改根路径，返回主页
@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

@app.route('/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

modelFile = "F:\\codeProject\\PyCharm\\pytorch-alpha-zero-master\\weights\\AlphaZeroNet_20x256.pt"
cuda = False
if cuda:
    weights = torch.load(modelFile)
else:
    weights = torch.load(modelFile, map_location=torch.device('cpu'))


@app.route('/AI', methods=['POST'])
def AI():
    alphaZeroNet = AlphaZeroNetwork.AlphaZeroNet(20, 256)
    alphaZeroNet.load_state_dict(weights)
    if cuda:
        alphaZeroNet = alphaZeroNet.cuda()
    for param in alphaZeroNet.parameters():
        param.requires_grad = False
    alphaZeroNet.eval()

    fen = request.form['fen']
    print("fen:")
    print(fen)
    board = chess.Board(fen)

    with torch.no_grad():
        # 使用神经网络进行推理
        value, move_probabilities = encoder.callNeuralNetwork(board, alphaZeroNet)
        maxP = -1
        maxMove = None

        if board.is_check():
            print("当前局面为将军。")

        print(board)

        # 尝试找出可以吃掉对方国王的走法
        kkjj = can_capture_king(board, board.turn)
        if kkjj is not False:  # 检查是否有吃掉国王的走法
            maxMove = kkjj  # 设置 maxMove 为可以吃掉王的走法
        else:
            # 如果不能吃掉国王，寻找概率最高的走法
            print("没有吃掉国王的走法，寻找概率最高的走法。")
            for idx, move in enumerate(board.legal_moves):
                if move_probabilities[idx] > maxP:
                    maxP = move_probabilities[idx]
                    maxMove = move

    print("maxMove:")
    print(maxMove)
    # 确保 maxMove 不为 None
    if maxMove:
        print("最佳走法:", maxMove)
        return maxMove.uci()  # 返回 UCI 格式的走法
    else:
        return "No valid move found", 400  # 如果没有找到任何合法走法，返回错误


    # with torch.no_grad():
    #     value, move_probabilities = encoder.callNeuralNetwork(board, alphaZeroNet)
    #     maxP = -1
    #     maxMove = None
    #     for idx, move in enumerate(board.legal_moves):
    #         if move_probabilities[idx] > maxP:
    #             maxP = move_probabilities[idx]
    #             maxMove = move
    #     return maxMove.uci()

@app.route('/human_move', methods=['POST'])
def validate_move():
    fen = request.form['fen']
    move_str = request.form['move']
    board = chess.Board(fen)

    try:
        move = chess.Move.from_uci(move_str)  # 将字符串转换为 Move 对象
        if move in board.legal_moves:  # 检查走法是否合法
            board.push(move)  # 更新棋盘状态
            return {
                'valid': True,
                'fen': board.fen()  # 返回更新后的 FEN
            }
        else:
            return {
                'valid': False,
                'message': 'Invalid move'
            }, 400  # 返回 400 错误
    except ValueError:
        return {
            'valid': False,
            'message': 'Invalid move format'
        }, 400  # 返回 400 错误

if __name__ == '__main__':
    app.run(port=80, host="0.0.0.0", threaded=True)
