import { marqueeWords } from '../../data/content';

export function Marquee() {
  const row = [...marqueeWords, ...marqueeWords];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {row.map((word, i) => (
          <span key={i}>
            {word}
            <i />
          </span>
        ))}
      </div>
    </div>
  );
}
