# 《舟神課程》Three.js／Remotion 歌詞 MV 交付報告

## 交付物

- `out/舟神課程-ThreeJS-Remotion-v2.mp4`：本次新版完整歌詞 MV，1920×1080、16:9、30 fps，H.264＋AAC，208.433 秒，45,337,974 bytes。
- `out/舟神課程-ThreeJS-Remotion.mp4`：先前版本保留未覆寫。
- `index.html`、`prototype.css`、`prototype.js`、`prototype.bundle.js`：原生 HTML／CSS／JavaScript 原型；bundle 將 Three.js 及歌詞打包為傳統 script，可用相對路徑載入素材，不需本機伺服器。
- `src/`：共用 Three.js 場景、Remotion composition、樣式與 84 段歌詞時間資料。
- `public/lyrics.json`：提供原生瀏覽器原型讀取的 84 段歌詞與時間資料副本。
- `public/cover.png`、`public/song.mp3`：封面與音訊工作副本。
- `out/proof-cover-bottom-v2.mp4`：本次修改後先行輸出的 90 幀 proof。
- `out/proof-cover-bottom-v2-frame.jpg`：proof 中抽取檢視的實際畫格。
- `out/proof-clip.mp4`、`out/抽查畫格.jpg`：先前版本的 proof 與檢視圖。

## 視覺與互動

使用來源封面作為 16:9 背景，疊加暖金粒子與透明程序薄霧；歌詞置於畫面下方中央，以逐字 3D 飛入呈現。瀏覽器版使用原生音訊控制提供播放、暫停與進度拖曳，並提供重新播放按鈕；依 `prefers-reduced-motion` 降低背景及字元動態。

## 驗證結果

- `npm run build`：Remotion bundle 成功。
- 原生瀏覽器原型檔案（`/`、`prototype.js`、`prototype.css`、`lyrics.json`、`cover.png`、`song.mp3`）：本機 Vite 服務均回覆 HTTP 200。
- `npm run typecheck`：通過。
- `npm audit`：0 vulnerabilities。
- 本機 Vite 預覽中的原型頁及必要資源均 HTTP 200；MP3 為 48 kHz、雙聲道，時長 208.4135 秒。瀏覽器實機按下播放後，時間前進並顯示相符歌詞；「重新播放」回到 00:00 並開始播放。頁面偵測到系統減少動態設定。
- 網頁入口使用相對路徑、傳統 `<script>` 與自包含 JavaScript bundle，並將歌詞資料打包，因此支援直接開啟 HTML 的設計；本次自動化工具不支援觀察 `file://` 頁面，故直接檔案模式未經工具實機操作驗證。
- 本次 90 幀 proof 輸出成功；proof 與最終 MP4 抽格均可見封面作背景，歌詞顯示於下方中央。
- 響應式版面：檢視桌面及 390×844 手機畫面，歌詞與控制列可見，無水平溢出。
- Proof clip：90 幀、3.008 秒、1920×1080、30 fps，含 48 kHz 雙聲道 AAC；FFmpeg 完整解碼成功。
- 新版完整成品：ffprobe 確認 H.264 1920×1080、30/1 fps、6253 幀、AAC 48 kHz 雙聲道、208.433 秒；FFmpeg 全片解碼成功。
- 歌詞：JSON cue 與既有 SRT 的 84 段文字及時間完全一致；逐字稿與提供的歌詞文字去除段落標籤和空白後相同（414 字元，無替代字元）。
- `public/song.mp3`、`public/cover.png` 與原始素材 SHA-256 相同；原始歌詞、音訊、封面與既有唱片版 MP4 均未修改。

## 歌詞對時說明

歌詞來源本身沒有時間碼，因此沿用同資料夾原有 SRT 自動對時資料。既有製作紀錄說明時間點未逐句人工聽校，可能稍早或稍晚；本次保留原時間碼，沒有另行假稱人工校時。

## 開啟與重製

瀏覽器原型入口使用原生 HTML／CSS／JavaScript，不透過 React 啟動。修改 `prototype.js` 後執行 `npm run build:prototype` 產生 bundle；可直接開啟 `index.html`，或執行 `npm run dev:browser` 預覽。Remotion composition 使用 Remotion 所需的 React／TSX 工作流；執行 `npm run dev` 開啟 Studio，`npm run render` 會輸出新版 30 fps MP4。套件鎖檔保留依賴版本。

## 復原

所有新檔案都在 `music-disc-video-輸出/threejs-lyric-remotion/` 子目錄。移除此子目錄即可撤回本次新增內容，不影響原始素材或先前既有影片。
