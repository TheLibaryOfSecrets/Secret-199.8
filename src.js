const CORRECT_USERNAME = 'fcb2d2bd68defbbb80b7662b17764db452c941776df0a6e7b378b7eda0d452df';
const CORRECT_PASSWORD = 'b6ccc7403d52911633af5a4376e410f781709fee33a12afba2ac9cc60c35cf0c';
const encodedUrl = ['MVZMYUhob0tyS2JaUFcxM1BNYWg3T3h3c3REcDVUXzcxd0Y3YjZKNWxaYk0vZWRpdD91c3A9c2hhcmluZw=='];
let puzzleStage = 1;

function decodeBase64(encodedStr) {
    return atob(encodedStr);
}

function stringToBinary(str) {
    return str.split('').map(char => 
        char.charCodeAt(0).toString(2).padStart(8, '0')
    ).join(' ');
}

async function hashSHA256(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

const encodedAnswers = {
    1: "5800768b32a54c54c82b8db4629339e8f830efdc3591fab146297ee1aab2bf8a",
    2: 'f106376011688eda079ceb77accc1e24b0761bc383f6d209d1065e709aa056f2'
};

window.showLoginPage = function() {
    document.querySelector('.content').style.display = 'none';
    document.getElementById('login-container').style.display = 'block';
};

window.validateLogin = async function() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Validate login
    if (await hashSHA256(username) === CORRECT_USERNAME && await hashSHA256(password) === CORRECT_PASSWORD) {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('puzzle-container').style.display = 'block';
    } else {
        alert('lmao, you\'ll never get this');
    }
};

window.validateAnswer = async function() {
    const userInput = document.getElementById('puzzle-input').value.toLowerCase().trim();
    hashed = await hashSHA256(userInput)
    if(puzzleStage === 1) { 
        if(hashed === encodedAnswers[1]) { //what is something that pilots aren't afraid of, but most are?
            puzzleStage = 2;
            document.getElementById('puzzle-text').innerHTML = 
                "Stage 2 (hmmmmmmmmmmmm)"; //the secret lies  
            document.getElementById('puzzle-input').value = '';
        }
    } else if(puzzleStage === 2) {
        if(hashed === encodedAnswers[2]) {
            const redirectUrl = decodeBase64(encodedUrl[0]);
            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 500);
        }
    }
};

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', function(e) {
    if(e.ctrlKey && (e.keyCode === 85 || e.keyCode === 83 || e.keyCode === 73)) {
        e.preventDefault();
        return false;
    }
});

setInterval(() => {
    const start = performance.now();
    const end = performance.now();
    if(end - start > 100) {
        puzzleStage = 1;
    }
}, 1000);

const originalLog = console.log;
console.log = function() {
    if(arguments[0] !== "woah.... what is this?!" && 
        arguments[0] !== "19-8-5 19-5-3-18-5-20 12-9-5-19 23-9-20-8-9-14" &&
        arguments[0] !== "Nice try...") {
        return;
    }
    originalLog.apply(console, arguments);
};