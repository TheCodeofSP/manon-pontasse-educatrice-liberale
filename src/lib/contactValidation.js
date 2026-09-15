const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const CONTACT_LIMITS = Object.freeze({
  name: 100,
  email: 254,
  phone: 30,
  message: 3000,
});

export function getContactErrors(values, copy) {
  const errors = {};
  const name = String(values.name || "").trim();
  const email = String(values.email || "").trim();
  const message = String(values.message || "").trim();

  if (!values.profile) errors.profile = copy.chooseProfile;
  if (!values.topic) errors.topic = copy.chooseTopic;
  if (!name) errors.name = copy.enterName;
  else if (name.length > CONTACT_LIMITS.name) errors.name = copy.longName;

  if (!email) errors.email = copy.enterEmail;
  else if (email.length > CONTACT_LIMITS.email || !EMAIL_PATTERN.test(email)) {
    errors.email = copy.invalidEmail;
  }

  if (message.length < 10) errors.message = copy.shortMsg;
  else if (message.length > CONTACT_LIMITS.message) errors.message = copy.longMsg;
  if (!values.consent) errors.consent = copy.consent;

  return errors;
}
