const introText = document.querySelector('#intro-text');
const promptOutput = document.querySelector('#prompt-output');
const generatePromptBtn = document.querySelector('#generate-prompt-btn');
const submitResponseBtn = document.querySelector('#submit-response-btn');
const userResponseInput = document.querySelector('#user-response-input');
const successMessageDisplay = document.querySelector('#success-message');
const timerDisplay = document.querySelector('#timer');

const proxyUrl = 'https://creative-block-buster.vercel.app/api/submit-form';

let timerInterval;
let submittedText = '';

const textLines = [
  "Welcome to the Creative Block Buster!", 
  "Our prompts are designed to help you blast through writer's block and ignite your creativity.",
  "Just 5 minutes is all it takes to get your creative juices flowing.",
  "Hit the button and let the wordsmithing begin!",
];


let lineIndex = 0;

function showIntroText() {
    introText.innerHTML = textLines.map(line => "<p>" + line + "</p>").join('');
    const hiddenElements = document.querySelectorAll('.hide-initially');
    hiddenElements.forEach(element => {
        element.classList.remove('hide-initially');
    });
}

window.addEventListener('DOMContentLoaded', showIntroText);

// Rest of the script


async function generatePrompt() {
    try {
        const response = await fetch('https://creative-block-buster.vercel.app/api/generate-prompt');
        const data = await response.json();
        
        if (data.error) {
            console.error('Error generating prompt:', data.error);
            return 'Sorry, there was an error generating your prompt. Please try again.';
        }
        
        return data.prompt;
    } catch (error) {
        console.error('Error:', error);
        return 'Sorry, there was an error generating your prompt. Please try again.';
    }
}

function init() {
    if (!promptOutput || !generatePromptBtn || !submitResponseBtn || !userResponseInput || !successMessageDisplay || !timerDisplay) {
        console.error('One or more required elements are missing.');
        return;
    }

    generatePromptBtn.addEventListener('click', async () => {
        promptOutput.textContent = 'Generating your prompt...';
        userResponseInput.value = '';
        successMessageDisplay.style.display = 'none';
        startTimer(300, timerDisplay);
        document.getElementById("character-count").innerHTML = "Characters: 0";

        const promptText = await generatePrompt();
        promptOutput.textContent = '';

        // Animation for prompt text
        let i = 0;
        const speed = 50;
        function typeWriter() {
            if (i < promptText.length) {
                promptOutput.textContent += promptText.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            }
        }
        typeWriter();
    });

    submitResponseBtn.addEventListener('click', async () => {
        clearInterval(timerInterval);
        submittedText = userResponseInput.value;
        const currentPrompt = promptOutput.textContent;
        
        // Show loading message
        successMessageDisplay.textContent = 'Analyzing your masterpiece...';
        successMessageDisplay.style.display = 'block';
        
        try {
            // Get AI feedback
            const response = await fetch('/api/analyze-response', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: currentPrompt,
                    text: submittedText
                })
            });
            
            const data = await response.json();
            
            if (data.error) {
                successMessageDisplay.textContent = 'Great job! Look at you, such a natural!';
            } else {
                successMessageDisplay.textContent = data.feedback;
            }
            
            // If there's text, send to Google Form
            if (submittedText.trim()) {
                sendDataToGoogleForm(currentPrompt, submittedText);
            }
            
            document.getElementById('copyToClipboard').style.display = 'block';
            
        } catch (error) {
            console.error('Error:', error);
            successMessageDisplay.textContent = 'Great job! Look at you, such a natural!';
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
        
    // Update the progress bar
        const progressBar = document.getElementById('timer-progress-bar');
        const progressPercentage = (timeRemaining / 300) * 100; // Adjust 300 to your timer's duration
        progressBar.style.width = progressPercentage + '%';
    }

    function sendDataToGoogleForm(prompt, response) {
        const url = '/api/submitForm';
        
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: response,
                prompt: prompt
            })
        })
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

    // Add share button listener only if element exists
    const shareButton = document.getElementById('shareImage');
    if (shareButton) {
        shareButton.addEventListener('click', generateShareImage);
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

async function generateShareImage() {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    
    // Create container for share card
    const container = document.createElement('div');
    container.className = 'share-card-container';
    
    const template = document.getElementById('share-image-template');
    template.querySelector('.share-prompt').textContent = promptOutput.textContent;
    template.querySelector('.share-response').textContent = submittedText;
    
    const templateClone = template.cloneNode(true);
    templateClone.style.display = 'block';
    
    const closeButton = document.createElement('button');
    closeButton.className = 'close-lightbox';
    closeButton.innerHTML = '×';
    closeButton.onclick = () => lightbox.remove();
    
    const shareButtons = document.createElement('div');
    shareButtons.className = 'share-buttons';
    
    // Wait for assets to load
    setTimeout(async () => {
        try {
            const card = templateClone.querySelector('.share-card');
            
            // Set specific dimensions for capture
            const captureWidth = 1200; // Doubled for better quality
            const captureHeight = 1200;
            
            const canvas = await html2canvas(card, {
                scale: 2, // Increased scale for better quality
                width: captureWidth / 2,
                height: captureHeight / 2,
                backgroundColor: null,
                logging: true,
                onclone: function(clonedDoc) {
                    const clonedCard = clonedDoc.querySelector('.share-card');
                    // Ensure consistent styling for capture
                    clonedCard.style.width = `${captureWidth/2}px`;
                    clonedCard.style.height = `${captureHeight/2}px`;
                    
                    // Force logo loading
                    const logos = clonedDoc.getElementsByClassName('share-logo');
                    Array.from(logos).forEach(logo => {
                        logo.src = logo.src;
                    });
                }
            });
            
            const image = canvas.toDataURL('image/png', 1.0); // Maximum quality
            
            // Update share buttons
            shareButtons.innerHTML = `
                <button class="share-button" id="downloadImage">
                    <i class="fas fa-download"></i> Download
                </button>
                <button class="share-button" id="twitterShare">
                    <i class="fab fa-twitter"></i> Twitter
                </button>
                <button class="share-button" id="facebookShare">
                    <i class="fab fa-facebook"></i> Facebook
                </button>
            `;
            
            // Add click handlers
            shareButtons.querySelector('#downloadImage').onclick = () => {
                const link = document.createElement('a');
                link.download = 'my-micro-masterpiece.png';
                link.href = image;
                link.click();
            };
            
            // ... rest of the share button handlers ...
            
        } catch (error) {
            console.error('Error generating image:', error);
        }
    }, 500);
    
    // Add everything to container
    container.appendChild(templateClone);
    container.appendChild(shareButtons);
    
    // Add container and close button to lightbox
    lightbox.appendChild(closeButton);
    lightbox.appendChild(container);
    
    // Add lightbox to page
    document.body.appendChild(lightbox);
    setTimeout(() => lightbox.classList.add('active'), 10);
}

// Update the submit button event listener to include image generation
submitResponseBtn.addEventListener('click', async () => {
    // ... existing submit button code ...
    
    // After successful submission, show the share image button
    document.getElementById('shareImage').style.display = 'block';
});

// Add click handler for share image button
document.getElementById('shareImage').addEventListener('click', generateShareImage);

