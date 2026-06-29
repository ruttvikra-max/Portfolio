import { motion } from "motion/react";
import BlurText from "../components/reactbits/BlurText/BlurText.jsx";
import DotGrid from "../components/reactbits/DotGrid/DotGrid.jsx";
import "./Hero.css";

/**
 * Section 1 — Hero.
 * Editorial / Constructivist: dot-prefix kicker, promise headline,
 * meta strip, product-shot slot. Cream / near-black / single hot red.
 * Copy is real, from docs/drafts/case-study-v1.md §1.
 */

const META = [
  {
    label: "Role",
    value: "Lead Product Designer — discovery through high-fidelity, plus product strategy",
  },
  { label: "Timeline", value: "6 months · in development" },
  { label: "Team", value: "Product Manager · Engineers · Data Scientist · Designer (me)" },
  {
    label: "Ownership",
    value: "Owned the end-to-end experience and shaped what we built, and in what order",
  },
];

export default function Hero() {
  return (
    <header className="hero">
      {/* Background texture — subtle, neutral, red on proximity */}
      <div className="hero__dots" aria-hidden="true">
        <DotGrid
          dotSize={3}
          gap={28}
          baseColor="#E7DcC4"
          activeColor="#DB3A34"
          proximity={120}
          shockRadius={200}
          shockStrength={4}
          className="hero__dotgrid"
        />
      </div>

      <div className="hero__inner">
        <div className="hero__topline">
          <span className="kicker">.RULES ENGINE</span>
          <span className="hero__barcode" aria-hidden="true" />
        </div>

        <h1 className="hero__headline">
          <BlurText
            text="A healthcare ops team used to wait three weeks and a queue of engineers to change a single rule."
            animateBy="words"
            delay={40}
            className="hero__line hero__line--lead"
          />
          <BlurText
            text="We set out to make it three days — and put the work back in their hands."
            animateBy="words"
            delay={40}
            className="hero__line hero__line--turn"
          />
        </h1>

        {/* Product-shot slot — replace with rule builder + assistant screenshot */}
        <motion.figure
          className="hero__shot"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero__shot-placeholder" role="img" aria-label="Product screenshot placeholder">
            <span>HERO IMAGE</span>
            <span className="hero__shot-caption">
              Rule builder with the conversational assistant open
            </span>
          </div>
        </motion.figure>

        <motion.dl
          className="meta-strip"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          {META.map((m) => (
            <div className="meta-strip__item" key={m.label}>
              <dt className="meta-strip__label">{m.label}</dt>
              <dd className="meta-strip__value">{m.value}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </header>
  );
}
