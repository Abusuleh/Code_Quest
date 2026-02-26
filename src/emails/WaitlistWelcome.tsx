type Props = {
  email: string;
};

export function WaitlistWelcome({ email }: Props) {
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
        <h1 style={{ fontFamily: "Orbitron, Arial, sans-serif" }}>Welcome to CodeQuest</h1>
        <p style={{ color: "#A8A8BC" }}>Hi {email},</p>
        <p style={{ color: "#A8A8BC" }}>
          You&apos;re officially on the waitlist. Byte is already preparing your first quest.
        </p>
        <p style={{ color: "#A8A8BC" }}>
          We&apos;ll send early access updates and your launch invitation soon.
        </p>
        <p style={{ marginTop: "24px", color: "#00D4FF" }}>— The CodeQuest Team</p>
      </div>
    </div>
  );
}
