<div align="center">
  <h2>
    Open-source whiteboard tool (SaaS), an all-in-one collaborative canvas that includes mind mapping, flowcharts and more.
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
</div>

[中文文档](https://github.com/plait-board/drawnix/blob/develop/README.md)

# Features

- 💯 Free and Open Source
- ⚒️ Mind Maps and Flowcharts
- 😀 Iconfont Emoji Support (🚧 In Progress...)
- 🚀 Plugin-based Architecture - Extensible
- 🖼️ 📃 Export to PNG, JPG, JSON(.drawnix)
- 💾 Auto-save (Browser Storage)
- ⚡ Edit Features: Undo, Redo, Copy, Paste, etc.
- 🌌 Infinite Canvas: Zoom, Pan
- 🎨 Theme Support (🚧 In Progress...)
- 📱 Mobile-friendly


# About the Name

***Drawnix*** is born from the interweaving of ***Draw*** and ***Phoenix***, a fusion of artistic inspiration.

The Phoenix symbolizes endless creativity, while Draw represents humanity's most fundamental form of expression. Here, each creation is an artistic rebirth, every stroke a renaissance of inspiration.

Like a Phoenix, creativity must rise from the flames to be reborn, and ***Drawnix*** stands as the guardian of both technical and creative fire.

*Draw Beyond, Rise Above.*


# With Plait Drawing Framework

Drawnix is a whiteboard tool component and product built on top of the Plait framework. Plait is our company's open-source drawing framework - a flexible and extensible solution that represents a significant technical achievement in our knowledge base products. In over 2 years since its launch, it has served more than 6000+ companies in the development track.

Drawnix aims to build upon Plait by incorporating more community-driven product ideas, technical approaches, and interaction inspirations to provide a truly simple and user-friendly drawing tool.

Our company's frontend tech stack is Angular, and the initial version of the Plait framework was tightly coupled with Angular. Later, to enhance Plait's versatility and better serve the open-source community, we gradually transformed Plait into a framework-agnostic architecture. This transformation sparked the idea for Drawnix, which leverages Plait's plugin mechanism at its core while combining React and its ecosystem for the UI layer, representing another significant use case beyond our company's main knowledge base product.

Since both Plait & Drawnix use a plugin architecture, they are technically more complex than other popular open-source tools like Excalidraw and TLDraw. However, this plugin architecture offers distinct advantages: it supports multiple UI frameworks (Angular, React), integrates with different rich text frameworks (currently supporting Slate framework), enables excellent business layer separation during development, allows for the development of fine-grained reusable plugins, and can expand to more drawing board application scenarios.

If you're familiar with the design philosophy of the Slate rich text editor framework, you'll find Drawnix and Plait's architectural patterns very familiar. We look forward to exploring more interesting application scenarios in the future.

# Development

```
npm install

npm run start
```

# Dependencies

- [plait](https://github.com/worktile/plait) - Drawing framework
- [slate](https://github.com/ianstormtaylor/slate) - Rich text editor framework
- [floating-ui](https://github.com/floating-ui/floating-ui) - An awesome library for creating floating UI elements


# Contributing

Any form of contribution is welcome:

- Report bugs

- Contribute code


# License

[MIT License](https://github.com/plait-board/drawnix/blob/master/LICENSE)