## 0.4.0-0 (2025-11-10)


### 🩹 Fixes

- **mind:** fix image scaling issue ([44dd360](https://github.com/plait-board/drawnix/commit/44dd360))

### ❤️  Thank You

- seepine @seepine

## 0.3.3 (2025-10-26)


### 🚀 Features

- handle text editing on touch device ([e4a42d0](https://github.com/plait-board/drawnix/commit/e4a42d0))

### 🩹 Fixes

- make menu click trigger show/hide submenu for mobile users to be able to choose the submenu ([93c9254](https://github.com/plait-board/drawnix/commit/93c9254))
- improve withPinchZoom Maintain pointerRecords accurately, as previous schemes would cause pointerRecords to be confused(using touch events) ([f39b1c8](https://github.com/plait-board/drawnix/commit/f39b1c8))
- fix moving and selection error since  leave out  pointerMove, some plugins don't work ([193e193](https://github.com/plait-board/drawnix/commit/193e193))
- improve arrow ([1d111fb](https://github.com/plait-board/drawnix/commit/1d111fb))
- **freehand:** disable freehand and erase functionalities when user is using two fingers This pr will fix the issue mentioned in #331. 1. Maintain the status of two fingers pressing 2. Prevent freehand drawing and erasing when `isTwoFingerMode` is `true`. ([#331](https://github.com/plait-board/drawnix/issues/331))
- **toolbar:** make arrow and shape picker button automatically select the first arrow/shape if it's the first time ([451b36e](https://github.com/plait-board/drawnix/commit/451b36e))

### ❤️  Thank You

- Andy Lu (Lu, Yu-An)
- pubuzhixing8 @pubuzhixing8

## 0.3.2 (2025-10-19)

This was a version bump only, there were no code changes.

## 0.3.1 (2025-10-16)


### 🩹 Fixes

- correct @plait-board/markdown-to-drawnix version ([9ff924e](https://github.com/plait-board/drawnix/commit/9ff924e))
- **hotkey:** move preventDefault() into specific conditional branching ([#303](https://github.com/plait-board/drawnix/pull/303))

### ❤️  Thank You

- pubuzhixing8 @pubuzhixing8

## 0.3.0 (2025-09-13)


### 🚀 Features

- **arrow:** support set arrow mark ([#258](https://github.com/plait-board/drawnix/pull/258))
- **eraser:** implement eraser feature ([#221](https://github.com/plait-board/drawnix/pull/221))
- **eraser:** adding i18n for eraser ([427a730](https://github.com/plait-board/drawnix/commit/427a730))
- **eraser:** Improving all the eraser feature mentioned in #247 ([#249](https://github.com/plait-board/drawnix/pull/249), [#247](https://github.com/plait-board/drawnix/issues/247))
- **eraser:** drawing erasing trail animation effect ([#295](https://github.com/plait-board/drawnix/pull/295))
- **i18n:** added i18n tool for multi-Language support ([#232](https://github.com/plait-board/drawnix/pull/232))
- **i18n:** adding i18n for clean confirm ([7bdf543](https://github.com/plait-board/drawnix/commit/7bdf543))
- **i18n:** refactor the structure of i18n, adding with-common getI18n for plait objects, complete the translation of zh,en,ru ([#276](https://github.com/plait-board/drawnix/pull/276))
- **i18n:** add Arabic language ([#280](https://github.com/plait-board/drawnix/pull/280))
- **popup-toolbar:** add stroke select state, add stroke type text ([#272](https://github.com/plait-board/drawnix/pull/272))

### 🩹 Fixes

- fix dockerfile build logic ([#201](https://github.com/plait-board/drawnix/pull/201))
- **cursor:** set mind element css to always be inherit ([#260](https://github.com/plait-board/drawnix/pull/260))
- **freehand&i18n:** fix i18n of freehand toolbar and make secondary toolbar always exist while using freehand element ([#255](https://github.com/plait-board/drawnix/pull/255))
- **frontend:** comment addDebugLog to prevent potential XSS security issue ([#269](https://github.com/plait-board/drawnix/pull/269))
- **hotkey:** prevent switch arrow creation mode when mod+a #195 ([#200](https://github.com/plait-board/drawnix/pull/200), [#195](https://github.com/plait-board/drawnix/issues/195))
- **hotkey:** prevent enter arrow creation mode when press a and there are some selected elements ([#205](https://github.com/plait-board/drawnix/pull/205))
- **hotkey:** Prevent Arc browser undo on Cmd+Z in Drawnix ([#254](https://github.com/plait-board/drawnix/pull/254))
- **hotkey:** skip creation hotkey when use press special key and the among of alt, meta and ctrl ([#262](https://github.com/plait-board/drawnix/pull/262))
- **menu:** Adding margin for the menu components ([c9ecd09](https://github.com/plait-board/drawnix/commit/c9ecd09))
- **menu:** fix hotkey instruction for every OS ([#274](https://github.com/plait-board/drawnix/pull/274))
- **mind:** bump plait into 0.84.0 to fix text can not show completely mentioned in #208 ([#261](https://github.com/plait-board/drawnix/pull/261), [#208](https://github.com/plait-board/drawnix/issues/208))
- **toolbar:** fix issue mentioned in #290 ([#291](https://github.com/plait-board/drawnix/pull/291), [#290](https://github.com/plait-board/drawnix/issues/290))
- **tutorial:** fix tutorial instruction issues and update styles ([#289](https://github.com/plait-board/drawnix/pull/289))

### ❤️  Thank You

- Andy Lu (Lu, Yu-An) @NaoCoding
- coderwei @coderwei99
- MalikAli @MalikAliQassem
- Peter Chen
- pubuzhixing8 @pubuzhixing8
- Six
- vishwak @PATTASWAMY-VISHWAK-YASASHREE

## 0.2.1 (2025-08-06)


### 🩹 Fixes

- **hotkey:** assign t as hotkey to create text element ([#192](https://github.com/plait-board/drawnix/pull/192))

### ❤️  Thank You

- pubuzhixing8 @pubuzhixing8

## 0.2.0 (2025-08-06)

This was a version bump only, there were no code changes.

## 0.1.4 (2025-08-06)

This was a version bump only, there were no code changes.

## 0.1.3 (2025-08-06)


### 🩹 Fixes

- **hotkey:** prevent hotkey when  type normally ([#189](https://github.com/plait-board/drawnix/pull/189))

### ❤️  Thank You

- pubuzhixing8 @pubuzhixing8

## 0.1.2 (2025-08-06)


### 🚀 Features

- **creation:** support creation mode hotkey #183 ([#185](https://github.com/plait-board/drawnix/pull/185), [#183](https://github.com/plait-board/drawnix/issues/183))
- **mind:** bump plait into 0.82.0 to improve the experience of mind ([f904594](https://github.com/plait-board/drawnix/commit/f904594))
- **viewer:** support image which in mind node view #125 ([#125](https://github.com/plait-board/drawnix/issues/125))

### ❤️  Thank You

- pubuzhixing8 @pubuzhixing8

## 0.1.1 (2025-07-10)


### 🩹 Fixes

- **text:** resolve text can not auto break line #173 #169 ([#173](https://github.com/plait-board/drawnix/issues/173), [#169](https://github.com/plait-board/drawnix/issues/169))

### ❤️  Thank You

- pubuzhixing8 @pubuzhixing8

## 0.1.0 (2025-07-02)


### 🚀 Features

- import styles ([ecfe3cd](https://github.com/plait-board/drawnix/commit/ecfe3cd))
- add script and update ci ([147c028](https://github.com/plait-board/drawnix/commit/147c028))
- bump plait into 0.62.0-next.7 ([7ab4003](https://github.com/plait-board/drawnix/commit/7ab4003))
- add main menu ([#14](https://github.com/plait-board/drawnix/pull/14))
- improve active-toolbar ([fd19725](https://github.com/plait-board/drawnix/commit/fd19725))
- rename active-toolbar to popup-toolbar and modify tool-button ([aa06c7e](https://github.com/plait-board/drawnix/commit/aa06c7e))
- support opacity for  color property ([#16](https://github.com/plait-board/drawnix/pull/16))
- support local storage ([9c0e652](https://github.com/plait-board/drawnix/commit/9c0e652))
- add product_showcase bump plait into 0.69.0 ([61fe571](https://github.com/plait-board/drawnix/commit/61fe571))
- add sitemap ([3b9d9a3](https://github.com/plait-board/drawnix/commit/3b9d9a3))
- improve pinch zoom ([#77](https://github.com/plait-board/drawnix/pull/77))
- bump plait into 0.76.0 and handle break changes ([#90](https://github.com/plait-board/drawnix/pull/90))
- improve README ([9e0190d](https://github.com/plait-board/drawnix/commit/9e0190d))
- add dependencies for packages ([6d89b32](https://github.com/plait-board/drawnix/commit/6d89b32))
- init dialog and mermaid-to-dialog ([6ff70b9](https://github.com/plait-board/drawnix/commit/6ff70b9))
- support save as json from hotkey ([120dffa](https://github.com/plait-board/drawnix/commit/120dffa))
- support sub menu and export jpg ([#132](https://github.com/plait-board/drawnix/pull/132))
- improve link popup state ([#147](https://github.com/plait-board/drawnix/pull/147))
- improve seo ([#148](https://github.com/plait-board/drawnix/pull/148))
- **active-toolbar:** add active toolbar ([7e737a2](https://github.com/plait-board/drawnix/commit/7e737a2))
- **active-toolbar:** support font color property ([4b2d964](https://github.com/plait-board/drawnix/commit/4b2d964))
- **app:** use localforage to storage main board content #122 ([#122](https://github.com/plait-board/drawnix/issues/122))
- **app-toolbar:** support undo/redo operation ([50f8831](https://github.com/plait-board/drawnix/commit/50f8831))
- **app-toolbar:** add trash and duplicate in app-toolbar ([#28](https://github.com/plait-board/drawnix/pull/28))
- **clean-board:** complete clean board ([#124](https://github.com/plait-board/drawnix/pull/124))
- **clean-confirm:** autoFocus ok button ([582172a](https://github.com/plait-board/drawnix/commit/582172a))
- **color-picker:** support merge operations for update opacity #4 ([#45](https://github.com/plait-board/drawnix/pull/45), [#4](https://github.com/plait-board/drawnix/issues/4))
- **component:** improve the onXXXChange feature for drawnix component #79 ([#79](https://github.com/plait-board/drawnix/issues/79))
- **component:** add afterInit to expose board instance ([23d91dc](https://github.com/plait-board/drawnix/commit/23d91dc))
- **component:** support update value from drawnix component outside ([#103](https://github.com/plait-board/drawnix/pull/103))
- **component:** fit viewport after children updated ([#104](https://github.com/plait-board/drawnix/pull/104))
- **creation-toolbar:** support long-press triggers drag selection an… ([#78](https://github.com/plait-board/drawnix/pull/78))
- **creation-toolbar:** remove default action when click shape and arrow icon in creation toolbar improve tool-button ([a46c2df](https://github.com/plait-board/drawnix/commit/a46c2df))
- **draw:** bump plait into 0.75.0-next.0 and support fine-grained selection ([#69](https://github.com/plait-board/drawnix/pull/69))
- **draw-toolbar:** add draw toolbar ([#9](https://github.com/plait-board/drawnix/pull/9))
- **draw-toolbar:** add shape and arrow panel for draw-toolbar #10 ([#12](https://github.com/plait-board/drawnix/pull/12), [#10](https://github.com/plait-board/drawnix/issues/10))
- **drawnix:** init drawnix package ([397d865](https://github.com/plait-board/drawnix/commit/397d865))
- **drawnix:** export utils ([#105](https://github.com/plait-board/drawnix/pull/105))
- **drawnix-board:** initialize drawnix board ([117e5a8](https://github.com/plait-board/drawnix/commit/117e5a8))
- **fill:** split fill color and fill opacity setting ([#53](https://github.com/plait-board/drawnix/pull/53))
- **flowchart:** add terminal shape element ([#80](https://github.com/plait-board/drawnix/pull/80))
- **freehand:** initialize freehand #2 ([#2](https://github.com/plait-board/drawnix/issues/2))
- **freehand:** apply gaussianSmooth to freehand curve ([#47](https://github.com/plait-board/drawnix/pull/47))
- **freehand:** update stroke width to 2 and optimize freehand end points ([#50](https://github.com/plait-board/drawnix/pull/50))
- **freehand:** improve freehand experience ([#51](https://github.com/plait-board/drawnix/pull/51))
- **freehand:** add FreehandSmoother to optimize freehand curve ([#62](https://github.com/plait-board/drawnix/pull/62))
- **freehand:** optimize freehand curve by stylus features ([#63](https://github.com/plait-board/drawnix/pull/63))
- **freehand:** freehand support theme ([b7c7965](https://github.com/plait-board/drawnix/commit/b7c7965))
- **freehand:** support closed freehand and add popup for freehand ([#68](https://github.com/plait-board/drawnix/pull/68))
- **freehand:** bump plait into 0.75.0-next.9 and resolve freehand unexpected resize-handle after moving freehand elements ([#84](https://github.com/plait-board/drawnix/pull/84))
- **hotkey:** support export png hotkey ([#30](https://github.com/plait-board/drawnix/pull/30))
- **image:** support free image element and support insert image at m… ([#95](https://github.com/plait-board/drawnix/pull/95))
- **image:** should hide popup toolbar when selected element include image ([#96](https://github.com/plait-board/drawnix/pull/96))
- **image:** support drag image to board to add image as draw element or mind node image ([#144](https://github.com/plait-board/drawnix/pull/144))
- **link:** improve link popup ([eba06e2](https://github.com/plait-board/drawnix/commit/eba06e2))
- **markdown-to-drawnix:** support markdown to drawnix mind map #134 ([#135](https://github.com/plait-board/drawnix/pull/135), [#134](https://github.com/plait-board/drawnix/issues/134))
- **menu:** support export to json file ([d0d6ca5](https://github.com/plait-board/drawnix/commit/d0d6ca5))
- **menu:** support load file action ([758aa6d](https://github.com/plait-board/drawnix/commit/758aa6d))
- **mermaid:** improve mermaid-to-drawnix ([a928ba1](https://github.com/plait-board/drawnix/commit/a928ba1))
- **mobile:** adapt mobile device ([7c0742f](https://github.com/plait-board/drawnix/commit/7c0742f))
- **pencil-mode:** add pencil mode and add drawnix context ([#76](https://github.com/plait-board/drawnix/pull/76))
- **pinch-zoom:** support pinch zoom for touch device ([#60](https://github.com/plait-board/drawnix/pull/60))
- **pinch-zoom:** improve pinch zoom functionality and support hand moving ([#75](https://github.com/plait-board/drawnix/pull/75))
- **popover:** add reusable popover and replace radix popover ([d30388a](https://github.com/plait-board/drawnix/commit/d30388a))
- **popup:** display icon when color is complete opacity ([#42](https://github.com/plait-board/drawnix/pull/42))
- **popup-toolbar:** support set branch color remove color property when select transparent #17 ([#17](https://github.com/plait-board/drawnix/issues/17))
- **popup-toolbar:** bump plait into 0.71.0 and mind node link stroke and node stroke support dashed/dotted style #22 ([#22](https://github.com/plait-board/drawnix/issues/22))
- **property:** support stroke style setting ([463c92a](https://github.com/plait-board/drawnix/commit/463c92a))
- **size-slider:** improve size-slider component ([780be9d](https://github.com/plait-board/drawnix/commit/780be9d))
- **text:** support soft break ([#39](https://github.com/plait-board/drawnix/pull/39))
- **text:** support update text from outside ([#58](https://github.com/plait-board/drawnix/pull/58))
- **text:** support insertSoftBreak for text #136 ([#136](https://github.com/plait-board/drawnix/issues/136))
- **theme-toolbar:** add theme selection toolbar for customizable themes ([dca0e33](https://github.com/plait-board/drawnix/commit/dca0e33))
- **toolbar:** support zoom toolbar ([76ef5d9](https://github.com/plait-board/drawnix/commit/76ef5d9))
- **web:** seo ([84cde4b](https://github.com/plait-board/drawnix/commit/84cde4b))
- **web:** add cloud.umami.is to track views ([#64](https://github.com/plait-board/drawnix/pull/64))
- **web:** modify initialize-data for adding freehand data ([#65](https://github.com/plait-board/drawnix/pull/65))
- **web:** add debug console ([#83](https://github.com/plait-board/drawnix/pull/83))
- **wrapper:** add wrapper component and context hook ([#6](https://github.com/plait-board/drawnix/pull/6))
- **zoom-toolbar:** support zoom menu ([cc6a6b8](https://github.com/plait-board/drawnix/commit/cc6a6b8))

### 🩹 Fixes

- remove theme-toolbar font-weight style ([#67](https://github.com/plait-board/drawnix/pull/67))
- revert package lock ([1aa9d42](https://github.com/plait-board/drawnix/commit/1aa9d42))
- fix pub issue ([156abcb](https://github.com/plait-board/drawnix/commit/156abcb))
- improve libs build ([9ddb6d9](https://github.com/plait-board/drawnix/commit/9ddb6d9))
- **app-toolbar:** correct app-toolbar style ([#106](https://github.com/plait-board/drawnix/pull/106))
- **arrow-line:** optimize the popup toolbar position when selected element is arrow line ([#70](https://github.com/plait-board/drawnix/pull/70))
- **board:** resolve mobile scrolling issue when resize or moving ([8fdca8e](https://github.com/plait-board/drawnix/commit/8fdca8e))
- **board:** bump plait into 0.69.1 deselect when text editing end refactor popup toolbar placement ([aef6d23](https://github.com/plait-board/drawnix/commit/aef6d23))
- **board:** use updateViewBox to fix board wobbles when dragging or resizing ([#94](https://github.com/plait-board/drawnix/pull/94))
- **color-picker:** support display 0 opacity ([#48](https://github.com/plait-board/drawnix/pull/48))
- **core:** bump plait into 0.79.1 to fix with-hand issue when press space key #141 ([#149](https://github.com/plait-board/drawnix/pull/149), [#141](https://github.com/plait-board/drawnix/issues/141))
- **creation-toolbar:** use pointerUp set basic pointer cause onChange do not fire on mobile bind pointermove/pointerup to viewportContainerRef to implement dnd on mobile #20 ([#20](https://github.com/plait-board/drawnix/issues/20))
- **creation-toolbar:** move out toolbar from board to avoid fired pointer down event when operating ([ddb6092](https://github.com/plait-board/drawnix/commit/ddb6092))
- **font-color:** fix color can not be assigned when current color is empty ([#55](https://github.com/plait-board/drawnix/pull/55))
- **freehand:** fix freehand creation issue(caused by throttleRAF) ([#40](https://github.com/plait-board/drawnix/pull/40))
- **mermaid:** bump mermaid-to-drawnix to 0.0.2 to fix text display issue ([33878d0](https://github.com/plait-board/drawnix/commit/33878d0))
- **mermaid-to-drawnix:** support group for insertToBoard ([e2f5056](https://github.com/plait-board/drawnix/commit/e2f5056))
- **mind:** remove branchColor property setting ([#46](https://github.com/plait-board/drawnix/pull/46))
- **property:** prevent set fill color opacity when color is none ([#56](https://github.com/plait-board/drawnix/pull/56))
- **react-board:** resolve text should not display in safari ([19fc20f](https://github.com/plait-board/drawnix/commit/19fc20f))
- **react-board:** support fit viewport after browser window resized ([96f4a0e](https://github.com/plait-board/drawnix/commit/96f4a0e))
- **size-slider:** correct size slider click handle can not fire ([#57](https://github.com/plait-board/drawnix/pull/57))
- **text:** fix composition input and abc input trembly issue ([#15](https://github.com/plait-board/drawnix/pull/15))
- **text:** resolve with-text build error ([#41](https://github.com/plait-board/drawnix/pull/41))
- **text:** fix text can not editing ([#52](https://github.com/plait-board/drawnix/pull/52))
- **text:** fix text can not display correctly on windows 10 chrome env #99 ([#100](https://github.com/plait-board/drawnix/pull/100), [#99](https://github.com/plait-board/drawnix/issues/99))
- **text:** allow scroll to show all text ([#156](https://github.com/plait-board/drawnix/pull/156))
- **text:** set whiteSpace: pre to avoid \n is ineffectual ([#165](https://github.com/plait-board/drawnix/pull/165))
- **use-board-event:** fix board event timing ([0d4a8f1](https://github.com/plait-board/drawnix/commit/0d4a8f1))

### ❤️  Thank You

- pubuzhixing8 @pubuzhixing8

## 0.0.4 (2025-04-15)


### 🚀 Features

- ci: a tiny docker image (#127) ([#122](https://github.com/plait-board/drawnix/pull/127))
- support save as json from hotkey ([120dffa](https://github.com/plait-board/drawnix/commit/120dffa))
- **app:** use localforage to storage main board content #122 ([#122](https://github.com/plait-board/drawnix/issues/122))
- **clean-board:** complete clean board ([#124](https://github.com/plait-board/drawnix/pull/124))

### 🩹 Fixes

- **react-board:** support fit viewport after browser window resized ([96f4a0e](https://github.com/plait-board/drawnix/commit/96f4a0e))

### ❤️  Thank You

- lurenyang418 @lurenyang418
- whyour @whyour
- pubuzhixing8 @pubuzhixing8

## 0.0.4-3 (2025-03-25)


### 🩹 Fixes

- improve libs build ([9ddb6d9](https://github.com/plait-board/drawnix/commit/9ddb6d9))
- **mermaid:** bump mermaid-to-drawnix to 0.0.2 to fix text display issue ([33878d0](https://github.com/plait-board/drawnix/commit/33878d0))

### ❤️  Thank You

- pubuzhixing8

## 0.0.4-2 (2025-03-19)


### 🚀 Features

- init dialog and mermaid-to-dialog ([6ff70b9](https://github.com/plait-board/drawnix/commit/6ff70b9))
- **mermaid:** improve mermaid-to-drawnix ([a928ba1](https://github.com/plait-board/drawnix/commit/a928ba1))

### ❤️  Thank You

- pubuzhixing8 @pubuzhixing8

## 0.0.4-1 (2025-03-16)

This was a version bump only, there were no code changes.

## 0.0.4-0 (2025-03-16)


### 🚀 Features

- add dependencies for packages ([6d89b32](https://github.com/plait-board/drawnix/commit/6d89b32))
- **component:** support update value from drawnix component outside ([#103](https://github.com/plait-board/drawnix/pull/103))
- **component:** fit viewport after children updated ([#104](https://github.com/plait-board/drawnix/pull/104))
- **drawnix:** export utils ([#105](https://github.com/plait-board/drawnix/pull/105))

### 🩹 Fixes

- **app-toolbar:** correct app-toolbar style ([#106](https://github.com/plait-board/drawnix/pull/106))

### ❤️  Thank You

- pubuzhixing8 @pubuzhixing8

## 0.0.3 (2025-03-14)


### 🩹 Fixes

- revert package lock ([1aa9d42](https://github.com/plait-board/drawnix/commit/1aa9d42))
- fix pub issue ([156abcb](https://github.com/plait-board/drawnix/commit/156abcb))
- **text:** fix text can not display correctly on windows 10 chrome env #99 ([#100](https://github.com/plait-board/drawnix/pull/100), [#99](https://github.com/plait-board/drawnix/issues/99))

### ❤️  Thank You

- pubuzhixing8 @pubuzhixing8

## 0.0.2 (2025-03-10)


### 🚀 Features

- improve README ([9e0190d](https://github.com/plait-board/drawnix/commit/9e0190d))

### ❤️  Thank You

- pubuzhixing8 @pubuzhixing8

## 0.0.1 (2025-03-10)


### 🚀 Features

- import styles ([ecfe3cd](https://github.com/plait-board/drawnix/commit/ecfe3cd))
- add script and update ci ([147c028](https://github.com/plait-board/drawnix/commit/147c028))
- bump plait into 0.62.0-next.7 ([7ab4003](https://github.com/plait-board/drawnix/commit/7ab4003))
- add main menu ([#14](https://github.com/plait-board/drawnix/pull/14))
- improve active-toolbar ([fd19725](https://github.com/plait-board/drawnix/commit/fd19725))
- rename active-toolbar to popup-toolbar and modify tool-button ([aa06c7e](https://github.com/plait-board/drawnix/commit/aa06c7e))
- support opacity for  color property ([#16](https://github.com/plait-board/drawnix/pull/16))
- support local storage ([9c0e652](https://github.com/plait-board/drawnix/commit/9c0e652))
- add product_showcase bump plait into 0.69.0 ([61fe571](https://github.com/plait-board/drawnix/commit/61fe571))
- add sitemap ([3b9d9a3](https://github.com/plait-board/drawnix/commit/3b9d9a3))
- improve pinch zoom ([#77](https://github.com/plait-board/drawnix/pull/77))
- bump plait into 0.76.0 and handle break changes ([#90](https://github.com/plait-board/drawnix/pull/90))
- **active-toolbar:** add active toolbar ([7e737a2](https://github.com/plait-board/drawnix/commit/7e737a2))
- **active-toolbar:** support font color property ([4b2d964](https://github.com/plait-board/drawnix/commit/4b2d964))
- **app-toolbar:** support undo/redo operation ([50f8831](https://github.com/plait-board/drawnix/commit/50f8831))
- **app-toolbar:** add trash and duplicate in app-toolbar ([#28](https://github.com/plait-board/drawnix/pull/28))
- **color-picker:** support merge operations for update opacity #4 ([#45](https://github.com/plait-board/drawnix/pull/45), [#4](https://github.com/plait-board/drawnix/issues/4))
- **component:** improve the onXXXChange feature for drawnix component #79 ([#79](https://github.com/plait-board/drawnix/issues/79))
- **component:** add afterInit to expose board instance ([23d91dc](https://github.com/plait-board/drawnix/commit/23d91dc))
- **creation-toolbar:** support long-press triggers drag selection an… ([#78](https://github.com/plait-board/drawnix/pull/78))
- **draw:** bump plait into 0.75.0-next.0 and support fine-grained selection ([#69](https://github.com/plait-board/drawnix/pull/69))
- **draw-toolbar:** add draw toolbar ([#9](https://github.com/plait-board/drawnix/pull/9))
- **draw-toolbar:** add shape and arrow panel for draw-toolbar #10 ([#12](https://github.com/plait-board/drawnix/pull/12), [#10](https://github.com/plait-board/drawnix/issues/10))
- **drawnix:** init drawnix package ([397d865](https://github.com/plait-board/drawnix/commit/397d865))
- **drawnix-board:** initialize drawnix board ([117e5a8](https://github.com/plait-board/drawnix/commit/117e5a8))
- **fill:** split fill color and fill opacity setting ([#53](https://github.com/plait-board/drawnix/pull/53))
- **flowchart:** add terminal shape element ([#80](https://github.com/plait-board/drawnix/pull/80))
- **freehand:** initialize freehand #2 ([#2](https://github.com/plait-board/drawnix/issues/2))
- **freehand:** apply gaussianSmooth to freehand curve ([#47](https://github.com/plait-board/drawnix/pull/47))
- **freehand:** update stroke width to 2 and optimize freehand end points ([#50](https://github.com/plait-board/drawnix/pull/50))
- **freehand:** improve freehand experience ([#51](https://github.com/plait-board/drawnix/pull/51))
- **freehand:** add FreehandSmoother to optimize freehand curve ([#62](https://github.com/plait-board/drawnix/pull/62))
- **freehand:** optimize freehand curve by stylus features ([#63](https://github.com/plait-board/drawnix/pull/63))
- **freehand:** freehand support theme ([b7c7965](https://github.com/plait-board/drawnix/commit/b7c7965))
- **freehand:** support closed freehand and add popup for freehand ([#68](https://github.com/plait-board/drawnix/pull/68))
- **freehand:** bump plait into 0.75.0-next.9 and resolve freehand unexpected resize-handle after moving freehand elements ([#84](https://github.com/plait-board/drawnix/pull/84))
- **hotkey:** support export png hotkey ([#30](https://github.com/plait-board/drawnix/pull/30))
- **image:** support free image element and support insert image at m… ([#95](https://github.com/plait-board/drawnix/pull/95))
- **image:** should hide popup toolbar when selected element include image ([#96](https://github.com/plait-board/drawnix/pull/96))
- **menu:** support export to json file ([d0d6ca5](https://github.com/plait-board/drawnix/commit/d0d6ca5))
- **menu:** support load file action ([758aa6d](https://github.com/plait-board/drawnix/commit/758aa6d))
- **mobile:** adapt mobile device ([7c0742f](https://github.com/plait-board/drawnix/commit/7c0742f))
- **pencil-mode:** add pencil mode and add drawnix context ([#76](https://github.com/plait-board/drawnix/pull/76))
- **pinch-zoom:** support pinch zoom for touch device ([#60](https://github.com/plait-board/drawnix/pull/60))
- **pinch-zoom:** improve pinch zoom functionality and support hand moving ([#75](https://github.com/plait-board/drawnix/pull/75))
- **popover:** add reusable popover and replace radix popover ([d30388a](https://github.com/plait-board/drawnix/commit/d30388a))
- **popup:** display icon when color is complete opacity ([#42](https://github.com/plait-board/drawnix/pull/42))
- **popup-toolbar:** support set branch color remove color property when select transparent #17 ([#17](https://github.com/plait-board/drawnix/issues/17))
- **popup-toolbar:** bump plait into 0.71.0 and mind node link stroke and node stroke support dashed/dotted style #22 ([#22](https://github.com/plait-board/drawnix/issues/22))
- **property:** support stroke style setting ([463c92a](https://github.com/plait-board/drawnix/commit/463c92a))
- **size-slider:** improve size-slider component ([780be9d](https://github.com/plait-board/drawnix/commit/780be9d))
- **text:** support soft break ([#39](https://github.com/plait-board/drawnix/pull/39))
- **text:** support update text from outside ([#58](https://github.com/plait-board/drawnix/pull/58))
- **theme-toolbar:** add theme selection toolbar for customizable themes ([dca0e33](https://github.com/plait-board/drawnix/commit/dca0e33))
- **toolbar:** support zoom toolbar ([76ef5d9](https://github.com/plait-board/drawnix/commit/76ef5d9))
- **web:** seo ([84cde4b](https://github.com/plait-board/drawnix/commit/84cde4b))
- **web:** add cloud.umami.is to track views ([#64](https://github.com/plait-board/drawnix/pull/64))
- **web:** modify initialize-data for adding freehand data ([#65](https://github.com/plait-board/drawnix/pull/65))
- **web:** add debug console ([#83](https://github.com/plait-board/drawnix/pull/83))
- **wrapper:** add wrapper component and context hook ([#6](https://github.com/plait-board/drawnix/pull/6))
- **zoom-toolbar:** support zoom menu ([cc6a6b8](https://github.com/plait-board/drawnix/commit/cc6a6b8))

### 🩹 Fixes

- remove theme-toolbar font-weight style ([#67](https://github.com/plait-board/drawnix/pull/67))
- **arrow-line:** optimize the popup toolbar position when selected element is arrow line ([#70](https://github.com/plait-board/drawnix/pull/70))
- **board:** resolve mobile scrolling issue when resize or moving ([8fdca8e](https://github.com/plait-board/drawnix/commit/8fdca8e))
- **board:** bump plait into 0.69.1 deselect when text editing end refactor popup toolbar placement ([aef6d23](https://github.com/plait-board/drawnix/commit/aef6d23))
- **board:** use updateViewBox to fix board wobbles when dragging or resizing ([#94](https://github.com/plait-board/drawnix/pull/94))
- **color-picker:** support display 0 opacity ([#48](https://github.com/plait-board/drawnix/pull/48))
- **creation-toolbar:** use pointerUp set basic pointer cause onChange do not fire on mobile bind pointermove/pointerup to viewportContainerRef to implement dnd on mobile #20 ([#20](https://github.com/plait-board/drawnix/issues/20))
- **creation-toolbar:** move out toolbar from board to avoid fired pointer down event when operating ([ddb6092](https://github.com/plait-board/drawnix/commit/ddb6092))
- **font-color:** fix color can not be assigned when current color is empty ([#55](https://github.com/plait-board/drawnix/pull/55))
- **freehand:** fix freehand creation issue(caused by throttleRAF) ([#40](https://github.com/plait-board/drawnix/pull/40))
- **mind:** remove branchColor property setting ([#46](https://github.com/plait-board/drawnix/pull/46))
- **property:** prevent set fill color opacity when color is none ([#56](https://github.com/plait-board/drawnix/pull/56))
- **react-board:** resolve text should not display in safari ([19fc20f](https://github.com/plait-board/drawnix/commit/19fc20f))
- **size-slider:** correct size slider click handle can not fire ([#57](https://github.com/plait-board/drawnix/pull/57))
- **text:** fix composition input and abc input trembly issue ([#15](https://github.com/plait-board/drawnix/pull/15))
- **text:** resolve with-text build error ([#41](https://github.com/plait-board/drawnix/pull/41))
- **text:** fix text can not editing ([#52](https://github.com/plait-board/drawnix/pull/52))
- **use-board-event:** fix board event timing ([0d4a8f1](https://github.com/plait-board/drawnix/commit/0d4a8f1))

### ❤️  Thank You

- pubuzhixing8 @pubuzhixing8