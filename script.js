async function carregarBlocos() {
    try {
        const response = await fetch('pautas.csv')
        if (!response.ok) {
            throw new Error('Erro ao carregar o arquivo CSV')
        }
        const data = await response.text()
        
        const linhas = data.split('\n').filter(linha => linha.trim() !== '') // Remove linhas vazias
        const receitas = linhas.slice(1).map(linha => {
            const [nome, imagem, item1, item2, categoria, favorito] = linha.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/) // Divide corretamente, mesmo com vírgulas dentro de campos
            return {
                nome: nome.trim(),
                imagem: imagem.trim(),
                item1: item1.trim(),
                item2: item2.trim(),
                categoria: categoria.trim(),
                favorito: favorito.trim() === 'true'
            }
        })
        
        return receitas
    } catch (error) {
        console.error('Erro ao carregar ou processar o arquivo CSV:', error)
        return []
    }
}

function generateCards(receitas, categoria) {
    const container = document.getElementById('container');
    container.innerHTML = ''; // Limpa o container antes de gerar novos cards

    // Filtra as receitas pela categoria selecionada
    const receitasFiltradas = receitas.filter(recipe => recipe.categoria === categoria);

    receitasFiltradas.forEach(recipe => {
        // Criando os elementos HTML dinamicamente
        const card = document.createElement('div');
        card.classList.add('food-card');

        const img = document.createElement('img');
        img.src = `imagens/${recipe.imagem}`; // Adiciona o caminho da pasta "imagens"
        img.alt = recipe.nome;
        img.classList.add('food-image');

        const nome = document.createElement('h3');
        nome.classList.add('food-name');
        nome.textContent = recipe.nome;

        // Adiciona a classe 'favorite' se a receita for favorita
        if (recipe.favorito) {
            card.classList.add('favorite');
        }

        // Adicionando a imagem e o nome ao card
        card.appendChild(img);
        card.appendChild(nome);

        // Evento de clique no card para abrir a modal
        card.addEventListener('click', () => {
            openModal(recipe);
        });

        // Adicionando o card ao container
        container.appendChild(card);
    });

    // Chama a função de ajuste de tamanho após gerar os cards
    adjustCardSize();
}

function adjustCardSize() {
    const screenWidth = window.innerWidth
    const cards = document.querySelectorAll('.food-card')// Seleciona todos os cartões

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

function showCategory(categoria) {
    carregarBlocos().then(receitas => generateCards(receitas, categoria))
}

// Função para abrir a modal com as informações da receita
function openModal(recipe) {
    const modal = document.getElementById('recipeModal');

    document.getElementById('modalNome').textContent = recipe.nome;
    document.getElementById('modalImagem').src = `imagens/${recipe.imagem}`;
    
    /* TROCAR POR DESCRICAO
    //Remoção de aspas ""
    const item1 = recipe.item1.replace(/(^")|("$)/g, '')  
    const item2 = recipe.item2.replace(/(^")|("$)/g, '')

    document.getElementById('modalItem1').textContent = `Item1: ${item1}`; // TROCAR POR DESCRICAO
    document.getElementById('modalItem2').textContent = `Item2: ${item2}`; // TROCAR POR DESCRICAO
    //document.getElementById('modalCategoria').textContent = `Categoria: ${recipe.categoria}`;
    //document.getElementById('modalFavorito').textContent = recipe.favorito ? 'Favorito: Sim' : 'Favorito: Não';
    */
    
    // Exibe a modal
    modal.style.display = 'flex';
}

// Função para fechar a modal
function closeModal() {
    const modal = document.getElementById('recipeModal');
    modal.style.display = 'none';
}

// Fechar a modal quando clicar no botão de fechar ou fora do conteúdo
document.querySelector('.close').addEventListener('click', closeModal); 
window.addEventListener('click', event => {
    const modal = document.getElementById('recipeModal');
    if (event.target === modal) {
        closeModal();
    }
})
carregarBlocos().then(receitas => generateCards(receitas))
window.addEventListener('resize', adjustCardSize)
showCategory('pautas')