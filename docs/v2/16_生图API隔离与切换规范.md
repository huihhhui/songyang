# 生图 API 隔离与切换规范

## 目标

生图服务只在生成或编辑视觉资产时读取；日常 Codex 对话、代码编写和审查不读取该密钥。

## 文件

- `.env.image.local.example`：可提交的配置模板，不含密钥。
- `.env.image.local`：本机私有生图配置，不提交版本库。
- `C:\Users\hp\.codex\skills\sunyang-visual-production`：生图前的素材锚定和审查流程。

## 首次配置

1. 在项目根目录复制 `.env.image.local.example` 为 `.env.image.local`。
2. 仅在 `IMAGE_API_KEY` 填入新建的生图密钥。
3. 保持 `IMAGE_API_BASE_URL=https://anpin.ai/v1`，模型默认使用 `gpt-image-2`。
4. 重新启动 Codex，使新增 skill 出现在可用技能中。

## 使用规则

需要生图时，明确说明“使用项目生图 API”或调用 `sunyang-visual-production`。该流程才会加载 `.env.image.local` 并在该次命令中设置 `OPENAI_BASE_URL` 与 `OPENAI_API_KEY`；命令结束后环境变量不保留。

日常工作不读取 `.env.image.local`。全局 `C:\Users\hp\.codex\config.toml` 应只放日常文本服务的 provider 和密钥。

## 当前阻塞

服务商提供的 `config.toml` 是整个 Codex 的 provider 配置，而不是 image-only 配置。若要做到真正分流，仍需补充日常文本服务的 base URL、模型名及本机密钥保存位置；不要在聊天中发送密钥本身。
