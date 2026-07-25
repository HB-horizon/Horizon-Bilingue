import { View, Text, TouchableOpacity, Platform } from "react-native";
import { useCallback, useRef, useState, useEffect } from "react";

type LetterTraceProps = {
  letter: string;
  latinName: string;
  onComplete?: (score: number) => void;
};

const CANVAS_SIZE = 300;
const GHOST_ALPHA = 0.15;
const STROKE_COLOR = "#FF6B6B";
const STROKE_WIDTH = 6;

function isWeb(): boolean {
  return Platform.OS === "web" && typeof window !== "undefined";
}

export function LetterTrace({ letter, latinName, onComplete }: LetterTraceProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ghostRef = useRef<ImageData | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const isDrawing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const tracedRef = useRef(false);
  const [drawn, setDrawn] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const getCanvas = useCallback(() => {
    if (!isWeb()) return null;
    return canvasRef.current;
  }, []);

  const getCtx = useCallback(() => {
    if (!isWeb()) return null;
    if (ctxRef.current) return ctxRef.current;
    const canvas = getCanvas();
    if (!canvas) return null;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.strokeStyle = STROKE_COLOR;
    ctx.lineWidth = STROKE_WIDTH;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctxRef.current = ctx;
    return ctx;
  }, [getCanvas]);

  const getPos = useCallback((e: any) => {
    const canvas = getCanvas();
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  }, [getCanvas]);

  const drawLine = useCallback((from: { x: number; y: number }, to: { x: number; y: number }) => {
    const ctx = getCtx();
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    tracedRef.current = true;
    setDrawn(true);
  }, [getCtx]);

  const initGhost = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const canvas = getCanvas();
    if (!canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `bold ${canvas.width * 0.55}px "Traditional Arabic", "Arabic Typesetting", "Arial", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = `rgba(255, 255, 255, ${GHOST_ALPHA})`;
    ctx.fillText(letter, canvas.width / 2, canvas.height / 2 + 10);

    ghostRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
  }, [getCtx, getCanvas, letter]);

  const handleStart = useCallback((e: any) => {
    e.preventDefault?.();
    const pos = getPos(e);
    isDrawing.current = true;
    lastPos.current = pos;
  }, [getPos]);

  const handleMove = useCallback((e: any) => {
    e.preventDefault?.();
    if (!isDrawing.current) return;
    const pos = getPos(e);
    drawLine(lastPos.current, pos);
    lastPos.current = pos;
  }, [getPos, drawLine]);

  const handleEnd = useCallback((e: any) => {
    e.preventDefault?.();
    isDrawing.current = false;
  }, []);

  const handleClear = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const canvas = getCanvas();
    if (!canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    initGhost();
    setDrawn(false);
    setScore(null);
    tracedRef.current = false;
  }, [getCtx, getCanvas, initGhost]);

  const handleCheck = useCallback(() => {
    const canvas = getCanvas();
    if (!canvas || !ghostRef.current) return;
    const ctx = getCtx();
    if (!ctx) return;

    const ghost = ghostRef.current;
    const userData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    let ghostPixels = 0;
    let matchPixels = 0;

    for (let i = 0; i < ghost.data.length; i += 4) {
      const isGhost = ghost.data[i + 3] > 30;
      const isUser = userData.data[i + 3] > 30;
      if (isGhost) ghostPixels++;
      if (isGhost && isUser) matchPixels++;
    }

    const raw = ghostPixels > 0 ? (matchPixels / ghostPixels) * 100 : 0;
    const final = Math.round(Math.min(raw * 2.5, 100));
    setScore(final);
    onComplete?.(final);
  }, [getCanvas, getCtx, onComplete]);

  const handleShowHint = useCallback(() => {
    handleClear();

    const canvas = getCanvas();
    if (!canvas) return;
    const ctx = getCtx();
    if (!ctx) return;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2 + 10;
    const r = canvas.width * 0.18;

    const points = [
      { x: cx, y: cy - r, label: "1" },
      { x: cx + r * 0.7, y: cy - r * 0.3, label: "2" },
      { x: cx + r * 0.4, y: cy + r * 0.6, label: "3" },
      { x: cx - r * 0.4, y: cy + r * 0.6, label: "4" },
      { x: cx - r * 0.7, y: cy - r * 0.3, label: "5" },
    ];

    ctx.font = "bold 22px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    points.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 14, 0, Math.PI * 2);
      ctx.fillStyle = "#10B981";
      ctx.fill();
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(p.label, p.x, p.y);
    });
  }, [getCanvas, getCtx, handleClear]);

  useEffect(() => {
    if (!isWeb()) return;
    const canvas = getCanvas();
    if (!canvas) return;
    canvas.width = CANVAS_SIZE * 2;
    canvas.height = CANVAS_SIZE * 2;
    canvas.style.width = `${CANVAS_SIZE}px`;
    canvas.style.height = `${CANVAS_SIZE}px`;
    initGhost();
  }, [getCanvas, initGhost]);

  if (!isWeb()) {
    return (
      <View className="items-center justify-center p-8" style={{ minHeight: 300 }}>
        <Text className="text-6xl mb-4">{letter}</Text>
        <Text className="text-sm text-center" style={{ color: "#94A3B8" }}>
          Le tracé des lettres est disponible uniquement sur navigateur.
        </Text>
      </View>
    );
  }

  return (
    <View className="items-center">
      <Text className="text-lg font-extrabold mb-2" style={{ color: "#F1F5F9" }}>
        Trace la lettre {latinName}
      </Text>

      <View className="relative rounded-3xl overflow-hidden" style={{ backgroundColor: "#0F172A", borderWidth: 2, borderColor: score !== null ? (score >= 60 ? "#10B981" : "#EF4444") : "#334155" }}>
        <canvas
          ref={canvasRef}
          style={{ display: "block", touchAction: "none", cursor: "crosshair" }}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />
      </View>

      {/* Legend */}
      <View className="flex-row items-center gap-2 mt-2 mb-4">
        <View className="w-4 h-4 rounded-sm" style={{ backgroundColor: "rgba(255,255,255,0.15)", borderWidth: 1, borderColor: "#475569" }} />
        <Text className="text-xs" style={{ color: "#94A3B8" }}>: lettre guide</Text>
        <View className="w-4 h-1 rounded-sm ml-2" style={{ backgroundColor: STROKE_COLOR }} />
        <Text className="text-xs" style={{ color: "#94A3B8" }}>: ton tracé</Text>
      </View>

      {/* Score */}
      {score !== null && (
        <View
          className="rounded-2xl p-3 mb-4 w-full"
          style={{
            backgroundColor: score >= 60 ? "#064E3B" : "#7F1D1D",
            borderWidth: 1,
            borderColor: score >= 60 ? "#10B981" : "#EF4444",
          }}
        >
          <Text className="text-center font-bold" style={{ color: score >= 60 ? "#6EE7B7" : "#FCA5A5" }}>
            {score >= 80 ? "🌟 Parfait !" : score >= 60 ? "👍 Bien ! Continue à t'entraîner !" : "🔄 Essaie encore, suis bien le guide !"}
            {" ("}{score}%{")"}
          </Text>
        </View>
      )}

      {/* Controls */}
      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={handleClear}
          className="py-2.5 px-5 rounded-xl"
          style={{ backgroundColor: "#334155" }}
        >
          <Text className="text-sm font-semibold" style={{ color: "#F1F5F9" }}>🗑 Effacer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleShowHint}
          className="py-2.5 px-5 rounded-xl"
          style={{ backgroundColor: "#78350F", borderWidth: 1, borderColor: "#F59E0B" }}
        >
          <Text className="text-sm font-semibold" style={{ color: "#FDE68A" }}>💡 Indice</Text>
        </TouchableOpacity>

        {drawn && (
          <TouchableOpacity
            onPress={handleCheck}
            className="py-2.5 px-5 rounded-xl"
            style={{ backgroundColor: "#10B981" }}
          >
            <Text className="text-sm font-semibold text-white">✓ Vérifier</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
