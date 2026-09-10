import { Html, Head, Body, Container, Section, Text, Hr, Preview } from "@react-email/components";

export default function Layout({ children, previewText }) {
  return (
    <Html>
      <Head />
      {previewText ? <Preview>{previewText}</Preview> : null}
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={headerText}>Postgrado en Historia — Universidad de Tarapacá</Text>
          </Section>
          <Section style={content}>{children}</Section>
          <Hr style={hr} />
          <Text style={footer}>
            Este es un correo automático, por favor no respondas directamente.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: "#f4f4f5", fontFamily: "Arial, sans-serif" };
const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "32px",
  maxWidth: "480px",
  borderRadius: "8px",
};
const header = { borderBottom: "2px solid #daa136", paddingBottom: "16px", marginBottom: "16px" };
const headerText = { color: "#daa136", fontWeight: "bold", fontSize: "16px", margin: 0 };
const content = { color: "#1a1a1a", fontSize: "14px", lineHeight: "1.6" };
const hr = { borderColor: "#e5e5e5", margin: "24px 0" };
const footer = { color: "#999999", fontSize: "12px" };