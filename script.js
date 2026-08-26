// configs basicas
const alfabeto = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ ,.';
const tamanhoPagina = 3200;

let textoDestaque = '';
let cache = {};

// gera um numero unico pra cada coordenada
function hash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        h = ((h << 5) - h) + str.charCodeAt(i);
        h = h & h;
    }
    return h;
}

// gera codigo aleatorio
function gerarCodigo(tamanho = 8) {
    let codigo = '';
    const chars = '0123456789abcdef';
    for (let i = 0; i < tamanho; i++) {
        codigo += chars[Math.floor(Math.random() * chars.length)];
    }
    return codigo;
}

// monta o texto do volume
function montarVolume(cam, par, prat, vol, inserir = null) {
    const seed = hash(`${cam}-${par}-${prat}-${vol}`);
    let texto = '';
    let rng = seed;

    const proxChar = () => {
        rng = (rng * 16807) % 2147483647;
        return alfabeto[Math.abs(rng) % alfabeto.length];
    };

    if (inserir) {
        const pos = 400 + (Math.abs(seed) % 1200);
        
        for (let i = 0; i < pos; i++) {
            texto += proxChar();
        }
        
        texto += inserir;
        
        for (let i = pos + inserir.length; i < tamanhoPagina; i++) {
            texto += proxChar();
        }
    } else {
        for (let i = 0; i < tamanhoPagina; i++) {
            texto += proxChar();
        }
    }

    return texto;
}

// atualiza a tela
function abrirPagina() {
    const cam = document.getElementById('camara').value || '4a8b1c0d';
    let par = parseInt(document.getElementById('parede').value) || 1;
    let prat = parseInt(document.getElementById('prateleira').value) || 1;
    let vol = parseInt(document.getElementById('volume').value) || 1;

    // valida limites
    if (par < 1) par = 1;
    if (par > 4) par = 4;
    if (prat < 1) prat = 1;
    if (prat > 5) prat = 5;
    if (vol < 1) vol = 1;
    if (vol > 32) vol = 32;

    // atualiza os campos com valores validos
    document.getElementById('parede').value = par;
    document.getElementById('prateleira').value = prat;
    document.getElementById('volume').value = vol;

    const el = document.getElementById('conteudo');
    const info = document.getElementById('info');

    el.style.opacity = '0.3';
    el.innerText = 'Carregando...';

    setTimeout(() => {
        let textoInserir = null;
        const chave = `-${cam}-${par}-${prat}-${vol}`;
        
        for (const k in cache) {
            if (k.includes(chave)) {
                textoInserir = cache[k];
                break;
            }
        }

        let conteudo = montarVolume(cam, par, prat, vol, textoInserir);

        if (textoDestaque) {
            const regex = new RegExp(textoDestaque.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
            conteudo = conteudo.replace(regex, `<span class="destacado">${textoDestaque}</span>`);
            textoDestaque = '';
            el.innerHTML = conteudo;
        } else {
            el.innerText = conteudo;
        }

        el.style.opacity = '1';
        info.innerText = `Câmara ${cam} / Parede ${par} / Prateleira ${prat} / Volume ${vol}`;
    }, 200);
}

// coordenadas aleatorias
function aleatorio() {
    document.getElementById('camara').value = gerarCodigo(8);
    document.getElementById('parede').value = Math.floor(Math.random() * 4) + 1;
    document.getElementById('prateleira').value = Math.floor(Math.random() * 5) + 1;
    document.getElementById('volume').value = Math.floor(Math.random() * 32) + 1;
    abrirPagina();
}

// acha onde o texto ta
function encontrarTexto(txt) {
    const h = hash(txt);
    const cam = Math.abs(h).toString(16).padStart(8, '0').substring(0, 8);
    const par = (Math.abs(h) % 4) + 1;
    const prat = (Math.abs(h >> 8) % 5) + 1;
    const vol = (Math.abs(h >> 16) % 32) + 1;

    const chave = `${txt}-${cam}-${par}-${prat}-${vol}`;
    cache[chave] = txt;

    return { cam, par, prat, vol };
}

// mostra resultado
function mostrarResultado(cam, par, prat, vol) {
    const box = document.getElementById('resultado');
    const coords = document.getElementById('coordenadas');
    const btn = document.getElementById('irPara');

    box.style.display = 'block';
    coords.innerText = `Câmara ${cam} / Parede ${par} / Prateleira ${prat} / Volume ${vol}`;

    btn.onclick = () => {
        document.getElementById('camara').value = cam;
        document.getElementById('parede').value = par;
        document.getElementById('prateleira').value = prat;
        document.getElementById('volume').value = vol;

        const tab = document.querySelector('[data-bs-target="#explorar"]');
        if (tab) tab.click();
        
        abrirPagina();
    };
}

// busca
function buscar() {
    const txt = document.getElementById('textoBusca').value.trim();

    if (!txt) {
        alert('Digite algo pra buscar');
        return;
    }

    textoDestaque = txt;
    const res = encontrarTexto(txt);
    mostrarResultado(res.cam, res.par, res.prat, res.vol);
}

// inicializa
document.addEventListener('DOMContentLoaded', () => {
    // validacao em tempo real
    document.getElementById('parede').addEventListener('blur', function() {
        let val = parseInt(this.value);
        if (isNaN(val) || val < 1) this.value = 1;
        if (val > 4) this.value = 4;
    });

    document.getElementById('prateleira').addEventListener('blur', function() {
        let val = parseInt(this.value);
        if (isNaN(val) || val < 1) this.value = 1;
        if (val > 5) this.value = 5;
    });

    document.getElementById('volume').addEventListener('blur', function() {
        let val = parseInt(this.value);
        if (isNaN(val) || val < 1) this.value = 1;
        if (val > 32) this.value = 32;
    });

    aleatorio();
});
