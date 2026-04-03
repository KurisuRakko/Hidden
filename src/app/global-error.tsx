"use client";

import { useEffect } from "react";
import { StandaloneErrorScreen } from "@/components/errors/standalone-error-screen";

type GlobalErrorPageProps = {
  error: Error & { digest?: string };
};

export default function GlobalErrorPage({ error }: GlobalErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="zh-CN">
      <body style={{ margin: 0 }}>
        <StandaloneErrorScreen
          error={error}
          homeHref="https://hidden.rakko.cn"
          officialHref="https://rakko.cn"
        />
      </body>
    </html>
  );
}
