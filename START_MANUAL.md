# 手动启动步骤

## 1. 打开 PowerShell 或 CMD

按 `Win + R`，输入 `cmd`，回车

## 2. 停止所有 Node 进程

```cmd
taskkill //F //IM node.exe
```

## 3. 启动后端（第 1 个窗口）

```cmd
cd D:\projects\drawnix\apps\api
node dist/index.js
```

如果提示 `Cannot find module`，先执行：

```cmd
cd D:\projects\drawnix\apps\api
npm install
npm run build
node dist/index.js
```

看到以下输出说明成功：

```
✅ Database initialized
🚀 Server running on http://localhost:3001
```

**保持这个窗口开着！**

## 4. 启动前端（第 2 个窗口）

再开一个 CMD/PowerShell 窗口：

```cmd
cd D:\projects\drawnix
npm run start
```

看到以下输出说明成功：

```
VITE ready in xxx ms
➜  Local:   http://localhost:4200/
```

**保持这个窗口开着！**

## 5. 访问应用

打开浏览器：http://localhost:4200

---

## 常见问题

### 端口被占用

如果提示端口被占用，杀掉进程：

```cmd
taskkill //F //IM node.exe
```

### 检查后端是否启动

浏览器访问：http://localhost:3001/health
应该返回：`{"status":"ok"...}`

### 登录测试账号

- 用户名：`123`
- 密码：`123`
