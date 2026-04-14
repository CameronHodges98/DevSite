// Message Generator Program
const quotes = [
  "The only way to do great work is to love what you do.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "Don't watch the clock; do what it does. Keep going.",
  "Success is not final, failure is not fatal: It is the courage to continue that counts.",
  "Your time is limited, so don’t waste it living someone else’s life.",
  "The best way to predict the future is to create it."
];

const people = [
  "Steve Jobs",
  "Eleanor Roosevelt",
  "Sam Levenson",
  "Winston Churchill",
  "Steve Jobs",
  "Peter Drucker"
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