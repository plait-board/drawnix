<p align="center">
  <picture style="width: 320px">
    <source media="(prefers-color-scheme: light)" srcset="https://github.com/plait-board/drawnix/blob/develop/apps/web/public/logo/logo_drawnix_h.svg?raw=true" />
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/plait-board/drawnix/blob/develop/apps/web/public/logo/logo_drawnix_h_dark.svg?raw=true" />
    <img src="https://github.com/plait-board/drawnix/blob/develop/apps/web/public/logo/logo_drawnix_h.svg?raw=true" width="360" alt="Drawnix logo and name" />
  </picture>
</p>
<div align="center">
  <h2>
    Open-source whiteboard tool (SaaS), an all-in-one collaborative canvas that includes mind mapping, flowcharts, freehand and more.
  <br />
  </h2>
</div>

<div align="center">
  <figure>
    <a target="_blank" rel="noopener">
      <img src="https://github.com/plait-board/drawnix/blob/develop/apps/web/public/product_showcase/case-2.png" alt="Product showcase" width="80%" />
    </a>
    <figcaption>
      <p align="center">
      Whiteboard with mind mapping, flowcharts, freehand drawing and more
      </p>
    </figcaption>
  </figure>
  <a href="https://hellogithub.com/repository/plait-board/drawnix" target="_blank">
    <picture style="width: 250">
      <source media="(prefers-color-scheme: light)" srcset="https://abroad.hellogithub.com/v1/widgets/recommend.svg?rid=4dcea807fab7468a962c153b07ae4e4e&claim_uid=zmFSY5k8EuZri43&theme=neutral" />
      <source media="(prefers-color-scheme: dark)" srcset="https://abroad.hellogithub.com/v1/widgets/recommend.svg?rid=4dcea807fab7468a962c153b07ae4e4e&claim_uid=zmFSY5k8EuZri43&theme=dark" />
      <img src="https://abroad.hellogithub.com/v1/widgets/recommend.svg?rid=4dcea807fab7468a962c153b07ae4e4e&claim_uid=zmFSY5k8EuZri43&theme=neutral" alt="Featured｜HelloGitHub" style="width: 250px; height: 54px;" width="250" height="54"/>
    </picture>
  </a>

  <br />

  <a href="https://trendshift.io/repositories/13979" target="_blank"><img src="https://trendshift.io/api/badge/repositories/13979" alt="plait-board%2Fdrawnix | Trendshift" style="width: 250px; height: 55px;" width="250" height="55"/></a>
</div>

[*中文*](https://github.com/plait-board/drawnix/blob/develop/README.md)

## Features

- 💯 Free and Open Source
- ⚒️ Mind Maps and Flowcharts
- 🖌 Freehand
- 😀 Image Support
- 🚀 Plugin-based Architecture - Extensible
- 🖼️ 📃 Export to PNG, JPG, JSON(.drawnix)
- 💾 Auto-save (Browser Storage)
- ⚡ Edit Features: Undo, Redo, Copy, Paste, etc.
- 🌌 Infinite Canvas: Zoom, Pan
- 🎨 Theme Support
- 📱 Mobile-friendly
- 📈 Support mermaid syntax conversion to flowchart
- ✨ Support markdown text conversion to mind map（New 🔥🔥🔥）


## About the Name

***Drawnix*** is born from the interweaving of ***Draw*** and ***Phoenix***, a fusion of artistic inspiration.

The *Phoenix* symbolizes endless creativity, while *Draw* represents humanity's most fundamental form of expression. Here, each creation is an artistic rebirth, every stroke a renaissance of inspiration.

Like a Phoenix, creativity must rise from the flames to be reborn, and ***Drawnix*** stands as the guardian of both technical and creative fire.

*Draw Beyond, Rise Above.*

## About Plait Drawing Framework

*Drawnix* is positioned as an out-of-the-box, *open-source*, and free tool product. It is built on top of the *Plait* framework, which is our company's *open-source* drawing framework representing significant technical accumulation in knowledge base products([PingCode Wiki](https://pingcode.com/product/wiki?utm_source=drawnix)).


*Drawnix* uses a *plugin architecture*, which is technically more complex than the previously mentioned *open-source* tools. However, this *plugin architecture* has its advantages: it supports multiple *UI frameworks* (*Angular*, *React*), integrates with different *rich text frameworks* (currently only supporting *Slate* framework), enables better business layer separation in development, allows development of various fine-grained reusable plugins, and can expand to more whiteboard application scenarios.

## Repository Structure

```
drawnix/
├── apps/
│   ├── web                   # drawnix.com
│   │    └── index.html       # HTML
├── dist/                     # Build artifacts
├── packages/
│   └── drawnix/              # Whiteboard application core
│   └── react-board/          # Whiteboard react view layer
│   └── react-text/           # Text rendering module
├── package.json
├── ...
└── README.md
└── README_en.md

```

## Try It Out

*https://drawnix.com* is the minimal application of *drawnix*.

I will be iterating frequently on *drawnix.com* until the release of the *Dawn* version.


## Development

```
npm install

npm run start
```

## Docker

### Using Docker Compose (Recommended)

**1. Create docker-compose.yml file:**

```yaml
version: '3.8'

services:
  drawnix:
    image: pubuzhixing/drawnix:latest  # Use pre-built image
    # build: .                          # Or build from source (requires source code)
    container_name: drawnix-app
    ports:
      - "3456:80"                       # Map to port 3456, modify as needed
    restart: unless-stopped
    networks:
      - drawnix-network

networks:
  drawnix-network:
    driver: bridge
```

**2. Run the service:**

```bash
# Deploy directly using pre-built image
docker-compose up -d

# Or build from source (requires source code download first)
git clone https://github.com/plait-board/drawnix.git
cd drawnix
# Modify docker-compose.yml: comment image line, enable build line
docker-compose up -d --build
```

**3. Access the application:**

[http://localhost:3456](http://localhost:3456)

### Run with Docker directly

```bash
docker pull pubuzhixing/drawnix:latest
docker run -d -p 3456:80 --name drawnix pubuzhixing/drawnix:latest
```

### Docker Compose

The repository includes a `docker-compose.yml` that builds the static web app and the sync server.

1. Copy the sample environment file and adjust the values:

   ```bash
   cp .env.example .env
   # edit .env to configure your WebDAV endpoint and sync password hash
   ```

2. Build and start the web container:

   ```bash
   docker compose up -d --build
   ```

   - Web UI: <http://localhost:38080>
   - Ensure the configured WebDAV server is reachable from the container (the gateway forwards all requests; the browser no longer calls WebDAV directly).

Required environment variables:

| Variable | Description |
| --- | --- |
| `SYNC_PASSWORD_HASH` | SHA-256 hash of the password users must enter to enable sync. |
| `SYNC_JWT_SECRET` | Secret used by the sync gateway to sign access tokens. |
| `WEBDAV_URL` | Base URL of the upstream WebDAV endpoint (reachable from the container). |
| `WEBDAV_USERNAME` / `WEBDAV_PASSWORD` | WebDAV credentials (optional). |
| `WEBDAV_BASE_PATH` | Directory used to store Drawnix files (default `/drawnix`). |
| `WEBDAV_MAIN_FILE` | File name for the primary synced board (default `main-board.json`). |
| `WEBDAV_TIMEOUT` | WebDAV request timeout in milliseconds (default `10000`). |
| `SYNC_LABEL` / `VITE_SYNC_LABEL` | (Optional) label shown in the UI for the sync target. |
| `VITE_SYNC_POLL_MS` | (Optional) client-side poll interval in milliseconds (default `5000`). |

> A Chinese-language walkthrough of the new sync workflow is available at `docs/sync-guide.zh.md`.

The container bundles a lightweight sync gateway that proxies all WebDAV requests, so the browser never exposes your credentials or deals with CORS.

## Dependencies

- [plait](https://github.com/worktile/plait) - Open source drawing framework
- [slate](https://github.com/ianstormtaylor/slate) - Rich text editor framework
- [floating-ui](https://github.com/floating-ui/floating-ui) - An awesome library for creating floating UI elements


## Contributing

Any form of contribution is welcome:

- Report bugs

- Contribute code

## Thank you for supporting

Special thanks to the company for its strong support for open source projects, and also to the friends who contributed code and provided suggestions to this project.

<p align="left">
  <a href="https://pingcode.com?utm_source=drawnix" target="_blank">
      <img src="https://cdn-aliyun.pingcode.com/static/site/img/pingcode-logo.4267e7b.svg" width="120" alt="PingCode" />
  </a>
</p>

## License

[MIT License](https://github.com/plait-board/drawnix/blob/master/LICENSE)
