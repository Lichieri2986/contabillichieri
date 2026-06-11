document.addEventListener("DOMContentLoaded", () => {
    const videoContainer = document.getElementById('video-container');
    const playButton = document.getElementById('play-button');

    if (playButton && videoContainer) {
        playButton.addEventListener('click', () => {
            // Injeção do iframe substituindo o conteúdo estático
            videoContainer.innerHTML = `
                <iframe width="100%" height="450" 
                    src="https://www.youtube.com/embed/SEU_ID_DE_VIDEO?autoplay=1" 
                    title="YouTube video player" frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            `;
            videoContainer.style.padding = "0";
            videoContainer.style.border = "none";
        });
    }
   // Lógica do Formulário Inteligente de Captura
    const formCaptura = document.getElementById('form-captura');
    const msgRetorno = document.getElementById('mensagem-retorno');

    if (formCaptura) {
        formCaptura.addEventListener('submit', async (e) => {
            e.preventDefault(); // Impede o recarregamento da página

            // Montagem do Payload JSON
            const payload = {
                nome: document.getElementById('nome').value,
                whatsapp: document.getElementById('whatsapp').value,
                momento: document.getElementById('momento').value,
                faturamento: document.getElementById('faturamento').value
            };

            // UX: Indicador de carregamento
            const btnSubmit = formCaptura.querySelector('button');
            btnSubmit.innerText = 'Enviando...';
            btnSubmit.disabled = true;

            try {
                // Requisição assíncrona para a API local
                const response = await fetch('/api/captura-lead', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (response.ok) {
                    msgRetorno.style.color = '#15803d'; // Verde sucesso
                    msgRetorno.innerText = data.mensagem;
                    formCaptura.reset();
                } else {
                    msgRetorno.style.color = '#b91c1c'; // Vermelho erro
                    msgRetorno.innerText = data.erro || 'Erro ao enviar. Tente novamente.';
                }
            } catch (error) {
                console.error('Erro na requisição AJAX:', error);
                msgRetorno.style.color = '#b91c1c';
                msgRetorno.innerText = 'Erro de conexão. Verifique sua rede.';
            } finally {
                btnSubmit.innerText = 'Solicitar Diagnóstico Gratuito';
                btnSubmit.disabled = false;
            }
        });
    } 
});