# Live Perspective Lab

研讨会现场角色觉察与萨提尔沟通互动网站。参与者可通过手机选择角色、行为、内在情绪与应对姿态；讲者画面即时呈现匿名统计结果。

## 架构

- 前台与 API：Next.js / vinext
- 现场入口：腾讯云服务器
- 匿名互动资料：Supabase（新加坡区域）
- 原始码：GitHub

浏览器只连接网站自己的 `/api/interaction`，不会直接连接 Supabase，降低中国大陆现场跨境网络对互动流程的影响。

## 本地运行

需要 Node.js 22.13 或更新版本。

```bash
npm install
cp .env.example .env.local
npm run dev
```

环境变量：

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`

## 验证

```bash
npm run build
```

数据库结构保存在 `supabase/migrations/`。互动不收集姓名、邮箱或电话号码。
