import test from "node:test";
import assert from "node:assert/strict";
import { getByProfile } from "../src/content/getByProfile.js";
import {
  serviceAreaCities,
  serviceAreaPolygon,
} from "../src/data/serviceAreaMapData.js";

test("le contenu est adapté au profil avec un repli visiteur", () => {
  const copy = { visitor: "Bonjour", accompagne: "Salut" };
  assert.equal(getByProfile(copy, "accompagne"), "Salut");
  assert.equal(getByProfile(copy, "partenaire_social"), "Bonjour");
});

test("la zone d’intervention conserve toutes les communes", () => {
  assert.equal(serviceAreaCities.length, 23);
  assert.ok(serviceAreaCities.some((city) => city.name === "Strasbourg"));
  assert.ok(serviceAreaCities.some((city) => city.name === "Erstein"));
  assert.ok(serviceAreaPolygon.length >= 3);
});
