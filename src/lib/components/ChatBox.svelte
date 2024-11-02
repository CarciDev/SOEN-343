<script lang="ts">
  import { onMount } from "svelte";

  let userInput = "";
  let messages: { sender: "user" | "bot"; text: string }[] = [];

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

  let chatBox: HTMLDivElement;
</script>

<div class="chat-container">
  <div bind:this={chatBox} class="chat-box">
    {#each messages as message}
      <div class={`message ${message.sender}`}>
        {message.sender === "user" ? "You" : "Bot"}: {message.text}
      </div>
    {/each}
  </div>

  <input
    id="user-input"
    color="black"
    bind:value={userInput}
    placeholder="Type your message..." />
  <button on:click={sendMessage}>Send</button>
</div>
