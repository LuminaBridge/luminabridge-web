# LuminaBridge Web

🌉 LuminaBridge 是一个下一代高性能 AI 网关的 Web 多租户管理面板。

## 📋 技术栈

- **框架**: React 18 + TypeScript
- **UI 组件**: Ant Design 5.x
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **状态管理**: Zustand
- **HTTP 客户端**: Axios + React Query
- **路由**: React Router v6
- **图表**: ECharts
- **实时通信**: WebSocket

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

启动后访问：http://localhost:3000

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

### 代码检查

```bash
npm run lint
npm run format
```

## 📁 项目结构

```
luminabridge-web/
├── public/              # 静态资源
├── src/
│   ├── assets/         # 图片、字体等资源
│   ├── components/     # 通用组件
│   │   ├── Loading.tsx
│   │   ├── StatCard.tsx
│   │   ├── ChannelCard.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── RequireAuth.tsx
│   ├── contexts/       # React Context
│   │   └── TenantContext.tsx
│   ├── hooks/          # 自定义 Hooks
│   │   ├── useAuth.ts
│   │   └── useWebSocket.ts
│   ├── layouts/        # 布局组件
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── index.tsx
│   ├── pages/          # 页面组件
│   │   ├── Login/
│   │   ├── Dashboard/
│   │   ├── Channels/
│   │   ├── Tokens/
│   │   ├── Users/
│   │   └── NotFound/
│   ├── services/       # API 服务
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── channels.ts
│   │   ├── tokens.ts
│   │   ├── users.ts
│   │   └── stats.ts
│   ├── stores/         # Zustand 状态管理
│   │   ├── auth.ts
│   │   └── theme.ts
│   ├── types/          # TypeScript 类型定义
│   │   └── index.ts
│   ├── utils/          # 工具函数
│   ├── App.tsx         # 应用根组件
│   ├── main.tsx        # 应用入口
│   └── index.css       # 全局样式
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 🔌 API 配置

### 开发环境代理

Vite 配置已设置代理到后端服务：

- 前端：http://localhost:3000
- 后端 API: http://localhost:8000

代理配置在 `vite.config.ts` 中：

```typescript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
    },
    '/ws': {
      target: 'ws://localhost:8000',
      ws: true,
    },
  },
}
```

### API 服务

所有 API 服务位于 `src/services/` 目录：

- `api.ts` - Axios 实例配置，请求/响应拦截器
- `auth.ts` - 认证相关 API
- `channels.ts` - 渠道管理 API
- `tokens.ts` - 令牌管理 API
- `users.ts` - 用户管理 API
- `stats.ts` - 统计分析 API

## 🎨 主题配置

### 亮色/暗色主题

应用支持亮色和暗色主题切换，使用 Zustand 持久化存储用户偏好。

在任意组件中使用：

```typescript
import { useThemeStore } from '@stores/theme';

const { isDark, toggleTheme } = useThemeStore();
```

### 品牌色

主色调为紫色 (`#8b5cf6`)，可在 `tailwind.config.js` 和 `main.tsx` 中配置。

## 🔐 认证流程

1. 用户在登录页输入邮箱密码
2. 调用 `POST /api/v1/auth/login` 获取 Token
3. Token 存储在 Zustand store 并持久化到 localStorage
4. 后续请求自动在 Header 中添加 `Authorization: Bearer <token>`
5. Token 过期时自动刷新，刷新失败则退出登录

## 📡 WebSocket 实时通信

使用 `useWebSocket` Hook 实现实时数据推送：

```typescript
import { useWebSocket } from '@hooks/useWebSocket';

const { isConnected, sendMessage } = useWebSocket({
  onMessage: (message) => {
    if (message.type === 'stats') {
      // 处理统计数据
    }
  },
  reconnectInterval: 5000,
  maxReconnectAttempts: 5,
});
```

## 🗂️ 多租户支持

应用通过 `TenantContext` 提供租户上下文：

```typescript
import { useTenant } from '@contexts/TenantContext';

const { tenant, loading, refreshTenant } = useTenant();
```

API 请求会自动添加租户 ID 以确保数据隔离。

## 🧩 核心组件

### Layout 布局

- `Header` - 顶部导航栏（主题切换、用户菜单、通知）
- `Sidebar` - 侧边栏菜单
- `Layout` - 主布局容器

### 通用组件

- `StatCard` - 统计卡片（带趋势指示）
- `ChannelCard` - 渠道卡片（带状态和操作）
- `Loading` - 加载组件
- `ErrorBoundary` - 错误边界
- `RequireAuth` - 路由守卫

## 📊 页面功能

### 仪表盘 (Dashboard)

- 统计卡片（总请求数、总 Token、活跃渠道、今日收入）
- 请求量趋势图（7 天）
- 渠道状态监控
- 告警通知列表
- 实时数据更新（WebSocket）

### 渠道管理 (Channels)

- 渠道列表表格
- 搜索/筛选功能
- 新增/编辑/删除渠道
- 测试渠道连接
- 批量操作（启用/禁用/删除）
- 分页支持

### 令牌管理 (Tokens)

- 令牌列表表格
- 创建令牌（显示并复制）
- 删除令牌
- 更新额度
- 额度使用进度条

### 用户管理 (Users)

- 用户列表
- 用户详情（抽屉）
- 角色管理
- 邀请用户

## ⚙️ 开发规范

### TypeScript

- 启用严格模式
- 所有组件和函数必须有类型定义
- 使用路径别名简化导入

### 代码风格

- ESLint + Prettier 自动格式化
- 组件使用函数式写法
- Hooks 优先于 Class 组件

### 命名约定

- 组件：PascalCase (e.g., `StatCard.tsx`)
- 工具函数：camelCase (e.g., `formatNumber.ts`)
- 类型定义：PascalCase (e.g., `Channel.ts`)

## 🔧 环境变量

创建 `.env` 文件（可选）：

```env
VITE_API_BASE_URL=/api/v1
VITE_WS_URL=ws://localhost:8000/api/v1/ws
```

## 📝 注意事项

1. **CORS 配置**: 确保后端服务已配置正确的 CORS 策略
2. **Token 安全**: Token 存储在 localStorage，生产环境建议使用更安全的方式
3. **错误处理**: 所有 API 调用都有错误处理和用户提示
4. **响应式设计**: 支持桌面、平板、移动端

## 🚧 后续优化

- [ ] 单元测试（Vitest + React Testing Library）
- [ ] E2E 测试（Playwright）
- [ ] 国际化（i18next）
- [ ] 性能优化（代码分割、懒加载）
- [ ] PWA 支持

## 📄 许可证

MIT

---

**开发团队**: LuminaBridge Team  
**创建时间**: 2026-03-22
