// Função para copiar a URL encurtada paraa a área de transferência
function copyToClipboard(url) {
    // Crie um elemento de texto oculto para a seleção
    const copyInput = document.createElement('input');
    copyInput.setAttribute('value', url);
    document.body.appendChild(copyInput);
    copyInput.select();

   
    try {
        document.execCommand('copy');
        alert('URL copiada para a área de transferência!');
    } catch (error) {
        alert('Erro ao copiar a URL. Por favor, copie manualmente.');
    } finally {
        document.body.removeChild(copyInput);
    }
}

// Função para gerar e exibir o QR-CODES 
function generateAndDisplayQRCode(shortenedUrl) {

    const qrCodeContainer = document.createElement('div');
    const qrcode = new QRCode(qrCodeContainer, {
        text: shortenedUrl,
        width: 170, // Aumente o tamanho do QR-CODE
        height: 170,
        margin: 20, // Adicione uma margem ao redor do QR-CODE
    });

    // Estilize o qrCodeContainer para centralizá-lo
    qrCodeContainer.style.display = 'flex';
    qrCodeContainer.style.flexDirection = 'column'; 
    qrCodeContainer.style.justifyContent = 'center';
    qrCodeContainer.style.alignItems = 'center';

    // Adicione um estilo CSS para a borda branca ao redor do QR-CODE
    const qrCodeImage = qrCodeContainer.querySelector('img');
    qrCodeImage.style.border = '4px solid white'; 

    // Remova o contêiner anterior do QR-CODE se existir
    const existingQRCodeContainer = document.getElementById('qrCodeContainer');
    if (existingQRCodeContainer) {
        existingQRCodeContainer.remove();
    }

    // Adicione o novo contêinerr à pagina
    qrCodeContainer.id = 'qrCodeContainer';
    document.getElementById('shortenedUrl').appendChild(qrCodeContainer);

    // Crie um espaço em branco
    const space = document.createElement('div');
    space.style.height = '20px'; // Altura do espaço em branco
    document.getElementById('shortenedUrl').appendChild(space);

    // Crie um botão para baixar o QR-CODE
    const downloadButton = document.createElement('button');
    downloadButton.className = 'btn btn-primary'; // Adicione a classe Bootstrap
    downloadButton.innerHTML = '<i class="fas fa-download"></i> Baixar QR-CODE';

    downloadButton.addEventListener('click', function () {
        // Crie um elemento canvas para desenhar o QR-CODE
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = qrCodeImage.width;
        canvas.height = qrCodeImage.height;
        context.drawImage(qrCodeImage, 0, 0);

        // Crie um link para baixar a imagem PNG
        const downloadLink = document.createElement('a');
        downloadLink.href = canvas.toDataURL('image/png');
        downloadLink.download = 'qrcode.png';

        // Clique automaticamente no link de download
        downloadLink.click();
    });

    // Adicione o botão de download abaixo do espaço em branco
    document.getElementById('shortenedUrl').appendChild(downloadButton);
}



// Evento de envio do formulário
document.getElementById('shortenForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const originalUrl = document.getElementById('originalUrl').value;
    const customShortCode = document.getElementById('customShortCode').value;

    if (customShortCode.trim() === "") {
        alert("Por favor, insira um código personalizado.");
        return;
    }

    if (originalUrl.trim() === "") {
        alert("Por favor, insira uma URL original.");
        return;
    }

    fetch('../../includes/shorten.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ originalUrl, customShortCode }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.error) {
                alert(data.error);
            } else {
                const shortenedUrl = window.location.origin + '/' + data.shortCode;
                const shortenedUrlElement = document.getElementById('shortenedUrl');
                shortenedUrlElement.innerHTML = `
                    <p style="color: #CCCCCC;">URL Encurtada: <a href="${shortenedUrl}" target="_blank" style="color: #FFFFFF;">${shortenedUrl}</a>
                    <button id="copyButton" class="btn btn-primary" onclick="copyToClipboard('${shortenedUrl}')"><i class="fas fa-copy"></i>&nbsp;Copiar</button>
                `;

                // Chame a função para gerar e exibir o QR-CODE
                generateAndDisplayQRCode(shortenedUrl);
            }
        })
        .catch((error) => {
            console.error('Erro:', error);
        });
});
