const introText = document.querySelector('#intro-text');
const promptOutput = document.querySelector('#prompt-output');
const generatePromptBtn = document.querySelector('#generate-prompt-btn');
const submitResponseBtn = document.querySelector('#submit-response-btn');
const userResponseInput = document.querySelector('#user-response-input');
const successMessageDisplay = document.querySelector('#success-message');
const timerDisplay = document.querySelector('#timer');

let timerInterval;
let submittedText = '';

const textLines = [
    "Welcome to the Creative Block Buster!", 
    "Our prompts are designed to help you blast through writer's block and ignite your creativity.",
    "Just 5 minutes is all it takes to get your creative juices flowing.",
    "Hit the button and let the wordsmithing begin!",
];

function showIntroText() {
    introText.innerHTML = textLines.map(line => "<p>" + line + "</p>").join('');
    const hiddenElements = document.querySelectorAll('.hide-initially');
    hiddenElements.forEach(element => {
        element.classList.remove('hide-initially');
    });
}

window.addEventListener('DOMContentLoaded', showIntroText);

async function generatePrompt() {
    generatePromptBtn.classList.add('loading');
    try {
        const response = await fetch('/api/generate-prompt');
        const data = await response.json();
        
        if (data.error) {
            console.error('Error generating prompt:', data.error);
            return 'Sorry, there was an error generating your prompt. Please try again.';
        }
        
        return data.prompt;
    } catch (error) {
        console.error('Error:', error);
        return 'Sorry, there was an error generating your prompt. Please try again.';
    } finally {
        generatePromptBtn.classList.remove('loading');
    }
}

function init() {
    if (!promptOutput || !generatePromptBtn || !submitResponseBtn || !userResponseInput || !successMessageDisplay || !timerDisplay) {
        console.error('One or more required elements are missing.');
        return;
    }

    // Add input animations
    userResponseInput.addEventListener('focus', () => {
        userResponseInput.style.transform = 'scale(1.01)';
    });

    userResponseInput.addEventListener('blur', () => {
        userResponseInput.style.transform = 'scale(1)';
    });

    generatePromptBtn.addEventListener('click', async () => {
        promptOutput.textContent = 'Generating your prompt...';
        userResponseInput.value = '';
        successMessageDisplay.style.display = 'none';
        startTimer(300, timerDisplay);
        document.getElementById("character-count").innerHTML = "Characters: 0";

        const promptText = await generatePrompt();
        promptOutput.textContent = '';
        promptOutput.style.opacity = '0';

        // Animation for prompt text
        let i = 0;
        const speed = 50;
        function typeWriter() {
            if (i < promptText.length) {
                if (i === 0) promptOutput.style.opacity = '1';
                promptOutput.textContent += promptText.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            }
        }
        typeWriter();
    });

    submitResponseBtn.addEventListener('click', async () => {
        if (!userResponseInput.value.trim()) {
            userResponseInput.classList.add('shake');
            setTimeout(() => userResponseInput.classList.remove('shake'), 500);
            return;
        }

        submitResponseBtn.classList.add('loading');
        clearInterval(timerInterval);
        submittedText = userResponseInput.value;
        const currentPrompt = promptOutput.textContent;
        
        // Show loading state
        const feedbackContent = document.getElementById('feedback-content');
        console.log('Feedback content element:', feedbackContent);
        console.log('Success message element:', successMessageDisplay);
        
        feedbackContent.textContent = 'Analyzing your creative masterpiece...';
        successMessageDisplay.style.display = 'block';  // Force display block
        
        try {
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
            console.log('Response data:', data);
            
            if (data.error) {
                feedbackContent.textContent = 'Great job! Look at you, such a natural!';
            } else {
                feedbackContent.textContent = data.feedback;
            }
            
            // Show action buttons
            const copyBtn = document.getElementById('copyToClipboard');
            const shareBtn = document.getElementById('shareImage');
            copyBtn.style.display = 'block';
            shareBtn.style.display = 'block';
            
        } catch (error) {
            console.error('Error:', error);
            feedbackContent.textContent = 'Great job! Look at you, such a natural!';
        } finally {
            submitResponseBtn.classList.remove('loading');
        }
    });

    function startTimer(duration, display) {
        clearInterval(timerInterval);
        let timeRemaining = duration;
        
        // Get the timer progress circle
        const timerProgress = document.querySelector('.timer-progress');
        const circumference = 2 * Math.PI * parseFloat(timerProgress.getAttribute('r'));
        timerProgress.style.strokeDasharray = circumference;
        
        // Initial state
        tick(display, timeRemaining, circumference, duration);
        
        timerInterval = setInterval(() => {
            timeRemaining -= 1;
            tick(display, timeRemaining, circumference, duration);
            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                display.textContent = "Time's up!";
                timerProgress.style.strokeDashoffset = circumference; // Empty circle
            }
        }, 1000);
    }

    function tick(display, timeRemaining, circumference, duration) {
        const minutes = parseInt(timeRemaining / 60, 10);
        const seconds = parseInt(timeRemaining % 60, 10);
        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
        const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
        display.textContent = formattedMinutes + ':' + formattedSeconds;
        
        // Update the circular progress
        const timerProgress = document.querySelector('.timer-progress');
        const progressPercentage = timeRemaining / duration;
        const dashoffset = circumference * (1 - progressPercentage);
        timerProgress.style.strokeDashoffset = dashoffset;
    }

    // Character counter
    userResponseInput.addEventListener('input', function() {
        const characterCount = this.value.length;
        document.getElementById('character-count').innerHTML = 'Characters: ' + characterCount;
    });
}

init();

// Copy to clipboard functionality
document.getElementById('copyToClipboard').addEventListener('click', () => {
    navigator.clipboard.writeText(submittedText)
        .then(() => {
            const button = document.getElementById('copyToClipboard');
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i><span>Copied!</span>';
            setTimeout(() => {
                button.innerHTML = originalText;
            }, 2000);
        })
        .catch(error => console.error('Error copying text:', error));
}); 