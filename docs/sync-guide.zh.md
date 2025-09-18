# WebDAV 同步功能说明

新版同步流程通过内置的同步网关服务代理 WebDAV 请求，浏览器只会访问同源接口，避免 CORS 与凭据泄露风险。使用步骤如下。

## 能力概览

- **WebDAV 存储**：将画板保存到任意支持 WebDAV 的网盘/对象存储。
- **密码校验**：前端输入密码，经同步网关校验（SHA-256 哈希）后才开放同步能力。
- **定时轮询**：默认每 5 秒从远端拉取最新画板，发生本地修改后自动回写。
- **文件管理**：可在弹窗中浏览、保存、加载 `.drawnix` 文件，所有操作均通过网关代理至 WebDAV。

## 环境配置

1. 复制示例环境文件：

   ```bash
   cp .env.example .env
   ```

2. 根据实际情况修改 `.env`：

   | 变量 | 说明 |
   | --- | --- |
   | `SYNC_PASSWORD_HASH` | 同步密码的 SHA-256 哈希，用户在弹窗中输入明文密码即可通过校验。 |
   | `SYNC_JWT_SECRET` | 同步网关签发令牌的秘钥，可自定义。 |
   | `WEBDAV_URL` | WebDAV 服务基础地址（浏览器无需直连）。 |
   | `WEBDAV_USERNAME` / `WEBDAV_PASSWORD` | WebDAV 凭据（如需）。 |
   | `WEBDAV_BASE_PATH` | 存放 Drawnix 数据的目录，默认为 `/drawnix`。 |
   | `WEBDAV_MAIN_FILE` | 主同步文件名（默认 `main-board.json`）。 |
   | `WEBDAV_TIMEOUT` | WebDAV 请求超时时间（毫秒）。 |
| `SYNC_LABEL` / `VITE_SYNC_LABEL` | （可选）前端展示的同步来源标签。 |
   | `VITE_SYNC_POLL_MS` | 前端轮询间隔，默认 `5000` 毫秒。 |

   > 可通过 `echo -n 'your-password' | shasum -a 256` 生成哈希值。

3. 启动容器：

   ```bash
   docker compose up -d --build
   ```

   - 前端访问：<http://localhost:38080>
   - WebDAV 只需对同步网关开放（无需浏览器直连）。

## 使用流程

1. 访问前端页面，点击“App Menu → 同步与文件”。
2. 输入与 `SYNC_PASSWORD_HASH` 对应的密码完成校验。
3. 校验成功后：
   - 画板改动会自动同步到 WebDAV 主文件；
   - 弹窗可保存成 `.drawnix` 文件或从 WebDAV 加载；
   - 可在同一弹窗内调整 WebDAV 配置、分页浏览、重命名或删除远端文件；
   - 未校验时仍可离线使用，本地数据保留在浏览器。

## 常见问题

- **验证失败或“无法连接 WebDAV”**：请确认 `.env` 中的 WebDAV 地址、凭据正确，且同步网关所在环境可以访问该地址。
- **无法加载/保存文件**：检查 WebDAV 目录权限及可用空间，或确认文件内容是否为合法的 Drawnix 导出。
- **修改配置后仍使用旧值**：执行 `docker compose up -d --build` 重新构建，使前端与网关同时更新配置。

如仍有疑问，欢迎提交 Issue 反馈。EOF
