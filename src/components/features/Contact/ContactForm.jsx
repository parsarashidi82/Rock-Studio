import { SOCIAL_LINKS } from "@/lib/constants";

/**
 * ContactForm component containing lead capture inputs, submission status,
 * and direct social communication channels.
 * Uses `data-r` attributes for scroll-driven milestone reveals.
 */
export default function ContactForm({ formRef, stRef }) {
  return (
    <div>
      <div className="r" data-r="0,.12">
        <p className="eyebrow">Contact</p>
        <h2>
          Tell us what
          <br />
          you’re building.
        </h2>
      </div>

      <form id="f" ref={formRef} noValidate>
        <div className="r" data-r=".08,.22">
          <label className="fld">
            <span>Your name</span>
            <input name="name" dir="auto" autoComplete="name" />
          </label>
        </div>
        <div className="r" data-r=".15,.29">
          <label className="fld">
            <span>Phone number</span>
            <input
              name="phone"
              type="tel"
              inputMode="tel"
              dir="auto"
              autoComplete="tel"
            />
          </label>
        </div>
        <div className="r" data-r=".22,.36">
          <label className="fld">
            <span>Message</span>
            <textarea name="message" rows={3} dir="auto" />
          </label>
        </div>
        <div className="r row" data-r=".32,.44">
          <button className="send" type="submit">
            Send message
          </button>
          <p id="st" ref={stRef} aria-live="polite" />
        </div>
      </form>

      <div className="r soc" data-r=".5,.64">
        <a
          href={SOCIAL_LINKS.telegram}
          target="_blank"
          rel="noreferrer noopener"
        >
          <span>Telegram</span>
          <b>@rokstudio</b>
        </a>
        <a
          href={SOCIAL_LINKS.instagram}
          target="_blank"
          rel="noreferrer noopener"
        >
          <span>Instagram</span>
          <b>@rokstudio</b>
        </a>
      </div>
    </div>
  );
}
