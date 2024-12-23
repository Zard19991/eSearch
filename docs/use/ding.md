# 贴图

选取的区域变成一个窗口放在屏幕上。

鼠标在贴图上通过滚轮滚动可进行缩放。鼠标放在窗口上，顶部弹出工具栏。

可以改变窗口透明度和大小，可以再次编辑、最小化、归位和关闭。

### 归位

归位可以让窗口回到最开始位置和大小，于原来截屏位置贴合以至于无法察觉。

### 悬浮条 鼠标穿透

在屏幕左上角会常驻竖向条形的提示条，点击它，可以展开控制栏，进行贴图窗口最小化还原或关闭。

还可以控制贴图鼠标穿透，使贴图成为一个在屏幕上的图案，无法与鼠标交互，在一些情况下很有用。

---

实际上贴图“窗口”都是模拟出来的，你可以在系统的一些视图发现有一个全屏的窗口覆盖在屏幕上，显示多个贴图窗口，其他地方透明。

> [!NOTE]
>
> macOS 和 Wayland 似乎不支持获取软件外鼠标位置，这导致了贴图无法点击。
> 可以在配置文件中 贴图 强制鼠标穿透 添加快捷键，手动设置贴图是否可点击。这是全屏范围的，如果你想点击其他界面，需要再次使用快捷键

### 裁切放大

通过滚轮可以缩放窗口大小，但有时候我们需要放大来看清贴图，但一起放大的窗口会遮挡住我们的视线，如何只放大图片而不改变窗口大小呢？

按<kbd>Ctrl</kbd>+鼠标滚轮，就可以做到。

### 变换

在设置中添加变换，可通过数字键切换不同的变换效果。

变换使用 CSS，你可以在[mdn transform](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform)或[mdn filter](https://developer.mozilla.org/zh-CN/docs/Web/CSS/filter)了解更多信息。

常见变换（可直接复制到设置）：

| 效果     | css                          |
| -------- | ---------------------------- |
| 水平翻转 | `transform: rotateY(180deg)` |
| 竖直翻转 | `transform: rotateX(180deg)` |
| 灰度     | `filter: grayscale(100%)`    |
| 反色     | `filter: invert(100%)`       |

> [!NOTE]
>
> filter 函数可以传入 svg 滤镜，包括柏林噪音、转置滤镜等你可以在互联网上获取更多资料
