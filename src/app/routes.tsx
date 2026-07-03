import { createBrowserRouter } from "react-router";
import { Login } from "./pages/Login";
import { Setup } from "./pages/Setup";
import { MainMenu } from "./pages/MainMenu";
import { PostOperativeCare } from "./pages/PostOperativeCare";
import { PainControl } from "./pages/PainControl";
import { WarningSign } from "./pages/WarningSigns";
import { Checklist } from "./pages/Checklist";
import { EmergencyContact } from "./pages/EmergencyContact";
import { Medications } from "./pages/Medications";

export const router = createBrowserRouter([
  { path: "/",            Component: Login },
  { path: "/setup",       Component: Setup },
  { path: "/menu",        Component: MainMenu },
  { path: "/cuidados",    Component: PostOperativeCare },
  { path: "/dor",         Component: PainControl },
  { path: "/alertas",     Component: WarningSign },
  { path: "/checklist",   Component: Checklist },
  { path: "/emergencia",  Component: EmergencyContact },
  { path: "/medicamentos", Component: Medications },
]);