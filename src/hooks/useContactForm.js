import { useMemo, useRef, useState } from "react";
import { useContent } from "../content/useContent.js";
import { PROFILES, useProfile } from "../context/profile/ProfileContext.jsx";
import { formspreeEndpoint, hasFormspreeConfiguration } from "../config/environment.js";
import { getContactErrors } from "../lib/contactValidation.js";
import { trackEvent } from "../lib/analytics.js";

const initialValues = (profile = "") => ({
  profile,
  topic: "",
  name: "",
  email: "",
  phone: "",
  message: "",
  consent: false,
  _gotcha: "",
});

function deepGet(object, path) {
  if (!object || !path) return undefined;
  return path.split(".").reduce((value, key) => value?.[key], object);
}

export function useContactForm() {
  const { profile: globalProfile } = useProfile();
  const { content, list, node, t } = useContent();
  const defaultProfile = globalProfile !== PROFILES.VISITOR ? globalProfile : "";

  const [values, setValues] = useState(() => initialValues(defaultProfile));
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const fieldRefs = useRef({});

  const form = node("contact.content.form") ?? {};
  const labels = form.fields ?? {};
  const profileSelect = form.selects?.profile ?? {};
  const topicSelect = form.selects?.topic ?? {};
  const currentProfile = values.profile || globalProfile || PROFILES.VISITOR;
  const usesTutoiement = currentProfile === PROFILES.ACCOMPAGNE;

  const profileOptions = useMemo(() => {
    const raw = node(profileSelect.optionsPath || "home.profileSelector.options");
    return Array.isArray(raw) ? raw.filter((option) => option?.key) : [];
  }, [node, profileSelect.optionsPath]);

  const topicsByProfile = useMemo(
    () => deepGet(content, "contact.content.form.selects.topic.optionsByProfile") ?? {},
    [content],
  );

  const topicOptions = useMemo(() => {
    const options = topicsByProfile[currentProfile] ?? topicsByProfile.visitor ?? [];
    return Array.isArray(options) ? options : [];
  }, [currentProfile, topicsByProfile]);

  const copy = useMemo(
    () => ({
      chooseProfile: usesTutoiement
        ? "Choisis ton profil."
        : "Veuillez choisir votre profil.",
      chooseTopic: usesTutoiement
        ? "Précise ta demande."
        : "Veuillez préciser votre demande.",
      enterName: usesTutoiement ? "Indique ton nom." : "Veuillez renseigner votre nom.",
      enterEmail: usesTutoiement
        ? "Indique ton email."
        : "Veuillez renseigner votre email.",
      invalidEmail: "Email invalide.",
      longName: usesTutoiement ? "Ton nom est trop long." : "Votre nom est trop long.",
      shortMsg: usesTutoiement
        ? "Ton message est trop court (min. 10 caractères)."
        : "Votre message est trop court (min. 10 caractères).",
      longMsg: usesTutoiement
        ? "Ton message dépasse 3 000 caractères."
        : "Votre message dépasse 3 000 caractères.",
      consent: usesTutoiement
        ? "Merci de confirmer ton accord."
        : "Merci de confirmer votre accord.",
      globalError: "Merci de corriger les champs signalés.",
      success: usesTutoiement
        ? "Ton message est envoyé. Je te répondrai dès que possible."
        : "Votre message est envoyé. Je vous répondrai dès que possible.",
      formTitle: usesTutoiement
        ? "Parlons de ta situation"
        : "Parlons de votre situation",
      namePlaceholder: usesTutoiement ? "Ton nom" : "Votre nom",
    }),
    [usesTutoiement],
  );

  const errors = useMemo(() => getContactErrors(values, copy), [copy, values]);

  const methods = list("contact.content.methods");
  const emailMethod = Array.isArray(methods)
    ? methods.find((method) => method.type === "email")
    : undefined;

  const onChange = (key) => (event) => {
    const next = key === "consent" ? event.target.checked : event.target.value;

    if (status.type === "error") {
      setStatus({ type: "idle", message: "" });
    }

    setValues((current) =>
      key === "profile"
        ? { ...current, profile: next, topic: "" }
        : { ...current, [key]: next },
    );
  };

  const onBlur = (key) => () => setTouched((current) => ({ ...current, [key]: true }));

  const showError = (key) => Boolean(touched[key] && errors[key]);
  const registerField = (key) => (element) => {
    fieldRefs.current[key] = element;
  };

  const focusFirstError = () => {
    const order = ["profile", "topic", "name", "email", "message", "consent"];
    const firstKey = order.find((key) => errors[key]);
    const element = fieldRefs.current[firstKey];

    element?.focus();
    element?.scrollIntoView?.({ behavior: "smooth", block: "center" });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setTouched({
      profile: true,
      topic: true,
      name: true,
      email: true,
      phone: true,
      message: true,
      consent: true,
    });

    if (Object.keys(errors).length > 0) {
      setStatus({ type: "error", message: copy.globalError });
      focusFirstError();
      return;
    }

    if (!hasFormspreeConfiguration) {
      setStatus({
        type: "error",
        message:
          "Le formulaire est temporairement indisponible. Merci d’utiliser le contact direct par email.",
      });
      return;
    }

    let timeout;

    try {
      setStatus({ type: "submitting", message: "Envoi en cours…" });
      const data = new FormData();

      ["profile", "topic", "name", "email", "message", "_gotcha"].forEach((key) =>
        data.append(key, values[key] || ""),
      );
      if (values.phone) data.append("phone", values.phone);

      const controller = new AbortController();
      timeout = window.setTimeout(() => controller.abort(), 12000);
      const response = await fetch(formspreeEndpoint, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });
      if (response.ok) {
        trackEvent("generate_lead", {
          lead_source: "contact_form",
          user_profile: values.profile,
          contact_topic: values.topic,
        });
        setStatus({ type: "success", message: copy.success });
        setValues(initialValues(values.profile));
        setTouched({});
        return;
      }

      const payload = await response.json().catch(() => null);
      const message =
        payload?.errors?.map((item) => item.message).join(", ") ||
        "Oops ! Problème lors de l’envoi. Réessayez.";
      setStatus({ type: "error", message });
    } catch (requestError) {
      setStatus({
        type: "error",
        message:
          requestError?.name === "AbortError"
            ? "L’envoi prend trop de temps. Réessayez dans quelques instants."
            : "Impossible d’envoyer le message. Vérifiez votre connexion.",
      });
    } finally {
      if (timeout) window.clearTimeout(timeout);
    }
  };

  return {
    copy,
    emailMethod,
    form,
    formTitle: t("contact.ui.formTitle", copy.formTitle),
    hasFormspreeConfiguration,
    labels,
    onBlur,
    onChange,
    onSubmit,
    profileOptions,
    profileSelect,
    registerField,
    showError,
    status,
    submitLabel: t("contact.content.form.submit.label", "Envoyer ma demande"),
    responseTime: t("contact.content.form.helper.responseTime", ""),
    topicOptions,
    topicSelect,
    usesTutoiement,
    values,
    errors,
    closeStatus: () => setStatus({ type: "idle", message: "" }),
  };
}
