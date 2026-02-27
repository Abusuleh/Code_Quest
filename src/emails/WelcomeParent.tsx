type Props = {
  name?: string | null;
};

export function WelcomeParent({ name }: Props) {
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
          You&apos;re in{` ${name ?? ""}`}!
        </h1>
        <p style={{ color: "#A8A8BC" }}>
          Your CodeQuest account is verified and ready. Your next step is to create your
          child&apos;s adventurer profile — it takes just 2 minutes.
        </p>
        <p style={{ marginTop: "24px" }}>
          <a
            href="https://codequest.world/parent/add-child"
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
            Create My Child&apos;s Profile →
          </a>
        </p>
      </div>
    </div>
  );
}
