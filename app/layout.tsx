import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "共感现场｜研讨会即时互动",
  description: "以角色视角开启现场对话的研讨会即时互动工具。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
