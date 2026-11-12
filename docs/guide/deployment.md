# Publicação e domínio personalizado

A documentação é compilada pelo VitePress e publicada no GitHub Pages pelo workflow `Documentation`. Não é necessário manter uma branch `gh-pages`: o workflow envia o artefato estático diretamente ao Pages.

## Habilitar o GitHub Pages

Antes da primeira publicação:

1. Abra **Settings → Pages** no repositório `centralmacatuba/api-sdk`.
2. Em **Build and deployment → Source**, selecione **GitHub Actions**.
3. Salve a configuração.

O workflow valida as alterações em pull requests e também compila e publica automaticamente quando mudanças relevantes chegam à branch `principal`.

## Domínio personalizado

O domínio personalizado é:

`sdk.centralmacatuba.qzz.io`

**Antes de criar qualquer registro DNS**, associe o domínio ao repositório:

1. Abra **Settings → Pages** no repositório `centralmacatuba/api-sdk`.
2. Em **Custom domain**, informe `sdk.centralmacatuba.qzz.io` e salve.
3. Aguarde o GitHub Pages aceitar a configuração. Se houver uma etapa de verificação de propriedade do domínio, conclua-a antes de prosseguir.

Essa ordem é importante para associar o domínio à sua conta antes de apontá-lo para o GitHub Pages, reduzindo o risco de apropriação por terceiros.

Após salvar o domínio no GitHub, crie o registro na zona DNS `centralmacatuba.qzz.io`:

| Tipo | Nome | Destino |
|---|---|---|
| CNAME | `sdk` | `centralmacatuba.github.io` |

Na primeira configuração, mantenha o registro como **DNS only** no Cloudflare até o GitHub Pages validar o domínio e emitir o certificado TLS.

Se decidir ativar o proxy do Cloudflare depois dessa validação:

1. Em **SSL/TLS → Overview**, selecione **Full** ou, preferencialmente quando a origem apresentar um certificado válido, **Full (strict)**.
2. **Não use Flexible**: com **Enforce HTTPS** habilitado no GitHub Pages, esse modo pode causar um ciclo de redirecionamentos entre HTTP e HTTPS.
3. Só então altere o registro DNS de **DNS only** para **Proxied** e teste o acesso HTTP e HTTPS.

Se não precisar dos recursos de proxy do Cloudflare, mantenha o registro como **DNS only**.

O arquivo `docs/public/CNAME` mantém o nome do domínio no artefato publicado, mas **não substitui** o cadastro em **Settings → Pages → Custom domain**. Aguarde a emissão do certificado e habilite **Enforce HTTPS** quando a opção estiver disponível.

## Fluxo de deploy

1. O workflow instala as dependências da SDK com pnpm 12.12.1.
2. Gera a referência detalhada dos endpoints a partir de `openapi/openapi.json`.
3. Compila a documentação VitePress.
4. Na branch `principal`, configura o Pages e envia o artefato.
5. O job de deploy publica o artefato no ambiente `github-pages`.

O build é validado em pull requests e branches de trabalho. A publicação do site ocorre apenas na branch `principal`.


## Publicação do pacote npm

A publicação do pacote é independente do deploy da documentação. Antes de habilitar o workflow **Release**, configure o Trusted Publisher no npm para o repositório `centralmacatuba/api-sdk` e o arquivo de workflow `release.yml`. Habilite também **Allow npm publish** na configuração do Trusted Publisher e confirme que o workflow concede `id-token: write`. Em seguida, defina a variável de repositório `NPM_RELEASE_ENABLED=true`. A primeira versão `0.1.0` deve ser publicada pelo workflow com OIDC, não por uma publicação manual prévia.
