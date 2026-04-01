import '../styles/globals.css';
import AdminNav from '../components/AdminNav';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <AdminNav />
      <Component {...pageProps} />
    </>
  );
}
