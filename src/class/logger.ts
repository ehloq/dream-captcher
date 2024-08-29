import chalk from 'chalk';

// Forzar la habilitación de colores
chalk.level = 3;

class Logger {
    constructor() {}

    private log(message: string, color: any): void {
        console.log(color(message));
    }

    error(message: string): void {
        this.log(`[ERROR] ${message}`, chalk.red);
    }

    info(message: string): void {
        this.log(`[INFO] ${message}`, chalk.blue);
    }

    alert(message: string): void {
        this.log(`[ALERT] ${message}`, chalk.yellow);
    }

    success(message: string): void {
        this.log(`[SUCCESS] ${message}`, chalk.green);
    }

    neutral(message: string): void {
        this.log(`[NEUTRAL] ${message}`, chalk.gray);
    }
}

export default Logger;