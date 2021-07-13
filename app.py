from boggle import Boggle
from flask import Flask, request, render_template, session, jsonify

app = Flask(__name__)
app.config["SECRET_KEY"] = "Agamilior1019"


boggle_game = Boggle()


@app.route('/')
def index():
    """Show game"""
    
    board = boggle_game.make_board()
    session['board'] = board
    highscore = session.get("highscore", 0)
    nplays = session.get("nplays", 0)
    return render_template("index.html", board=board, highscore=highscore, nplays=nplays)


@app.route('/check-word')
def check_word():
    """Check if the word is in the list of words"""
    
    word = request.args["word"]
    board = session['board']
    res = boggle_game.check_valid_word(board, word)
    
    return jsonify({'result': res})

@app.route("/end-game", methods=["POST"])
def post_score():
    """Receive score, update nplays, update high score if appropriate."""

    score = request.json["score"]
    highscore = session.get("highscore", 0)
    nplays = session.get("nplays", 0)

    session['nplays'] = nplays + 1
    session['highscore'] = max(score, highscore)

    return jsonify(brokeRecord=score > highscore)