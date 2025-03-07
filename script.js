async function carregarBlocos() {
    try {
        const response = await fetch('pautas.json')
        if (!response.ok) {
            throw new Error('Erro ao carregar o arquivo JSON')
        }
        return await response.json()
    } catch (error) {
        console.error('Erro ao carregar ou processar o arquivo JSON:', error)
        return []
    }
}

function criarCardPauta(pauta) {
    const cartao = document.createElement('div');
    cartao.classList.add('cartao');

    const img = document.createElement('img');
    img.src = `imagens/${pauta.imagem}`;
    img.alt = pauta.nome;
    img.classList.add('cartaoImagem');
    cartao.appendChild(img);

    const nome = document.createElement('h3');
    nome.classList.add('cartaoNome');
    nome.textContent = pauta.nome;
    cartao.appendChild(nome);

    // Se favorito, altera a classe
    if (pauta.favorito) {
        cartao.classList.add('favorito');
    }

    cartao.addEventListener('click', () => {
        abrirModal(pauta);
    });

    return cartao;
}

function criarCartaoAdicionar() {
    const cartao = document.createElement('div')
    cartao.classList.add('cartao', 'adicionar-cartao')

    const img = document.createElement('img')
    img.src = 'imagens/adicionar.png'
    img.alt = 'Adicionar'
    img.classList.add('cartaoImagem')
    cartao.appendChild(img)

    const texto = document.createElement('p')
    texto.textContent = 'Adicionar nova pauta'
    texto.classList.add('texto-adicionar')
    cartao.appendChild(texto)

    cartao.addEventListener('click', () => {
        abrirModalAdicionar()
    })

    return cartao
}

function gerarCartas(pautas, categoria) {
    const container = document.getElementById('container')
    container.innerHTML = ''
    container.appendChild(criarCartaoAdicionar())

    const pautasFiltradas = pautas.filter(pauta => pauta.categoria === categoria)

    pautasFiltradas.forEach(pauta => {
        const cartao = criarCardPauta(pauta)
        container.appendChild(cartao)
    })

    ajustarTamanhoCarta()
}

async function exibirBlocos() {
    try {
        const pautas = await carregarBlocos()
        gerarCartas(pautas, 'pautas')
    } catch (error) {
        console.error("Erro ao carregar as pautas:", error)
    }
}

// Função para ajustar o tamanho dos cards conforme a tela
function ajustarTamanhoCarta() {
    const screenWidth = window.innerWidth
    const cards = document.querySelectorAll('.cartao')

    cards.forEach(card => {
        if (screenWidth > 1080) {
            card.style.width = 'calc(25% - 80px)'
        } else if (screenWidth > 720) {
            card.style.width = 'calc(33% - 80px)'
        } else if (screenWidth > 450) {
            card.style.width = 'calc(50% - 80px)'
        } else {
            card.style.width = 'calc(100% - 80px)'
        }
    })
}

// Alternar abas
function showCategory(categoria) {
    const buttons = document.querySelectorAll('.tab-button')
    buttons.forEach(button => button.classList.remove('active'))

    const activeButton = document.querySelector(`.tab-button[data-category="${categoria}"]`)
    if (activeButton) {
        activeButton.classList.add('active')
    }

    exibirCategoria(categoria)
}

function exibirCategoria(categoria) {
    carregarBlocos().then(pautas => gerarCartas(pautas, categoria))
}

// Funções para abrir e fechar as modais
function abrirModal(pauta) {
    document.getElementById('modalNome').textContent = pauta.nome
    document.getElementById('modalImagem').src = `imagens/${pauta.imagem}`
    document.getElementById('pautasModal').style.display = 'flex'
}

function fecharModal() {
    document.getElementById('pautasModal').style.display = 'none';
}

// Fechar modais ao clicar fora de qualquer uma delas
window.addEventListener('click', event => {
    const modalPauta = document.getElementById('pautasModal');
    
    // Fechar o modal de pauta ao clicar fora dele
    if (event.target === modalPauta) {
        fecharModal();
    }

})



// Função para buscar a primeira pauta
async function fetchPauta() {
    try {
        // Faz a requisição para o endpoint da API
        const response = await fetch('https://servidor-pautas.vercel.app/api/getPautas');
        
        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error('Erro ao buscar os dados da pauta');
        }

        // Converte a resposta para JSON
        const pauta = await response.json();

        // Exibe os dados da pauta no console
        console.log('Dados da pauta:', pauta);

        /*
        // Atualiza a interface do usuário (exemplo básico)
        document.getElementById('nome').textContent = pauta.nome;
        document.getElementById('imagem').src = `/imagens/${pauta.imagem}`;
        document.getElementById('categoria').textContent = pauta.categoria;
        document.getElementById('favorito').textContent = pauta.favorito ? 'Favorito: Sim' : 'Favorito: Não';
        */
    } catch (error) {
        console.error('Erro:', error);
    }
}













//##########################################
//Inicialização
window.onload = function() {
    showCategory('pautas')
    exibirBlocos()
    fetchPauta()
}
window.addEventListener('resize', ajustarTamanhoCarta)







