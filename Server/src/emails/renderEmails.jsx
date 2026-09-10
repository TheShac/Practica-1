import { render } from "@react-email/render";
import Verificacion from "./Verificacion.jsx";
import RecuperarPassword from "./RecuperarPassword.jsx";
import Notificacion from "./Notificacion.jsx";
import Bienvenida from "./Bienvenida.jsx";
import CambioCorreo from "./CambioCorreo.jsx";

async function renderAmbos(Componente, props) {
  const [html, text] = await Promise.all([
    render(<Componente {...props} />),
    render(<Componente {...props} />, { plainText: true }),
  ]);
  return { html, text };
}
 
export const renderVerificacion = (props) => renderAmbos(Verificacion, props);
export const renderRecuperarPassword = (props) => renderAmbos(RecuperarPassword, props);
export const renderNotificacion = (props) => renderAmbos(Notificacion, props);
export const renderBienvenida = (props) => renderAmbos(Bienvenida, props);
export const renderCambioCorreo = (props) => renderAmbos(CambioCorreo, props);