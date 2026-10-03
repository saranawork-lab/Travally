"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  RotateCcw,
  Trophy,
  Compass,
  CheckCircle2,
  XCircle,
  Sparkles,
  Flame,
  Volume2,
  VolumeX,
  Undo2,
  Timer,
  MapPin,
  HelpCircle,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Dices,
  Award,
} from "lucide-react";

// Web Audio API Synthesizer (Async decoupled for zero lag)
class GameSoundFX {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private initCtx() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  move() {
    if (!this.enabled) return;
    setTimeout(() => {
      try {
        this.initCtx();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(340, now + 0.05);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
      } catch {}
    }, 0);
  }

  merge() {
    if (!this.enabled) return;
    setTimeout(() => {
      try {
        this.initCtx();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(660, now + 0.06);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.14);
      } catch {}
    }, 0);
  }

  correct() {
    if (!this.enabled) return;
    setTimeout(() => {
      try {
        this.initCtx();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        [523.25, 659.25, 783.99].forEach((freq, i) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + i * 0.05);
          gain.gain.setValueAtTime(0.12, now + i * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.12);
          osc.connect(gain);
          gain.connect(this.ctx!.destination);
          osc.start(now + i * 0.05);
          osc.stop(now + i * 0.05 + 0.12);
        });
      } catch {}
    }, 0);
  }

  wrong() {
    if (!this.enabled) return;
    setTimeout(() => {
      try {
        this.initCtx();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sawtooth";
        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(70, now + 0.18);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.18);
      } catch {}
    }, 0);
  }
}

const soundFX = new GameSoundFX();

// ─────────────────────────────────────────────────────────────
// GAME 1: TRAVEL 2048 DATA & TILES
// ─────────────────────────────────────────────────────────────
interface TravelTier {
  value: number;
  label: string;
  icon: string;
  bgLight: string;
  bgDark: string;
  textLight: string;
  textDark: string;
}

const TRAVEL_TIERS: Record<number, TravelTier> = {
  2: {
    value: 2,
    label: "Backpacker",
    icon: "🎒",
    bgLight: "bg-emerald-100 border-emerald-300",
    bgDark: "dark:bg-emerald-950/60 dark:border-emerald-800",
    textLight: "text-emerald-900",
    textDark: "dark:text-emerald-200",
  },
  4: {
    value: 4,
    label: "Cyclist",
    icon: "🚴",
    bgLight: "bg-teal-100 border-teal-300",
    bgDark: "dark:bg-teal-950/60 dark:border-teal-800",
    textLight: "text-teal-900",
    textDark: "dark:text-teal-200",
  },
  8: {
    value: 8,
    label: "Road Tripper",
    icon: "🛵",
    bgLight: "bg-sky-100 border-sky-300",
    bgDark: "dark:bg-sky-950/60 dark:border-sky-800",
    textLight: "text-sky-900",
    textDark: "dark:text-sky-200",
  },
  16: {
    value: 16,
    label: "Camper",
    icon: "🏕️",
    bgLight: "bg-cyan-100 border-cyan-300",
    bgDark: "dark:bg-cyan-950/60 dark:border-cyan-800",
    textLight: "text-cyan-900",
    textDark: "dark:text-cyan-200",
  },
  32: {
    value: 32,
    label: "Kayaker",
    icon: "🛶",
    bgLight: "bg-indigo-100 border-indigo-300",
    bgDark: "dark:bg-indigo-950/60 dark:border-indigo-800",
    textLight: "text-indigo-900",
    textDark: "dark:text-indigo-200",
  },
  64: {
    value: 64,
    label: "Trekker",
    icon: "🏔️",
    bgLight: "bg-purple-100 border-purple-300",
    bgDark: "dark:bg-purple-950/60 dark:border-purple-800",
    textLight: "text-purple-900",
    textDark: "dark:text-purple-200",
  },
  128: {
    value: 128,
    label: "Aviator",
    icon: "✈️",
    bgLight: "bg-amber-100 border-amber-300 shadow-md",
    bgDark: "dark:bg-amber-950/60 dark:border-amber-700",
    textLight: "text-amber-900",
    textDark: "dark:text-amber-200",
  },
  256: {
    value: 256,
    label: "Voyager",
    icon: "🛳️",
    bgLight: "bg-orange-100 border-orange-300 shadow-md",
    bgDark: "dark:bg-orange-950/60 dark:border-orange-700",
    textLight: "text-orange-900",
    textDark: "dark:text-orange-200",
  },
  512: {
    value: 512,
    label: "Explorer",
    icon: "🏰",
    bgLight: "bg-rose-100 border-rose-300 shadow-lg",
    bgDark: "dark:bg-rose-950/70 dark:border-rose-700",
    textLight: "text-rose-900",
    textDark: "dark:text-rose-200",
  },
  1024: {
    value: 1024,
    label: "Globetrotter",
    icon: "🌟",
    bgLight: "bg-gradient-to-br from-amber-200 to-yellow-300 border-amber-400 shadow-lg",
    bgDark: "dark:bg-gradient-to-br dark:from-amber-900/80 dark:to-yellow-800/80 dark:border-amber-500",
    textLight: "text-amber-950",
    textDark: "dark:text-yellow-100",
  },
  2048: {
    value: 2048,
    label: "Travally Legend",
    icon: "👑",
    bgLight: "bg-gradient-to-br from-emerald-300 via-teal-300 to-amber-300 border-emerald-400 shadow-xl animate-pulse",
    bgDark: "dark:bg-gradient-to-br dark:from-emerald-700 dark:via-teal-800 dark:to-amber-800 dark:border-emerald-400",
    textLight: "text-slate-950",
    textDark: "dark:text-white",
  },
};

type Grid = number[][];

const createEmptyGrid = (): Grid => [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const addRandomTile = (grid: Grid): Grid => {
  const emptyCoords: [number, number][] = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (grid[r][c] === 0) emptyCoords.push([r, c]);
    }
  }
  if (emptyCoords.length === 0) return grid;

  const [randR, randC] = emptyCoords[Math.floor(Math.random() * emptyCoords.length)];
  const newGrid = grid.map((row) => [...row]);

  // Easy / Relaxed Mode Spawns:
  // 50% 4 (Cyclist 🚴), 35% 8 (Road Tripper 🛵), 10% 2 (Backpacker 🎒), 5% 16 (Camper 🏕️)
  const rand = Math.random();
  let val = 4;
  if (rand < 0.10) val = 2;
  else if (rand < 0.60) val = 4;
  else if (rand < 0.95) val = 8;
  else val = 16;

  newGrid[randR][randC] = val;
  return newGrid;
};

// ─────────────────────────────────────────────────────────────
// GAME 2: INDIA GEOPIN GUESSER DATA
// ─────────────────────────────────────────────────────────────
interface GeoDestination {
  id: string;
  name: string;
  state: string;
  clues: [string, string, string];
  tag: string;
  funFact: string;
  options: string[];
  correctOption: string;
}

const GEO_DESTINATIONS: GeoDestination[] = [
  {
    id: "pangong",
    name: "Pangong Tso",
    state: "Ladakh",
    clues: [
      "Endorheic lake perched at 4,225m altitude",
      "Famous for dramatically shifting blue-green-cyan colors",
      "Freezes completely into solid ice despite being saline",
    ],
    tag: "Highland Lake",
    funFact: "The lake spans over 134 km, stretching from Ladakh across into western Tibet!",
    options: ["Dal Lake", "Pangong Tso", "Tso Moriri", "Chandra Taal"],
    correctOption: "Pangong Tso",
  },
  {
    id: "hampi",
    name: "Hampi",
    state: "Karnataka",
    clues: [
      "Medieval capital of the glorious Vijayanagara Empire",
      "Famous for the iconic monolithic Stone Chariot",
      "Bizarre boulder-strewn landscapes along Tungabhadra River",
    ],
    tag: "UNESCO Ruins",
    funFact: "Hampi traded diamonds, pearls, and rubies in open street markets in the 15th century!",
    options: ["Badami", "Hampi", "Pattadakal", "Aihole"],
    correctOption: "Hampi",
  },
  {
    id: "kaziranga",
    name: "Kaziranga",
    state: "Assam",
    clues: [
      "Dense tall elephant grass meadows in the Brahmaputra valley",
      "Home to world's largest population of great one-horned rhinos",
      "Boasts one of the highest densities of Bengal tigers",
    ],
    tag: "Wildlife Safari",
    funFact: "Over two-thirds of the world's surviving one-horned rhinos live in Kaziranga!",
    options: ["Manas", "Kaziranga", "Jim Corbett", "Sundarbans"],
    correctOption: "Kaziranga",
  },
  {
    id: "rameswaram",
    name: "Rameswaram",
    state: "Tamil Nadu",
    clues: [
      "Island holy pilgrimage city connected by the historic Pamban Bridge",
      "Starting point of Ram Setu (Adam's Bridge) to Sri Lanka",
      "Features the longest temple corridor in the world (1,212 pillars)",
    ],
    tag: "Sacred Island",
    funFact: "The sea waters at Agni Theertham remain unusually calm like a placid lake year-round!",
    options: ["Kanyakumari", "Rameswaram", "Madurai", "Dhanushkodi"],
    correctOption: "Rameswaram",
  },
  {
    id: "spiti",
    name: "Spiti Valley",
    state: "Himachal Pradesh",
    clues: [
      "Cold desert valley nicknamed 'The Middle Land' between India and Tibet",
      "Home to the 1000-year-old cliffside Key Monastery",
      "World's highest post office at Hikkim (4,400m)",
    ],
    tag: "Cold Desert",
    funFact: "You can write a real postcard and mail it from the world's highest post office in Hikkim!",
    options: ["Zanskar Valley", "Spiti Valley", "Nubra Valley", "Parvati Valley"],
    correctOption: "Spiti Valley",
  },
  {
    id: "varanasi",
    name: "Varanasi (Kashi)",
    state: "Uttar Pradesh",
    clues: [
      "One of the oldest continuously inhabited cities on Earth",
      "Evening Ganga Aarti with giant flaming brass lamps",
      "Over 84 stone ghats lining the sacred river",
    ],
    tag: "Spiritual Capital",
    funFact: "American author Mark Twain wrote: 'Varanasi is older than history, older than tradition!'",
    options: ["Haridwar", "Rishikesh", "Varanasi (Kashi)", "Prayagraj"],
    correctOption: "Varanasi (Kashi)",
  },
  {
    id: "munnar",
    name: "Munnar",
    state: "Kerala",
    clues: [
      "Endless emerald-green carpeted tea plantations in Western Ghats",
      "Home to the rare blooming Neelakurinji flower (blooms once every 12 years)",
      "Shelters endangered mountain goats (Nilgiri Tahr)",
    ],
    tag: "Misty Tea Hills",
    funFact: "Munnar means 'Three Rivers', named after the confluence of Mudhirapuzha, Nallathanni, and Kundaly!",
    options: ["Wayanad", "Munnar", "Ooty", "Coorg"],
    correctOption: "Munnar",
  },
  {
    id: "kutch",
    name: "Rann of Kutch",
    state: "Gujarat",
    clues: [
      "Massive seasonal white salt desert marshland",
      "Celebrated for the vibrant Rann Utsav cultural tent city",
      "Glows like a moonscape under the full winter moon",
    ],
    tag: "White Desert",
    funFact: "During the monsoon, the salt desert is submerged under Arabian Sea water and transforms into an ocean bay!",
    options: ["Thar Desert", "Rann of Kutch", "Spiti Salt Flat", "Sambhar Salt Lake"],
    correctOption: "Rann of Kutch",
  },
  {
    id: "cherrapunji",
    name: "Cherrapunji (Sohra)",
    state: "Meghalaya",
    clues: [
      "Plunging Nohkalikai Falls, the tallest plunge waterfall in India",
      "Famous Double Decker Living Root Bridges",
      "One of the wettest spots on the entire planet",
    ],
    tag: "Abode of Clouds",
    funFact: "The living root bridges are grown by training the roots of Ficus elastica trees across rushing rivers!",
    options: ["Shillong", "Cherrapunji (Sohra)", "Dawki", "Mawlynnong"],
    correctOption: "Cherrapunji (Sohra)",
  },
  {
    id: "jaisalmer",
    name: "Jaisalmer",
    state: "Rajasthan",
    clues: [
      "Nicknamed 'The Golden City' due to yellow sandstone architecture",
      "Features Sonar Qila, a living UNESCO fort with shops and homes inside",
      "Surrounded by the rolling Sam Sand Dunes of Thar Desert",
    ],
    tag: "Desert Citadel",
    funFact: "About one-fourth of Jaisalmer's population still resides permanently inside the 800-year-old fort!",
    options: ["Jodhpur", "Jaisalmer", "Bikaner", "Pushkar"],
    correctOption: "Jaisalmer",
  },
  {
    id: "alleppey",
    name: "Alappuzha (Alleppey)",
    state: "Kerala",
    clues: [
      "Labyrinth of tranquil palm-fringed backwater canals",
      "Cruises aboard traditional thatched kettuvallam houseboats",
      "Host of the legendary annual Nehru Trophy Snake Boat Race",
    ],
    tag: "Venice of the East",
    funFact: "A traditional snake boat (Chundan Vallam) carries over 100 oarsmen rowing in rhythmic fury!",
    options: ["Kumarakom", "Alappuzha (Alleppey)", "Kochi", "Kovalam"],
    correctOption: "Alappuzha (Alleppey)",
  },
  {
    id: "gokarna",
    name: "Gokarna",
    state: "Karnataka",
    clues: [
      "Serene coastal town famous for Om Beach, naturally shaped like 'ॐ'",
      "Cliffside trails connecting Kudle, Half Moon, and Paradise beaches",
      "Ancient home to the sacred Mahabaleshwar Atmalinga temple",
    ],
    tag: "Soulful Coast",
    funFact: "The coastline here is considered one of the most scenic beach treks anywhere along the Arabian Sea!",
    options: ["Udupi", "Karwar", "Gokarna", "Murudeshwar"],
    correctOption: "Gokarna",
  },
];

export function TravelMiniGame() {
  const [activeTab, setActiveTab] = useState<"2048" | "geoguesser">("2048");
  const [soundEnabled, setSoundEnabled] = useState(true);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFX.enabled = next;
  };

  // ─────────────────────────────────────────────────────────────
  // GAME 1 LOGIC: TRAVEL 2048 (EASY / RELAXED MODE)
  // ─────────────────────────────────────────────────────────────
  const [grid, setGrid] = useState<Grid>(createEmptyGrid());
  const [undoStack, setUndoStack] = useState<{ grid: Grid; score: number }[]>([]);
  const [score2048, setScore2048] = useState(0);
  const [highScore2048, setHighScore2048] = useState(0);
  const [boostsLeft, setBoostsLeft] = useState(3);
  const [milestoneToast, setMilestoneToast] = useState<string | null>(null);
  const [gameOver2048, setGameOver2048] = useState(false);
  const [won2048, setWon2048] = useState(false);
  const [maxTileReached, setMaxTileReached] = useState(8);

  // Load high score
  useEffect(() => {
    try {
      const saved = localStorage.getItem("travally_2048_highscore");
      if (saved) setHighScore2048(parseInt(saved, 10) || 0);
    } catch {}
  }, []);

  // Initialize 2048 board with 2 friendly tiles (Easy starting position)
  const init2048 = useCallback(() => {
    let newGrid = createEmptyGrid();
    newGrid = addRandomTile(newGrid);
    newGrid = addRandomTile(newGrid);
    setGrid(newGrid);
    setUndoStack([]);
    setScore2048(0);
    setBoostsLeft(3);
    setGameOver2048(false);
    setWon2048(false);

    // Compute initial max tile
    let initialMax = 4;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (newGrid[r][c] > initialMax) initialMax = newGrid[r][c];
      }
    }
    setMaxTileReached(initialMax);
  }, []);

  useEffect(() => {
    init2048();
  }, [init2048]);

  // Core 2048 slide & merge engine
  const slideAndMergeRow = (row: number[]): { newRow: number[]; gained: number; merged: boolean } => {
    const nonZero = row.filter((v) => v !== 0);
    const newRow: number[] = [];
    let gained = 0;
    let merged = false;

    for (let i = 0; i < nonZero.length; i++) {
      if (i + 1 < nonZero.length && nonZero[i] === nonZero[i + 1]) {
        const val = nonZero[i] * 2;
        newRow.push(val);
        gained += val;
        merged = true;
        i++;
      } else {
        newRow.push(nonZero[i]);
      }
    }
    while (newRow.length < 4) newRow.push(0);
    return { newRow, gained, merged };
  };

  const moveGrid = useCallback(
    (direction: "UP" | "DOWN" | "LEFT" | "RIGHT") => {
      if (gameOver2048) return;

      let changed = false;
      let totalGained = 0;
      let anyMerged = false;
      const originalGrid = grid.map((r) => [...r]);
      const nextGrid = createEmptyGrid();

      if (direction === "LEFT") {
        for (let r = 0; r < 4; r++) {
          const { newRow, gained, merged } = slideAndMergeRow(grid[r]);
          nextGrid[r] = newRow;
          totalGained += gained;
          if (merged) anyMerged = true;
          for (let c = 0; c < 4; c++) {
            if (nextGrid[r][c] !== grid[r][c]) changed = true;
          }
        }
      } else if (direction === "RIGHT") {
        for (let r = 0; r < 4; r++) {
          const reversed = [...grid[r]].reverse();
          const { newRow, gained, merged } = slideAndMergeRow(reversed);
          nextGrid[r] = newRow.reverse();
          totalGained += gained;
          if (merged) anyMerged = true;
          for (let c = 0; c < 4; c++) {
            if (nextGrid[r][c] !== grid[r][c]) changed = true;
          }
        }
      } else if (direction === "UP") {
        for (let c = 0; c < 4; c++) {
          const col = [grid[0][c], grid[1][c], grid[2][c], grid[3][c]];
          const { newRow, gained, merged } = slideAndMergeRow(col);
          totalGained += gained;
          if (merged) anyMerged = true;
          for (let r = 0; r < 4; r++) {
            nextGrid[r][c] = newRow[r];
            if (nextGrid[r][c] !== grid[r][c]) changed = true;
          }
        }
      } else if (direction === "DOWN") {
        for (let c = 0; c < 4; c++) {
          const col = [grid[3][c], grid[2][c], grid[1][c], grid[0][c]];
          const { newRow, gained, merged } = slideAndMergeRow(col);
          totalGained += gained;
          if (merged) anyMerged = true;
          for (let r = 0; r < 4; r++) {
            nextGrid[3 - r][c] = newRow[r];
            if (nextGrid[3 - r][c] !== grid[3 - r][c]) changed = true;
          }
        }
      }

      if (changed) {
        if (anyMerged) soundFX.merge();
        else soundFX.move();

        // Push state to multi-step undo stack (last 20 moves)
        setUndoStack((prev) => [...prev.slice(-20), { grid: originalGrid, score: score2048 }]);

        const gridWithNew = addRandomTile(nextGrid);
        setGrid(gridWithNew);

        const newScore = score2048 + totalGained;
        setScore2048(newScore);

        if (newScore > highScore2048) {
          setHighScore2048(newScore);
          try {
            localStorage.setItem("travally_2048_highscore", newScore.toString());
          } catch {}
        }

        // Check highest tile and milestone celebrations
        let highest = maxTileReached;
        for (let r = 0; r < 4; r++) {
          for (let c = 0; c < 4; c++) {
            const val = gridWithNew[r][c];
            if (val > highest) {
              highest = val;
              if ([128, 256, 512, 1024, 2048].includes(val)) {
                setMilestoneToast(`🎉 Unlocked ${TRAVEL_TIERS[val]?.icon} ${TRAVEL_TIERS[val]?.label}!`);
                setTimeout(() => setMilestoneToast(null), 2500);
              }
            }
            if (val >= 2048 && !won2048) setWon2048(true);
          }
        }
        setMaxTileReached(highest);

        // Check if game over
        let hasMove = false;
        for (let r = 0; r < 4; r++) {
          for (let c = 0; c < 4; c++) {
            if (gridWithNew[r][c] === 0) hasMove = true;
            if (r + 1 < 4 && gridWithNew[r][c] === gridWithNew[r + 1][c]) hasMove = true;
            if (c + 1 < 4 && gridWithNew[r][c] === gridWithNew[r][c + 1]) hasMove = true;
          }
        }
        if (!hasMove) {
          setGameOver2048(true);
          soundFX.wrong();
        }
      }
    },
    [grid, score2048, highScore2048, gameOver2048, maxTileReached, won2048]
  );

  // Multi-step Undo
  const undoMove = () => {
    if (undoStack.length === 0) return;
    const last = undoStack[undoStack.length - 1];
    setGrid(last.grid);
    setScore2048(last.score);
    setUndoStack((prev) => prev.slice(0, -1));
    setGameOver2048(false);
    soundFX.move();
  };

  // Compass Boost: Automatically merges the lowest tiles to free space!
  const useCompassBoost = () => {
    if (boostsLeft <= 0) return;

    // Save current state to undo
    setUndoStack((prev) => [...prev.slice(-20), { grid: grid.map((r) => [...r]), score: score2048 }]);

    const nonZeros: { r: number; c: number; val: number }[] = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (grid[r][c] > 0) nonZeros.push({ r, c, val: grid[r][c] });
      }
    }

    if (nonZeros.length === 0) return;
    nonZeros.sort((a, b) => a.val - b.val);

    const newGrid = grid.map((row) => [...row]);
    let gained = 0;
    let mergedPair = false;

    // First attempt: merge two lowest identical tiles
    for (let i = 0; i < nonZeros.length - 1; i++) {
      if (nonZeros[i].val === nonZeros[i + 1].val) {
        const doubled = nonZeros[i].val * 2;
        newGrid[nonZeros[i].r][nonZeros[i].c] = doubled;
        newGrid[nonZeros[i + 1].r][nonZeros[i + 1].c] = 0;
        gained = doubled;
        mergedPair = true;
        break;
      }
    }

    // Second attempt: if all tiles are unique, double the lowest tile to match something
    if (!mergedPair) {
      const lowest = nonZeros[0];
      const doubled = lowest.val * 2;
      newGrid[lowest.r][lowest.c] = doubled;
      gained = doubled;
    }

    soundFX.correct();
    setGrid(newGrid);
    setScore2048((prev) => prev + gained);
    setBoostsLeft((prev) => Math.max(0, prev - 1));
    setGameOver2048(false);

    // Update max tile
    let maxV = maxTileReached;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (newGrid[r][c] > maxV) maxV = newGrid[r][c];
      }
    }
    setMaxTileReached(maxV);
    setMilestoneToast("🧭 Compass Boost merged tiles & cleared space!");
    setTimeout(() => setMilestoneToast(null), 2500);
  };

  // Keyboard navigation for 2048
  useEffect(() => {
    if (activeTab !== "2048") return;

    const handleKey = (e: KeyboardEvent) => {
      if (["ArrowUp", "KeyW"].includes(e.code)) {
        e.preventDefault();
        moveGrid("UP");
      } else if (["ArrowDown", "KeyS"].includes(e.code)) {
        e.preventDefault();
        moveGrid("DOWN");
      } else if (["ArrowLeft", "KeyA"].includes(e.code)) {
        e.preventDefault();
        moveGrid("LEFT");
      } else if (["ArrowRight", "KeyD"].includes(e.code)) {
        e.preventDefault();
        moveGrid("RIGHT");
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [moveGrid, activeTab]);

  // Touch Swipe navigation for 2048
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (Math.max(absX, absY) > 25) {
      if (absX > absY) {
        if (deltaX > 0) moveGrid("RIGHT");
        else moveGrid("LEFT");
      } else {
        if (deltaY > 0) moveGrid("DOWN");
        else moveGrid("UP");
      }
    }
    touchStartRef.current = null;
  };

  // ─────────────────────────────────────────────────────────────
  // GAME 2 LOGIC: INDIA GEOPIN GUESSER
  // ─────────────────────────────────────────────────────────────
  const [geoIndex, setGeoIndex] = useState(0);
  const [geoScore, setGeoScore] = useState(0);
  const [geoStreak, setGeoStreak] = useState(0);
  const [selectedGeo, setSelectedGeo] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [showGeoFact, setShowGeoFact] = useState(false);
  const [geoFinished, setGeoFinished] = useState(false);
  const [geoResults, setGeoResults] = useState<boolean[]>([]);

  const currentGeo = GEO_DESTINATIONS[geoIndex];

  // 15-second timer per question
  useEffect(() => {
    if (activeTab !== "geoguesser" || showGeoFact || geoFinished) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleGeoTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTab, geoIndex, showGeoFact, geoFinished]);

  const handleGeoTimeout = () => {
    setSelectedGeo("TIME_OUT");
    setShowGeoFact(true);
    setGeoStreak(0);
    setGeoResults((prev) => [...prev, false]);
    soundFX.wrong();
  };

  const handleSelectGeoOption = (option: string) => {
    if (selectedGeo !== null) return;
    setSelectedGeo(option);
    setShowGeoFact(true);

    const isCorrect = option === currentGeo.correctOption;
    setGeoResults((prev) => [...prev, isCorrect]);

    if (isCorrect) {
      soundFX.correct();
      // Bonus points for speed: +10 pts per remaining second
      const points = 100 + timeLeft * 10 + geoStreak * 30;
      setGeoScore((prev) => prev + points);
      setGeoStreak((prev) => prev + 1);
    } else {
      soundFX.wrong();
      setGeoStreak(0);
    }
  };

  const handleNextGeo = () => {
    setSelectedGeo(null);
    setShowGeoFact(false);
    setTimeLeft(15);

    if (geoIndex + 1 < GEO_DESTINATIONS.length) {
      setGeoIndex((prev) => prev + 1);
    } else {
      setGeoFinished(true);
    }
  };

  const restartGeo = () => {
    setGeoIndex(0);
    setGeoScore(0);
    setGeoStreak(0);
    setSelectedGeo(null);
    setTimeLeft(15);
    setShowGeoFact(false);
    setGeoFinished(false);
    setGeoResults([]);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between select-none touch-manipulation">
      {/* ── Top Game Mode Switcher ── */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80 gap-1 sm:gap-2 shrink-0">
        <div className="flex items-center gap-0.5 sm:gap-1.5 bg-slate-100 dark:bg-slate-900/90 p-0.5 sm:p-1 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab("2048")}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === "2048"
                ? "bg-emerald-500 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Dices className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            <span>Travel 2048</span>
          </button>
          <button
            onClick={() => setActiveTab("geoguesser")}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === "geoguesser"
                ? "bg-emerald-500 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Compass className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            <span>
              <span className="inline sm:hidden">GeoGuesser</span>
              <span className="hidden sm:inline">India GeoGuesser</span>
            </span>
          </button>
        </div>

        {/* Global Sound & Score Bar */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {activeTab === "2048" ? (
            <div className="flex items-center gap-1 px-1.5 sm:px-2.5 py-1 rounded-lg sm:rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 text-amber-700 dark:text-amber-400 text-[10px] sm:text-xs font-black whitespace-nowrap shrink-0">
              <Trophy className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span>{highScore2048}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 px-1.5 sm:px-2.5 py-1 rounded-lg sm:rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 text-[10px] sm:text-xs font-black whitespace-nowrap shrink-0">
              <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span>{geoScore} pts</span>
            </div>
          )}

          <button
            onClick={toggleSound}
            className="p-1 sm:p-1.5 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-emerald-500 transition cursor-pointer shrink-0"
            title={soundEnabled ? "Mute Sound" : "Enable Sound"}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />}
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TAB 1: TRAVEL 2048 GAME
          ───────────────────────────────────────────────────────────── */}
      {activeTab === "2048" && (
        <div className="flex-1 my-1 sm:my-2 flex flex-col justify-between overflow-hidden">
          {/* Clean & Minimal 2048 Bar */}
          <div className="flex items-center justify-between pb-1.5 px-0.5 text-xs shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Score: <strong className="text-slate-900 dark:text-white font-black text-sm">{score2048}</strong>
              </span>

              {undoStack.length > 0 && (
                <button
                  onClick={undoMove}
                  className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1 cursor-pointer transition active:scale-95 whitespace-nowrap"
                  title="Undo previous move"
                >
                  <Undo2 className="w-3 h-3 shrink-0" />
                  <span>Undo</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {boostsLeft > 0 && (
                <button
                  onClick={useCompassBoost}
                  className="px-2.5 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs cursor-pointer transition active:scale-95 whitespace-nowrap"
                  title="Merge smallest badges to free space"
                >
                  <Compass className="w-3.5 h-3.5 shrink-0" />
                  <span>Boost ({boostsLeft})</span>
                </button>
              )}

              <button
                onClick={init2048}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer shrink-0"
                title="Restart game"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 4x4 Grid Board with Touch Swipe */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative w-full aspect-square max-h-[340px] sm:max-h-[370px] mx-auto p-2 rounded-2xl bg-slate-200/80 dark:bg-slate-950/90 border border-slate-300/80 dark:border-slate-800 shadow-inner grid grid-cols-4 gap-1.5 sm:gap-2 touch-none select-none"
          >
            {grid.map((row, r) =>
              row.map((cell, c) => {
                const tier = TRAVEL_TIERS[cell];
                return (
                  <div
                    key={`${r}-${c}`}
                    className={`rounded-xl sm:rounded-2xl flex flex-col items-center justify-center p-0.5 sm:p-1 text-center border transition-all duration-150 ${
                      cell === 0
                        ? "bg-slate-100/60 dark:bg-slate-900/60 border-transparent"
                        : `${tier.bgLight} ${tier.bgDark} ${tier.textLight} ${tier.textDark} transform scale-100 animate-in zoom-in-75 duration-100`
                    }`}
                  >
                    {cell > 0 && (
                      <>
                        <span className="text-lg sm:text-2xl leading-none drop-shadow-xs">{tier.icon}</span>
                        <span className="text-[9px] sm:text-[11px] font-black truncate max-w-full mt-0.5">
                          {tier.value}
                        </span>
                        <span className="text-[8px] sm:text-[9px] font-bold opacity-80 truncate max-w-full hidden sm:block">
                          {tier.label}
                        </span>
                      </>
                    )}
                  </div>
                );
              })
            )}

            {/* Milestone Toast */}
            {milestoneToast && (
              <div className="absolute top-2 inset-x-2 p-2 rounded-xl bg-slate-950/90 text-white border border-emerald-500/50 text-xs font-black flex items-center justify-center gap-1.5 shadow-xl z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{milestoneToast}</span>
              </div>
            )}

            {/* Game Over / Rescue Overlay */}
            {gameOver2048 && (
              <div className="absolute inset-0 bg-black/85 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center text-center p-4 text-white z-20 space-y-2.5 animate-in fade-in duration-200">
                <span className="text-2xl">🏕️</span>
                <h4 className="text-lg font-black">Board Full! Need a Boost?</h4>
                <p className="text-xs text-slate-300 max-w-xs">
                  Reached: <strong className="text-emerald-400">{TRAVEL_TIERS[maxTileReached]?.label}</strong> ({maxTileReached})
                </p>

                <div className="flex flex-col gap-1.5 w-full max-w-[200px] pt-1">
                  {boostsLeft > 0 && (
                    <button
                      onClick={useCompassBoost}
                      className="w-full px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>Compass Rescue ({boostsLeft} left)</span>
                    </button>
                  )}

                  {undoStack.length > 0 && (
                    <button
                      onClick={undoMove}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Undo2 className="w-3.5 h-3.5" />
                      <span>Undo Last Move</span>
                    </button>
                  )}

                  <button
                    onClick={init2048}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
                  >
                    Start Fresh
                  </button>
                </div>
              </div>
            )}

            {/* Victory Badge Overlay */}
            {won2048 && !gameOver2048 && (
              <div className="absolute top-2 inset-x-2 p-1.5 rounded-xl bg-emerald-500/90 text-slate-950 text-xs font-black flex items-center justify-between shadow-lg z-10 animate-bounce">
                <span>👑 YOU REACHED 2048 TRAVEL LEGEND!</span>
                <button onClick={() => setWon2048(false)} className="px-2 py-0.5 rounded-lg bg-black text-white text-[10px]">
                  Keep Going
                </button>
              </div>
            )}
          </div>

          {/* On-screen Directional Touch Controls for Instant Mobile Comfort */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-slate-400 font-medium">Swipe grid or tap arrows</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => moveGrid("LEFT")}
                className="p-1.5 sm:p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-emerald-500 hover:text-white border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 transition cursor-pointer active:scale-95"
                title="Slide Left"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => moveGrid("UP")}
                  className="p-1.5 sm:p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-emerald-500 hover:text-white border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 transition cursor-pointer active:scale-95"
                  title="Slide Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => moveGrid("DOWN")}
                  className="p-1.5 sm:p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-emerald-500 hover:text-white border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 transition cursor-pointer active:scale-95"
                  title="Slide Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>
              <button
                onClick={() => moveGrid("RIGHT")}
                className="p-1.5 sm:p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-emerald-500 hover:text-white border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 transition cursor-pointer active:scale-95"
                title="Slide Right"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 2: INDIA GEOPIN GUESSER
          ───────────────────────────────────────────────────────────── */}
      {activeTab === "geoguesser" && (
        <div className="flex-1 my-1 sm:my-2 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-3 sm:p-4 flex flex-col justify-between overflow-y-auto">
          {!geoFinished ? (
            <div className="space-y-3 my-auto">
              {/* Top Progress & Timer Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-extrabold">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>Destination {geoIndex + 1} of {GEO_DESTINATIONS.length}</span>
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Timer Pill */}
                    <div
                      className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-black ${
                        timeLeft <= 5
                          ? "bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 animate-pulse"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <Timer className="w-3.5 h-3.5" />
                      <span>{timeLeft}s</span>
                    </div>

                    {geoStreak > 1 && (
                      <span className="px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 text-[10px] font-black flex items-center gap-0.5">
                        <Flame className="w-3 h-3 fill-current" />
                        <span>{geoStreak}x</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-300"
                    style={{ width: `${((geoIndex + 1) / GEO_DESTINATIONS.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Clues Card */}
              <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider">
                    {currentGeo.tag}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">
                    State: <strong className="text-slate-700 dark:text-slate-200">{currentGeo.state}</strong>
                  </span>
                </div>

                <div className="space-y-1.5 pt-0.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    Three Clues:
                  </span>
                  {currentGeo.clues.map((clue, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-semibold leading-snug">
                      <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{clue}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4 Destination Options */}
              <div className="grid grid-cols-2 gap-2 pt-0.5">
                {currentGeo.options.map((opt) => {
                  const isSelected = selectedGeo === opt;
                  const isCorrect = opt === currentGeo.correctOption;

                  let styleClass =
                    "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-slate-800 dark:text-slate-200";

                  if (selectedGeo !== null) {
                    if (isCorrect) {
                      styleClass =
                        "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-black shadow-xs ring-2 ring-emerald-500/20";
                    } else if (isSelected) {
                      styleClass =
                        "bg-rose-50 dark:bg-rose-950/80 border-rose-500 text-rose-800 dark:text-rose-200 font-bold";
                    } else {
                      styleClass = "opacity-40 border-slate-200 dark:border-slate-800";
                    }
                  }

                  return (
                    <button
                      key={opt}
                      disabled={selectedGeo !== null}
                      onClick={() => handleSelectGeoOption(opt)}
                      className={`p-2.5 sm:p-3 rounded-xl border text-center text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${styleClass}`}
                    >
                      <span className="truncate">{opt}</span>
                      {selectedGeo !== null && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      )}
                      {selectedGeo !== null && isSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Fun Fact Reveal & Next Button */}
              {showGeoFact && (
                <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 animate-in fade-in slide-in-from-bottom-2 duration-200 space-y-1.5">
                  <div className="flex items-start gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                      {currentGeo.funFact}
                    </p>
                  </div>
                  <div className="flex justify-end pt-0.5">
                    <button
                      onClick={handleNextGeo}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition shadow-sm cursor-pointer flex items-center gap-1"
                    >
                      <span>{geoIndex + 1 < GEO_DESTINATIONS.length ? "Next Clue →" : "See Final Score"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // GeoGuesser Expedition Completed Screen
            <div className="flex flex-col items-center justify-center text-center p-4 sm:p-6 space-y-3 sm:space-y-4 my-auto animate-in fade-in zoom-in-95 duration-200">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-amber-100 dark:bg-amber-950/80 text-amber-500 flex items-center justify-center shadow-xl">
                <Trophy className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-400">
                  GeoGuesser Completed!
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {geoScore} Points
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  Accuracy:{" "}
                  <strong className="text-emerald-500">
                    {geoResults.filter(Boolean).length} / {GEO_DESTINATIONS.length} Correct
                  </strong>
                  . You have great instincts for India&apos;s wonders!
                </p>
              </div>

              <button
                onClick={restartGeo}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition shadow-md flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Play GeoGuesser Again</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Footer ── */}
      <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 font-medium shrink-0 gap-2">
        <span className="flex items-center gap-1 whitespace-nowrap shrink-0">
          <HelpCircle className="w-3 h-3 text-emerald-500 shrink-0" />
          <span>Travally Arcade</span>
        </span>
        <span className="truncate text-right">Early Access Lounge</span>
      </div>
    </div>
  );
}
