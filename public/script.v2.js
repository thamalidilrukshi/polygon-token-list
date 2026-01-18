document.addEventListener('DOMContentLoaded', () => {
    const tokenListContainer = document.getElementById('token-list');
    const searchBox = document.getElementById('search-box');
    const connectWalletBtn = document.getElementById('connect-wallet-btn');
    let tokens = [];
    let provider;
    let signer;

    // Wallet Connection
    connectWalletBtn.addEventListener('click', async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                provider = new ethers.providers.Web3Provider(window.ethereum);
                signer = provider.getSigner();
                const address = await signer.getAddress();
                connectWalletBtn.textContent = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
                alert('Wallet connected successfully!');
            } catch (error) {
                console.error("User rejected request", error);
            }
        } else {
            alert('Please install MetaMask!');
        }
    });

    const remoteTokenListUrl = 'https://raw.githubusercontent.com/0xPolygon/polygon-token-list/main/polygonTokenList.json';
    const localTokenListUrl = 'tokens.json';

    // Function to fetch tokens
    const fetchTokens = (url, isFallback) => {
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                tokens = isFallback ? data : data.tokens;
                displayTokens(tokens);
            })
            .catch(error => {
                if (isFallback) {
                    console.error('Error fetching local token list:', error);
                    tokenListContainer.innerHTML = '<p>Failed to load token list. Please try again later.</p>';
                } else {
                    console.warn('Remote token list failed, falling back to local list.');
                    fetchTokens(localTokenListUrl, true);
                }
            });
    };

    // Initial fetch
    fetchTokens(remoteTokenListUrl, false);

    // Function to highlight search term
    function getHighlightedText(text, highlight) {
        if (!highlight) return text;
        const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
        return parts.map(part => 
            part.toLowerCase() === highlight.toLowerCase() ? 
            `<span class="highlight">${part}</span>` : 
            part
        ).join('');
    }

    // Function to display tokens
    function displayTokens(tokenArray, searchTerm = '') {
        tokenListContainer.innerHTML = '';
        tokenArray.forEach(token => {
            const tokenItem = document.createElement('div');
            tokenItem.className = 'token-item';

            // Main click action opens PolygonScan
            tokenItem.addEventListener('click', () => {
                window.open(`https://polygonscan.com/token/${token.address}`, '_blank');
            });

            const tokenLogo = document.createElement('img');
            tokenLogo.className = 'token-logo';
            tokenLogo.src = token.logoURI;
            tokenLogo.onerror = () => { tokenLogo.src = 'https://via.placeholder.com/36'; }; // Fallback image

            const tokenInfo = document.createElement('div');
            tokenInfo.className = 'token-info';

            const tokenName = document.createElement('div');
            tokenName.className = 'token-name';
            tokenName.innerHTML = getHighlightedText(token.name, searchTerm);

            const tokenSymbol = document.createElement('div');
            tokenSymbol.className = 'token-symbol';
            tokenSymbol.innerHTML = getHighlightedText(token.symbol, searchTerm);
            
            tokenInfo.appendChild(tokenName);
            tokenInfo.appendChild(tokenSymbol);

            // Create a dedicated copy button
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-button';
            copyButton.textContent = 'Copy';
            
            const copyFeedback = document.createElement('span');
            copyFeedback.className = 'copy-feedback';
            copyFeedback.textContent = 'Copied!';
            copyButton.appendChild(copyFeedback);

            copyButton.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent the main click event from firing
                navigator.clipboard.writeText(token.address).then(() => {
                    copyFeedback.style.opacity = 1;
                    setTimeout(() => {
                       copyFeedback.style.opacity = 0;
                    }, 1000);
                }).catch(err => console.error('Failed to copy address:', err));
            });
            
            tokenItem.appendChild(tokenLogo);
            tokenItem.appendChild(tokenInfo);
            tokenItem.appendChild(copyButton);

            tokenListContainer.appendChild(tokenItem);
        });
    }

    // Search functionality
    searchBox.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredTokens = tokens.filter(token => 
            token.name.toLowerCase().includes(searchTerm) || 
            token.symbol.toLowerCase().includes(searchTerm)
        );
        displayTokens(filteredTokens, searchTerm);
    });
});