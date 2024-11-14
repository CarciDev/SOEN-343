<script>
  import { PUBLIC_GEOCODING_API_KEY } from "$env/static/public";
  import { loadGooglePlacesLibrary } from "./loader.js";
  import { createEventDispatcher, onMount } from "svelte";

  let apiKey = PUBLIC_GEOCODING_API_KEY ? PUBLIC_GEOCODING_API_KEY : "apikey";
  // @ts-expect-error options is undefined
  export let options = undefined;
  export let placeholder = undefined;
  export let value = "";
  export let required = false;
  export let pattern = undefined;

  const dispatch = createEventDispatcher();

  // @ts-expect-error any type
  let inputField;
  $: selectedLocationName = value || "";

  onMount(() => {
    loadGooglePlacesLibrary(apiKey, () => {
      // ???
      // @ts-expect-error not made for ts
      // eslint-disable-next-line no-undef
      const autocomplete = new google.maps.places.Autocomplete(
        // @ts-expect-error no type info
        inputField,
        options,
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();

        // There are circumstances where the place_changed event fires, but we
        // were NOT given location data. I only want to propagate the event if we
        // truly received location data from Google.
        // See the `Type something, no suggestions, hit Enter` test case.
        if (hasLocationData(place)) {
          setSelectedLocation({
            place: place,
            // @ts-expect-error no type info
            text: inputField.value,
          });
        }
      });

      dispatch("ready");
    });
  });

  function emptyLocationField() {
    // @ts-expect-error no type info on params
    inputField.value = "";
    onChange();
  }

  // @ts-expect-error no type info on params
  function hasLocationData(place) {
    // @ts-expect-error no type info on params
    const fieldsToLookFor = (options &&
      options.fields?.indexOf("ALL") === -1 &&
      options.fields) || ["geometry"];
    // eslint-disable-next-line no-prototype-builtins
    return place.hasOwnProperty(fieldsToLookFor[0]);
  }

  function onChange() {
    // @ts-expect-error no type info
    if (inputField.value === "") {
      setSelectedLocation(null);
    }
  }

  // @ts-expect-error no type info
  function onKeyDown(event) {
    const suggestionsAreVisible =
      document.getElementsByClassName("pac-item").length;

    if (event.key === "Enter" || event.key === "Tab") {
      if (suggestionsAreVisible) {
        const isSuggestionSelected =
          document.getElementsByClassName("pac-item-selected").length;
        if (!isSuggestionSelected) {
          selectFirstSuggestion();
        }
        // @ts-expect-error no type info
      } else if (doesNotMatchSelectedLocation(inputField.value)) {
        setTimeout(emptyLocationField, 10);
      }
    } else if (event.key === "Escape") {
      setTimeout(emptyLocationField, 10);
    }

    if (suggestionsAreVisible) {
      if (event.key === "Enter") {
        /* When suggestions are visible, don't let an 'Enter' submit a form (since
         * the user is interacting with the list of suggestions at the time, not
         * expecting their actions to affect the form as a whole). */
        event.preventDefault();
      }
    }
  }

  function selectFirstSuggestion() {
    // Simulate the 'down arrow' key in order to select the first suggestion:
    // https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events
    const simulatedEvent = new KeyboardEvent("keydown", {
      key: "ArrowDown",
      code: "ArrowDown",
      keyCode: 40,
    });
    // @ts-expect-error no parameter type info
    inputField.dispatchEvent(simulatedEvent);
  }

  // @ts-expect-error no parameter type info
  function setSelectedLocation(data) {
    selectedLocationName = (data && data.text) || "";
    dispatch("place_changed", data);
  }

  // @ts-expect-error no parameter type info
  function doesNotMatchSelectedLocation(value) {
    return selectedLocationName !== value;
  }
</script>

<input
  bind:this={inputField}
  class={$$props.class}
  on:change={onChange}
  on:keydown={onKeyDown}
  {placeholder}
  {value}
  {required}
  {pattern} />
