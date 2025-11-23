import { MXCreativeConsole } from './mx-creative-console.js';
import { LogitechHapticDriver } from './logitech-haptic-driver.js';

const mx = new MXCreativeConsole();
const mx4 = new LogitechHapticDriver();
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
            // Hard-coded haptic feedback
            if (mx4 && mx4.connectedDevice) {
                try {
                    await mx4.triggerHaptic(1); // or some effect ID
                } catch (err) {
                    console.error("Haptic failed:", err);
                }
            }
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

async function vibratePattern() {
    //if (!mx4 || !mx4.triggerHaptic) return;
    console.log("here!!")
    // 3 vibrations
    for (let i = 0; i < 3; i++) {
        await mx4.triggerHaptic(1);
        await new Promise(r => setTimeout(r, 80));  // tiny delay between pulses
    }

    // Wait 0.25s
    await new Promise(r => setTimeout(r, 250));

    // Another 3 vibrations
    for (let i = 0; i < 3; i++) {
        await mx4.triggerHaptic(1);
        await new Promise(r => setTimeout(r, 80));
    }
}

// Press handeling - the fun logic 
async function handleCorrectPress() {
    if (cooldown) return;

    pressCount++;

    if (pressCount % 2 === 1) {
        flashActive = true;
        flashLoop(); // begin flashing
        vibratePattern();
        console.log('in the correct press')
        pickNewTarget();

    } else {
        flashActive = false;
        await stopAllFlashing();
        await beginCooldown();
    }
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


// Buttons
document.getElementById('connectBtn').addEventListener('click', () => {
    mx.connect().catch(e => alert(e.message));
});

document.getElementById('connectMouseBtn').onclick = async () => {
    const btn = document.getElementById('connectMouseBtn');
    try {
        const device = await mx4.connect();
        console.log("Connected to MX Master 4:", device.productName);
        btn.disabled = true;
        btn.textContent = `Connected: ${device.productName}`;
        // Optional: vibrate to confirm connection
        await mx4.triggerHaptic(1);

    } catch (err) {
        console.error("MX4 connection failed:", err);
    }
};


// Init
pickNewTarget();
showTarget();