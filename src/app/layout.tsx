import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Anonymous Systems",
  description: "Michigan Technology Consultant: Helping Businesses Grow with Technology",
};

interface Props {
  children: React.ReactNode;
}
export default function RootLayout(props: Props) {
  return (
    <html lang="en">
      <body>
        <main>
          {props.children}
        </main>
      </body>
    </html>
  );
}
