(function() {
    function ensureBalance() {
        if (!localStorage.getItem('arcade_balance')) {
            localStorage.setItem('arcade_balance', '1000.00');
        }
    }

    function getBalanceValue() {
        ensureBalance();
        return parseFloat(localStorage.getItem('arcade_balance'));
    }

    function setBalanceValue(amount) {
        ensureBalance();
        const numeric = Number(amount);
        if (!Number.isFinite(numeric)) {
            throw new Error('arcade command expects a valid numeric amount. Example: money(3000)');
        }
        localStorage.setItem('arcade_balance', numeric.toFixed(2));
        syncPageBalance(numeric);
        console.log(`arcade_balance set to $${numeric.toFixed(2)}`);
        return numeric;
    }

    function syncPageBalance(amount) {
        if (typeof window.balance !== 'undefined') {
            window.balance = amount;
        }

        if (typeof window.updateBalanceDisplay === 'function') {
            window.updateBalanceDisplay();
        }
        if (typeof window.updateBalance === 'function') {
            window.updateBalance();
        }

        document.querySelectorAll('#balance, .balance-amount, .balance').forEach(el => {
            el.textContent = `$${amount.toFixed(2)}`;
        });
    }

    function addBalanceValue(amount) {
        const numeric = Number(amount);
        if (!Number.isFinite(numeric)) {
            throw new Error('addMoney expects a valid number. Example: addMoney(500)');
        }
        const newAmount = getBalanceValue() + numeric;
        return setBalanceValue(newAmount);
    }

    function parseCommand(commandString) {
        if (typeof commandString !== 'string') {
            throw new Error('arcadeCommand requires a string input. Example: arcadeCommand("money 3000")');
        }

        const tokens = commandString.trim().split(/\s+/);
        if (tokens.length === 0 || tokens[0] === '') {
            throw new Error('arcadeCommand requires a command. Available commands: money, add, balance, help');
        }

        const commandName = tokens[0].toLowerCase();
        const arg = tokens.slice(1).join(' ');

        if (commandName === 'help' || commandName === 'h') {
            showArcadeConsoleHelp();
            return;
        }

        if (commandName === 'balance' || commandName === 'bal') {
            const current = getBalanceValue();
            console.log(`Current arcade_balance: $${current.toFixed(2)}`);
            return current;
        }

        if (commandName === 'money' || commandName === 'set') {
            if (arg === '') {
                throw new Error('money command requires an amount. Example: arcadeCommand("money 3000")');
            }
            return setBalanceValue(arg);
        }

        if (commandName === 'add' || commandName === 'addmoney' || commandName === 'bonus') {
            if (arg === '') {
                throw new Error('add command requires an amount. Example: arcadeCommand("add 3000")');
            }
            return addBalanceValue(arg);
        }

        throw new Error(`Unknown arcade command: ${commandName}. Use arcadeCommand('help') for available commands.`);
    }

    function showArcadeConsoleHelp() {
        console.log('Arcade Console Commands:');
        console.log('  money(amount)         - Set your wallet balance to the specified amount.');
        console.log('  addMoney(amount)      - Add the specified amount to your wallet.');
        console.log('  arcadeCommand(cmd)     - Run a text command like "money 3000" or "add 500".');
        console.log('  arcadeCommand("balance") - Display the current wallet balance.');
        console.log('Examples:');
        console.log('  money(3000);');
        console.log('  addMoney(500);');
        console.log('  arcadeCommand("money 3000");');
        console.log('  arcadeCommand("add 500");');
    }

    window.money = function(amount) {
        return setBalanceValue(amount);
    };

    window.addMoney = function(amount) {
        return addBalanceValue(amount);
    };

    window.arcadeCommand = function(commandString) {
        return parseCommand(commandString);
    };

    window.arcadeCommandHelp = showArcadeConsoleHelp;
    window.arcadeCheatHelp = showArcadeConsoleHelp;

    ensureBalance();
    syncPageBalance(getBalanceValue());
})();
