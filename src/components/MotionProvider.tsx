"use client";

import React from "react";
import { MotionConfig } from "framer-motion";

// Makes every framer-motion animation respect the user's OS-level
// prefers-reduced-motion setting. CSS animations are handled in globals.css.
const MotionProvider: React.FC<{ children: React.ReactNode }> = ({
	children
}) => <MotionConfig reducedMotion="user">{children}</MotionConfig>;

export default MotionProvider;
