class SetWin extends React.Component {
  render() {
    let msg = "";
    let pass = this.props.pass;
    if (pass === true) {
      msg = "";
    }
    return <div> {msg}</div>;
  }
}

class Hangman extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      word: "",
      gameText: "",
      letterHolder: [],
      guessingWord: false, //by default set to false , set to true in guessWord function
      count: 0,
      looseCount: 0,
      winCount: 0,
      pass: false
    };

    this.setCharAt = this.setCharAt.bind(this);
    this.guessLetter = this.guessLetter.bind(this);
    this.guessWord = this.guessWord.bind(this);
    this.checkPass = this.checkPass.bind(this);
    this.addLetterToArray = this.addLetterToArray.bind(this);
  }

  componentDidMount() {
    /* keypress event indicates which character was entered */
    document.addEventListener("keypress", this.guessLetter, false);
  }

  //Guessletter function will be Triggered whenever a key is pressed
  guessLetter(event) {
    let letterHolder = [];
    // return if user is attempting to guess ( will not allow letters to pupulate)
    if (document.getElementById("guessbox") == document.activeElement) return;
    let setUndescores = this.state.gameText;
    let InputLetter = String.fromCharCode(event.keyCode);
    this.addLetterToArray(letterHolder, InputLetter);
    let Answer1 = this.state.word;
    let success = false;
    for (var i = 0; i < Answer1.length; i++) {
      if (Answer1[i] == InputLetter) {
        let IndexPosition = Answer1.indexOf(Answer1[i]); //works good , gets index position
        setUndescores = this.setCharAt(
          setUndescores,
          IndexPosition,
          InputLetter,
          i
        );
        success = true;
      }
    }
    // condition true if attempt is false
    //this condition is determining when the game is over based on the amount of tries
    if (success == false) {
      //increment the count for the number of time guess was incorrect
      this.setState({ count: this.state.count + 1 });
      if (this.state.count == 7) {
        // user will have a total of 7 wrong attempts until game over
        window.alert("Game over");
        this.startGame();
      }
    }

    if (success == true) {
      //this removes spaces
      if (setUndescores.replace(/\s/g, "") == Answer1) {
        this.setState({ pass: true });
        // this function call will prompt the alert windows after the game was done and reset
        // the state of pass to false
        this.checkPass();
      }
    }
    this.setState({ gameText: setUndescores });
  }
  // sets correct letters to their appropriate index
  setCharAt(str, index, chr, i) {
    if (index > str.length - 1) return str;
    return str.substr(0, i * 2) + chr + str.substr(i * 2 + 1);
  }
  checkPass() {
    this.startGame();
    this.setState({ pass: false });
    window.alert("Congratulations!");
  }
  addLetterToArray(letterHolder, theLetter) {
    //check to see if letter is already in array
    let index = letterHolder.indexOf(theLetter);
    // if not , insert
    if (index == -1) {
      letterHolder.push(theLetter);
    }
  }

  //startGame functions gets word to guess and
  startGame() {
    this.setState({ count: 0 });
    fetch("https://api.datamuse.com/words?ml=netherlands")
      .then(res => res.json())
      .then(result => {
        let randNum = Math.floor(Math.random() * 50);
        let Answer1 = result[randNum].word;
        console.log(Answer1);
        this.setState({ word: Answer1 });
        let setUnderscores = "";
        // if there is a hyphen,insert hyphen in index position
        let position = Answer1.indexOf("-"); // find the pisition of hyphen
        for (var i = 0; i < Answer1.length; i++) {
          if (i == position) {
            setUnderscores += "-";
          } else {
            setUnderscores += "_ ";
          }
        }
        //replaces start Text and sets new undescore
        this.setState({ gameText: setUnderscores });
      });
  }
  // allows the user to attempt to guess the word
  // gets the answer and compares the users guest word
  guessWord() {
    let Answer1 = this.state.word; // get the Answer
    let guess = window.prompt("Please enter a word", "");
    //compare answer w/ guess word
    if (Answer1 == guess) {
      window.alert("Congratulations!");
      this.startGame();
    }
    if (Answer1 != guess) {
      window.alert("Wrong, try Again");
    }
  }
  //for guessing, sets state according to user input
  GuessAttempt() {
    this.setState({ guessingWord: true });
  }
  render() {
    ////
    return (
      <div className="hangmanBox">
        <h1>Hangman - React </h1>
        <h4>Click New Game to Start or Restart </h4>
        <button onClick={() => this.startGame()} className="button">
          Start or Restart New Game
        </button>
        <img
          src={
            "images/" +
            (this.state.count == 0 ? "base_for_hangman" : this.state.count) +
            ".png"
          }
        />

        <div>{this.state.gameText}</div>
        <SetWin pass={this.state.pass} />
        <button onClick={() => this.guessWord()} className="button">
          Guess Word
        </button>
        {this.state.guessingWord ? (
          <GuessAttempt guessWord={this.guessWord} />
        ) : null}
      </div>
    );
  }
}

ReactDOM.render(<Hangman />, document.getElementById("hangman"));
