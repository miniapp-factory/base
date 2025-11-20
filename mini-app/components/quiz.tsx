"use client";

import { useState } from "react";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";
import { Button } from "@/components/ui/button";

type Question = {
  question: string;
  options: { label: string; value: string }[];
};

const questions: Question[] = [
  {
    question: "What matters most to you in a blockchain?",
    options: [
      { label: "Low transaction fees", value: "base" },
      { label: "High security", value: "ethereum" },
      { label: "Fast confirmation times", value: "solana" },
      { label: "Decentralized consensus", value: "bitcoin" },
    ],
  },
  {
    question: "Which feature appeals to you the most?",
    options: [
      { label: "Smart contracts", value: "ethereum" },
      { label: "Layer 2 scalability", value: "base" },
      { label: "High throughput", value: "solana" },
      { label: "Store of value", value: "bitcoin" },
    ],
  },
  {
    question: "How do you prefer to interact with the network?",
    options: [
      { label: "Through a web wallet", value: "ethereum" },
      { label: "Using a mobile app", value: "solana" },
      { label: "Via a hardware wallet", value: "bitcoin" },
      { label: "Through a developer SDK", value: "base" },
    ],
  },
  {
    question: "What is your stance on governance?",
    options: [
      { label: "On-chain voting", value: "ethereum" },
      { label: "Off-chain governance", value: "base" },
      { label: "Community-driven", value: "solana" },
      { label: "No governance, pure decentralization", value: "bitcoin" },
    ],
  },
  {
    question: "Which ecosystem do you find most vibrant?",
    options: [
      { label: "DeFi and NFTs", value: "ethereum" },
      { label: "Gaming and metaverse", value: "solana" },
      { label: "Layer 2 projects", value: "base" },
      { label: "Bitcoin-only projects", value: "bitcoin" },
    ],
  },
];

function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function Quiz() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      const counts: Record<string, number> = {};
      newAnswers.forEach((v) => {
        counts[v] = (counts[v] ?? 0) + 1;
      });
      const max = Math.max(...Object.values(counts));
      const winners = Object.entries(counts)
        .filter(([, c]) => c === max)
        .map(([k]) => k);
      setResult(winners[0]); // pick first if tie
    }
  };

  const retake = () => {
    setCurrent(0);
    setAnswers([]);
    setResult(null);
  };

  if (result) {
    const descriptions: Record<string, string> = {
      base: "Base offers low fees and high scalability with a developer-friendly environment.",
      ethereum: "Ethereum is the pioneer of smart contracts and has the largest ecosystem.",
      solana: "Solana delivers ultra‑fast transactions and high throughput for gaming and DeFi.",
      bitcoin: "Bitcoin remains the most secure and decentralized store of value.",
    };
    const images: Record<string, string> = {
      base: "/base.png",
      ethereum: "/ethereum.png",
      solana: "/solana.png",
      bitcoin: "/bitcoin.png",
    };
    return (
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-2xl font-semibold">Your blockchain match: {result}</h2>
        <img src={images[result]} alt={result} width={256} height={256} />
        <p className="text-center max-w-md">{descriptions[result]}</p>
        <Share text={`I matched with ${result}! ${url}`} />
        <Button onClick={retake} variant="default" className="mt-4">
          Retake Quiz
        </Button>
      </div>
    );
  }

  const shuffledOptions = shuffle(questions[current].options);

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-xl font-semibold">{questions[current].question}</h2>
      <div className="flex flex-col gap-2">
        {shuffledOptions.map((opt) => (
          <Button key={opt.value} onClick={() => handleAnswer(opt.value)} variant="outline">
            {opt.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
