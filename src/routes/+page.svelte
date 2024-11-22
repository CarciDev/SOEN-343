<script lang="ts">
  import { Canvas } from "@threlte/core";
  import { T } from "@threlte/core";
  import { onMount } from "svelte";
  import { tweened } from "svelte/motion";
  import { fade } from "svelte/transition";
  import type { TypedArray } from "three";
  import { get, writable } from "svelte/store";
  import { modeCurrent } from "@skeletonlabs/skeleton";
  import { linear } from "svelte/easing";
  import DownArrowIcon from "$lib/icons/DownArrowIcon.svelte";
  import UpArrowIcon from "$lib/icons/UpArrowIcon.svelte";
  import { browser } from "$app/environment";
  import type { HomePageCardType } from "$lib/components/HomePage3D/HomePageCard.svelte";
  import HomePageCard from "$lib/components/HomePage3D/HomePageCard.svelte";
  import Truck from "$lib/components/HomePage3D/Truck/Truck.svelte";

  function inSphere(array: Float32Array, radius: number) {
    const numPoints = array.length / 3;

    for (let i = 0; i < numPoints; i++) {
      const u = Math.random();
      const v = Math.random();

      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);

      const r = Math.cbrt(Math.random());
      const x = radius * r * Math.sin(phi) * Math.cos(theta);
      const y = radius * r * Math.sin(phi) * Math.sin(theta);
      const z = radius * r * Math.cos(phi);

      array[i * 3] = x;
      array[i * 3 + 1] = y;
      array[i * 3 + 2] = z;
    }

    return array;
  }
  const tweenedXPosition = tweened(0, {
    duration: 500,
    easing: linear,
  });

  const tweenedYPosition = tweened(0, {
    duration: 500,
    easing: linear,
  });

  const tweenedZPosition = tweened(1, {
    duration: 500,
    easing: linear,
  });

  const cameraPosition = writable<[number, number, number]>([
    get(tweenedXPosition),
    get(tweenedYPosition),
    get(tweenedZPosition),
  ]);

  $: currentMode = $modeCurrent;

  $: {
    $tweenedXPosition;
    $tweenedYPosition;
    $tweenedZPosition;
    cameraPosition.set([
      get(tweenedXPosition),
      get(tweenedYPosition),
      get(tweenedZPosition),
    ]);
  }

  let sphere: TypedArray;
  let mouseMove = false;
  let isMobile = false;

  $: sectionVisibility = 0;

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            sectionVisibility = Number(element.dataset.section);
          }
        });
      },
      { threshold: 0.5 },
    );

    document.querySelectorAll(".section-card").forEach((section) => {
      const element = section as HTMLElement;
      observer.observe(element);
    });

    sphere = inSphere(new Float32Array(5000), 1.2);

    function animate() {
      const currentTime = Date.now();
      const elapsedTime = currentTime - previousTime;
      previousTime = currentTime;

      const angularSpeed = 5;
      if (!mouseMove)
        tweenedXPosition.update(
          (value) =>
            value + (((angularSpeed * elapsedTime) / 1000) * Math.PI) / 180,
        );
      requestAnimationFrame(animate);
    }

    let previousTime = Date.now();
    animate();

    window.addEventListener("mousemove", handleMouseMove);

    isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  });

  function handleMouseMove(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const deltaX = x - prevX;
    const deltaY = y - prevY;

    // Update the camera position
    tweenedXPosition.update((prev) => prev + deltaY * -0.00001);
    tweenedYPosition.update((prev) => prev + deltaX * 0.00005);

    prevX = x;
    prevY = y;
  }

  let prevX = 0;
  let prevY = 0;

  $: sectionVisibility;

  const incrementSectionNumber = () => {
    if (sectionVisibility === 3) {
      sectionVisibility = 0;
      tweenCameraPosition("remove");
    } else {
      sectionVisibility = sectionVisibility + 1;
      tweenCameraPosition("add");
    }
  };

  const scrollToSection = () => {
    if (!browser) return;
    incrementSectionNumber();
    const section = document.getElementById(`section${sectionVisibility}`);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  function tweenCameraPosition(operation: string) {
    if (operation === "remove")
      tweenedXPosition.update((prev) => {
        return prev - 2.5;
      });
    else
      tweenedXPosition.update((prev) => {
        return prev + 0.5;
      });
  }

  const homePageCards: HomePageCardType[] = [
    {
      section: 1,
      href: "/track",
      title: "Track Your Package",
      description:
        "Track your package in real-time, and entertain yourself with a selection of minigames!",
      buttonText: "Track",
      image: "/HomePage/Track",
      previewImage: "/track.png",
    },
    {
      section: 2,
      href: "/quotation",
      title: "Obtain a Quotation",
      description:
        "Before using our services, you may get a quotation and have all payment/shipment related details right away. No gimmicks!",
      buttonText: "Get a Quote",
      image: "/HomePage/Quotation",
      previewImage: "/quotation.png",
    },
    {
      section: 3,
      href: "/rates-calculator",
      title: "Start an Order",
      description:
        "You can get started on order preparation if you have your quotation ID ready!",
      buttonText: "Start an Order",
      image: "/HomePage/StartOrder",
      previewImage: "/order.png",
    },
  ];
</script>

<div
  style="z-index: 0;"
  class="{currentMode ? 'sceneLight' : 'sceneDark'} absolute">
  <Canvas>
    <T.PerspectiveCamera position={[0, 0.6, 0]} fov={50} makeDefault>
    </T.PerspectiveCamera>

    <T.AmbientLight color="#ffffff" intensity={0.2} />

    <T.DirectionalLight
      color="#ffffff"
      intensity={2}
      position={[10, 10, 0]}
      shadow.camera.top={8}
      castShadow />

    <T.Group rotation={$cameraPosition}>
      <T.Points>
        <T.BufferGeometry>
          <T.BufferAttribute
            args={[sphere, 3]}
            attach={(parent, self) => {
              parent.setAttribute("position", self);
              return () => {};
            }} />
        </T.BufferGeometry>
        <T.PointsMaterial
          color={currentMode ? "black" : "white"}
          size={currentMode ? 0.004 : 0.002}
          sizeAttenuation={true} />
      </T.Points>
    </T.Group>
  </Canvas>
</div>

<div
  style="z-index: 3;"
  class="section-card relative h-screen"
  id="section0"
  data-section="0">
  <div class="absolute mx-[-15rem]">
    <Truck />
  </div>

  <div
    class="relative flex h-5/6 flex-col items-center justify-center space-y-6">
    <div
      transition:fade={{ delay: 250, duration: 300 }}
      class="text-center text-7xl font-extrabold">
      Welcome to SvelteShip Solutions
    </div>

    <button
      on:click={scrollToSection}
      transition:fade={{ delay: 250, duration: 300 }}
      class="variant-filled-primary btn mx-auto block"
      style="z-index: 3;">
      Begin
    </button>
  </div>

  <div style="z-index: 3;" class="relative mt-10">
    {#each homePageCards as card}
      <HomePageCard {card} {currentMode} />
    {/each}
  </div>
</div>

<div style="z-index: 3;" class="absolute-center bottom-button bottom-0">
  <button
    class="{sectionVisibility === 0
      ? 'hidden'
      : ''} btn z-50 rounded bg-primary-500 px-3 py-2 font-bold"
    on:click={() => {
      scrollToSection();
    }}>
    {#if sectionVisibility === homePageCards.length}
      <UpArrowIcon />
    {:else}
      <DownArrowIcon />
    {/if}
  </button>
</div>

<style>
  .sceneDark {
    position: absolute;
    inset: 0;
    background: radial-gradient(hsl(220 14% 20%), hsl(220 20% 10%));
  }

  .sceneLight {
    position: absolute;
    inset: 0;
    background: radial-gradient(hsl(220 80% 90%), hsl(220 60% 80%));
  }

  .section-card {
    opacity: 1;
    transform: translateY(20px);
    transition:
      opacity 2.5s,
      transform 0.5s;
  }

  .absolute-center {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .bottom-button {
    bottom: 20px;
  }
</style>
