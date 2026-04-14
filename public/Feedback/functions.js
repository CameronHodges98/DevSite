import { db } from "../js/firebase-config.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

async function handleSubmit(e) {
  e.preventDefault();

  const company = document.getElementById('companyName').value.trim();
  const message = document.getElementById('comments').value.trim();
  const btn = e.target.querySelector('button[type="submit"]');

  btn.disabled = true;
  btn.textContent = 'Sending…';

  try {
    await addDoc(collection(db, 'contact_submissions'), {
      company,
      message,
      timestamp: serverTimestamp()
    });
    window.location.href = './thanks.html';
  } catch (err) {
    console.error('Firestore write failed:', err);
    btn.disabled = false;
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
      Send Message
    `;
    alert('Something went wrong. Please try again or email me directly at chodges98@gmail.com');
  }
}

document.getElementById('feedbackForm').addEventListener('submit', handleSubmit);
