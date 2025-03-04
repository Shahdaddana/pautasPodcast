async function carregarBlocos() {
    try {
        const response = await fetch('pautas.json')
        if (!response.ok) {
            throw new Error('Erro ao carregar o arquivo JSON')
        }
        const data = await response.json()
        
        const receitas = data.pautas // Acessa o array de receitas dentro da chave 'pautas'
        return receitas
    } catch (error) {
        console.error('Erro ao carregar ou processar o arquivo JSON:', error)
        return []
    }
}

function gerarCartas(receitas, categoria) {
    const container = document.getElementById('container')
    container.innerHTML = '' // Limpa o container antes de gerar novos cards

    // Filtra as receitas pela categoria selecionada
    const receitasFiltradas = receitas.filter(receita => receita.categoria === categoria)

    receitasFiltradas.forEach(receita => {
        // Criando os elementos HTML dinamicamente
        const card = document.createElement('div')
        card.classList.add('food-card')

        const img = document.createElement('img')
        img.src = `imagens/${receita.imagem}` // Adiciona o caminho da pasta "imagens"
        img.alt = receita.nome
        img.classList.add('food-image')

        const nome = document.createElement('h3')
        nome.classList.add('food-name')
        nome.textContent = receita.nome

        // Adiciona a classe 'favorite' se a receita for favorita
        if (receita.favorito) {
            card.classList.add('favorite')
        }

        // Adicionando a imagem e o nome ao card
        card.appendChild(img)
        card.appendChild(nome)

        // Evento de clique no card para abrir a modal
        card.addEventListener('click', () => {
            abrirModal(receita)
        })

        // Adicionando o card ao container
        container.appendChild(card)
    })

    // Chama a função de ajuste de tamanho após gerar os cards
    ajustarTamanhoCarta()
}

async function exibirBlocos() {
    try {
        const receitas = await carregarBlocos() // Espera a promessa de carregarBlocos ser resolvida
        gerarCartas(receitas, 'pautas') // Exibe a categoria "pautas" por padrão
    } catch (error) {
        console.error("Erro ao carregar as pautas:", error)
    }
}

// Função para ajustar o tamanho dos cards conforme o tamanho da tela
function ajustarTamanhoCarta() {
    const screenWidth = window.innerWidth
    const cards = document.querySelectorAll('.food-card') // Seleciona todos os cartões

    // Define os tamanhos dos cartões de acordo com a largura da tela
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

// Função para alternar entre as abas
function showCategory(categoria) {
    // Remover a classe 'active' de todos os botões
    const buttons = document.querySelectorAll('.tab-button')
    buttons.forEach(button => {
        button.classList.remove('active')
    })

    // Adicionar a classe 'active' ao botão clicado
    const activeButton = document.querySelector(`.tab-button[data-category="${categoria}"]`)
    activeButton.classList.add('active')

    // Exibir as receitas com base na categoria selecionada
    exibirCategoria(categoria)
}

// Função para exibir as receitas de acordo com a categoria
function exibirCategoria(categoria) {
    carregarBlocos().then(receitas => gerarCartas(receitas, categoria))
}

// Função para abrir a modal com as informações da receita
function abrirModal(receita) {
    const modal = document.getElementById('receitaModal')

    document.getElementById('modalNome').textContent = receita.nome
    document.getElementById('modalImagem').src = `imagens/${receita.imagem}`
    
    modal.style.display = 'flex'
}

function fecharModal() {
    const modal = document.getElementById('receitaModal')
    modal.style.display = 'none'
}

// Fechar a modal quando clicar no botão de fechar ou fora do conteúdo
document.querySelector('.close').addEventListener('click', fecharModal) 
window.addEventListener('click', event => {
    const modal = document.getElementById('receitaModal')
    if (event.target === modal) {
        fecharModal()
    }
})

// INICIALIZAÇÃO
window.onload = function() {
    showCategory('pautas') // 'historico'
    exibirBlocos
}
window.addEventListener('resize', ajustarTamanhoCarta)
