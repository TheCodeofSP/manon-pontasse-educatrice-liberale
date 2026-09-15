import {
  analyticsMeasurementId,
  hasAnalyticsConfiguration,
} from "../config/environment.js";

let enabled = false;

export function initAnalytics() {
  if (enabled || typeof window === "undefined" || !hasAnalyticsConfiguration) {
    return;
  }

  enabled = true;
  window[`ga-disable-${analyticsMeasurementId}`] = false;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", analyticsMeasurementId, {
    send_page_view: false,
    anonymize_ip: true,
  });

  if (!document.querySelector(`script[data-ga-id="${analyticsMeasurementId}"]`)) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsMeasurementId}`;
    script.dataset.gaId = analyticsMeasurementId;
    document.head.appendChild(script);
  }
}

export function disableAnalytics() {
  enabled = false;
  if (typeof window === "undefined") return;

  if (hasAnalyticsConfiguration) {
    window[`ga-disable-${analyticsMeasurementId}`] = true;
  }

  document.querySelector(`script[data-ga-id="${analyticsMeasurementId}"]`)?.remove();

  ["_ga", `_ga_${analyticsMeasurementId.replace("G-", "")}`].forEach((name) => {
    document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
    document.cookie = `${name}=; Max-Age=0; path=/; domain=.${location.hostname}; SameSite=Lax`;
  });
  delete window.gtag;
  window.dataLayer = [];
}

export function trackPageView(path) {
  trackEvent("page_view", {
    page_path: path,
    page_location: window.location.href,
  });
}

export function trackEvent(name, parameters = {}) {
  if (!enabled || typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", name, parameters);
}

export function trackContactClick(method, location) {
  trackEvent("contact_click", {
    contact_method: method,
    link_location: location,
  });
}
