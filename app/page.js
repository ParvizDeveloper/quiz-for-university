"use client";

import { useEffect, useState } from "react";
import { questions } from "./questions";

const LETTERS = ["A", "B", "C", "D"];

function Ball({ small }) {
  return (
    <div className={`ball-stage ${small ? "small" : ""}`} aria-hidden="true">
      <div className="ball" />
      <div className="ball-shadow" />
    </div>
  );
}

function Strip({ index, total }) {
  return (
    <div className="strip" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={index + 1}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={i < index ? "cell done" : i === index ? "cell now" : "cell"} />
      ))}
    </div>
  );
}

function verdict(score, total) {
  const p = score / total;
  if (p === 1) return { title: "A perfect cut!", text: "Not a single unnecessary frame. You know animation history inside out." };
  if (p >= 0.75) return { title: "Almost an Oscar", text: "A very strong result. A couple of frames are missing, but the picture is complete." };
  if (p >= 0.5) return { title: "Not a bad rough cut", text: "You've got the basics. Review the answers below and catch up on what you missed." };
  return { title: "Time for reshoots", text: "Don't worry. Review the answers below and take the quiz again." };
}

export default function Home() {
  const [stage, setStage] = useState("start");
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [shown, setShown] = useState(0);

  const total = questions.length;
  const score = answers.filter((a, i) => a === questions[i].correct).length;

  useEffect(() => {
    if (stage !== "result") return;
    setShown(0);
    let n = 0;
    const id = setInterval(() => {
      n += 1;
      setShown(n);
      if (n >= score) clearInterval(id);
    }, 160);
    return () => clearInterval(id);
  }, [stage, score]);

  function start() {
    setIndex(0);
    setPicked(null);
    setAnswers([]);
    setStage("quiz");
  }

  function pick(i) {
    if (picked !== null) return;
    setPicked(i);
  }

  function next() {
    const updated = [...answers, picked];
    setAnswers(updated);
    if (index + 1 < total) {
      setIndex(index + 1);
      setPicked(null);
    } else {
      setStage("result");
    }
  }

  if (stage === "start") {
    return (
      <main className="wrap center">
        <Ball />
        <h1 className="title">Animation History Quiz</h1>
        <p className="lead">From the zoetrope to neural networks. 8 questions, each with one correct answer.</p>
        <button className="btn big" onClick={start}>Start the quiz</button>
      </main>
    );
  }

  if (stage === "quiz") {
    const item = questions[index];
    const answered = picked !== null;
    const ok = picked === item.correct;
    return (
      <main className="wrap">
        <header className="top">
          <span className="frame-no">Frame {index + 1} of {total}</span>
          <Strip index={index} total={total} />
        </header>

        <section key={index} className="card scene">
          <h2 className="question">{item.q}</h2>
          <div className="options">
            {item.options.map((opt, i) => {
              let cls = "option";
              if (answered && i === item.correct) cls += " right";
              else if (answered && i === picked) cls += " wrong";
              else if (answered) cls += " dim";
              return (
                <button key={i} className={cls} onClick={() => pick(i)} disabled={answered}>
                  <span className="letter">{LETTERS[i]}</span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          <div className="foot">
            <p className={`feedback ${answered ? (ok ? "ok" : "bad") : ""}`} aria-live="polite">
              {answered && (ok ? "Correct!" : `Not quite. The correct answer is ${LETTERS[item.correct]}`)}
            </p>
            {answered && (
              <button className="btn" onClick={next}>
                {index + 1 < total ? "Next question" : "Show results"}
              </button>
            )}
          </div>
        </section>
      </main>
    );
  }

  const v = verdict(score, total);
  return (
    <main className="wrap">
      <section className="card result">
        <Ball small />
        <div className="stamp" aria-label={`Score: ${score} out of ${total}`}>
          <span className="big-num">{shown}</span>
          <span className="of">out of {total}</span>
        </div>
        <h2 className="title small">{v.title}</h2>
        <p className="lead">{v.text}</p>
        <button className="btn big" onClick={start}>Try again</button>
      </section>

      <h3 className="review-h">Answer review</h3>
      <ol className="review">
        {questions.map((q, i) => {
          const good = answers[i] === q.correct;
          return (
            <li key={i} className={`card review-item ${good ? "good" : "miss"}`} style={{ animationDelay: `${0.5 + i * 0.07}s` }}>
              <p className="review-q">{q.q}</p>
              <p className="review-a">
                {good ? "Your answer is correct: " : "Your answer: "}
                <b>{LETTERS[answers[i]]}) {q.options[answers[i]]}</b>
              </p>
              {!good && (
                <p className="review-a">
                  Correct answer: <b>{LETTERS[q.correct]}) {q.options[q.correct]}</b>
                </p>
              )}
            </li>
          );
        })}
      </ol>
    </main>
  );
}
