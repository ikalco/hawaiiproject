let mainDiv = document.getElementById("main");
let currentFrame;
let frame = 0;
let frames;

fetch("./frames/frames.json").then((data) => {
  data.json().then((json) => {
    frames = json;
    nextFrame();
    nextDialouge();
  });
})

function nextFrame() {
  frame++;

  currentFrame = frames[frame];
  mainDiv.style.backgroundImage = `url("./frames/${currentFrame.image}")`;
  console.log(currentFrame);
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

  topDiv.appendChild(headerDiv);

  let bodyDiv = document.createElement("div");
  bodyDiv.id = "dialougeBody";
  bodyDiv.className = "dialougeBoxBody";
  // bodyDiv.innerHTML = dialouge.text;

  topDiv.appendChild(bodyDiv);

  mainDiv.appendChild(topDiv);

  type(dialouge.text, "dialougeBody");
}

document.addEventListener("mouseup", (event) => {
  nextDialouge();
})

async function type(sentence, elementID, delay = 25) {
  const ele = document.getElementById(elementID);
  const letters = sentence.split("");
  let i = 0;
  for (let i = 0; i < letters.length; i++) {
    await waitForMs(delay);
    ele.innerHTML += letters[i];
  }
}

function waitForMs(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
