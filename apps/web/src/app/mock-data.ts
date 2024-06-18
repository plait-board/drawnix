import type { PlaitElement } from '@plait/core';

export const mockData: PlaitElement[] = [
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
          text: '结束'
        }
      ],
      align: 'center'
    },
    points: [
      [-418, 584],
      [-298, 644]
    ],
    strokeWidth: 2
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
          text: '过程'
        }
      ],
      align: 'center'
    },
    points: [
      [-213, 424],
      [-93, 484]
    ],
    strokeWidth: 2
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
          text: '判断'
        }
      ],
      align: 'center'
    },
    points: [
      [-428, 419],
      [-288, 489]
    ],
    strokeWidth: 2
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
          text: '过程'
        }
      ],
      align: 'center'
    },
    points: [
      [-418, 304],
      [-298, 364]
    ],
    strokeWidth: 2
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
          text: '开始'
        }
      ],
      align: 'center'
    },
    points: [
      [-418, 189],
      [-298, 249]
    ],
    strokeWidth: 2
  },
  {
    id: 'mrdfi',
    type: 'line',
    shape: 'elbow',
    source: {
      marker: 'none',
      connection: [0.5, 1],
      boundId: 'aMJWD'
    },
    texts: [],
    target: {
      marker: 'arrow',
      connection: [1, 0.5],
      boundId: 'Sfftf'
    },
    opacity: 1,
    points: [
      [-153, 484],
      [-298, 614]
    ],
    strokeWidth: 2
  },
  {
    id: 'bjjcw',
    type: 'line',
    shape: 'elbow',
    source: {
      marker: 'none',
      connection: [1, 0.5],
      boundId: 'FHSxH'
    },
    texts: [
      {
        text: {
          children: [
            {
              text: '否'
            }
          ]
        },
        position: 0.5,
        width: 14,
        height: 20
      }
    ],
    target: {
      marker: 'arrow',
      connection: [0, 0.5],
      boundId: 'aMJWD'
    },
    opacity: 1,
    points: [
      [-288, 454],
      [-213, 454]
    ],
    strokeWidth: 2
  },
  {
    id: 'mnzKm',
    type: 'line',
    shape: 'elbow',
    source: {
      marker: 'none',
      connection: [0.5, 1],
      boundId: 'FHSxH'
    },
    texts: [
      {
        text: {
          children: [
            {
              text: '是'
            }
          ]
        },
        position: 0.5,
        width: 14,
        height: 20
      }
    ],
    target: {
      marker: 'arrow',
      connection: [0.5, 0],
      boundId: 'Sfftf'
    },
    opacity: 1,
    points: [
      [-358, 489],
      [-358, 584]
    ],
    strokeWidth: 2
  },
  {
    id: 'bJmWK',
    type: 'line',
    shape: 'elbow',
    source: {
      marker: 'none',
      connection: [0.5, 1],
      boundId: 'xnnhM'
    },
    texts: [],
    target: {
      marker: 'arrow',
      connection: [0.5, 0],
      boundId: 'FHSxH'
    },
    opacity: 1,
    points: [
      [-358, 364],
      [-358, 419]
    ],
    strokeWidth: 2
  },
  {
    id: 'zZtTs',
    type: 'line',
    shape: 'elbow',
    source: {
      marker: 'none',
      connection: [0.5, 1],
      boundId: 'FAkXk'
    },
    texts: [],
    target: {
      marker: 'arrow',
      connection: [0.5, 0],
      boundId: 'xnnhM'
    },
    opacity: 1,
    points: [
      [-358, 249],
      [-358, 304]
    ],
    strokeWidth: 2
  },
  {
    type: 'mindmap',
    id: 'rzdDJ',
    rightNodeCount: 3,
    data: {
      topic: {
        children: [
          {
            text: '脑图调研'
          }
        ]
      },
      emojis: [
        {
          name: '🏀'
        },
        {
          name: '🌈'
        }
      ]
    },
    children: [
      {
        id: 'WKQyj',
        data: {
          topic: {
            children: [
              {
                text: '富文本'
              }
            ]
          },
          emojis: [
            {
              name: '🤩'
            },
            {
              name: '🤘'
            }
          ],
          image: {
            url: 'https://atlas-rc.pingcode.com/files/public/5ffa68d453ffebf847cf49b9/origin-url',
            width: 364,
            height: 160
          }
        },
        children: [],
        width: 42,
        height: 20
      },
      {
        id: 'PWzAD',
        data: {
          topic: {
            children: [
              {
                text: '知名脑图产品'
              }
            ]
          }
        },
        children: [
          {
            id: 'CEWYY',
            data: {
              topic: {
                children: [
                  {
                    text: '布局算法'
                  }
                ]
              }
            },
            children: [],
            width: 56,
            height: 20
          },
          {
            id: 'QGfhQ',
            data: {
              topic: {
                children: [
                  {
                    text: 'non-layered-tidy-trees'
                  }
                ]
              }
            },
            children: [
              {
                id: 'AdXeW',
                data: {
                  topic: {
                    children: [
                      {
                        text: '鱼骨图哦'
                      }
                    ]
                  }
                },
                children: [],
                width: 56,
                height: 20
              },
              {
                id: 'bdasn',
                data: {
                  topic: {
                    children: [
                      {
                        text: '缩进布局'
                      }
                    ]
                  }
                },
                children: [],
                width: 56,
                height: 20
              }
            ],
            width: 144.8046875,
            height: 20
          },
          {
            id: 'SJrGb',
            data: {
              topic: {
                children: [
                  {
                    text: '知名脑图产品'
                  }
                ]
              }
            },
            children: [],
            width: 84,
            height: 20
          }
        ],
        width: 84,
        height: 20
      },
      {
        id: 'mGzXi',
        data: {
          topic: {
            children: [
              {
                text: 'xxxxxxx'
              }
            ]
          }
        },
        children: [
          {
            id: 'WFsbH',
            data: {
              topic: {
                children: [
                  {
                    text: '鱼骨图哦'
                  }
                ]
              }
            },
            children: [],
            width: 56,
            height: 20
          },
          {
            id: 'hYPGM',
            data: {
              topic: {
                children: [
                  {
                    text: '缩进布局'
                  }
                ]
              }
            },
            children: [],
            width: 56,
            height: 20
          }
        ],
        width: 48,
        height: 20
      }
    ],
    width: 72,
    height: 25,
    isRoot: true,
    points: [[69.43603515625, 383.30859375]]
  }
];
