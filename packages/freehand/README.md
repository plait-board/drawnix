# @plait-board/freehand

Reusable freehand drawing and erasing plugins for Plait boards.

```ts
import { createFreehandPlugin } from '@plait-board/freehand';
import { withOptions } from '@plait/core';
import { withDraw } from '@plait/draw';

const withFreehand = createFreehandPlugin({
  getDrawOptions: () => ({ strokeWidth: 2 }),
  isInteractionBlocked: (board) => isPinching(board),
  createEraseTrail: () => new MyEraseTrail(),
});

const plugins = [withOptions, withDraw, withFreehand];
```

Application-specific toolbars, persisted presets, gesture policy, and eraser-trail presentation can be supplied through `createFreehandPlugin` options.

## Development

```sh
npx nx test freehand
npx nx build freehand
```
