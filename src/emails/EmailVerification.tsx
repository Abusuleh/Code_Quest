type Props = {
  verifyUrl: string;
};

export function EmailVerification({ verifyUrl }: Props) {
  return (
    <div style={{ fontFamily: "DM Sans, Arial, sans-serif", backgroundColor: "#0A0A0F" }}>
      <div
        style={{
          maxWidth: "560px",
          margin: "0 auto",
          padding: "32px",
          color: "#F4F4F8",
        }}
      >
        <h1 style={{ fontFamily: "Orbitron, Arial, sans-serif" }}>
          One step away from the adventure.
        </h1>
        <p style={{ color: "#A8A8BC" }}>
          Click the button below to verify your email and access your CodeQuest account. This link
          expires in 24 hours.
        </p>
        <p style={{ marginTop: "24px" }}>
          <a
            href={verifyUrl}
            style={{
              display: "inline-block",
              padding: "12px 24px",
              backgroundColor: "#6C3FE8",
              color: "#FFFFFF",
              textDecoration: "none",
              borderRadius: "9999px",
              fontFamily: "Orbitron, Arial, sans-serif",
            }}
          >
            Verify My Email
          </a>
        </p>
        <p style={{ marginTop: "24px", color: "#A8A8BC" }}>
          If you didn&apos;t create an account, ignore this email.
        </p>
      </div>
    </div>
  );
}
