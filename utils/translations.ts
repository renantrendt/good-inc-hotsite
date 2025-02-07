const translations = {
  en: {
    redeemButton: {
      text: "First Month Free",
      price: "$39.99/month",
      noCard: "No credit card required",
      modal: {
        titles: {
          personalData: "Personal Data",
          shippingAddress: "Shipping Address",
          profile: "Profile",
          thanks: "Thank you!"
        },
        form: {
          firstName: "First Name",
          lastName: "Last Name",
          email: "Email",
          phone: "Phone",
          confirmData: "Next",
          finishOrder: "Finish Order",
          street: "Street",
          number: "Number",
          complement: "Apartment, suite, etc.",
          city: "City",
          state: "State",
          zipCode: "ZIP Code",
          country: "Country"
        },
        questions: [
          {
            id: "clothes_odor",
            question: "Do you notice that some clothes smell more than others?",
            options: [
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" }
            ]
          },
          {
            id: "product_understanding",
            question: "Do you understand that treating fabrics is essential for your health?",
            options: [
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" }
            ]
          },
          {
            id: "main_focus",
            question: "What is your main focus?",
            options: [
              { value: "longevity", label: "Longevity" },
              { value: "problem_solving", label: "Odor/Sweat Problem" }
            ]
          }
        ],
        success: {
          message: "Your order has been successfully received. Our team will contact you soon via the registered email with more information.",
          close: "Close"
        },
        existingCustomer: {
          message: "We've identified that you are already a Good.inc customer. This promotion is exclusively for new customers. If you believe this is an error, please contact our ",
          supportLink: "support team by email",
          messageSuffix: ".",
          supportEmail: "support@vistobio.zendesk.com"
        }
      }
    },
    countrySelector: {
      label: "Code",
      defaultCountry: "+1",
      search: "Search country"
    },
    hero: {
      title: "PERSONAL CARE SYSTEM MORE THAN CLEAN — HEALTHY",
    },
    benefits: {
      title: "Benefits",
      items: [
        "Reduces hormonal imbalance, stress, risk of lymph node inflammation, skin blemishes, and premature aging",
        "Promotes cell renewal and balance of the immune system",
        "Maintains the smell and feeling of a fresh shower throughout the day",
      ],
    },
    products: {
      treatment: {
        name: "TREATMENT",
        volume: "6 FL OZ (177mL)",
        description: "ON THE WAY TO THE LAUNDRY BASKET",
        why: "Enhances the washing process, helping your clothes come out cleaner and allowing the Protector to bond with the fibers.",
        directions:
          "Before throwing clothing in the laundry basket, spray the Treatment all over towels and the inside of clothing focusing on areas in contact with the skin, sweat and body fluids.",
        explanation:
          "Washing machines are unable to remove microbes in fabrics.\n\nFabric sanitizers cannot fully kill all germs, prevent their growth on clean clothes, or stop them from contaminating your skin.",
        faqTitle: "What's wrong with my washing machine?",
      },
      protector: {
        name: "PROTECTOR",
        volume: "6 FL OZ (177mL)",
        description: "ON THE WAY TO DRY",
        why: "Limits bacterial growth on fabrics, thus protecting your skin from contamination.",
        directions:
          "After washing, spray the inside of each wet item, including underwear and towels, as you move them from the washing machine to the dryer or set them out to air dry. Alternatively, you can spray items before hanging them in the closet or folding them to store in drawers.",
        explanation:
          "The real problem is not your body — it's your system.\n\nFabrics can introduce harmful microbes to your skin daily, particularly when you dry off with a contaminated towel or wear clothes carrying microbes.\n\nYour system keeps you in an endless unhealthy cycle, dependent on products that block pores, kill bacteria, and mask the problem with fragrances.",
        faqTitle: "What's wrong with my system?",
      },
      cleanser: {
        name: "CLEANSER",
        volume: "6 FL OZ (177mL)",
        description: "IN THE SHOWER",
        why: "Breaks down dead skin cells, keeps pores clear, and balances skin pH, therefore enhancing the function of skin sensory receptors and helping to reduce sweat.",
        directions:
          "Rinse your body with water. Apply the product to your palm, massage it all over your body, let it sit briefly for deeper cleansing, then rinse thoroughly. Before leaving the shower or using other products, smell your skin. If it does not have a neutral smell, repeat the process. Dry yourself with a clean towel treated with the Good.inc system to keep microbes away from your skin.",
        explanation:
          "Cleansers do not remove microbes lodged inside your pores, so they require fragrances to mask them.\n\nAdditionally, they leave residues that impact your sensory receptors.",
        faqTitle: "What's wrong with my cleanser?",
      },
      deodorant: {
        name: "DEODORANT",
        volume: "1 FL OZ (30mL)",
        description: "AFTER SHOWERING",
        why: "In synergistic use with the other parts of the system, it limits bacterial growth on the skin, keeping your skin naturally clearer, baby-soft, and clean-smelling, while leaving no traces on your skin or clothes.",
        directions:
          "Depending on the intensity of the day and type of clothing, optionally spray a small amount once a day onto clean, dry skin after drying with a treated towel, then wear clothes treated with the Good.inc system as well.",
        explanation:
          "Deodorants, even natural ones, clog your pores and trap microbes inside, unbalancing hormones and increasing sweat production in the long term.",
        faqTitle: "What's wrong with my deodorant?",
      },
    },
    faq: {
      title: "Frequently Asked Questions",
      questions: [
        {
          question: "Are Good.inc products designed to kill or remove bacteria?",
          answer:
            "Our products were developed to limit bacterial growth. They are not designed to kill or remove bacteria.",
        },
        {
          question: "What should I do if I'm experiencing skin odor or intimate problems?",
          answer:
            "If you are experiencing skin odor or intimate problems, it is recommended that you treat your fabrics with hydrogen peroxide and hot water for 5 minutes then manually scrub the affected part of the fabric. Finish by washing it on a heavy cycle with hot water to sanitize. If the issue persists, consider discarding the garment.",
        },
        {
          question: "What are the ingredients in Good.inc system?",
          answer:
            "Currently, we source 67% of our ingredients from natural origins, and 100% of them are vegan.\n\nTo contribute to the extended shelf life of our products (and therefore reduce waste), we incorporate some additional safe ingredients, such as glycerin.\n\nIngredients: Water, Cocamidopropyl Betaine, Sodium C14-16 Olefin Sulfonate, Phenoxyethanol, Salicylic Acid, Glycerin, Urea, Cucurbita Pepo Seed Extract, Cucurbita Maxima Fruit Extract, Bacillus Ferment, Niacinamide, Aloe Barbadensis Leaf Juice, Ethylhexylglycerin, Panthenol, Allantoin, Cymbopogon Flexuosus Oil, Eugenia Caryophyllus Flower Oil, Eugenia Caryophyllus Oil, Thymus Vulgaris Oil, Melaleuca Alternifolia Oil, Juniperus Virginiana Oil, Lavandula Officinalis Oil, Cinnamomum Zeylanicum Oil, C12-14 Pareth-3, Caprylyl Glycol, Phenoxyethanol, Quaternium-22, Cetearyl Alcohol, Linoleic Acid, Oleic Acid, Poloxamer 407, Polysorbate 80, Polyvinyl Alcohol, PPG-15 Stearyl Ether, Sodium Bicarbonate, Steareth-2, Steareth-21, Stearic Acid, and Propylene Glycol. These components are carefully selected to ensure the stability of natural ingredients. Patents VB-01, VB-02, VB-03 are the culmination of 10 years of dedicated research.",
        },
        {
          question: "Is Good.inc safe for Pregnant Women? And for my young children?",
          answer:
            "While our cleanser contains salicylic acid, our concentration (between 0.12% and 0.54%) is well below the recommended limit of 2% for pregnant women.\n\nThe Good.inc system is suitable for all ages, including mothers during pregnancy and breastfeeding.\n\nCommon deodorants contain harsh chemicals and block pores in a way that can be harmful to children. The less children are exposed to common deodorants and antiperspirants, the better for their health.\n\nGood.inc products contain natural ingredients and are dermatologically tested and approved by SkinDeep EWG®.\n\nInstead of blocking pores, Good.inc addresses the root cause by safely eliminating the transfer of harmful odor-causing bacteria, making it safe for children and all skin types, including the most sensitive.\n\nThe technology has been tested on thousands of people, including pregnant women, and on other body areas (intimate region and feet), undergoing rigorous international testing, patents, high-level scientific articles, and has more safety tests than normally required by regulatory bodies such as Anvisa and FDA.",
        },
        {
          question: "Does Good.inc help control excessive sweating?",
          answer:
            "Excessive sweating is usually a consequence of damage caused by common antiperspirants. Their main mechanism of action is to block pores. This causes your lymphatic system to become overloaded and produce more sweat.\n\nThis reaction can also be caused by the use of body moisturizers, oils, and butters.\n\nSweat reduction, therefore, can take months or years as your body readjusts to a more natural and healthy way of managing odor.\n\nIn some cases, however, the damage may be irreversible - that's why it's better to change as soon as possible!",
        },
        {
          question: "Does Good.inc have fragrance?",
          answer:
            "The fragrance in our products comes from natural active ingredients like Melaleuca but dissipates quickly, leaving a neutral odor.",
        },
        {
          question: "Can Good.inc irritate my skin?",
          answer:
            "If you use the deodorant individually in the long term, allergic reactions will occur as it was designed to work in conjunction with the complete system.",
        },
        {
          question: "Traditional deodorants are unhealthy?",
          showInFAQ: false,
          answer:
            "Body odor begins when bacteria is transferred to your skin from contaminated clothing.\n\nTraditional deodorants trap bacteria in pores, disrupting hormonal balance. In response, the body increases sweat production to clear the pores.\n\nThese deodorant residues, along with bacteria, are transferred back to clothing. Without natural predators on the fabric fibers, bacteria thrive by forming durable biofilms that are nearly impossible to remove after some hours of wear, perpetuating an unhealthy cycle of skin recontamination.\n\nBacteria can adapt to chemicals, including antibiotics, within days. This means that merely trying to switch between deodorants to kill bacteria is not a healthy solution.\n\nInstead, the focus should shift to identifying and eliminating the root source of contamination: clothing.",
        },
        {
          question: "Is harmful to reduce sweat artificially?",
          showInFAQ: false,
          answer:
            "Sweat is vital to our body's cooling system, but using products to manage sweat and odor can have hidden consequences. Balancing sweat management with maintaining the body's natural ability to regulate temperature is essential for overall health.\n\nWhen the body's primary sweat zones are blocked by deodorants, antiperspirants, bacteria and residues, the lymphatic system becomes overloaded, forcing sweat to redirect to less common areas like the back, forehead, hands, groin, and feet.\n\nThis disruption is much like a computer's cooling system failing — causing the brain, our 'processor,' to overheat. The effects include diminished mental capacity, heightened anxiety, and slowed cognitive functions, highlighting the deep connection between physical and mental health.",
        },
      ],
    },
    footer: {
      quickLinks: "Quick Links",
      information: "Information",
      contact: "Contact",
      paymentMethods: "Payment Methods",
      copyright: "© 2025, Patent Pending. Visto.bio.",
      address: "1007 N Orange St. 4th Floor, Wilmington, DE 19801, USA.",
    },

    healthyClean: {
      title: "ALL YOUR HYGIENE NEEDS IN ONE COMPLETE SYSTEM",
      cards: [
        {
          title: "Aluminum-free formulation",
          description: "Bioproduced in Brazil.\nManufactured in California.",
        },
        {
          title: "Tested globally",
          description:
            "Tested successfully over 5 years on more than 60,000 people across 13 countries, representing diverse skin types and climates.",
        },
        {
          title: "Eco-friendly packaging",
          description: "Our packaging uses oxygen rather than gas and is 100% recyclable.",
        },
      ],
    },
    weeklyProgress: {
      week: "Week",
      descriptions: [
        "Adapt to this new system",
        "Clothes retain comfortable & fresh for longer",
        "Your skin's healthy scent blooms naturally",
        "Skin becomes healthier and more even",
        "Your inner balance and confidence heighten",
      ],
    },
  },
  pt: {
    redeemButton: {
      text: "Primeiro Mês Grátis",
      price: "R$299/mês",
      noCard: "Não necessita de cartão de crédito",
      errors: {
        phoneStartWith9: "O número deve começar com 9",
        phoneLength: "O número deve ter 9 dígitos"
      },
      modal: {
        titles: {
          personalData: "Dados Pessoais",
          shippingAddress: "Endereço de Entrega",
          profile: "Perfil",
          thanks: "Obrigado!"
        },
        form: {
          firstName: "Nome",
          lastName: "Sobrenome",
          email: "E-mail",
          phone: "Telefone",
          cpf: "CPF",
          confirmData: "Próximo",
          finishOrder: "Finalizar Pedido",
          street: "Endereço",
          number: "Número",
          complement: "Apartamento, complemento, etc.",
          neighborhood: "Bairro",
          city: "Cidade",
          state: "Estado",
          zipCode: "CEP",
          country: "País"
        },
        questions: [
          {
            id: "clothes_odor",
            question: "Você percebe que algumas roupas exalam mais odor que outras?",
            options: [
              { value: "yes", label: "Sim" },
              { value: "no", label: "Não" }
            ]
          },
          {
            id: "product_understanding",
            question: "Você entende que tratar os tecidos é fundamental para sua saúde?",
            options: [
              { value: "yes", label: "Sim" },
              { value: "no", label: "Não" }
            ]
          },
          {
            id: "main_focus",
            question: "Qual é seu foco principal?",
            options: [
              { value: "longevity", label: "Longevidade" },
              { value: "problem_solving", label: "Problema Odor/Suor" }
            ]
          }
        ],
        success: {
          message: "Seu pedido foi recebido com sucesso. Nossa equipe entrará em contato em breve através do e-mail cadastrado com mais informações.",
          close: "Fechar"
        },
        existingCustomer: {
          message: "Identificamos que você já é cliente Good.inc. Esta promoção é exclusiva para novos clientes. Se acredita que isso é um erro, entre em contato com nossa equipe de ",
          supportLink: "suporte por email",
          messageSuffix: ".",
          supportEmail: "support@vistobio.zendesk.com"
        }
      }
    },
    countrySelector: {
      label: "DDD",
      defaultCountry: "+55",
      search: "Buscar país"
    },
    hero: {
      title: "SISTEMA DE CUIDADOS PESSOAIS MAIS DO QUE LIMPO — SAUDÁVEL",
    },
    benefits: {
      title: "Benefícios",
      items: [
        "Reduz desequilíbrio de hormônios, estresse, risco de inflamação dos linfonodos, manchas de pele e envelhecimento precoce",
        "Promove a renovação celular e equilíbrio do sistema imunológico",
        "Mantém cheiro e sensação de banho tomado durante o dia todo",
      ],
    },
    products: {
      treatment: {
        name: "TRATAMENTO",
        volume: "177mL (6 FL OZ)",
        description: "A CAMINHO DO CESTO DE ROUPA SUJA",
        why: "Melhora o processo de lavagem, ajudando suas roupas a ficarem mais limpas e permitindo que o Protetor se ligue às fibras.",
        directions:
          "Antes de jogar as roupas no cesto de roupa suja, borrife o Tratamento em todas as toalhas e no interior das roupas, focando nas áreas em contato com a pele, suor e fluidos corporais.",
        explanation:
          "As máquinas de lavar não conseguem remover os micróbios das fibras.\n\nOs higienizadores de tecidos não conseguem matar completamente todos os germes, impedir seu crescimento em roupas limpas ou impedir que contaminem sua pele.",
        faqTitle: "O que há de errado com minha máquina de lavar?",
      },
      protector: {
        name: "PROTETOR",
        volume: "177mL (6 FL OZ)",
        description: "A CAMINHO DA SECAGEM",
        why: "Limita o crescimento bacteriano nos tecidos, protegendo assim sua pele da contaminação.",
        directions:
          "Após a lavagem, borrife o interior de cada peça úmida, incluindo roupas íntimas e toalhas, ao movê-las da máquina de lavar para a secadora ou ao colocá-las para secar ao ar livre. Alternativamente, você pode borrifar as peças antes de pendurá-las no armário ou dobrá-las para guardar nas gavetas.",
        explanation:
          "O verdadeiro problema não é o seu corpo — é o seu sistema.\n\nOs tecidos podem introduzir micróbios nocivos em sua pele diariamente, principalmente quando você se seca com uma toalha contaminada ou usa roupas que carregam micróbios.\n\nSeu sistema mantém você em um ciclo interminável e não saudável, dependente de produtos que bloqueiam os poros, matam bactérias e mascaram o problema com fragrâncias.",
        faqTitle: "O que há de errado com meu sistema?",
      },
      cleanser: {
        name: "Sabonete",
        volume: "177mL (6 FL OZ)",
        description: "NO BANHO",
        why: "Quebra as células mortas da pele, mantém os poros limpos e equilibra o pH da pele, melhorando assim a função dos receptores sensoriais da pele e ajudando a reduzir o suor.",
        directions:
          "Enxágue seu corpo com água. Aplique o produto na palma da mão, massageie por todo o corpo, deixe agir brevemente para uma limpeza mais profunda e depois enxágue completamente. Antes de sair do chuveiro ou usar outros produtos, cheire sua pele. Se não tiver um cheiro neutro, repita o processo. Seque-se com uma toalha limpa tratada com o sistema Good.inc para manter os micróbios longe da sua pele.",
        explanation:
          "Os limpadores não removem os micróbios alojados dentro de seus poros, por isso requerem fragrâncias para mascará-los.\n\nAlém disso, eles deixam resíduos que afetam seus receptores sensoriais.",
        faqTitle: "O que há de errado com meu limpador?",
      },
      deodorant: {
        name: "DESODORANTE",
        volume: "30mL (1 FL OZ)",
        description: "APÓS O BANHO",
        why: "Em uso sinérgico com as outras partes do sistema, ele limita o crescimento bacteriano na pele, mantendo sua pele naturalmente mais clara, macia como a de um bebê e com cheiro limpo, sem deixar vestígios na sua pele ou roupas.",
        directions:
          "Dependendo da intensidade do dia e do tipo de roupa, opcionalmente borrife uma pequena quantidade uma vez por dia na pele limpa e seca após secar-se com uma toalha tratada, e então vista roupas tratadas com o sistema Good.inc também.",
        explanation:
          "Desodorantes, mesmo os naturais, entopem seus poros e prendem micróbios dentro, desequilibrando hormônios e aumentando a produção de suor a longo prazo.",
        faqTitle: "O que há de errado com meu desodorante?",
      },
    },
    faq: {
      title: "Perguntas Frequentes",
      questions: [
        {
          question: "Os produtos Good.inc são projetados para matar ou remover bactérias?",
          answer:
            "Nossos produtos foram desenvolvidos para limitar o crescimento bacteriano. Eles não são projetados para matar ou remover bactérias.",
        },
        {
          question: "O que devo fazer se estiver experimentando odor na pele ou problemas íntimos?",
          answer:
            "Se você estiver experimentando odor na pele ou problemas íntimos, é recomendado que você trate seus tecidos com água oxigenada e água quente por 5 minutos e depois esfregue manualmente a parte afetada do tecido. Termine lavando em ciclo pesado com água quente para higienizar. Se o problema persistir, considere descartar a peça de roupa.",
        },
        {
          question: "Quais são os ingredientes no sistema Good.inc?",
          answer:
            "Atualmente, obtemos 67% de nossos ingredientes de origem natural e 100% deles são veganos.\n\nPara contribuir com a vida útil prolongada de nossos produtos (e, portanto, reduzir o desperdício), incorporamos alguns ingredientes adicionais seguros, como glicerina.\n\nIngredientes: Água, Cocamidopropil Betaína, Olefina Sulfonato de Sódio C14-16, Fenoxietanol, Ácido Salicílico, Glicerina, Ureia, Extrato de Semente de Cucurbita Pepo, Extrato de Fruta de Cucurbita Maxima, Fermento de Bacillus, Niacinamida, Suco de Folha de Aloe Barbadensis, Etilexilglicerina, Pantenol, Alantoína, Óleo de Cymbopogon Flexuosus, Óleo de Flor de Eugenia Caryophyllus, Óleo de Eugenia Caryophyllus, Óleo de Thymus Vulgaris, Óleo de Melaleuca Alternifolia, Óleo de Juniperus Virginiana, Óleo de Lavandula Officinalis, Óleo de Cinnamomum Zeylanicum, C12-14 Pareth-3, Caprylyl Glycol, Fenoxietanol, Quaternium-22, Álcool Cetearílico, Ácido Linoleico, Ácido Oleico, Poloxamer 407, Polissorbato 80, Álcool Polivinílico, PPG-15 Éter Estearílico, Bicarbonato de Sódio, Esteareth-2, Esteareth-21, Ácido Esteárico e Propilenoglicol. Esses componentes são cuidadosamente selecionados para garantir a estabilidade dos ingredientes naturais. As patentes VB-01, VB-02, VB-03 são o resultado de 10 anos de pesquisa dedicada.",
        },
        {
          question: "Good.inc é seguro para Grávidas? E para meus filhos pequenos?",
          answer:
            "O sabonete contém ácido salicílico, porém nossa concentração, entre 0,12% e 0,54%, está bem abaixo do limite recomendado de 2% para gestantes.\n\nO sistema Good.inc é adequado para todas as idades inclusive mães na gestação e amamentação.\n\nDesodorantes comuns contêm produtos químicos agressivos e bloqueiam os poros de uma maneira que pode ser prejudicial para as crianças. Quanto menos as crianças são expostas a desodorantes e antitranspirantes comuns, melhor para a saúde delas.\n\nOs produtos Good.inc contêm ingredientes naturais e são testados dermatologicamente e aprovados pelo SkinDeep EWG®.\n\nEm vez de bloquear os poros, Good.inc age na raiz do problema eliminando a transferência de bactérias prejudiciais que causam odor, de uma maneira segura para as crianças e qualquer pele, inclusive as mais sensíveis.\n\nA tecnologia foi testada em milhares pessoas dentre grávidas, gestantes e em outras partes do corpo (região íntima e pés), passando por rigorosos testes internacionais, patentes, artigos científicos de alto nível e possui mais testes de segurança do que os normalmente exigidos por órgãos reguladores como Anvisa e FDA.",
        },
        {
          question: "Good.inc ajuda a controlar a transpiração excessiva?",
          answer:
            "A transpiração excessiva é geralmente uma consequência do dano causado pelos antitranspirantes comuns. Seu principal mecanismo de ação é bloquear os poros. Isso faz com que seu sistema linfático fique sobrecarregado e produza mais suor.\n\nEssa reação também pode ser causada pelo uso de hidratantes corporais, óleos e manteigas.\n\nA redução do suor, portanto, pode levar meses ou anos à medida que seu corpo se readapta a uma forma mais natural e saudável de gerenciar o odor.\n\nEm alguns casos, no entanto, o dano pode ser irreversível - por isso é melhor mudar o mais rápido possível!",
        },
        {
          question: "Good.inc tem fragrância?",
          answer:
            "A fragrância dos produtos são dos próprios ativos naturais como a Melaleuca mas se dissipam rapidamente ficando com odor neutro.",
        },
        {
          question: "Good.inc pode irritar minha pele?",
          answer:
            "Caso você utlize o desodorante individualmente no longo prazo irá ocorrer reações alérgicas pois ele foi projetado para trabalhar em conjunto com o sistema completo.",
        },
        {
          question: "Desodorantes tradicionais são prejudiciais?",
          showInFAQ: false,
          answer:
            "O odor corporal começa quando as bactérias são transferidas para sua pele a partir de roupas contaminadas.\n\nDesodorantes tradicionais prendem bactérias nos poros, perturbando o equilíbrio hormonal. Em resposta, o corpo aumenta a produção de suor para limpar os poros.\n\nEsses resíduos de desodorante, junto com as bactérias, são transferidos de volta para as roupas. Sem predadores naturais nas fibras do tecido, as bactérias prosperam formando biofilmes duráveis que são quase impossíveis de remover após algumas horas de uso, perpetuando um ciclo insalubre de recontaminação da pele.\n\nAs bactérias podem se adaptar a produtos químicos, incluindo antibióticos, em questão de dias. Isso significa que apenas tentar alternar entre desodorantes para matar bactérias não é uma solução saudável.\n\nEm vez disso, o foco deve mudar para identificar e eliminar a fonte raiz da contaminação: as roupas.",
        },
        {
          question: "É prejudicial reduzir o suor artificialmente?",
          showInFAQ: false,
          answer:
            "O suor é vital para o sistema de resfriamento do nosso corpo, mas usar produtos para gerenciar o suor e o odor pode ter consequências ocultas. Equilibrar o gerenciamento do suor com a manutenção da capacidade natural do corpo de regular a temperatura é essencial para a saúde geral.\n\nQuando as principais zonas de transpiração do corpo são bloqueadas por desodorantes, antitranspirantes, bactérias e resíduos, o sistema linfático fica sobrecarregado, forçando o suor a se redirecionar para áreas menos comuns como as costas, testa, mãos, virilha e pés.\n\nEssa perturbação é muito parecida com a falha do sistema de resfriamento de um computador — fazendo com que o cérebro, nosso 'processador', superaqueça. Os efeitos incluem diminuição da capacidade mental, aumento da ansiedade e funções cognitivas mais lentas, destacando a profunda conexão entre saúde física e mental.",
        },
      ],
    },
    footer: {
      quickLinks: "Links Rápidos",
      information: "Informações",
      contact: "Contato",
      paymentMethods: "Formas de Pagamento",
      copyright: "© 2025, Patente Pendente. Visto.bio.",
      address: "São Paulo: Rua Finisterre, 159, Riviera - SP, 04928030, CNPJ 32.761.719/0001-31"
    },
    healthyClean: {
      title: "TODAS AS SUAS NECESSIDADES DE HIGIENE EM UM SISTEMA COMPLETO",
      cards: [
        {
          title: "Formulação livre de alumínio",
          description: "Bioproduzido no Brasil.\nFabricado na Califórnia."
        },
        {
          title: "Testado globalmente",
          description: "Testado com sucesso por mais de 5 anos em mais de 60.000 pessoas em 13 países, representando diversos tipos de pele e climas."
        },
        {
          title: "Embalagem ecológica",
          description: "Nossa embalagem usa oxigênio em vez de gás e é 100% reciclável."
        }
      ]
    },
    weeklyProgress: {
      week: "Semana",
      descriptions: [
        "Você repensa seus hábitos e se adapta a este novo sistema",
        "As roupas mantêm sua frescura e conforto naturais por mais tempo",
        "O aroma saudável da sua pele floresce naturalmente",
        "A pele fica mais saudável e uniforme do que antes",
        "Seu equilíbrio interno e confiança aumentam"
      ]
    }
  },
}

export default translations

