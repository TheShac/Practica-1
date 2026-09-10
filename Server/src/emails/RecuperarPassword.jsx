import { Text, Button, Section } from "@react-email/components";
import Layout from "./Layout.jsx";

export default function RecuperarPassword({ resetUrl }) {
  return (
    <Layout previewText="Recupera tu contraseña">
      <Text style={parrafo}>Hola,</Text>
      <Text style={parrafo}>
        Solicitaste recuperar tu contraseña en el Sistema de Postgrado en Historia UTA.
      </Text>

      <Section style={botonWrapper}>
        <Button href={resetUrl} style={boton}>
          Elegir nueva contraseña
        </Button>
      </Section>

      <Text style={parrafoChico}>
        Si el botón no funciona, copia y pega este link en tu navegador:
        <br />
        <span style={{ wordBreak: "break-all" }}>{resetUrl}</span>
      </Text>

      <Text style={parrafo}>
        Si no fuiste tú, ignora este correo — tu contraseña actual seguirá funcionando.
      </Text>
    </Layout>
  );
}

const parrafo = { margin: "0 0 12px" };
const parrafoChico = { margin: "16px 0 12px", fontSize: "12px", color: "#666" };

const botonWrapper = { textAlign: "center", margin: "24px 0" };

const boton = {
  backgroundColor: "#daa136",
  color: "#0c1222",
  fontWeight: "bold",
  fontSize: "14px",
  borderRadius: "10px",
  padding: "12px 32px",
  textDecoration: "none",
  display: "inline-block",
};