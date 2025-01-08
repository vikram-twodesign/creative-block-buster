const promptOutput = document.querySelector('#prompt-output');
const generatePromptBtn = document.querySelector('#generate-prompt-btn');
const submitResponseBtn = document.querySelector('#submit-response-btn');
const userResponseInput = document.querySelector('#user-response-input');
const successMessageDisplay = document.querySelector('#success-message');
const timerDisplay = document.querySelector('#timer');

let timerInterval;
let submittedText = '';

async function generatePrompt() {
    try {
        const response = await fetch('/api/generate-prompt');
        if (!response.ok) {
            throw new Error('Failed to generate prompt');
        }
        const data = await response.json();
        return data.prompt;
    } catch (error) {
        console.error('Error generating prompt:', error);
        return 'Error generating prompt. Please try again.';
    }
}

function init() {
    if (!promptOutput || !generatePromptBtn || !submitResponseBtn || !userResponseInput || !successMessageDisplay || !timerDisplay) {
        console.error('One or more required elements are missing.');
        return;
    }

    generatePromptBtn.addEventListener('click', async () => {
        const prompt = await generatePrompt();
        promptOutput.textContent = prompt;
        userResponseInput.value = '';
        successMessageDisplay.style.display = 'none';
        startTimer(300, timerDisplay);
        document.getElementById("character-count").innerHTML = "Characters: 0";
    });

    submitResponseBtn.addEventListener('click', async () => {
        const currentPrompt = promptOutput.textContent;
        const response = userResponseInput.value;
        
        try {
            await analyzeResponse(currentPrompt, response);
            successMessageDisplay.textContent = 'Great job! Look at you, such a natural!';
            successMessageDisplay.style.display = 'block';
            clearInterval(timerInterval);
            document.getElementById('copyToClipboard').style.display = 'block';
            submittedText = response;
            
            // Also send to Google Form if needed
            await sendDataToGoogleForm(currentPrompt, response);
        } catch (error) {
            console.error('Error:', error);
            successMessageDisplay.textContent = 'Oops! Something went wrong. Please try again.';
            successMessageDisplay.style.display = 'block';
        }
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

    async function analyzeResponse(prompt, text) {
        const response = await fetch('/api/analyze-response', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt, text })
        });
        
        if (!response.ok) {
            throw new Error('Failed to analyze response');
        }
        
        const data = await response.json();
        return data.feedback;
    }

    async function sendDataToGoogleForm(prompt, response) {
        const url = `/api/submitForm?text=${encodeURIComponent(response)}&prompt=${encodeURIComponent(prompt)}`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`${response.status}: ${response.statusText}`);
        }
        return response.json();
    }
}

init();

document.getElementById('copyToClipboard').addEventListener('click', () => {
    navigator.clipboard.writeText(submittedText).then(() => {
        console.log('Text copied to clipboard');
    }).catch((error) => {
        console.error('Error copying text:', error);
    });
});

document.getElementById("user-response-input").addEventListener("input", function () {
    const inputText = this.value;
    const characterCount = inputText.length;
    document.getElementById("character-count").innerHTML = "Characters: " + characterCount;
});
