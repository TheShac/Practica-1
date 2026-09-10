import { Text, Heading } from "@react-email/components";
import Layout from "./Layout.jsx";

export default function Notificacion({ asunto, mensaje }) {
  return (
    <Layout previewText={asunto}>
      <Heading as="h2">{asunto}</Heading>
      <Text>{mensaje}</Text>
    </Layout>
  );
}