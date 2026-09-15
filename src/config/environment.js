const readEnvironmentValue = (value) => String(value || "").trim();

export const formspreeEndpoint = readEnvironmentValue(
  import.meta.env.VITE_FORMSPREE_ENDPOINT,
);

export const analyticsMeasurementId = readEnvironmentValue(
  import.meta.env.VITE_GA_MEASUREMENT_ID,
);

export const hasFormspreeConfiguration = Boolean(formspreeEndpoint);
export const hasAnalyticsConfiguration = /^G-[A-Z0-9]+$/i.test(analyticsMeasurementId);
