import { useEffect, useRef, useState } from "react";
import { View } from "@react-three/drei";
import { routineSteps } from "../../data/content";
import { Stage } from "../../three/Stage";
import { LayerCake } from "../../three/LayerCake";

export function LayerRoutine() {
  const [step, setStep] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            setStep(Number((entry.target as HTMLElement).dataset.index));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="routine" id="routine">
      <header className="section-head reveal">
        <p className="eyebrow">Layer Routine</p>
        <h2>케이크를 쌓듯, 한 겹씩</h2>
        {/* <p>스크롤을 내리면 루틴 단계에 맞춰 케이크가 한 층씩 완성돼요.</p> */}
      </header>
      <div className="routine__inner">
        <div className="routine__sticky">
          <View className="routine__view">
            <Stage
              camera={[0, 2.4, 7.5]}
              target={[0, 0.1, 0]}
              shadowY={-1.05}
              shadowSize={3.4}
            >
              <LayerCake step={step} />
            </Stage>
          </View>
          <ol className="routine__progress" aria-hidden="true">
            {routineSteps.map((s, i) => (
              <li key={s.no} className={i <= step ? "is-done" : ""}>
                {s.layer}
              </li>
            ))}
          </ol>
        </div>
        <div className="routine__steps">
          {routineSteps.map((s, i) => (
            <article
              key={s.no}
              ref={(el) => {
                refs.current[i] = el;
              }}
              data-index={i}
              className={`routine-step${i === step ? " is-active" : ""}`}
            >
              <p className="routine-step__no">
                {s.no} <span>{s.layer}</span>
              </p>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              <p className="routine-step__pick">
                <b>Pick</b> {s.pick}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
