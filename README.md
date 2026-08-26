# Biblioteca de Babel

Versão web do conto "A Biblioteca de Babel" de Jorge Luis Borges.

## Conceito

A Biblioteca de Babel é uma biblioteca fictícia criada pelo escritor argentino Jorge Luis Borges, conhecida por sua dimensão praticamente infinita e pela enorme quantidade de livros que possui. A biblioteca está dividida em câmaras hexagonais, cada uma com 4 paredes de estantes, cinco prateleiras por parede e 32 volumes por prateleira.

Como o sistema gera todas as combinações possíveis de letras, QUALQUER TEXTO que você pensar já existe em algum lugar da biblioteca. Seu nome, sua vida, poemas que ninguém escreveu ainda, tudo.

## Como funciona

### As seeds

O segredo é que o projeto não armazena nenhum texto. Ele usa um truque matemático bem inteligente.

Quando você digita uma coordenada (câmara 4a8b1c0d, parede 2, prateleira 3, volume 12), o código pega esses valores e transforma em um número único. Esse processo se chama "hash".

```
4a8b1c0d-2-3-12 → função hash → 1847293847 (exemplo)
```

Esse número funciona como uma "seed" (semente). É tipo plantar uma árvore: a mesma semente sempre vai gerar a mesma árvore. A partir dessa seed, o código gera 3200 caracteres de texto de forma determinística. "Determinística" significa que sempre que você usar essa mesma seed, vai gerar exatamente o mesmo texto.

### O gerador de caracteres

O código usa uma fórmula matemática chamada LCG (Linear Congruential Generator). É tipo assim:

1. Pega a seed inicial
2. Multiplica por 16807
3. Divide por 2147483647 e pega o resto
4. Usa esse resultado pra escolher uma letra do alfabeto
5. Repete o processo 3200 vezes

O resultado parece aleatório, mas não é. É sempre o mesmo pra mesma seed.


### Por que isso é eficiente?

Imagina se você quisesse salvar todas as páginas possíveis num banco de dados. Seria impossível. Mas com esse método, você gera qualquer página na hora, sem ocupar espaço nenhum em disco.

É tipo a diferença entre guardar um vídeo de 1GB ou guardar a fórmula matemática que desenha cada frame do vídeo.

## Como cada função funciona

### Explorar (navegação manual)

Quando você clica em "Abrir":

1. O código pega os 4 valores que você digitou
2. Junta eles numa string tipo "abc123-2-3-15"
3. Passa pela função hash pra virar um número
4. Usa esse número como seed pro gerador
5. Gera 3200 caracteres
6. Mostra na tela

Se você fechar o navegador e voltar amanhã com as mesmas coordenadas, vai ver exatamente o mesmo texto. Isso acontece porque a matemática é sempre igual.

### Aleatório

O botão "Aleatório" é o mais simples:

1. Gera um código hexadecimal aleatório para o nome da câmara
2. Sorteia um número de 1 a 4 para a parede
3. Sorteia um número de 1 a 5 para a prateleira  
4. Sorteia um número de 1 a 32 para o volume
5. Chama a função de abrir com essas coordenadas


### Buscar texto

Quando você digita um texto pra buscar:

1. O código calcula o hash do seu texto (tipo "isabela" → 8374829)
2. Usa partes diferentes desse número pra criar coordenadas:
   - Os primeiros bits viram o código da câmara
   - Outros bits viram o número da parede (resto da divisão por 4, +1)
   - Mais bits viram a prateleira (resto por 5, +1)
   - Últimos bits viram o volume (resto por 32, +1)

3. Marca essa localização como "especial" 
4. Quando você abre aquela página, o código injeta seu texto numa posição específica do conteúdo gerado

Não é exatamente que o texto "já existia lá". O código garante que quando você procurar por ele, vai gerar uma página que contenha aquele texto.

É tipo o paradoxo de Schrödinger: o texto só "existe" quando você observa (busca por ele).

Mas ainda assim é uma metáfora perfeita pro conto do Borges, porque matematicamente falando, TODAS as combinações possíveis de caracteres podem ser geradas. Só que você precisaria saber exatamente qual coordenada acessar.

### Cache de buscas

O sistema guarda num objeto JavaScript qual texto você procurou e onde ele foi "colocado". Quando você volta naquela coordenada, ele sabe que precisa inserir aquele texto de novo no mesmo lugar.

É tipo um mapa: `{ "isabela-4a8b1c0d-2-3-12": "isabela" }`


## Tecnologias

- HTML
- CSS
- JavaScript
- Bootstrap 5 pra UI