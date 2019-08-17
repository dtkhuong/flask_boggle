$(function () {
  let score = 0;
  var timeLeft = 6;
  $("form").on("submit", async function (e) {
    e.preventDefault();
    let guessedWord = $("#guess").val();
    let $score = $("#score")
    let $guess = $("#guess-result")
    let $timer = $("#timer")
    // let $timerP = $("#timer-p")
    let $guessForm = $("#guess-form")
    let response = await axios.post("/guess", {
      guess: guessedWord
    });
    // $guess.append(response.data)

    $guess.empty()
    $score.empty()
    if (response.data == "ok") {
      $guess.append("Good job! That's a valid word!")
      score += guessedWord.length;
      $score.append("Your score is ", score);
    } else if (response.data == "not-on-board") {
      $guess.append("That is a valid word, but it is not on the board, try again");
      $score.append("Your score is ", score);
    } else {
      $guess.append("Sorry that is not a valid word");
      $score.append("Your score is ", score);
    }

    var timer = setInterval(async function () {
      timeLeft -= 1;
      $timer.text(`You have ${timeLeft} seconds remaining`);
      if (timeLeft <= 0) {
        $guessForm.empty();
        $guess.empty();
        $timer.empty();
        $timer.text("Game Over")
        clearInterval(timer);
        await scoreGame();

      }
    }, 1000);

  });

  async function scoreGame() {
    let $highscore = $("#highscore")
    if (timeLeft <= 0) {
      let response = await axios.post("/final-score", { score: score });
      if (response.data.brokeRecord) {
        $highscore.text(`new record: ${score}`);
      } else {
        $highscore.text(`final record: ${score}`);
      }
    };
  };
});
