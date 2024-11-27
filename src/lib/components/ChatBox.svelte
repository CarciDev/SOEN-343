<script lang="ts">
  import { fade } from "svelte/transition";

  // State variables
  let userInput = "";
  let messages: { sender: "user" | "bot"; text: string }[] = [
    {
      sender: "bot",
      text: "👋 Hello! I'm your friendly chatbot assistant. How can I help you today?",
    },
  ];
  let chatBox: HTMLDivElement;

  // Function to send a message
  async function sendMessage() {
    if (!userInput.trim()) return;

    // Add user message
    messages = [...messages, { sender: "user", text: userInput }];

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botResponse = data.response;

      // Add bot response
      messages = [...messages, { sender: "bot", text: botResponse }];

      // Clear input
      userInput = "";
    } catch (error) {
      console.error("Error:", error);
      messages = [
        ...messages,
        {
          sender: "bot",
          text: "Sorry, there was an error processing your request.",
        },
      ];
    }
  }

  // Scroll to bottom when messages change
  $: if (chatBox) {
    chatBox.scrollTop = chatBox.scrollHeight;
  }
</script>

<div
  class="flex w-full max-w-md flex-col overflow-hidden rounded-lg bg-white shadow-lg dark:bg-surface-800">
  <!-- Header -->
  <div
    class="flex items-center justify-between bg-primary-500 px-4 py-2 dark:bg-primary-500">
    <h2 class="text-lg font-semibold text-white">ChatBot</h2>
  </div>

  <!-- Chat Messages -->
  <div
    bind:this={chatBox}
    class="chat-box max-h-[400px] flex-1 overflow-y-auto bg-surface-50 p-4 dark:bg-surface-700">
    {#each messages as message, index}
      <div
        class="mb-3 flex {message.sender === 'user'
          ? 'justify-end'
          : 'justify-start'}"
        transition:fade={{ duration: 300, delay: index * 50 }}>
        <div
          class={`max-w-xs rounded-lg px-4 py-2 shadow ${
            message.sender === "user"
              ? "text-white dark:bg-primary-500"
              : message.text.toLowerCase().includes("error")
                ? "bg-error-500 text-white"
                : "bg-surface-200 text-gray-800 dark:bg-surface-600 dark:text-gray-100"
          }`}>
          <span class="font-semibold">
            {message.sender === "user" ? "You" : "Bot"}:
          </span>
          <span>{message.text}</span>
        </div>
      </div>
    {/each}
  </div>

  <!-- Input Area -->
  <div class="flex items-center bg-surface-100 px-4 py-3 dark:bg-surface-800">
    <input
      type="text"
      bind:value={userInput}
      placeholder="Type your message..."
      class="flex-1 rounded-lg border border-surface-300 px-3 py-2 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-surface-600 dark:bg-surface-700 dark:text-white"
      on:keydown={(e) => e.key === "Enter" && sendMessage()}
      aria-label="Message input" />
    <button
      on:click={sendMessage}
      class="ml-2 rounded-lg bg-primary-500 px-4 py-2 font-semibold text-white transition-colors duration-300 hover:bg-primary-600"
      aria-label="Send message">
      Send
    </button>
  </div>
</div>

<style>
  /* Custom Scrollbar */
  .chat-box {
    scrollbar-width: thin;
    scrollbar-color: rgba(var(--color-primary-500)) #2d2d2d;
  }

  .chat-box::-webkit-scrollbar {
    width: 8px;
  }

  .chat-box::-webkit-scrollbar-thumb {
    background-color: rgba(var(--color-primary-500));
    border-radius: 4px;
  }
</style>
