interface Metadata {
  title: string
  description: string
  keywords: string[]
  openGraph: {
    title: string
    description: string
    images: string[]
    url: string
    siteName: string
    locale: string
    type: string
  }
  twitter: {
    card: string
    title: string
    description: string
    images: string[]
    creator: string
  }
  alternates: {
    languages: {
      [key: string]: string
    }
  }
}

const baseUrl = 'https://www.good.inc'

export const metadata: { [key: string]: Metadata } = {
  en: {
    title: 'Good.inc - More than clean – Healthy',
    description: 'Discover how caring for your clothes can reduce stress, promote cell renewal, and naturally balance your immune system. Our exclusive technology treats fabrics to keep you healthy and feeling fresh all day long.',
    keywords: ['body care', 'odor control', 'fabric treatment', 'natural deodorant', 'skin care', 'sustainable', 'aluminum-free'],
    openGraph: {
      title: 'Good.inc - More than clean – Healthy',
      description: 'Discover how caring for your clothes can reduce stress, promote cell renewal, and naturally balance your immune system. Our exclusive technology treats fabrics to keep you healthy and feeling fresh all day long.',
      images: [
        `${baseUrl}/images/products/treatment-pre.jpeg`,
        `${baseUrl}/images/products/treatment-post.jpeg`
      ],
      url: baseUrl,
      siteName: 'Good.inc',
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Good.inc - More than clean – Healthy',
      description: 'Discover how caring for your clothes can reduce stress, promote cell renewal, and naturally balance your immune system. Our exclusive technology treats fabrics to keep you healthy and feeling fresh all day long.',
      images: [
        `${baseUrl}/images/products/treatment-pre.jpeg`,
        `${baseUrl}/images/products/treatment-post.jpeg`
      ],
      creator: '@goodinc',
    },
    alternates: {
      languages: {
        'en': `${baseUrl}/en`,
        'pt': `${baseUrl}/pt`,
      }
    }
  },
  pt: {
    title: 'Good.inc - Mais que limpo – Saudável',
    description: 'Descubra como o cuidado com suas roupas pode reduzir o estresse, promover a renovação celular e equilibrar naturalmente seu sistema imunológico. Nossa tecnologia exclusiva trata os tecidos para manter você saudável e com sensação de banho tomado o dia todo.',
    keywords: ['cuidados corporais', 'controle de odor', 'tratamento de tecidos', 'desodorante natural', 'cuidados com a pele', 'sustentável', 'livre de alumínio'],
    openGraph: {
      title: 'Good.inc - Mais que limpo – Saudável',
      description: 'Descubra como o cuidado com suas roupas pode reduzir o estresse, promover a renovação celular e equilibrar naturalmente seu sistema imunológico. Nossa tecnologia exclusiva trata os tecidos para manter você saudável e com sensação de banho tomado o dia todo.',
      images: [
        `${baseUrl}/images/products/treatment-pre.jpeg`,
        `${baseUrl}/images/products/treatment-post.jpeg`
      ],
      url: baseUrl,
      siteName: 'Good.inc',
      locale: 'pt_BR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Good.inc - Mais que limpo – Saudável',
      description: 'Descubra como o cuidado com suas roupas pode reduzir o estresse, promover a renovação celular e equilibrar naturalmente seu sistema imunológico. Nossa tecnologia exclusiva trata os tecidos para manter você saudável e com sensação de banho tomado o dia todo.',
      images: [
        `${baseUrl}/images/products/treatment-pre.jpeg`,
        `${baseUrl}/images/products/treatment-post.jpeg`
      ],
      creator: '@goodinc',
    },
    alternates: {
      languages: {
        'en': `${baseUrl}/en`,
        'pt': `${baseUrl}/pt`,
      }
    }
  }
}
