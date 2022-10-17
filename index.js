let mainDiv = document.getElementById("main");
let currentFrame;
let finished = true;
let frame = 0;
let frames;

fetch("./frames/frames.json").then((data) => {
  data.json().then((json) => {
    frames = json;
    nextFrame();
    nextDialouge();

    for (let i = 0; i < 170; i++) {
      nextDialouge();
    }
  });
})

function nextFrame() {
  frame++;

  currentFrame = frames[frame];
  mainDiv.style.backgroundImage = `url("./frames/${currentFrame.image}")`;
}

function nextDialouge() {
  if (currentFrame.dialouges.length == 0) nextFrame();
  const ele = mainDiv.getElementsByClassName("dialougeBox");
  if (ele.length != 0) ele[0].remove();
  createDialougeBox(currentFrame.dialouges.shift());
}

function createDialougeBox(dialouge) {
  let topDiv = document.createElement("div");
  topDiv.id = "dialouge";
  topDiv.className = 'dialougeBox';

  let headerDiv = document.createElement("div");
  headerDiv.id = "dialougeHeader";
  headerDiv.className = "dialougeBoxHeader";
  headerDiv.innerText = dialouge.person;
  if (dialouge.person == "*") {
    headerDiv.style.visibility = "hidden"
  }

  topDiv.appendChild(headerDiv);

  let bodyDiv = document.createElement("div");
  bodyDiv.id = "dialougeBody";
  bodyDiv.className = "dialougeBoxBody";
  // bodyDiv.innerHTML = dialouge.text;

  topDiv.appendChild(bodyDiv);

  mainDiv.appendChild(topDiv);

  if (dialouge.person == "*") {
    type(`*${dialouge.text}*`, "dialougeBody");
  } else {
    type(dialouge.text, "dialougeBody");
    playSansSound();
  }
}

document.addEventListener("mouseup", (event) => {
  if (finished) nextDialouge();
  else finished = true;
})

function yourWelcome() {
  let youreWelcome = new Audio("frames/youre-welcome.mp3");
  youreWelcome.volume = 0.1;
  youreWelcome.play();
}

async function type(sentence, elementID, delay = 25) {
  if (sentence == "WHAT CAN I SAY EXCEPT YOU’RE WELCOME!") {
    const ele = document.getElementById(elementID);
    ele.innerHTML = sentence;
    yourWelcome();
    return;
  }
  finished = false;
  const ele = document.getElementById(elementID);
  const letters = sentence.split("");
  for (let i = 0; i < letters.length; i++) {
    if (!finished) {
      await waitForMs(delay);
      ele.innerHTML += letters[i];
    } else {
      ele.innerHTML = sentence;
      break;
    }
  }
  finished = true;
}

function playSound() {
  let voice_sans_mp3 = new Audio("frames/voice_sans.mp3");
  voice_sans_mp3.playbackRate = 0.5;
  voice_sans_mp3.volume = 0.2;
  voice_sans_mp3.play();
}

async function playSansSound() {
  while (!finished) {
    await waitForMs(75);
    playSound();
  }
}

function waitForMs(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
