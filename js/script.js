const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');
const imageInput = document.getElementById('imageInput');
const topTextInput = document.getElementById('topText');
const bottomTextInput = document.getElementById('bottomText');
const fontFamilySelect = document.getElementById('fontFamily');
const fontSizeSelect = document.getElementById('fontSize');
const textColorInput = document.getElementById('textColor');
const downloadBtn = document.getElementById('downloadBtn');

let currentImage = null;

// Handle image upload
imageInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                currentImage = img;
                // Set canvas dimensions to match the image
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                drawMeme();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Handle drag and drop
const uploadSection = document.querySelector('.upload-section');
uploadSection.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadSection.style.border = '2px dashed #1a73e8';
});

uploadSection.addEventListener('dragleave', () => {
    uploadSection.style.border = 'none';
});

uploadSection.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadSection.style.border = 'none';
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        imageInput.files = e.dataTransfer.files;
        const event = new Event('change');
        imageInput.dispatchEvent(event);
    }
});

// Update meme when any input changes
[topTextInput, bottomTextInput, fontFamilySelect, fontSizeSelect, textColorInput].forEach(input => {
    input.addEventListener('input', drawMeme);
});

function drawMeme() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw image if exists
    if (currentImage) {
        ctx.drawImage(currentImage, 0, 0, canvas.width, canvas.height);
        
        // Calculate font size based on image dimensions
        const baseFontSize = parseInt(fontSizeSelect.value);
        const scaleFactor = Math.min(canvas.width, canvas.height) / 500; // Base scale on 500px reference
        const fontSize = Math.round(baseFontSize * scaleFactor);
        
        // Set text style
        const fontFamily = fontFamilySelect.value;
        ctx.font = `${fontSize}px ${fontFamily}`;
        ctx.fillStyle = textColorInput.value;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = fontSize / 15;
        ctx.textAlign = 'center';
        
        // Draw top text
        if (topTextInput.value) {
            const topY = fontSize + (canvas.height * 0.05); // 5% padding from top
            ctx.fillText(topTextInput.value, canvas.width/2, topY);
            ctx.strokeText(topTextInput.value, canvas.width/2, topY);
        }
        
        // Draw bottom text
        if (bottomTextInput.value) {
            const bottomY = canvas.height - (canvas.height * 0.05) - fontSize/2; // 5% padding from bottom
            ctx.fillText(bottomTextInput.value, canvas.width/2, bottomY);
            ctx.strokeText(bottomTextInput.value, canvas.width/2, bottomY);
        }
    }
}

// Handle download
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'meme.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});
