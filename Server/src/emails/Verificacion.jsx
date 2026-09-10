import { Text, Section } from "@react-email/components";
import Layout from "./Layout.jsx";

export default function Verificacion({ codigo }) {
  return (
    <Layout previewText="Tu código de verificación">
      <Text style={parrafo}>Hola,</Text>
      <Text style={parrafo}>
        Tu código de verificación para el Sistema de Postgrado en Historia UTA es:
      </Text>

      <Section style={codeBox}>
        <Text style={codeText}>{codigo}</Text>
      </Section>

      <Text style={parrafo}>
        Este código expira pronto. Si tú no solicitaste esto, ignora este correo.
      </Text>
    </Layout>
  );
}

const parrafo = { margin: "0 0 12px" };

const codeBox = {
  backgroundColor: "rgba(218, 161, 54, 0.12)",
  borderRadius: "8px",
  margin: "16px auto",
  width: "280px",
  textAlign: "center",
};

const codeText = {
  color: "#1a1a1a",
  fontSize: "32px",
  fontWeight: "bold",
  letterSpacing: "8px",
  padding: "16px 0",
  margin: 0,
  textAlign: "center",
};