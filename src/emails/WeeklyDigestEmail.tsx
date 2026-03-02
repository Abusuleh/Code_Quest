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
  Row,
  Column,
} from "@react-email/components";

type ChildDigest = {
  name: string;
  lessonsCompleted: number;
  xpEarned: number;
  streak: number;
  level: number;
  rankTitle: string;
  achievements: string[];
  byteMessage: string;
};

type Props = {
  parentName?: string | null;
  children: ChildDigest[];
  dashboardUrl: string;
};

export function WeeklyDigestEmail({ parentName, children, dashboardUrl }: Props) {
  return (
    <Html>
      <Head />
      <Preview>{children[0]?.name ?? "Your child"}&#39;s CodeQuest week</Preview>
      <Body style={{ backgroundColor: "#12111A", fontFamily: "DM Sans, Arial, sans-serif" }}>
        <Container style={{ maxWidth: "600px", margin: "0 auto", padding: "32px" }}>
          <Heading style={{ color: "#FFFFFF", fontFamily: "Orbitron, Arial, sans-serif" }}>
            Weekly Digest
          </Heading>
          <Text style={{ color: "#A8A8BC" }}>
            Hey {parentName ?? "Commander"}, here is a summary of your pioneer&#39;s week.
          </Text>

          {children.map((child) => (
            <Section
              key={child.name}
              style={{
                backgroundColor: "#181723",
                borderRadius: "18px",
                padding: "20px",
                marginTop: "20px",
              }}
            >
              <Heading style={{ color: "#FFFFFF", fontSize: "20px" }}>{child.name}</Heading>
              <Row>
                <Column>
                  <Text style={{ color: "#00D4FF", fontSize: "18px", margin: 0 }}>
                    {child.lessonsCompleted}
                  </Text>
                  <Text style={{ color: "#A8A8BC", fontSize: "12px", marginTop: "4px" }}>
                    Lessons completed
                  </Text>
                </Column>
                <Column>
                  <Text style={{ color: "#00D4FF", fontSize: "18px", margin: 0 }}>
                    {child.xpEarned} XP
                  </Text>
                  <Text style={{ color: "#A8A8BC", fontSize: "12px", marginTop: "4px" }}>
                    XP earned
                  </Text>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text style={{ color: "#F5A623", fontSize: "18px", margin: 0 }}>
                    {child.streak} days
                  </Text>
                  <Text style={{ color: "#A8A8BC", fontSize: "12px", marginTop: "4px" }}>
                    Current streak
                  </Text>
                </Column>
                <Column>
                  <Text style={{ color: "#F5A623", fontSize: "18px", margin: 0 }}>
                    Level {child.level}
                  </Text>
                  <Text style={{ color: "#A8A8BC", fontSize: "12px", marginTop: "4px" }}>
                    {child.rankTitle}
                  </Text>
                </Column>
              </Row>
              <Section
                style={{
                  backgroundColor: "#0F0F16",
                  borderRadius: "12px",
                  padding: "12px",
                  marginTop: "16px",
                }}
              >
                <Text style={{ color: "#FFFFFF", fontSize: "13px", margin: 0 }}>
                  Byte says: {child.byteMessage}
                </Text>
              </Section>
              {child.achievements.length > 0 ? (
                <Text style={{ color: "#A8A8BC", fontSize: "12px", marginTop: "12px" }}>
                  New achievements: {child.achievements.join(", ")}
                </Text>
              ) : null}
            </Section>
          ))}

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
            See full progress
          </Button>

          <Text style={{ color: "#6B6F87", fontSize: "11px", marginTop: "20px" }}>
            You are receiving this because you are a CodeQuest parent.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
