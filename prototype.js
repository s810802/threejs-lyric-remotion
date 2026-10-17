import * as THREE from 'three';
import cues from './src/lyrics.json';

const audio = document.querySelector('#audio');
const lyricEl = document.querySelector('#lyric');
const introEl = document.querySelector('#intro');
const timeLabel = document.querySelector('#player-time');
const stageTime = document.querySelector('#stage-time');
const motionNote = document.querySelector('#motion-note');
const reducedQuery = matchMedia('(prefers-reduced-motion: reduce)');
let reduced = reducedQuery.matches;
const fmt = (seconds) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;

function showCue(time) {
  const cue = cues.find((item) => time >= item.start && time < item.end);
  const key = cue ? `${cue.start}:${cue.text}` : '';
  if (lyricEl.dataset.key === key) return;
  lyricEl.dataset.key = key;
  lyricEl.replaceChildren();
  introEl.hidden = Boolean(cue);
  if (!cue) return;
  [...cue.text].forEach((glyph, index) => {
    const span = document.createElement('span');
    span.className = 'glyph'; span.textContent = glyph === ' ' ? '\u00a0' : glyph;
    span.dataset.index = String(index); lyricEl.append(span);
  });
}
function update() {
  const time = audio.currentTime || 0;
  const cue = cues.find((item) => time >= item.start && time < item.end);
  showCue(time);
  if (cue) {
    const elapsed = (time - cue.start) * 30;
    lyricEl.querySelectorAll('.glyph').forEach((span, i) => {
      const p = reduced ? 1 : Math.max(0, Math.min(1, (elapsed - i * 2) / 17));
      const eased = 1 - Math.pow(1 - p, 3);
      span.style.opacity = String(Math.min(1, p * 1.8));
      span.style.transform = `translate3d(0, ${(1 - eased) * 75}px, ${(1 - eased) * 440}px) rotateX(${(1 - eased) * -36}deg)`;
      span.style.filter = `blur(${(1 - p) * 7}px)`;
    });
  }
  timeLabel.textContent = stageTime.textContent = fmt(time);
  requestAnimationFrame(update);
}
document.querySelector('#restart').addEventListener('click', async () => { audio.currentTime = 0; try { await audio.play(); } catch (e) { console.error('音訊播放失敗', e); motionNote.textContent = '播放失敗，請使用播放器的播放鍵'; } });
audio.addEventListener('error', () => { const code = audio.error?.code; const messages = { 1: '音訊載入已取消', 2: '音訊載入失敗，請確認伺服器連線', 3: '瀏覽器無法解碼此音訊', 4: '找不到音訊檔或格式不支援' }; motionNote.textContent = messages[code] || '音訊載入失敗'; });
audio.addEventListener('playing', () => { motionNote.textContent = reduced ? '已減少動態' : '正在播放'; });
audio.addEventListener('pause', () => { motionNote.textContent = reduced ? '已減少動態' : '已暫停'; });
reducedQuery.addEventListener('change', (event) => { reduced = event.matches; motionNote.textContent = reduced ? '已減少動態' : '支援系統減少動態設定'; });
motionNote.textContent = reduced ? '已減少動態' : '支援系統減少動態設定';

const canvas = document.querySelector('#scene');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(48, 16 / 9, 0.1, 100); camera.position.z = 8;
scene.add(new THREE.AmbientLight(0xffffff, 1));
const count = 950;
const positions = new Float32Array(count * 3); const colors = new Float32Array(count * 3);
let seed = 741; const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
for (let i = 0; i < count; i++) {
  positions[i * 3] = (random() - 0.5) * 15; positions[i * 3 + 1] = (random() - 0.5) * 8.4; positions[i * 3 + 2] = (random() - 0.5) * 5;
  const gold = new THREE.Color().setHSL(0.08 + random() * 0.06, 0.58 + random() * 0.28, 0.48 + random() * 0.3);
  colors.set([gold.r, gold.g, gold.b], i * 3);
}
const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)); geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
const dust = new THREE.Points(geometry, new THREE.PointsMaterial({ size: 0.032, vertexColors: true, transparent: true, opacity: 0.88, sizeAttenuation: true })); scene.add(dust);
const fog = new THREE.Mesh(new THREE.PlaneGeometry(20, 12), new THREE.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: { uTime: { value: 0 }, uReduced: { value: reduced ? 1 : 0 } }, vertexShader: 'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}', fragmentShader: 'varying vec2 vUv;uniform float uTime;uniform float uReduced;void main(){float wave=sin(vUv.x*8.0+uTime*.18)*.025+sin(vUv.y*11.0-uTime*.12)*.02;float n=smoothstep(.42,.95, sin(vUv.x*3.4+vUv.y*2.2+wave)*.5+.5);float edge=smoothstep(0.0,.45,vUv.y)* (1.0-smoothstep(.55,1.0,vUv.y));float a=n*edge*(.105+uReduced*.025);gl_FragColor=vec4(.68,.38,.12,a);}' })); fog.position.z = -2.8; scene.add(fog);
function resize() { const rect = canvas.getBoundingClientRect(); renderer.setSize(Math.max(1, rect.width), Math.max(1, rect.height), false); camera.aspect = rect.width / rect.height; camera.updateProjectionMatrix(); }
new ResizeObserver(resize).observe(canvas); resize();
const clock = new THREE.Clock();
function render() { const elapsed = clock.getElapsedTime(); fog.material.uniforms.uTime.value = reduced ? 0 : elapsed; fog.material.uniforms.uReduced.value = reduced ? 1 : 0; if (!reduced) dust.rotation.z = Math.sin(elapsed * 0.1) * 0.025; renderer.render(scene, camera); requestAnimationFrame(render); }
render(); requestAnimationFrame(update);
