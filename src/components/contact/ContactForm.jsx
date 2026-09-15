import { CONTACT_LIMITS } from "../../lib/contactValidation.js";
import { useContactForm } from "../../hooks/useContactForm.js";
import Toast from "../Toast.jsx";
import { trackContactClick } from "../../lib/analytics.js";

export default function ContactForm() {
  const {
    closeStatus,
    copy,
    emailMethod,
    errors,
    form,
    formTitle,
    hasFormspreeConfiguration,
    labels,
    onBlur,
    onChange,
    onSubmit,
    profileOptions,
    profileSelect,
    registerField,
    responseTime,
    showError,
    status,
    submitLabel,
    topicOptions,
    topicSelect,
    usesTutoiement,
    values,
  } = useContactForm();

  return (
    <>
      <Toast
        open={status.type === "success" || status.type === "error"}
        type={status.type === "success" ? "success" : "error"}
        title={status.type === "success" ? "Message envoyé" : "Erreur"}
        message={status.message}
        onClose={closeStatus}
        duration={status.type === "success" ? 3500 : 6000}
      />

      <section className="contact__main">
        <div className="contact__card contact__card--reveal">
          <h2 className="contact__h2">{formTitle}</h2>

          <form className="contact__form" onSubmit={onSubmit} noValidate>
            <input
              type="text"
              name="_gotcha"
              value={values._gotcha}
              onChange={onChange("_gotcha")}
              className="sr-only"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            <div className="contact__grid">
              <div className="contact__field">
                <label className="contact__label" htmlFor="profile">
                  {profileSelect.label ?? "Je suis…"}
                </label>
                <select
                  id="profile"
                  ref={registerField("profile")}
                  className={`contact__select ${showError("profile") ? "has-error" : ""}`}
                  value={values.profile}
                  onChange={onChange("profile")}
                  onBlur={onBlur("profile")}
                  aria-invalid={showError("profile")}
                  aria-describedby={showError("profile") ? "err-profile" : undefined}
                >
                  <option value="">{profileSelect.placeholder ?? "Choisir…"}</option>
                  {profileOptions.map((option) => (
                    <option key={option.key} value={option.key}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {showError("profile") && (
                  <p className="contact__error" id="err-profile">
                    {errors.profile}
                  </p>
                )}
              </div>

              <div className="contact__field">
                <label className="contact__label" htmlFor="topic">
                  {topicSelect.label ?? "Ma demande concerne…"}
                </label>
                <select
                  id="topic"
                  ref={registerField("topic")}
                  className={`contact__select ${showError("topic") ? "has-error" : ""}`}
                  value={values.topic}
                  onChange={onChange("topic")}
                  onBlur={onBlur("topic")}
                  aria-invalid={showError("topic")}
                  aria-describedby={showError("topic") ? "err-topic" : undefined}
                >
                  <option value="">{topicSelect.placeholder ?? "Choisir…"}</option>
                  {topicOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {showError("topic") && (
                  <p className="contact__error" id="err-topic">
                    {errors.topic}
                  </p>
                )}
              </div>

              <div className="contact__field">
                <label className="contact__label" htmlFor="name">
                  {labels.name ?? "Nom"}
                </label>
                <input
                  id="name"
                  ref={registerField("name")}
                  className={`contact__input ${showError("name") ? "has-error" : ""}`}
                  type="text"
                  value={values.name}
                  onChange={onChange("name")}
                  onBlur={onBlur("name")}
                  autoComplete="name"
                  maxLength={CONTACT_LIMITS.name}
                  placeholder={copy.namePlaceholder}
                  aria-invalid={showError("name")}
                  aria-describedby={showError("name") ? "err-name" : undefined}
                />
                {showError("name") && (
                  <p className="contact__error" id="err-name">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="contact__field">
                <label className="contact__label" htmlFor="email">
                  {labels.email ?? "Email"}
                </label>
                <input
                  id="email"
                  ref={registerField("email")}
                  className={`contact__input ${showError("email") ? "has-error" : ""}`}
                  type="email"
                  value={values.email}
                  onChange={onChange("email")}
                  onBlur={onBlur("email")}
                  autoComplete="email"
                  maxLength={CONTACT_LIMITS.email}
                  placeholder="vous@exemple.fr"
                  aria-invalid={showError("email")}
                  aria-describedby={showError("email") ? "err-email" : undefined}
                />
                {showError("email") && (
                  <p className="contact__error" id="err-email">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="contact__field contact__field--full">
                <label className="contact__label" htmlFor="phone">
                  {labels.phone ?? "Téléphone"}{" "}
                  <span className="contact__optional">(optionnel)</span>
                </label>
                <input
                  id="phone"
                  ref={registerField("phone")}
                  className="contact__input"
                  type="tel"
                  value={values.phone}
                  onChange={onChange("phone")}
                  onBlur={onBlur("phone")}
                  autoComplete="tel"
                  maxLength={CONTACT_LIMITS.phone}
                  placeholder="06 00 00 00 00"
                />
              </div>

              <div className="contact__field contact__field--full">
                <label className="contact__label" htmlFor="message">
                  {labels.message ?? "Message"}
                </label>
                <textarea
                  id="message"
                  ref={registerField("message")}
                  className={`contact__textarea ${showError("message") ? "has-error" : ""}`}
                  value={values.message}
                  onChange={onChange("message")}
                  onBlur={onBlur("message")}
                  rows={6}
                  maxLength={CONTACT_LIMITS.message}
                  placeholder={
                    usesTutoiement
                      ? "Ex : ce que tu vis, ce dont tu as besoin… même quelques lignes suffisent."
                      : "Ex : difficultés rencontrées, besoins, questions… même quelques lignes suffisent."
                  }
                  aria-invalid={showError("message")}
                  aria-describedby={showError("message") ? "err-message" : undefined}
                />
                {showError("message") && (
                  <p className="contact__error" id="err-message">
                    {errors.message}
                  </p>
                )}
              </div>

              <div className="contact__field contact__field--full">
                <label
                  className={`contact__consent ${showError("consent") ? "has-error" : ""}`}
                >
                  <input
                    ref={registerField("consent")}
                    type="checkbox"
                    checked={values.consent}
                    onChange={onChange("consent")}
                    onBlur={onBlur("consent")}
                    aria-invalid={showError("consent")}
                    aria-describedby={showError("consent") ? "err-consent" : undefined}
                  />
                  <span>{form.consent ?? "J’accepte d’être recontacté(e)."}</span>
                </label>
                {showError("consent") && (
                  <p className="contact__error" id="err-consent">
                    {errors.consent}
                  </p>
                )}
              </div>
            </div>

            <div className="contact__actions">
              {!hasFormspreeConfiguration && (
                <p className="contact__error" role="status">
                  Le formulaire est temporairement indisponible. Utilisez le contact
                  direct par email ci-dessous.
                </p>
              )}

              <button
                className="contact__btn"
                type="submit"
                disabled={status.type === "submitting" || !hasFormspreeConfiguration}
              >
                {status.type === "submitting" ? "Envoi en cours…" : submitLabel}
              </button>

              {emailMethod?.value && (
                <a
                  className="contact__alt"
                  href={`mailto:${emailMethod.value}`}
                  onClick={() => trackContactClick("email", "contact_form")}
                >
                  Préférer un contact direct par email
                </a>
              )}

              {responseTime && <p className="contact__hint">{responseTime}</p>}
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
