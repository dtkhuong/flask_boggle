from boggle import Boggle
from flask import Flask, request, render_template, jsonify
from flask_debugtoolbar import DebugToolbarExtension
from flask import session

boggle_game = Boggle()

app = Flask(__name__)
app.config["SECRET_KEY"] = "oh-so-secret"
# app.config("DEBUG_TB_INTERCEPT_REDIRECTS") = False
debug = DebugToolbarExtension

board = boggle_game.make_board()


@app.route("/")
def show_landing_page():
    session['board'] = board
    highscore = session.get("highscore", 0)
    nplayed = session.get("nplayed", 0)
    return render_template("index.html", board=board, boggle=boggle_game, highscore=highscore, nplayed=nplayed)


@app.route("/guess", methods=["POST"])
def say_hi():
    guessed_word = request.json["guess"]     #allows access to the data posted from axios, guess is key, guessed_word is value
    guessed_response = boggle_game.check_valid_word(board, guessed_word) #method of boggle class returns the validity of the guessed word
    return jsonify(guessed_response) #by returning guessed response, it shows up as value of 'data' key in the var we stored our axios post

@app.route("/final-score", methods=["POST"])
def save_current_score():
    score = request.json["score"]
    highscore = session.get("highscore", 0)
    nplays = session.get("nplays", 0)

    session['nplays'] = nplays + 1
    session['highscore'] = max(score, highscore)
    return jsonify(brokeRecord=score > highscore)