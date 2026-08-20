# 公网发布

## GitHub

1. 在 GitHub 新建一个空仓库，例如 `wutonger-sunyang`，不要自动创建 README 或 `.gitignore`。
2. 在项目目录执行：

```powershell
git add .
git commit -m "build: wutonger sunyang v2"
git branch -M main
git remote add origin https://github.com/<你的账号>/<仓库名>.git
git push -u origin main
```

3. GitHub 仓库的 `Settings -> Pages -> Source` 选择 `GitHub Actions`。
4. 每次推送到 `main` 后，`.github/workflows/deploy-pages.yml` 会构建并发布 `dist`。

因为项目使用 HashRouter，GitHub Pages 的地址可以直接访问这些页面：

```text
/#/
/#/village/banqiao
/#/lab/toushi-presets/banqiao
/#/flower-rope
/#/placeholder/paper-stage-next
/#/placeholder/wall-drawing
```

## Vercel / Netlify

如果希望更快获得公网地址，可以直接导入 GitHub 仓库：

- Build command: `npm run build`
- Output directory: `dist`
- Node version: `20`

当前 `vite.config.js` 使用 `base: './'`，适合 GitHub Pages 子路径和 Vercel/Netlify 根路径部署。
