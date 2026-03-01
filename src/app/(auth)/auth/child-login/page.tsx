import { Suspense } from "react";
import { ChildLoginClient } from "./ChildLoginClient";

export default function ChildLoginPage() {
  return (
    <Suspense>
      <ChildLoginClient />
    </Suspense>
  );
}
