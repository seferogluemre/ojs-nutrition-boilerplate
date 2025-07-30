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
        background: '#f8f9fa', // Daha açık gri
        success: '#28a745', // Daha koyu yeşil
        text: {
          DEFAULT: '#000000',
          muted: '#6c757d',
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
}: OrderConfirmationProps) {
  if (!company || !footer || !orderNumber) {
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
        <Preview>Siparişiniz başarıyla alındı - {orderNumber}</Preview>
        <Body className="m-auto bg-white font-sans">
          <Container className="mx-auto px-5 max-w-2xl">
            {/* Header with Logo */}
            <Section className="mt-8">
              <Img src={finalLogoUrl} height={50} alt={company.name} />
              <Text className="text-sm text-text-muted mt-2">Premium Spor Besın Takviyesi</Text>
            </Section>

            {/* Success Banner */}
            <Section className="bg-success text-white text-center py-4 px-6 rounded-lg my-6">
              <Text className="text-lg font-semibold m-0">✓ Siparişiniz Başarıyla Alındı!</Text>
            </Section>

            <Heading className="text-primary my-6 p-0 text-2xl font-bold">
              Merhaba {userName},
            </Heading>
            
            <Text className="mb-6 text-base leading-6">
              Siparişiniz başarıyla alınmıştır. Sipariş detaylarınız aşağıda yer almaktadır.
            </Text>

            {/* Order Information */}
            <Section className="bg-gray-100 p-6 rounded-lg mb-6 border border-gray-200">
              <Heading className="text-lg font-bold mb-4 text-primary">📋 Sipariş Bilgileri</Heading>
              
              <Row className="mb-2">
                <Column className="w-1/2">
                  <Text className="font-semibold text-sm">Sipariş Numarası:</Text>
                </Column>
                <Column className="w-1/2">
                  <Text className="text-sm text-primary font-bold">#{orderNumber}</Text>
                </Column>
              </Row>
              
              <Row className="mb-2">
                <Column className="w-1/2">
                  <Text className="font-semibold text-sm">Sipariş Tarihi:</Text>
                </Column>
                <Column className="w-1/2">
                  <Text className="text-sm">{orderDate}</Text>
                </Column>
              </Row>
              
              <Row className="mb-2">
                <Column className="w-1/2">
                  <Text className="font-semibold text-sm">Durum:</Text>
                </Column>
                <Column className="w-1/2">
                  <Text className="text-sm text-success font-semibold">✓ Onaylandı</Text>
                </Column>
              </Row>
            </Section>

            {/* Order Items */}
            <Section className="mb-6">
              <Heading className="text-lg font-bold mb-4 text-primary">🛒 Sipariş Edilen Ürünler</Heading>
              
              {items.map((item, index) => (
                <Row key={index} className="border-b border-gray-300 py-3">
                  <Column className="w-1/2">
                    <Text className="font-semibold text-sm">{item.productName}</Text>
                    <Text className="text-xs text-text-muted">Adet: {item.quantity}</Text>
                  </Column>
                  <Column className="w-1/2 text-right">
                    <Text className="font-bold text-sm">{item.totalPrice.toLocaleString('tr-TR')} TL</Text>
                    <Text className="text-xs text-text-muted">{item.unitPrice.toLocaleString('tr-TR')} TL / Adet</Text>
                  </Column>
                </Row>
              ))}
              
              {/* Total */}
              <Row className="pt-4 border-t-2 border-gray-400">
                <Column className="w-1/2">
                  <Text className="font-bold text-lg">Toplam:</Text>
                </Column>
                <Column className="w-1/2 text-right">
                  <Text className="font-bold text-lg text-primary">{subtotal.toLocaleString('tr-TR')} TL</Text>
                </Column>
              </Row>
            </Section>

            {/* Shipping Address */}
            {shippingAddress && (
              <Section className="bg-gray-100 p-6 rounded-lg mb-6 border border-gray-200">
                <Heading className="text-lg font-bold mb-4 text-primary">📍 Teslimat Adresi</Heading>
                
                <Text className="font-semibold text-sm mb-2">{shippingAddress.title}</Text>
                <Text className="text-sm mb-1">{shippingAddress.recipientName}</Text>
                <Text className="text-sm mb-1">{shippingAddress.phone}</Text>
                <Text className="text-sm mb-1">{shippingAddress.addressLine1}</Text>
                {shippingAddress.addressLine2 && (
                  <Text className="text-sm mb-1">{shippingAddress.addressLine2}</Text>
                )}
                <Text className="text-sm">
                  {shippingAddress.postalCode} {shippingAddress.city}, {shippingAddress.state} / {shippingAddress.country}
                </Text>
              </Section>
            )}

            {/* Info Box */}
            <Section className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <Text className="text-sm text-blue-800 m-0">
                💡 <strong>Bilgi:</strong> Siparişiniz 2-3 iş günü içerisinde kargo takip kodu ile tarafınıza iletilecektir. 
                Kargo takip bilgilerini SMS ve e-posta ile alacaksınız.
              </Text>
            </Section>

            <Text className="text-text-muted text-sm leading-6 mb-8">
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
} as OrderConfirmationProps;

export default OrderConfirmation;