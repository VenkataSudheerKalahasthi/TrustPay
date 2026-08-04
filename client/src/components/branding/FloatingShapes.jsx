export function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute top-12 left-10 w-32 h-32 bg-sky-500/5 rounded-full blur-xl animate-bounce" />
      <div className="absolute bottom-20 right-12 w-48 h-48 bg-purple-500/5 rounded-full blur-2xl animate-pulse" />
    </div>
  );
}
