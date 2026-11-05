# Publicação e domínio personalizado

A documentação é compilada pelo VitePress e publicada no GitHub Pages pelo workflow `Documentation`. Não é necessário manter uma branch `gh-pages`: o workflow envia o artefato estático diretamente ao Pages.

## Habilitar o GitHub Pages

Antes da primeira publicação:

1. Abra **Settings → Pages** no repositório `centralmacatuba/api-sdk`.
2. Em **Build and deployment → Source**, selecione **GitHub Actions**.
3. Salve a configuração.

O workflow valida as alterações em pull requests e também compila e publica automaticamente quando mudanças relevantes chegam à branch `principal`.

## Domínio personalizado

O domínio configurado no artefato é:

`sdk.centralmacatuba.qzz.io`

O arquivo `docs/public/CNAME` é copiado para a raiz do site durante o build.

Na zona DNS `centralmacatuba.qzz.io`, crie:

| Tipo | Nome | Destino |
|---|---|---|
| CNAME | `sdk` | `centralmacatuba.github.io` |

Recomendação para a primeira configuração: deixe o registro como **DNS only** no Cloudflare até o GitHub Pages validar o domínio e emitir o certificado TLS. Depois da validação, você pode avaliar se deseja ativar o proxy do Cloudflare.

Em **Settings → Pages → Custom domain**, confirme `sdk.centralmacatuba.qzz.io` se o GitHub ainda não o tiver reconhecido pelo arquivo `CNAME`. Aguarde a emissão do certificado e habilite **Enforce HTTPS** quando a opção estiver disponível.

## Fluxo de deploy

1. O workflow instala as dependências da SDK com pnpm 12.12.1.
2. Gera a referência detalhada dos endpoints a partir de `openapi/openapi.json`.
3. Compila a documentação VitePress.
4. Na branch `principal`, configura o Pages e envia o artefato.
5. O job de deploy publica o artefato no ambiente `github-pages`.

Pull requests e branches de trabalho validam o build, mas não publicam o site.
