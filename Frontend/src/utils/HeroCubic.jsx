import React, { useRef, useState, useEffect } from "react";

const TECH = [
    { label: "React", sub: "UI" },
    { label: "Node.js", sub: "Runtime" },
    { label: "PostgreSQL", sub: "Database" },
    { label: "Express", sub: "API" },
    { label: "JavaScript", sub: "Core" },
    { label: "Git", sub: "VCS" },
    { label: "MongoDB", sub: "Database" },
    { label: "Tailwind CSS", sub: "Styling" },
    { label: "Neon", sub: "Postgres" },
    { label: "Framer Motion", sub: "Animation" },
    { label: "python", sub: "Runtime" },
    { label: "AI Int", sub: "Trending" },
];

// One size table per breakpoint. Every pixel value the 3D scene needs
// (wrap box, scene box, orbit rings, item chips, globe, radius, shadow)
// lives here, so resizing the screen is just picking a different row.
const SIZES = {
    base: { wrap: 280, glow: 140, scene: 240, ring: 180, item: 52, radius: 95, globe: 120, shadow: 130, labelText: 8, subText: 5, centerText: 16, centerSub: 6 },
    sm: { wrap: 340, glow: 170, scene: 300, ring: 220, item: 56, radius: 115, globe: 140, shadow: 150, labelText: 8, subText: 5, centerText: 18, centerSub: 7 },
    md: { wrap: 440, glow: 210, scene: 380, ring: 280, item: 60, radius: 155, globe: 165, shadow: 190, labelText: 9, subText: 6, centerText: 22, centerSub: 7 },
    lg: { wrap: 600, glow: 288, scene: 560, ring: 432, item: 64, radius: 270, globe: 208, shadow: 256, labelText: 9, subText: 6, centerText: 24, centerSub: 8 },
};

// Picks the largest breakpoint key whose min-width media query matches.
function getBreakpoint() {
    if (typeof window === "undefined") return "lg";
    if (window.matchMedia("(min-width: 1024px)").matches) return "lg";
    if (window.matchMedia("(min-width: 768px)").matches) return "md";
    if (window.matchMedia("(min-width: 640px)").matches) return "sm";
    return "base";
}

const HeroCubic = () => {
    const wrapRef = useRef(null);
    const [rotation, setRotation] = useState(0);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [hovering, setHovering] = useState(false);
    const [bp, setBp] = useState(getBreakpoint);

    const dims = SIZES[bp];

    // Re-check breakpoint on resize. matchMedia listeners (not a raw
    // "resize" event) so this only fires when we actually cross a
    // breakpoint boundary, not on every pixel of dragging the window.
    useEffect(() => {
        const queries = [
            window.matchMedia("(min-width: 640px)"),
            window.matchMedia("(min-width: 768px)"),
            window.matchMedia("(min-width: 1024px)"),
        ];
        const update = () => setBp(getBreakpoint());
        queries.forEach((q) => q.addEventListener("change", update));
        update();
        return () => queries.forEach((q) => q.removeEventListener("change", update));
    }, []);

    useEffect(() => {
        let animationFrame;
        let last = performance.now();

        const animate = (now) => {
            const delta = now - last;
            last = now;

            if (!hovering) {
                setRotation((prev) => prev + delta * 0.018);
            }

            animationFrame = requestAnimationFrame(animate);
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [hovering]);

    const handleMouseMove = (e) => {
        if (!wrapRef.current) return;

        const rect = wrapRef.current.getBoundingClientRect();

        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        setTilt({
            x: -y * 20,
            y: x * 25,
        });
    };

    const handleMouseLeave = () => {
        setHovering(false);
        setTilt({ x: 0, y: 0 });
    };

    return (
        <div className="w-full flex justify-center items-center px-4">

            <div
                ref={wrapRef}
                className="relative"
                style={{ width: dims.wrap, height: dims.wrap, perspective: "1200px" }}
                onMouseEnter={() => setHovering(true)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >

                {/* Ambient glow */}
                <div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full dark:bg-slate-400/20 blur-3xl bg-white/10"
                    style={{ width: dims.glow, height: dims.glow }}
                />

                {/* MAIN 3D SCENE */}
                <div
                    className="absolute left-1/2 top-1/2"
                    style={{
                        width: dims.scene,
                        height: dims.scene,
                        transformStyle: "preserve-3d",
                        transform: `translate(-50%, -50%) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                        transition: "transform 0.08s linear",
                    }}
                >

                    {/* INNER ORBIT RING */}
                    <div
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-400/20 dark:border-white/10"
                        style={{
                            width: dims.ring,
                            height: dims.ring,
                            transform: "rotateX(65deg)",
                            transformStyle: "preserve-3d",
                        }}
                    />

                    {/* SECOND ORBIT RING */}
                    <div
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-900/10 dark:border-white/5"
                        style={{
                            width: dims.ring,
                            height: dims.ring,
                            transform: "rotateY(65deg)",
                            transformStyle: "preserve-3d",
                        }}
                    />

                    {/* TECHNOLOGY ORBIT - OUTSIDE THE RINGS */}
                    <div
                        className="absolute left-1/2 top-1/2"
                        style={{
                            width: dims.scene,
                            height: dims.scene,
                            transformStyle: "preserve-3d",
                            transform: `translate(-50%, -50%) rotateY(${rotation}deg)`,
                        }}
                    >
                        {TECH.map((tech, index) => {
                            const angle = (360 / TECH.length) * index;

                            return (
                                <div
                                    key={tech.label}
                                    className="absolute left-1/2 top-1/2"
                                    style={{
                                        width: dims.item,
                                        height: dims.item,
                                        transformStyle: "preserve-3d",
                                        transform: `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${dims.radius}px)`,
                                    }}
                                >
                                    <div
                                        className="flex h-full w-full flex-col items-center justify-center rounded-full border border-slate-300/40 dark:bg-white/60 shadow-xl backdrop-blur-xl dark:border-white/20 bg-white/10"
                                    >
                                        <span
                                            className="text-center font-bold leading-tight text-slate-900 dark:text-white px-1"
                                            style={{ fontSize: dims.labelText, maxWidth: dims.item - 8 }}
                                        >
                                            {tech.label}
                                        </span>

                                        <span
                                            className="mt-1 uppercase tracking-widest text-slate-500 dark:text-white/50"
                                            style={{ fontSize: dims.subText }}
                                        >
                                            {tech.sub}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* STATIC CENTRAL GLOBE */}
                    <div
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full"
                        style={{
                            width: dims.globe,
                            height: dims.globe,
                            background: `
                                radial-gradient(
                                    circle at 32% 28%,
                                    rgba(255,255,255,0.95) 0%,
                                    rgba(148,163,184,0.45) 18%,
                                    rgba(71,85,105,0.55) 45%,
                                    rgba(15,23,42,0.9) 78%,
                                    rgba(2,6,23,1) 100%
                                )
                            `,
                            boxShadow: `
                                inset -30px -30px 45px rgba(0,0,0,0.65),
                                inset 15px 15px 30px rgba(255,255,255,0.35),
                                0 0 35px rgba(148,163,184,0.35),
                                0 0 90px rgba(148,163,184,0.15)
                            `,
                            border: "1px solid rgba(255,255,255,0.3)",
                        }}
                    >

                        {/* Globe longitude */}
                        <div className="absolute left-[18%] top-[-5%] h-[110%] w-[64%] rounded-[50%] border border-white/15" />
                        <div className="absolute left-[28%] top-[-5%] h-[110%] w-[44%] rounded-[50%] border border-white/10" />
                        <div className="absolute left-[38%] top-[-5%] h-[110%] w-[24%] rounded-[50%] border border-white/10" />

                        {/* Globe latitude */}
                        <div className="absolute left-[-5%] top-[20%] h-[60%] w-[110%] rounded-[50%] border border-white/15" />
                        <div className="absolute left-[-5%] top-[35%] h-[30%] w-[110%] rounded-[50%] border border-white/10" />
                        <div className="absolute left-[-5%] top-[50%] h-[25%] w-[110%] rounded-[50%] border border-white/10" />

                        {/* Spherical shading */}
                        <div className="absolute inset-0 rounded-full bg-linear-to-br from-white/20 via-transparent to-black/50" />

                        {/* Highlight */}
                        <div className="absolute left-7 top-6 h-12 w-20 rotate-[-25deg] rounded-full bg-white/40 blur-lg" />

                        {/* Center content */}
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
                            <span
                                className="font-bold tracking-tight text-slate-900 dark:text-white drop-shadow-lg"
                                style={{ fontSize: dims.centerText }}
                            >
                                SAILABS
                            </span>

                            <span
                                className="mt-1 font-mono uppercase text-slate-900 dark:text-white"
                                style={{ fontSize: dims.centerSub }}
                            >
                                your world...
                            </span>
                        </div>

                    </div>

                </div>

                {/* Ground shadow */}
                <div
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 rounded-full bg-black/20 blur-xl"
                    style={{ width: dims.shadow, height: 32 }}
                />

            </div>
        </div>
    );
};

export default HeroCubic;