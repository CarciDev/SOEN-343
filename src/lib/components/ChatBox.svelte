<script lang="ts">
  import { fade } from "svelte/transition";

  // State variables
  let userInput = "";
  let messages: { sender: "user" | "bot"; text: string }[] = [];
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
  class="flex w-full max-w-md flex-col overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800">
  <!-- Header -->
  <div
    class="flex items-center justify-between bg-orange-500 px-4 py-2 dark:bg-orange-600">
    <h2 class="text-lg font-semibold text-white">ChatBot</h2>
  </div>

  <!-- Chat Messages -->
  <div
    bind:this={chatBox}
    class="chat-box max-h-[400px] flex-1 overflow-y-auto bg-gray-50 p-4 dark:bg-gray-700">
    {#each messages as message, index}
      <div
        class="mb-3 flex {message.sender === 'user'
          ? 'justify-end'
          : 'justify-start'}"
        transition:fade={{ duration: 300, delay: index * 50 }}>
        <div
          class={`max-w-xs rounded-lg px-4 py-2 shadow ${
            message.sender === "user"
              ? "bg-orange-500 text-white"
              : message.text.toLowerCase().includes("error")
                ? "bg-red-500 text-white"
                : "bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-100"
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
  <div class="flex items-center bg-gray-100 px-4 py-3 dark:bg-gray-800">
    <input
      type="text"
      bind:value={userInput}
      placeholder="Type your message..."
      class="flex-1 rounded-lg border border-gray-300 px-3 py-2 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
      on:keydown={(e) => e.key === "Enter" && sendMessage()}
      aria-label="Message input" />
    <button
      on:click={sendMessage}
      class="ml-2 rounded-lg bg-orange-500 px-4 py-2 font-semibold text-white transition-colors duration-300 hover:bg-orange-600"
      aria-label="Send message">
      Send
    </button>
  </div>
</div>

<style>
  /* Custom Scrollbar */
  .chat-box {
    scrollbar-width: thin;
    scrollbar-color: #ffa500 #2d2d2d;
  }

  .chat-box::-webkit-scrollbar {
    width: 8px;
  }

  .chat-box::-webkit-scrollbar-track {
    background: var(--tw-bg-opacity, 1) #f9fafb; /* Adjust based on light/dark */
  }

  .chat-box::-webkit-scrollbar-thumb {
    background-color: #ffa500;
    border-radius: 4px;
  }
</style>
