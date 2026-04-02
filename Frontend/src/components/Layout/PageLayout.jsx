import Navbar from "./Navbar";
import Toast from "../UI/Toast";

export default function PageLayout({ children, toast }) {
  return (
    <>
      <Navbar />
      <main className="page-shell">{children}</main>
      {toast && <Toast message={toast.message} visible={toast.visible} isError={toast.isError} />}
    </>
  );
}
