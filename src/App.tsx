import { Route, Routes, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { GameCanvas } from "@/components/GameCanvas";

function Home() {
  const navigate = useNavigate();
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-bold tracking-tight">
        {"mario"}
      </h1>
      <p className="text-muted-foreground max-w-prose text-center">
        {"a mario like game in the browser"}
      </p>
      <Button onClick={() => navigate("/game")}>
        Get started
      </Button>
    </main>
  );
}

function Game() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
      <GameCanvas />
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game" element={<Game />} />
    </Routes>
  );
}
