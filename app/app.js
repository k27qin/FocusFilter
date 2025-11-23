import { MXCreativeConsole } from './mx-creative-console.js';

const mx = new MXCreativeConsole();
//const gridEl = document.getElementById('grid');
const logEl = document.getElementById('log');

// Needed for colour randomizer
//let targetLetter = getRandomLetter();

const TARGET_POOL = [
    ...'abcdefghijklmnopqrstuvwxyz'.split(''),     // keyboard letters
    ...Array.from({ length: 9 }, (_, i) => ({ mx: i })) // MX keys
];

let flashActive = false;
//let flashStop = false;
let target = null;//getRandomTarget();
let cooldown = false;
//let waitingForStartPress = true;
let pressCount = 0;

// debugging
function showTarget() {
    logEl.innerText = `TARGET: ${typeof target === "string" ? target : `MX ${target.mx}`}`;
}
mx.addEventListener("keydown", (e) => {
    console.log("MX Key pressed:", e.detail.key);
});

// Start

function pickNewTarget() {
    target = TARGET_POOL[Math.floor(Math.random() * TARGET_POOL.length)];
    showTarget();
}

// Flashing
async function flashLoop(delay = 80) {
    if (!flashActive) return;

    while (flashActive) {
        for (let i = 0; i < 9; i++) {
            setSolidColor(i, Math.random() * 360);
        }
        await new Promise(r => setTimeout(r, delay));
    }
    stopAllFlashing();
}

// set flash to a solid color
function setSolidColor(keyIndex, hue) {
    return new Promise(resolve => {
        const size = 118;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        if (hue === -1) {
            // off state
            ctx.fillStyle = '#000000'
        }
        else {
            ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
        }

        ctx.fillRect(0, 0, size, size);

        canvas.toBlob(blob => {
            mx.setKeyImage(keyIndex, blob);
            setTimeout(resolve, 10);
        }, 'image/jpeg', 0.9);
    });
}

async function stopAllFlashing() {
    // Set all keys to a default color (black/off)
    for (let i = 0; i < 9; i++) {
        console.log(`Setting key ${i} to black`);
        await setSolidColor(i, -1);
    }
    await new Promise(r => setTimeout(r, 50));
}
// 60 Second cool down
async function beginCooldown() {
    cooldown = true;
    flashActive = false;  // ensure flashing stops
    await new Promise(r => setTimeout(r, 40));
    stopAllFlashing();
    await new Promise(r => setTimeout(r, 60000)); // 60 seconds
    cooldown = false;

    // Pick new target AFTER cooldown ends
    pickNewTarget();
    //waitingForStartPress = true;  // must press target to start flashing again
}

// Press handeling - the fun logic 
async function handleCorrectPress() {
    if (cooldown) return;

    pressCount++;

    if (pressCount % 2 === 1) {
        flashActive = true;
        flashLoop(); // begin flashing
        pickNewTarget();

    } else {
        flashActive = false;
        await stopAllFlashing();
        await beginCooldown();
    }

    /*
    if (waitingForStartPress) {
        // FIRST CORRECT PRESS -> START FLASHING
        waitingForStartPress = false;
        
        // Pick NEXT target
        pickNewTarget();

        
    } else {
        // SECOND CORRECT PRESS -> STOP FLASHING + COOLDOWN
        
    }*/
}

// images
function setKeyImageFromSrc(keyIndex, src) {
    return new Promise((resolve, reject) => {
        const size = 118;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        const img = new Image();
        img.onload = () => {
            // Draw the image to fill the canvas
            ctx.drawImage(img, 0, 0, size, size);
            canvas.toBlob(blob => {
                mx.setKeyImage(keyIndex, blob);
                setTimeout(resolve, 10); // tiny delay for MX to render
            }, 'image/jpeg', 0.9);
        };
        img.onerror = reject;
        img.src = src;
    });
}


// Keyboard event
document.addEventListener("keydown", (e) => {
    if (!target || cooldown) return;

    const key = e.key.toLowerCase();

    if (typeof target === "string" && target === key) {
        handleCorrectPress();
    }
});

// ---- MX KEYPAD EVENT ----
mx.addEventListener("keydown", (e) => {
    if (!target || cooldown) return;

    const keyIndex = e.detail.key;

    if (typeof target === "object" && target.mx === keyIndex) {
        handleCorrectPress();
    }
});

// Connection
mx.addEventListener('connected', (e) => {
    logEl.innerText = `Connected: ${e.detail.device.productName}`;
    document.getElementById('connectBtn').disabled = true;

    pickNewTarget();
    showTarget();
});

// Button
document.getElementById('connectBtn').addEventListener('click', () => {
    mx.connect().catch(e => alert(e.message));
});


// Init
pickNewTarget();
showTarget();


// --- UI Setup ---

/*
// Remove this
for (let i = 0; i < 9; i++) {
    const div = document.createElement('div');
    div.className = 'key';
    div.id = `key-${i}`;
    div.innerText = i + 1;
    div.onclick = () => updateButtonImage(i);
    gridEl.appendChild(div);
}
*/

// Keep this

/*
// Remove this - Wait don't. We are needed clicking device
mx.addEventListener('keydown', (e) => {
    if (!target || flashStop) return;
    const keyIndex = e.detail.key;

    if (typeof target === 'number' && keyIndex === target) {
        //console.log("Correct MX key!");
        flashStop = true;
        chooseNewTarget();
    }

    /*
    logEl.innerText = `Key Down: ${keyIndex}`;
    const el = document.getElementById(`key-${keyIndex}`);
    if (el) el.classList.add('pressed');

    if (keyIndex < 9) updateButtonImage(keyIndex);
    */
//});

/*
// Remove this
mx.addEventListener('keyup', (e) => {
    const keyIndex = e.detail.key;
    logEl.innerText = `Key Up: ${keyIndex}`;
    const el = document.getElementById(`key-${keyIndex}`);
    if (el) el.classList.remove('pressed');
});
*/

/*
// This connects the keypad
document.getElementById('connectBtn').addEventListener('click', () => {
    mx.connect().catch(e => alert(e.message));
});

// This is what flashes
document.addEventListener("keydown", () => {
    flashColors(8, 70);
});

// -- FUNCTIONALITY --
function chooseNewTarget() {
    target = getRandomTarget();

    flashUntilCorrect(); // your UI
}

async function updateButtonImage(index, color = -1) {
    const colorHue = color >= 0 ? color : (Math.random() * 360);
    const size = 118;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = `hsl(${colorHue}, 100%, 40%)`;
    ctx.fillRect(0, 0, size, size);

    /*
    ctx.fillStyle = 'white';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(index + 1, size / 2, size / 2);
    */
/*
    canvas.toBlob((blob) => {
        mx.setKeyImage(index, blob);
    }, 'image/jpeg', 0.9);
}

async function flashUntilCorrect(delay = 80) {
    flashActive = true;
    flashStop = false;

    while (!flashStop) {
        for (let key = 0; key < 9; key++) {
            setSolidColor(key, Math.random() * 360);
        }
        await new Promise(r => setTimeout(r, delay));

        if (flashStop) break;
    }

    flashActive = false;
}




// --- TO IMPLEMENT ---

let currentColor = 'blue';

// Set initial state
/*
document.body.style.backgroundColor = currentColor;
document.body.style.color = 'white';
document.body.style.height = '100vh';
document.body.style.margin = '0';
document.body.style.display = 'flex';
document.body.style.flexDirection = 'column';
document.body.style.justifyContent = 'center';
document.body.style.alignItems = 'center';
document.body.style.fontFamily = 'Arial, sans-serif';
document.body.style.transition = 'background-color 0.3s ease';
*/
/*
// Display instructions
updateDisplay();

// Listen for key presses
document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();

    //console.log(`Pressed: ${pressedKey}, Looking for: ${targetLetter}`);
    if (!target || flashStop) return;

    if (typeof target === "string" && target === key) { //pressedKey === targetLetter) {
        // Correct key pressed - toggle color
        currentColor = currentColor === 'blue' ? 'pink' : 'blue';
        document.body.style.backgroundColor = currentColor; // SETTING COLOUR HAPPENS HERE REPLACE
        document.body.style.color = currentColor === 'blue' ? 'white' : 'black';

        // Pick a new random letter
        //targetLetter = getRandomLetter();
        chooseNewTarget();
        flashStop = true;
        updateDisplay();

        //console.log(`Correct! Color changed to ${currentColor}. Next target: ${targetLetter}`);
    } /*else {
        // Wrong key pressed
        console.log(`Wrong key! Press ${targetLetter.toUpperCase()} instead of ${pressedKey.toUpperCase()}`);
        showWrongKeyFeedback(pressedKey);
    }*/
//});

/*
// Function to get a random letter from A-Z
function getRandomLetter() {
    return TARGET_POOL[Math.floor(Math.random() * TARGET_POOL.length)];
}
*/

// Remove- Function to update the display
/*
function updateDisplay() {
    document.body.innerHTML = `
        <h1 style="font-size: 3rem; margin: 0;"> ${targetLetter.toUpperCase()}</h1>
        <p style="font-size: 1.5rem;">Press the letter <strong>${targetLetter.toUpperCase()}</strong></p>
        <p>Current color: <strong>${currentColor}</strong></p>
        <div style="margin-top: 20px; font-size: 0.9rem; opacity: 0.7;">
            Next color: ${currentColor === 'blue' ? 'pink' : 'blue'}
        </div>
    `;
}*/

// Remove - Function to show wrong key feedback
/*
function showWrongKeyFeedback(wrongKey) {
    const feedback = document.createElement('div');
    feedback.textContent = `${wrongKey.toUpperCase()} ≠ ${targetLetter.toUpperCase()}`;
    feedback.style.cssText = `
        position: fixed;
        top: 20px;
        background: rgba(255,0,0,0.8);
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        font-family: monospace;
        font-size: 1.2rem;
        animation: fadeOut 1s forwards;
    `;

    document.body.appendChild(feedback);

    // Remove after animation
    setTimeout(() => {
        if (document.body.contains(feedback)) {
            document.body.removeChild(feedback);
        }
    }, 1000);
}*/

/*
// Add fadeOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        0% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-20px); }
    }
`;
document.head.appendChild(style);

console.log('🎮 Letter Color Game Ready!');
console.log(`First target letter: ${targetLetter}`);
*/
