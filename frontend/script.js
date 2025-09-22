const API_URL = "https://quiz-mci6.onrender.com/explain";

const questions = [
    {sn:1, qn:'KE in SHM is maximum when its displacement is', op1:'Amplitude', op2:'Amplitude/4', op3:'Amplitude/2', op4:'Zero', ans:'op4'},
    {sn:2, qn:'Height of water in a capillary tube at 4 C is', op1:'Maximum', op2:'Minimum', op3:'Cannot be said', op4:'Zero', ans:'op2'},
    {sn:3, qn:'When Temperature of ideal gas is doubled its rms speed increases by', op1:'sqrt(2)', op2:'2', op3:'1/sqrt(2)', op4:'1/2', ans:'op1'},
    {sn:4, qn:'When light passes through glass slab ', op1:'Wavelength Decreases', op2:'Wavelength Increases', op3:'Frequency Decreases', op4:'Frequency increases', ans:'op1'},
    {sn:5, qn:'When a charge moves in a direction perpendicular to magnetic field then', op1:'KE is constant and momentum changes', op2:'Momentum is constant and KE changes', op3:'Both KE and momentum changes', op4:'Both velocity and momentum are constant', ans:'op1'},
    {sn:6, qn:'Mass of positron is same as mass of ____', op1:'Proton', op2:'Electron', op3:'Neutron', op4:'Nutrino', ans:'op2'},
    {sn:7, qn:'Water is used as coolant because of', op1:'Low specific heat capacity', op2:'High specific heat capacity', op3:'Universal solvent', op4:'Anamolous expansion', ans:'op2'},
    {sn:8, qn:'Unit of coefficient of thermal conductivity is', op1:'Watt K/m', op2:'Watt Km', op3:'Watt/Km', op4:'Joule/s', ans:'op3'},
    {sn:9, qn:'Soft iron is used as core of transformer because of', op1:'High Hysteresis and High Permeability', op2:'High Hysteresis and Low permeability', op3:'Low Hysteresis and High Permeability', op4:'Low Hysteresis and Low permeability', ans:'op4'},
    {sn:10, qn:'Power Dissipition in AC circuit depends upon', op1:'Inductance', op2:'Resistance', op3:'Capacitance', op4:'Impedence', ans:'op2'},
    {sn:11, qn:'When frequency of incident light is increased ', op1:'Photo Current Increases', op2:'KE of electron increases', op3:'Stopping potential increases', op4:'Photo current decreases', ans:'op2'},
    {sn:12, qn:'The dimension of Impulse is ', op1:'[MLT^-2]', op2:'[MLT^-1]', op3:'[ML^2T-2]', op4:'[M^2LT^-1]', ans:'op2'},
    





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
  explanationBox.textContent = " Generating explanation...";
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: q.qn, correctAnswer: q[q.ans] })
    });
    const data = await response.json();
    explanationBox.textContent = data.explanation;
  } catch (err) {
    explanationBox.textContent = "Failed to load explanation.";
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
