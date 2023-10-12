// Selection of Elements in HTML
let startQuiz = document.querySelector(".start"),
  currentQuestion = document.querySelector(".current"),
  totalQuestions = document.querySelector(".total"),
  progressContainer = document.querySelector(".progress"),
  progress = document.querySelector(".prog"),
  countDown = document.querySelector(".countdown"),
  minutes = document.querySelector(".minutes"),
  seconds = document.querySelector(".seconds"),
  question = document.querySelector(".question"),
  theAnswers = document.querySelector(".answers"),
  next = document.querySelector(".next"),
  results = document.querySelector(".results");

// initialization of the current index and the right question number
let currentIndex = 0;
let rightCounts = 0;

// Start the Quiz after clicking on Start button
startQuiz.onclick = () => {
  startQuiz.remove();
  progressContainer.style.display = "flex";
  next.style.display = "block";
  quizApp();
};

// Function to Get Questions and Create them
function quizApp() {
  fetch("questions.json")
    .then((response) => response.json())
    .then((questions) => {
      // create total and current questions number
      currentQuestion.innerHTML = currentIndex + 1;
      let total = questions.length;
      totalQuestions.innerHTML = total;

      // Create timer CountDown
      let minute = 3;
      let second = 0;
      let time = setInterval(function () {
        timer();
      }, 1000);
      function timer() {
        if (--second == -1) {
          minute--;
          second = 59;
        }
        if (minute == -1) {
          minute = 0;
          second = 0;
          clearInterval(time);
          if (results.innerHTML) {
            results.innerHTML = "";
            result(); // Function that give the result depend on the chosen answers
          } else {
            result();
          }
        }
        // warning if the time less than 30 seconds
        if (minute == 0 && second <= 30) {
          countDown.style.boxShadow = " 0 0 8px red";
          countDown.style.border = "1px solid red";
          countDown.style.color = "red";
        }
        // append the minutes in the spans
        minutes.innerHTML = `${minute < 10 ? "0" + minute : minute}`;
        seconds.innerHTML = `${second < 10 ? "0" + second : second}`;
      }

      // Create progress bar
      //every question have a progress 100% of the width divided by total number of questions
      let prog = 100 / total;
      // In first Question
      progress.dataset.progress = `${prog}%`;
      progress.style.width = `${progress.dataset.progress}`;

      // Create the Questions Function
      createQuestion(questions[currentIndex], total);

      // next question and showing results after finishing the questions
      next.onclick = () => {
        let rightAnswer = questions[currentIndex].rightAnswer;
        currentIndex++;

        // checking if the right answer equal to the chosen answer
        checkAnswers(rightAnswer);

        // clear the old question
        question.innerHTML = "";
        theAnswers.innerHTML = "";
        // create the new question
        if (currentIndex < questions.length) {
          createQuestion(questions[currentIndex], total);
          if (currentIndex == questions.length) {
            next.innerHTML = "Submit";
          }
        } else {
          // Create Result
          result(); // Function that give the result depend on the chosen answers
        }

        // define the number of current question
        currentQuestion.innerHTML = currentIndex + 1;

        // increase the progress
        prog += 100 / total;
        progress.dataset.progress = `${prog}%`;
        progress.style.width = `${progress.dataset.progress}`;
      };

      //  Function to get the result depend on the chosen answers
      function result() {
        // Clear the Questions, answers, progress bar, countdown and next button
        next.remove();
        progressContainer.remove();
        question.remove();
        theAnswers.remove();
        // create the result
        let span = document.createElement("span"),
          resultText = document.createTextNode(
            ` ,You Scored ${rightCounts} From ${total}`
          );
        if (rightCounts == total) {
          span.className = "perfect";
          span.innerHTML = "Perfect";
        } else if (rightCounts >= total / 2 && rightCounts < total) {
          span.className = "good";
          span.innerHTML = "Good";
        } else {
          span.className = "bad";
          span.innerHTML = "Bad";
        }

        results.appendChild(span);
        results.appendChild(resultText);
      }
    });
}

// Function to create the Question
function createQuestion(ques, count) {
  // create Question from json file
  let theQuestion = document.createElement("h2");
  theQuestion.innerHTML = `${ques["question"]}`;
  question.appendChild(theQuestion);

  // create answers
  for (let i = 0; i < 4; i++) {
    let answer = document.createElement("div");
    answer.className = "answer";
    let input = document.createElement("input");
    input.type = "radio";
    input.name = "options";
    input.id = `answer_${i}`;
    input.dataset.answer = ques.answers[i];
    // create label
    let label = document.createElement("label");
    label.htmlFor = `answer_${i}`;
    let theAnswer = document.createTextNode(ques.answers[i]);
    label.appendChild(theAnswer);

    answer.appendChild(input);
    answer.appendChild(label);
    theAnswers.appendChild(answer);
  }
}

// Function to check answers
function checkAnswers(rAnswer) {
  let allAnswers = document.getElementsByName("options");
  let theChosen;

  for (let i = 0; i < allAnswers.length; i++) {
    if (allAnswers[i].checked) {
      theChosen = allAnswers[i].dataset.answer;
    }
  }

  if (theChosen === rAnswer) {
    rightCounts++;
  }
}
