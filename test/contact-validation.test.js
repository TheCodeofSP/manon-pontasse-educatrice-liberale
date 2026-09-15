import test from "node:test";
import assert from "node:assert/strict";
import { CONTACT_LIMITS, getContactErrors } from "../src/lib/contactValidation.js";

const copy = {
  chooseProfile: "profil",
  chooseTopic: "demande",
  enterName: "nom",
  longName: "nom long",
  enterEmail: "email",
  invalidEmail: "email invalide",
  shortMsg: "message court",
  longMsg: "message long",
  consent: "accord",
};

test("le formulaire accepte une demande complète", () => {
  const errors = getContactErrors(
    {
      profile: "accompagnant",
      topic: "information",
      name: "Camille",
      email: "camille@example.fr",
      message: "Bonjour, je souhaite échanger au sujet de mon enfant.",
      consent: true,
    },
    copy,
  );
  assert.deepEqual(errors, {});
});

test("le formulaire refuse les champs invalides et trop longs", () => {
  const errors = getContactErrors(
    {
      profile: "",
      topic: "",
      name: "a".repeat(CONTACT_LIMITS.name + 1),
      email: "adresse-invalide",
      message: "a".repeat(CONTACT_LIMITS.message + 1),
      consent: false,
    },
    copy,
  );
  assert.deepEqual(Object.keys(errors), [
    "profile",
    "topic",
    "name",
    "email",
    "message",
    "consent",
  ]);
});
