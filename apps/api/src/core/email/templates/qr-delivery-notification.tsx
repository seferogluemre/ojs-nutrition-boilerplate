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
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#1d1c1d',
          dark: '#ffffff',
        },
        secondary: {
          light: '#b7b7b7',
          dark: '#8b8b8b',
        },
        background: {
          light: '#ffffff',
          dark: '#1a1a1a',
        },
        card: {
          light: '#f8f9fa',
          dark: '#2d2d2d',
        },
        success: {
          light: '#28a745',
          dark: '#22c55e',
        },
        text: {
          light: '#000000',
          dark: '#ffffff',
          muted: {
            light: '#6c757d',
            dark: '#a0a0a0',
          },
        },
        border: {
          light: '#e0e0e0',
          dark: '#404040',
        },
      },
      spacing: {
        'section-y': '2rem',
        'section-x': '1rem',
      },
    },
  },
};

interface QRDeliveryNotificationProps {
  trackingNumber: string;
  customerName: string;
  qrCodeUrl: string;
  validationUrl: string;
  orderNumber?: string;
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
  isDarkMode?: boolean;
}

const baseUrl = process.env.CMS_URL;

function getUrl(url: string) {
  return `${baseUrl}${url}`;
}

export function QRDeliveryNotification({
  trackingNumber,
  customerName,
  qrCodeUrl,
  validationUrl,
  orderNumber,
  company,
  footer,
  isDarkMode = false,
}: QRDeliveryNotificationProps) {
  const theme = isDarkMode ? 'dark' : 'light';

  return (
    <Html>
      <Head />
      <Preview>Siparişiniz Teslim Edilmeye Hazır - QR Kod İle Doğrulama</Preview>
      <Tailwind config={tailwindConfig}>
        <Body className={`bg-background-${theme} font-sans`}>
          <Container className="mx-auto py-section-y px-section-x max-w-2xl">
            {/* Header */}
            <Section className="text-center mb-8">
              <Img
                src={getUrl(company.logoUrl)}
                alt={company.name}
                className="mx-auto mb-4"
                width="120"
                height="40"
              />
              <Heading className={`text-2xl font-bold text-primary-${theme} m-0`}>
                Siparişiniz Kapınızda!
              </Heading>
            </Section>

            {/* Main Content */}
            <Section className={`bg-card-${theme} rounded-lg p-6 mb-6`}>
              <Text className={`text-primary-${theme} text-lg mb-4`}>
                Merhaba <strong>{customerName}</strong>,
              </Text>
              
              <Text className={`text-primary-${theme} mb-4 leading-6`}>
                Kurye kargoyu teslim etmek için kapınızda. Lütfen aşağıdaki QR kodu kuryeye göstererek 
                teslimatı onaylayın.
              </Text>

              {orderNumber && (
                <Row className="mb-4">
                  <Column>
                    <Text className={`text-text-muted-${theme} text-sm m-0`}>
                      <strong>Sipariş No:</strong> {orderNumber}
                    </Text>
                  </Column>
                </Row>
              )}

              <Row className="mb-4">
                <Column>
                  <Text className={`text-text-muted-${theme} text-sm m-0`}>
                    <strong>Kargo Takip No:</strong> {trackingNumber}
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* QR Code Section */}
            <Section className={`bg-white border-2 border-dashed border-border-${theme} rounded-lg p-8 text-center mb-6`}>
              <Heading className={`text-xl font-semibold text-primary-${theme} mb-4`}>
                Teslimat Doğrulama QR Kodu
              </Heading>
              
              <div className="mb-4">
                <Img
                  src={qrCodeUrl}
                  alt="Teslimat Doğrulama QR Kodu"
                  className="mx-auto"
                  width="200"
                  height="200"
                />
              </div>

              <Text className={`text-text-muted-${theme} text-sm mb-4`}>
                QR kodu okutamıyorsanız, aşağıdaki linke tıklayarak manuel doğrulama yapabilirsiniz:
              </Text>

              <Link
                href={validationUrl}
                className={`inline-block bg-success-${theme} text-white px-6 py-3 rounded-lg font-semibold text-decoration-none`}
              >
                Manuel Doğrulama
              </Link>
            </Section>

            {/* Instructions */}
            <Section className={`bg-card-${theme} rounded-lg p-6 mb-6`}>
              <Heading className={`text-lg font-semibold text-primary-${theme} mb-3`}>
                Teslimat Nasıl Onaylanır?
              </Heading>
              
              <Text className={`text-primary-${theme} mb-2`}>
                <strong>1.</strong> Kuryenin telefon/tablet cihazını kullanarak yukarıdaki QR kodu okutun
              </Text>
              <Text className={`text-primary-${theme} mb-2`}>
                <strong>2.</strong> QR kod doğrulandıktan sonra teslimat tamamlanacak
              </Text>
              <Text className={`text-primary-${theme} mb-0`}>
                <strong>3.</strong> Teslimat onayı e-postanızı alacaksınız
              </Text>
            </Section>

            {/* Important Note */}
            <Section className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <Text className="text-yellow-800 text-sm mb-0">
                <strong>⚠️ Önemli:</strong> Bu QR kod sadece bu teslimat için geçerlidir ve 2 saat içinde kullanılmalıdır.
              </Text>
            </Section>

            {/* Footer */}
            <Section className="text-center pt-6 border-t border-border-light">
              <Text className={`text-text-muted-${theme} text-sm mb-4`}>
                {footer.description}
              </Text>
              
              <Row className="mb-4">
                {footer.links.map((link, index) => (
                  <Column key={index} className="text-center">
                    <Link
                      href={link.url}
                      className={`text-primary-${theme} text-sm text-decoration-none mx-2`}
                    >
                      {link.text}
                    </Link>
                  </Column>
                ))}
              </Row>

              <Row>
                {footer.socialLinks.map((social, index) => (
                  <Column key={index} className="text-center">
                    <Link href={social.url} className="mx-2">
                      <Img
                        src={getUrl(social.logoUrl)}
                        alt={social.alt || social.name}
                        width="24"
                        height="24"
                      />
                    </Link>
                  </Column>
                ))}
              </Row>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
