"use client";
import dynamic from "next/dynamic";
const ClientRouterApp = dynamic(() => import("./ClientRouterApp"), {
  ssr: false,
});

export default function HomePage() {
  return (
    <div>
      <ClientRouterApp />
    </div>
  );
}