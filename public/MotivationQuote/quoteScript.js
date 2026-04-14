// Message Generator Program
const quotes = [
  "The only way to do great work is to love what you do.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "Don’t watch the clock; do what it does. Keep going.",
  "Success is not final, failure is not fatal: It is the courage to continue that counts.",
  "Your time is limited, so don’t waste it living someone else’s life.",
  "The best way to predict the future is to create it.",
  "It does not matter how slowly you go as long as you do not stop.",
  "Believe you can and you’re halfway there.",
  "Hard work beats talent when talent doesn’t work hard.",
  "You miss 100% of the shots you don’t take.",
  "I am not a product of my circumstances. I am a product of my decisions.",
  "The man who has confidence in himself gains the confidence of others.",
  "Start where you are. Use what you have. Do what you can."
];

const people = [
  "Steve Jobs",
  "Eleanor Roosevelt",
  "Sam Levenson",
  "Winston Churchill",
  "Steve Jobs",
  "Peter Drucker",
  "Confucius",
  "Theodore Roosevelt",
  "Tim Notke",
  "Wayne Gretzky",
  "Stephen Covey",
  "Hasidic Proverb",
  "Arthur Ashe"
];

let previousIndex = -1;

function getRandomIndex(array) {
  let index;
  do {
    index = Math.floor(Math.random() * array.length);
  } while (index === previousIndex);
  previousIndex = index;
  return index;
}

function generateMessage() {
  let index = getRandomIndex(quotes);
  const randomQuote = quotes[index];
  const randomPerson = people[index];

  return `"${randomQuote}" - ${randomPerson}`;
}

function showMessage() {
  const message = generateMessage();
  const quoteElement = document.querySelector('.quote-display');
  if (quoteElement) {
    quoteElement.innerHTML = message;
    quoteElement.classList.add('has-quote');
  }
}

function clearMessage() {
  const quoteElement = document.querySelector('.quote-display');
  if (quoteElement) {
    quoteElement.innerHTML = '<em style="color: var(--color-text-subtle);">Hit &ldquo;Generate&rdquo; for your quote...</em>';
    quoteElement.classList.remove('has-quote');
  }
}

// Add event listener to the buttons
document.getElementById('generateButton').addEventListener('click', showMessage);
document.getElementById('deleteButton').addEventListener('click', clearMessage);