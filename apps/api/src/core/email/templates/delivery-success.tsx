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

interface DeliverySuccessProps {
  trackingNumber: string;
  customerName: string;
  orderNumber?: string;
  deliveryDate: string;
  items?: Array<{
    productName: string;
    quantity: number;
  }>;
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

export function DeliverySuccess({
  trackingNumber,
  customerName,
  orderNumber,
  deliveryDate,
  items,
  company,
  footer,
  isDarkMode = false,
}: DeliverySuccessProps) {
  const theme = isDarkMode ? 'dark' : 'light';

  return (
    <Html>
      <Head />
      <Preview>Siparişiniz Başarıyla Teslim Edildi! 🎉</Preview>
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
              <div className="text-6xl mb-4">🎉</div>
              <Heading className={`text-2xl font-bold text-success-${theme} m-0`}>
                Teslimat Tamamlandı!
              </Heading>
            </Section>

            {/* Main Content */}
            <Section className={`bg-card-${theme} rounded-lg p-6 mb-6`}>
              <Text className={`text-primary-${theme} text-lg mb-4`}>
                Merhaba <strong>{customerName}</strong>,
              </Text>
              
              <Text className={`text-primary-${theme} mb-4 leading-6`}>
                Siparişiniz başarıyla teslim edildi! QR kod doğrulaması ile teslimatınız 
                onaylanmıştır.
              </Text>

              <Row className="mb-4">
                <Column>
                  <Text className={`text-text-muted-${theme} text-sm m-0`}>
                    <strong>Teslimat Tarihi:</strong> {deliveryDate}
                  </Text>
                </Column>
              </Row>

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

            {/* Success Status */}
            <Section className="bg-green-50 border border-green-200 rounded-lg p-6 text-center mb-6">
              <div className="text-4xl mb-3">✅</div>
              <Heading className="text-xl font-semibold text-green-800 mb-2">
                Teslimat Onaylandı
              </Heading>
              <Text className="text-green-700 text-sm mb-0">
                Siparişiniz QR kod ile doğrulanarak güvenli bir şekilde teslim edilmiştir.
              </Text>
            </Section>

            {/* Order Items (if provided) */}
            {items && items.length > 0 && (
              <Section className={`bg-card-${theme} rounded-lg p-6 mb-6`}>
                <Heading className={`text-lg font-semibold text-primary-${theme} mb-4`}>
                  Teslim Edilen Ürünler
                </Heading>
                
                {items.map((item, index) => (
                  <Row key={index} className="mb-2 pb-2 border-b border-border-light last:border-b-0">
                    <Column className="w-3/4">
                      <Text className={`text-primary-${theme} text-sm m-0`}>
                        {item.productName}
                      </Text>
                    </Column>
                    <Column className="w-1/4 text-right">
                      <Text className={`text-text-muted-${theme} text-sm m-0`}>
                        x{item.quantity}
                      </Text>
                    </Column>
                  </Row>
                ))}
              </Section>
            )}

            {/* Next Steps */}
            <Section className={`bg-card-${theme} rounded-lg p-6 mb-6`}>
              <Heading className={`text-lg font-semibold text-primary-${theme} mb-3`}>
                Sonraki Adımlar
              </Heading>
              
              <Text className={`text-primary-${theme} mb-2`}>
                <strong>📦</strong> Ürünlerinizi kontrol edin ve hasar varsa 24 saat içinde bildirim yapın
              </Text>
              <Text className={`text-primary-${theme} mb-2`}>
                <strong>⭐</strong> Deneyiminizi değerlendirmek için geri bildirim bırakın
              </Text>
              <Text className={`text-primary-${theme} mb-0`}>
                <strong>🛍️</strong> Yeni siparişleriniz için web sitemizi ziyaret edin
              </Text>
            </Section>

            {/* Customer Service */}
            <Section className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <Text className="text-blue-800 text-sm mb-2">
                <strong>💬 Müşteri Hizmetleri</strong>
              </Text>
              <Text className="text-blue-700 text-sm mb-0">
                Herhangi bir sorunuz veya geri bildiriminiz için müşteri hizmetlerimizle iletişime geçebilirsiniz.
              </Text>
            </Section>

            {/* Thank You */}
            <Section className="text-center mb-6">
              <Text className={`text-primary-${theme} text-lg font-semibold`}>
                {company.name} olarak güveniniz için teşekkür ederiz! 🙏
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
