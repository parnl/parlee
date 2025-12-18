export const metadata = {
  title: "Parlee",
  description: "Daily language ritual MVP"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
