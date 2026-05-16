// GameLoop brand mark. Uses the PNG in /public so we get the polished
// original artwork. Since the PNG itself includes the "GameLoop" wordmark,
// we don't render any text alongside.
export default function Logo({ className = 'h-9 w-auto' }) {
  return (
    <img
      src="/GameLoop.jpg"
      alt="GameLoop"
      className={className}
      draggable={false}
    />
  );
}
