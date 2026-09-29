"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { isE2EEMessage, decryptChatMessage, encryptChatMessage } from "@/lib/crypto";

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  sender?: {
    id: string;
    email: string;
    profile?: {
      displayName?: string;
      avatarUrl?: string;
      isVerified?: boolean;
      verificationStatus?: string;
    };
  };
  content: string;
  createdAt: string;
  readBy?: string;
  status?: "sending" | "sent" | "delivered" | "read" | "failed";
  isOptimistic?: boolean;
}

/**
 * useChatMessages Hook:
 * Clean frontend abstraction for high-performance split-second messaging:
 * 1. 0ms instant optimistic message dispatch.
 * 2. High-speed delta polling (1000ms active) fetching only new messages (?since=...).
 * 3. Client-side memory decryption caching.
 */
export function useChatMessages(conversationId: string, currentUser: any) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [conversation, setConversation] = useState<any>(null);

  const decryptedCacheRef = useRef<Map<string, string>>(new Map());
  const lastCreatedAtRef = useRef<string | null>(null);

  const decryptFast = useCallback(async (msg: any): Promise<string> => {
    if (decryptedCacheRef.current.has(msg.id)) {
      return decryptedCacheRef.current.get(msg.id)!;
    }
    let plainText = msg.content;
    if (isE2EEMessage(msg.content)) {
      plainText = await decryptChatMessage(msg.content, conversationId);
    }
    decryptedCacheRef.current.set(msg.id, plainText);
    return plainText;
  }, [conversationId]);

  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;

    try {
      const since = lastCreatedAtRef.current;
      const url = since
        ? `/api/chats/${conversationId}/messages?since=${encodeURIComponent(since)}`
        : `/api/chats/${conversationId}/messages`;

      const res = await fetch(url);
      if (res.status === 410) {
        setIsExpired(true);
        return;
      }
      if (res.status === 403) {
        setAccessDenied(true);
        return;
      }

      if (res.ok) {
        const data = await res.json();

        if (data.isDelta) {
          const delta = data.messages || [];
          if (delta.length > 0) {
            const decryptedDelta = await Promise.all(
              delta.map(async (msg: any) => ({
                ...msg,
                content: await decryptFast(msg),
              }))
            );

            setMessages((prev) => {
              const existingIds = new Set(prev.map((m) => m.id));
              const unique = decryptedDelta.filter((m: any) => !existingIds.has(m.id));
              if (unique.length === 0) return prev;
              return [...prev, ...unique];
            });

            const lastMsg = delta[delta.length - 1];
            if (lastMsg?.createdAt) {
              lastCreatedAtRef.current = lastMsg.createdAt;
            }
          }
        } else {
          if (data.conversation) setConversation(data.conversation);
          const raw = data.messages || [];
          const decrypted = await Promise.all(
            raw.map(async (msg: any) => ({
              ...msg,
              content: await decryptFast(msg),
            }))
          );
          setMessages(decrypted);

          if (raw.length > 0) {
            const lastMsg = raw[raw.length - 1];
            if (lastMsg?.createdAt) {
              lastCreatedAtRef.current = lastMsg.createdAt;
            }
          }
        }
      }
    } catch (err) {
      console.error("fetchMessages error:", err);
    } finally {
      setLoading(false);
    }
  }, [conversationId, decryptFast]);

  useEffect(() => {
    if (!conversationId) return;
    fetchMessages();

    // High frequency 1000ms active polling for split-second receipt
    const interval = setInterval(() => {
      if (typeof document !== "undefined" && document.hidden) return;
      fetchMessages();
    }, 1000);

    return () => clearInterval(interval);
  }, [conversationId, fetchMessages]);

  /**
   * Dispatches a message with 0ms instantaneous optimistic feedback
   */
  const sendMessage = async (payload: { text?: string; mediaType?: string; mediaData?: any; replyTo?: any }) => {
    if (sending) return;
    setSending(true);

    const plaintextJson = JSON.stringify(payload);
    const tempId = `optimistic_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

    // ⚡ INSTANT OPTIMISTIC UI: Appears on user's screen in 0 milliseconds!
    const optimisticMessage: ChatMessage = {
      id: tempId,
      conversationId,
      senderId: currentUser?.id,
      sender: {
        id: currentUser?.id,
        email: currentUser?.email,
        profile: {
          displayName: currentUser?.displayName || currentUser?.email?.split("@")[0] || "Me",
          avatarUrl: currentUser?.avatarUrl,
          isVerified: currentUser?.isVerified,
        },
      },
      content: plaintextJson,
      createdAt: new Date().toISOString(),
      readBy: JSON.stringify([currentUser?.id]),
      status: "sending",
      isOptimistic: true,
    };

    decryptedCacheRef.current.set(tempId, plaintextJson);
    setMessages((prev) => [...prev, optimisticMessage]);

    try {
      const encryptedContent = await encryptChatMessage(plaintextJson, conversationId);
      const res = await fetch(`/api/chats/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: encryptedContent }),
      });

      if (res.ok) {
        const data = await res.json();
        const serverMsg: ChatMessage = {
          ...data.message,
          content: plaintextJson,
          status: "sent",
        };
        decryptedCacheRef.current.set(serverMsg.id, plaintextJson);

        if (serverMsg.createdAt) {
          lastCreatedAtRef.current = serverMsg.createdAt;
        }

        setMessages((prev) => prev.map((m) => (m.id === tempId ? serverMsg : m)));
        return { success: true, message: serverMsg };
      } else {
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? { ...m, status: "failed" } : m))
        );
        return { success: false };
      }
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? { ...m, status: "failed" } : m))
      );
      return { success: false, error: err };
    } finally {
      setSending(false);
    }
  };

  return {
    messages,
    conversation,
    loading,
    sending,
    isExpired,
    accessDenied,
    sendMessage,
    setMessages,
    refreshMessages: fetchMessages,
  };
}

export default useChatMessages;
