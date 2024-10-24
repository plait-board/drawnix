import type { PlaitElement } from '@plait/core';

export const initializeData: PlaitElement[] = [
  {
    id: 'Sfftf',
    type: 'geometry',
    shape: 'terminal',
    angle: 0,
    opacity: 1,
    textHeight: 20,
    text: {
      children: [
        {
          text: '结束',
        },
      ],
      align: 'center',
    },
    points: [
      [-124.8046875, 612.1328125],
      [-4.8046875, 672.1328125],
    ],
    strokeWidth: 2,
    strokeColor: '#333333',
  },
  {
    id: 'aMJWD',
    type: 'geometry',
    shape: 'process',
    angle: 0,
    opacity: 1,
    textHeight: 20,
    text: {
      children: [
        {
          text: '过程',
        },
      ],
      align: 'center',
    },
    points: [
      [80.1953125, 452.1328125],
      [200.1953125, 512.1328125],
    ],
    strokeWidth: 2,
    strokeColor: '#333333',
  },
  {
    id: 'FHSxH',
    type: 'geometry',
    shape: 'decision',
    angle: 0,
    opacity: 1,
    textHeight: 20,
    text: {
      children: [
        {
          text: '判断',
        },
      ],
      align: 'center',
    },
    points: [
      [-134.8046875, 447.1328125],
      [5.1953125, 517.1328125],
    ],
    strokeWidth: 2,
    strokeColor: '#333333',
  },
  {
    id: 'xnnhM',
    type: 'geometry',
    shape: 'process',
    angle: 0,
    opacity: 1,
    textHeight: 20,
    text: {
      children: [
        {
          text: '过程',
        },
      ],
      align: 'center',
    },
    points: [
      [-124.8046875, 332.1328125],
      [-4.8046875, 392.1328125],
    ],
    strokeWidth: 2,
    strokeColor: '#333333',
  },
  {
    id: 'FAkXk',
    type: 'geometry',
    shape: 'terminal',
    angle: 0,
    opacity: 1,
    textHeight: 20,
    text: {
      children: [
        {
          text: '开始',
        },
      ],
      align: 'center',
    },
    points: [
      [-124.8046875, 217.1328125],
      [-4.8046875, 277.1328125],
    ],
    strokeWidth: 2,
    strokeColor: '#333333',
  },
  {
    id: 'mrdfi',
    type: 'line',
    shape: 'elbow',
    source: {
      marker: 'none',
      connection: [0.5, 1],
      boundId: 'aMJWD',
    },
    texts: [],
    target: {
      marker: 'arrow',
      connection: [1, 0.5],
      boundId: 'Sfftf',
    },
    opacity: 1,
    points: [
      [140.1953125, 512.1328125],
      [-4.8046875, 642.1328125],
    ],
    strokeWidth: 2,
    strokeColor: '#333333',
  },
  {
    id: 'bjjcw',
    type: 'line',
    shape: 'elbow',
    source: {
      marker: 'none',
      connection: [1, 0.5],
      boundId: 'FHSxH',
    },
    texts: [
      {
        text: {
          children: [
            {
              text: '否',
            },
          ],
        },
        position: 0.5,
        width: 14,
        height: 20,
      },
    ],
    target: {
      marker: 'arrow',
      connection: [0, 0.5],
      boundId: 'aMJWD',
    },
    opacity: 1,
    points: [
      [5.1953125, 482.1328125],
      [80.1953125, 482.1328125],
    ],
    strokeWidth: 2,
    strokeColor: '#333333',
  },
  {
    id: 'mnzKm',
    type: 'line',
    shape: 'elbow',
    source: {
      marker: 'none',
      connection: [0.5, 1],
      boundId: 'FHSxH',
    },
    texts: [
      {
        text: {
          children: [
            {
              text: '是',
            },
          ],
        },
        position: 0.5,
        width: 14,
        height: 20,
      },
    ],
    target: {
      marker: 'arrow',
      connection: [0.5, 0],
      boundId: 'Sfftf',
    },
    opacity: 1,
    points: [
      [-64.8046875, 517.1328125],
      [-64.8046875, 612.1328125],
    ],
    strokeWidth: 2,
    strokeColor: '#333333',
  },
  {
    id: 'bJmWK',
    type: 'line',
    shape: 'elbow',
    source: {
      marker: 'none',
      connection: [0.5, 1],
      boundId: 'xnnhM',
    },
    texts: [],
    target: {
      marker: 'arrow',
      connection: [0.5, 0],
      boundId: 'FHSxH',
    },
    opacity: 1,
    points: [
      [-64.8046875, 392.1328125],
      [-64.8046875, 447.1328125],
    ],
    strokeWidth: 2,
    strokeColor: '#333333',
  },
  {
    id: 'zZtTs',
    type: 'line',
    shape: 'elbow',
    source: {
      marker: 'none',
      connection: [0.5, 1],
      boundId: 'FAkXk',
    },
    texts: [],
    target: {
      marker: 'arrow',
      connection: [0.5, 0],
      boundId: 'xnnhM',
    },
    opacity: 1,
    points: [
      [-64.8046875, 277.1328125],
      [-64.8046875, 332.1328125],
    ],
    strokeWidth: 2,
    strokeColor: '#333333',
  },
  {
    type: 'mindmap',
    id: 'rzdDJ',
    rightNodeCount: 4,
    data: {
      topic: {
        children: [
          {
            text: '思维导图',
          },
        ],
      },
    },
    children: [
      {
        id: 'WKQyj',
        data: {
          topic: {
            children: [
              {
                text: '观点一',
              },
            ],
          },
        },
        children: [
          {
            id: 'RYSRd',
            data: {
              topic: {
                children: [
                  {
                    text: '',
                  },
                ],
              },
            },
            children: [
              {
                id: 'nDBRj',
                data: {
                  topic: {
                    children: [
                      {
                        text: '',
                      },
                    ],
                  },
                },
                children: [],
                width: 14,
                height: 20,
              },
            ],
            width: 14,
            height: 20,
          },
        ],
        width: 42,
        height: 20,
      },
      {
        id: 'PWzAD',
        data: {
          topic: {
            children: [
              {
                text: '观点二',
              },
            ],
          },
        },
        children: [
          {
            id: 'bTRmh',
            data: {
              topic: {
                children: [
                  {
                    text: '',
                  },
                ],
              },
            },
            children: [
              {
                id: 'bnZEJ',
                data: {
                  topic: {
                    children: [
                      {
                        text: '',
                      },
                    ],
                  },
                },
                children: [],
                width: 14,
                height: 20,
              },
            ],
            width: 14,
            height: 20,
          },
        ],
        width: 42,
        height: 20,
      },
      {
        id: 'nJTYp',
        data: {
          topic: {
            children: [
              {
                text: '观点三',
              },
            ],
          },
        },
        children: [
          {
            id: 'GtyaH',
            data: {
              topic: {
                children: [
                  {
                    text: '',
                  },
                ],
              },
            },
            children: [
              {
                id: 'JsPEN',
                data: {
                  topic: {
                    children: [
                      {
                        text: '',
                      },
                    ],
                  },
                },
                children: [],
                width: 14,
                height: 20,
              },
            ],
            width: 14,
            height: 20,
          },
        ],
        width: 42,
        height: 20,
      },
      {
        id: 'aCpyY',
        data: {
          topic: {
            children: [
              {
                text: '观点四',
              },
            ],
          },
        },
        children: [
          {
            id: 'iHynm',
            data: {
              topic: {
                children: [
                  {
                    text: '',
                  },
                ],
              },
            },
            children: [
              {
                id: 'TiZGR',
                data: {
                  topic: {
                    children: [
                      {
                        text: '',
                      },
                    ],
                  },
                },
                children: [],
                width: 14,
                height: 20,
              },
            ],
            width: 14,
            height: 20,
          },
        ],
        width: 42,
        height: 20,
      },
    ],
    width: 72,
    height: 25,
    isRoot: true,
    points: [[403.06494140625, 437.6953125]],
  },
];
