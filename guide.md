# 服务端代码修改指南

为了正确支持 `icon.svg` 等静态文件的访问，我们需要修改 `src/server/server.ts` 文件中的 `serveStatic` 函数。

## 修改步骤

1.  打开文件 `src/server/server.ts`。
2.  找到 `serveStatic` 函数（大约在第 190 行）。
3.  将其中硬编码的 `switch` 语句替换为调用已有的 `getMime` 函数。

### 修改前

```typescript
const serveStatic = (req: IncomingMessage, res: http.ServerResponse, filePath: string) => {
  const ext = path.extname(filePath)
  let contentType = 'text/html'
  switch (ext) {
    case '.js':
      contentType = 'text/javascript'
      break
    case '.css':
      contentType = 'text/css'
      break
    case '.json':
      contentType = 'application/json'
      break
    case '.png':
      contentType = 'image/png'
      break
    case '.jpg':
      contentType = 'image/jpeg'
      break
  }

  fs.readFile(filePath, (err, content) => {
    // ...
```

### 修改后

```typescript
const serveStatic = (req: IncomingMessage, res: http.ServerResponse, filePath: string) => {
  // 直接使用 getMime 函数获取正确的 Content-Type (支持 .svg 等更多格式)
  const contentType = getMime(filePath)

  fs.readFile(filePath, (err, content) => {
    // ...
```

## 后续操作

修改完成后，请执行以下命令重新构建并启动服务器：

```bash
npm run build
npm start
```
