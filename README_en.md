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

*Drawnix* is positioned as an out-of-the-box, *open-source*, and free tool product. It is built on top of the *Plait* framework, which is our company's *open-source* drawing framework representing significant technical accumulation in knowledge base products.


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

## Tauri

Development environment Tauri desktop application running.

```
npm run tauri dev
```

Build tauri app.
```
npm run tauri build
```

The directory is `src-tauri/target/`.

## Docker

```
docker pull pubuzhixing/drawnix:latest
```

## Dependencies

- [plait](https://github.com/worktile/plait) - Drawing framework
- [slate](https://github.com/ianstormtaylor/slate) - Rich text editor framework
- [floating-ui](https://github.com/floating-ui/floating-ui) - An awesome library for creating floating UI elements


## Contributing

Any form of contribution is welcome:

- Report bugs

- Contribute code

## Support Us

*Please show your support by giving us a star ⭐️⭐️⭐️.*

## License

[MIT License](https://github.com/plait-board/drawnix/blob/master/LICENSE)