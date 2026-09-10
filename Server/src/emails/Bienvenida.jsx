import { Text } from "@react-email/components";
import Layout from "./Layout.jsx";

export default function Bienvenida({ nombre }) {
  return (
    <Layout previewText="Bienvenido/a al sistema">
      <Text>Hola {nombre},</Text>
      <Text>Tu cuenta en el Sistema de Postgrado en Historia UTA fue creada correctamente.</Text>
      <Text>
        Recuerda verificar tu correo organizacional para poder iniciar sesión también con Google.
      </Text>
    </Layout>
  );
}