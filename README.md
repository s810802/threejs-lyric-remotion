# 舟神課程｜Three.js 歌詞 MV

16:9、1920×1080、30 fps 繁體中文歌詞 MV。瀏覽器原型及 Remotion 輸出共用 `Scene3D` 與逐格歌詞視覺；歌詞時間沿用相鄰交付資料夾的原 SRT。

## 開啟瀏覽器原型

```powershell
npm run dev:browser
```

可直接以瀏覽器開啟 `index.html`，也可執行 `npm run dev:browser` 使用 Vite 預覽。原型使用原生 HTML、CSS、JavaScript；`prototype.bundle.js` 將 Three.js 與歌詞資料打包為傳統 script，圖片與音訊均用相對路徑，因此不要求本機伺服器。修改 `prototype.js` 後執行 `npm run build:prototype` 更新 bundle。封面作為背景，歌詞位於畫面下方中央並逐字飛入；原生播放器支援播放、暫停、拖曳進度，並有重新播放按鈕及系統 `prefers-reduced-motion` 支援。

## Remotion 預覽與輸出

```powershell
npm run dev
npm run render
```

輸出為 `out/舟神課程-ThreeJS-Remotion-v2.mp4`。Composition 使用 1920×1080、30 fps，共 6253 幀；歌詞依 `src/lyrics.json` 時碼顯示。

## 資料與限制

- `public/song.mp3` 和 `public/cover.png` 是來源素材的工作副本。
- 所有粒子位置採固定種子；Remotion 的場景動畫以 frame 驅動，可逐格預覽與渲染。
- 目前歌詞時碼來自既有 SRT 自動對時成果，未逐句人工聽校。Remotion 以來源封面作背景，其上疊加透明暖金粒子與薄霧。
- 字型優先使用系統 Noto Sans TC，缺少時回退 Microsoft JhengHei。
