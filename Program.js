document.addEventListener('DOMContentLoaded', () => {
    const addItemButton = document.querySelector('.add');
    const itemInput = document.querySelector('.input');
    const listContainer = document.querySelector('.list-container');
    const summaryContainer = document.querySelector('.summary-container');

    const initialItems = [
        { name: 'Помідори', quantity: 2, bought: true },
        { name: 'Печиво', quantity: 2, bought: false },
        { name: 'Сир', quantity: 1, bought: false }
    ];

    initialItems.forEach(item => addItem(item.name, item.quantity, item.bought));

    addItemButton.addEventListener('click', () => {
        const itemName = itemInput.value.trim();
        if (itemName) {
            addItem(itemName, 1, false);
            itemInput.value = '';
            itemInput.focus();
        }
    });

    itemInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addItemButton.click();
        }
    });

    function addItem(name, quantity, bought) {
        const productTab = document.createElement('div');
        productTab.className = 'product-tab';

        const prodName = document.createElement('div');
        prodName.className = 'prod-name';
        const nameSpan = document.createElement('span');
        nameSpan.className = 'item-name';
        nameSpan.textContent = name;
        if (bought) {
            nameSpan.classList.add('bought');
        }
        nameSpan.addEventListener('click', () => editName(nameSpan));
        prodName.appendChild(nameSpan);

        const prodQuantity = document.createElement('div');
        prodQuantity.className = 'prod-quantity';
        const quantitySpan = document.createElement('span');
        quantitySpan.className = 'item-quantity';
        quantitySpan.textContent = quantity;
        if (!bought) {
            const decButton = document.createElement('button');
            decButton.className = 'quantity-dec';
            decButton.dataset.tooltip = 'Зменшити';
            decButton.textContent = '-';
            decButton.disabled = quantity <= 1;
            decButton.addEventListener('click', () => updateQuantity(nameSpan, -1));

            const incButton = document.createElement('button');
            incButton.className = 'quantity-inc';
            incButton.dataset.tooltip = 'Збільшити';
            incButton.textContent = '+';
            incButton.addEventListener('click', () => updateQuantity(nameSpan, 1));

            prodQuantity.appendChild(decButton);
            prodQuantity.appendChild(quantitySpan);
            prodQuantity.appendChild(incButton);
        } else {
            prodQuantity.appendChild(quantitySpan);
        }

        const prodBuy = document.createElement('div');
        prodBuy.className = 'prod-buy';
        const buyButton = document.createElement('button');
        buyButton.className = 'buy';
        buyButton.dataset.tooltip = bought ? 'Позначити як не куплене' : 'Позначити як куплене';
        buyButton.textContent = bought ? 'NOT Куплено' : 'Куплено';
        buyButton.addEventListener('click', () => toggleBought(nameSpan));

        prodBuy.appendChild(buyButton);
        if (!bought) {
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete';
            deleteButton.dataset.tooltip = 'Видалити';
            deleteButton.textContent = '✖';
            deleteButton.addEventListener('click', () => removeItem(productTab));

            prodBuy.appendChild(deleteButton);
        }

        productTab.appendChild(prodName);
        productTab.appendChild(prodQuantity);
        productTab.appendChild(prodBuy);

        listContainer.appendChild(productTab);
        updateSummary();
    }

    function updateQuantity(itemNameSpan, change) {
        const productTab = itemNameSpan.closest('.product-tab');
        const quantitySpan = productTab.querySelector('.item-quantity');
        let quantity = parseInt(quantitySpan.textContent);
        quantity += change;
        quantitySpan.textContent = quantity;
        productTab.querySelector('.quantity-dec').disabled = quantity <= 1;
        updateSummary();
    }

    function toggleBought(itemNameSpan) {
        const productTab = itemNameSpan.closest('.product-tab');
        const bought = productTab.querySelector('.item-name').classList.toggle('bought');
        const buyButton = productTab.querySelector('.buy');
        buyButton.textContent = bought ? 'NOT Куплено' : 'Куплено';
        buyButton.dataset.tooltip = bought ? 'Позначити як не куплене' : 'Позначити як куплене';
        if (bought) {
            productTab.querySelector('.prod-quantity').innerHTML = `<span class="item-quantity">${productTab.querySelector('.item-quantity').textContent}</span>`;
            productTab.querySelector('.delete').remove();
        } else {
            addEditButtons(productTab);
        }
        updateSummary();
    }

    function addEditButtons(productTab) {
        const itemName = productTab.querySelector('.item-name').textContent;
        const quantitySpan = productTab.querySelector('.item-quantity');
        const quantity = parseInt(quantitySpan.textContent);
        const prodQuantity = productTab.querySelector('.prod-quantity');
        prodQuantity.innerHTML = '';

        const decButton = document.createElement('button');
        decButton.className = 'quantity-dec';
        decButton.dataset.tooltip = 'Зменшити';
        decButton.textContent = '-';
        decButton.disabled = quantity <= 1;
        decButton.addEventListener('click', () => updateQuantity(productTab.querySelector('.item-name'), -1));
        prodQuantity.appendChild(decButton);

        prodQuantity.appendChild(quantitySpan);

        const incButton = document.createElement('button');
        incButton.className = 'quantity-inc';
        incButton.dataset.tooltip = 'Збільшити';
        incButton.textContent = '+';
        incButton.addEventListener('click', () => updateQuantity(productTab.querySelector('.item-name'), 1));
        prodQuantity.appendChild(incButton);

        const prodBuy = productTab.querySelector('.prod-buy');
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete';
        deleteButton.dataset.tooltip = 'Видалити';
        deleteButton.textContent = '✖';
        deleteButton.addEventListener('click', () => removeItem(productTab));
        prodBuy.appendChild(deleteButton);
    }

    function removeItem(productTab) {
        productTab.remove();
        updateSummary();
    }

    function updateSummary() {
        const toBuy = [];
        const bought = [];
        document.querySelectorAll('.product-tab').forEach(tab => {
            const itemName = tab.querySelector('.item-name').textContent;
            const itemQuantity = parseInt(tab.querySelector('.item-quantity').textContent);
            if (tab.querySelector('.item-name').classList.contains('bought')) {
                bought.push({ name: itemName, quantity: itemQuantity });
            } else {
                toBuy.push({ name: itemName, quantity: itemQuantity });
            }
        });

        const summaryLeft = summaryContainer.querySelector('.sum-item');
        const summaryBought = summaryContainer.querySelector('.sum-item-bought');

        summaryLeft.innerHTML = '';
        toBuy.forEach(item => {
            const productItem = document.createElement('span');
            productItem.className = 'product-item';
            productItem.textContent = item.name;
            const amount = document.createElement('span');
            amount.className = 'amount';
            amount.textContent = item.quantity;
            productItem.appendChild(amount);
            summaryLeft.appendChild(productItem);
        });

        summaryBought.innerHTML = '';
        bought.forEach(item => {
            const productItem = document.createElement('span');
            productItem.className = 'product-item';
            productItem.textContent = item.name;
            const amount = document.createElement('span');
            amount.className = 'amount';
            amount.textContent = item.quantity;
            productItem.appendChild(amount);
            summaryBought.appendChild(productItem);
        });
    }

    function editName(nameSpan) {
        const currentName = nameSpan.textContent;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentName;
        input.className = 'name-input';
        nameSpan.replaceWith(input);
        input.focus();

        input.addEventListener('blur', () => {
            nameSpan.textContent = input.value.trim() || currentName;
            input.replaceWith(nameSpan);
            updateSummary();
        });

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                input.blur();
            }
        });
    }
});
