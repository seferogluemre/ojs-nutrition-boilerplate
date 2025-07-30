import * as React from 'react';

import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';

const tailwindConfig = {
  theme: {
    extend: {
      colors: {
        primary: '#1d1c1d',
        secondary: '#b7b7b7',
        background: '#f5f4f5',
        text: {
          DEFAULT: '#000000',
          muted: '#b7b7b7',
        },
      },
      spacing: {
        'section-y': '2.5rem', // py-10
        'section-x': '0.75rem', // px-3
      },
    },
  },
};

interface EmailVerificationCodeProps {
  validationCode: string;
  company: {
    name: string;
    url: string;
    logoUrl: string;
  };
  footer: {
    links: { text: string; url: string }[];
    description: string;
    socialLinks: {
      name: string;
      url: string;
      logoUrl: string;
      alt?: string;
    }[];
  };
}

const baseUrl = process.env.APP_URL;

function getUrl(url: string) {
  return url.startsWith('http') ? url : `${baseUrl}${url}`;
}

export function EmailVerificationCode({
  validationCode,
  company,
  footer,
}: EmailVerificationCodeProps) {
  if (!company || !footer || !validationCode) {
    return null;
  }
  const finalLogoUrl = getUrl(company.logoUrl);
  const socialLinks = footer.socialLinks;

  return (
    <Tailwind config={tailwindConfig}>
      <Html>
        <Head>
          <style>{`:root { color-scheme: only light; }`}</style>
        </Head>
        <Preview>E-posta adresinizi onaylayın</Preview>
        <Body className="m-auto bg-white font-sans">
          <Container className="mx-auto px-5">
            <Section className="mt-8">
              <Img src={finalLogoUrl} height={50} alt={company.name} />
            </Section>
            <Heading className="text-primary my-8 p-0 text-4xl font-bold leading-[42px]">
              E-posta adresinizi onaylayın
            </Heading>
            <Text className="mb-8 text-xl leading-7">
              Aşağıdaki onay kodunu açık tarayıcı sekmenize girerek oturum açma işleminizi
              tamamlayabilirsiniz.
            </Text>

            <Section className="bg-background py-section-y px-section-x mb-8 rounded">
              <Text className="text-center align-middle text-3xl">{validationCode}</Text>
            </Section>

            <Text className="text-text text-sm leading-6">
              Bu e-postayı siz istemediyseniz endişelenmenize gerek yok, görmezden gelebilirsiniz.
            </Text>

            <Section>
              <Row className="mb-8 w-full px-2">
                <Column className="w-2/3">
                  <Img src={finalLogoUrl} height={36} alt={company.name} />
                </Column>
                <Column>
                  <Section>
                    <Row>
                      {socialLinks.map((link, index) => (
                        <Column key={index}>
                          <Link href={link.url}>
                            <Img
                              src={getUrl(link.logoUrl)}
                              width="32"
                              height="32"
                              alt={link.alt}
                              className="ml-8 inline"
                            />
                          </Link>
                        </Column>
                      ))}
                    </Row>
                  </Section>
                </Column>
              </Row>
            </Section>

            <Section>
              {footer.links.map((link, index) => (
                <React.Fragment key={index}>
                  <Link
                    className="text-text-muted underline"
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.text}
                  </Link>
                  {index < footer.links.length - 1 && <>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</>}
                </React.Fragment>
              ))}
              <pre>
                <Text className="text-text-muted mb-8 block whitespace-pre-line text-left font-sans text-xs leading-[15px]">
                  {footer.description}
                </Text>
              </pre>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}

EmailVerificationCode.PreviewProps = {
  validationCode: 'DJZ-TLX',
  company: {
    name: process.env.APP_NAME,
    url: process.env.APP_URL,
    logoUrl: '/public/email/logo.png',
  },
  footer: {
    links: [
      { text: 'Ana Sayfa', url: process.env.APP_URL },
      { text: 'Hakkımızda', url: process.env.APP_URL + '/about' },
      { text: 'İletişim', url: process.env.APP_URL + '/contact' },
    ],
    description: `©${new Date().getFullYear()} ${process.env.APP_NAME}, bir yazılım şirketi.
    Adres satırı buraya geliyor

    Tüm hakları saklıdır.`,
    socialLinks: [
      {
        name: 'X',
        url: 'https://x.com',
        logoUrl: '/public/email/socials/x.png',
        alt: 'X',
      },
      {
        name: 'Facebook',
        url: 'https://facebook.com',
        logoUrl: '/public/email/socials/facebook.png',
        alt: 'Facebook',
      },
      {
        name: 'LinkedIn',
        url: 'https://linkedin.com',
        logoUrl: '/public/email/socials/linkedin.png',
        alt: 'LinkedIn',
      },
    ],
  },
} as EmailVerificationCodeProps;

export default EmailVerificationCode;