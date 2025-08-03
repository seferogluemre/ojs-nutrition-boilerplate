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

interface OrderConfirmationProps {
  orderNumber: string;
  userName: string;
  orderDate: string;
  items: Array<{
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  subtotal: number;
  shippingAddress?: {
    title: string;
    recipientName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    postalCode: string;
    city: string;
    state: string;
    country: string;
  };
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
  return url.startsWith('http') ? url : `${baseUrl}${url}`;
}

export function OrderConfirmation({
  orderNumber,
  userName,
  orderDate,
  items,
  subtotal,
  shippingAddress,
  company,
  footer,
  isDarkMode = false,
}: OrderConfirmationProps) {

  if (!company || !footer || !orderNumber) {
    return null;
  }
  
  const finalLogoUrl = getUrl(company.logoUrl);
  const socialLinks = footer.socialLinks;

  return (
    <Tailwind config={tailwindConfig}>
      <Html className={isDarkMode ? 'dark' : ''}>
        <Head>
          <style>{`
            :root { 
              color-scheme: ${isDarkMode ? 'dark' : 'light'}; 
            }
          `}</style>
        </Head>
        <Preview>Siparişiniz başarıyla alındı - {orderNumber}</Preview>

        <Body className={`m-auto font-sans transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-background-dark text-text-dark' 
            : 'bg-background-light text-text-light'
        }`}>
          <Container className="mx-auto px-5 max-w-2xl">
            {/* Header with Logo */}
            <Section className="mt-8">
              <Img src={finalLogoUrl} height={50} alt={company.name} />
              <Text className={`text-sm mt-2 ${
                isDarkMode ? 'text-text-muted-dark' : 'text-text-muted-light'
              }`}>Premium Spor Besın Takviyesi</Text>
            </Section>

            {/* Success Banner */}
            <Section className={`text-white text-center py-4 px-6 rounded-lg my-6 ${
              isDarkMode ? 'bg-success-dark' : 'bg-success-light'
            }`}>
              <Text className="text-lg font-semibold m-0">✓ Siparişiniz Başarıyla Alındı!</Text>
            </Section>

            <Heading className={`my-6 p-0 text-2xl font-bold ${
              isDarkMode ? 'text-primary-dark' : 'text-primary-light'
            }`}>
              Merhaba {userName},
            </Heading>
            
            <Text className={`mb-6 text-base leading-6 ${
              isDarkMode ? 'text-text-dark' : 'text-text-light'
            }`}>
              Siparişiniz başarıyla alınmıştır. Sipariş detaylarınız aşağıda yer almaktadır.
            </Text>

            {/* Order Information */}
            <Section className={`p-6 rounded-lg mb-6 border transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-card-dark border-border-dark' 
                : 'bg-card-light border-border-light'
            }`}>
              <Heading className={`text-lg font-bold mb-4 ${
                isDarkMode ? 'text-primary-dark' : 'text-primary-light'
              }`}>📋 Sipariş Bilgileri</Heading>
              
              <Row className="mb-2">
                <Column className="w-1/2">
                  <Text className={`font-semibold text-sm ${
                    isDarkMode ? 'text-text-dark' : 'text-text-light'
                  }`}>Sipariş Numarası:</Text>
                </Column>
                <Column className="w-1/2">
                  <Text className={`text-sm font-bold ${
                    isDarkMode ? 'text-primary-dark' : 'text-primary-light'
                  }`}>#{orderNumber}</Text>
                </Column>
              </Row>
              
              <Row className="mb-2">
                <Column className="w-1/2">
                  <Text className={`font-semibold text-sm ${
                    isDarkMode ? 'text-text-dark' : 'text-text-light'
                  }`}>Sipariş Tarihi:</Text>
                </Column>
                <Column className="w-1/2">
                  <Text className={`text-sm ${
                    isDarkMode ? 'text-text-dark' : 'text-text-light'
                  }`}>{orderDate}</Text>
                </Column>
              </Row>
              
              <Row className="mb-2">
                <Column className="w-1/2">
                  <Text className={`font-semibold text-sm ${
                    isDarkMode ? 'text-text-dark' : 'text-text-light'
                  }`}>Durum:</Text>
                </Column>
                <Column className="w-1/2">
                  <Text className={`text-sm font-semibold ${
                    isDarkMode ? 'text-success-dark' : 'text-success-light'
                  }`}>✓ Onaylandı</Text>
                </Column>
              </Row>
            </Section>

            {/* Order Items */}
            <Section className="mb-6">
              <Heading className={`text-lg font-bold mb-4 ${
                isDarkMode ? 'text-primary-dark' : 'text-primary-light'
              }`}>🛒 Sipariş Edilen Ürünler</Heading>
              
              {items.map((item, index) => (
                <Row key={index} className={`py-3 border-b ${
                  isDarkMode ? 'border-border-dark' : 'border-border-light'
                }`}>
                  <Column className="w-1/2">
                    <Text className={`font-semibold text-sm ${
                      isDarkMode ? 'text-text-dark' : 'text-text-light'
                    }`}>{item.productName}</Text>
                    <Text className={`text-xs ${
                      isDarkMode ? 'text-text-muted-dark' : 'text-text-muted-light'
                    }`}>Adet: {item.quantity}</Text>
                  </Column>
                  <Column className="w-1/2 text-right">
                    <Text className={`font-bold text-sm ${
                      isDarkMode ? 'text-text-dark' : 'text-text-light'
                    }`}>{item.totalPrice.toLocaleString('tr-TR')} TL</Text>
                    <Text className={`text-xs ${
                      isDarkMode ? 'text-text-muted-dark' : 'text-text-muted-light'
                    }`}>{item.unitPrice.toLocaleString('tr-TR')} TL / Adet</Text>
                  </Column>
                </Row>
              ))}
              
              {/* Total */}
              <Row className={`pt-4 border-t-2 ${
                isDarkMode ? 'border-border-dark' : 'border-border-light'
              }`}>
                <Column className="w-1/2">
                  <Text className={`font-bold text-lg ${
                    isDarkMode ? 'text-text-dark' : 'text-text-light'
                  }`}>Toplam:</Text>
                </Column>
                <Column className="w-1/2 text-right">
                  <Text className={`font-bold text-lg ${
                    isDarkMode ? 'text-primary-dark' : 'text-primary-light'
                  }`}>{subtotal.toLocaleString('tr-TR')} TL</Text>
                </Column>
              </Row>
            </Section>

            {/* Shipping Address */}
            {shippingAddress && (
              <Section className={`p-6 rounded-lg mb-6 border transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-card-dark border-border-dark' 
                  : 'bg-card-light border-border-light'
              }`}>
                <Heading className={`text-lg font-bold mb-4 ${
                  isDarkMode ? 'text-primary-dark' : 'text-primary-light'
                }`}>📍 Teslimat Adresi</Heading>
                
                <Text className={`font-semibold text-sm mb-2 ${
                  isDarkMode ? 'text-text-dark' : 'text-text-light'
                }`}>{shippingAddress.title}</Text>
                <Text className={`text-sm mb-1 ${
                  isDarkMode ? 'text-text-dark' : 'text-text-light'
                }`}>{shippingAddress.recipientName}</Text>
                <Text className={`text-sm mb-1 ${
                  isDarkMode ? 'text-text-dark' : 'text-text-light'
                }`}>{shippingAddress.phone}</Text>
                <Text className={`text-sm mb-1 ${
                  isDarkMode ? 'text-text-dark' : 'text-text-light'
                }`}>{shippingAddress.addressLine1}</Text>
                {shippingAddress.addressLine2 && (
                  <Text className={`text-sm mb-1 ${
                    isDarkMode ? 'text-text-dark' : 'text-text-light'
                  }`}>{shippingAddress.addressLine2}</Text>
                )}
                <Text className={`text-sm ${
                  isDarkMode ? 'text-text-dark' : 'text-text-light'
                }`}>
                  {shippingAddress.postalCode} {shippingAddress.city}, {shippingAddress.state} / {shippingAddress.country}
                </Text>
              </Section>
            )}

            {/* Info Box */}
            <Section className={`border-l-4 p-4 mb-6 transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-blue-900/20 border-blue-400' 
                : 'bg-blue-50 border-blue-400'
            }`}>
              <Text className={`text-sm m-0 ${
                isDarkMode ? 'text-blue-300' : 'text-blue-800'
              }`}>
                💡 <strong>Bilgi:</strong> Siparişiniz 2-3 iş günü içerisinde kargo takip kodu ile tarafınıza iletilecektir. 
                Kargo takip bilgilerini SMS ve e-posta ile alacaksınız.
              </Text>
            </Section>

            <Text className={`text-sm leading-6 mb-8 ${
              isDarkMode ? 'text-text-muted-dark' : 'text-text-muted-light'
            }`}>
              Herhangi bir sorunuz varsa bizimle iletişime geçmekten çekinmeyin. 
              Siparişiniz için teşekkür ederiz!
            </Text>

            {/* Footer */}
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
                    className={`underline ${
                      isDarkMode ? 'text-text-muted-dark' : 'text-text-muted-light'
                    }`}
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
                <Text className={`mb-8 block whitespace-pre-line text-left font-sans text-xs leading-[15px] ${
                  isDarkMode ? 'text-text-muted-dark' : 'text-text-muted-light'
                }`}>
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

OrderConfirmation.PreviewProps = {
  orderNumber: 'ORD1708901234567',
  userName: 'Müşteri Adı',
  orderDate: '30 Ocak 2025, 14:30',
  items: [
    {
      productName: 'WHEY PROTEIN',
      quantity: 1,
      unitPrice: 1098,
      totalPrice: 1098,
    },
    {
      productName: 'ARGININE',
      quantity: 1,
      unitPrice: 458,
      totalPrice: 458,
    },
  ],
  subtotal: 1556,
  shippingAddress: {
    title: 'Ev Adresim',
    recipientName: 'Ahmet Yılmaz',
    phone: '+90 555 123 45 67',
    addressLine1: 'Atatürk Mah. Cumhuriyet Sk. No: 1 Daire: 2',
    addressLine2: 'Beşiktaş',
    postalCode: '34357',
    city: 'İstanbul',
    state: 'İstanbul',
    country: 'Türkiye',
  },
  company: {
    name: process.env.APP_NAME || 'DJS NUTRITION',
    url: process.env.APP_URL || 'https://djsnutrition.com',
    logoUrl: '/public/email/logo.png',
  },
  footer: {
    links: [
      { text: 'Ana Sayfa', url: process.env.APP_URL || 'https://djsnutrition.com' },
      { text: 'Hakkımızda', url: (process.env.APP_URL || 'https://djsnutrition.com') + '/about' },
      { text: 'İletişim', url: (process.env.APP_URL || 'https://djsnutrition.com') + '/contact' },
    ],
    description: `©${new Date().getFullYear()} ${process.env.APP_NAME || 'DJS NUTRITION'}, Premium Spor Besın Takviyesi.
    
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
  isDarkMode: false,
} as OrderConfirmationProps;

export default OrderConfirmation;