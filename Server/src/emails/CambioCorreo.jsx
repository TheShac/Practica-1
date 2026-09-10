import { Text } from "@react-email/components";
import Layout from "./Layout.jsx";

export default function CambioCorreo({ correoNuevo }) {
  return (
    <Layout previewText="Tu correo organizacional cambió">
      <Text>Hola,</Text>
      <Text>
        Se registró un cambio de correo organizacional a: <strong>{correoNuevo}</strong>
      </Text>
      <Text>Deberás verificar este nuevo correo antes de poder usarlo para iniciar sesión.</Text>
    </Layout>
  );
}