<p align="center">
  <picture style="width: 320px">
    <source media="(prefers-color-scheme: light)" srcset="https://github.com/plait-board/drawnix/blob/develop/apps/web/public/logo/logo_drawnix_h.svg?raw=true" />
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/plait-board/drawnix/blob/develop/apps/web/public/logo/logo_drawnix_h_dark.svg?raw=true" />
    <img src="https://github.com/plait-board/drawnix/blob/develop/apps/web/public/logo/logo_drawnix_h.svg?raw=true" width="360" alt="Drawnix logo and name" />
  </picture>
</p>
<div align="center">
  <h2>
    开源白板工具（SaaS），一体化白板，包含思维导图、流程图、自由画等
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
        All in one 白板，思维导图、流程图、自由画等
      </p>
    </figcaption>
  </figure>
</div>

[*English README*](https://github.com/plait-board/drawnix/blob/develop/README_en.md)

## 特性

- 💯 免费 + 开源
- ⚒️ 思维导图、流程图
- 🖌 画笔（新增 🔥🔥🔥）
- 😀 插入 Iconfont 表情（🚧 支持中...）
- 🚀 基于插件机制 - 可灵活扩展
- 🖼️ 📃 导出为 PNG, JPG, JSON(`.drawnix`)
- 💾 自动保存（浏览器缓存）
- ⚡ 编辑特性：撤销、重做、复制、粘贴等
- 🌌 无限画布：缩放、滚动、
- 🎨 主题模式
- 📱 移动设备适配（交互优化 🔥🔥🔥）


## 关于名称

***Drawnix***  ，源于绘画(  ***Draw***  )与凤凰(  ***Phoenix***  )的灵感交织。

凤凰象征着生生不息的创造力，而 *Draw* 代表着人类最原始的表达方式。在这里，每一次创作都是一次艺术的涅槃，每一笔绘画都是灵感的重生。

创意如同凤凰，浴火方能重生，而  ***Drawnix***  要做技术与创意之火的守护者。

*Draw Beyond, Rise Above.*


## 与 Plait 画图框架

*Drawnix* 的定位是一个开箱即用、开源、免费的工具产品，它的底层是 *Plait* 框架，*Plait* 是我司开源的一款画图框架，代表着公司在知识库产品上的重要技术沉淀。


Drawnix 是插件架构，与前面说到开源工具比技术架构更复杂一些，但是插件架构也有优势，比如能够支持多种 UI 框架（*Angular、React*），能够集成不同富文本框架（当前仅支持 *Slate* 框架），在开发上可以很好的实现业务的分层，开发各种细粒度的可复用插件，可以扩展更多的画板的应用场景。


## 仓储结构

```
drawnix/
├── apps/
│   ├── web                   # drawnix.com
│   │    └── index.html       # HTML
├── dist/                     # 构建产物
├── packages/
│   └── drawnix/              # 白板应用
│   └── react-board/          # 白板 React 视图层
│   └── react-text/           # 文本渲染模块
├── package.json
├── ...
└── README.md
└── README_en.md

```

## 应用

[*https://drawnix.com*](https://drawnix.com) 是 *drawnix* 的最小化应用。

近期会高频迭代 drawnix.com，直到发布 *Dawn（破晓）* 版本。


## 开发

```
npm install

npm run start
```

## 依赖

- [plait](https://github.com/worktile/plait) - 画图框架
- [slate](https://github.com/ianstormtaylor/slate)  - 富文本编辑器框架
- [floating-ui](https://github.com/floating-ui/floating-ui)  - 一个超级好用的创建弹出层基础库



## 贡献

欢迎任何形式的贡献：

- 提 Bug

- 贡献代码

## 支持

*欢迎大家 star ⭐️⭐️⭐️ 支持。*


## License

[MIT License](https://github.com/plait-board/drawnix/blob/master/LICENSE)  