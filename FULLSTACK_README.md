# Drawnix - Full Stack Implementation

## 项目结构

```
drawnix/
├── apps/
│   ├── api/                 # 后端 API (Express + TypeScript + SQLite)
│   └── web/                 # 前端应用 (React + Vite + TypeScript)
├── packages/
│   └── drawnix/             # 核心绘图库
└── ...
```

## 后端 (apps/api)

### 技术栈

- **框架**: Express.js + TypeScript
- **数据库**: SQLite (轻量级，零配置)
- **认证**: JWT (JSON Web Tokens)
- **文件上传**: Multer
- **密码加密**: bcryptjs

### 项目结构

```
apps/api/
├── src/
│   ├── index.ts            # 入口文件
│   ├── routes/             # API 路由
│   │   ├── auth.ts         # 认证相关 (登录/注册)
│   │   ├── users.ts        # 用户管理
│   │   ├── boards.ts       # 黑板 CRUD
│   │   ├── attachments.ts  # 附件上传/管理
│   │   └── admin.ts        # 管理员功能
│   ├── middleware/         # 中间件
│   │   ├── auth.ts         # JWT 认证
│   │   ├── error-handler.ts
│   │   └── logger.ts
│   └── utils/
│       └── database.ts     # SQLite 数据库连接
├── uploads/                # 上传文件存储
│   ├── boards/
│   └── avatars/
└── data/                   # 数据库文件
    └── drawnix.db
```

### API 端点

#### 认证

- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册
- `GET /api/auth/me` - 获取当前用户

#### 黑板

- `GET /api/boards` - 获取所有黑板 (我的 + 社区)
- `GET /api/boards/:id` - 获取单个黑板详情
- `POST /api/boards` - 创建黑板
- `PUT /api/boards/:id` - 更新黑板
- `DELETE /api/boards/:id` - 删除黑板

#### 附件

- `GET /api/attachments/board/:boardId` - 获取黑板附件
- `POST /api/attachments/board/:boardId` - 上传附件
- `PUT /api/attachments/:id/color` - 更新附件背景色
- `DELETE /api/attachments/:id` - 删除附件

#### 管理员

- `GET /api/admin/stats` - 统计数据
- `GET /api/admin/users` - 所有用户
- `GET /api/admin/boards` - 所有黑板
- `DELETE /api/admin/boards/:id` - 删除任意黑板
- `PUT /api/admin/users/:id/role` - 修改用户角色

### 如何运行

```bash
cd apps/api

# 安装依赖
npm install

# 开发模式 (带热重载)
npm run dev

# 生产构建
npm run build
npm start
```

服务器将在 http://localhost:3001 启动

## 前端 (apps/web)

### 技术栈

- **框架**: React 19 + TypeScript
- **构建工具**: Vite
- **UI 组件**: Ant Design
- **样式**: TailwindCSS
- **状态管理**: React Hooks
- **HTTP 客户端**: Fetch API

### 项目结构

```
apps/web/src/
├── api/
│   └── index.ts            # API 客户端和服务
├── app/
│   ├── pages/
│   │   ├── login-page.tsx
│   │   ├── dashboard-page.tsx
│   │   ├── board-page.tsx
│   │   └── admin-page.tsx
│   └── app.tsx
└── ...
```

### 如何运行

```bash
# 从项目根目录
npm run start

# 或从 web 目录
cd apps/web
npm run serve
```

前端将在 http://localhost:4200 启动

## 默认账号

- **管理员**: `123` / `123`
- **普通用户**: `user` / `user`
- **演示账号**: `demo` / `demo`

## 功能清单

### 已实现功能 ✅

#### 后端

- [x] Express + TypeScript 项目结构
- [x] SQLite 数据库 (Users, Boards, Attachments 表)
- [x] JWT 认证系统
- [x] 用户注册/登录
- [x] 黑板 CRUD 操作
- [x] 文件上传/下载 (附件)
- [x] 管理员功能 (统计、用户/黑板管理)
- [x] 错误处理和日志

#### 前端

- [x] API 客户端封装
- [x] Token 管理 (登录态保持)
- [x] 登录页面 (真实 API)
- [x] Dashboard 页面 (真实数据)
  - [x] 显示我的黑板
  - [x] 显示社区黑板
  - [x] 搜索功能
  - [x] 视图切换 (网格/列表)
  - [x] 删除黑板
- [x] 黑板编辑页面
  - [x] 集成 Drawnix 编辑器
  - [x] 真实数据加载/保存
  - [x] 发布功能
  - [x] 附件列表
  - [x] 文件上传
  - [x] 颜色吸取
- [x] 管理员后台
  - [x] 统计面板
  - [x] 用户管理
  - [x] 黑板管理
  - [x] 删除/查看功能

#### 样式优化

- [x] 现代化登录页设计
- [x] Dashboard 卡片动效
- [x] 响应式布局
- [x] 统一配色方案

## 环境变量

### 后端 (.env)

```
NODE_ENV=development
PORT=3001
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:4200
```

### 前端 (.env.local)

```
VITE_API_URL=http://localhost:3001/api
```

## 开发计划

如需继续完善，可以考虑：

1. **WebSocket 实时协作** - 多人同时编辑
2. **版本历史** - 黑板修改记录
3. **分享功能** - 生成只读链接
4. **导出功能** - PDF/图片导出
5. **评论系统** - 黑板内评论
6. **移动端适配** - 更好的移动端体验
