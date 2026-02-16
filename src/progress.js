/**
 * Progress Bar Utilities
 */

const chalk = require('chalk');

class ProgressBar {
  constructor(total, label = 'Progress') {
    this.total = total;
    this.current = 0;
    this.label = label;
    this.barLength = 30;
  }

  update(current) {
    this.current = current;
    this.render();
  }

  increment() {
    this.current++;
    this.render();
  }

  render() {
    const percentage = Math.floor((this.current / this.total) * 100);
    const filled = Math.floor((this.current / this.total) * this.barLength);
    const empty = this.barLength - filled;

    const bar = '█'.repeat(filled) + '░'.repeat(empty);
    
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(
      `${chalk.cyan(this.label)}: ${chalk.yellow(bar)} ${chalk.green(percentage + '%')} (${this.current}/${this.total})`
    );

    if (this.current >= this.total) {
      process.stdout.write('\n');
    }
  }

  complete() {
    this.current = this.total;
    this.render();
  }
}

module.exports = { ProgressBar };
