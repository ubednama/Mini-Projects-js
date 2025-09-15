// Unified Terminal Calculator - Synced with UI
const myInput = document.getElementById("myInput");
const allowedOperators = ['/', '*', '-', '+', '.'];
let isEnterPressed = false;
let isError = false;
let lastPressedKey = null;
let currentExpression = '';
let isInteractingWithApp = false;

// Get current cursor line for terminal interaction
function getCurrentCursorLine() {
    return document.querySelector('.line:last-child .cursor');
}

// Update terminal cursor with current expression
function updateTerminalCursor(value) {
    const cursorLine = getCurrentCursorLine();
    if (cursorLine) {
        cursorLine.textContent = value + '_';
    }
}

// Add terminal output line
function addTerminalLine(content, isCommand = false) {
    const terminalOutput = document.querySelector('.terminal-output');
    if (!terminalOutput) return;
    
    const line = document.createElement('div');
    line.className = 'line';
    
    if (isCommand) {
        line.innerHTML = `<span class="prompt">user@calculator:~$</span> <span class="command">${content}</span>`;
    } else {
        line.innerHTML = `<span class="output">${content}</span>`;
    }
    
    // Insert before cursor line
    const cursorLine = terminalOutput.querySelector('.line:last-child');
    if (cursorLine && cursorLine.innerHTML.includes('cursor')) {
        terminalOutput.insertBefore(line, cursorLine);
    } else {
        terminalOutput.appendChild(line);
    }
    
    // Limit terminal messages
    TerminalMessages.limitTerminalMessages();
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

// Main assign function - handles both UI and terminal sync
function assign(value) {
    if (isError) {
        clearInput();
        isError = false;
    }

    if (value === 'AC') {
        clearInput();
        addTerminalLine('clear', true);
        addTerminalLine('Calculator cleared');
        return;
    }
    
    if (value === 'DEL') {
        del();
        addTerminalLine('Deleted last character');
        return;
    }
    
    if (value === '=') {
        calculate();
        return;
    }

    let newValue;
    if (myInput.value === '0' || myInput.value === '') {
        newValue = value;
    } else if (allowedOperators.includes(value) && allowedOperators.includes(lastPressedKey)) {
        newValue = myInput.value.slice(0, -1) + value;
    } else {
        newValue = myInput.value + value;
    }
    
    myInput.value = newValue;
    currentExpression = newValue;
    lastPressedKey = value;
    isInteractingWithApp = true;
    
    // Update terminal cursor to show current expression
    updateTerminalCursor(currentExpression);
}

function clearInput() {
    myInput.value = '';
    currentExpression = '';
    isInteractingWithApp = false;
    updateTerminalCursor('');
}

function del() {
    const newValue = myInput.value.slice(0, -1);
    myInput.value = newValue;
    currentExpression = newValue;
    updateTerminalCursor(currentExpression);
}

function calculate() {
    const expression = myInput.value;
    
    try {
        const result = eval(expression);
        
        // Add calculation to terminal
        addTerminalLine(`${expression} = ${result}`, true);
        
        myInput.value = result;
        currentExpression = '';
        isInteractingWithApp = false;
        updateTerminalCursor('');
    } catch {
        myInput.value = 'ERROR';
        isError = true;
        currentExpression = '';
        isInteractingWithApp = false;
        
        // Add error to terminal
        addTerminalLine(`Error: Invalid expression "${expression}"`, true);
        updateTerminalCursor('');
    }
}

// Enhanced Terminal Commander for Calculator
class CalculatorTerminal {
    static processCommand(command) {
        const cmd = command.toLowerCase().trim();
        
        // System commands with mock responses
        const systemCommands = {
            'whoami': 'ubednama',
            'who': 'ubednama  tty1     2024-01-15 10:30 (:0)',
            'w': `15:25:22 up 2:15, 1 user, load average: 0.15, 0.10, 0.05
USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
ubednama tty1     :0               10:30    2:15m  0.03s  0.01s /usr/bin/calculator`,
            'id': 'uid=1000(ubednama) gid=1000(ubednama) groups=1000(ubednama),4(adm),24(cdrom),27(sudo)',
            'hostname': 'calculator-terminal',
            'uptime': '15:25:22 up 2:15, 1 user, load average: 0.15, 0.10, 0.05',
            'uname -a': 'Linux calculator-terminal 5.15.0-calculator #1 SMP x86_64 GNU/Linux',
            'lscpu': `Architecture:        x86_64
CPU op-mode(s):      32-bit, 64-bit
CPU(s):              4
Thread(s) per core:  2
Core(s) per socket:  2
Socket(s):           1
Model name:          Intel(R) Core(TM) i5-8250U CPU @ 1.60GHz`,
            'free -h': `              total        used        free      shared  buff/cache   available
Mem:          7.7Gi       2.1Gi       3.2Gi       128Mi       2.4Gi       5.1Gi
Swap:         2.0Gi          0B       2.0Gi`,
            'df -h': `Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        20G  8.5G   11G  45% /
tmpfs           3.9G     0  3.9G   0% /dev/shm
/dev/sda2       50G   15G   33G  32% /home`,
            'lsblk': `NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
sda      8:0    0   70G  0 disk 
├─sda1   8:1    0   20G  0 part /
└─sda2   8:2    0   50G  0 part /home`,
            'ip a': `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN
    inet 127.0.0.1/8 scope host lo
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP
    inet 192.168.1.100/24 brd 192.168.1.255 scope global eth0`,
            'netstat -tuln': `Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN
tcp        0      0 127.0.0.1:3000          0.0.0.0:*               LISTEN`,
            'timedatectl': `               Local time: Mon 2024-01-15 15:25:22 UTC
           Universal time: Mon 2024-01-15 15:25:22 UTC
                 RTC time: Mon 2024-01-15 15:25:22
                Time zone: UTC (UTC, +0000)
System clock synchronized: yes`,
            'cat /etc/os-release': `NAME="Calculator Linux"
VERSION="1.0 (Calculator)"
ID=calculator-linux
PRETTY_NAME="Calculator Linux 1.0"`,
            'help': `Calculator Commands:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔢 BASIC OPERATIONS:
  +, -, *, /             → Basic arithmetic operations
  =                      → Calculate result and display
  clear                  → Clear current calculation

🧮 SCIENTIFIC FUNCTIONS:
  sqrt(n)                → Square root of n
  sin(n), cos(n), tan(n) → Trigonometric functions (radians)
  log(n)                 → Base-10 logarithm
  ln(n)                  → Natural logarithm (base e)
  abs(n)                 → Absolute value
  pow(x,y)               → x raised to power y

📐 CONSTANTS:
  pi                     → π (3.14159...)
  e                      → Euler's number (2.71828...)

💡 USAGE EXAMPLES:
  2+3*4                  → Direct calculation
  sqrt(16)               → Returns 4
  sin(pi/2)              → Returns 1
  log(100)               → Returns 2

🖥️  SYSTEM:
  help                   → Show this help message
  back                   → Return to main menu

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
        };
        
        if (systemCommands[cmd]) {
            return systemCommands[cmd];
        }
        
        // App navigation commands
        const apps = {
            'calculator': '../calculator/',
            'tic-tac-toe': '../tic-tac-toe/',
            'weather': '../weather-app/',
            'dictionary': '../dictionary-app/',
            'currency': '../currency-converter/',
            'temperature': '../temperature-converter/',
            'password': '../password-generator/',
            'qr': '../qr-code-generator/',
            'color': '../color-picker/',
            'stopwatch': '../stopwatch/',
            'clock': '../digital-clock/',
            'analog': '../analog-clock/',
            'circle': '../circle-game/',
            'rps': '../rock-paper-scissors/',
            'sign': '../quick-sign/',
            'numbers': '../print-numbers/',
            'quotes': '../bb-quotes-api/',
            'home': '../index.html'
        };
        
        if (apps[cmd]) {
            window.location.href = apps[cmd];
            return null;
        }
        
        if (cmd.startsWith('echo ')) {
            return command.substring(5);
        }
        
        if (cmd === 'clear') {
            this.clearTerminal();
            return null;
        }
        
        return `bash: ${command}: command not found`;
    }
    
    static clearTerminal() {
        const terminalOutput = document.querySelector('.terminal-output');
        if (terminalOutput) {
            // Keep only initialization and calculator, remove command history
            const lines = terminalOutput.querySelectorAll('.line');
            for (let i = 4; i < lines.length - 1; i++) {
                if (lines[i] && !lines[i].querySelector('.calculator-container')) {
                    lines[i].remove();
                }
            }
        }
    }
}

// Global keyboard handler for unified terminal
document.addEventListener('keydown', (e) => {
    // Don't interfere with input fields
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
    }
    
    const cursorLine = getCurrentCursorLine();
    if (!cursorLine) return;
    
    if (e.key === 'Enter') {
        const command = cursorLine.textContent.replace('_', '').trim();
        
        if (isInteractingWithApp || currentExpression) {
            // Enter in calculator context means calculate (=)
            calculate();
        } else if (command) {
            // Process as system command
            addTerminalLine(`${command}`, true);
            const result = CalculatorTerminal.processCommand(command);
            if (result) {
                addTerminalLine(result);
            }
            updateTerminalCursor('');
        }
        e.preventDefault();
    } else if (e.key === 'Backspace') {
        if (isInteractingWithApp) {
            del();
        } else {
            const currentText = cursorLine.textContent.replace('_', '');
            cursorLine.textContent = currentText.slice(0, -1) + '_';
        }
        e.preventDefault();
    } else if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        if (isInteractingWithApp) {
            // Only allow calculator-valid characters when interacting with app
            if (/[0-9+\-*/.=()]/.test(e.key)) {
                assign(e.key);
            }
        } else {
            // Normal terminal typing
            const currentText = cursorLine.textContent.replace('_', '');
            cursorLine.textContent = currentText + e.key + '_';
        }
        e.preventDefault();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    updateTerminalCursor('');
});