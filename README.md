Estou fazendo um aplicativo para alunos ou pessoas que pretendem se inscrever a provas.
Tipo, terá cadastro, login e tudo
Aí, terá uma tela onde aparecerá uma lista vazia. Ao clicar no botão de adicionar, o usuário pode colocar o nome da prova que pretende cadastrar, o dia, e uma pequena descrição, assim ajudando-o a se organizar
Também terá outra tela que mostrará outras provas para poder se cadastrar, tipo o Enem.
Ao clicar o Enem, mostrará o dia, conteúdo que pode ser estudado, e uma descrição. 
E abaixo um link para a pessoa entrar no site de inscrição da prova
Também terá uma seção de configurações, e outra para a pessoa acessar seu perfil


Por enquanto, quero começar com a tela de login e cadastro
Estou usando o firebase com banco de dados



Rodar o app é a parte mais fácil, mas também onde muita gente se atrapalha porque mistura Expo, emulador e Firebase. Vou te dar o passo a passo mais direto possível:

---

### 1. Instale o Expo Go no celular

* **Android/iOS** → Baixa o app **Expo Go** da loja oficial (Google Play / App Store).
  É ele que vai abrir seu app sem precisar de emulador pesado.

---

### 2. Rode o servidor local

No terminal, dentro da pasta do seu projeto (`cd app-provas`), digite:

```bash
npx expo start
```

Isso vai abrir uma tela no terminal com um **QR Code** e também abrir uma página no navegador (`Metro Bundler`).

---

### 3. Conecte o celular

* Escaneie o QR Code usando o **Expo Go** (tem opção dentro do app para escanear).
* O app vai compilar e rodar direto no seu celular.

---

### 4. Rodar no emulador (opcional)

Se não quiser usar o celular:

* **Android** → precisa instalar o Android Studio e rodar um emulador.
* **iOS (Mac)** → precisa do Xcode.

No terminal, basta apertar:

```bash
a   # abre emulador Android
i   # abre emulador iOS (só no Mac)
```

---

### 5. Testar se o Firebase funciona

Quando abrir o app, tente **criar uma conta** na tela de cadastro.
Se tudo estiver certo, o Firebase Authentication deve registrar o usuário.
Você pode confirmar no [Firebase Console → Authentication](https://console.firebase.google.com/) para ver se o email apareceu.

---

Em resumo:

* `npx expo start` → gera QR.
* Abre no celular pelo **Expo Go**.
* Testa login/cadastro.

---

Quer que eu te mostre como criar uma **tela inicial protegida**, que só aparece se o usuário estiver logado, e impedir acesso ao resto do app se não estiver autenticado? Isso seria o próximo passo lógico depois do login/cadastro.
