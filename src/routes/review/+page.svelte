<script lang="ts">
  import "../styles/review-form.css";

  import { createEventDispatcher } from "svelte";
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
  const dispatch = createEventDispatcher();

  let overallRating = 0;
  let deliveryRating = 0;
  let wasDeliveryOnTime: boolean | null = null;
  let comment = "";
  let images: File[] = [];
  let imagesPreviews: { url: string; name: string }[] = [];
  let isLoading = false;
  let feedback = { message: "", isError: false };
  let fileInput: HTMLInputElement;

<<<<<<< Updated upstream
  // Constants for file upload validation
=======
>>>>>>> Stashed changes
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_FILES = 5;
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif"];

  function handleImageUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = Array.from(target.files || []);

<<<<<<< Updated upstream
    // Validate number of files
=======
>>>>>>> Stashed changes
    if (files.length + images.length > MAX_FILES) {
      showFeedback(`You can only upload up to ${MAX_FILES} images`, true);
      return;
    }

<<<<<<< Updated upstream
    // Validate each file
    const validFiles = files.filter((file) => {
      // Check file type
=======
    const validFiles = files.filter((file) => {
>>>>>>> Stashed changes
      if (!ALLOWED_TYPES.includes(file.type)) {
        showFeedback(`File "${file.name}" is not a supported image type`, true);
        return false;
      }
<<<<<<< Updated upstream

      // Check file size
=======
>>>>>>> Stashed changes
      if (file.size > MAX_FILE_SIZE) {
        showFeedback(`File "${file.name}" exceeds 5MB size limit`, true);
        return false;
      }
<<<<<<< Updated upstream

      return true;
    });

    // Create preview URLs and add to images array
=======
      return true;
    });

>>>>>>> Stashed changes
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        imagesPreviews = [
          ...imagesPreviews,
          {
            url: (e.target?.result as string) || "",
            name: file.name,
          },
        ];
      };
      reader.readAsDataURL(file);
    });

<<<<<<< Updated upstream
    // Update images array with new valid files
    images = [...images, ...validFiles];

    // Clear the file input to allow uploading the same file again
=======
    images = [...images, ...validFiles];
>>>>>>> Stashed changes
    if (fileInput) fileInput.value = "";
  }

  function removeImage(index: number) {
    images = images.filter((_, i) => i !== index);
    imagesPreviews = imagesPreviews.filter((_, i) => i !== index);
  }

  function validateForm(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (overallRating === 0) {
      errors.push("Overall rating is required");
    }
    if (deliveryRating === 0) {
      errors.push("Delivery rating is required");
    }
    if (wasDeliveryOnTime === null) {
      errors.push("Delivery time status is required");
    }

    if (images.length > MAX_FILES) {
      errors.push(`Maximum ${MAX_FILES} images allowed`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  function showFeedback(message: string, isError = false) {
    feedback = { message, isError };
    dispatch("feedback", { message, isError });
  }

  function resetForm() {
    overallRating = 0;
    deliveryRating = 0;
    wasDeliveryOnTime = null;
    comment = "";
    images = [];
    imagesPreviews = [];
    if (fileInput) fileInput.value = "";
  }

  async function handleSubmit() {
    const validation = validateForm();

    if (!validation.isValid) {
      showFeedback(validation.errors.join(". "), true);
      return;
    }

    isLoading = true;

    try {
      const formData = new FormData();
      formData.append("rating", overallRating.toString());
      formData.append("deliveryRating", deliveryRating.toString());
      formData.append("wasDeliveryOnTime", wasDeliveryOnTime.toString());

      if (comment.trim()) {
        formData.append("comment", comment);
      }

      if (images.length > 0) {
        images.forEach((file, index) => {
          formData.append(`image${index}`, file);
        });
      }

      const response = await fetch("/api/review", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit review");
      }

      const result = await response.json();

      showFeedback(
        "Thank you for your review! Your feedback helps us improve our service.",
      );
      resetForm();
      dispatch("reviewSubmitted", result);
    } catch (error) {
      showFeedback(
        error instanceof Error
          ? error.message
          : "Failed to submit review. Please try again later.",
        true,
      );
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="review-form">
  <h2>Rate Your Delivery Experience</h2>

  {#if feedback.message}
    <div
      class="feedback-alert"
      class:error={feedback.isError}
      class:success={!feedback.isError}
      role="alert">
      {feedback.message}
    </div>
  {/if}

  <div class="form-container">
    <!-- Overall Rating -->
    <div class="rating-group">
      <h3>Overall Rating</h3>
      <div class="star-rating">
        {#each [1, 2, 3, 4, 5] as star}
          <button type="button" on:click={() => (overallRating = star)}>
            <span class:active={star <= overallRating}>★</span>
          </button>
        {/each}
      </div>
    </div>

    <!-- Delivery Rating -->
    <div class="rating-group">
      <h3>Delivery Service</h3>
      <div class="star-rating">
        {#each [1, 2, 3, 4, 5] as star}
          <button type="button" on:click={() => (deliveryRating = star)}>
            <span class:active={star <= deliveryRating}>★</span>
          </button>
        {/each}
      </div>
    </div>

    <!-- Delivery Time -->
    <div class="delivery-time">
      <h3>Was your delivery on time?</h3>
      <div class="button-group">
        <button
          type="button"
          class:active={wasDeliveryOnTime === true}
          on:click={() => (wasDeliveryOnTime = true)}>
          Yes
        </button>
        <button
          type="button"
          class:active={wasDeliveryOnTime === false}
          on:click={() => (wasDeliveryOnTime = false)}>
          No
        </button>
      </div>
    </div>

    <!-- Comments -->
    <div class="comment-section">
      <h3>Additional Comments</h3>
      <textarea
        bind:value={comment}
        placeholder="Enter your comments here..." />
    </div>

    <!-- Image Upload -->
    <div class="image-upload">
      <h3>Add Photos</h3>
      <div class="upload-area">
        <label>
          <svg
            class="upload-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4" />
          </svg>
          <span class="upload-text">Click to upload or drag and drop</span>
          <span class="upload-subtext"
            >PNG, JPG or GIF files (max 5MB each)</span>
          <input
            type="file"
            bind:this={fileInput}
            accept="image/*"
            multiple
            on:change={handleImageUpload} />
        </label>
      </div>

      {#if imagesPreviews.length > 0}
        <div class="image-preview-grid">
          {#each imagesPreviews as preview, index}
            <div class="image-preview">
              <img src={preview.url} alt={preview.name} />
              <button
                type="button"
                class="remove-image"
                on:click={() => removeImage(index)}>
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd" />
                </svg>
              </button>
              <p class="image-name">{preview.name}</p>
            </div>
          {/each}
        </div>
      {/if}

      {#if images.length > 0}
        <p class="image-count">
          {images.length} of {MAX_FILES} images selected
        </p>
      {/if}
    </div>

    <!-- Submit Button -->
    <button
      type="button"
      class="submit-button"
      class:loading={isLoading}
      on:click={handleSubmit}
      disabled={isLoading}>
      {#if isLoading}
        <span class="loading-spinner">
          <svg
            class="spinner-icon"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24">
            <circle
              class="spinner-circle"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4" />
            <path
              class="spinner-path"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Submitting...
        </span>
      {:else}
        Submit Review
      {/if}
    </button>
  </div>
</div>
