const API_URL = "https://quiz-mci6.onrender.com/explain";

const questions = [
  { sn:1, qn:'KE in SHM is maximum when displacement is __', op1:'Amplitude', op2:'Amplitude/4', op3:'Amplitude/2', op4:'Zero', ans:'op4' },
  { sn:2, qn:'Height of water in a capillary tube at 4 C is', op1:'Maximum', op2:'Minimum', op3:'Cannot be said', op4:'Zero', ans:'op2' }
];

let currentQuestion = 0;
let answered = {};
let shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);

const questionText = document.getElementById("questionText");
const optionsDiv = document.getElementById("options");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const explanationBox = document.getElementById("explanationBox");

function loadQuestion(index) {
  const q = shuffledQuestions[index];
  questionText.textContent = q.qn;
  optionsDiv.innerHTML = "";

  for (let i = 1; i <= 4; i++) {
    const btn = document.createElement("button");
    btn.textContent = q[`op${i}`];

    if (answered[q.sn]) {
      const chosen = answered[q.sn];
      if (`op${i}` === q.ans) btn.classList.add("correct");
      else if (`op${i}` === chosen && chosen !== q.ans) btn.classList.add("wrong");
      btn.disabled = true;
    }

    btn.addEventListener("click", () => {
      if (!answered[q.sn]) {
        answered[q.sn] = `op${i}`;
        showAnswer(q, btn);
        getExplanation(q);
      }
    });

    optionsDiv.appendChild(btn);
  }

  prevBtn.disabled = index === 0;
  nextBtn.disabled = index === shuffledQuestions.length - 1;
}

function showAnswer(q, clickedBtn) {
  const optionBtns = optionsDiv.querySelectorAll("button");
  optionBtns.forEach((btn, i) => {
    const opKey = `op${i+1}`;
    if (opKey === q.ans) btn.classList.add("correct");
    if (btn === clickedBtn && opKey !== q.ans) btn.classList.add("wrong");
    btn.disabled = true;
  });
}

async function getExplanation(q) {
  explanationBox.textContent = "⏳ Generating explanation...";
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: q.qn, correctAnswer: q[q.ans] })
    });
    const data = await response.json();
    explanationBox.textContent = "💡 " + data.explanation;
  } catch (err) {
    explanationBox.textContent = "⚠️ Failed to load explanation.";
  }
}

prevBtn.addEventListener("click", () => {
  if (currentQuestion > 0) {
    currentQuestion--;
    loadQuestion(currentQuestion);
  }
});

nextBtn.addEventListener("click", () => {
  if (currentQuestion < shuffledQuestions.length - 1) {
    currentQuestion++;
    loadQuestion(currentQuestion);
  }
});

loadQuestion(currentQuestion);
