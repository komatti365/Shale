/* ==========================================================================
   BLUE ARCHIVE - SCHALE BUREAU OFFICIAL PORTAL JAVASCRIPT
   Kivotos Extrajudicial Special Investigation Bureau
   ========================================================================== */

// --- Global Audio Engine (Web Audio API for Cyberpunk / Blue Archive SFX) ---
class SoundManager {
  constructor() {
    this.enabled = true;
    this.audioCtx = null;
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    } catch (e) {
      console.warn("Web Audio API not supported on this browser.");
    }
  }

  resume() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  // Futuristic high-tech hover blip
  playHover() {
    if (!this.enabled || !this.audioCtx) return;
    this.resume();
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, this.audioCtx.currentTime); // A5
    osc.frequency.exponentialRampToValueAtTime(1320, this.audioCtx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.02, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.05);
  }

  // Blue Archive Terminal Select / Click
  playClick() {
    if (!this.enabled || !this.audioCtx) return;
    this.resume();
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1046.5, this.audioCtx.currentTime); // C6
    osc.frequency.exponentialRampToValueAtTime(523.25, this.audioCtx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.06, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.08);
  }

  // Shittim Chest Chime (Arona notification bell)
  playChime() {
    if (!this.enabled || !this.audioCtx) return;
    this.resume();
    const notes = [587.33, 880, 1174.66]; // D5, A5, D6
    notes.forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const startTime = this.audioCtx.currentTime + idx * 0.06;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.05, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.3);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  }

  // Heavy Physical Stamp Audio Effect (Thud + Click)
  playStamp() {
    if (!this.enabled || !this.audioCtx) return;
    this.resume();
    
    // Low frequency thud
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, this.audioCtx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.15);

    // High snap
    setTimeout(() => {
      this.playChime();
    }, 120);
  }
}

const sounds = new SoundManager();

// --- Live Kivotos Clock (KST / JST) ---
function updateKivotosClock() {
  const clockEl = document.getElementById('kivotosClock');
  if (!clockEl) return;
  
  const now = new Date();
  // Formatted as HH:MM:SS
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  clockEl.textContent = `${hours}:${minutes}:${seconds}`;
}

// --- Sound Controls Toggle ---
function setupSoundToggle() {
  const soundToggleBtn = document.getElementById('soundToggle');
  const soundIcon = document.getElementById('soundIcon');
  const soundLabel = soundToggleBtn.querySelector('.sound-label');

  soundToggleBtn.addEventListener('click', () => {
    const isEnabled = sounds.toggle();
    if (isEnabled) {
      soundIcon.textContent = '🔊';
      soundLabel.textContent = 'SFX: ON';
      soundToggleBtn.classList.remove('muted');
      sounds.playClick();
    } else {
      soundIcon.textContent = '🔇';
      soundLabel.textContent = 'SFX: OFF';
      soundToggleBtn.classList.add('muted');
    }
  });

  // Attach hover sound to interactive elements
  const interactives = document.querySelectorAll('a, button, .dossier-card, .academy-card, .schale-card');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => sounds.playHover());
  });
}

// --- Top Disclaimer Dismissal ---
function setupDisclaimer() {
  const bar = document.getElementById('disclaimerBar');
  const closeBtn = document.getElementById('closeDisclaimerBtn');
  if (closeBtn && bar) {
    closeBtn.addEventListener('click', () => {
      bar.classList.add('hidden');
      sounds.playClick();
    });
  }
}

// --- Mobile Navigation Menu ---
function setupMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const nav = document.getElementById('navMenu');
  if (btn && nav) {
    btn.addEventListener('click', () => {
      nav.classList.toggle('mobile-open');
      sounds.playClick();
    });
    // Close on nav link click
    nav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => nav.classList.remove('mobile-open'));
    });
  }
}

// --- Incident Dossier Filtering ---
function setupDossierFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.dossier-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sounds.playClick();
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// --- Dossier Modal Details Data & Controller ---
const dossierData = {
  abydos: {
    code: 'FILE #001-ABYDOS',
    badge: 'RESOLVED // LEVEL 1',
    title: 'アビドス廃校危機および砂漠化対策支援',
    meta: [
      { label: '発生自治地域', value: 'アビドス自治区 全域' },
      { label: '主管部隊', value: 'アビドス対策委員会 ＆ シャーレ顧問' },
      { label: '主要敵性組織', value: 'カイザーPMC / カイザーローン' },
      { label: '最終作戦結果', value: '自治区債務の不正追及および防衛成功' }
    ],
    content: `
      <p>砂漠化の進行と莫大な負債（9億6000万エン）により、自治区の存続が危ぶまれていたアビドス高等学校。</p>
      <p>カイザーコーポレーションが裏で画策していた軍事侵攻および土地買収計画に対し、先生の指揮のもと対策委員会（シロコ、ホシノ、セリカ、ノノミ、アヤネ）と便利屋68が連携。</p>
      <p>カイザーPMCの前線基地を制圧し、不正な利息請求契約を破棄。生徒たちの日常と学校の存続を守り抜いた。</p>
    `
  },
  eden: {
    code: 'FILE #002-EDEN',
    badge: 'TOP SECRET // LEVEL 3',
    title: 'エデン条約調印式事変およびアリウス介入',
    meta: [
      { label: '発生自治地域', value: 'トリニティ自治区 / ゲヘナ自治区境界' },
      { label: '主管部隊', value: '補習授業部 / アリウススクワッド / シャーレ' },
      { label: '主要敵性勢力', value: 'ゲマトリア（ベアトリーチェ）/ 戒律のサント' },
      { label: '最終作戦結果', value: '巡航ミサイルテロ阻止、調印調停完了' }
    ],
    content: `
      <p>長年の宿敵関係にあったトリニティ総合学園とゲヘナ学園による不可侵平和条約「エデン条約」の調印式において、アリウス分校による大規模な武力介入テロが発生。</p>
      <p>先生は重傷を負いながらも、大人の責任としてアリウススクワッドの生徒たちを救い出し、ヒフミ率いる補習授業部とともに「青春の物語」を取り戻した。</p>
      <p>ベアトリーチェのキヴォトス破壊儀式は完全に阻止され、エデン条約は形を変えて両校の対話への第一歩となった。</p>
    `
  },
  decagram: {
    code: 'FILE #003-DECAGRAM',
    badge: 'RESTRICTED // LEVEL 2',
    title: '自律型AI「デカグラマトン」預言者討伐記録',
    meta: [
      { label: '発生自治地域', value: 'ミレニアム自治区 廃墟地区' },
      { label: '主管部隊', value: 'ミレニアム特異現象捜査部 / シャーレ' },
      { label: '主要敵性勢力', value: 'デカグラマトンAI予言者軍団 (ビナー/ケセド等)' },
      { label: '最終作戦結果', value: '全預言者の無力化およびAI暴走封じ込め' }
    ],
    content: `
      <p>「我は唯一にして神の証明」を名乗り暴走した超高度自律型AI・デカグラマトン。</p>
      <p>ミレニアム自治区の地下廃墟に巣食う巨獣型兵器「ビナー」や工場要塞「ケセド」に対し、ヒマリ、リオ、エイミ、そして先生の指揮下で各学園生徒による総力戦を展開。</p>
      <p>神性を模したAIの論理破綻を暴き、キヴォトスの電子防壁および基幹ネットワークの安全を回復した。</p>
    `
  },
  final: {
    code: 'FILE #004-FINAL-ARC',
    badge: 'CRITICAL ARCHIVE // LEVEL MAX',
    title: 'あまねく奇跡の始発点・サンクトゥムタワー防衛戦',
    meta: [
      { label: '発生自治地域', value: 'キヴォトス全域 / 成層圏ウトナピシュティム' },
      { label: '主管部隊', value: '全学園生徒連合 ＆ シャーレ顧問 先生' },
      { label: '主要脅威', value: '色彩の嚮導者（プレナパテス）/ 偽りのサンクトゥム' },
      { label: '最終作戦結果', value: 'キヴォトス完全防衛・プラナの保護成功' }
    ],
    content: `
      <p>次元を超えて現れた「色彩」の侵略と、滅亡を迎えた別の世界の先生「プレナパテス」の出現。</p>
      <p>キヴォトス中の全学園・生徒たちが対立を乗り越えてシャーレの旗の下に集結。宇宙戦艦ウトナピシュティムの本船を起動し、偽りのサンクトゥムタワーを撃破。</p>
      <p>先生は自身の命を賭してシッテムの箱を護り、アロナと共に新たな家族となる「プラナ」を救出して無事帰還を果たした。</p>
    `
  }
};

function openDossierModal(key) {
  const data = dossierData[key];
  if (!data) return;

  document.getElementById('modalCode').textContent = data.code;
  document.getElementById('modalBadge').textContent = data.badge;
  document.getElementById('modalTitle').textContent = data.title;
  
  const metaContainer = document.getElementById('modalMeta');
  metaContainer.innerHTML = data.meta.map(m => `
    <div class="modal-meta-item">
      <strong>${m.label}</strong>
      <span>${m.value}</span>
    </div>
  `).join('');

  document.getElementById('modalContent').innerHTML = data.content;

  const modal = document.getElementById('dossierModal');
  modal.classList.add('open');
  sounds.playClick();
}

function closeDossierModal() {
  const modal = document.getElementById('dossierModal');
  if (modal) {
    modal.classList.remove('open');
    sounds.playClick();
  }
}

// Close modal on Escape
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeDossierModal();
});

// --- Shittim Chest Terminal Engine ---
const terminalResponses = {
  help: `
[AVAILABLE COMMANDS / コマンド一覧]
  - <strong>arona</strong>   : アロナとお話しします
  - <strong>plana</strong>   : プラナとお話しします
  - <strong>status</strong>  : キヴォトスおよびシャーレの通信状態
  - <strong>cafe</strong>    : 本日のシャーレカフェ来訪状況
  - <strong>gacha</strong>   : 先生の今日の運勢（お仕事封筒開封シミュレータ）
  - <strong>report</strong>  : 未処理の事案レポート要約
  - <strong>github</strong>  : 製作者 GitHub プロフィール / リポジトリ
  - <strong>clear</strong>   : ターミナル画面をクリアします
  `,
  github: `
[CREATOR GITHUB ARCHIVE]
  - 製作者: <strong>komatti365</strong> (<a href="https://github.com/komatti365" target="_blank" style="color:#00e5ff;">https://github.com/komatti365 ↗</a>)
  - リポジトリ: <a href="https://github.com/komatti365/Shale" target="_blank" style="color:#00e5ff;">https://github.com/komatti365/Shale ↗</a>
  - プロジェクト: 連邦捜査部シャーレ 非公式コンセプトポータル
  `,
  creator: `
<div class="term-line arona-msg"><span class="speaker-tag arona">アロナ</span>「この素敵なシャーレ端末ポータルは @komatti365 さんが制作してくださいました！先生、GitHubもぜひチェックしてみてくださいね♪」</div>
  `,
  arona: `
<div class="term-line arona-msg"><span class="speaker-tag arona">アロナ</span>「先生！呼んでくれてありがとうございます！今日も先生のためにいっぱい働きますね！おやつにイチゴミルクが飲みたいです♪」</div>
  `,
  plana: `
<div class="term-line plana-msg"><span class="speaker-tag plana">プラナ</span>「先生、シッテムの箱の補助プロトコルは正常です。先生が無理をしていないか、私がしっかり見守っています。」</div>
  `,
  status: `
[SYSTEM STATUS REPORT]
  - 連邦生徒会メインサーバー: <strong>オンライン</strong>
  - サンクトゥムタワー防壁: <strong>100% 安定</strong>
  - 先生の活動可能時間: <strong>24h / 無制限</strong>
  - 生徒たちからの好感度: <strong>計測不能（MAX）</strong>
  `,
  cafe: `
[SCHALE CAFE STATUS]
  - 本日の来訪生徒: シロコ, ヒナ, ユウカ, ヒフミ, アリス
  - タッチ・プレゼント受付: <strong>可能</strong>
  - カフェランク: <strong>MAX</strong> (快適度 10,000+)
  `,
  report: `
[GSC PENDING INCIDENT SUMMARY]
  - アビドス自治区: 砂漠パトロール要請 (優先度: 通常)
  - ミレニアム工学部: 新型試作機の爆発後始末 (優先度: 警戒)
  - ゲヘナ給食部 vs 美食研究会: 厨房防衛支援 (優先度: 緊急)
  `,
  sensei: `
<div class="term-line arona-msg"><span class="speaker-tag arona">アロナ</span>「先生はキヴォトスで一番かっこよくて頼もしい大人です！」</div>
<div class="term-line plana-msg"><span class="speaker-tag plana">プラナ</span>「同意します。先生、お茶を淹れましたのでどうぞ。」</div>
  `
};

// Cute Gacha Envelope Simulator for Sensei's Fortune
function generateGachaDraw() {
  const rand = Math.random();
  if (rand < 0.15) {
    // 3-Star Pink Envelope!
    return `
<div class="term-line arona-msg" style="color: #ff77aa;">
  <span class="speaker-tag arona" style="background:#ff3388; color:#fff;">★3 確定演出</span>
  「先生！見てください！虹色のファイル（ピンク封筒）が出ました！！今日の先生は超大吉です！！✨🎉」
</div>
<div class="term-line plana-msg"><span class="speaker-tag plana">プラナ</span>「おめでとうございます、先生。素晴らしい一日になる予感がします。」</div>
    `;
  } else if (rand < 0.6) {
    // 2-Star Gold Envelope
    return `
<div class="term-line arona-msg" style="color: #ffe600;">
  <span class="speaker-tag arona" style="background:#ffe600; color:#000;">★2 金色封筒</span>
  「金色に光るファイルです！今日のお仕事も順調に進みそうですね♪」
</div>
    `;
  } else {
    // 1-Star Blue Envelope (Classic Arona Meme)
    return `
<div class="term-line arona-msg">
  <span class="speaker-tag arona">青色封筒</span>
  「あ、青色のファイルですね……！でも大丈夫です先生！生徒たちへの愛があれば何でも乗り越えられます！（えへへ）」
</div>
    `;
  }
}

function appendTermLine(htmlContent) {
  const body = document.getElementById('termOutput');
  const div = document.createElement('div');
  div.className = 'term-line';
  div.innerHTML = htmlContent;
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
}

function handleTerminalSubmit() {
  const input = document.getElementById('termInput');
  const val = input.value.trim().toLowerCase();
  if (!val) return;

  sounds.playClick();
  
  // Print user command
  appendTermLine(`<span class="user-cmd-line">SCHALE/SENSEI:~$ ${input.value}</span>`);
  input.value = '';

  if (val === 'clear') {
    document.getElementById('termOutput').innerHTML = `
      <div class="term-line system-msg">[SYSTEM] TERMINAL BUFFER CLEARED.</div>
    `;
    return;
  }

  if (val === 'gacha') {
    setTimeout(() => {
      sounds.playChime();
      appendTermLine(generateGachaDraw());
    }, 200);
    return;
  }

  if (terminalResponses[val]) {
    setTimeout(() => {
      sounds.playChime();
      appendTermLine(terminalResponses[val]);
    }, 150);
  } else {
    setTimeout(() => {
      appendTermLine(`
        <span class="term-line system-msg">コマンドが見つかりません: '${val}'. 'help' と入力して使用可能なコマンドを確認してください。</span>
      `);
    }, 100);
  }
}

function runQuickCmd(cmd) {
  const input = document.getElementById('termInput');
  input.value = cmd;
  handleTerminalSubmit();
}

// --- Task & Incident Dispatch Approval Handler ---
function handleDispatchSubmit() {
  const academy = document.getElementById('reqAcademy').value;
  const category = document.getElementById('reqCategory').value;
  const priority = document.getElementById('reqPriority').value;
  const title = document.getElementById('reqTitle').value;

  if (!academy || !title) return;

  sounds.playStamp();

  // Generate randomized ticket ID
  const randNum = Math.floor(1000 + Math.random() * 9000);
  const ticketId = `SCH-2026-${randNum}`;

  const now = new Date();
  const dateStr = `${now.getFullYear()}.${String(now.getMonth()+1).padStart(2,'0')}.${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

  document.getElementById('ticketId').textContent = `ID: ${ticketId}`;
  document.getElementById('ticketAcademy').textContent = academy;
  document.getElementById('ticketCategory').textContent = category;
  document.getElementById('ticketPriority').textContent = priority;
  document.getElementById('ticketTitle').textContent = title;
  document.getElementById('ticketTime').textContent = dateStr;
  document.getElementById('stampDate').textContent = `${now.getFullYear()}.${String(now.getMonth()+1).padStart(2,'0')}.${String(now.getDate()).padStart(2,'0')}`;

  const stampEl = document.getElementById('stampApproved');
  stampEl.classList.remove('stamped');
  
  // Re-trigger animation
  setTimeout(() => {
    stampEl.classList.add('stamped');
  }, 50);

  // Add confirmation line in terminal
  appendTermLine(`
    <div class="term-line arona-msg" style="color:#00e5ff;">
      [要請承認完了] 先生により「${title} (${academy})」の決裁書が発行されました。（管理番号: ${ticketId}）
    </div>
  `);
}

// --- Initialize All Modules on Load ---
document.addEventListener('DOMContentLoaded', () => {
  setInterval(updateKivotosClock, 1000);
  updateKivotosClock();
  
  setupSoundToggle();
  setupDisclaimer();
  setupMobileMenu();
  setupDossierFilters();

  console.log("%c[SCHALE OS] Kivotos Special Investigation Bureau portal loaded successfully.", "color: #00e5ff; font-weight: bold; font-size: 14px;");
  console.log("%c※当サイトはブルーアーカイブの非公式ファン制作物です。", "color: #ff3366; font-size: 12px;");
});
