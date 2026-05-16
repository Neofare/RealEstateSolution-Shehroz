const searchPhrases = [
    "Search villas in Faisalabad...",
    "Search apartments in Lahore...",
    "Search family houses...",
    "Search by city, type, or title...",
    "Find your dream home..."
];

let phraseIndex = 0;
let characterIndex = 0;
let isDeleting = false;
let isFocused = false;
let typingSpeed = 80;

function animateSearchPlaceholder() {
    const input = document.getElementById("homeSearchInput");

    if (!input) return;

    if (isFocused || input.value.trim() !== "") {
        return;
    }

    const currentPhrase = searchPhrases[phraseIndex];

    if (!isDeleting) {
        input.placeholder = currentPhrase.substring(0, characterIndex + 1);
        characterIndex++;

        if (characterIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 1200;
        } else {
            typingSpeed = 80;
        }
    } else {
        input.placeholder = currentPhrase.substring(0, characterIndex - 1);
        characterIndex--;

        if (characterIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % searchPhrases.length;
            typingSpeed = 300;
        } else {
            typingSpeed = 40;
        }
    }

    setTimeout(animateSearchPlaceholder, typingSpeed);
}

document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("homeSearchInput");

    if (!input) return;

    input.addEventListener("focus", () => {
        isFocused = true;
        input.placeholder = "Type city, property type, or title...";
    });

    input.addEventListener("blur", () => {
        isFocused = false;

        if (input.value.trim() === "") {
            characterIndex = 0;
            isDeleting = false;
            animateSearchPlaceholder();
        }
    });

    input.addEventListener("input", () => {
        if (input.value.trim() !== "") {
            input.placeholder = "";
        }
    });

    animateSearchPlaceholder();
});