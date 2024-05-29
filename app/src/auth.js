// @ts-nocheck
import { writable } from "svelte/store";

const storedUser = JSON.parse(localStorage.getItem("pickem:user"));
export const loggedInUser = writable(storedUser);
loggedInUser.subscribe((value) => {
  localStorage.setItem("pickem:user", JSON.stringify(value));
});
