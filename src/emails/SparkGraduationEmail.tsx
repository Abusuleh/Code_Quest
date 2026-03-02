import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Button,
} from "@react-email/components";

type Props = {
  childName: string;
  xpTotal: number;
  dashboardUrl: string;
};

export function SparkGraduationEmail({ childName, xpTotal, dashboardUrl }: Props) {
  return (
    <Html>
      <Head />
      <Preview>{childName} just completed the Spark Zone!</Preview>
      <Body style={{ backgroundColor: "#12111A", fontFamily: "DM Sans, Arial, sans-serif" }}>
        <Container style={{ maxWidth: "600px", margin: "0 auto", padding: "32px" }}>
          <Heading style={{ color: "#FFFFFF", fontFamily: "Orbitron, Arial, sans-serif" }}>
            Spark Badge Achieved
          </Heading>
          <Text style={{ color: "#A8A8BC" }}>
            {childName} completed every lesson in the Spark Zone. This is a huge moment.
          </Text>
          <Section
            style={{
              backgroundColor: "#181723",
              borderRadius: "18px",
              padding: "20px",
              marginTop: "20px",
            }}
          >
            <Text style={{ color: "#F5A623", fontSize: "22px", margin: 0 }}>🏆 Spark Badge</Text>
            <Text style={{ color: "#FFFFFF", marginTop: "8px" }}>Total XP earned: {xpTotal}</Text>
          </Section>
          <Button
            href={dashboardUrl}
            style={{
              marginTop: "24px",
              backgroundColor: "#00D4FF",
              color: "#0A0A0F",
              padding: "12px 24px",
              borderRadius: "9999px",
              textDecoration: "none",
              fontFamily: "Orbitron, Arial, sans-serif",
            }}
          >
            View parent dashboard
          </Button>
        </Container>
      </Body>
    </Html>
  );
}
