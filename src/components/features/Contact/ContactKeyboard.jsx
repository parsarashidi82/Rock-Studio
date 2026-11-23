import { ROWS } from "./keyboardData";

/**
 * 3D Mechanical Keyboard Component.
 * Features 75% ANSI layout, dynamic lighting ripples, key depression states,
 * and audio sound toggling.
 */
export default function ContactKeyboard({
  kbwRef,
  kbRef,
  ripRef,
  elsRef,
  soundOn,
  onToggleSound,
}) {
  return (
    <div className="kbw" ref={kbwRef} id="kbw">
      <div id="kb" ref={kbRef} aria-hidden="true">
        <div className="rip" ref={ripRef} id="rip" />
        <div className="rows" id="rows">
          {ROWS.map((row, ri) => (
            <div className="krow" key={ri}>
              {row.map((k) => (
                <div key={k.code} style={{ display: "contents" }}>
                  {k.gap && <span className="gap" />}
                  <button
                    type="button"
                    tabIndex={-1}
                    data-code={k.code}
                    ref={(el) => {
                      if (el && elsRef?.current) elsRef.current[k.code] = el;
                    }}
                    aria-label={k.label || k.code}
                    className={`key ${k.kind === "fn" ? "fn" : ""} ${
                      k.kind === "mod" ? "mod" : ""
                    } ${
                      /Right$|^Enter$|^Backspace$/.test(k.code) ? "right" : ""
                    }`}
                    style={{ "--w": k.w }}
                  >
                    {k.code !== "Space" &&
                      (k.sub && k.kind === "n" ? (
                        <span className="l s">
                          <i>{k.sub}</i>
                          <span>{k.label}</span>
                        </span>
                      ) : (
                        <span className="l">{k.label}</span>
                      ))}
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="cap">
        <span>Type in the fields, or tap the keys</span>
        <button id="snd" type="button" onClick={onToggleSound}>
          Sound {soundOn ? "on" : "off"}
        </button>
      </div>
    </div>
  );
}
