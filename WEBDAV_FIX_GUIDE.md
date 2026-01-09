# WebDAV 同步页面修复指南

## 问题描述
WebDAV 同步页面缺少关键的 HTML 元素，导致点击"立即备份"和"同步文件"按钮时出现以下错误：
```
TypeError: Cannot set properties of null (setting 'innerHTML')
```

## 手动修复步骤

### 1. 打开文件
用文本编辑器打开文件：`e:\Antigravity\lxserver\public\index.html`

### 2. 定位到需要修改的位置
找到第 **411 行**，应该看到：
```html
                        </div>
```

然后紧接着第 **412 行**是：
```html
                        <h3>同步日志</h3>
```

### 3. 在第 411 和 412 行之间插入以下代码

**完整插入内容**（复制整段并粘贴到第 411 行和第 412 行之间）：

```html

                        <!-- 同步状态 -->
                        <div class="sync-status-section glass">
                            <h3>同步状态</h3>
                            <div id="sync-status-content">
                                <p style="color: var(--text-secondary);">暂无状态信息</p>
                            </div>
                            <!-- 进度条容器 -->
                            <div id="sync-progress-container" class="hidden" style="margin-top: 1rem;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.875rem;">
                                    <span id="progress-text">正在处理...</span>
                                    <span id="progress-percent">0%</span>
                                </div>
                                <div style="width: 100%; height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden;">
                                    <div id="progress-bar" style="width: 0%; height: 100%; background: var(--accent-primary); transition: width 0.3s ease;"></div>
                                </div>
                            </div>
                        </div>

                        <!-- 同步日志 -->
                        <div class="sync-logs-section glass">
                            <div class="logs-header">
```

### 4. 修改第 412-419 行（原来的同步日志标题和按钮）

**原内容**（第 412-419 行）：
```html
                        <h3>同步日志</h3>
                        <button id="refresh-sync-logs-btn" class="btn-secondary">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="23 4 23 10 17 10" />
                                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                            </svg>
                            <span>刷新</span>
                        </button>
```

**替换为**：
```html
                                <h3>同步日志</h3>
                                <button id="refresh-sync-logs-btn" class="btn-secondary">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <polyline points="23 4 23 10 17 10" />
                                        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                                    </svg>
                                    <span>刷新</span>
                                </button>
                            </div>
```

**注意缩进**：上面的代码比原来多了 4 个空格的缩进，因为它现在在 `<div class="logs-header">` 内部。

### 5. 修改第 420 行

**原内容**：
```html
                    </div>
```

**替换为**：
```html
                        </div>
```

**注意**：从 4 个空格缩进改为 8 个空格缩进。

### 6. 保存文件并重启服务器

保存 `index.html` 后，重启您的服务器：
```bash
# 停止服务器 (Ctrl+C)
# 然后重新启动
npm start
```

### 7. 刷新浏览器

在浏览器中按 `Ctrl+F5` 强制刷新页面，清除缓存。

## 验证修复

1. 导航到"WebDAV同步"页面
2. 点击"立即备份"按钮，不应再出现错误
3. 应该能看到"同步状态"区域和进度条
4. 点击"同步文件"按钮，功能应正常工作

## 如果还有问题

如果按照上述步骤操作后仍有问题，请：
1. 检查浏览器控制台是否有新的错误信息
2. 确认所有缩进和标签闭合正确
3. 对比修改后的文件与原始备份

## 联系支持

如需进一步帮助，请提供：
- 完整的错误信息
- 修改后的 index.html 文件（第 400-430 行）
- 浏览器控制台截图
