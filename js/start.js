// ============================================================
//  상태 변수
// ============================================================
const intro   = document.querySelector('.intro');
const qna     = document.querySelector('.qna');
const result  = document.querySelector('.result');
const qPoint  = qnaList.length;

let scores    = { E:0, I:0, N:0, S:0, F:0, T:0, P:0, J:0 };
let currentResult = null; // 최종 결과 주민 데이터

// ============================================================
//  퀴즈 시작
// ============================================================
document.querySelector('.start_btn').addEventListener('click', () => {
  scores = { E:0, I:0, N:0, S:0, F:0, T:0, P:0, J:0 };
  currentResult = null;

  intro.style.display = 'none';
  qna.style.display   = 'flex';
  result.style.display = 'none';

  showQuestion(0);
});

// ============================================================
//  질문 표시
// ============================================================
function showQuestion(qIdx) {
  if (qIdx === qPoint) {
    showResult();
    return;
  }

  const q = document.querySelector('.qArea');
  const a = document.querySelector('.aArea');
  const statusBar = document.querySelector('.status_bar');

  // 진행바 업데이트
  statusBar.style.width = ((100 / qPoint) * qIdx) + '%';

  // 질문 이미지 + 텍스트
  const qImgSrc = qnaList[qIdx].img;
  q.innerHTML = `
    <div class="qImg-wrap">
      <img class="qImg" src="${qImgSrc}" alt="질문 이미지">
    </div>
    <p class="qText">${qnaList[qIdx].q}</p>
  `;

  // 답변 버튼 렌더링
  a.innerHTML = '';
  const answerData = qnaList[qIdx].a;
  const scoreData  = qnaList[qIdx].score;

  ['a', 'b'].forEach(key => {
    const btn = document.createElement('button');
    btn.classList.add('answerList');
    btn.innerHTML = answerData[key];
    btn.addEventListener('click', () => {
      // 점수 누적
      const pts = scoreData[key];
      Object.keys(pts).forEach(axis => { scores[axis] += pts[axis]; });

      // 선택 애니메이션
      btn.classList.add('selected');
      setTimeout(() => showQuestion(qIdx + 1), 320);
    });
    a.appendChild(btn);
  });
}

// ============================================================
//  결과 화면 표시
// ============================================================
function showResult() {
  qna.style.display    = 'none';
  result.style.display = 'block';

  const { index, mbtiType } = calcResult(scores);
  currentResult = resultList[index];
  const res = currentResult;

  // 진행바 100%
  document.querySelector('.status_bar').style.width = '100%';

  // 이름 + MBTI
  document.querySelector('.resultName').innerHTML =
    `${res.emoji} ${res.title}<br><span class="resultCharName">${res.name}</span><span class="mbtiTag">${mbtiType}</span>`;

  // 설명
  document.querySelector('.resultDesc').innerHTML = res.desc;

  // 캐릭터 이미지
  const imgDiv = document.querySelector('.resultImg');
  imgDiv.innerHTML = '';
  const img = document.createElement('img');
  img.src = res.img;
  img.alt = res.name;
  img.classList.add('img-fluid', 'result-character-img');
  imgDiv.appendChild(img);

  // 궁합 주민 렌더링
  renderCompat(res);

  // 공유 버튼 초기화
  initShareButtons(res, mbtiType);
}

// ============================================================
//  궁합 주민 렌더링
// ============================================================
function renderCompat(res) {
  const compatSection = document.querySelector('.compatSection');
  compatSection.innerHTML = '';

  // 잘 맞는 주민
  const compatTitle = document.createElement('p');
  compatTitle.className = 'compat-title good';
  compatTitle.innerHTML = '💚 잘 맞는 주민';
  compatSection.appendChild(compatTitle);

  const compatGrid = document.createElement('div');
  compatGrid.className = 'compat-grid';
  res.compat.forEach(idx => {
    const villager = resultList[idx];
    const card = document.createElement('div');
    card.className = 'compat-card good';
    card.innerHTML = `
      <img src="${villager.img}" alt="${villager.name}">
      <span class="compat-emoji">${villager.emoji}</span>
      <span class="compat-name">${villager.name}</span>
    `;
    compatGrid.appendChild(card);
  });
  compatSection.appendChild(compatGrid);

  // 티격태격 주민
  const rivalTitle = document.createElement('p');
  rivalTitle.className = 'compat-title bad';
  rivalTitle.innerHTML = '🔴 티격태격 주민';
  compatSection.appendChild(rivalTitle);

  const rivalGrid = document.createElement('div');
  rivalGrid.className = 'compat-grid';
  res.rival.forEach(idx => {
    const villager = resultList[idx];
    const card = document.createElement('div');
    card.className = 'compat-card bad';
    card.innerHTML = `
      <img src="${villager.img}" alt="${villager.name}">
      <span class="compat-emoji">${villager.emoji}</span>
      <span class="compat-name">${villager.name}</span>
    `;
    rivalGrid.appendChild(card);
  });
  compatSection.appendChild(rivalGrid);
}

// ============================================================
//  다시하기
// ============================================================
document.querySelector('.retry_btn').addEventListener('click', () => {
  result.style.display = 'none';
  intro.style.display  = 'block';
  document.querySelector('.status_bar').style.width = '0%';
});
