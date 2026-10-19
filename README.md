# LightningTeX Desktop

这是 [LightningTeX 原项目](https://github.com/CodeBoy2006/LightningTeX) 的 Tauri 桌面外壳。前端编辑器、LuaHBTeX WebAssembly 引擎和浏览器版本仍然由原项目提供；本仓库主要负责把它包装成 Windows 桌面应用，并尽量不修改 `src` 前端子模块。

## 原项目文档

完整的功能介绍、浏览器使用方式、引擎说明、测试和部署文档请参阅：

- [原项目 README（英文）](src/README.md)
- [原项目 README（简体中文）](src/README.zh-CN.md)
- [原项目 GitHub 仓库](https://github.com/CodeBoy2006/LightningTeX)

## 开发环境

需要安装：

- Node.js 22 或更高版本
- pnpm
- Rust 和 `rustup`
- Windows WebView2
- Visual Studio C++ Build Tools（Windows）

安装依赖：

```powershell
pnpm install
pnpm --dir src install
```

## 启动桌面开发模式

```powershell
pnpm run tauri:dev
```

根目录脚本会启动 `src` 中的前端服务，然后由 Tauri 打开桌面窗口。

## 构建应用

### 生成带安装包的正式版本

```powershell
pnpm run tauri:build
```

产物位于：

```text
src-tauri/target/release/app.exe
src-tauri/target/release/bundle/msi/
src-tauri/target/release/bundle/nsis/
```

## 项目结构

```text
.
├─ src/                 # 原 LightningTeX 前端子模块
├─ src-tauri/           # Tauri 配置、Rust 启动代码和窗口适配
├─ scripts/              # 桌面构建辅助脚本
├─ package.json         # 根目录转发和 Tauri 构建命令
└─ LICENSE              # 本项目许可证
```

构建前端时，Vite 默认将入口生成到 `src/dist/ui/index.html`。Tauri 需要在 `frontendDist` 根目录直接找到 `index.html`，因此根目录构建流程会运行 `scripts/prepare-tauri-dist.mjs`，准备 `src/dist/index.html` 并修正资源路径。

## 自定义标题栏

桌面窗口默认关闭系统装饰，并通过 [window-controls.js](src-tauri/window-controls.js) 在原项目页面加载后注入最小化、最大化、关闭和拖动区域。该适配逻辑位于 `src-tauri`，不会修改原前端子模块。

## 许可证

本项目使用 [GNU Affero General Public License v3.0 or later](LICENSE)。原项目及其引擎、字体和 TeX Live 资源可能分别适用各自许可证，详情请查看：

- [原项目许可证](src/LICENSE)
- [原项目第三方声明](src/THIRD-PARTY-NOTICES.md)

用户使用 LightningTeX 创建的文档和源文件不因此自动适用本项目许可证。
