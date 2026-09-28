"use client";

import React from "react";

export interface ParticleTriggerOptions {
  x?: number;
  y?: number;
  emoji?: string;
  type?: string;
}

// Particle canvas explosion animations removed per user preference:
// Instead, chat uses photorealistic 3D floating and popping emojis directly in the UI.
export const triggerChatParticles = (_options?: ParticleTriggerOptions) => {
  // No-op
};

export const ParticleCanvas: React.FC = () => null;

export default ParticleCanvas;
