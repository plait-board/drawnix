<p align="center">
  <picture style="width: 320px">
    <source media="(prefers-color-scheme: light)" srcset="https://github.com/plait-board/drawnix/blob/develop/apps/web/public/logo/logo_drawnix_h.svg?raw=true" />
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/plait-board/drawnix/blob/develop/apps/web/public/logo/logo_drawnix_h_dark.svg?raw=true" />
    <img src="https://github.com/plait-board/drawnix/blob/develop/apps/web/public/logo/logo_drawnix_h.svg?raw=true" width="360" alt="Drawnix logo and name" />
  </picture>
</p>
<div align="center">
  <h2>
    Инструмент с открытым исходным кодом для белой доски (SaaS), универсальная доска для совместной работы, включающая интеллект-карты, блок-схемы, свободное рисование и многое другое.
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
        Универсальная доска с интеллект-картами, блок-схемами, свободным рисованием и многим другим
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

[*中文*](https://github.com/plait-board/drawnix/blob/read_me/README.md) | [*English*](https://github.com/plait-board/drawnix/blob/read_me/README_en.md) | [*العربية*](https://github.com/plait-board/drawnix/blob/read_me/README_ar.md)

## Особенности

- 💯 Бесплатно и с открытым исходным кодом
- ⚒️ Интеллект-карты и блок-схемы
- 🖌 Свободное рисование
- 😀 Поддержка изображений
- 🚀 Архитектура на основе плагинов - расширяемая
- 🖼️ 📃 Экспорт в PNG, JPG, SVG, JSON(.drawnix)
- 💾 Автосохранение (хранилище браузера)
- ⚡ Функции редактирования: отмена, повтор, копирование, вставка и т.д.
- 🌌 Бесконечный холст: масштабирование, прокрутка
- 🎨 Темы оформления
- 📱 Адаптация для мобильных устройств
- 📈 Поддержка преобразования синтаксиса Mermaid в блок-схемы
- ✨ Поддержка преобразования текста Markdown в интеллект-карты (новая поддержка 🔥🔥🔥)


## О названии

***Drawnix*** происходит от переплетения вдохновения рисования (***Draw***) и феникса (***Phoenix***).

Феникс символизирует неиссякаемую творческую силу, а *Draw* представляет самый первозданный способ человеческого выражения. Здесь каждое творение — это художественное возрождение, каждый штрих рисунка — это возрождение вдохновения.

Творчество подобно фениксу, который может возродиться только через огонь, а ***Drawnix*** стремится быть хранителем огня технологий и творчества.

*Draw Beyond, Rise Above.*


## Связь с фреймворком для рисования Plait

*Drawnix* позиционируется как готовый к использованию, открытый и бесплатный инструментальный продукт. Его основой является фреймворк *Plait*, который представляет собой фреймворк для рисования с открытым исходным кодом, разработанный нашей компанией и представляющий важные технологические наработки компании в области продуктов базы знаний ([PingCode Wiki](https://pingcode.com/product/wiki?utm_source=drawnix)).

Drawnix имеет плагинную архитектуру, которая технически несколько сложнее упомянутых выше инструментов с открытым исходным кодом, но плагинная архитектура также имеет преимущества, такие как возможность поддержки различных UI-фреймворков (*Angular, React*), интеграция различных фреймворков богатого текста (в настоящее время поддерживается только фреймворк *Slate*), в разработке можно хорошо реализовать расслоение бизнеса, разрабатывать различные детализированные повторно используемые плагины, можно расширить больше сценариев применения доски для рисования.


## Структура репозитория

```
drawnix/
├── apps/
│   ├── web                   # drawnix.com
│   │    └── index.html       # HTML
├── dist/                     # артефакты сборки
├── packages/
│   └── drawnix/              # приложение доски
│   └── react-board/          # слой представления React для доски
│   └── react-text/           # модуль рендеринга текста
├── package.json
├── ...
└── README.md
└── README_en.md

```

## Приложение

[*https://drawnix.com*](https://drawnix.com) — это минимальное приложение *drawnix*.

В ближайшее время будет происходить высокочастотная итерация drawnix.com до выпуска версии *Dawn (Рассвет)*.


## Разработка

```
npm install

npm run start
```

## Docker

```
docker pull pubuzhixing/drawnix:latest
```

## Зависимости

- [plait](https://github.com/worktile/plait) - фреймворк для рисования с открытым исходным кодом
- [slate](https://github.com/ianstormtaylor/slate) - фреймворк редактора богатого текста
- [floating-ui](https://github.com/floating-ui/floating-ui) - отличная базовая библиотека для создания всплывающих слоев



## Вклад

Приветствуется любая форма вклада:

- Сообщение об ошибках

- Вклад в код

## Благодарности за поддержку

Особая благодарность компании за большую поддержку проектов с открытым исходным кодом, а также друзьям, которые внесли свой вклад в код и предложения для этого проекта.

<p align="left">
  <a href="https://pingcode.com?utm_source=drawnix" target="_blank">
      <img src="https://cdn-aliyun.pingcode.com/static/site/img/pingcode-logo.4267e7b.svg" width="120" alt="PingCode" />
  </a>
</p>

## Лицензия

[MIT License](https://github.com/plait-board/drawnix/blob/master/LICENSE)