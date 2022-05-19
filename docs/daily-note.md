# 重难点

前端部分：

1. 源组件拖拽

   - 拽入 进预览区渲染
   - 内部 排序
     - 获取 drop 事件 target 元素 所属(DOM 树上最近的)的 RCR 元素的信息(id,下标)
     - RCR 组件的识别
       - 必要信息 渲染进 DOM 元素 ：id、公共类名、等

2. Tool-box 的样式获取逻辑

   - offsetTop\offsetLeft

3. 右侧配置面板的实现

   - 全局配置

     - 主题配置
       - 颜色变量的获取和更新
       - 字体配置的生效和逻辑

- 属性配置

  - feature: 辅助选中的逻辑
    - 属性 Form 的生成和 propsSchema 的描述 ！！！
  - 样式配置

    - 样式配置的 存储

    - 样式配置 生效的逻辑

      - formData->css value 的生成函数

      - 元素唯一 选择器的 生成逻辑

- 三个配置信息的状态维护

后端部分

1. token 身份验证
   - token 意义
   - 验证逻辑
   - koa - 中间件
     - 解析结果 注入 ctx.state
2. 出码能力
3. 中间件 层次 洋葱模型

# 每日记录

## 0325

1. 完成 previewer 和 placeholder 的创建和删除
2. 学习了 JSONSchema，并扩展 用于描述 RC 组件 props
3. 学习到 React.ComponentProps<typeof Button> 可在未导出 组件 Props 的情况下 获取组件 Props

## 0326

1. 复习 事件捕获和冒泡 ，React onClickCapture 属性

`stopPropagation` 可阻止 事件的传播（捕获和冒泡）

## 0327

1. Css 编写 顺序

![image-20220330003749219](https://cdn.jsdelivr.net/gh/Galileo01/imgCloud@master/image-20220330003749219.png)

不一定必须按照上图分类，书写时要适当注意 顺序，易于维护

1. `useImperativeHandle`+`forwardRef` 向父组件 暴露方法
2. [pointer-events](https://developer.mozilla.org/zh-CN/docs/Web/CSS/pointer-events) 解决 z-index 穿透问题

## 0328

1. 左侧 Sider 折叠状态 变化时 需要 重新计算 toolbox 的宽高，利用 MutationObserver，可实现

[MutationObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver/MutationObserver) 可以监听元素的 DOM 变化 ，包括 属性 和子节点

注意事项：

- _options_ `childList`，`attributes` 或者 `characterData` 三个属性之中，至少有一个必须为 `true`，否则会抛出 `TypeError` 异常
- 如果 目标元素 设置了 **transition- 过渡**相关样式， `*callback*` 回调函数 的 执行 可能会存在 **执行过早 DOM 结构没有变化完全的情况**

2. React Fiber

https://juejin.cn/post/6844903975112671239#heading-2

## resource&previewer 实现复杂点总结

1. 拖拽放置-源组件 拖拽到 previewer 放置 渲染

   1. 首先：component-pane 内的 源组件 通过原生 的**drag&drop API**，利用 **dataTranfer** 传递源组件 id
      ps：需注意 dragOver 事件处理函数中 需要 preventDefault()才能 正常的触发 后续的 drop 事件

   2. 然后：利用 RCList-renderer 组件 渲染 组件列表

   渲染时，需要往 DOM 元素 注入 后续查找节点 所需的 id, 以及监听 点击事件

2. 拖拽放置-previewer 已有组件 拖拽放置

   1. 只允许 RCR 级别的组件被拖拽
   2. 首先:在 dragStart 中记录 正在被拖拽的元素/组件
   3. 然后：和 1.1 一致 在 drop 事件回调中 计算拖拽前后的 index，更新列表从而达到 位置的更换

3. previewer 内工具框 渲染
   - 监听 previewer 内部 点击事件（依赖 1.1 渲染时的监听），获取 target.offsetXXX 系列样式，从而绘制工具框
   - 左侧边栏 折叠状态改变，重新获取样式，重新绘制样式
   - 上移、下移、删除 根据节点 id（依赖 1.1 往 DOM 上注入的 id），更新组件列表

## 0329

1. prop-config 组件 的渲染

   关键在于 根据 propSchema 生成对应的 FormItem

   propSchema 定义:(参照[JSONSchema](https://json-schema.apifox.cn/#%E5%AF%B9%E8%B1%A1%EF%BC%88object%EF%BC%89) 进行扩展，用于描述 组件 props 类型)

   <img src="https://cdn.jsdelivr.net/gh/Galileo01/imgCloud@master/image-20220330004450708.png" alt="image-20220330004450708" style="zoom:33%;" />

   组件 prosSchema 示例：

   <img src="https://cdn.jsdelivr.net/gh/Galileo01/imgCloud@master/image-20220330004549980.png" alt="image-20220330004549980" style="zoom:33%;" />

   主要分为：

   1. 普通类型 string/boolean/number

   生成 Input 、Input:number、Switch ,Select 组件即可

   2. 数组类型

   根据 item 每个键的类型生成 对应的 formItem，依赖**Form.List** 组件生成 组件列表

   需要根据 item(**表示数组的每一项类型，这里强制约束数组内每一项 类型一致**)字段，的 type 字段

   - 若为简单类型 ------ 即复用 1.1 的处理逻辑
   - 若 为对象，则需遍历 **properties** ，这一级的 type 通常为 普通类型 ，复用 1.1 的处理逻辑 即可

考虑到组件 props 不会很复杂 ，所以 忽略 对象类型，省去了 递归编写，

## 0331

1. [revert](https://developer.mozilla.org/en-US/docs/Web/CSS/revert)

   这里首先要注意的是`all:revert`，它针对我们应用程序中的每个元素并将所有内容重置为浏览器的默认样式(用户代理)。

   reset 和 initial 的区别：

   关键字[`revert`](https://developer.mozilla.org/en-US/docs/Web/CSS/revert)与 不同且不应混淆 [`initial`](https://developer.mozilla.org/en-US/docs/Web/CSS/initial)，后者使用 CSS 规范基于每个属性定义的[初始值。](https://developer.mozilla.org/en-US/docs/Web/CSS/initial_value)相比之下，用户代理样式表基于 CSS 选择器设置默认值。例如，`display` 属性的初始值为`inline`，而普通的用户代理样式表将 div 的默认值设置为`block` ，将 table 的默认值设置为 table 等。

重置样式时：最好使用 revert，可以使样式重置到 用户代理的值；而使用 unset 在不存在继承值的时候 会重置为 css 初始值

Ps: all:revert 会重置 svg 的 fill 属性，这一点可能会造成较大的影响

2. html-attributes-you-never-use，https://www.smashingmagazine.com/2022/03/html-attributes-you-never-use/
3. link rel=alternate 通过切换样式表 实现 网站换肤，https://www.zhangxinxu.com/wordpress/2019/02/link-rel-alternate-website-skin/

## 0403

1. [URL.createObjectURL()](https://developer.mozilla.org/zh-CN/docs/Web/API/URL/createObjectURL) 给图片上传创建临时 url

   URL.createObjectURL(imgFile) 可以返回一个用于预览的临时 url, 以往情况 一般 使用 FileReader.readAsDataURL()

   - 当不再需要这些 URL 对象时，每个对象必须通过调用 [`URL.revokeObjectURL()`](https://developer.mozilla.org/zh-CN/docs/Web/API/URL/revokeObjectURL) 方法来释放。

     浏览器在 document 卸载的时候，会自动释放它们，但是为了获得最佳性能和内存使用状况，你应该在安全的时机主动释放掉它们

2. JS 获取和设置 CSS 变量

   - 获取

     getComputedStyle(box).getPropertyValue('--color');

   - 设置

     element.style.setProperty('--color', '#cd0000');

## 0408

1. 字体配置 分为 三个部分

   - 平台提供
   - 系统自带
   - 用户上传

2. 配置结构更新，更新为

   页面配置 分为

   - 全局配置-主题+字体
   - 属性配置
   - 样式配置

3. 主题配置 通过 store 存储

4. 保存按钮和清空按钮 点击 功能实现

## 0409

1. 样式编辑方案

   - talwind？
   - 生成 样式表？

   都需要 **根据元素 获取它的 唯一 css 选择器**

   id、className、:nth-of-type 三者结合 构造 唯一的 选择器

   从 请求或者 本地存储 恢复 页面时，必须要沿用 id

2. 封装 generateSelector 方法 获取元素的 唯一选择器

## 0410

1. 编写 元素 边距 表单，封装一下？用到 border？
2. 抽离 一系列 基础组件 用于 样式配置

##0411

1. 字体列表 抽离到 feta-data context+reducer 进行存储，用于 存储网络请求数据

## 0412

1. 根据 当前的 点击元素 生成 唯一 的 selector

   id + class + :nth-of-type(n) ，尤其是 nth 选择器 可以唯一 确定 一个 元素

2. 样式 配置 表格变化时 更改 对应 style node 节点的 innerHTML

3.

## 0414

1. Form 的 onChange 和 onValuesChange
   - onChange 只在页面上 点击/输入 造成表单 变化 时触发
   - onValuesChange 除以上情况外 还会在通过 form.setFieldValue 等函数式 更新的方法设置值时 触发
2. 编写 样式配置 formData 值到 css 样式表的 转换韩式
3. 从 dom 生成 样式配置的表单 初始值 -- 删除 这一特性 ，取而代之的是使用从 store 中存储的配置列表中恢复

## 0415

1. 封装 pageInit hook 完成 editer 和 page 页面 从 localstorage 恢复/网络请求的初步封装

2. 修复 toolbox 获取 currentClickElement offsetxxx 值 存在差值，修复定位问题

   Offsetxxx 获取的是相对于定位父级/body 的距离数值，需要 设置特定父级 的 position 属性

3. 创建 ClickElementInfo 组件展示当前 选中的元素信息

## 0416

1. 完成 editer 页面前端部分基本功能
2. 开始设计首页
3.

## 0418

1. useEditerParams hook 封装 ，处理 编辑页的 searchParams 获取
2.

## 0419

1. React-transition-group 组件引入，为 元素的 创建和小时 添加过渡
2. icon 还有待商榷

## 0420

1. 首页 布局 大致完成

## 0421

1. 创建 user-info store/上下文

2. User 组件实现完成
   - 借助 Popover 组件
   - 依赖 React.FC 的 children 属性 设置插槽 特性

## 0422

1. 使用 MutationObserve api，在 propconfig 的更变引起 dom 变更时重新获取样式信息，更新 toolbox 位置
2. 开始设计 nav_aside 侧边导航组件

nav_aside 利用 a 标签 #锚点的特性，实现点击 进行页面滚动功能

## 0423

1. 实现 nav_aside 侧边导航组件

   nav_aside 利用 a 标签 #锚点的特性，实现点击 进行页面滚动功能

   - 支持 填入元素的 id 进行跳转

   - 支持 开启平滑滚动

2. click-element-info 组件同时 新增展示 + 复制选中元素的 id

3. 追加 observe options 参数，完善 toolbox 更新重新计算样式的时机

   - childList 观察 添加或删除新的子节点
   - subtree 以将监视范围扩展至目标节点整个节点树中的所有节点，子孙结点
   - characterData 观察节点的文本字符数据 的变化

4. 对于 sticky 定位的元素 需要在 previewer 容器滚动的时候重新计算样式

   - 监听目标是 arco-layout-cotent 组件，因为滚动条是该元素产生的 ，只有他才会触发滚动事件

## 0424

1. 对于可能为 sticky 的 targetElement 开始滚动事件的监听
1. 完善 侧边导航
1. PropsSchema 新增
   - help 字段 用于帮助 解释 label
   - emptyHint 字段 用于 表单值为空 时 日式默认值 (placeholder)
1. 开始 设置及 KVImg 组件，剩余 object-fit 属性的设计
1. 预留 nav_dropdown 下拉导航 组件

## 0425

1. KV_Img 组件 done

2. 新增 todo： current-click-info 增加 显示组件列表，支持用户通过该列表选择 RC 组件

   或者 增加辅助选中的 feature ，智能 查找 离当前点击元素 最近的一个父级 RC 组件

3. video 组件

   - 自动生成 封面? 由于 canvas 对于跨域资源无法访问，停止尝试

   - 添加 textList prop 渲染视频的 文本信息 todo

   -

## 0426

Finish:

1. 类型保护函数 - 只能使用 普通函数 来定义
2. video 组件完成
3. swiper 组件设计并完成
4. feature: page 路由在使用 localStorage 预览页面时 主动刷新
5. 修复 Previewer 底部 背景色 露出问题

## 0427

Pre-TODO:

- [x] 更新 swiper 的 previewImg
- [ ] 开始设计 content 组件

TODO:

- [ ] **源组件 resource-components 封装为 npm 库？ **！！！！important

Finish:

1. 取消 对 @types/portal-network 库的抽离，转为 提取到 本地@typings/network 库
2. back_top 组件 开始
3. 修改 toolbox 的 calculateStyle 方法，完全修复 有定位元素计算位置问题

- 一直向上查找 offsetParent 直到 offsetParent 为 PREVIEWER_CONTAINER 并将每一级 的 offsetTop/offsetLeft 相加
- 重命名 computeOffsetInfo
- 对于 包含 position !=static 并且不为 RCR 类型的元素 运用第一点的逻辑运算

4. **feature 辅助选中:用户选中任意 元素，属性配置展示距离其最近的 一个 RC 组件**

- props-config
-

## 0428

Pre-TODO:

- [x] 存储 上次 求解的 closedRCRElement， if preClosedRCRElement.contains(currentClickElement) 不重新计算

TODO

- [ ] Feature-全局配置 添加 整体背景图的设置
- [ ] Feature- 全局配置和属性配置 添加重置的操作
- [x] Bug-修复 resource 面板 点击 上方 icon 折叠 无法记录的问题
- [ ] bug-快照 前进后退 bug

Finish

1. Click-element-info 组件 添加 扩展信息

   - 当前选中
   - 最近的源组件

2. 源组件进度

   - back_top 组件 完成
   - info_horizontal 组件 完成
   - gird_box 组件完成

3. 修复 generateSelector 工具方法：

   - 问题:直接使用 element.className 在元素存在多个类名时 ，内容为空格分隔的类名，直接添加到 选择器 str ，无法正确的选中元素

   - 解决方法:使用 classList 生成有效的 带有.的 类名选择器

## 0429

Pre-TODO

- [x] bug-快照 前进后退 bug

TODO:

- [ ] Feature: 样式设置 根据 选中的元素进行 个性化，图片 - object-fit

Finish

1. 显示快照个数

## 0430

Pre-TODO

TODO

- [ ] feature - 考虑 单位 固定单位还是让用户输入

Finish

1. grid 布局实现瀑布流
2.

## 0501

Finish

1. rc
   - timeline
   - footer
   - footer-info

## 0502

## 0503

## 0504

## 0505

TODO:

1. Feat-全局配置添加 网站 favicon 的配置！！！

2.

3. bug-修复 build 之后 静态资源路径问题 - vite 配置

4. feat-zip 压缩包 定时删除，定时清空 output_code 文件夹

5. todo:feat-Output-code-template 模板 清楚不必要的依赖

6. fix:config 配置 字符串太长 是否需要分割

7. fix:feat-config 存储 和上传 时 ，propsSchema 以及一些其他字段 不进行存储

8. feat-字体存储策略 优化 !!!

   - config 内只存储 选中的 name list，手动进行表单的回填，提高存储效率，恢复的方便性
   - pageConfig.fontConfig 新增字段用于 单独 存储用户自己上传的字体列表

   影响项目：portal + code-output-template

## 0512

TODO:

1. feat-模板信息增加 作者用户名，”私有“改成”我的“
2. todo-出码能力联调

- 对于还没发布的页面，数据库没有配置数据，需要允许用户上传本地配置的数据
- 出码选项弹窗

1. todo-图片静态服务 tos 联调

2. feat-资源复制特性？fetch 数据到本地

3. todo-模板 功能完善！！！

   - editer 模板面板， 检索 选择
   - 拖拽渲染

4. todo-出码能力 还需完善：
5. todo-发布优化

   发布成功后 ，输出该页面的访问地址或者提示用户是否立即打开

6. feat- 错误上报 log4j 日志

 封装专门用于记录客户端错误的路由，error-boundary 出上传

## 0513

9. bug- 修复发布资源时，可能处于用户未登陆状态--工具栏最右侧 添加 User 组件

   发布资源时 验证用户的登陆状态，提示用户登陆---！

   或者未登陆禁止进入编辑器， 禁止 创建、编辑行为

   或者进入编辑器页面后判断登陆信息，未登陆状态下 提示并重定向到首页

10. optimize-添加自动任务，删除出码产生的 文件 zip

11. fix- 样式配置-背景 并不支持渐变，修正按钮和文案中包含“渐变”的部分 UI 和文字

12. fix- back-top 未展示 bug

## 517

梳理 TODO

### Level1:

下一步必须马上完成的联调&关键 bug 修复

- [x] 出码能力联调

  - server

    - 添加 pageConfig 参数，在页面未发布的情况下，由客户端上传页面配置
    - post 方法
    - 自动删除任务

  - client

    - 编写出码面板

      - 增加选项：是否强制使用本地数据：传递 pageConfig

    -

- [x] tos 静态存储

- [ ] 资源面板-模板列表

  - client
    - 渲染出模板列表
      - 检索 选择？
    - 拖拽渲染逻辑
      - 是否要 drop 的时候才拉取模板数据，动态填充

- [ ] 字体存储策略 优化

  - config 内只存储 选中的 name list，手动进行表单的回填，提高存储效率，恢复的方便性
  - pageConfig.fontConfig 新增字段用于 单独 存储用户自己上传的字体列表

  影响项目：portal + code-output-template

- [ ] 资源发布

  - 发布成功后 ，输出该页面的访问地址或者提示用户是否立即打开

  - 发布资源时 验证用户的登陆状态，提示用户登陆---！

    或者未登陆禁止进入编辑器， 禁止 创建、编辑行为？

    或者进入编辑器页面后判断登陆信息，未登陆状态下 提示并重定向到首页？

### Level2

优化和小 bug

### 整体

- [ ] 错误上报 log4j 日志

 封装专门用于记录客户端错误的路由，error-boundary 出上传

#### 首页

- [ ] 模板信息增加 作者用户名，”私有“改成”我的“
- [ ] 资源（页面、模板）复制功能

#### 编辑器全局功能

##### 发布

- [ ] config 配置 字符串太长 是否需要分割
- [ ] feat-config 存储 和上传 时 ，propsSchema 以及一些其他字段 不进行存储
- [ ] dom-to-img 跨域问题

#### 全局配置

- [ ] 添加 网站 favicon 的配置
- [ ]

#### 属性配置

#### 样式配置

- [ ] 分类-背景 移除“渐变” 相关文字即功能

#### 出码能力

- [ ] 修复 build 之后 静态资源路径问题 - vite 配置

- [ ] zip 压缩包 定时删除，定时清空 output_code 文件夹
- [ ] feat-Output-code-template 模板 清楚不必要的依赖

#### 其他

- [ ] back-top 未展示 bug
