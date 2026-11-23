import { ROWS } from "./keyboardData";

/**
 * کامپوننت کیبورد مکانیکی سه‌بعدی استودیو راک (3D Mechanical Keyboard).
 * 
 * ویژگی‌ها:
 * ۱. رندرینگ ماتریس ۷۵٪ مکینتاش با سایه‌های چندلایه و کلیدهای برجسته.
 * ۲. ایجاد موج نوری شعاعی (Ripple Canvas) در محل ضربه هر کلید.
 * ۳. اتصال به حالت‌های فرورفتگی کلید (Active State) هنگام تایپ واقعی در فرم یا تاچ مجازی.
 * ۴. دکمه کنترل خاموش و روشن کردن افکت‌های صوتی وب‌اودیو.
 * 
 * @param {Object} props
 * @param {React.RefObject} props.kbwRef - ارجاع والد کانتینر سه‌بعدی جهت چرخش پرسپکتیو
 * @param {React.RefObject} props.kbRef - ارجاع بوم کیبورد
 * @param {React.RefObject} props.ripRef - ارجاع لایه ریپل نوری
 * @param {React.MutableRefObject<Object>} props.elsRef - دیکشنری کلیدها بر مبنای keyCode
 * @param {boolean} props.soundOn - وضعیت فعال بودن صدا
 * @param {() => void} props.onToggleSound - کال‌بک تغییر وضعیت صدا
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
