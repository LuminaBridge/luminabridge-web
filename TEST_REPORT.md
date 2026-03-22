# LuminaBridge Web 测试报告

**生成日期**: 2026-03-22  
**测试框架**: Vitest + React Testing Library + Playwright

---

## 测试执行摘要

### 单元测试 (Vitest)

```
✓ src/tests/utils.test.ts (17 tests) 5ms
✓ src/tests/api.test.ts (11 tests) 13ms
✓ src/tests/components/RequireAuth.test.tsx (6 tests) 28ms
✓ src/tests/components/StatCard.test.tsx (12 tests) 841ms
✓ src/tests/components/ChannelCard.test.tsx (14 tests) 1759ms
✓ src/tests/layouts/Header.test.tsx (14 tests) 2265ms
✓ src/tests/pages/Login.test.tsx (16 tests) 3370ms

Test Files:  7 passed (7)
Tests:       90 passed (90)
Duration:    8.01s
```

### 测试覆盖率目标

| 组件 | 测试数 | 覆盖率目标 | 状态 |
|-----|-------|-----------|------|
| ChannelCard | 14 | 80% | ✅ |
| StatCard | 12 | 80% | ✅ |
| RequireAuth | 6 | 90% | ✅ |
| Login | 16 | 75% | ✅ |
| Header | 14 | 70% | ✅ |

---

## E2E 测试 (Playwright)

### 测试文件

1. **auth.spec.ts** - 认证测试 (7 个场景)
   - 登录页面显示
   - 表单验证
   - 错误处理
   - OAuth 登录

2. **channels.spec.ts** - 渠道管理测试 (9 个场景)
   - 渠道列表显示
   - 创建渠道
   - 编辑渠道
   - 删除渠道
   - 测试渠道连接

3. **tokens.spec.ts** - Token 管理测试 (9 个场景)
   - Token 列表显示
   - 创建 Token
   - Token 配额显示
   - Token 撤销

4. **dashboard.spec.ts** - 仪表盘测试 (9 个场景)
   - 统计卡片显示
   - 图表显示
   - 数据刷新

5. **api-relay.spec.ts** - API 中继测试 (5 个场景)
   - Chat Completions API
   - Models API
   - Health Check
   - 认证验证

### 运行 E2E 测试

```bash
# 安装浏览器
npx playwright install

# 运行所有测试
npm run e2e

# 有头模式运行
npm run e2e:headed

# 打开 UI 模式
npm run e2e:ui

# 查看报告
npm run e2e:report
```

---

## 测试最佳实践

### 组件测试

1. **测试用户可见行为**
   ```typescript
   it('renders channel name correctly', () => {
     render(<ChannelCard channel={mockChannel} />);
     expect(screen.getByText('Test Channel')).toBeInTheDocument();
   });
   ```

2. **测试交互**
   ```typescript
   it('calls onEdit when edit button is clicked', () => {
     const onEdit = vi.fn();
     render(<ChannelCard channel={mockChannel} onEdit={onEdit} />);
     fireEvent.click(screen.getByTitle('编辑'));
     expect(onEdit).toHaveBeenCalledWith(mockChannel);
   });
   ```

3. **测试状态变化**
   ```typescript
   it('shows active status correctly', () => {
     render(<ChannelCard channel={mockChannel} />);
     expect(screen.getByText('正常')).toBeInTheDocument();
   });
   ```

### E2E 测试

1. **测试完整用户流程**
   ```typescript
   test('should create a new channel', async ({ page }) => {
     await page.goto('/channels');
     await page.getByText('创建渠道').click();
     await page.getByPlaceholder('渠道名称').fill('Test Channel');
     await page.getByText('确定').click();
     await expect(page.locator('.ant-message-success')).toBeVisible();
   });
   ```

2. **使用 Page Object 模式**
   ```typescript
   class LoginPage {
     constructor(private page: Page) {}
     
     async goto() {
       await this.page.goto('/login');
     }
     
     async login(email: string, password: string) {
       await this.page.getByPlaceholder('邮箱 / Email').fill(email);
       await this.page.getByPlaceholder('密码 / Password').fill(password);
       await this.page.getByText('登 录').click();
     }
   }
   ```

---

## 持续集成

### GitHub Actions 示例

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: luminabridge-web/package-lock.json
      
      - name: Install dependencies
        run: npm ci
        working-directory: luminabridge-web
      
      - name: Run unit tests
        run: npm run test:run
        working-directory: luminabridge-web
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
        working-directory: luminabridge-web
      
      - name: Run E2E tests
        run: npm run e2e
        working-directory: luminabridge-web
      
      - name: Upload test report
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: luminabridge-web/playwright-report/
```

---

## 测试维护

### 添加新测试

1. **组件测试**: 在 `src/tests/components/` 创建 `.test.tsx` 文件
2. **页面测试**: 在 `src/tests/pages/` 创建 `.test.tsx` 文件
3. **E2E 测试**: 在 `e2e/tests/` 创建 `.spec.ts` 文件

### 测试命名规范

- 组件测试：`ComponentName.test.tsx`
- 页面测试：`PageName.test.tsx`
- E2E 测试：`feature.spec.ts`

### 测试数据

使用工厂函数创建测试数据：

```typescript
const createMockChannel = (overrides = {}): Channel => ({
  id: '1',
  name: 'Test Channel',
  status: 'active',
  type: 'openai',
  models: ['gpt-4'],
  ...overrides,
});
```

---

## 故障排除

### 常见问题

1. **测试失败：Cannot find module**
   - 确保 vitest.config.ts 中配置了正确的路径别名

2. **测试失败：TypeError: Cannot read properties of undefined**
   - 检查是否正确 mock 了依赖模块

3. **E2E 测试失败：Timeout exceeded**
   - 增加超时时间或使用 waitFor 等待元素

### 调试技巧

```typescript
// 在测试中添加调试日志
console.log(screen.debug());

// 使用 waitFor 调试
await waitFor(() => {
  console.log('Waiting for element...');
}, { timeout: 5000 });
```

---

**报告维护者**: LuminaBridge Team  
**最后更新**: 2026-03-22
