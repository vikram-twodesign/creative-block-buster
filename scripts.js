const promptOutput = document.querySelector('#prompt-output');
const generatePromptBtn = document.querySelector('#generate-prompt-btn');
const submitResponseBtn = document.querySelector('#submit-response-btn');
const userResponseInput = document.querySelector('#user-response-input');
const successMessageDisplay = document.querySelector('#success-message');
const timerDisplay = document.querySelector('#timer');

const proxyUrl = 'https://creative-block-buster.vercel.app/api/submit-form';

let timerInterval;
let submittedText = '';

function generatePrompt() {
    const prompts = [

        "Write a short story about a world where everyone can control one of the four elements: water, earth, air, or fire.",
        "Compose a poem about the moon and its influence on human emotions.",
        "Create a narrative about a character who discovers they have the power to travel through time.",
        "Write a flash fiction piece about a conversation between the wind and the sea.",
        "Write a short story about a character who wakes up one day to find they've become invisible.",
        "Compose a poem about the beauty of a snow-covered landscape.",
        "Create a narrative about a world where the lines between dreams and reality have blurred.",
        "Write a flash fiction piece about a person who discovers a secret door in their home that leads to another dimension.",
        "Write a short story about a character who can communicate with plants and discovers a hidden talent.",
        "Compose a poem about a bird soaring high above the clouds.",
        "Create a narrative about a character who must face their greatest fear to save a loved one.",
        "Write a flash fiction piece about an encounter with a mysterious stranger at a train station.",
        "Write a short story about a person who discovers a hidden world beneath the city streets.",
        "Compose a poem about the fleeting nature of time.",
        "Create a narrative about a world where colors have scents, and the protagonist has the unique ability to perceive them.",
        "Write a flash fiction piece about a character who is given the opportunity to start their life over.",
        "Write a short story about a society where memories can be bought and sold.",
        "Compose a poem about the warmth of the sun on a summer day.",
        "Create a narrative about a character who discovers they have the ability to change the weather with their emotions.",
        "Write a flash fiction piece about a mysterious message found in a bottle.",
        "Write a short story about a character who is haunted by a decision they made in the past.",
        "Compose a poem about the feeling of looking up at the night sky and seeing an infinite expanse of stars.", 
        "Create a narrative about a world where music has magical powers.",
        "Write a flash fiction piece about the moment a person realizes they are in love.",
        "Write a short story about a mysterious figure appearing in your dreams, guiding you on a spiritual journey.",
        "Compose a poem about waking up in a world where everyone can read each other's thoughts.",
        "Create a narrative about a strange object falling from the sky, changing the lives of everyone who comes into contact with it.",
        "Write a short story about discovering a hidden garden filled with magical creatures.",
        "Compose a poem about a sudden power outage that plunges your town into darkness, revealing hidden truths.",
        "Create a narrative about finding a mysterious crystal with the power to grant wishes.",
        "Write a short story about stumbling upon a secret society that has been operating in the shadows for centuries.",
        "Compose a poem about a sudden storm transporting you to a realm where myths and legends come to life.",
        "Create a narrative about accidentally discovering a hidden talent for communicating with animals.",
        "Write a flash fiction piece about finding an enchanted mirror that shows the viewer their true self.",
        "Compose a poem about a mysterious figure offering you a chance to experience an alternate version of your life.",
        "Create a narrative about finding a hidden room in your house that contains a portal to another world.",
        "Write a short story about a strange device that allows you to glimpse into the lives of others.",
        "Compose a poem about the powerful emotions evoked by a piece of art.",
        "Write a short story about a character who accidentally adopts a magical creature.",
        "Compose a poem about the bond between a person and their favorite place in nature.",
        "Create a narrative about a character who finds an ancient artifact that changes their life forever.",
        "Write a flash fiction piece about a character who receives a letter from their future self.",
        "Compose a poem about the bittersweet feeling of saying goodbye to a loved one.",
        "Write a short story about a character who discovers a hidden talent for predicting the future.",
        "Create a narrative about a group of friends who embark on a dangerous quest to find a legendary treasure.",
        "Write a flash fiction piece about a character who wakes up one day to find they can speak any language.",
        "Compose a poem about the unique beauty of a desert landscape.",
        "Write a short story about a character who must solve a riddle to save their village.",
        "Create a narrative about a world where every person has a magical animal companion.",
        "Write a flash fiction piece about a character who discovers a secret room in a library filled with ancient texts.",
        "Compose a poem about a traveler's first experience of a foreign land.",
        "Write a short story about a character who finds an old map that leads them on a thrilling adventure.",
        "Create a narrative about a world where dreams can be harvested and sold as commodities.",
        "Write a flash fiction piece about a character who finds a book that can predict their future.",
        "Compose a poem about the serenity of a quiet forest.",
        "Write a short story about a character who discovers that they are the last of their kind.",
        "Create a narrative about a character who finds themselves in a mysterious land where time stands still.",
        "Compose a poem about the feeling of nostalgia and the passage of time.",
        "Write a short story about a character who makes a life-changing decision during a storm.",
        "Create a narrative about a character who must confront their greatest fear to save a loved one.",
        "Write a flash fiction piece about a mysterious object that appears in a character's backyard.",
        "Compose a poem about the beauty of a sunset on a beach.",
        "Write a short story about a character who stumbles upon a hidden society living in a remote location.",
        "Create a narrative about a character who finds a portal to a parallel universe.",
        "Write a flash fiction piece about a character who must face the consequences of a single, impulsive action.",
        "Compose a poem about the changing seasons and the cyclical nature of life.",
        "Write a short story about a character who receives a mysterious gift with unknown powers.",
        "Create a narrative about a character who discovers that they can communicate with animals.",
        "Write a flash fiction piece about a character who finds a hidden message in an old family heirloom.",
        "Compose a poem about the resilience and strength of the human spirit.",
        "Write a short story about a character who is faced with an impossible choice.",
        "Create a narrative about a world where music has the power to shape reality.",
        "Write a flash fiction piece about a character who discovers a new planet with strange inhabitants.",
        "Compose a poem about the bittersweet feeling of growing up.",
        "Write a short story about a character who is forced to confront their past.",
        "Create a narrative about a character who embarks on a journey to find a long-lost family member.",
        "Write a flash fiction piece about a character who finds a hidden door leading to a secret underground world.",
        "Compose a poem about the calming power of a gentle rain shower.",
        "Write a short story about a character who discovers they can control the weather.",
        "Create a narrative about a character who befriends a ghost that haunts their home.",
        "Write a flash fiction piece about a character who wakes up to find that everyone in the world has disappeared.",
        "Compose a poem about the beauty and majesty of a snow-capped mountain.",
        "Write a short story about a character who is suddenly granted the ability to fly.",
        "Create a narrative about a character who learns the true meaning of friendship during a dangerous adventure.",
        "Write a flash fiction piece about a character who finds a message in a bottle washed up on the shore.",
        "Compose a poem about the interconnectedness of all living things.",
        "Write a short story about a character who discovers a hidden talent for time travel.",
        "Create a narrative about a character who encounters a mythical creature in their backyard.",
        "Write a flash fiction piece about a character who suddenly gains the ability to read minds.",
        "Compose a poem about the serenity of a quiet night under the stars.",
        "Write a short story about a character who discovers a hidden underground city.",
        "Create a narrative about a character who must outwit a cunning trickster.",
        "Write a flash fiction piece about a character who finds a strange artifact that grants wishes.",
        "Compose a poem about the fleeting nature of happiness.",
        "Write a short story about a character who encounters their doppelganger.",
        "Create a narrative about a character who is transported to a world where their favorite book comes to life.",
        "Write a flash fiction piece about a character who discovers a secret about their own identity."

    ];

    const randomIndex = Math.floor(Math.random() * prompts.length);
    return prompts[randomIndex];
}

function init() {
    if (!promptOutput || !generatePromptBtn || !submitResponseBtn || !userResponseInput || !successMessageDisplay || !timerDisplay) {
        console.error('One or more required elements are missing.');
        return;
    }

    generatePromptBtn.addEventListener('click', () => {
        promptOutput.textContent = generatePrompt();
        userResponseInput.value = '';
        successMessageDisplay.style.display = 'none';
        startTimer(300, timerDisplay);
        document.getElementById("character-count").innerHTML = "Characters: 0";
    });

    submitResponseBtn.addEventListener('click', () => {
    successMessageDisplay.textContent = 'Great job! Look at you, such a natural!';
    successMessageDisplay.style.display = 'block';
    clearInterval(timerInterval);

    document.getElementById('copyToClipboard').style.display = 'block';
    submittedText = userResponseInput.value;

    // Get the current prompt displayed
    const currentPrompt = promptOutput.textContent;
    
    // Pass the current prompt along with the user's response to sendDataToGoogleForm
    sendDataToGoogleForm(currentPrompt, userResponseInput.value);
});


    function startTimer(duration, display) {
        clearInterval(timerInterval);
        let timeRemaining = duration;
        tick(display, timeRemaining);
        timerInterval = setInterval(() => {
            timeRemaining -= 1;
            tick(display, timeRemaining);
            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                display.textContent = "Your time's up!";
            }
        }, 1000);
    }

    function tick(display, timeRemaining) {
        const minutes = parseInt(timeRemaining / 60, 10);
        const seconds = parseInt(timeRemaining % 60, 10);
        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
        const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
        display.textContent = formattedMinutes + ':' + formattedSeconds;
    }

    function sendDataToGoogleForm(prompt, response) {
  const url = `/api/submitForm?text=${encodeURIComponent(response)}&prompt=${encodeURIComponent(prompt)}`;
  
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Data:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}





document.getElementById("user-response-input").addEventListener("input", function () {
  const inputText = this.value;
  const characterCount = inputText.length;
  document.getElementById("character-count").innerHTML = "Characters: " + characterCount;
});

}

init();

document.getElementById('copyToClipboard').addEventListener('click', () => {
    navigator.clipboard.writeText(submittedText).then(() => {
        console.log('Text copied to clipboard');
    }).catch((error) => {
        console.error('Error copying text:', error);
    });
});
