import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Workplace Chatbot — WorkFlow AI" },
      { name: "description", content: "Chat with your AI workplace productivity assistant." },
    ],
  }),
  component: () => <Outlet />,
});