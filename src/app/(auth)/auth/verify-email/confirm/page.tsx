import { Suspense } from "react";
import { VerifyEmailConfirmClient } from "./VerifyEmailConfirmClient";

export default function VerifyEmailConfirmPage() {
  return (
    <Suspense>
      <VerifyEmailConfirmClient />
    </Suspense>
  );
}
