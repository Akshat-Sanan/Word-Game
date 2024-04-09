// console.log(document.documentElement.clientWidth)

// const mobileWidth = 600;
let buubleDesnsity = 120;

// if(document.documentElement.clientWidth<=mobileWidth){
//     alert("mobile view")
//     buubleDesnsity = 50;
// }


let overlayScreen = document.querySelector(".overLayMessage");

let restartBtn = document.querySelector(".restart");
restartBtn.style.display = "none";

let startBtn = document.querySelector(".start");
startBtn.addEventListener("click", ()=>{
    overlayScreen.style.display = "none";
    startTimer();
})


let bubbleContainer = document.querySelector(".panelBottom");
let wordContainer = document.querySelector(".word");
let timerContainer = document.querySelector(".timer");
let scoreContainer = document.querySelector(".score");
let highScoreContainer = document.querySelector(".highestScore");
let overlayMessage1 = document.querySelector(".storageMessage-1");
let overlayMessage2 = document.querySelector(".storageMessage-2");
let h1Headnig = document.querySelector("h1");


let alphabets = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p",'q',"u","v","r","s","t","w","x","y","z"];
let letter = [];
let bubbleLetters = [];
let score = 0;
let timer = 60;
let highestScore = 0;


function localStorageChecker() {
    let storedScore = localStorage.getItem("highestScore");
    if (storedScore) {
        highestScore = parseInt(storedScore);
        highScoreContainer.innerText = highestScore;
        overlayMessage1.innerText = `Looks like you have a highscore of ${highestScore} stored on this machine`;
        overlayMessage2.innerText = "Let's see if you can beat your best score this time around!";
    }
    else{
        highestScore = 0;
        highScoreContainer.innerText = "No Previous Score";
        overlayMessage1.innerText = `Looks like you don't have a highscore stored on this machine`;
        overlayMessage2.innerText = "Let's see how much you can make!";
    }
}

function scoreUpdate(check){
    if(!check && score!=0 ){
        score-=5;
        scoreContainer.innerText = score;
    }
    if(check){
        // console.log(check);
        score+=10;
        scoreContainer.innerText = score;
    }
}

function startTimer(){
    let time = setInterval(() => {
                    timerContainer.innerText = timer;
                    timer--;

                    if(timer == 0){
                        clearInterval(time);
                        overlayScreen.style.display = "flex";

                        if(score>highestScore){
                            localStorage.setItem("highestScore", score);
                            overlayMessage1.innerText = `Awesome, you got a new highscore of ${score} over last time score of ${highestScore}  `;
                            overlayMessage2.innerText = "Let's play again";
                            restartBtn.style.display = "block";
                            startBtn.style.display = "none";
                            h1Headnig.style.display = "none";
                        }else{
                            overlayMessage1.innerText = `ohh oh, you didn't beat the highscore of ${highestScore}`;
                            overlayMessage2.innerText = "Don't worry, let's play again";
                            restartBtn.style.display = "block";
                            startBtn.style.display = "none";
                            h1Headnig.style.display = "none";
                        }
                        restartBtn.addEventListener("click", ()=>{
                            location.reload();
                        })
                    }
                },1000)
}

function wordInserter(){
    wordContainer.innerHTML = " ";
    letter.forEach(element => {
        let wordInsert  = document.createElement('span');
        wordInsert.innerText = element
        wordInsert.classList.add('letter');
        wordContainer.appendChild(wordInsert);
    })
}

function randomWordGenerator (){

    fetch('https://random-word-api.herokuapp.com/word?length=5')
        .then(response => response.json())
        .then(data => {
            const word = data[0];
            letter = [...word];
            bubbleLetters = [...letter, ...letter, ...letter]
            bubbleContainer.innerHTML = " ";
            bubbleGenerator();
            wordInserter();
            wordCheker();
        })
        .catch(error => console.error('Error fetching random words:', error));
}



function bubbleInserter(msg) {
    let bubble = document.createElement('div');
    bubble.innerText = msg
    bubble.classList.add('bubble');
    bubbleContainer.appendChild(bubble);
}


function bubbleGenerator(params) {
    letter.forEach(letter => {
        alphabets = alphabets.filter(alphabet =>
        alphabet!=letter)
    });


    for(let i=1;i<=buubleDesnsity;i++){
        randomLetter = alphabets[Math.floor(Math.random() * alphabets.length)];
        bubbleInserter(randomLetter);
    }

    let bubbles = document.getElementsByClassName("bubble");

    bubbleLetters.forEach(letter => {
        randomLetterInsertionIndex = Math.floor(Math.random() * buubleDesnsity);
        bubbles[randomLetterInsertionIndex].innerHTML = `<div class="bubble">${letter}</div>`;
        // console.log(letter)
        // console.log(alphabets)
    });
}


function wordCheker() {
    let generatedWord = document.getElementsByClassName("letter");
    let index = 0;
    document.querySelector(".panelBottom").addEventListener("click", (e)=>{
        // console.log(e.target.innerText);
        if(e.target.innerText === generatedWord[index].innerText && index != letter.length){
            generatedWord[index].classList.add("correct")
            scoreUpdate(true);
            index++;
            if(index === letter.length){
                randomWordGenerator();
            }
        }
        else{
            // console.log("not matched")
            scoreUpdate(false);
            generatedWord[index].classList.add("wrong");
            index++;
            if(index === letter.length){
                randomWordGenerator();
            }
        }
    })
}

localStorageChecker();
randomWordGenerator();
