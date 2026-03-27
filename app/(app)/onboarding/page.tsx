"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  role: "assistant" | "user";
  content: string;
}

const TOTAL_QUESTIONS = 8;

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content:
    "Hello! I'm so glad we can chat. To help me be the best companion I can be, I'd love to learn a little about you. Let's start with something simple — what name would you like me to call you?",
};

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.3s]" />
      <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.15s]" />
      <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" />
    </div>
  );
}

function CheckmarkAnimation() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12 animate-in fade-in zoom-in duration-500">
      <div className="relative w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
          <Check className="w-8 h-8 text-primary-foreground" strokeWidth={3} />
        </div>
      </div>
      <div className="text-center space-y-2">
        <h3 className="font-serif text-2xl text-foreground">
          We&apos;ve saved your memories
        </h3>
        <p className="text-muted-foreground">Thank you for sharing with us.</p>
      </div>
    </div>
  );
}

function HeaderBanner({ currentQuestion }: { currentQuestion: number }) {
  const progress = Math.min((currentQuestion / TOTAL_QUESTIONS) * 100, 100);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-secondary to-background border-b border-border">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <svg
          className="absolute -top-10 -left-10 w-40 h-40 text-primary/5"
          viewBox="0 0 100 100"
          fill="currentColor"
        >
          <circle cx="50" cy="50" r="50" />
        </svg>
        <svg
          className="absolute top-4 right-8 w-24 h-24 text-primary/5"
          viewBox="0 0 100 100"
          fill="currentColor"
        >
          <circle cx="50" cy="50" r="50" />
        </svg>
        <svg
          className="absolute -bottom-6 left-1/4 w-32 h-32 text-accent/20"
          viewBox="0 0 100 100"
          fill="currentColor"
        >
          <circle cx="50" cy="50" r="50" />
        </svg>
      </div>

      <div className="relative px-4 md:px-6 pt-6 pb-5 max-w-2xl mx-auto text-center">
        <h1 className="font-serif text-2xl md:text-3xl text-foreground mb-2 text-balance">
          Let&apos;s get to know you
        </h1>
        <p className="text-muted-foreground text-sm md:text-base text-pretty">
          Share some memories. We&apos;ll remember what matters.
        </p>

        {/* Progress indicator */}
        <div className="mt-5 space-y-2">
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>Question {Math.min(currentQuestion, TOTAL_QUESTIONS)} of {TOTAL_QUESTIONS}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="h-1.5 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isAssistant = message.role === "assistant";

  return (
    <div
      className={`flex ${isAssistant ? "justify-start" : "justify-end"} mb-4`}
    >
      <div
        className={`max-w-[85%] md:max-w-[75%] px-4 py-3 rounded-2xl ${
          isAssistant
            ? "bg-card border border-border rounded-tl-sm text-card-foreground shadow-sm"
            : "bg-primary text-primary-foreground rounded-tr-sm"
        }`}
      >
        <p className="text-base leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
      </div>
    </div>
  );
}

export default function MemoryInterviewScreen() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(1);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: inputValue.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      const conversationHistory = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch("/api/harvest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          conversationHistory,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();

      /* if (data.isComplete) {
        setIsComplete(true);
      } else {
        const assistantMessage: Message = {
          role: "assistant",
          content: data.reply,
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setCurrentQuestion((prev) => Math.min(prev + 1, TOTAL_QUESTIONS));
      } */
        const assistantMessage: Message = {
          role: "assistant",
          content: data.response,
        };
        
        setMessages((prev) => [...prev, assistantMessage]);
        setCurrentQuestion((prev) => Math.min(prev + 1, TOTAL_QUESTIONS));
        
        if (currentQuestion >= TOTAL_QUESTIONS) {
          setIsComplete(true);
        }



    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        role: "assistant",
        content:
          "I'm sorry, I had a little trouble there. Could you try sharing that again?",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-3.5rem)] md:min-h-screen bg-background">
      {/* Header */}
      <HeaderBanner currentQuestion={currentQuestion} />

      {/* Chat area */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6 md:px-6"
      >
        <div className="max-w-2xl mx-auto">
          {isComplete ? (
            <CheckmarkAnimation />
          ) : (
            <>
              {messages.map((message, index) => (
                <MessageBubble key={index} message={message} />
              ))}
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-card border border-border rounded-2xl rounded-tl-sm shadow-sm">
                    <TypingIndicator />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Input area */}
      {!isComplete && (
        <div className="border-t border-border bg-card/80 backdrop-blur-sm px-4 py-4 md:px-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Share your thoughts..."
                disabled={isLoading}
                className="flex-1 px-4 py-3 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-base disabled:opacity-50 transition-all"
              />
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                size="lg"
                className="rounded-xl px-4 h-12"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-center text-xs text-muted-foreground mt-3">
              Press Enter to send
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
