## 

### 1. 打开 Cloudflare Pages
访问：https://dash.cloudflare.com/pages

### 2. 创建项目
- 点击 **"Create a project"**
- 选择 **"Connect to Git"**
- 选择您的 GitHub 仓库

### 3. 配置构建设置
在可视化界面中填写：

```
Framework preset: None
Build command: npm run build:web
Build output directory: dist/apps/web
Root directory: (留空)
```

在 **Environment variables** 部分添加：
```
NODE_VERSION = 20
```

### 4. 点击 "Save and Deploy"
就这么简单！

## 项目已包含的配置文件

- `apps/web/public/_redirects` - SPA 路由支持
- `apps/web/public/_headers` - 基本缓存配置
- `package.json` 中的 `build:web` 脚本

##  部署后检查

1. 访问分配的 `.pages.dev` 域名
2. 确认网站正常运行
3. 测试页面刷新是否正常（SPA 路由）

## 自定义域名（可选）

部署成功后，在 Cloudflare Pages 项目中：
1. 点击 **"Custom domains"**
2. 添加您的域名
3. 按提示配置 DNS

就是这么简单！无需复杂的配置文件。
