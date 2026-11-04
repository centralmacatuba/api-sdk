export default {
  lang: "pt-BR",
  title: "@centralmacatuba/api",
  description: "Documentação oficial da SDK JavaScript e TypeScript da API pública da Central Macatuba.",
  lastUpdated: true,
  head: [
    ["link", { rel: "stylesheet", href: "/custom.css" }],
  ],
  themeConfig: {
    siteTitle: "@centralmacatuba/api",
    nav: [
      { text: "Início", link: "/" },
      { text: "Guia", link: "/guide/installation" },
      { text: "Referência", link: "/reference/endpoints" },
      { text: "GitHub", link: "https://github.com/centralmacatuba/api-sdk" },
    ],
    sidebar: {
      "/guide/": [
        { text: "Começando", items: [
          { text: "Instalação", link: "/guide/installation" },
          { text: "Primeiros passos", link: "/guide/getting-started" },
          { text: "JavaScript", link: "/guide/javascript" },
          { text: "TypeScript", link: "/guide/typescript" },
        ] },
        { text: "Uso da SDK", items: [
          { text: "Configuração", link: "/guide/configuration" },
          { text: "Cliente e requisições", link: "/guide/client" },
          { text: "Erros e respostas", link: "/guide/errors" },
          { text: "Cancelamento e timeout", link: "/guide/cancellation-timeout" },
          { text: "Cookies e SOS", link: "/guide/cookies-sos" },
        ] },
      ],
      "/reference/": [
        { text: "Referência", items: [
          { text: "Namespaces e endpoints", link: "/reference/endpoints" },
          { text: "Tipos públicos", link: "/reference/types" },
          { text: "Contrato OpenAPI", link: "/reference/openapi" },
          { text: "Endpoints detalhados (OpenAPI)", link: "/reference/openapi-endpoints" },
        ] },
      ],
    },
    search: { provider: "local" },
    socialLinks: [
      { icon: "github", link: "https://github.com/centralmacatuba/api-sdk" },
    ],
    footer: {
      message: "SDK de um projeto independente, sem vínculo institucional com a Prefeitura Municipal de Macatuba.",
      copyright: "Desenvolvido por Desenvolvedor EE (Dev EE).",
    },
  },
};
