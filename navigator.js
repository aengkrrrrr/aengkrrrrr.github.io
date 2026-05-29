// ============================================================
//  공유 기능 초기화 (결과가 나온 뒤 start.js에서 호출)
// ============================================================
const SITE_URL  = 'https://aengkrrrrr.github.io/';
const KAKAO_KEY = '73bae3352b43587b4d39e109e0f2ce78';

// 카카오 SDK 초기화 (중복 방지)
if (typeof Kakao !== 'undefined' && !Kakao.isInitialized()) {
  Kakao.init(KAKAO_KEY);
}

function initShareButtons(res, mbtiType) {
  const shareWrap = document.querySelector('.share_wrap');
  shareWrap.innerHTML = `
    <button class="share-btn kakao-btn" id="btnKakao">
      <img src="images/kakao_icon.png" alt="카카오" onerror="this.style.display='none'">
      카카오톡 공유
    </button>
    <button class="share-btn copy-btn" id="btnCopy">
      🔗 링크 복사
    </button>
  `;

  const shareTitle = `나는 ${res.emoji} ${res.name} (${mbtiType}) 타입!`;
  const shareDesc  = `나와 닮은 동숲 주민을 찾아봤어요! 지금 테스트해보세요 🌿`;
  const thumbUrl   = 'https://aengkrrrrr.github.io/' + res.img;

  // 카카오 공유
  document.getElementById('btnKakao').addEventListener('click', () => {
    if (typeof Kakao === 'undefined' || !Kakao.isInitialized()) {
      alert('카카오 SDK가 아직 로드되지 않았어요. 잠시 후 다시 시도해주세요.');
      return;
    }
    Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: shareTitle,
        description: shareDesc,
        imageUrl: thumbUrl,
        link: {
          mobileWebUrl: SITE_URL,
          webUrl: SITE_URL
        }
      },
      buttons: [{
        title: '나도 테스트하기 🌿',
        link: { mobileWebUrl: SITE_URL, webUrl: SITE_URL }
      }]
    });
  });

  // 링크 복사
  document.getElementById('btnCopy').addEventListener('click', () => {
    navigator.clipboard.writeText(SITE_URL).then(() => {
      const btn = document.getElementById('btnCopy');
      btn.textContent = '✅ 복사됐어요!';
      setTimeout(() => { btn.textContent = '🔗 링크 복사'; }, 2000);
    }).catch(() => {
      const tmp = document.createElement('textarea');
      tmp.value = SITE_URL;
      document.body.appendChild(tmp);
      tmp.select();
      document.execCommand('copy');
      document.body.removeChild(tmp);
      alert('링크가 복사됐어요! 친구에게 공유해보세요 🌿');
    });
  });
}
